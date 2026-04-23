import { App, TFile, MetadataCache, Vault, Notice } from "obsidian";
import { LLMService } from "./llmService";

export interface ConceptInfo {
  name: string;
  type: "core" | "bridge" | "leaf";
  occurrences: number;
  inLinks: number;
  outLinks: number;
  relatedConcepts: string[];
  filePaths: string[];
  definition?: string;
}

export interface ImplicitLink {
  text: string;
  target: string;
  position: number;
}

interface AIConceptResult {
  concepts: {
    name: string;
    definition: string;
    type: "core" | "bridge" | "leaf";
    relatedTo: string[];
  }[];
}

interface AIImplicitLinkResult {
  implicitLinks: {
    text: string;
    suggestedTarget: string;
    reason: string;
  }[];
}

export class ConceptExtractor {
  private app: App;
  private settings: { knowledgeBasePath: string; mocTemplate: string };
  private llm: LLMService | null = null;

  constructor(app: App, settings: { knowledgeBasePath: string; mocTemplate: string }, llm?: LLMService) {
    this.app = app;
    this.settings = settings;
    this.llm = llm || null;
  }

  setLLM(llm: LLMService): void {
    this.llm = llm;
  }

  async extractFromContent(content: string, filePath: string): Promise<ConceptInfo[]> {
    if (this.llm) {
      return this.aiExtractConcepts(content, filePath);
    }
    return this.ruleExtractConcepts(content, filePath);
  }

  private async aiExtractConcepts(content: string, filePath: string): Promise<ConceptInfo[]> {
    const body = this.stripFrontmatter(content);
    const truncated = body.substring(0, 3000);

    const messages = [
      {
        role: "system" as const,
        content: `你是一个知识图谱构建专家。你的任务是从给定的笔记内容中提取核心概念和实体。

规则：
1. 识别笔记中提到的所有重要概念、实体、术语
2. 为每个概念提供简短定义（一句话）
3. 判断概念类型：core（核心概念，文章主题）、bridge（桥梁概念，连接多个概念）、leaf（叶子概念，边缘提及）
4. 识别概念间的关联关系
5. 输出严格的 JSON 格式`,
      },
      {
        role: "user" as const,
        content: `请从以下笔记中提取概念：

---
文件路径: ${filePath}
笔记内容:
${truncated}
---

请输出 JSON 格式：
{
  "concepts": [
    {
      "name": "概念名称",
      "definition": "一句话定义",
      "type": "core|bridge|leaf",
      "relatedTo": ["相关概念1", "相关概念2"]
    }
  ]
}`,
      },
    ];

    try {
      const result = await this.llm!.chatJSON<AIConceptResult>(messages);
      const conceptMap = new Map<string, ConceptInfo>();

      for (const c of result.concepts) {
        conceptMap.set(c.name, {
          name: c.name,
          type: c.type,
          occurrences: 1,
          inLinks: 0,
          outLinks: c.relatedTo.length,
          relatedConcepts: c.relatedTo,
          filePaths: [filePath],
          definition: c.definition,
        });
      }

      const ruleConcepts = this.ruleExtractConcepts(content, filePath);
      for (const rc of ruleConcepts) {
        if (!conceptMap.has(rc.name)) {
          conceptMap.set(rc.name, rc);
        } else {
          const existing = conceptMap.get(rc.name)!;
          existing.occurrences += rc.occurrences;
          existing.outLinks += rc.outLinks;
        }
      }

      return Array.from(conceptMap.values());
    } catch (error) {
      new Notice(`AI 概念提取失败，回退到规则模式: ${error instanceof Error ? error.message : String(error)}`);
      return this.ruleExtractConcepts(content, filePath);
    }
  }

  private ruleExtractConcepts(content: string, filePath: string): ConceptInfo[] {
    const wikilinkRegex = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g;
    const tagRegex = /#([a-zA-Z\u4e00-\u9fff][\w/\u4e00-\u9fff-]*)/g;
    const headingRegex = /^#{1,3}\s+(.+)$/gm;

    const conceptMap = new Map<string, ConceptInfo>();

    let match: RegExpExecArray | null;
    while ((match = wikilinkRegex.exec(content)) !== null) {
      const name = match[1].trim();
      this.addToConceptMap(conceptMap, name, filePath, "outLink");
    }

    while ((match = tagRegex.exec(content)) !== null) {
      const name = match[1].trim();
      this.addToConceptMap(conceptMap, `tag:${name}`, filePath, "occurrence");
    }

    while ((match = headingRegex.exec(content)) !== null) {
      const name = match[1].trim();
      this.addToConceptMap(conceptMap, name, filePath, "occurrence");
    }

    const concepts = Array.from(conceptMap.values());
    this.classifyConcepts(concepts);
    return concepts;
  }

