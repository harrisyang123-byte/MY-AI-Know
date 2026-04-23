import { App, Plugin, PluginSettingTab, Setting, Notice } from "obsidian";
import { KnowledgeIndex } from "./knowledgeIndex";
import { FileManager } from "./fileManager";
import { StatsEngine } from "./statsEngine";
import { LLMService } from "./llmService";
import { SkillEngine, BUILTIN_SKILLS } from "./skills";
import { CommunityDetector } from "./communityDetector";
import { LevelComputer } from "./levelComputer";
import { CrystalSynthesizer } from "./crystalSynthesizer";
import { KnowledgeChatView, KNOWLEDGE_CHAT_VIEW } from "./knowledgeChatView";
import { KnowledgeVizView, KNOWLEDGE_VIZ_VIEW } from "./knowledgeVizView";
import type { ModelProfile, DisplayMode, GraphFilter, ConceptEntry, Relation, GravityVector, ExtractResult, KnowledgeProton, ConceptNebula } from "./types";
import { DEFAULT_MODEL_PROFILES } from "./types";

interface KnowledgePluginSettings {
	modelProfiles: ModelProfile[];
	activeProfileId: string;
	skillOrder: string[];
	pinnedSkillIds: string[];
	displayMode: DisplayMode;
	defaultFilter: GraphFilter;
	autoIndexOnOpen: boolean;
	chunkSize: number;
}

const DEFAULT_SETTINGS: KnowledgePluginSettings = {
	modelProfiles: [...DEFAULT_MODEL_PROFILES],
	activeProfileId: "deepseek-chat",
	skillOrder: ["ai-chat", "extract-and-split", "gravity-probe"],
	pinnedSkillIds: ["ai-chat", "extract-and-split"],
	displayMode: "label",
	defaultFilter: {
		relationTypes: ["cause", "correlate", "contain", "synonym", "oppose", "cross-domain"],
		levels: ["core", "bridge", "leaf"],
		communities: [],
		minConfidence: 0.3,
		showSourceNotes: false,
	},
	autoIndexOnOpen: false,
	chunkSize: 3000,
};

export default class KnowledgePlugin extends Plugin {
	settings: KnowledgePluginSettings = DEFAULT_SETTINGS;
	knowledgeIndex!: KnowledgeIndex;
	fileManager!: FileManager;
	statsEngine!: StatsEngine;
	llmService!: LLMService;
	skillEngine!: SkillEngine;
	crystalSynthesizer!: CrystalSynthesizer;

	async onload() {
		await this.loadSettings();

		this.knowledgeIndex = new KnowledgeIndex(this.app);
		this.fileManager = new FileManager(this.app);
		this.statsEngine = new StatsEngine(this.app, this.knowledgeIndex);

		await this.knowledgeIndex.load();
		await this.statsEngine.load();

		this.initLLM();

		this.registerView(KNOWLEDGE_CHAT_VIEW, (leaf) => new KnowledgeChatView(leaf, this));
		this.registerView(KNOWLEDGE_VIZ_VIEW, (leaf) => new KnowledgeVizView(leaf, this));

		this.addRibbonIcon("brain", "Knowledge AI", () => {
			this.activateChatView();
		});

		this.addRibbonIcon("git-graph", "知识图谱", () => {
			this.activateVizView();
		});

		this.addCommand({
			id: "open-knowledge-chat",
			name: "打开 Knowledge AI 面板",
			callback: () => this.activateChatView(),
		});

		this.addCommand({
			id: "open-knowledge-graph",
			name: "打开知识图谱",
			callback: () => this.activateVizView(),
		});

		this.addCommand({
			id: "extract-current-note",
			name: "提取当前笔记的概念和关系",
			callback: () => this.extractCurrentNote(),
		});

		this.addCommand({
			id: "recompute-levels",
			name: "重算所有概念层级",
			callback: () => this.recomputeAllLevels(),
		});

		this.addCommand({
			id: "redetect-communities",
			name: "重新检测社区",
			callback: () => this.redetectCommunities(),
		});

		
		this.addCommand({
			id: "probe-concept-gravity",
			name: "探测概念引力",
			callback: () => this.probeCurrentConceptGravity(),
		});

		this.addCommand({
			id: "sync-concept-notes",
			name: "同步修复概念笔记",
			callback: () => this.syncConceptNotes(),
		});

		this.addSettingTab(new KnowledgeSettingTab(this.app, this));
	}

