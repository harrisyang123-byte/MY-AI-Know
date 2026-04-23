import { ItemView, WorkspaceLeaf, Notice, Setting } from "obsidian";
import type KnowledgePlugin from "./main";
import type {
	ConceptEntry,
	Relation,
	Community,
	GravityVector,
	KnowledgeProton,
	ConceptNebula,
	LogicalCrystal,
	GraphFilter,
} from "./types";
import { NebulaFormer } from "./nebulaFormer";

export const KNOWLEDGE_VIZ_VIEW = "knowledge-viz-view";

interface ForceNode {
	id: string;
	x: number;
	y: number;
	vx: number;
	vy: number;
	radius: number;
	proton?: KnowledgeProton;
	opacity: number;
	scale: number;
	isHovered: boolean;
	notePath: string;
	linkCount: number;
	nebulaId: string | null;
}

interface ForceEdge {
	id: string;
	source: string;
	target: string;
	gravity: GravityVector;
}

interface CelestialBody {
	id: string;
	nebulaId: string;
	metaConcept: string;
	description: string;
	maturity: number;
	coherenceScore: number;
	exampleCount: number;
	state: "forming" | "stable" | "shattering" | "dissolved";
	centerX: number;
	centerY: number;
	radius: number;
	protonIds: string[];
	color: string;
}

interface VizSettings {
	nodeSize: number;
	lineWidth: number;
	textOpacity: number;
	centerForce: number;
	repelForce: number;
	linkForce: number;
	linkDistance: number;
}

const DEFAULT_VIZ_SETTINGS: VizSettings = {
	nodeSize: 4,
	lineWidth: 1,
	textOpacity: 0.7,
	centerForce: 0.02,
	repelForce: 300,
	linkForce: 0.05,
	linkDistance: 120,
};

const NEBULA_PALETTE = [
	{ r: 60, g: 120, b: 200 },
	{ r: 160, g: 80, b: 180 },
	{ r: 80, g: 160, b: 120 },
	{ r: 180, g: 120, b: 60 },
	{ r: 120, g: 80, b: 180 },
	{ r: 80, g: 140, b: 160 },
	{ r: 160, g: 100, b: 120 },
	{ r: 100, g: 160, b: 80 },
];

const CELESTIAL_PALETTE = [
	{ r: 255, g: 210, b: 120 },
	{ r: 190, g: 170, b: 255 },
	{ r: 120, g: 230, b: 190 },
	{ r: 255, g: 150, b: 170 },
	{ r: 170, g: 210, b: 255 },
	{ r: 230, g: 190, b: 110 },
];

export class KnowledgeVizView extends ItemView {
	private plugin: KnowledgePlugin;
	private canvas: HTMLCanvasElement | null = null;
	private ctx: CanvasRenderingContext2D | null = null;
	private nodes: ForceNode[] = [];
	private edges: ForceEdge[] = [];
	private nebulas: ConceptNebula[] = [];
	private celestials: CelestialBody[] = [];
	private alpha = 1.0;
	private animFrameId = 0;
	private selectedConcept: string | null = null;
	private dragNode: ForceNode | null = null;
	private isDragging = false;
	private panX = 0;
	private panY = 0;
	private zoom = 1;
	private isPanning = false;
	private lastMouseX = 0;
	private lastMouseY = 0;
	private hoveredNode: ForceNode | null = null;
	private lastTickTime = 0;
	private settings: VizSettings = { ...DEFAULT_VIZ_SETTINGS };
	private showSettingsPanel = false;
	private settingsEl: HTMLElement | null = null;
	private sidebarEl: HTMLElement | null = null;
	private showSidebar = false;
	private filter: GraphFilter;
	private highlightedNodes: Set<string> = new Set();
	private highlightedEdges: Set<string> = new Set();
	private clickTimer: ReturnType<typeof setTimeout> | null = null;
	private nebulaColorMap: Map<string, number> = new Map();
	private celestialColorMap: Map<string, number> = new Map();
	private animTime = 0;
	private gravityProbePending = false;
	private logicalWidth = 800;
	private logicalHeight = 600;

	constructor(leaf: WorkspaceLeaf, plugin: KnowledgePlugin) {
		super(leaf);
		this.plugin = plugin;
		this.filter = { ...plugin.settings.defaultFilter };
	}

	getViewType(): string { return KNOWLEDGE_VIZ_VIEW; }
	getDisplayText(): string { return "知识图谱"; }
	getIcon(): string { return "graph"; }

	async onOpen(): Promise<void> {
		const container = this.containerEl.children[1] as HTMLElement;
		container.empty();
		container.addClass("kgraph-container");

		this.renderToolbar(container);

		const canvasWrapper = container.createDiv({ cls: "kgraph-canvas-wrapper" });
		this.canvas = canvasWrapper.createEl("canvas", { cls: "kgraph-canvas" });
		this.ctx = this.canvas.getContext("2d");

		this.settingsEl = container.createDiv({ cls: "kgraph-settings-panel" });
		this.settingsEl.style.display = "none";
		this.renderSettingsPanel();

		this.sidebarEl = container.createDiv({ cls: "kgraph-sidebar" });
		this.sidebarEl.style.display = "none";

		this.setupCanvasEvents();
		this.ensureCanvasReady();

		this.registerEvent(
			this.app.vault.on("delete", (file) => {
				if (file.path.startsWith("概念/") && "basename" in file) {
					const name = (file as any).basename;
					this.plugin.knowledgeIndex.removeConcept(name);
					this.buildGraphData();
					this.alpha = 1.0;
				}
			})
		);

		this.registerEvent(
			this.app.vault.on("rename", (file, oldPath) => {
				if (file.path.startsWith("概念/") && "basename" in file) {
					this.buildGraphData();
					this.alpha = 1.0;
				}
			})
		);

		window.addEventListener("resize", () => this.resizeCanvas());
	}

	private ensureCanvasReady(): void {
		this.resizeCanvas();
		if (this.canvas && this.logicalWidth > 0 && this.logicalHeight > 0) {
			this.buildGraphData();
			this.startSimulation();
		} else {
			setTimeout(() => this.ensureCanvasReady(), 100);
		}
	}

	async onClose(): Promise<void> {
		if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
		window.removeEventListener("resize", () => this.resizeCanvas());
	}

	refreshGraph(): void {
		this.resizeCanvas();
		this.buildGraphData();
		this.alpha = 1.0;
	}

	private renderToolbar(container: HTMLElement): void {
		const toolbar = container.createDiv({ cls: "kgraph-toolbar" });

		const leftGroup = toolbar.createDiv({ cls: "kgraph-toolbar-group" });

		const refreshBtn = leftGroup.createEl("button", { text: "刷新", cls: "kgraph-btn" });
		refreshBtn.addEventListener("click", () => {
			this.buildGraphData();
			this.alpha = 1.0;
		});

		const probeBtn = leftGroup.createEl("button", { text: "探测引力", cls: "kgraph-btn" });
		probeBtn.addEventListener("click", () => this.handleGravityProbe());

		const centerGroup = toolbar.createDiv({ cls: "kgraph-toolbar-group" });
		const searchInput = centerGroup.createEl("input", {
			cls: "kgraph-search",
			attr: { placeholder: "搜索概念...", type: "text" },
		});
		searchInput.addEventListener("input", () => {
			const query = searchInput.value.trim().toLowerCase();
			if (query) {
				this.highlightedNodes.clear();
				this.highlightedEdges.clear();
				for (const n of this.nodes) {
					if (n.id.toLowerCase().includes(query)) {
						this.selectedConcept = n.id;
						this.highlightedNodes.add(n.id);
						for (const edge of this.edges) {
							if (edge.source === n.id || edge.target === n.id) {
								this.highlightedNodes.add(edge.source);
								this.highlightedNodes.add(edge.target);
								this.highlightedEdges.add(edge.id);
							}
						}
					}
				}
			} else {
				this.selectedConcept = null;
				this.highlightedNodes.clear();
				this.highlightedEdges.clear();
			}
		});

		const rightGroup = toolbar.createDiv({ cls: "kgraph-toolbar-group" });

		const sidebarBtn = rightGroup.createEl("button", { text: "☰", cls: "kgraph-btn" });
		sidebarBtn.addEventListener("click", () => {
			this.showSidebar = !this.showSidebar;
			if (this.sidebarEl) {
				this.sidebarEl.style.display = this.showSidebar ? "block" : "none";
				if (this.showSidebar) this.renderSidebar();
			}
		});

		const settingsBtn = rightGroup.createEl("button", { text: "⚙", cls: "kgraph-btn" });
		settingsBtn.addEventListener("click", () => {
			this.showSettingsPanel = !this.showSettingsPanel;
			if (this.settingsEl) {
				this.settingsEl.style.display = this.showSettingsPanel ? "block" : "none";
			}
		});
	}