  private addToConceptMap(map: Map<string, ConceptInfo>, name: string, filePath: string, linkType: string): void {
    const existing = map.get(name);
    if (existing) {
      existing.occurrences += 1;
      if (!existing.filePaths.includes(filePath)) {
        existing.filePaths.push(filePath);
      }
      if (linkType === "outLink") {
        existing.outLinks += 1;
      }
    } else {
      map.set(name, {
        name,
        type: "leaf",
        occurrences: 1,
        inLinks: 0,
        outLinks: linkType === "outLink" ? 1 : 0,
        relatedConcepts: [],
        filePaths: [filePath],
      });
    }
  }

  private classifyConcepts(concepts: ConceptInfo[]): void {
    for (const concept of concepts) {
      if (concept.occurrences >= 5 || concept.inLinks >= 3) {
        concept.type = "core";
      } else if (concept.occurrences >= 2 || concept.inLinks >= 1) {
        concept.type = "bridge";
      } else {
        concept.type = "leaf";
      }
    }
  }

  async scanVault(): Promise<ConceptInfo[]> {
    const files = this.app.vault.getMarkdownFiles();
    const globalConceptMap = new Map<string, ConceptInfo>();

    for (const file of files) {
      if (!file.path.startsWith(this.settings.knowledgeBasePath) && this.settings.knowledgeBasePath !== "/") {
        continue;
      }
      const content = await this.app.vault.read(file);
      const concepts = await this.extractFromContent(content, file.path);
      for (const concept of concepts) {
        const existing = globalConceptMap.get(concept.name);
        if (existing) {
          existing.occurrences += concept.occurrences;
          existing.outLinks += concept.outLinks;
          for (const fp of concept.filePaths) {
            if (!existing.filePaths.includes(fp)) {
              existing.filePaths.push(fp);
            }
          }
          if (concept.definition && !existing.definition) {
            existing.definition = concept.definition;
          }
          for (const rc of concept.relatedConcepts) {
            if (!existing.relatedConcepts.includes(rc)) {
              existing.relatedConcepts.push(rc);
            }
          }
        } else {
          globalConceptMap.set(concept.name, { ...concept });
        }
      }
    }

    this.computeInLinks(globalConceptMap);
    this.buildRelations(globalConceptMap);

    const concepts = Array.from(globalConceptMap.values());
    this.classifyConcepts(concepts);
    return concepts;
  }

