import { ItemView, WorkspaceLeaf, Notice } from "obsidian";
import type KnowledgePlugin from "./main";
import { BUILTIN_SKILLS } from "./skills";
import type { ExtractResult, ModelProfile, ModelCapability, GravityVector } from "./types";
import { RELATION_TYPE_META, MODEL_CAPABILITIES, DEFAULT_MODEL_PROFILES } from "./types";

export const KNOWLEDGE_CHAT_VIEW = "knowledge-chat-view";

interface ChatMessage {
	id: string;
	role: "user" | "assistant" | "system";
	content: string;
	timestamp: string;
	pendingOperation?: {
		type: "extract-result" | "gravity-probe";
		data: any;
	};
}

export class KnowledgeChatView extends ItemView {
	private plugin: KnowledgePlugin;
	private messages: ChatMessage[] = [];
	private currentSkillId = "ai-chat";
	private isProcessing = false;
	private pendingExtractResult: ExtractResult | null = null;
	private pendingSourcePath = "";
	private showDebugLog = false;
	private unsubscribeLog: (() => void) | null = null;
	private modelPanelOpen = false;

	constructor(leaf: WorkspaceLeaf, plugin: KnowledgePlugin) {
		super(leaf);
		this.plugin = plugin;
	}

	getViewType(): string {
		return KNOWLEDGE_CHAT_VIEW;
	}

	getDisplayText(): string {
		return "Knowledge AI";
	}

	getIcon(): string {
		return "brain";
	}

	async onOpen(): Promise<void> {
		const container = this.containerEl.children[1] as HTMLElement;
		container.empty();
		container.addClass("kch-container");

		this.unsubscribeLog = this.plugin.llmService.onLog(() => {
			if (this.showDebugLog) {
				this.renderDebugLog();
			}
		});

		this.render();
	}

	async onClose(): Promise<void> {
		if (this.unsubscribeLog) {
			this.unsubscribeLog();
			this.unsubscribeLog = null;
		}
		this.containerEl.children[1].empty();
	}

	private render(): void {
		const container = this.containerEl.children[1] as HTMLElement;
		container.empty();

		this.renderTopActions(container);
		this.renderMessages(container);
		this.renderInput(container);

		if (this.showDebugLog) {
			this.renderDebugLogPanel(container);
		}

		this.bindDocumentClick(container);
	}

	private renderTopActions(container: HTMLElement): void {
		const toolbar = container.createDiv({ cls: "kch-topbar" });

		const title = toolbar.createDiv({ cls: "kch-title" });
		title.innerHTML = `
			<svg class="kch-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<circle cx="12" cy="12" r="10"></circle>
				<circle cx="12" cy="12" r="4"></circle>
				<circle cx="4.93" cy="4.93" r="1"></circle>
				<circle cx="19.07" cy="4.93" r="1"></circle>
				<circle cx="4.93" cy="19.07" r="1"></circle>
				<circle cx="19.07" cy="19.07" r="1"></circle>
			</svg>
			<span>Knowledge AI</span>
		`;

		const actions = toolbar.createDiv({ cls: "kch-topbar-actions" });

		const historyBtn = actions.createEl("button", { cls: "kch-topbar-btn" });
		historyBtn.innerHTML = `<svg class="kch-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg><span>历史</span>`;
		historyBtn.addEventListener("click", () => new Notice("历史记录功能开发中..."));

		const graphBtn = actions.createEl("button", { cls: "kch-topbar-btn" });
		graphBtn.innerHTML = `<svg class="kch-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg><span>图谱</span>`;
		graphBtn.addEventListener("click", () => this.plugin.activateVizView());

		const debugBtn = actions.createEl("button", {
			cls: `kch-topbar-btn kch-debug-btn ${this.showDebugLog ? "kch-debug-active" : ""}`,
		});
		debugBtn.innerHTML = `<svg class="kch-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path></svg><span>日志</span>`;
		debugBtn.addEventListener("click", () => {
			this.showDebugLog = !this.showDebugLog;
			this.render();
		});
	}