	private renderSettingsPanel(): void {
		if (!this.settingsEl) return;
		const el = this.settingsEl;
		el.empty();

		el.createEl("h4", { text: "外观", cls: "kgraph-settings-heading" });

		new Setting(el)
			.setName("文本透明度")
			.setClass("kgraph-setting-item")
			.addSlider(s => s
				.setLimits(0, 1, 0.1)
				.setValue(this.settings.textOpacity)
				.setDynamicTooltip()
				.onChange(v => { this.settings.textOpacity = v; }));

		new Setting(el)
			.setName("质子节点大小")
			.setClass("kgraph-setting-item")
			.addSlider(s => s
				.setLimits(1, 12, 0.5)
				.setValue(this.settings.nodeSize)
				.setDynamicTooltip()
				.onChange(v => {
					this.settings.nodeSize = v;
					this.rebuildNodeRadii();
				}));

		new Setting(el)
			.setName("连线粗细")
			.setClass("kgraph-setting-item")
			.addSlider(s => s
				.setLimits(0.5, 5, 0.5)
				.setValue(this.settings.lineWidth)
				.setDynamicTooltip()
				.onChange(v => { this.settings.lineWidth = v; }));

		el.createEl("h4", { text: "力度", cls: "kgraph-settings-heading" });

		new Setting(el)
			.setName("向心力")
			.setClass("kgraph-setting-item")
			.addSlider(s => s
				.setLimits(0.001, 0.1, 0.001)
				.setValue(this.settings.centerForce)
				.setDynamicTooltip()
				.onChange(v => { this.settings.centerForce = v; this.alpha = 0.5; }));

		new Setting(el)
			.setName("节点排斥力")
			.setClass("kgraph-setting-item")
			.addSlider(s => s
				.setLimits(50, 1000, 10)
				.setValue(this.settings.repelForce)
				.setDynamicTooltip()
				.onChange(v => { this.settings.repelForce = v; this.alpha = 0.5; }));

		new Setting(el)
			.setName("相连节点吸引力")
			.setClass("kgraph-setting-item")
			.addSlider(s => s
				.setLimits(0.01, 0.2, 0.01)
				.setValue(this.settings.linkForce)
				.setDynamicTooltip()
				.onChange(v => { this.settings.linkForce = v; this.alpha = 0.5; }));

		new Setting(el)
			.setName("连线长度")
			.setClass("kgraph-setting-item")
			.addSlider(s => s
				.setLimits(50, 300, 10)
				.setValue(this.settings.linkDistance)
				.setDynamicTooltip()
				.onChange(v => { this.settings.linkDistance = v; this.alpha = 0.5; }));
	}

	private rebuildNodeRadii(): void {
		for (const n of this.nodes) {
			const baseSize = this.settings.nodeSize;
			const sizeBoost = Math.min(n.linkCount * 0.5, 6);
			n.radius = baseSize + sizeBoost;
		}
	}

	private renderSidebar(): void {
		if (!this.sidebarEl) return;
		const el = this.sidebarEl;
		el.empty();

		const headerEl = el.createDiv({ cls: "kgraph-sidebar-header" });
		headerEl.createEl("span", { text: "星云 & 天体" });
		const closeBtn = headerEl.createEl("button", { text: "✕", cls: "kgraph-sidebar-close" });
		closeBtn.addEventListener("click", () => {
			this.showSidebar = false;
			this.sidebarEl!.style.display = "none";
		});

		const nebulaSection = el.createDiv({ cls: "kgraph-sidebar-section" });
		nebulaSection.createEl("h5", { text: "星云", cls: "kgraph-sidebar-title" });
		let hasNebula = false;
		for (const nebula of this.nebulas) {
			if (nebula.protons.length < 2) continue;
			hasNebula = true;
			const item = nebulaSection.createDiv({ cls: "kgraph-sidebar-item" });
			const nameRow = item.createDiv({ cls: "kgraph-sidebar-name-row" });
			const nameInput = nameRow.createEl("input", {
				cls: "kgraph-sidebar-input",
				attr: { value: nebula.id.replace("nebula_", ""), placeholder: "星云名称" },
			});
			nameInput.addEventListener("change", () => {
				nebula.id = `nebula_${nameInput.value}`;
			});
			const info = item.createDiv({ cls: "kgraph-sidebar-info" });
			info.textContent = `${nebula.protons.length} 质子 · 内聚 ${(nebula.cohesionStrength || 0).toFixed(2)} · 稳定 ${(nebula.stability || 0).toFixed(2)}`;
		}
		if (!hasNebula) {
			nebulaSection.createDiv({ cls: "kgraph-sidebar-empty", text: "暂无星云" });
		}

		const celestialSection = el.createDiv({ cls: "kgraph-sidebar-section" });
		celestialSection.createEl("h5", { text: "天体", cls: "kgraph-sidebar-title" });
		if (this.celestials.length === 0) {
			celestialSection.createDiv({ cls: "kgraph-sidebar-empty", text: "暂无天体（星云成熟后形成）" });
		}
		for (const celestial of this.celestials) {
			const item = celestialSection.createDiv({ cls: "kgraph-sidebar-item" });
			const nameRow = item.createDiv({ cls: "kgraph-sidebar-name-row" });
			const nameInput = nameRow.createEl("input", {
				cls: "kgraph-sidebar-input",
				attr: { value: celestial.metaConcept, placeholder: "天体名称" },
			});
			nameInput.addEventListener("change", () => {
				celestial.metaConcept = nameInput.value;
			});
			const stateRow = item.createDiv({ cls: "kgraph-sidebar-state" });
			const stateLabel = stateRow.createEl("span", { text: "状态: ", cls: "kgraph-sidebar-label" });
			const stateSelect = stateRow.createEl("select", { cls: "kgraph-sidebar-select" });
			const stateLabels: Record<string, string> = {
				forming: "形成中",
				stable: "稳定",
				shattering: "破碎中",
				dissolved: "已消散",
			};
			for (const s of ["forming", "stable", "shattering", "dissolved"] as const) {
				const opt = stateSelect.createEl("option", { text: stateLabels[s], attr: { value: s } });
				if (s === celestial.state) opt.selected = true;
			}
			stateSelect.addEventListener("change", () => {
				celestial.state = stateSelect.value as CelestialBody["state"];
			});
			const confirmRow = item.createDiv({ cls: "kgraph-sidebar-state" });
			const confirmLabel = confirmRow.createEl("span", { text: "确认: ", cls: "kgraph-sidebar-label" });
			const confirmBtn = confirmRow.createEl("button", {
				cls: "kgraph-sidebar-confirm-btn",
				text: celestial.state === "stable" ? "已确认" : "确认稳定",
			});
			if (celestial.state === "stable") {
				confirmBtn.classList.add("confirmed");
			}
			confirmBtn.addEventListener("click", () => {
				celestial.state = "stable";
				confirmBtn.textContent = "已确认";
				confirmBtn.classList.add("confirmed");
				new Notice(`天体「${celestial.metaConcept}」已确认为稳定状态`);
			});
			const info = item.createDiv({ cls: "kgraph-sidebar-info" });
			info.textContent = `成熟度 ${(celestial.maturity || 0).toFixed(2)} · 一致性 ${(celestial.coherenceScore || 0).toFixed(2)} · ${celestial.protonIds.length} 质子`;
		}
	}

	private handleGravityProbe(): void {
		if (!this.selectedConcept) {
			new Notice("请先单击选中一个质子");
			return;
		}
		if (this.gravityProbePending) {
			new Notice("引力探测正在进行中...");
			return;
		}
		const conceptName = this.selectedConcept;
		this.gravityProbePending = true;
		new Notice(`正在探测「${conceptName}」的引力...`);
		this.plugin.probeGravity(conceptName).then(probes => {
			this.gravityProbePending = false;
			if (probes.length === 0) {
				new Notice("未发现引力关联");
			} else {
				this.showGravityProbeResults(conceptName, probes);
			}
		}).catch(e => {
			this.gravityProbePending = false;
			new Notice(`探测失败: ${e.message}`);
		});
	}