	private initLLM(): void {
		const profile = this.getActiveProfile();
		if (profile) {
			this.llmService = new LLMService({
				apiBase: profile.apiBase,
				apiKey: profile.apiKey,
				model: profile.model,
				maxTokens: profile.maxTokens,
				temperature: profile.temperature,
			}, this.app);
		} else {
			this.llmService = new LLMService({
				apiBase: "http://127.0.0.1:4000/v1",
				apiKey: "",
				model: "deepseek-chat",
				maxTokens: 4096,
				temperature: 0.3,
			}, this.app);
		}
		this.skillEngine = new SkillEngine(this.llmService);
		this.crystalSynthesizer = new CrystalSynthesizer(this.llmService);
	}

	getActiveProfile(): ModelProfile | undefined {
		return this.settings.modelProfiles.find((p) => p.id === this.settings.activeProfileId);
	}

	async activateChatView(): Promise<void> {
		const { workspace } = this.app;
		let leaf = workspace.getLeavesOfType(KNOWLEDGE_CHAT_VIEW)[0];
		if (!leaf) {
			const rightLeaf = workspace.getRightLeaf(false);
			if (rightLeaf) {
				await rightLeaf.setViewState({ type: KNOWLEDGE_CHAT_VIEW, active: true });
				leaf = rightLeaf;
			}
		} else {
			workspace.revealLeaf(leaf);
		}
	}

	async activateVizView(): Promise<void> {
		const { workspace } = this.app;
		let leaf = workspace.getLeavesOfType(KNOWLEDGE_VIZ_VIEW)[0];
		if (!leaf) {
			const rightLeaf = workspace.getRightLeaf(false);
			if (rightLeaf) {
				await rightLeaf.setViewState({ type: KNOWLEDGE_VIZ_VIEW, active: true });
				leaf = rightLeaf;
			}
		} else {
			workspace.revealLeaf(leaf);
		}
	}

	async extractCurrentNote(): Promise<void> {
		const result = await this.fileManager.getActiveFileContent();
		if (!result) {
			new Notice("请先打开一个笔记");
			return;
		}

		if (!this.getActiveProfile()?.apiKey) {
			new Notice("请先在设置中配置 API Key");
			return;
		}

		new Notice("正在提取概念...");
		try {
			const extractResult = await this.skillEngine.executeExtractAndSplit(result.content);
			const conceptCount = Array.isArray(extractResult.concepts) ? extractResult.concepts.length : 0;
			const relationCount = Array.isArray(extractResult.relations) ? extractResult.relations.length : 0;
			await this.processExtractResult(extractResult, result.filePath);
			new Notice(`✅ 提取完成：${conceptCount} 个概念，${relationCount} 条关系`);
		} catch (error) {
			new Notice(`❌ 提取失败：${error instanceof Error ? error.message : String(error)}`);
		}
	}

