import { App, Vault, TFile, normalizePath, stringifyYaml } from "obsidian";
import type { ConceptEntry, Relation, Community } from "./types";
import { RELATION_TYPE_META } from "./types";

export class FileManager {
	private app: App;
	private vault: Vault;

	static CONCEPTS_DIR = "概念";
	static SOURCES_DIR = "_sources";
	static DATA_DIR = ".knowledge-atom";
	static BACKUPS_DIR = ".knowledge-atom/backups";

	constructor(app: App) {
		this.app = app;
		this.vault = app.vault;
	}

	async ensureDir(dirPath: string): Promise<void> {
		const normalized = normalizePath(dirPath);
		if (!(await this.vault.adapter.exists(normalized))) {
			await this.vault.adapter.mkdir(normalized);
		}
	}

	async exists(path: string): Promise<boolean> {
		return this.vault.adapter.exists(normalizePath(path));
	}

	async writeConceptNote(concept: ConceptEntry, relations: Relation[], communities: Community[]): Promise<string> {
		const notePath = normalizePath(`${FileManager.CONCEPTS_DIR}/${concept.name}.md`);
		await this.ensureDir(FileManager.CONCEPTS_DIR);

		const community = communities.find((c) => c.concepts.includes(concept.name));
		const conceptRelations = relations.filter((r) => r.from === concept.name || r.to === concept.name);

		const relationSections = conceptRelations
			.map((r) => {
				const other = r.from === concept.name ? r.to : r.from;
				const meta = RELATION_TYPE_META[r.gravity.strength > 0.5 ? (r.gravity.direction > 0 ? "cause" : "oppose") : "correlate"];
				const directionText = r.gravity.direction > 0 ? "吸引" : "排斥";
				return `- [[${other}]] (引力: ${r.gravity.strength.toFixed(2)}, ${directionText})${r.gravity.context ? `：${r.gravity.context}` : ""}`;
			})
			.join("\n");

		const sourceLinks = concept.sources.map((s) => `- ← [[${s.replace(/\.md$/, "")}]]`).join("\n");

		const frontmatter = {
			type: "concept",
			tags: ["concept"],
			aliases: concept.aliases,
			centrality: concept.centrality,
			abstractness: concept.abstractness,
			status: concept.status,
			community: community?.name || "",
			created: concept.extractedAt,
			firstPrinciples: concept.firstPrinciples || [],
			examples: concept.examples || [],
		};

		const firstPrinciplesList = (concept.firstPrinciples || []).length > 0
			? concept.firstPrinciples.map(p => `- ${p}`).join("\n")
			: "暂无";

		const examplesList = (concept.examples || []).length > 0
			? concept.examples.map(e => `- ${e}`).join("\n")
			: "暂无";

		const excerptSection = concept.originalExcerpt
			? `## 原文片段\n> ${concept.originalExcerpt.replace(/\n/g, "\n> ")}\n`
			: "";

		const content = `---
${stringifyYaml(frontmatter)}---

# ${concept.name}

## 定义
${concept.definition}

## 底层规律
${firstPrinciplesList}

## 原文例子
${examplesList}

${excerptSection}## 动态度量
- 中心度 (Centrality): ${concept.centrality.toFixed(2)}
- 抽象深度 (Abstractness): ${concept.abstractness.toFixed(2)}

## 引力关联
${relationSections || "暂无"}

## 来源
${sourceLinks || "暂无"}
`;

		await this.vault.adapter.write(notePath, content);
		return notePath;
	}

	async readConceptNote(name: string): Promise<string | null> {
		const notePath = normalizePath(`${FileManager.CONCEPTS_DIR}/${name}.md`);
		if (!(await this.exists(notePath))) return null;
		return this.vault.adapter.read(notePath);
	}

	async deleteConceptNote(name: string): Promise<void> {
		const notePath = normalizePath(`${FileManager.CONCEPTS_DIR}/${name}.md`);
		if (await this.exists(notePath)) {
			await this.vault.adapter.remove(notePath);
		}
	}

	async writeSourceNote(filePath: string, content: string): Promise<void> {
		const normalized = normalizePath(filePath);
		await this.ensureDir(normalized.substring(0, normalized.lastIndexOf("/")));
		await this.vault.adapter.write(normalized, content);
	}

	async readSourceNote(filePath: string): Promise<string | null> {
		const normalized = normalizePath(filePath);
		if (!(await this.exists(normalized))) return null;
		return this.vault.adapter.read(normalized);
	}

	async backupSourceNote(filePath: string): Promise<void> {
		const normalized = normalizePath(filePath);
		if (!(await this.exists(normalized))) return;

		const content = await this.vault.adapter.read(normalized);
		const backupPath = normalizePath(
			`${FileManager.BACKUPS_DIR}/${filePath.replace(/[\/\\]/g, "_")}`
		);
		await this.ensureDir(FileManager.BACKUPS_DIR);
		await this.vault.adapter.write(backupPath, content);
	}

	async updateSourceFrontmatter(filePath: string, fields: Record<string, unknown>): Promise<void> {
		const normalized = normalizePath(filePath);
		const file = this.vault.getAbstractFileByPath(normalized);
		if (!file || !(file instanceof TFile)) return;

		await this.app.fileManager.processFrontMatter(file, (fm) => {
			Object.assign(fm, fields);
		});
	}

	async insertWikilink(filePath: string, text: string, target: string): Promise<void> {
		const normalized = normalizePath(filePath);
		if (!(await this.exists(normalized))) return;

		let content = await this.vault.adapter.read(normalized);
		const wikilink = `[[${target}]]`;

		const escapedText = text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		const regex = new RegExp(escapedText, "g");
		content = content.replace(regex, wikilink);

		await this.vault.adapter.write(normalized, content);
	}

	generateSourceFileName(content: string): string {
		const firstLine = content.split("\n").find((l) => l.trim().length > 0) || "untitled";
		const sanitized = firstLine
			.replace(/[#*`\[\]{}|<>]/g, "")
			.trim()
			.substring(0, 50);
		const timestamp = Date.now().toString(36);
		return `${sanitized}_${timestamp}.md`;
	}

	async getActiveFileContent(): Promise<{ filePath: string; content: string } | null> {
		const activeFile = this.app.workspace.getActiveFile();
		if (!activeFile) return null;
		const content = await this.vault.read(activeFile);
		return { filePath: activeFile.path, content };
	}
}
