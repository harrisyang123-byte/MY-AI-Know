import { App, Vault } from "obsidian";
import type {
	ConceptEntry,
	Relation,
	Community,
	NoteIndex,
	IndexData,
	UserIntervention,
	InterventionType,
	CommunityPhase,
	GravityVector,
	KnowledgeProton,
	KnowledgeLayer,
	LogicalCrystal,
} from "./types";

const INDEX_PATH = ".knowledge-atom/index.json";

/**
 * KnowledgeIndex: 知识图谱索引管理器 (V0.7.0 引力模型版)
 */
export class KnowledgeIndex {
	private app: App;
	private vault: Vault;
	private data: IndexData;
	private dirty = false;

	constructor(app: App) {
		this.app = app;
		this.vault = app.vault;
		this.data = this.getDefaultData();
	}

	private getDefaultData(): IndexData {
		return {
			version: 4, // V0.7.0
			updatedAt: new Date().toISOString(),
			concepts: {},
			relations: [],
			notes: {},
			communities: [],
			crystals: {},
			userInterventions: [],
			knowledgeLayers: [],
		};
	}

	async load(): Promise<void> {
		try {
			const exists = await this.vault.adapter.exists(INDEX_PATH);
			if (exists) {
				const raw = await this.vault.adapter.read(INDEX_PATH);
				const parsed = JSON.parse(raw);

				if (parsed.version < 3) {
					// 级联迁移：V1/V2 -> V3 (这里简化处理，如有旧数据则重置)
					this.data = this.getDefaultData();
				} else if (parsed.version === 3) {
					// V3 (0.6.0) -> V4 (0.7.0)
					this.data = this.migrateV3ToV4(parsed);
				} else {
					this.data = parsed;
				}
			}
		} catch (e) {
			console.error("Failed to load KnowledgeIndex:", e);
			this.data = this.getDefaultData();
		}
	}

	async save(): Promise<void> {
		this.data.updatedAt = new Date().toISOString();
		const dir = INDEX_PATH.substring(0, INDEX_PATH.lastIndexOf("/"));
		if (!(await this.vault.adapter.exists(dir))) {
			await this.vault.adapter.mkdir(dir);
		}
		await this.vault.adapter.write(INDEX_PATH, JSON.stringify(this.data, null, 2));
		this.dirty = false;
	}

	async ensureSaved(): Promise<void> {
		if (this.dirty) {
			await this.save();
		}
	}

	private migrateV3ToV4(old: any): IndexData {
		const concepts: Record<string, ConceptEntry> = {};
		for (const [name, c] of Object.entries(old.concepts || {})) {
			const entry = c as any;
			concepts[name] = {
				name,
				definition: entry.definition || "",
				centrality: entry.centrality || 0,
				abstractness: entry.abstractness || 0,
				status: entry.status || "draft",
				aliases: entry.aliases || [],
				sources: entry.sources || [],
				notePath: entry.notePath || `概念/${name}.md`,
				extractedAt: entry.extractedAt || new Date().toISOString(),
				firstPrinciples: entry.firstPrinciples || [],
				examples: entry.examples || [],
				originalExcerpt: entry.originalExcerpt || "",
			};
		}

		const relations: Relation[] = (old.relations || []).map((r: any) => ({
			id: r.id,
			from: r.from,
			to: r.to,
			gravity: r.gravity || this.mapOldTypeToGravity(r.type),
			source: r.source,
			createdAt: r.createdAt,
		}));

		const communities: Community[] = (old.communities || []).map((comm: any) => ({
			id: comm.id,
			name: comm.name || comm.label || "",
			firstPrinciple: comm.firstPrinciple,
			phase: comm.phase || "vapor",
			concepts: comm.concepts || comm.conceptNames || [],
			protons: comm.protons || [],
			cohesionStrength: comm.cohesionStrength || 0.5,
			stability: comm.stability || 0.5,
			boundaryPoints: comm.boundaryPoints || [],
			centerOfGravity: comm.centerOfGravity || { x: comm.x || 0, y: comm.y || 0 },
			radius: comm.radius || 100,
			energyDensity: comm.energyDensity || 0.5,
			velocity: comm.velocity || 0,
			createdAt: comm.createdAt || Date.now(),
			lastActiveAt: comm.lastActiveAt || Date.now(),
			isNamed: comm.isNamed || false,
			x: comm.x || 0,
			y: comm.y || 0,
			vx: comm.vx || 0,
			vy: comm.vy || 0,
		}));

		return {
			version: 4,
			updatedAt: new Date().toISOString(),
			concepts,
			relations,
			notes: old.notes || {},
			communities,
			crystals: {},
			userInterventions: old.userInterventions || [],
			knowledgeLayers: [],
		};
	}