	private renderQuickActions(container: HTMLElement): void {
		const quickActions = container.createDiv({ cls: "kch-quickbar" });

		const extractBtn = quickActions.createEl("button", { cls: "kch-quickbtn" });
		extractBtn.innerHTML = `<svg class="kch-quickbtn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg><span>提取当前笔记</span>`;
		extractBtn.addEventListener("click", () => this.extractCurrentNote());

		const discussBtn = quickActions.createEl("button", { cls: "kch-quickbtn" });
		discussBtn.innerHTML = `<svg class="kch-quickbtn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg><span>讨论笔记概念</span>`;
		discussBtn.addEventListener("click", () => this.fillDiscussPrompt());
	}

	private renderInput(container: HTMLElement): void {
		const inputArea = container.createDiv({ cls: "kch-input-area" });
		const quickActions = inputArea.createDiv({ cls: "kch-quickbar" });
		this.renderQuickActions(quickActions);

		const inputWrapper = inputArea.createDiv({ cls: "kch-input-wrapper" });
		const textarea = inputWrapper.createEl("textarea", {
			cls: "kch-input",
			attr: { placeholder: this.getInputPlaceholder(), rows: "1" },
		});

		this.renderModelSelector(inputWrapper);

		const sendBtn = inputWrapper.createEl("button", { cls: "kch-send-btn" });
		sendBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22,2 15,22 11,13 2,9 22,2"></polygon></svg>`;
		sendBtn.addEventListener("click", () => {
			this.handleSend(textarea.value);
			textarea.value = "";
		});

		textarea.addEventListener("keydown", (e) => {
			if (e.key === "Enter" && !e.shiftKey) {
				e.preventDefault();
				this.handleSend(textarea.value);
				textarea.value = "";
			}
		});
	}

	private renderModelSelector(wrapper: HTMLElement): void {
		const modelSelector = wrapper.createDiv({ cls: "kch-model-selector" });
		const trigger = modelSelector.createEl("button", { cls: "kch-model-trigger" });
		const activeProfile = this.plugin.getActiveProfile();
		const activeProfileName = activeProfile?.name || "选择模型";

		trigger.innerHTML = `<svg class="kch-model-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2"></polygon></svg><span class="kch-model-name">${activeProfileName}</span><svg class="kch-model-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6,9 12,15 18,9"></polyline></svg>`;
		trigger.addEventListener("click", (e) => { e.stopPropagation(); this.toggleModelPanel(); });

		const panel = modelSelector.createDiv({ cls: `kch-model-panel ${this.modelPanelOpen ? "kch-panel-open" : ""}` });
		panel.createDiv({ cls: "kch-model-panel-header", text: "选择模型" });
		const modelList = panel.createDiv({ cls: "kch-model-list" });
		const configuredProfiles = this.plugin.settings.modelProfiles.filter(p => p.apiKey);
		for (const profile of configuredProfiles) { this.renderModelItem(modelList, profile); }
	}

	private renderModelItem(container: HTMLElement, profile: ModelProfile): void {
		const isActive = profile.id === this.plugin.settings.activeProfileId;
		const item = container.createDiv({ cls: `kch-model-item ${isActive ? "kch-model-item-active" : ""}` });
		item.dataset.modelId = profile.id;

		const getCapabilityBadge = (capName: string): string | null => {
			if (capName === "图形理解") return "图片";
			if (capName === "复杂推理") return "推理";
			return null;
		};

		const left = item.createDiv({ cls: "kch-model-item-left" });
		const nameDiv = left.createDiv({ cls: "kch-model-item-name" });
		nameDiv.setText(profile.name);

		const profileCaps = profile.capabilities || [];
		for (const capName of profileCaps) {
			const badge = getCapabilityBadge(capName);
			if (badge) {
				const badgeEl = nameDiv.createSpan({ cls: "kch-model-capability-badge" });
				badgeEl.setText(badge);
			}
		}

		if (isActive) {
			const svgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			svgEl.setAttribute("viewBox", "0 0 24 24");
			svgEl.setAttribute("fill", "none");
			svgEl.setAttribute("stroke", "currentColor");
			svgEl.setAttribute("stroke-width", "2");
			svgEl.classList.add("kch-model-item-check");
			svgEl.innerHTML = '<polyline points="20,6 9,17 4,12"></polyline>';
			item.appendChild(svgEl);
		}

		const tooltip = item.createDiv({ cls: "kch-model-tooltip" });
		tooltip.createDiv({ cls: "kch-model-tooltip-title", text: profile.name });
		const tooltipCaps = tooltip.createDiv({ cls: "kch-model-tooltip-caps" });
		for (const capName of profileCaps) {
			const cap = MODEL_CAPABILITIES.find(c => c.name === capName);
			const capIcon = getCapabilityIcon(capName);
			if (cap && capIcon) {
				const capItem = tooltipCaps.createDiv({ cls: "capability-item" });
				capItem.innerHTML = `${capIcon}<span>${cap.name}</span>`;
			}
		}

		item.addEventListener("click", async (e) => { e.stopPropagation(); await this.selectModel(profile.id); });
	}