	private showGravityProbeResults(sourceConcept: string, probes: Array<{ targetConcept: string; gravity: any; reason: string }>): void {
		const backdrop = document.createElement("div");
		backdrop.className = "kgraph-modal-backdrop";
		backdrop.addEventListener("click", () => {
			if (backdrop.parentNode) document.body.removeChild(backdrop);
			if (modal.parentNode) document.body.removeChild(modal);
		});

		const modal = document.createElement("div");
		modal.className = "kgraph-modal";

		const header = document.createElement("div");
		header.className = "kgraph-modal-header";
		header.textContent = `引力探测结果 (${probes.length}条)`;
		modal.appendChild(header);

		const desc = document.createElement("div");
		desc.className = "kgraph-modal-desc";
		desc.textContent = `概念「${sourceConcept}」与以下概念存在引力关联：`;
		modal.appendChild(desc);

		const listContainer = document.createElement("div");
		listContainer.className = "kgraph-modal-list";
		modal.appendChild(listContainer);

		const selectedIndices = new Set<number>();

		probes.forEach((probe, index) => {
			const gravity = probe.gravity || {};
			const directionText = (gravity.direction ?? 0) > 0 ? "吸引" : "排斥";
			const strength = (gravity.strength ?? 0).toFixed(2);

			const item = document.createElement("div");
			item.className = "kgraph-modal-item";

			const topRow = document.createElement("div");
			topRow.className = "kgraph-modal-item-top";

			const checkbox = document.createElement("input");
			checkbox.type = "checkbox";
			checkbox.checked = true;
			checkbox.style.marginRight = "10px";
			checkbox.addEventListener("change", () => {
				if (checkbox.checked) selectedIndices.add(index);
				else selectedIndices.delete(index);
				confirmBtn.textContent = `添加选中的 ${selectedIndices.size} 条关系`;
			});
			selectedIndices.add(index);

			const info = document.createElement("div");
			info.innerHTML = `<strong>${probe.targetConcept}</strong> <span style="margin-left:8px;">引力: ${strength}</span> <span style="color:${directionText === "吸引" ? "#7ed321" : "#ff5a5a"};margin-left:8px;">${directionText}</span>`;

			topRow.appendChild(checkbox);
			topRow.appendChild(info);
			item.appendChild(topRow);

			if (gravity.context || probe.reason) {
				const details = document.createElement("div");
				details.className = "kgraph-modal-item-detail";
				details.textContent = gravity.context || probe.reason || "";
				item.appendChild(details);
			}

			listContainer.appendChild(item);
		});

		const buttonRow = document.createElement("div");
		buttonRow.className = "kgraph-modal-buttons";

		const cancelBtn = document.createElement("button");
		cancelBtn.textContent = "取消";
		cancelBtn.className = "kgraph-modal-btn kgraph-modal-btn-cancel";
		cancelBtn.addEventListener("click", () => {
			if (backdrop.parentNode) document.body.removeChild(backdrop);
			if (modal.parentNode) document.body.removeChild(modal);
		});

		const confirmBtn = document.createElement("button");
		confirmBtn.textContent = `添加选中的 ${selectedIndices.size} 条关系`;
		confirmBtn.className = "kgraph-modal-btn kgraph-modal-btn-confirm";
		confirmBtn.addEventListener("click", () => {
			const selectedProbes = probes.filter((_, idx) => selectedIndices.has(idx));
			this.addGravityRelations(sourceConcept, selectedProbes);
			if (backdrop.parentNode) document.body.removeChild(backdrop);
			if (modal.parentNode) document.body.removeChild(modal);
		});

		buttonRow.appendChild(cancelBtn);
		buttonRow.appendChild(confirmBtn);
		modal.appendChild(buttonRow);

		document.body.appendChild(backdrop);
		document.body.appendChild(modal);
	}

	private async addGravityRelations(sourceConcept: string, probes: Array<{ targetConcept: string; gravity: any; reason: string }>): Promise<void> {
		if (probes.length === 0) return;
		try {
			const relations = probes.map(probe => ({
				from: sourceConcept,
				to: probe.targetConcept,
				gravity: {
					strength: probe.gravity?.strength ?? 0.5,
					direction: probe.gravity?.direction ?? 1.0,
					dimensions: probe.gravity?.dimensions ?? ["逻辑"],
					context: probe.gravity?.context || probe.reason || "引力探测发现",
					computedAt: new Date().toISOString(),
					confidence: probe.gravity?.confidence ?? 0.7,
				},
				source: "gravity-probe",
			}));

			await this.plugin.knowledgeIndex.addRelations(relations);
			new Notice(`成功添加 ${relations.length} 条引力关系`);

			const allRelations = this.plugin.knowledgeIndex.getRelations();
			const communities = this.plugin.knowledgeIndex.getCommunities();

			const sourceConceptEntry = this.plugin.knowledgeIndex.getConcept(sourceConcept);
			if (sourceConceptEntry) {
				await this.plugin.fileManager.writeConceptNote(sourceConceptEntry, allRelations, communities);
			}

			for (const probe of probes) {
				const targetConceptEntry = this.plugin.knowledgeIndex.getConcept(probe.targetConcept);
				if (targetConceptEntry) {
					await this.plugin.fileManager.writeConceptNote(targetConceptEntry, allRelations, communities);
				}
			}

			this.buildGraphData();
			this.alpha = 1.0;
		} catch (error) {
			new Notice(`添加关系失败: ${error instanceof Error ? error.message : String(error)}`);
		}
	}

	private assignNebulaColors(): void {
		this.nebulaColorMap.clear();
		this.nebulas.forEach((nebula, i) => {
			this.nebulaColorMap.set(nebula.id, i % NEBULA_PALETTE.length);
		});
	}

	private assignCelestialColors(): void {
		this.celestialColorMap.clear();
		this.celestials.forEach((celestial, i) => {
			this.celestialColorMap.set(celestial.id, i % CELESTIAL_PALETTE.length);
		});
	}

	private buildGraphData(): void {
		const data = this.plugin.knowledgeIndex.getData();

		const protons = Object.values(data.concepts).map(c => ({
			id: c.name,
			conceptName: c.name,
			content: c.definition,
			firstPrinciples: c.firstPrinciples || [],
			centrality: c.centrality || 0,
			abstractness: c.abstractness || 0,
			sourceNotePath: c.notePath,
			extractedAt: c.extractedAt,
		} as KnowledgeProton));

		const relations = data.relations;

		const canvasWidth = this.logicalWidth || 800;
		const canvasHeight = this.logicalHeight || 600;

		const linkCounts = new Map<string, number>();
		for (const r of relations) {
			linkCounts.set(r.from, (linkCounts.get(r.from) || 0) + 1);
			linkCounts.set(r.to, (linkCounts.get(r.to) || 0) + 1);
		}

		const oldPositions = new Map<string, { x: number; y: number }>();
		for (const n of this.nodes) {
			oldPositions.set(n.id, { x: n.x, y: n.y });
		}

		this.nodes = protons.map(p => {
			const oldPos = oldPositions.get(p.id);
			const links = linkCounts.get(p.id) || 0;
			const baseSize = this.settings.nodeSize;
			const sizeBoost = Math.min(links * 0.5, 6);
			const radius = baseSize + sizeBoost;
			return {
				id: p.id,
				x: oldPos ? oldPos.x : canvasWidth / 2 + (Math.random() - 0.5) * 200,
				y: oldPos ? oldPos.y : canvasHeight / 2 + (Math.random() - 0.5) * 200,
				vx: 0, vy: 0,
				radius: isFinite(radius) ? radius : baseSize,
				proton: p,
				opacity: 1, scale: 1, isHovered: false,
				notePath: p.sourceNotePath || `概念/${p.id}.md`,
				linkCount: links,
				nebulaId: null,
			};
		});

		this.edges = relations
			.filter(r => r.gravity.strength >= (this.filter.minConfidence || 0))
			.map(r => ({
				id: r.id,
				source: r.from,
				target: r.to,
				gravity: r.gravity,
			}));

		try {
			this.nebulas = NebulaFormer.formNebulas(protons, relations);
		} catch (e) {
			console.error("[buildGraphData] NebulaFormer failed:", e);
			this.nebulas = [];
		}

		for (const nebula of this.nebulas) {
			for (const protonId of nebula.protons) {
				const node = this.nodes.find(n => n.id === protonId);
				if (node) node.nebulaId = nebula.id;
			}
		}

		this.assignNebulaColors();
		this.buildCelestials(data);
		this.assignCelestialColors();

		if (this.showSidebar) this.renderSidebar();
	}