	async processExtractResult(
		extractResult: ExtractResult,
		sourceFilePath: string
	): Promise<void> {
		try {
		const now = new Date().toISOString();

		// 处理概念：去重、增量更新
		const conceptEntries = extractResult.concepts;
		for (const c of conceptEntries) {
			const existing = this.knowledgeIndex.getConcept(c.name);
			if (existing) {
				const newAliases = [...new Set([...existing.aliases, ...(c.aliases || [])])];
				const newSources = [...new Set([...existing.sources, sourceFilePath])];
				const newFP = c.firstPrinciples || [];
				const existingFP = existing.firstPrinciples || [];
				const mergedFP = newFP.length > existingFP.length ? newFP : existingFP;
				const newExamples = [...new Set([...(existing.examples || []), ...(c.examples || [])])];
				const newExcerpt = c.originalExcerpt && c.originalExcerpt.length > (existing.originalExcerpt || "").length
					? c.originalExcerpt : (existing.originalExcerpt || "");
				await this.knowledgeIndex.upsertConcept({
					...existing,
					definition: c.definition.length > existing.definition.length ? c.definition : existing.definition,
					aliases: newAliases,
					sources: newSources,
					firstPrinciples: mergedFP,
					examples: newExamples,
					originalExcerpt: newExcerpt,
				});
			} else {
				// 新增概念
				await this.knowledgeIndex.upsertConcept({
					name: c.name,
					definition: c.definition,
					centrality: 0,
					abstractness: 0,
					status: "draft",
					aliases: c.aliases || [],
					sources: [sourceFilePath],
					notePath: `概念/${c.name}.md`,
					extractedAt: now,
					firstPrinciples: c.firstPrinciples || [],
					examples: c.examples || [],
					originalExcerpt: c.originalExcerpt || "",
				});
			}
		}

		// 获取现有关系，用于去重
		const existingRelations = this.knowledgeIndex.getRelations();
		const existingRelationPairs = new Set(
			existingRelations.map(r => {
				const sorted = [r.from, r.to].sort();
				// 使用 gravity.dimensions[0] 作为去重键
				const dim = r.gravity.dimensions?.[0] || "关联";
				return `${sorted[0]}|${sorted[1]}|${dim}`;
			})
		);

		// 过滤新增关系，去重
		const relationEntries: Array<Omit<Relation, "id" | "createdAt">> = extractResult.relations
			.filter((r) => {
				if (!this.knowledgeIndex.getConcept(r.from) || !this.knowledgeIndex.getConcept(r.to)) {
					return false;
				}
				const sorted = [r.from, r.to].sort();
				const dim = r.gravity?.dimensions?.[0] || "关联";
				const key = `${sorted[0]}|${sorted[1]}|${dim}`;
				return !existingRelationPairs.has(key);
			})
			.map((r) => {
				const gravity: GravityVector = r.gravity?.strength !== undefined
					? {
							strength: r.gravity.strength,
							direction: r.gravity.direction ?? 0.7,
							dimensions: r.gravity.dimensions ?? ["关联"],
							context: r.gravity.context ?? r.context ?? "",
							computedAt: new Date().toISOString(),
							confidence: r.gravity.confidence ?? r.confidence ?? 0.5,
						}
					: this.knowledgeIndex.mapOldTypeToGravity("correlate");

				return {
					from: r.from,
					to: r.to,
					gravity,
					source: r.source || sourceFilePath,
				};
			});

		// 只添加新增的关系
		if (relationEntries.length > 0) {
			await this.knowledgeIndex.addRelations(relationEntries);
		}

		await this.knowledgeIndex.upsertNoteIndex({
			filePath: sourceFilePath,
			title: sourceFilePath.split("/").pop()?.replace(".md", "") || "",
			summary: extractResult.summary,
			tags: extractResult.tags,
			concepts: extractResult.concepts.map((c) => c.name),
			implicitLinksAdded: [],
			indexedAt: now,
		});

		const allConcepts = this.knowledgeIndex.getAllConcepts();
		for (const concept of conceptEntries) {
			this.statsEngine.incrementMentionCount(concept.name);
		}
		this.statsEngine.updateAllScores();

		if (LevelComputer.shouldRecompute(this.statsEngine.getAllStats(), allConcepts.length)) {
			await this.statsEngine.recomputeLevels();
		}

		if (allConcepts.length >= 5) {
			await this.redetectCommunities();
		}

		await this.assessCrystalImpact(conceptEntries.map(c => c.name));

		const communities = this.knowledgeIndex.getCommunities();
		const allRelations = this.knowledgeIndex.getRelations();
		for (const concept of conceptEntries) {
			const entry = this.knowledgeIndex.getConcept(concept.name);
			if (entry) {
				try {
					await this.fileManager.writeConceptNote(entry, allRelations, communities);
				} catch (writeErr) {
					console.error(`[processExtractResult] 写入概念笔记失败: ${concept.name}`, writeErr);
					new Notice(`⚠️ 概念笔记「${concept.name}」写入失败：${writeErr instanceof Error ? writeErr.message : String(writeErr)}`);
				}
			} else {
				console.warn(`[processExtractResult] 概念未找到，跳过写入: ${concept.name}`);
			}
		}

		await this.fileManager.updateSourceFrontmatter(sourceFilePath, {
			"knowledge-indexed": true,
			"knowledge-concepts": extractResult.concepts.map((c) => c.name),
			"knowledge-summary": extractResult.summary,
		});

		await this.statsEngine.save();
		this.refreshVizView();
		} catch (error) {
			const msg = error instanceof Error ? error.message : String(error);
			console.error("[processExtractResult] 失败:", error);
			new Notice(`❌ 处理提取结果失败：${msg}`);
			throw error;
		}
	}