	private async selectModel(modelId: string): Promise<void> {
		this.plugin.settings.activeProfileId = modelId;
		await this.plugin.saveSettings();
		this.plugin.refreshServices();
		this.modelPanelOpen = false;
		this.render();
	}

	private toggleModelPanel(): void { this.modelPanelOpen = !this.modelPanelOpen; this.render(); }

	private bindDocumentClick(container: HTMLElement): void {
		document.addEventListener("click", (e) => {
			const target = e.target as HTMLElement;
			if (!target.closest(".kch-model-selector") && this.modelPanelOpen) {
				this.modelPanelOpen = false; this.render();
			}
		}, { once: true });
	}

	private renderMessages(container: HTMLElement): void {
		const messagesEl = container.createDiv({ cls: "kch-messages" });
		if (this.messages.length === 0) {
			messagesEl.createDiv({ cls: "kch-welcome", text: "粘贴内容或打开笔记，选择技能开始分析" });
			return;
		}
		for (const msg of this.messages) {
			const msgEl = messagesEl.createDiv({ cls: `kch-msg kch-msg-${msg.role}` });
			const contentEl = msgEl.createDiv({ cls: "kch-msg-content" });
			contentEl.setText(msg.content);

			if (msg.pendingOperation) {
				if (msg.pendingOperation.type === "extract-result") this.renderConfirmActions(msgEl, msg);
				else if (msg.pendingOperation.type === "gravity-probe") {/* handled in viz view */}
			}
		}
		messagesEl.scrollTop = messagesEl.scrollHeight;
	}

	private renderConfirmActions(parentEl: HTMLElement, msg: ChatMessage): void {
		const actionsEl = parentEl.createDiv({ cls: "kch-confirm-actions" });
		const confirmBtn = actionsEl.createEl("button", { cls: "kch-btn-primary", text: "✓ 确认保存" });
		confirmBtn.addEventListener("click", async () => {
			const result = msg.pendingOperation?.data as ExtractResult;
			if (result) {
				await this.plugin.processExtractResult(result, this.pendingSourcePath || "pasted-content");
				this.addMessage("system", `✓ 已保存 ${result.concepts.length} 个概念和 ${result.relations.length} 条关系`);
				msg.pendingOperation = undefined; this.render();
			}
		});

		const cancelBtn = actionsEl.createEl("button", { cls: "kch-btn-ghost", text: "✗ 取消" });
		cancelBtn.addEventListener("click", () => {
			this.pendingExtractResult = null; msg.pendingOperation = undefined;
			this.addMessage("system", "已取消"); this.render();
		});
	}

	private addMessage(role: "user" | "assistant" | "system", content: string, pendingOperation?: ChatMessage["pendingOperation"]): string {
		const id = Date.now().toString();
		this.messages.push({ id, role, content, timestamp: new Date().toISOString(), pendingOperation });
		return id;
	}

	private getInputPlaceholder(): string {
		switch (this.currentSkillId) {
			case "ai-chat": return "输入问题，与 AI 讨论笔记内容...";
			case "extract-and-split": return "粘贴内容，或点击「提取当前笔记」...";
			case "find-implicit-links": return "粘贴内容，发现与已有概念的隐含联系...";
			case "discuss-note": return "输入您的问题，AI 结合笔记和知识图谱回答...";
			default: return "输入内容...";
		}
	}