	private buildCelestials(data: any): void {
		this.celestials = [];
		const crystals = data.crystals || {};

		for (const nebula of this.nebulas) {
			if (nebula.protons.length < 3) continue;

			const cohesion = nebula.cohesionStrength || 0;
			const stability = nebula.stability || 0;
			const maturity = Math.min(1, 0.5 * cohesion + 0.3 * stability + 0.2 * Math.min(1, nebula.protons.length / 8));

			const crystalKey = Object.keys(crystals).find(k => crystals[k].nebulaId === nebula.id);
			if (!crystalKey && (maturity < 0.4 || cohesion < 0.3)) continue;

			let metaConcept = "";
			let description = "";
			let state: CelestialBody["state"] = "forming";
			let coherenceScore = cohesion;
			let crystalMaturity = maturity;

			if (crystalKey) {
				const crystal = crystals[crystalKey];
				metaConcept = crystal.metaConcept || "";
				description = crystal.description || "";
				state = crystal.state || "forming";
				coherenceScore = crystal.coherenceScore || cohesion;
				crystalMaturity = crystal.maturity || maturity;
			} else {
				metaConcept = nebula.id.replace("nebula_", "");
				description = `由 ${nebula.protons.length} 个质子聚合`;
				if (crystalMaturity >= 0.7 && coherenceScore >= 0.5) {
					state = "stable";
				} else if (crystalMaturity >= 0.4) {
					state = "forming";
				} else {
					continue;
				}
			}

			const colorIdx = this.nebulaColorMap.get(nebula.id) || 0;
			const palette = CELESTIAL_PALETTE[colorIdx % CELESTIAL_PALETTE.length];

			this.celestials.push({
				id: `celestial_${nebula.id}`,
				nebulaId: nebula.id,
				metaConcept,
				description,
				maturity: crystalMaturity,
				coherenceScore,
				exampleCount: nebula.protons.length,
				state,
				centerX: 0,
				centerY: 0,
				radius: 0,
				protonIds: [...nebula.protons],
				color: `rgb(${palette.r},${palette.g},${palette.b})`,
			});
		}
	}

	private startSimulation(): void {
		if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
		this.tick();
	}

	private tick(): void {
		const now = Date.now();
		const dt = this.lastTickTime ? Math.min(0.032, (now - this.lastTickTime) / 1000) : 0.016;
		this.lastTickTime = now;
		this.animTime += dt;

		if (this.alpha > 0.005) {
			this.applyForces(dt);
			this.alpha *= 0.995;
		}

		this.resolveCollisions();
		this.updateNebulaCentroids();
		this.resolveNebulaOverlaps();
		this.updateCelestialPositions();
		this.resolveCelestialOverlaps();
		this.renderCanvas();
		this.animFrameId = requestAnimationFrame(() => this.tick());
	}

	private applyForces(dt: number): void {
		const W = this.logicalWidth || 800;
		const H = this.logicalHeight || 600;
		const cx = W / 2;
		const cy = H / 2;
		const REPULSION = this.settings.repelForce * this.alpha;
		const ATTRACTION = this.settings.linkForce * this.alpha;
		const CENTER_PULL = this.settings.centerForce * this.alpha;
		const DAMPING = 0.85;
		const MAX_SPEED = 20;

		for (let i = 0; i < this.nodes.length; i++) {
			for (let j = i + 1; j < this.nodes.length; j++) {
				const a = this.nodes[i];
				const b = this.nodes[j];
				if (!isFinite(a.x) || !isFinite(a.y) || !isFinite(b.x) || !isFinite(b.y)) continue;
				const dx = b.x - a.x;
				const dy = b.y - a.y;
				const distSq = dx * dx + dy * dy;
				const dist = Math.sqrt(distSq) || 1;
				const minDist = a.radius + b.radius + 4;
				const effectiveRepulsion = dist < minDist ? REPULSION * 5 : REPULSION;
				const force = effectiveRepulsion / (distSq + 100);
				const fx = (dx / dist) * force;
				const fy = (dy / dist) * force;
				a.vx -= fx; a.vy -= fy;
				b.vx += fx; b.vy += fy;
			}
		}

		for (const edge of this.edges) {
			const s = this.nodes.find(n => n.id === edge.source);
			const t = this.nodes.find(n => n.id === edge.target);
			if (!s || !t) continue;
			if (!isFinite(s.x) || !isFinite(s.y) || !isFinite(t.x) || !isFinite(t.y)) continue;

			const dx = t.x - s.x;
			const dy = t.y - s.y;
			const dist = Math.sqrt(dx * dx + dy * dy) || 1;
			const targetDist = this.settings.linkDistance;
			const strength = edge.gravity.strength * ATTRACTION;
			const force = (dist - targetDist) * strength;
			const direction = Math.max(0, Math.min(1, edge.gravity.direction));
			const fx = (dx / dist) * force * direction;
			const fy = (dy / dist) * force * direction;

			if (isFinite(fx) && isFinite(fy)) {
				s.vx += fx; s.vy += fy;
				t.vx -= fx; t.vy -= fy;
			}
		}

		for (const n of this.nodes) {
			if (!isFinite(n.x) || !isFinite(n.y)) {
				n.x = cx; n.y = cy; n.vx = 0; n.vy = 0;
				continue;
			}

			n.vx += (cx - n.x) * CENTER_PULL;
			n.vy += (cy - n.y) * CENTER_PULL;

			n.vx *= DAMPING;
			n.vy *= DAMPING;

			const speed = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
			if (speed > MAX_SPEED) {
				n.vx = (n.vx / speed) * MAX_SPEED;
				n.vy = (n.vy / speed) * MAX_SPEED;
			}

			n.x += n.vx;
			n.y += n.vy;

			const margin = 50;
			n.x = Math.max(-margin, Math.min(W + margin, n.x));
			n.y = Math.max(-margin, Math.min(H + margin, n.y));
		}
	}

	private resolveCollisions(): void {
		const iterations = 30;
		const MIN_GAP = 12;
		for (let iter = 0; iter < iterations; iter++) {
			let anyOverlap = false;
			for (let i = 0; i < this.nodes.length; i++) {
				for (let j = i + 1; j < this.nodes.length; j++) {
					const a = this.nodes[i];
					const b = this.nodes[j];
					if (!isFinite(a.x) || !isFinite(a.y) || !isFinite(b.x) || !isFinite(b.y)) continue;

					const dx = b.x - a.x;
					const dy = b.y - a.y;
					const dist = Math.sqrt(dx * dx + dy * dy) || 0.01;
					const minDist = a.radius + b.radius + MIN_GAP;

					if (dist < minDist) {
						anyOverlap = true;
						const overlap = minDist - dist;
						const nx = dx / dist;
						const ny = dy / dist;
						const pushX = nx * overlap * 0.6;
						const pushY = ny * overlap * 0.6;

						if (!this.isDragging || (this.dragNode !== a && this.dragNode !== b)) {
							a.x -= pushX;
							a.y -= pushY;
							b.x += pushX;
							b.y += pushY;
						}

						a.vx *= 0.01;
						a.vy *= 0.01;
						b.vx *= 0.01;
						b.vy *= 0.01;
					}
				}
			}
			if (!anyOverlap) break;
		}
	}

	private updateNebulaCentroids(): void {
		for (const nebula of this.nebulas) {
			let tx = 0, ty = 0, count = 0;
			const points: Array<{ x: number; y: number }> = [];
			for (const protonRef of nebula.protons) {
				const protonId = typeof protonRef === "string" ? protonRef : (protonRef as any).conceptName || (protonRef as any).id;
				const n = this.nodes.find(node => node.id === protonId);
				if (n && isFinite(n.x) && isFinite(n.y)) {
					tx += n.x; ty += n.y; count++;
					points.push({ x: n.x, y: n.y });
				}
			}
			if (count > 0) {
				const ncx = tx / count, ncy = ty / count;
				nebula.centerOfGravity = {
					x: isFinite(ncx) ? ncx : 0,
					y: isFinite(ncy) ? ncy : 0,
				};
				nebula.boundaryPoints = points.length >= 3 ? NebulaFormer.computeConvexHull(points) : points;
			}
		}
	}