	mapOldTypeToGravity(type: string): GravityVector {
		const mapping: Record<string, Partial<GravityVector>> = {
			cause: { strength: 0.8, direction: 0.9, dimensions: ["因果"] },
			correlate: { strength: 0.5, direction: 0.7, dimensions: ["相关"] },
			contain: { strength: 0.9, direction: 1.0, dimensions: ["包含"] },
			synonym: { strength: 1.0, direction: 1.0, dimensions: ["同义"] },
			oppose: { strength: 0.8, direction: -0.9, dimensions: ["对立"] },
			"cross-domain": { strength: 0.4, direction: 0.6, dimensions: ["跨域"] },
		};

		const partial = mapping[type] || { strength: 0.3, direction: 0.5, dimensions: ["关联"] };
		return {
			strength: partial.strength!,
			direction: partial.direction!,
			dimensions: partial.dimensions!,
			context: `从旧版本关系 [${type}] 迁移`,
			computedAt: new Date().toISOString(),
			confidence: 0.5,
		};
	}

	// ====================================================
	// 核心概念方法
	// ====================================================

	getConcept(name: string): ConceptEntry | undefined {
		return this.data.concepts[name];
	}

	getAllConcepts(): ConceptEntry[] {
		return Object.values(this.data.concepts);
	}

	getConceptMap(): Record<string, ConceptEntry> {
		return this.data.concepts;
	}

	async upsertConcept(entry: ConceptEntry): Promise<void> {
		const existing = this.data.concepts[entry.name];
		if (existing) {
			Object.assign(existing, entry);
		} else {
			this.data.concepts[entry.name] = { ...entry };
		}
		this.dirty = true;
		await this.save();
	}

	async upsertConcepts(entries: ConceptEntry[]): Promise<void> {
		for (const entry of entries) {
			const existing = this.data.concepts[entry.name];
			if (existing) {
				Object.assign(existing, entry);
			} else {
				this.data.concepts[entry.name] = { ...entry };
			}
		}
		this.dirty = true;
		await this.save();
	}

	async removeConcept(name: string): Promise<void> {
		delete this.data.concepts[name];
		this.data.relations = this.data.relations.filter((r) => r.from !== name && r.to !== name);
		for (const community of this.data.communities) {
			community.concepts = community.concepts.filter((n) => n !== name);
			community.protons = community.protons.filter((p) => p.conceptName !== name);
		}
		this.dirty = true;
		await this.save();
	}

	async updateConceptMetrics(name: string, metrics: Partial<Pick<ConceptEntry, "centrality" | "abstractness">>): Promise<void> {
		const concept = this.data.concepts[name];
		if (concept) {
			Object.assign(concept, metrics);
			this.dirty = true;
			await this.save();
		}
	}

	async updateConceptLevel(name: string, level: string, source: "auto" | "manual"): Promise<void> {
		const concept = this.data.concepts[name];
		if (concept) {
			const levelMap: Record<string, number> = { core: 0.9, bridge: 0.5, leaf: 0.1 };
			concept.centrality = levelMap[level] ?? concept.centrality;
			this.dirty = true;
			await this.save();
		}
	}

	searchConcepts(query: string): ConceptEntry[] {
		const q = query.toLowerCase();
		return Object.values(this.data.concepts).filter(
			(c) =>
				c.name.toLowerCase().includes(q) ||
				c.definition.toLowerCase().includes(q) ||
				c.aliases.some((a) => a.toLowerCase().includes(q))
		);
	}

	// ====================================================
	// 引力关系方法
	// ====================================================

	getRelations(conceptName?: string): Relation[] {
		if (!conceptName) return [...this.data.relations];
		return this.data.relations.filter((r) => r.from === conceptName || r.to === conceptName);
	}

	getRelationsBetween(from: string, to: string): Relation[] {
		return this.data.relations.filter(
			(r) => (r.from === from && r.to === to) || (r.from === to && r.to === from)
		);
	}