	private async handleSend(input: string): Promise<void> {
		if (!input.trim() || this.isProcessing) return;
		this.addMessage("user", input.trim());
		const activeProfile = this.plugin.getActiveProfile();
		if (!activeProfile?.apiKey) {
			this.addMessage("system", "⚠️ 请先在设置中配置 API Key"); this.render(); return;
		}
		this.isProcessing = true; this.render();
		try {
			switch (this.currentSkillId) {
				case "ai-chat": {
					const content = await this.getActiveContent();
					const response = await this.plugin.skillEngine.executeChat(input, content);
					this.addMessage("assistant", response); break;
				}
				case "extract-and-split": {
					this.addMessage("system", "🧠 正在提取概念和关系..."); this.render();
					const result = await this.plugin.skillEngine.executeExtractAndSplit(input);
					this.showExtractConfirmation(result); break;
				}
				case "gravity-probe": {
					this.addMessage("system", "🔭 正在探测引力关联..."); this.render();
					const existingConcepts = this.plugin.knowledgeIndex.getAllConcepts().map((c) => ({ name: c.name, definition: c.definition }));
					const currentConceptNames = this.extractConceptNamesFromText(input);
					if (currentConceptNames.length === 0) {
						this.addMessage("assistant", "未在输入中找到已知概念，请先提取概念。"); break;
					}
					const allProbes: Array<{ targetConcept: string; gravity: any; reason: string }> = [];
					for (const conceptName of currentConceptNames) {
						const concept = this.plugin.knowledgeIndex.getConcept(conceptName);
						if (!concept) continue;
						const probes = await this.plugin.probeGravity(conceptName);
						allProbes.push(...probes);
					}
					this.showGravityProbeConfirmation(allProbes); break;
				}
				case "discuss-note": {
					this.addMessage("system", "🗣️ 正在分析您的问题并关联逻辑结晶..."); this.render();
					const contentResult = await this.getActiveContent();
					const conceptNames = this.extractConceptNamesFromText(contentResult);
					const relevantCrystals: Array<{ metaConcept: string; description: string }> = [];
					const seenCrystalIds = new Set<string>();
					for (const name of conceptNames) {
						const community = this.plugin.knowledgeIndex.getCommunityForConcept(name);
						if (community) {
							const crystal = this.plugin.knowledgeIndex.getCrystalForNebula(community.id);
							if (crystal && !seenCrystalIds.has(crystal.id)) {
								relevantCrystals.push({ metaConcept: crystal.metaConcept, description: crystal.description });
								seenCrystalIds.add(crystal.id);
							}
						}
					}
					const response = await this.plugin.skillEngine.executeDiscussNote(input, contentResult, relevantCrystals);
					this.addMessage("assistant", response); break;
				}
			}
		} catch (error) {
			this.addMessage("assistant", `❌ 错误\n\n${error instanceof Error ? error.message : String(error)}`);
		} finally { this.isProcessing = false; this.render(); }
	}

	private async extractCurrentNote(): Promise<void> {
		const result = await this.plugin.fileManager.getActiveFileContent();
		if (!result) { new Notice("请先打开一个笔记"); return; }
		const activeProfile = this.plugin.getActiveProfile();
		if (!activeProfile?.apiKey) { this.addMessage("system", "⚠️ 请先在设置中配置 API Key"); this.render(); return; }
		this.currentSkillId = "extract-and-split";
		this.addMessage("user", `提取笔记：${result.filePath}`);
		this.addMessage("system", `🧠 正在提取概念和关系...`);
		this.isProcessing = true; this.render();
		try {
			const extractResult = await this.plugin.skillEngine.executeExtractAndSplit(result.content);
			this.pendingSourcePath = result.filePath;
			this.showExtractConfirmation(extractResult);
		} catch (error) {
			this.addMessage("assistant", `❌ 提取失败\n\n${error instanceof Error ? error.message : String(error)}`);
		} finally { this.isProcessing = false; this.render(); }
	}

		private fillDiscussPrompt(): void { this.currentSkillId = "discuss-note"; new Notice("已选择讨论笔记模式，请输入您的问题..."); }

	private showExtractConfirmation(result: ExtractResult): void {
		const concepts = Array.isArray(result.concepts) ? result.concepts : [];
		const relations = Array.isArray(result.relations) ? result.relations : [];
		const tags = Array.isArray(result.tags) ? result.tags : [];
		const summary = result.summary || "";
		const safeResult: ExtractResult = { concepts, relations, tags, summary };
		this.pendingExtractResult = safeResult;
		let text = `📋 **提取结果**\n\n**概念** (${concepts.length}个)：\n`;
		for (const c of concepts) {
			text += `  • ${c.name || "未命名"}：${c.definition || ""}`;
			if (c.firstPrinciples && c.firstPrinciples.length > 0) {
				text += `\n    底层规律: ${c.firstPrinciples.join(", ")}`;
			}
			text += "\n";
		}
		text += `\n**关系** (${relations.length}条)：\n`;
		for (const r of relations) {
			const g = r.gravity || {};
			const directionText = (g.direction ?? 0) > 0 ? "吸引" : "排斥";
			text += `  • ${r.from || "?"} → ${r.to || "?"} (引力: ${(g.strength ?? 0).toFixed(2)}, ${directionText})`;
			if (g.dimensions && g.dimensions.length > 0) {
				text += `\n    维度: ${g.dimensions.join(", ")}`;
			}
			if (g.context) {
				text += `\n    原因: ${g.context}`;
			}
			text += "\n";
		}
		text += `\n**摘要**：${summary}\n\n---\n点击下方按钮确认保存。`;
		this.addMessage("assistant", text, { type: "extract-result", data: safeResult });
	}