	private resolveNebulaOverlaps(): void {
		const NEBULA_GAP = 30;
		for (let iter = 0; iter < 8; iter++) {
			let anyOverlap = false;
			for (let i = 0; i < this.nebulas.length; i++) {
				for (let j = i + 1; j < this.nebulas.length; j++) {
					const a = this.nebulas[i];
					const b = this.nebulas[j];
					if (a.protons.length < 2 || b.protons.length < 2) continue;

					const ac = a.centerOfGravity;
					const bc = b.centerOfGravity;
					if (!isFinite(ac.x) || !isFinite(ac.y) || !isFinite(bc.x) || !isFinite(bc.y)) continue;

					const dx = bc.x - ac.x;
					const dy = bc.y - ac.y;
					const dist = Math.sqrt(dx * dx + dy * dy) || 0.01;
					const minDist = a.radius + b.radius + NEBULA_GAP;

					if (dist < minDist) {
						anyOverlap = true;
						const overlap = minDist - dist;
						const nx = dx / dist;
						const ny = dy / dist;
						const pushX = nx * overlap * 0.3;
						const pushY = ny * overlap * 0.3;

						for (const pid of a.protons) {
							const protonId = typeof pid === "string" ? pid : (pid as any).id;
							const n = this.nodes.find(node => node.id === protonId);
							if (n && isFinite(n.x) && isFinite(n.y) && (!this.isDragging || this.dragNode !== n)) {
								n.x -= pushX;
								n.y -= pushY;
							}
						}
						for (const pid of b.protons) {
							const protonId = typeof pid === "string" ? pid : (pid as any).id;
							const n = this.nodes.find(node => node.id === protonId);
							if (n && isFinite(n.x) && isFinite(n.y) && (!this.isDragging || this.dragNode !== n)) {
								n.x += pushX;
								n.y += pushY;
							}
						}
					}
				}
			}
			if (!anyOverlap) break;
		}
	}

	private updateCelestialPositions(): void {
		for (const celestial of this.celestials) {
			let tx = 0, ty = 0, count = 0;
			let maxDist = 0;
			for (const pid of celestial.protonIds) {
				const n = this.nodes.find(node => node.id === pid);
				if (n && isFinite(n.x) && isFinite(n.y)) {
					tx += n.x; ty += n.y; count++;
				}
			}
			if (count > 0) {
				celestial.centerX = tx / count;
				celestial.centerY = ty / count;
				for (const pid of celestial.protonIds) {
					const n = this.nodes.find(node => node.id === pid);
					if (n && isFinite(n.x) && isFinite(n.y)) {
						const dx = n.x - celestial.centerX;
						const dy = n.y - celestial.centerY;
						const dist = Math.sqrt(dx * dx + dy * dy) + n.radius + 50;
						if (dist > maxDist) maxDist = dist;
					}
				}
				celestial.radius = Math.max(maxDist, 80);
			}
		}
	}

	private resolveCelestialOverlaps(): void {
		const CELESTIAL_GAP = 60;
		for (let iter = 0; iter < 10; iter++) {
			let anyOverlap = false;
			for (let i = 0; i < this.celestials.length; i++) {
				for (let j = i + 1; j < this.celestials.length; j++) {
					const a = this.celestials[i];
					const b = this.celestials[j];
					if (!isFinite(a.centerX) || !isFinite(a.centerY) || !isFinite(b.centerX) || !isFinite(b.centerY)) continue;

					const dx = b.centerX - a.centerX;
					const dy = b.centerY - a.centerY;
					const dist = Math.sqrt(dx * dx + dy * dy) || 0.01;
					const minDist = a.radius + b.radius + CELESTIAL_GAP;

					if (dist < minDist) {
						anyOverlap = true;
						const overlap = minDist - dist;
						const nx = dx / dist;
						const ny = dy / dist;
						const pushX = nx * overlap * 0.4;
						const pushY = ny * overlap * 0.4;

						for (const pid of a.protonIds) {
							const n = this.nodes.find(node => node.id === pid);
							if (n && isFinite(n.x) && isFinite(n.y) && (!this.isDragging || this.dragNode !== n)) {
								n.x -= pushX;
								n.y -= pushY;
							}
						}
						for (const pid of b.protonIds) {
							const n = this.nodes.find(node => node.id === pid);
							if (n && isFinite(n.x) && isFinite(n.y) && (!this.isDragging || this.dragNode !== n)) {
								n.x += pushX;
								n.y += pushY;
							}
						}
					}
				}
			}
			if (!anyOverlap) break;
		}
	}

	private renderCanvas(): void {
		if (!this.ctx || !this.canvas) return;
		const ctx = this.ctx;
		const W = this.logicalWidth;
		const H = this.logicalHeight;

		ctx.clearRect(0, 0, W, H);
		ctx.fillStyle = "#1a1a2e";
		ctx.fillRect(0, 0, W, H);

		if (this.nodes.length === 0) {
			ctx.fillStyle = "#6b7280";
			ctx.font = "16px sans-serif";
			ctx.textAlign = "center";
			ctx.fillText("暂无概念数据，请先提取笔记", W / 2, H / 2);
			return;
		}

		if (W <= 1 || H <= 1) return;

		ctx.save();
		ctx.translate(this.panX, this.panY);
		ctx.scale(this.zoom, this.zoom);

		try { this.renderNebulaBoundaries(ctx); } catch (e) { console.error("[renderNebulaBoundaries]", e); }
		try { this.renderCelestials(ctx); } catch (e) { console.error("[renderCelestials]", e); }
		try { this.renderEdges(ctx); } catch (e) { console.error("[renderEdges]", e); }
		try { this.renderProtons(ctx); } catch (e) { console.error("[renderProtons]", e); }

		ctx.restore();
	}

	private renderNebulaBoundaries(ctx: CanvasRenderingContext2D): void {
		for (const nebula of this.nebulas) {
			if (nebula.protons.length < 2) continue;
			if (nebula.boundaryPoints.length < 3) continue;

			const validPoints = nebula.boundaryPoints.filter(p => isFinite(p.x) && isFinite(p.y));
			if (validPoints.length < 3) continue;

			const centroid = nebula.centerOfGravity;
			if (!isFinite(centroid.x) || !isFinite(centroid.y)) continue;

			const colorIdx = this.nebulaColorMap.get(nebula.id) || 0;
			const palette = NEBULA_PALETTE[colorIdx % NEBULA_PALETTE.length];

			const expandedPoints = this.expandConvexHull(validPoints, 55);

			ctx.beginPath();
			ctx.moveTo(expandedPoints[0].x, expandedPoints[0].y);
			for (let i = 1; i < expandedPoints.length; i++) {
				const prev = expandedPoints[i - 1];
				const curr = expandedPoints[i];
				const cpx = (prev.x + curr.x) / 2;
				const cpy = (prev.y + curr.y) / 2;
				ctx.quadraticCurveTo(prev.x, prev.y, cpx, cpy);
			}
			const last = expandedPoints[expandedPoints.length - 1];
			const first = expandedPoints[0];
			ctx.quadraticCurveTo(last.x, last.y, (last.x + first.x) / 2, (last.y + first.y) / 2);
			ctx.closePath();

			const maxDist = Math.max(...validPoints.map(p => {
				const dx = p.x - centroid.x;
				const dy = p.y - centroid.y;
				return Math.sqrt(dx * dx + dy * dy);
			}), 50);

			const pulse = 0.02 * Math.sin(this.animTime * 0.4 + colorIdx * 1.5);

			const outerR = maxDist + 90;
			const gradient1 = ctx.createRadialGradient(
				centroid.x, centroid.y, 0,
				centroid.x, centroid.y, outerR
			);
			gradient1.addColorStop(0, `rgba(${palette.r},${palette.g},${palette.b},${(0.22 + pulse).toFixed(3)})`);
			gradient1.addColorStop(0.1, `rgba(${palette.r},${palette.g},${palette.b},${(0.18 + pulse * 0.8).toFixed(3)})`);
			gradient1.addColorStop(0.25, `rgba(${palette.r},${palette.g},${palette.b},${(0.12 + pulse * 0.5).toFixed(3)})`);
			gradient1.addColorStop(0.45, `rgba(${palette.r},${palette.g},${palette.b},0.06)`);
			gradient1.addColorStop(0.65, `rgba(${palette.r},${palette.g},${palette.b},0.025)`);
			gradient1.addColorStop(0.85, `rgba(${palette.r},${palette.g},${palette.b},0.008)`);
			gradient1.addColorStop(1, `rgba(${palette.r},${palette.g},${palette.b},0.0)`);
			ctx.fillStyle = gradient1;
			ctx.fill();

			const numWisps = 4;
			for (let wi = 0; wi < numWisps; wi++) {
				const wAngle = (wi / numWisps) * Math.PI * 2 + this.animTime * 0.15 + colorIdx;
				const wDist = maxDist * 0.4;
				const wx = centroid.x + Math.cos(wAngle) * wDist;
				const wy = centroid.y + Math.sin(wAngle) * wDist;
				const wRadius = maxDist * 0.5;

				const wGrad = ctx.createRadialGradient(wx, wy, 0, wx, wy, wRadius);
				wGrad.addColorStop(0, `rgba(${palette.r},${palette.g},${palette.b},${(0.08 + pulse * 0.5).toFixed(3)})`);
				wGrad.addColorStop(0.3, `rgba(${palette.r},${palette.g},${palette.b},0.04)`);
				wGrad.addColorStop(0.6, `rgba(${palette.r},${palette.g},${palette.b},0.015)`);
				wGrad.addColorStop(1, `rgba(${palette.r},${palette.g},${palette.b},0.0)`);
				ctx.beginPath();
				ctx.arc(wx, wy, wRadius, 0, Math.PI * 2);
				ctx.fillStyle = wGrad;
				ctx.fill();
			}

			ctx.beginPath();
			ctx.moveTo(expandedPoints[0].x, expandedPoints[0].y);
			for (let i = 1; i < expandedPoints.length; i++) {
				const prev = expandedPoints[i - 1];
				const curr = expandedPoints[i];
				const cpx = (prev.x + curr.x) / 2;
				const cpy = (prev.y + curr.y) / 2;
				ctx.quadraticCurveTo(prev.x, prev.y, cpx, cpy);
			}
			ctx.quadraticCurveTo(last.x, last.y, (last.x + first.x) / 2, (last.y + first.y) / 2);
			ctx.closePath();
			ctx.strokeStyle = `rgba(${palette.r},${palette.g},${palette.b},0.2)`;
			ctx.lineWidth = 1;
			ctx.setLineDash([6, 8]);
			ctx.stroke();
			ctx.setLineDash([]);

			if (this.zoom > 0.25) {
				const labelAlpha = 0.55;
				ctx.fillStyle = `rgba(${palette.r},${palette.g},${palette.b},${labelAlpha})`;
				ctx.font = `500 11px -apple-system, BlinkMacSystemFont, sans-serif`;
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				const nebulaName = nebula.id.replace("nebula_", "");
				ctx.fillText(nebulaName, centroid.x, centroid.y - maxDist - 28);
			}
		}
	}