	refreshVizView(): void {
		const leaves = this.app.workspace.getLeavesOfType(KNOWLEDGE_VIZ_VIEW);
		for (const leaf of leaves) {
			if (leaf.view instanceof KnowledgeVizView) {
				(leaf.view as KnowledgeVizView).refreshGraph();
			}
		}
	}

	async recomputeAllLevels(): Promise<void> {
		new Notice("正在重算概念层级...");
		this.statsEngine.updateAllScores();
		await this.statsEngine.recomputeLevels();

		const communities = this.knowledgeIndex.getCommunities();
		const allRelations = this.knowledgeIndex.getRelations();
		for (const concept of this.knowledgeIndex.getAllConcepts()) {
			await this.fileManager.writeConceptNote(concept, allRelations, communities);
		}

		new Notice("✅ 概念层级重算完成");
	}

	async redetectCommunities(): Promise<void> {
		new Notice("正在检测社区...");
		const allConcepts = this.knowledgeIndex.getAllConcepts();
		const relations = this.knowledgeIndex.getRelations();

		if (allConcepts.length < 3) {
			new Notice("概念数量不足，跳过社区检测");
			return;
		}

		const protons: KnowledgeProton[] = allConcepts.map(c => ({
			id: `p_${c.name}`,
			conceptName: c.name,
			content: c.definition,
			firstPrinciples: c.firstPrinciples || [],
			centrality: c.centrality,
			abstractness: c.abstractness,
			sourceNotePath: c.sources[0] || "",
			extractedAt: c.extractedAt,
		}));

		const communities = CommunityDetector.detect(protons, relations);

		const conceptTags: Record<string, string[]> = {};
		for (const concept of allConcepts) {
			const noteIdx = this.knowledgeIndex.getNoteIndex(concept.sources[0] || "");
			conceptTags[concept.name] = noteIdx?.tags || [];
		}

		CommunityDetector.labelCommunities(communities, conceptTags);

		if (this.getActiveProfile()?.apiKey) {
			for (const community of communities) {
				if (community.concepts.length >= 3 && !community.isNamed) {
					try {
						const label = await this.skillEngine.executeCommunityNaming(community.concepts);
						community.name = label;
						community.isNamed = true;
					} catch {
						// keep auto label
					}
				}
			}
		}

		await this.knowledgeIndex.setCommunities(communities);
		this.statsEngine.updateCommunityStats();
		this.statsEngine.updateAllScores();
		await this.statsEngine.recomputeLevels();

		new Notice(`✅ 检测到 ${communities.length} 个社区`);
	}

	async assessCrystalImpact(newConceptNames: string[]): Promise<void> {
		if (newConceptNames.length === 0) return;

		const data = this.knowledgeIndex.getData();
		const crystals = data.crystals || {};
		const crystalKeys = Object.keys(crystals);
		if (crystalKeys.length === 0) return;

		const allRelations = this.knowledgeIndex.getRelations();
		const allConcepts = this.knowledgeIndex.getAllConcepts();

		for (const crystalKey of crystalKeys) {
			const crystal = crystals[crystalKey];
			if (!crystal || crystal.state === "dissolved") continue;

			const community = data.communities.find((c: any) => c.concepts && c.concepts.some((cn: string) =>
				crystal.nebulaId.includes(cn) || cn === crystal.metaConcept
			));
			if (!community) continue;

			const nebulaProtonIds = community.concepts || [];
			const incomingProtons = newConceptNames
				.filter(name => nebulaProtonIds.includes(name))
				.map(name => {
					const entry = this.knowledgeIndex.getConcept(name);
					return {
						id: `p_${name}`,
						conceptName: name,
						content: entry?.definition || "",
						firstPrinciples: entry?.firstPrinciples || [],
						centrality: entry?.centrality || 0,
						abstractness: entry?.abstractness || 0,
						sourceNotePath: entry?.sources[0] || "",
						extractedAt: entry?.extractedAt || "",
					};
				});

			if (incomingProtons.length === 0) continue;

			const nebula: ConceptNebula = {
				id: crystal.nebulaId,
				protons: nebulaProtonIds,
				cohesionStrength: community.cohesionStrength || 0.5,
				stability: community.stability || 0.5,
				boundaryPoints: community.boundaryPoints || [],
				centerOfGravity: community.centerOfGravity || { x: 0, y: 0 },
				radius: community.radius || 50,
				createdAt: community.createdAt || Date.now(),
				lastUpdatedAt: Date.now(),
			};

			const impact = this.crystalSynthesizer.assessImpact(crystal, nebula, incomingProtons, allRelations);

			if (impact === "shatter") {
				crystal.state = "shattering";
				crystal.lastStateChangeAt = Date.now();
				new Notice(`天体「${crystal.metaConcept}」受到扰动，开始破碎`);
			} else if (impact === "integrate") {
				crystal.exampleCount += incomingProtons.length;
				const newMaturity = Math.min(1, crystal.maturity + incomingProtons.length * 0.05);
				crystal.maturity = newMaturity;
				if (newMaturity >= 0.7 && crystal.state === "forming") {
					crystal.state = "stable";
					crystal.lastStateChangeAt = Date.now();
					new Notice(`天体「${crystal.metaConcept}」已稳定`);
				}
			}
		}

		await this.knowledgeIndex.save();
	}

