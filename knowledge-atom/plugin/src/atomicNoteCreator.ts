import { App, TFile, Vault, Editor } from "obsidian";

interface AtomicNoteData {
  title: string;
  content: string;
  source: string;
  tags: string[];
  links: string[];
}

export class AtomicNoteCreator {
  private app: App;
  private settings: { knowledgeBasePath: string; atomicNoteTemplate: string };

  constructor(app: App, settings: { knowledgeBasePath: string; atomicNoteTemplate: string }) {
    this.app = app;
    this.settings = settings;
  }

  async createFromSelection(selection: string, sourcePath: string): Promise<string> {
    const data = this.parseSelection(selection, sourcePath);
    const notePath = this.generateNotePath(data.title);
    const content = this.renderTemplate(data);

    const vault: Vault = this.app.vault;
    const dir = notePath.substring(0, notePath.lastIndexOf("/"));
    if (dir && !(await vault.adapter.exists(dir))) {
      await vault.adapter.mkdir(dir);
    }

    await vault.create(notePath, content);
    return notePath;
  }

  private parseSelection(selection: string, sourcePath: string): AtomicNoteData {
    const firstLine = selection.split("\n")[0].trim();
    let title = firstLine.replace(/^#+\s*/, "").trim();
    if (!title || title.length > 50) {
      const words = selection.replace(/[#*\[\]]/g, "").trim().split(/\s+/);
      title = words.slice(0, 5).join("");
      if (title.length > 30) {
        title = title.substring(0, 30);
      }
    }

    const wikilinkRegex = /\[\[([^\]|]+?)(?:\|[^\]]+)?\]\]/g;
    const links: string[] = [];
    let match: RegExpExecArray | null;
    while ((match = wikilinkRegex.exec(selection)) !== null) {
      links.push(match[1]);
    }

    const tagRegex = /#([a-zA-Z\u4e00-\u9fff][\w/\u4e00-\u9fff-]*)/g;
    const tags: string[] = [];
    while ((match = tagRegex.exec(selection)) !== null) {
      tags.push(match[1]);
    }

    const sourceName = sourcePath.replace(/\.md$/, "").split("/").pop() || sourcePath;

    return {
      title,
      content: selection.trim(),
      source: sourceName,
      tags,
      links,
    };
  }

  private generateNotePath(title: string): string {
    const basePath = this.settings.knowledgeBasePath === "/" ? "" : this.settings.knowledgeBasePath;
    const sanitized = title.replace(/[\\/:*?"<>|]/g, "").trim();
    return `${basePath}原子笔记/${sanitized}.md`;
  }

  private renderTemplate(data: AtomicNoteData): string {
    const id = this.generateId();
    const date = new Date().toISOString().split("T")[0];
    const tagsStr = data.tags.length > 0 ? data.tags.join(", ") : "atomic-note";
    const linksStr = data.links.map((l) => `- [[${l}]]`).join("\n");

    return this.settings.atomicNoteTemplate
      .replace(/\{\{id\}\}/g, id)
      .replace(/\{\{title\}\}/g, data.title)
      .replace(/\{\{content\}\}/g, data.content)
      .replace(/\{\{source\}\}/g, data.source)
      .replace(/\{\{tags\}\}/g, tagsStr)
      .replace(/\{\{aliases\}\}/g, data.title)
      .replace(/\{\{date\}\}/g, date)
      .replace(/\{\{links\}\}/g, linksStr || "- （暂无关联）");
  }

  private generateId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `${timestamp}-${random}`;
  }

  async splitNoteByHeadings(filePath: string): Promise<string[]> {
    const vault: Vault = this.app.vault;
    const content = await vault.adapter.read(filePath);
    const sections = this.splitByHeadings(content);
    const createdPaths: string[] = [];

    const sourceName = filePath.replace(/\.md$/, "").split("/").pop() || filePath;

    for (const section of sections) {
      if (section.content.trim().length < 20) continue;

      const data: AtomicNoteData = {
        title: section.title,
        content: section.content.trim(),
        source: sourceName,
        tags: [],
        links: [],
      };

      const notePath = this.generateNotePath(data.title);
      const noteContent = this.renderTemplate(data);

      const dir = notePath.substring(0, notePath.lastIndexOf("/"));
      if (dir && !(await vault.adapter.exists(dir))) {
        await vault.adapter.mkdir(dir);
      }

      await vault.create(notePath, noteContent);
      createdPaths.push(notePath);
    }

    if (createdPaths.length > 0) {
      const linksList = createdPaths.map((p) => {
        const name = p.replace(/\.md$/, "").split("/").pop() || p;
        return `[[${name}]]`;
      });
      const splitNotice = `已拆分为 ${createdPaths.length} 个原子笔记`;
      const updatedContent = content + `\n\n---\n> [!info] 已拆分\n> ${linksList.join(" → ")}`;
      await vault.adapter.write(filePath, updatedContent);
    }

    return createdPaths;
  }

  private splitByHeadings(content: string): { title: string; content: string }[] {
    const lines = content.split("\n");
    const sections: { title: string; content: string }[] = [];
    let currentTitle = "";
    let currentContent: string[] = [];

    const frontmatterEnd = this.findFrontmatterEnd(lines);
    const startLine = frontmatterEnd + 1;

    for (let i = startLine; i < lines.length; i++) {
      const line = lines[i];
      const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);

      if (headingMatch) {
        if (currentContent.length > 0) {
          sections.push({
            title: currentTitle || "未命名段落",
            content: currentContent.join("\n"),
          });
        }
        currentTitle = headingMatch[2].trim();
        currentContent = [line];
      } else {
        currentContent.push(line);
      }
    }

    if (currentContent.length > 0) {
      sections.push({
        title: currentTitle || "未命名段落",
        content: currentContent.join("\n"),
      });
    }

    return sections;
  }

  private findFrontmatterEnd(lines: string[]): number {
    if (lines[0] !== "---") return -1;
    for (let i = 1; i < lines.length; i++) {
      if (lines[i] === "---") return i;
    }
    return -1;
  }

  async createSequenceNote(topic: string, notePaths: string[]): Promise<string> {
    const vault: Vault = this.app.vault;
    const basePath = this.settings.knowledgeBasePath === "/" ? "" : this.settings.knowledgeBasePath;
    const seqPath = `${basePath}序列笔记/${topic}.md`;

    const items = notePaths.map((p, i) => {
      const name = p.replace(/\.md$/, "").split("/").pop() || p;
      return `${i + 1}. [[${name}]]`;
    });

    const content = `---
type: sequence
topic: ${topic}
created: ${new Date().toISOString().split("T")[0]}
---

# ${topic}：思考序列

${items.join("\n")}

## 思考路径
`;

    const dir = seqPath.substring(0, seqPath.lastIndexOf("/"));
    if (dir && !(await vault.adapter.exists(dir))) {
      await vault.adapter.mkdir(dir);
    }

    await vault.create(seqPath, content);
    return seqPath;
  }
}