  private computeInLinks(conceptMap: Map<string, ConceptInfo>): void {
    const cache: MetadataCache = this.app.metadataCache;
    const files = this.app.vault.getMarkdownFiles();
    for (const file of files) {
      const cacheEntry = cache.getFileCache(file);
      if (cacheEntry?.links) {
        for (const link of cacheEntry.links) {
          const target = link.link.replace(/#.*/, "").replace(/\.md$/, "");
          const concept = conceptMap.get(target);
          if (concept) {
            concept.inLinks += 1;
          }
        }
      }
    }
  }

  private buildRelations(conceptMap: Map<string, ConceptInfo>): void {
    const files = this.app.vault.getMarkdownFiles();
    for (const file of files) {
      const cacheEntry = this.app.metadataCache.getFileCache(file);
      if (!cacheEntry?.links) continue;
      const linkedConcepts: string[] = [];
      for (const link of cacheEntry.links) {
        const target = link.link.replace(/#.*/, "").replace(/\.md$/, "");
        if (conceptMap.has(target)) {
          linkedConcepts.push(target);
        }
      }
      for (let i = 0; i < linkedConcepts.length; i++) {
        for (let j = i + 1; j < linkedConcepts.length; j++) {
          const a = conceptMap.get(linkedConcepts[i]);
          const b = conceptMap.get(linkedConcepts[j]);
          if (a && !a.relatedConcepts.includes(linkedConcepts[j])) {
            a.relatedConcepts.push(linkedConcepts[j]);
          }
          if (b && !b.relatedConcepts.includes(linkedConcepts[i])) {
            b.relatedConcepts.push(linkedConcepts[i]);
          }
        }
      }
    }
  }

  async findImplicitLinks(content: string, filePath: string): Promise<ImplicitLink[]> {
    if (this.llm) {
      return this.aiFindImplicitLinks(content, filePath);
    }
    return this.ruleFindImplicitLinks(content, filePath);
  }

  private async aiFindImplicitLinks(content: string, filePath: string): Promise<ImplicitLink[]> {
    const body = this.stripFrontmatter(content);
    const truncated = body.substring(0, 3000);

    const allFiles = this.app.vault.getMarkdownFiles();
    const existingNotes = allFiles.map((f) => f.basename).filter((n) => n.length >= 2);
    const noteList = existingNotes.slice(0, 100).join(", ");

    const messages = [
      {
        role: "system" as const,
        content: `你是一个知识图谱专家。你的任务是发现笔记中"提到但未链接"的概念——即隐含链接。

规则：
1. 找出笔记中提到但没有用 [[双链]] 包裹的概念
2. 这些概念应该能在 vault 已有笔记中找到对应
3. 每个建议都要说明为什么应该链接
4. 输出严格的 JSON 格式`,
      },
      {
        role: "user" as const,
        content: `请从以下笔记中发现隐含链接：

---
当前笔记: ${filePath}
Vault 中已有笔记（部分）: ${noteList}

笔记内容:
${truncated}
---

请输出 JSON 格式：
{
  "implicitLinks": [
    {
      "text": "原文中提到的文本",
      "suggestedTarget": "建议链接到的笔记名",
      "reason": "为什么应该链接"
    }
  ]
}`,
      },
    ];

    try {
      const result = await this.llm!.chatJSON<AIImplicitLinkResult>(messages);
      return result.implicitLinks.map((l) => ({
        text: l.text,
        target: l.suggestedTarget,
        position: 0,
      }));
    } catch (error) {
      new Notice(`AI 隐含链接发现失败，回退到规则模式`);
      return this.ruleFindImplicitLinks(content, filePath);
    }
  }

  private async ruleFindImplicitLinks(content: string, filePath: string): Promise<ImplicitLink[]> {
    const suggestions: ImplicitLink[] = [];
    const existingLinks = new Set<string>();

    const wikilinkRegex = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g;
    let match: RegExpExecArray | null;
    while ((match = wikilinkRegex.exec(content)) !== null) {
      existingLinks.add(match[1].trim());
    }

    const allFiles = this.app.vault.getMarkdownFiles();
    const fileNames = new Map<string, string>();
    for (const file of allFiles) {
      const name = file.basename;
      fileNames.set(name.toLowerCase(), name);
    }

    for (const [lowerName, originalName] of fileNames) {
      if (existingLinks.has(originalName)) continue;
      if (lowerName.length < 2) continue;

      const regex = new RegExp(escapeRegExp(originalName), "gi");
      while ((match = regex.exec(content)) !== null) {
        suggestions.push({
          text: match[0],
          target: originalName,
          position: match.index,
        });
      }
    }

    return suggestions;
  }

  async generateMOC(concept: ConceptInfo): Promise<void> {
    const vault: Vault = this.app.vault;
    const basePath = this.settings.knowledgeBasePath === "/" ? "" : this.settings.knowledgeBasePath;
    const mocPath = `${basePath}MOC/${concept.name}.md`;

    let summary = `${concept.name}的知识索引，包含${concept.relatedConcepts.length}个关联概念`;
    if (this.llm && concept.definition) {
      summary = concept.definition;
    } else if (this.llm) {
      try {
        const aiSummary = await this.llm.chat([
          {
            role: "system",
            content: "你是一个知识管理专家。用一句话概括给定概念，不超过50字。",
          },
          {
            role: "user",
            content: `请概括概念: ${concept.name}`,
          },
        ]);
        summary = aiSummary;
      } catch {
        // fallback to default
      }
    }

    const children = concept.relatedConcepts.map((r) => `- [[${r}]] — `).join("\n");
    const related = concept.filePaths.map((f) => `- [[${f.replace(/\.md$/, "")}]]`).join("\n");

    const content = this.settings.mocTemplate
      .replace(/\{\{title\}\}/g, concept.name)
      .replace(/\{\{aliases\}\}/g, concept.name)
      .replace(/\{\{tag\}\}/g, concept.name)
      .replace(/\{\{date\}\}/g, new Date().toISOString().split("T")[0])
      .replace(/\{\{summary\}\}/g, summary)
      .replace(/\{\{children\}\}/g, children)
      .replace(/\{\{related\}\}/g, related);

    const dir = mocPath.substring(0, mocPath.lastIndexOf("/"));
    if (dir && !(await vault.adapter.exists(dir))) {
      await vault.adapter.mkdir(dir);
    }

    if (await vault.adapter.exists(mocPath)) {
      const existing = await vault.adapter.read(mocPath);
      const updated = this.mergeMOC(existing, content);
      await vault.adapter.write(mocPath, updated);
    } else {
      await vault.adapter.write(mocPath, content);
    }
  }

  private mergeMOC(existing: string, newContent: string): string {
    const existingLinks = new Set<string>();
    const linkRegex = /\[\[([^\]|]+?)(?:\|[^\]]+)?\]\]/g;
    let match: RegExpExecArray | null;
    while ((match = linkRegex.exec(existing)) !== null) {
      existingLinks.add(match[1]);
    }

    const newLinkMatches = [...newContent.matchAll(linkRegex)];
    const additionalLinks: string[] = [];
    for (const m of newLinkMatches) {
      if (!existingLinks.has(m[1])) {
        additionalLinks.push(`- [[${m[1]}]]`);
      }
    }

    if (additionalLinks.length === 0) return existing;

    const insertPoint = existing.lastIndexOf("## 相关笔记");
    if (insertPoint === -1) {
      return existing + "\n\n## 新增关联\n" + additionalLinks.join("\n");
    }

    return existing.slice(0, insertPoint) + "## 新增关联\n" + additionalLinks.join("\n") + "\n\n" + existing.slice(insertPoint);
  }