	refreshServices(): void {
		this.initLLM();
	}

	async loadSettings(): Promise<void> {
		const loaded = await this.loadData();
		this.settings = Object.assign({}, DEFAULT_SETTINGS, loaded);
		
		// 合并模型配置
		if (loaded?.modelProfiles) {
			// 旧 Gemini 模型 ID 到新 ID 的映射
			const modelIdMap: Record<string, string> = {
				"gemini-2.0-flash": "gemini-3-flash-preview",
				"gemini-1.5-pro": "gemini-3.1-pro-preview",
				"gemini-1.5-flash": "gemini-3.1-flash-lite-preview",
				"gemini-3-flash": "gemini-3-flash-preview",
				"gemini-flash-latest": "gemini-3-flash-preview"
			};
			
			// 创建一个 map 存储默认配置
			const defaultMap = new Map();
			DEFAULT_MODEL_PROFILES.forEach(p => defaultMap.set(p.id, p));
			
			// 处理每个用户已有配置
			const mergedProfiles = loaded.modelProfiles.map((p: any) => {
				// 迁移旧的 Gemini 模型 ID
				if (modelIdMap[p.id]) {
					const newId = modelIdMap[p.id];
					const newDefault = defaultMap.get(newId);
					if (newDefault) {
						return {
							...p,
							id: newId,
							name: newDefault.name,
							model: newDefault.model,
							apiBase: newDefault.apiBase
						};
					}
				}
				
				const defaultProfile = defaultMap.get(p.id);
				if (defaultProfile) {
					// 如果是 Gemini 模型，更新 API 地址（因为之前可能是本地代理）
					if (p.id.startsWith("gemini-")) {
						return { ...p, apiBase: defaultProfile.apiBase };
					}
					// 其他模型，只更新 capabilities（如果有新增）
					if (defaultProfile.capabilities && (!p.capabilities || p.capabilities.length === 0)) {
						return { ...p, capabilities: defaultProfile.capabilities };
					}
				}
				return p;
			});
			
			// 添加新增的模型
			const existingIds = new Set(mergedProfiles.map((p: any) => p.id));
			const newProfiles = DEFAULT_MODEL_PROFILES.filter((p) => !existingIds.has(p.id));
			this.settings.modelProfiles = [...mergedProfiles, ...newProfiles];
		} else {
			this.settings.modelProfiles = [...DEFAULT_MODEL_PROFILES];
		}
		
		if (!loaded?.skillOrder || loaded.skillOrder.length === 0) {
			this.settings.skillOrder = [...DEFAULT_SETTINGS.skillOrder];
		}
		if (!loaded?.pinnedSkillIds || loaded.pinnedSkillIds.length === 0) {
			this.settings.pinnedSkillIds = [...DEFAULT_SETTINGS.pinnedSkillIds];
		}
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
	}
	async probeCurrentConceptGravity(): Promise<void> {
		const result = await this.fileManager.getActiveFileContent();
		if (!result) { new Notice("请先打开一个笔记"); return; }
		const fileName = result.filePath.split("/").pop()?.replace(".md", "") || "";
		const concept = this.knowledgeIndex.getConcept(fileName);
		if (!concept) { new Notice("当前笔记不是概念笔记或未索引"); return; }
		new Notice(`正在探测「${fileName}」的引力关联...`);
		try {
			const probes = await this.probeGravity(fileName);
			new Notice(`发现 ${probes.length} 条引力关联`);
		} catch (error) {
			new Notice(`探测失败: ${error instanceof Error ? error.message : String(error)}`);
		}
	}

