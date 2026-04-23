import { App, TFile, MetadataCache, Vault, Notice } from "obsidian";
import { LLMService } from "./llmService";

export interface TagSuggestion {
  tag: string;
  reason: string;
  category: "domain" | "type" | "status";
}

export interface AnalysisResult {
  tags: TagSuggestion[];
  summary: string;
  keywords: string[];
  domain: string;
  contentType: string;
  relatedNotes: { path: string; reason: string; strength: "strong" | "weak" }[];
}

interface AIAnalysisResult {
  summary: string;
  keywords: string[];
  domain: string;
  contentType: string;
  tags: {
    tag: string;
    reason: string;
    category: "domain" | "type" | "status";
  }[];
  relatedConcepts: string[];
}

export class SmartTagger {
  private app: App;
  private settings: { knowledgeBasePath: string; autoTagEnabled: boolean; summaryMaxLength: number; tagHierarchy: string[] };
  private llm: LLMService | null = null;

  constructor(
    app: App,
    settings: { knowledgeBasePath: string; autoTagEnabled: boolean; summaryMaxLength: number; tagHierarchy: string[] },
    llm?: LLMService
  ) {
    this.app = app;
    this.settings = settings;
    this.llm = llm || null;
  }

  setLLM(llm: LLMService): void {
    this.llm = llm;
  }

  async analyzeAndGenerate(content: string, filePath: string): Promise<AnalysisResult> {
    const existingTags = this.extractExistingTags(content);

    if (this.llm) {
      return this.aiAnalyze(content, filePath, existingTags);
    }
    return this.ruleAnalyze(content, filePath, existingTags);
  }

  private async aiAnalyze(content: string, filePath: string, existingTags: string[]): Promise<AnalysisResult> {
    const body = this.stripFrontmatter(content);
    const truncated = body.substring(0, 3000);

    const allFiles = this.app.vault.getMarkdownFiles();
    const existingNotes = allFiles.map((f) => f.basename).filter((n) => n.length >= 2);
    const noteList = existingNotes.slice(0, 50).join(", ");

    const messages = [
      {
        role: "system" as const,
        content: `你是一个知识管理专家。你的任务是分析笔记内容，生成标签、摘要和关联推荐。

规则：
1. 生成层级标签，格式为 领域/子领域/具体（如 psychology/cognitive/load-theory）
2. 生成类型标签：type/concept（概念）、type/howto（方法）、type/case（案例）、type/reflection（反思）、type/reference（参考）
3. 生成状态标签：status/seed（刚创建）、status/sprout（有内容）、status/evergreen（成熟）
4. 摘要不超过${this.settings.summaryMaxLength}字，独立可读
5. 关键词提取5个最重要的
6. 识别与 vault 中已有笔记的关联
7. 输出严格的 JSON 格式`,
      },
      {
        role: "user" as const,
        content: `请分析以下笔记：

---
文件路径: ${filePath}
已有标签: ${existingTags.join(", ") || "无"}
Vault 中已有笔记（部分）: ${noteList}

笔记内容:
${truncated}
---

请输出 JSON 格式：
{
  "summary": "一句话摘要",
  "keywords": ["关键词1", "关键词2", "关键词3", "关键词4", "关键词5"],
  "domain": "领域",
  "contentType": "concept|howto|case|reflection|reference",
  "tags": [
    {"tag": "领域/子领域", "reason": "原因", "category": "domain"},
    {"tag": "type/xxx", "reason": "原因", "category": "type"},
    {"tag": "status/xxx", "reason": "原因", "category": "status"}
  ],
  "relatedConcepts": ["相关概念1", "相关概念2"]
}`,
      },
    ];

    try {
      const aiResult = await this.llm!.chatJSON<AIAnalysisResult>(messages);

      const tags: TagSuggestion[] = aiResult.tags.filter((t) => !existingTags.includes(t.tag));

      const relatedNotes = await this.findRelatedNotes(content, filePath, aiResult.keywords, existingTags);

      const aiRelated = aiResult.relatedConcepts
        .filter((c) => !relatedNotes.some((r) => r.path.includes(c)))
        .slice(0, 3)
        .map((c) => ({
          path: c,
          reason: `AI 语义关联: ${c}`,
          strength: "weak" as const,
        }));

      return {
        tags,
        summary: aiResult.summary,
        keywords: aiResult.keywords,
        domain: aiResult.domain,
        contentType: aiResult.contentType,
        relatedNotes: [...relatedNotes, ...aiRelated],
      };
    } catch (error) {
      new Notice(`AI 标签生成失败，回退到规则模式: ${error instanceof Error ? error.message : String(error)}`);
      return this.ruleAnalyze(content, filePath, existingTags);
    }
  }