	private showGravityProbeConfirmation(probes: Array<{ targetConcept: string; gravity: any; reason: string }>): void {
		if (probes.length === 0) { this.addMessage("assistant", "未发现引力关联。"); return; }
		let text = `🔭 **发现 ${probes.length} 条引力关联**\n\n`;
		for (const probe of probes) {
			const directionText = (probe.gravity?.direction ?? 1) > 0 ? "吸引" : "排斥";
			text += `  • ${probe.targetConcept || "?"} (引力: ${(probe.gravity?.strength ?? 0).toFixed(2)}, ${directionText})\n    原因：${probe.reason || ""}\n`;
		}
		this.addMessage("assistant", text, { type: "gravity-probe", data: { probes } });
	}

	private async getActiveContent(): Promise<string> { const result = await this.plugin.fileManager.getActiveFileContent(); return result?.content || ""; }

	private extractConceptNamesFromText(text: string): string[] {
		const concepts = this.plugin.knowledgeIndex.getAllConcepts();
		const names: string[] = [];
		for (const concept of concepts) {
			if (text.includes(concept.name)) names.push(concept.name);
			for (const alias of concept.aliases) if (text.includes(alias)) { names.push(concept.name); break; }
		}
		return [...new Set(names)];
	}

	private renderDebugLogPanel(container: HTMLElement): void {
		const panel = container.createDiv({ cls: "kch-debug-panel" });
		const header = panel.createDiv({ cls: "kch-debug-header" });
		header.createEl("span", { text: "🔍 LLM 请求日志" });
		const clearBtn = header.createEl("button", { cls: "kch-debug-clear", text: "清空" });
		clearBtn.addEventListener("click", () => { this.plugin.llmService.clearLogs(); this.renderDebugLog(); });
		const logs = this.plugin.llmService.getLogs();
		if (logs.length === 0) { panel.createDiv({ cls: "kch-debug-empty", text: "暂无请求记录" }); return; }
		const listEl = panel.createDiv({ cls: "kch-debug-list" });
		for (let i = logs.length - 1; i >= 0; i--) {
			const entry = logs[i];
			const entryEl = listEl.createDiv({ cls: `kch-debug-entry kch-debug-${entry.direction}` });
			const time = new Date(entry.timestamp).toLocaleTimeString();
			const icon = entry.direction === "request" ? "📤" : entry.direction === "response" ? "📥" : "❌";
			const summaryEl = entryEl.createDiv({ cls: "kch-debug-summary" });
			summaryEl.createEl("span", { cls: "kch-debug-icon", text: icon });
			summaryEl.createEl("span", { cls: "kch-debug-time", text: time });
			summaryEl.createEl("span", { cls: "kch-debug-text", text: entry.summary });
			const detailEl = entryEl.createDiv({ cls: "kch-debug-detail" });
			detailEl.setText(entry.detail); detailEl.hide();
			summaryEl.addEventListener("click", () => { detailEl.toggle(!detailEl.hidden); });
		}
	}

	private renderDebugLog(): void {
		const container = this.containerEl.children[1] as HTMLElement;
		const existing = container.querySelector(".kch-debug-panel");
		if (existing) existing.remove();
		if (this.showDebugLog) this.renderDebugLogPanel(container);
	}
}

function getCapabilityIcon(capName: string): string {
	switch (capName) {
		case "知识提取": return "⭐";
		case "复杂推理": return "🧠";
		case "图形理解": return "🖼️";
		case "日常首选": return "⭐";
		case "最省钱": return "💴";
		case "日常对话": return "💬";
		case "本地代理": return "🔌";
		default: return "🔹";
	}
}