	async probeGravity(conceptName: string): Promise<Array<{ targetConcept: string; gravity: any; reason: string }>> {
		const concept = this.knowledgeIndex.getConcept(conceptName);
		if (!concept) return [];
		const existingConcepts = this.knowledgeIndex.getAllConcepts()
			.filter(c => c.name !== conceptName)
			.map(c => ({ name: c.name, definition: c.definition }));
		if (existingConcepts.length === 0) return [];
		const result = await this.skillEngine.executeGravityProbe(
			{ name: concept.name, definition: concept.definition },
			existingConcepts
		);
		return result.probes || [];
	}

	async syncConceptNotes(): Promise<void> {
		new Notice("正在同步修复概念笔记...");
		const allConcepts = this.knowledgeIndex.getAllConcepts();
		const allRelations = this.knowledgeIndex.getRelations();
		const communities = this.knowledgeIndex.getCommunities();

		let fixed = 0;
		let missing = 0;

		for (const concept of allConcepts) {
			const notePath = `概念/${concept.name}.md`;
			const exists = await this.app.vault.adapter.exists(notePath);

			if (!exists) {
				missing++;
				try {
					await this.fileManager.writeConceptNote(concept, allRelations, communities);
					fixed++;
				} catch (err) {
					console.error(`[syncConceptNotes] 修复失败: ${concept.name}`, err);
				}
			}
		}

		const orphanFiles: string[] = [];
		const conceptNames = new Set(allConcepts.map(c => c.name));
		const conceptDir = this.app.vault.getAbstractFileByPath("概念");
		if (conceptDir && "children" in conceptDir) {
			const children = (conceptDir as any).children as Array<{name: string; path: string}>;
			if (Array.isArray(children)) {
				for (const file of children) {
					const name = file.name?.replace(".md", "");
					if (name && !conceptNames.has(name)) {
						orphanFiles.push(file.path);
					}
				}
			}
		}

		new Notice(`✅ 同步完成：缺失 ${missing} 个，已修复 ${fixed} 个${orphanFiles.length > 0 ? `，孤立文件 ${orphanFiles.length} 个` : ""}`);
	}
}

class KnowledgeSettingTab extends PluginSettingTab {
	plugin: KnowledgePlugin;

	constructor(app: App, plugin: KnowledgePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();
		containerEl.createEl("h2", { text: "Knowledge Atom 设置" });

		this.renderModelSettings(containerEl);
		this.renderSkillSettings(containerEl);
		this.renderGraphSettings(containerEl);
		this.renderAdvancedSettings(containerEl);
	}