  private async ruleAnalyze(content: string, filePath: string, existingTags: string[]): Promise<AnalysisResult> {
    const keywords = this.extractKeywords(content);
    const domain = this.detectDomain(content, keywords);
    const contentType = this.detectContentType(content);
    const tags = this.generateTags(content, keywords, domain, contentType, existingTags);
    const summary = this.generateSummary(content, keywords);
    const relatedNotes = await this.findRelatedNotes(content, filePath, keywords, existingTags);

    return {
      tags,
      summary,
      keywords,
      domain,
      contentType,
      relatedNotes,
    };
  }

  private extractExistingTags(content: string): string[] {
    const tags: string[] = [];
    const frontmatter = this.parseFrontmatter(content);

    if (frontmatter.tags) {
      const tagValue = frontmatter.tags;
      if (Array.isArray(tagValue)) {
        tags.push(...tagValue.map(String));
      } else if (typeof tagValue === "string") {
        tags.push(...tagValue.split(",").map((t) => t.trim()));
      }
    }

    const inlineTagRegex = /(?:^|\s)#([a-zA-Z\u4e00-\u9fff][\w/\u4e00-\u9fff-]*)/g;
    let match: RegExpExecArray | null;
    while ((match = inlineTagRegex.exec(content)) !== null) {
      if (!tags.includes(match[1])) {
        tags.push(match[1]);
      }
    }

    return tags;
  }

  private parseFrontmatter(content: string): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    if (!content.startsWith("---")) return result;

    const endIdx = content.indexOf("---", 3);
    if (endIdx === -1) return result;

    const frontmatter = content.substring(3, endIdx).trim();
    const lines = frontmatter.split("\n");
    let currentKey = "";
    let currentValue: string[] = [];
    let inArray = false;