	async addRelation(relation: Omit<Relation, "id" | "createdAt">): Promise<Relation> {
		const id = `r_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
		const newRelation: Relation = {
			...relation,
			id,
			createdAt: new Date().toISOString(),
		};
		this.data.relations.push(newRelation);
		this.dirty = true;
		await this.save();
		return newRelation;
	}

	async addRelations(relations: Array<Omit<Relation, "id" | "createdAt">>): Promise<Relation[]> {
		const added: Relation[] = [];
		for (const rel of relations) {
			const id = `r_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
			const newRelation: Relation = {
				...rel,
				id,
				createdAt: new Date().toISOString(),
			};
			this.data.relations.push(newRelation);
			added.push(newRelation);
		}
		this.dirty = true;
		await this.save();
		return added;
	}

	async removeRelation(id: string): Promise<void> {
		this.data.relations = this.data.relations.filter((r) => r.id !== id);
		this.dirty = true;
		await this.save();
	}

	// ====================================================
	// 笔记索引方法
	// ====================================================

	getNoteIndex(filePath: string): NoteIndex | undefined {
		return this.data.notes[filePath];
	}

	getAllNoteIndexes(): NoteIndex[] {
		return Object.values(this.data.notes);
	}

	async upsertNoteIndex(entry: NoteIndex): Promise<void> {
		this.data.notes[entry.filePath] = { ...entry };
		this.dirty = true;
		await this.save();
	}

	async addConceptsToNote(filePath: string, concepts: string[]): Promise<void> {
		const noteIdx = this.data.notes[filePath];
		if (noteIdx) {
			for (const name of concepts) {
				if (!noteIdx.concepts.includes(name)) noteIdx.concepts.push(name);
			}
		}
		this.dirty = true;
		await this.save();
	}

	async addImplicitLink(filePath: string, ...targets: string[]): Promise<void> {
		const noteIdx = this.data.notes[filePath];
		if (noteIdx) {
			for (const target of targets) {
				if (!noteIdx.implicitLinksAdded.includes(target)) {
					noteIdx.implicitLinksAdded.push(target);
				}
			}
		}
		this.dirty = true;
		await this.save();
	}

	// ====================================================
	// 社区与星云方法
	// ====================================================

	getCommunities(): Community[] {
		return [...this.data.communities];
	}

	async setCommunities(communities: Community[]): Promise<void> {
		this.data.communities = communities;
		this.dirty = true;
		await this.save();
	}

	getCommunityForConcept(conceptName: string): Community | undefined {
		return this.data.communities.find((c) =>
			c.concepts && c.concepts.includes(conceptName)
		);
	}

	getCommunityById(id: string): Community | undefined {
		return this.data.communities.find((c) => c.id === id);
	}

	async updateCommunity(communityId: string, updates: Partial<Community>): Promise<void> {
		const community = this.data.communities.find((c) => c.id === communityId);
		if (community) {
			Object.assign(community, updates);
			community.lastActiveAt = Date.now();
			this.dirty = true;
			await this.save();
		}
	}

	// ====================================================
	// 结晶方法
	// ====================================================

	getCrystals(): LogicalCrystal[] {
		return Object.values(this.data.crystals || {});
	}

	getCrystal(id: string): LogicalCrystal | undefined {
		return this.data.crystals ? this.data.crystals[id] : undefined;
	}

	async upsertCrystal(crystal: LogicalCrystal): Promise<void> {
		if (!this.data.crystals) this.data.crystals = {};
		this.data.crystals[crystal.id] = { ...crystal };
		this.dirty = true;
		await this.save();
	}

	async removeCrystal(id: string): Promise<void> {
		if (this.data.crystals) {
			delete this.data.crystals[id];
			this.dirty = true;
			await this.save();
		}
	}

	getCrystalForNebula(nebulaId: string): LogicalCrystal | undefined {
		return this.getCrystals().find(c => c.nebulaId === nebulaId);
	}

	// ====================================================
	// 层级与系统方法
	// ====================================================

	getKnowledgeLayers(): KnowledgeLayer[] {
		return this.data.knowledgeLayers || [];
	}

	async updateKnowledgeLayers(layers: KnowledgeLayer[]): Promise<void> {
		this.data.knowledgeLayers = layers;
		this.dirty = true;
		await this.save();
	}

	getStats(): { totalConcepts: number; totalNotes: number; totalRelations: number } {
		return {
			totalConcepts: Object.keys(this.data.concepts).length,
			totalNotes: Object.keys(this.data.notes).length,
			totalRelations: this.data.relations.length,
		};
	}

	getData(): IndexData {
		return this.data;
	}

	getUserInterventions(): UserIntervention[] {
		return [...this.data.userInterventions];
	}

	async addIntervention(
		type: InterventionType,
		targetType: "community" | "concept",
		targetId: string,
		details: Record<string, unknown>
	): Promise<UserIntervention> {
		const intervention: UserIntervention = {
			id: `ui_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
			type,
			targetType,
			targetId,
			details,
			createdAt: Date.now(),
			isActive: true,
		};
		this.data.userInterventions.push(intervention);
		this.dirty = true;
		await this.save();
		return intervention;
	}

	async deactivateIntervention(id: string): Promise<void> {
		const intervention = this.data.userInterventions.find((i) => i.id === id);
		if (intervention) {
			intervention.isActive = false;
			this.dirty = true;
			await this.save();
		}
	}
}