	private renderModelSettings(containerEl: HTMLElement): void {
		containerEl.createEl("h3", { text: "🤖 模型配置" });

		const activeProfile = this.plugin.getActiveProfile();
		const statusText = activeProfile?.apiKey
			? `✅ 当前使用: ${activeProfile.name}`
			: `⚠️ ${activeProfile?.name || "未选择"} 未配置 API Key`;
		containerEl.createEl("p", { text: statusText, cls: "setting-item-description" });

		new Setting(containerEl)
			.setName("当前模型")
			.setDesc("选择默认使用的 AI 模型")
			.addDropdown((dd) => {
				for (const profile of this.plugin.settings.modelProfiles) {
					dd.addOption(profile.id, `${profile.name} (${profile.model})`);
				}
				dd.setValue(this.plugin.settings.activeProfileId);
				dd.onChange(async (value) => {
					this.plugin.settings.activeProfileId = value;
					await this.plugin.saveSettings();
					this.plugin.refreshServices();
					this.display();
				});
			});

		// 创建可折叠的模型列表
		const modelListHeader = containerEl.createEl("div", { cls: "kch-model-list-header" });
		const modelListContent = containerEl.createDiv({ cls: "kch-model-list-content" });
		let isCollapsed = true;

		modelListHeader.createEl("h4", { text: "模型配置" });
		const toggleBtn = modelListHeader.createEl("button", { 
			cls: "kch-model-list-toggle" 
		});

		// 使用SVG图标
		const updateToggleBtn = () => {
			toggleBtn.innerHTML = isCollapsed 
				? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;">
						<polyline points="9 18 15 12 9 6"></polyline>
					</svg> 展开`
				: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;">
						<polyline points="6 9 12 15 18 9"></polyline>
					</svg> 折叠`;
		};

		updateToggleBtn();

		// 初始隐藏内容
		modelListContent.style.display = "none";

		toggleBtn.addEventListener("click", () => {
			isCollapsed = !isCollapsed;
			if (isCollapsed) {
				modelListContent.style.display = "none";
			} else {
				modelListContent.style.display = "block";
			}
			updateToggleBtn();
		});

		for (let i = 0; i < this.plugin.settings.modelProfiles.length; i++) {
			const profile = this.plugin.settings.modelProfiles[i];
			const section = modelListContent.createDiv({ cls: "kch-model-card" });

			section.createEl("div", {
				text: `${profile.id === this.plugin.settings.activeProfileId ? "● " : "○ "}${profile.name}`,
				cls: "kch-model-card-title",
			});

			new Setting(section).setName("API 地址").addText((text) =>
				text.setValue(profile.apiBase).onChange(async (value) => {
					this.plugin.settings.modelProfiles[i].apiBase = value;
					await this.plugin.saveSettings();
				})
			);

			new Setting(section).setName("API Key").addText((text) => {
				text.setPlaceholder("sk-...").setValue(profile.apiKey).onChange(async (value) => {
					this.plugin.settings.modelProfiles[i].apiKey = value;
					await this.plugin.saveSettings();
				});
				text.inputEl.type = "password";
			});

			new Setting(section).setName("模型").addText((text) =>
				text.setValue(profile.model).onChange(async (value) => {
					this.plugin.settings.modelProfiles[i].model = value;
					await this.plugin.saveSettings();
				})
			);

			new Setting(section).setName("温度").addSlider((slider) =>
				slider
					.setLimits(0, 1, 0.1)
					.setValue(profile.temperature)
					.setDynamicTooltip()
					.onChange(async (value) => {
						this.plugin.settings.modelProfiles[i].temperature = value;
						await this.plugin.saveSettings();
					})
			);

			const btnRow = section.createDiv({ cls: "kch-model-card-btns" });

			new Setting(btnRow).setName("测试连接").addButton((btn) =>
				btn.setButtonText("测试").onClick(async () => {
					const p = this.plugin.settings.modelProfiles[i];
					if (!p.apiKey && !p.apiBase.includes("localhost") && !p.apiBase.includes("127.0.0.1")) {
						new Notice("请先填写 API Key");
						return;
					}
					try {
						const service = new LLMService({
							apiBase: p.apiBase,
							apiKey: p.apiKey || "test",
							model: p.model,
							maxTokens: 64,
							temperature: 0,
						});
						const response = await service.chat([{ role: "user", content: "请回复：连接成功" }]);
						new Notice(`✅ ${p.name} 连接成功: ${response.substring(0, 50)}`);
					} catch (error) {
						new Notice(`❌ ${p.name} 连接失败: ${error instanceof Error ? error.message : String(error)}`);
					}
				})
			);

			new Setting(btnRow).setName("删除模型").addButton((btn) =>
				btn.setButtonText("删除").onClick(async () => {
					this.plugin.settings.modelProfiles.splice(i, 1);
					if (this.plugin.settings.activeProfileId === profile.id) {
						this.plugin.settings.activeProfileId = this.plugin.settings.modelProfiles[0]?.id || "";
					}
					await this.plugin.saveSettings();
					this.plugin.refreshServices();
					this.display();
				})
			);
		}

		new Setting(containerEl)
			.setName("添加模型")
			.setDesc("添加一个新的 API 模型配置")
			.addButton((btn) =>
				btn.setButtonText("+ 添加").onClick(async () => {
					const id = `custom-${Date.now()}`;
					this.plugin.settings.modelProfiles.push({
						id,
						name: "新模型",
						apiBase: "https://api.openai.com/v1",
						apiKey: "",
						model: "gpt-4o-mini",
						maxTokens: 4096,
						temperature: 0.3,
					});
					await this.plugin.saveSettings();
					this.display();
				})
			);
	}