	private expandConvexHull(points: Array<{ x: number; y: number }>, padding: number): Array<{ x: number; y: number }> {
		if (points.length < 3) return points;
		let cx = 0, cy = 0;
		for (const p of points) { cx += p.x; cy += p.y; }
		cx /= points.length;
		cy /= points.length;

		return points.map(p => {
			const dx = p.x - cx;
			const dy = p.y - cy;
			const dist = Math.sqrt(dx * dx + dy * dy) || 1;
			return {
				x: p.x + (dx / dist) * padding,
				y: p.y + (dy / dist) * padding,
			};
		});
	}

	private renderCelestials(ctx: CanvasRenderingContext2D): void {
		for (const celestial of this.celestials) {
			if (!isFinite(celestial.centerX) || !isFinite(celestial.centerY)) continue;
			if (celestial.radius <= 0) continue;

			const cx = celestial.centerX;
			const cy = celestial.centerY;
			const r = celestial.radius;

			ctx.save();
			ctx.translate(cx, cy);

			const isSelected = this.selectedConcept && celestial.protonIds.includes(this.selectedConcept);
			const colorIdx = this.celestialColorMap.get(celestial.id) || 0;
			const palette = CELESTIAL_PALETTE[colorIdx % CELESTIAL_PALETTE.length];

			if (celestial.state === "stable") {
				this.renderStableCelestial(ctx, r, palette, isSelected);
			} else if (celestial.state === "shattering") {
				this.renderShatteringCelestial(ctx, r);
			} else {
				this.renderFormingCelestial(ctx, r, palette, isSelected);
			}

			if (isSelected) {
				ctx.beginPath();
				ctx.arc(0, 0, r + 10, 0, Math.PI * 2);
				ctx.strokeStyle = `rgba(${palette.r},${palette.g},${palette.b},0.5)`;
				ctx.lineWidth = 2;
				ctx.setLineDash([8, 4]);
				ctx.stroke();
				ctx.setLineDash([]);
			}

			if (this.zoom > 0.3 || isSelected) {
				const labelAlpha = isSelected ? 0.95 : 0.7;
				ctx.fillStyle = `rgba(255,255,255,${labelAlpha})`;
				ctx.font = `bold ${Math.max(11, 13)}px -apple-system, BlinkMacSystemFont, sans-serif`;
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				ctx.fillText(celestial.metaConcept, 0, -r - 16);

				if (isSelected || this.zoom > 0.6) {
					const stateLabels: Record<string, string> = {
						forming: "形成中",
						stable: "稳定",
						shattering: "破碎中",
						dissolved: "已消散",
					};
					ctx.font = `${Math.max(9, 10)}px -apple-system, BlinkMacSystemFont, sans-serif`;
					ctx.fillStyle = `rgba(255,255,255,0.45)`;
					ctx.fillText(`${stateLabels[celestial.state] || celestial.state} · 成熟度 ${celestial.maturity.toFixed(2)}`, 0, -r + 2);
				}
			}

			ctx.restore();
		}
	}

	private renderStableCelestial(ctx: CanvasRenderingContext2D, r: number, palette: { r: number; g: number; b: number }, isSelected: boolean): void {
		const outerR = r * 1.5;

		const outerGrad = ctx.createRadialGradient(0, 0, r * 0.1, 0, 0, outerR);
		outerGrad.addColorStop(0, `rgba(${palette.r},${palette.g},${palette.b},${isSelected ? 0.35 : 0.25})`);
		outerGrad.addColorStop(0.12, `rgba(${palette.r},${palette.g},${palette.b},${isSelected ? 0.25 : 0.16})`);
		outerGrad.addColorStop(0.3, `rgba(${palette.r},${palette.g},${palette.b},${isSelected ? 0.16 : 0.09})`);
		outerGrad.addColorStop(0.55, `rgba(${palette.r},${palette.g},${palette.b},0.04)`);
		outerGrad.addColorStop(0.8, `rgba(${palette.r},${palette.g},${palette.b},0.015)`);
		outerGrad.addColorStop(1, `rgba(${palette.r},${palette.g},${palette.b},0.0)`);
		ctx.beginPath();
		ctx.arc(0, 0, outerR, 0, Math.PI * 2);
		ctx.fillStyle = outerGrad;
		ctx.fill();

		const coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.35);
		coreGrad.addColorStop(0, `rgba(255,255,255,0.35)`);
		coreGrad.addColorStop(0.2, `rgba(${palette.r},${palette.g},${palette.b},0.25)`);
		coreGrad.addColorStop(0.5, `rgba(${palette.r},${palette.g},${palette.b},0.12)`);
		coreGrad.addColorStop(0.8, `rgba(${palette.r},${palette.g},${palette.b},0.04)`);
		coreGrad.addColorStop(1, `rgba(${palette.r},${palette.g},${palette.b},0.0)`);
		ctx.beginPath();
		ctx.arc(0, 0, r * 0.35, 0, Math.PI * 2);
		ctx.fillStyle = coreGrad;
		ctx.fill();