  async generateConceptReport(concepts: ConceptInfo[]): Promise<void> {
    const vault: Vault = this.app.vault;
    const basePath = this.settings.knowledgeBasePath === "/" ? "" : this.settings.knowledgeBasePath;
    const reportPath = `${basePath}知识图谱报告.md`;

    const sorted = concepts.sort((a, b) => b.occurrences - a.occurrences);
    const core = sorted.filter((c) => c.type === "core");
    const bridge = sorted.filter((c) => c.type === "bridge");
    const leaf = sorted.filter((c) => c.type === "leaf");

    let report = `# 知识图谱扫描报告\n\n生成时间: ${new Date().toLocaleString("zh-CN")}\n\n`;
    report += `## 统计概览\n\n`;
    report += `- 总概念数: ${concepts.length}\n`;
    report += `- 核心概念: ${core.length}\n`;
    report += `- 桥梁概念: ${bridge.length}\n`;
    report += `- 叶子概念: ${leaf.length}\n\n`;

    report += `## 核心概念\n\n| 概念 | 定义 | 出现次数 | 入链 | 出链 | 关联数 |\n|------|------|---------|------|------|--------|\n`;
    for (const c of core) {
      const def = c.definition ? c.definition.substring(0, 30) : "-";
      report += `| [[${c.name}]] | ${def} | ${c.occurrences} | ${c.inLinks} | ${c.outLinks} | ${c.relatedConcepts.length} |\n`;
    }

    report += `\n## 概念关系图\n\n\`\`\`mermaid\ngraph TD\n`;
    for (const c of core.slice(0, 10)) {
      for (const r of c.relatedConcepts.slice(0, 3)) {
        report += `    ${sanitizeMermaid(c.name)} --> ${sanitizeMermaid(r)}\n`;
      }
    }
    report += `\`\`\`\n`;

    const dir = reportPath.substring(0, reportPath.lastIndexOf("/"));
    if (dir && !(await vault.adapter.exists(dir))) {
      await vault.adapter.mkdir(dir);
    }
    await vault.adapter.write(reportPath, report);
  }

  private stripFrontmatter(content: string): string {
    if (!content.startsWith("---")) return content;
    const endIdx = content.indexOf("---", 3);
    if (endIdx === -1) return content;
    return content.substring(endIdx + 3).trim();
  }
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function sanitizeMermaid(str: string): string {
  return str.replace(/[^a-zA-Z0-9\u4e00-\u9fff]/g, "_");
}