	private renderSkillSettings(containerEl: HTMLElement): void {
		containerEl.createEl("h3", { text: "⚡ 技能配置" });

		for (const skillId of this.plugin.settings.skillOrder) {
			const skill = BUILTIN_SKILLS.find((s) => s.id === skillId);
			if (!skill) continue;

			const isPinned = this.plugin.settings.pinnedSkillIds.includes(skillId);

			new Setting(containerEl)
				.setName(`${skill.icon} ${skill.name}`)
				.setDesc(skill.description)
				.addToggle((toggle) =>
					toggle.setValue(isPinned).onChange(async (value) => {
						if (value) {
							if (!this.plugin.settings.pinnedSkillIds.includes(skillId)) {
								this.plugin.settings.pinnedSkillIds.push(skillId);
							}
						} else {
							this.plugin.settings.pinnedSkillIds = this.plugin.settings.pinnedSkillIds.filter(
								(id) => id !== skillId
							);
						}
						await this.plugin.saveSettings();
					})
				)
				.addExtraButton((btn) =>
					btn.setIcon("arrow-up").setTooltip("上移").onClick(async () => {
						const idx = this.plugin.settings.skillOrder.indexOf(skillId);
						if (idx > 0) {
							const arr = this.plugin.settings.skillOrder;
							[arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
							await this.plugin.saveSettings();
							this.display();
						}
					})
				)
				.addExtraButton((btn) =>
					btn.setIcon("arrow-down").setTooltip("下移").onClick(async () => {
						const idx = this.plugin.settings.skillOrder.indexOf(skillId);
						if (idx < this.plugin.settings.skillOrder.length - 1) {
							const arr = this.plugin.settings.skillOrder;
							[arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
							await this.plugin.saveSettings();
							this.display();
						}
					})
				);
		}
	}

	private renderGraphSettings(containerEl: HTMLElement): void {
		containerEl.createEl("h3", { text: "📊 图谱设置" });

		new Setting(containerEl)
			.setName("显示模式")
			.setDesc("关系线的显示方式：标签/颜色/混合")
			.addDropdown((dd) => {
				dd.addOption("label", "标签模式（默认灰色+文字）");
				dd.addOption("color", "颜色模式（按类型着色）");
				dd.addOption("mixed", "混合模式（颜色+文字）");
				dd.setValue(this.plugin.settings.displayMode);
				dd.onChange(async (value) => {
					this.plugin.settings.displayMode = value as DisplayMode;
					await this.plugin.saveSettings();
				});
			});

		new Setting(containerEl)
			.setName("最低置信度")
			.setDesc("图谱中显示的关系最低置信度")
			.addSlider((slider) =>
				slider
					.setLimits(0, 1, 0.1)
					.setValue(this.plugin.settings.defaultFilter.minConfidence)
					.setDynamicTooltip()
					.onChange(async (value) => {
						this.plugin.settings.defaultFilter.minConfidence = value;
						await this.plugin.saveSettings();
					})
			);
	}

	private renderAdvancedSettings(containerEl: HTMLElement): void {
		containerEl.createEl("h3", { text: "⚙️ 高级设置" });

		new Setting(containerEl)
			.setName("分段大小")
			.setDesc("长文分析时每段的最大字符数")
			.addSlider((slider) =>
				slider
					.setLimits(1000, 8000, 500)
					.setValue(this.plugin.settings.chunkSize)
					.setDynamicTooltip()
					.onChange(async (value) => {
						this.plugin.settings.chunkSize = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("打开笔记时自动索引")
			.setDesc("启用后，打开笔记时自动检测并更新索引")
			.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.autoIndexOnOpen).onChange(async (value) => {
					this.plugin.settings.autoIndexOnOpen = value;
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setName("重算概念层级")
			.setDesc("手动触发所有概念的层级重算")
			.addButton((btn) =>
				btn.setButtonText("重算").onClick(() => this.plugin.recomputeAllLevels())
			);

		new Setting(containerEl)
			.setName("重新检测社区")
			.setDesc("手动触发社区发现算法")
			.addButton((btn) =>
				btn.setButtonText("检测").onClick(() => this.plugin.redetectCommunities())
			);
	}
}