    for (const line of lines) {
      const arrayItemMatch = line.match(/^\s+-\s+(.+)$/);
      if (inArray && arrayItemMatch) {
        currentValue.push(arrayItemMatch[1].trim());
        continue;
      }

      if (inArray && currentKey) {
        result[currentKey] = currentValue;
        inArray = false;
        currentValue = [];
      }

      const kvMatch = line.match(/^(\w+):\s*(.+)$/);
      if (kvMatch) {
        currentKey = kvMatch[1];
        const value = kvMatch[2].trim();
        if (value.startsWith("[")) {
          const items = value
            .replace(/^\[/, "")
            .replace(/\]$/, "")
            .split(",")
            .map((s) => s.trim().replace(/^["']|["']$/g, ""));
          result[currentKey] = items;
          inArray = false;
        } else if (value === "") {
          inArray = true;
          currentValue = [];
        } else {
          result[currentKey] = value.replace(/^["']|["']$/g, "");
        }
      }
    }

    if (inArray && currentKey) {
      result[currentKey] = currentValue;
    }

    return result;
  }

  private extractKeywords(content: string): string[] {
    const bodyContent = this.stripFrontmatter(content);
    const chineseRegex = /[\u4e00-\u9fff]{2,4}/g;
    const englishRegex = /\b[A-Z][a-z]+(?:[A-Z][a-z]+)*\b/g;

    const freq = new Map<string, number>();
    const stopWords = new Set([
      "的", "了", "在", "是", "我", "有", "和", "就", "不", "人", "都", "一", "一个",
      "上", "也", "很", "到", "说", "要", "去", "你", "会", "着", "没有", "看", "好",
      "自己", "这", "他", "她", "它", "们", "那", "些", "什么", "如何", "为什么",
      "The", "A", "An", "Is", "Are", "Was", "Were", "Be", "Been", "Being",
      "Have", "Has", "Had", "Do", "Does", "Did", "Will", "Would", "Could",
    ]);

    let match: RegExpExecArray | null;
    while ((match = chineseRegex.exec(bodyContent)) !== null) {
      const word = match[0];
      if (!stopWords.has(word)) {
        freq.set(word, (freq.get(word) || 0) + 1);
      }
    }

    while ((match = englishRegex.exec(bodyContent)) !== null) {
      const word = match[0];
      if (!stopWords.has(word) && word.length > 2) {
        freq.set(word, (freq.get(word) || 0) + 1);
      }
    }

    const wikilinkRegex = /\[\[([^\]|]+?)(?:\|[^\]]+)?\]\]/g;
    while ((match = wikilinkRegex.exec(bodyContent)) !== null) {
      const concept = match[1].trim();
      freq.set(concept, (freq.get(concept) || 0) + 3);
    }

    return Array.from(freq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);
  }

  private detectDomain(content: string, keywords: string[]): string {
    const domainKeywords: Record<string, string[]> = {
      "psychology": ["心理", "认知", "情绪", "行为", "记忆", "注意力", "感知"],
      "computer-science": ["算法", "数据结构", "编程", "架构", "系统", "网络", "数据库"],
      "philosophy": ["哲学", "存在", "意识", "伦理", "逻辑", "认识论", "形而上学"],
      "economics": ["经济", "市场", "供需", "价格", "货币", "投资", "金融"],
      "education": ["教育", "学习", "教学", "课程", "评估", "认知负荷", "元认知"],
      "literature": ["文学", "叙事", "小说", "诗歌", "修辞", "意象", "隐喻"],
    };

    const bodyLower = content.toLowerCase();
    let bestDomain = "general";
    let bestScore = 0;

    for (const [domain, dKeywords] of Object.entries(domainKeywords)) {
      let score = 0;
      for (const kw of dKeywords) {
        if (bodyLower.includes(kw)) score += 2;
        if (keywords.includes(kw)) score += 3;
      }
      if (score > bestScore) {
        bestScore = score;
        bestDomain = domain;
      }
    }

    return bestDomain;
  }

  private detectContentType(content: string): string {
    const body = this.stripFrontmatter(content);

    if (body.includes("如何") || body.includes("步骤") || body.includes("方法") || /^#{1,3}\s*(如何|怎么|步骤)/m.test(body)) {
      return "howto";
    }
    if (body.includes("案例") || body.includes("实例") || body.includes("示例")) {
      return "case";
    }
    if (body.includes("反思") || body.includes("思考") || body.includes("感悟")) {
      return "reflection";
    }
    if (body.includes("定义") || body.includes("是指") || body.includes("概念")) {
      return "concept";
    }
    return "reference";
  }

  private generateTags(
    content: string,
    keywords: string[],
    domain: string,
    contentType: string,
    existingTags: string[]
  ): TagSuggestion[] {
    const suggestions: TagSuggestion[] = [];

    if (domain !== "general" && !existingTags.some((t) => t.startsWith(domain))) {
      suggestions.push({
        tag: domain,
        reason: `内容属于${domain}领域`,
        category: "domain",
      });
    }

    const typeTag = `type/${contentType}`;
    if (!existingTags.some((t) => t.startsWith("type/"))) {
      suggestions.push({
        tag: typeTag,
        reason: `内容类型为${contentType}`,
        category: "type",
      });
    }

    if (!existingTags.some((t) => t.startsWith("status/"))) {
      const bodyLength = this.stripFrontmatter(content).length;
      const status = bodyLength < 200 ? "seed" : bodyLength < 800 ? "sprout" : "evergreen";
      suggestions.push({
        tag: `status/${status}`,
        reason: `笔记完善程度: ${status}`,
        category: "status",
      });
    }

    for (const kw of keywords.slice(0, 3)) {
      const tag = `${domain}/${kw}`;
      if (!existingTags.includes(tag) && !existingTags.includes(kw)) {
        suggestions.push({
          tag,
          reason: `核心关键词: ${kw}`,
          category: "domain",
        });
      }
    }

    return suggestions;
  }

  private generateSummary(content: string, keywords: string[]): string {
    const body = this.stripFrontmatter(content);
    const sentences = body
      .replace(/#{1,6}\s+.*/g, "")
      .replace(/\[\[([^\]|]+?)(?:\|[^\]]+)?\]\]/g, "$1")
      .replace(/[#*_`~]/g, "")
      .split(/[。！？\.\!\?]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 5);

    if (sentences.length === 0) return "（内容过短，无法生成摘要）";

    let summary = sentences[0];
    for (let i = 1; i < sentences.length && summary.length < this.settings.summaryMaxLength - 10; i++) {
      if (keywords.some((kw) => sentences[i].includes(kw))) {
        summary += "。" + sentences[i];
      }
    }

    if (summary.length > this.settings.summaryMaxLength) {
      summary = summary.substring(0, this.settings.summaryMaxLength - 1) + "…";
    }

    return summary;
  }

  private async findRelatedNotes(
    content: string,
    filePath: string,
    keywords: string[],
    existingTags: string[]
  ): Promise<{ path: string; reason: string; strength: "strong" | "weak" }[]> {
    const related: { path: string; reason: string; strength: "strong" | "weak" }[] = [];
    const files = this.app.vault.getMarkdownFiles();
    const cache: MetadataCache = this.app.metadataCache;

    for (const file of files) {
      if (file.path === filePath) continue;

      const fileCache = cache.getFileCache(file);
      if (!fileCache) continue;

      const fileTags: string[] = [];
      if (fileCache.tags) {
        fileTags.push(...fileCache.tags.map((t) => t.tag.replace(/^#/, "")));
      }
      if (fileCache.frontmatter?.tags) {
        const fmTags = fileCache.frontmatter.tags;
        if (Array.isArray(fmTags)) fileTags.push(...fmTags.map(String));
      }

      const sharedTags = existingTags.filter((t) => fileTags.includes(t));
      if (sharedTags.length >= 2) {
        related.push({
          path: file.path,
          reason: `共享标签: ${sharedTags.join(", ")}`,
          strength: "strong",
        });
        continue;
      }

      const hasLinkToCurrent = fileCache.links?.some(
        (l) => l.link.replace(/\.md$/, "").replace(/#.*/, "") === filePath.replace(/\.md$/, "").split("/").pop()
      );
      if (hasLinkToCurrent) {
        related.push({
          path: file.path,
          reason: "已有单向链接",
          strength: "strong",
        });
      }
    }

    return related.slice(0, 10);
  }

  generateFrontmatter(result: AnalysisResult): Record<string, unknown> {
    return {
      tags: result.tags.map((t) => t.tag),
      summary: result.summary,
      keywords: result.keywords.slice(0, 5),
      domain: result.domain,
      "content-type": result.contentType,
      updated: new Date().toISOString().split("T")[0],
    };
  }

  injectFrontmatter(content: string, newFields: Record<string, unknown>): string {
    const existing = this.parseFrontmatter(content);

    const merged = { ...existing, ...newFields };

    if (existing.tags && Array.isArray(existing.tags) && Array.isArray(newFields.tags)) {
      const existingSet = new Set(existing.tags.map(String));
      const newTags = (newFields.tags as string[]).filter((t) => !existingSet.has(t));
      merged.tags = [...existing.tags.map(String), ...newTags];
    }

    let frontmatterStr = "---\n";
    for (const [key, value] of Object.entries(merged)) {
      if (Array.isArray(value)) {
        frontmatterStr += `${key}:\n`;
        for (const item of value) {
          frontmatterStr += `  - ${item}\n`;
        }
      } else {
        frontmatterStr += `${key}: ${typeof value === "string" && value.includes(" ") ? `"${value}"` : value}\n`;
      }
    }
    frontmatterStr += "---";

    if (content.startsWith("---")) {
      const endIdx = content.indexOf("---", 3);
      if (endIdx !== -1) {
        const body = content.substring(endIdx + 3).trimStart();
        return frontmatterStr + "\n" + body;
      }
    }

    return frontmatterStr + "\n" + content;
  }

  private stripFrontmatter(content: string): string {
    if (!content.startsWith("---")) return content;
    const endIdx = content.indexOf("---", 3);
    if (endIdx === -1) return content;
    return content.substring(endIdx + 3).trim();
  }
}