		const ringGrad = ctx.createRadialGradient(0, 0, r * 0.6, 0, 0, r * 0.85);
		ringGrad.addColorStop(0, `rgba(${palette.r},${palette.g},${palette.b},0.0)`);
		ringGrad.addColorStop(0.3, `rgba(${palette.r},${palette.g},${palette.b},0.06)`);
		ringGrad.addColorStop(0.6, `rgba(${palette.r},${palette.g},${palette.b},0.12)`);
		ringGrad.addColorStop(0.85, `rgba(${palette.r},${palette.g},${palette.b},0.06)`);
		ringGrad.addColorStop(1, `rgba(${palette.r},${palette.g},${palette.b},0.0)`);
		ctx.beginPath();
		ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2);
		ctx.fillStyle = ringGrad;
		ctx.fill();

		const glowGrad = ctx.createRadialGradient(0, 0, r * 0.88, 0, 0, r * 1.15);
		glowGrad.addColorStop(0, `rgba(${palette.r},${palette.g},${palette.b},0.0)`);
		glowGrad.addColorStop(0.4, `rgba(${palette.r},${palette.g},${palette.b},0.05)`);
		glowGrad.addColorStop(0.7, `rgba(${palette.r},${palette.g},${palette.b},0.03)`);
		glowGrad.addColorStop(1, `rgba(${palette.r},${palette.g},${palette.b},0.0)`);
		ctx.beginPath();
		ctx.arc(0, 0, r * 1.15, 0, Math.PI * 2);
		ctx.fillStyle = glowGrad;
		ctx.fill();

		const numRays = 6;
		for (let ri = 0; ri < numRays; ri++) {
			const angle = (ri / numRays) * Math.PI * 2 + this.animTime * 0.15;
			const rayLen = r * 1.3;
			const rayWidth = r * 0.08;
			ctx.save();
			ctx.rotate(angle);
			const rayGrad = ctx.createLinearGradient(0, 0, rayLen, 0);
			rayGrad.addColorStop(0, `rgba(${palette.r},${palette.g},${palette.b},0.08)`);
			rayGrad.addColorStop(0.5, `rgba(${palette.r},${palette.g},${palette.b},0.03)`);
			rayGrad.addColorStop(1, `rgba(${palette.r},${palette.g},${palette.b},0.0)`);
			ctx.beginPath();
			ctx.moveTo(r * 0.3, -rayWidth / 2);
			ctx.lineTo(rayLen, 0);
			ctx.lineTo(r * 0.3, rayWidth / 2);
			ctx.closePath();
			ctx.fillStyle = rayGrad;
			ctx.fill();
			ctx.restore();
		}
	}

	private renderShatteringCelestial(ctx: CanvasRenderingContext2D, r: number): void {
		const outerR = r * 1.4;
		const shatterGrad = ctx.createRadialGradient(0, 0, r * 0.05, 0, 0, outerR);
		shatterGrad.addColorStop(0, "rgba(255,100,100,0.25)");
		shatterGrad.addColorStop(0.2, "rgba(255,80,80,0.14)");
		shatterGrad.addColorStop(0.5, "rgba(255,60,60,0.06)");
		shatterGrad.addColorStop(1, "rgba(255,40,40,0.0)");
		ctx.beginPath();
		ctx.arc(0, 0, outerR, 0, Math.PI * 2);
		ctx.fillStyle = shatterGrad;
		ctx.fill();

		const numFragments = 8;
		for (let fi = 0; fi < numFragments; fi++) {
			const fAngle = (fi / numFragments) * Math.PI * 2 + this.animTime * 0.3;
			const fDist = r * (0.5 + 0.3 * Math.sin(this.animTime * 2 + fi));
			const fx = Math.cos(fAngle) * fDist;
			const fy = Math.sin(fAngle) * fDist;
			const fSize = r * 0.06;
			ctx.beginPath();
			ctx.arc(fx, fy, fSize, 0, Math.PI * 2);
			ctx.fillStyle = `rgba(255,120,120,${0.15 + 0.1 * Math.sin(this.animTime * 3 + fi)})`;
			ctx.fill();
		}
	}

	private renderFormingCelestial(ctx: CanvasRenderingContext2D, r: number, palette: { r: number; g: number; b: number }, isSelected: boolean): void {
		const outerR = r * 1.35;
		const formGrad = ctx.createRadialGradient(0, 0, r * 0.05, 0, 0, outerR);
		formGrad.addColorStop(0, `rgba(${palette.r},${palette.g},${palette.b},${isSelected ? 0.20 : 0.12})`);
		formGrad.addColorStop(0.2, `rgba(${palette.r},${palette.g},${palette.b},${isSelected ? 0.12 : 0.06})`);
		formGrad.addColorStop(0.45, `rgba(${palette.r},${palette.g},${palette.b},0.03)`);
		formGrad.addColorStop(0.75, `rgba(${palette.r},${palette.g},${palette.b},0.01)`);
		formGrad.addColorStop(1, `rgba(${palette.r},${palette.g},${palette.b},0.0)`);
		ctx.beginPath();
		ctx.arc(0, 0, outerR, 0, Math.PI * 2);
		ctx.fillStyle = formGrad;
		ctx.fill();

		const swirlAngle = this.animTime * 0.4;
		const numSwirls = 3;
		for (let si = 0; si < numSwirls; si++) {
			const sAngle = swirlAngle + (si / numSwirls) * Math.PI * 2;
			const sDist = r * 0.5;
			const sx = Math.cos(sAngle) * sDist;
			const sy = Math.sin(sAngle) * sDist;
			const sGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, r * 0.3);
			sGrad.addColorStop(0, `rgba(${palette.r},${palette.g},${palette.b},0.08)`);
			sGrad.addColorStop(1, `rgba(${palette.r},${palette.g},${palette.b},0.0)`);
			ctx.beginPath();
			ctx.arc(sx, sy, r * 0.3, 0, Math.PI * 2);
			ctx.fillStyle = sGrad;
			ctx.fill();
		}
	}

	private renderEdges(ctx: CanvasRenderingContext2D): void {
		for (const edge of this.edges) {
			const s = this.nodes.find(n => n.id === edge.source);
			const t = this.nodes.find(n => n.id === edge.target);
			if (!s || !t) continue;
			if (!isFinite(s.x) || !isFinite(s.y) || !isFinite(t.x) || !isFinite(t.y)) continue;

			const isHighlighted = this.highlightedEdges.has(edge.id);

			ctx.beginPath();
			ctx.moveTo(s.x, s.y);
			ctx.lineTo(t.x, t.y);

			if (isHighlighted) {
				ctx.strokeStyle = "rgba(255,255,255,0.6)";
				ctx.lineWidth = this.settings.lineWidth * 2;
			} else {
				ctx.strokeStyle = "rgba(255,255,255,0.12)";
				ctx.lineWidth = this.settings.lineWidth;
			}
			ctx.stroke();
		}
	}

	private renderProtons(ctx: CanvasRenderingContext2D): void {
		for (const n of this.nodes) {
			if (!isFinite(n.x) || !isFinite(n.y)) continue;

			const isHighlighted = this.highlightedNodes.has(n.id);
			const isHovered = this.hoveredNode?.id === n.id;
			const isSelected = this.selectedConcept === n.id;
			const links = n.linkCount;
			const r = Math.max(2, n.radius * n.scale);

			ctx.beginPath();
			ctx.arc(n.x, n.y, r, 0, Math.PI * 2);

			if (isHovered) {
				ctx.fillStyle = "#ffffff";
			} else if (isSelected) {
				ctx.fillStyle = "#e0e0e8";
			} else if (isHighlighted) {
				ctx.fillStyle = "#c8c8d0";
			} else {
				ctx.fillStyle = "#a0a0b0";
			}
			ctx.fill();

			if (isHovered || isSelected) {
				ctx.beginPath();
				ctx.arc(n.x, n.y, r + 3, 0, Math.PI * 2);
				ctx.strokeStyle = "rgba(255,255,255,0.3)";
				ctx.lineWidth = 1;
				ctx.stroke();
			}

			const showLabel = this.zoom > 0.25 || isHighlighted || isHovered || isSelected || links > 2;
			if (showLabel) {
				const labelAlpha = isHighlighted || isHovered || isSelected ? this.settings.textOpacity : this.settings.textOpacity * 0.55;
				ctx.fillStyle = `rgba(220,220,230,${labelAlpha})`;
				ctx.font = `${isHovered || isSelected ? "bold " : ""}${Math.max(10, 12 * n.scale)}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
				ctx.textAlign = "center";
				ctx.textBaseline = "top";
				ctx.fillText(n.id, n.x, n.y + r + 4);
			}
		}
	}

	private setupCanvasEvents(): void {
		if (!this.canvas) return;

		this.canvas.addEventListener("contextmenu", (e) => {
			e.preventDefault();
			const pos = this.canvasToGraph(e.offsetX, e.offsetY);
			const node = this.findNodeAt(pos.x, pos.y);
			if (node) {
				this.showContextMenu(node, e.clientX, e.clientY);
			}
		});

		this.canvas.addEventListener("mousedown", (e) => {
			if (e.button === 2) return;
			const pos = this.canvasToGraph(e.offsetX, e.offsetY);
			const node = this.findNodeAt(pos.x, pos.y);
			if (node) {
				this.dragNode = node;
				this.isDragging = true;
			} else {
				this.isPanning = true;
			}
			this.lastMouseX = e.clientX;
			this.lastMouseY = e.clientY;
		});

		this.canvas.addEventListener("click", (e) => {
			const pos = this.canvasToGraph(e.offsetX, e.offsetY);
			const node = this.findNodeAt(pos.x, pos.y);

			if (this.clickTimer) {
				clearTimeout(this.clickTimer);
				this.clickTimer = null;
				if (node) {
					this.navigateToNote(node);
				}
				return;
			}

			if (node) {
				this.selectConcept(node.id);
			} else {
				this.deselectConcept();
			}

			this.clickTimer = setTimeout(() => {
				this.clickTimer = null;
			}, 300);
		});

		this.canvas.addEventListener("mousemove", (e) => {
			const pos = this.canvasToGraph(e.offsetX, e.offsetY);
			const node = this.findNodeAt(pos.x, pos.y);

			if (this.hoveredNode && this.hoveredNode !== node) {
				this.hoveredNode.isHovered = false;
				if (!this.highlightedNodes.has(this.hoveredNode.id) && this.hoveredNode.id !== this.selectedConcept) {
					this.highlightedNodes.delete(this.hoveredNode.id);
					this.highlightedEdges.clear();
				}
			}

			if (node) {
				node.isHovered = true;
				this.hoveredNode = node;
				if (!this.selectedConcept || this.selectedConcept !== node.id) {
					this.highlightedNodes.add(node.id);
					for (const edge of this.edges) {
						if (edge.source === node.id || edge.target === node.id) {
							this.highlightedNodes.add(edge.source);
							this.highlightedNodes.add(edge.target);
							this.highlightedEdges.add(edge.id);
						}
					}
				}
				this.canvas!.style.cursor = "pointer";
			} else {
				this.hoveredNode = null;
				this.canvas!.style.cursor = this.isPanning ? "grabbing" : "default";
			}

			if (this.isDragging && this.dragNode) {
				this.dragNode.x = pos.x;
				this.dragNode.y = pos.y;
				this.dragNode.vx = 0;
				this.dragNode.vy = 0;
				this.alpha = 0.3;
			} else if (this.isPanning) {
				this.panX += e.clientX - this.lastMouseX;
				this.panY += e.clientY - this.lastMouseY;
			}

			this.lastMouseX = e.clientX;
			this.lastMouseY = e.clientY;
		});

		window.addEventListener("mouseup", () => {
			this.dragNode = null;
			this.isDragging = false;
			this.isPanning = false;
		});

		this.canvas.addEventListener("wheel", (e) => {
			e.preventDefault();
			const factor = e.deltaY > 0 ? 0.9 : 1.1;
			const newZoom = Math.max(0.1, Math.min(5, this.zoom * factor));
			this.panX = e.offsetX - (e.offsetX - this.panX) * (newZoom / this.zoom);
			this.panY = e.offsetY - (e.offsetY - this.panY) * (newZoom / this.zoom);
			this.zoom = newZoom;
		});
	}

	private selectConcept(conceptId: string): void {
		this.selectedConcept = conceptId;
		this.highlightedNodes.clear();
		this.highlightedEdges.clear();
		this.highlightedNodes.add(conceptId);
		for (const edge of this.edges) {
			if (edge.source === conceptId || edge.target === conceptId) {
				this.highlightedNodes.add(edge.source);
				this.highlightedNodes.add(edge.target);
				this.highlightedEdges.add(edge.id);
			}
		}
	}

	private deselectConcept(): void {
		this.selectedConcept = null;
		this.highlightedNodes.clear();
		this.highlightedEdges.clear();
	}

	private showContextMenu(node: ForceNode, clientX: number, clientY: number): void {
		const existing = document.querySelector(".kgraph-context-menu");
		if (existing) existing.remove();

		const menu = document.createElement("div");
		menu.className = "kgraph-context-menu";
		menu.style.left = `${clientX}px`;
		menu.style.top = `${clientY}px`;

		const selectItem = document.createElement("div");
		selectItem.className = "kgraph-context-item";
		selectItem.textContent = "选中此概念";
		selectItem.addEventListener("click", () => {
			this.selectConcept(node.id);
			menu.remove();
		});
		menu.appendChild(selectItem);

		const probeItem = document.createElement("div");
		probeItem.className = "kgraph-context-item";
		probeItem.textContent = "探测引力";
		probeItem.addEventListener("click", () => {
			this.selectConcept(node.id);
			this.handleGravityProbe();
			menu.remove();
		});
		menu.appendChild(probeItem);

		const openItem = document.createElement("div");
		openItem.className = "kgraph-context-item";
		openItem.textContent = "打开笔记";
		openItem.addEventListener("click", () => {
			this.navigateToNote(node);
			menu.remove();
		});
		menu.appendChild(openItem);

		const divider = document.createElement("div");
		divider.className = "kgraph-context-divider";
		menu.appendChild(divider);

		const deleteItem = document.createElement("div");
		deleteItem.className = "kgraph-context-item kgraph-context-item-danger";
		deleteItem.textContent = "删除笔记和质子";
		deleteItem.addEventListener("click", () => {
			this.deleteProtonAndNote(node);
			menu.remove();
		});
		menu.appendChild(deleteItem);

		document.body.appendChild(menu);

		const closeHandler = (e: MouseEvent) => {
			if (!menu.contains(e.target as Node)) {
				menu.remove();
				document.removeEventListener("click", closeHandler);
			}
		};
		setTimeout(() => document.addEventListener("click", closeHandler), 10);
	}

	private async deleteProtonAndNote(node: ForceNode): Promise<void> {
		const confirmed = confirm(`确定要删除概念「${node.id}」及其笔记吗？此操作不可撤销。`);
		if (!confirmed) return;

		try {
			const notePath = node.notePath;
			const file = this.app.vault.getAbstractFileByPath(notePath);
			if (file) {
				await this.app.vault.delete(file);
			} else {
				const altPath = `概念/${node.id}.md`;
				const altFile = this.app.vault.getAbstractFileByPath(altPath);
				if (altFile) {
					await this.app.vault.delete(altFile);
				}
			}

			await this.plugin.knowledgeIndex.removeConcept(node.id);

			if (this.selectedConcept === node.id) {
				this.selectedConcept = null;
			}
			this.highlightedNodes.delete(node.id);
			this.highlightedEdges.clear();

			this.buildGraphData();
			this.alpha = 1.0;

			new Notice(`已删除概念「${node.id}」`);
		} catch (error) {
			new Notice(`删除失败: ${error instanceof Error ? error.message : String(error)}`);
		}
	}

	private navigateToNote(node: ForceNode): void {
		const notePath = node.notePath;
		const file = this.app.vault.getAbstractFileByPath(notePath);
		if (file && "extension" in file) {
			this.app.workspace.getLeaf(false).openFile(file as any);
		} else {
			const altPath = `概念/${node.id}.md`;
			const altFile = this.app.vault.getAbstractFileByPath(altPath);
			if (altFile && "extension" in altFile) {
				this.app.workspace.getLeaf(false).openFile(altFile as any);
			} else {
				new Notice(`找不到笔记: ${notePath}`);
			}
		}
	}

	private canvasToGraph(offsetX: number, offsetY: number): { x: number; y: number } {
		return {
			x: (offsetX - this.panX) / this.zoom,
			y: (offsetY - this.panY) / this.zoom,
		};
	}

	private findNodeAt(gx: number, gy: number): ForceNode | null {
		for (let i = this.nodes.length - 1; i >= 0; i--) {
			const n = this.nodes[i];
			if (!isFinite(n.x) || !isFinite(n.y)) continue;
			const dx = gx - n.x;
			const dy = gy - n.y;
			const hitRadius = Math.max(n.radius + 4, 8);
			if (dx * dx + dy * dy <= hitRadius * hitRadius) {
				return n;
			}
		}
		return null;
	}

	private resizeCanvas(): void {
		if (!this.canvas) return;
		const wrapper = this.canvas.parentElement;
		if (!wrapper) return;
		const rect = wrapper.getBoundingClientRect();
		if (rect.width <= 0 || rect.height <= 0) return;
		const dpr = window.devicePixelRatio || 1;
		this.logicalWidth = rect.width;
		this.logicalHeight = rect.height;
		this.canvas.width = rect.width * dpr;
		this.canvas.height = rect.height * dpr;
		this.canvas.style.width = `${rect.width}px`;
		this.canvas.style.height = `${rect.height}px`;
		if (this.ctx) {
			this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		}
	}
}
