import { App, Vault } from "obsidian";
import type { ConceptStat, StatsData, ConceptLevel, CommunityStat } from "./types";
import { KnowledgeIndex } from "./knowledgeIndex";
import { LevelComputer } from "./levelComputer";

const STATS_PATH = ".knowledge-atom/stats.json";

export class StatsEngine {
	private app: App;
	private vault: Vault;
	private index: KnowledgeIndex;
	private stats: StatsData;

	constructor(app: App, index: KnowledgeIndex) {
		this.app = app;
		this.vault = app.vault;
		this.index = index;
		this.stats = {
			lastComputedAt: new Date().toISOString(),
			totalNotes: 0,
			totalConcepts: 0,
			totalRelations: 0,
			conceptStats: {},
			communityStats: {},
		};
	}

	async load(): Promise<void> {
		try {
			const exists = await this.vault.adapter.exists(STATS_PATH);
			if (exists) {
				const raw = await this.vault.adapter.read(STATS_PATH);
				this.stats = JSON.parse(raw);
			}
		} catch {
			this.stats = {
				lastComputedAt: new Date().toISOString(),
				totalNotes: 0,
				totalConcepts: 0,
				totalRelations: 0,
				conceptStats: {},
				communityStats: {},
			};
		}
	}

	async save(): Promise<void> {
		this.stats.lastComputedAt = new Date().toISOString();
		const dir = STATS_PATH.substring(0, STATS_PATH.lastIndexOf("/"));
		if (!(await this.vault.adapter.exists(dir))) {
			await this.vault.adapter.mkdir(dir);
		}
		await this.vault.adapter.write(STATS_PATH, JSON.stringify(this.stats, null, 2));
	}

	incrementMentionCount(conceptName: string, delta = 1): void {
		this.ensureConceptStat(conceptName);
		this.stats.conceptStats[conceptName].mentionCount += delta;
	}

	updateConceptScores(conceptName: string): void {
		this.ensureConceptStat(conceptName);

		const relations = this.index.getRelations(conceptName);
		const communities = this.index.getCommunities();
		const myCommunity = this.index.getCommunityForConcept(conceptName);

		let intraCount = 0;
		let crossCount = 0;
		const crossCommunities = new Set<string>();

		for (const rel of relations) {
			const otherName = rel.from === conceptName ? rel.to : rel.from;
			const otherCommunity = this.index.getCommunityForConcept(otherName);

			if (otherCommunity && myCommunity && otherCommunity.id === myCommunity.id) {
				intraCount++;
			} else {
				crossCount++;
				if (otherCommunity) crossCommunities.add(otherCommunity.id);
			}
		}

		const total = relations.length || 1;
		const stat = this.stats.conceptStats[conceptName];
		stat.intraScore = intraCount / total;
		stat.crossScore = crossCount / total;
		stat.crossCommunityCount = crossCommunities.size;
		stat.relationCount = relations.length;
		stat.communities = myCommunity ? [myCommunity.id] : [];
	}

	updateAllScores(): void {
		const concepts = this.index.getAllConcepts();
		for (const concept of concepts) {
			this.updateConceptScores(concept.name);
		}
		this.stats.totalConcepts = concepts.length;
		this.stats.totalNotes = Object.keys(this.index.getData().notes).length;
		this.stats.totalRelations = this.index.getData().relations.length;
	}

	async recomputeAll(): Promise<void> {
		this.updateAllScores();
		this.updateCommunityStats();

		const levelResults = LevelComputer.computeAll(this.stats);
		for (const [name, result] of levelResults) {
			if (this.stats.conceptStats[name]) {
				this.stats.conceptStats[name].currentLevel = result.level;
			}
			await this.index.updateConceptLevel(name, result.level, "auto");
		}

		await this.save();
	}

	async recomputeLevels(): Promise<void> {
		const levelResults = LevelComputer.computeAll(this.stats);
		const relations = this.index.getRelations();
		const concepts = this.index.getAllConcepts();

		const centralityScores = this.computeGravityCentrality(concepts, relations);
		const abstractnessScores = this.computeAbstractness(concepts, relations);

		for (const [name, result] of levelResults) {
			if (this.stats.conceptStats[name]) {
				this.stats.conceptStats[name].currentLevel = result.level;
			}
			const centrality = centralityScores.get(name) ?? 0.1;
			const abstractness = abstractnessScores.get(name) ?? 0;
			await this.index.updateConceptMetrics(name, { centrality, abstractness });
		}
		await this.save();
	}

	private computeGravityCentrality(
		concepts: Array<{ name: string }>,
		relations: Array<{ from: string; to: string; gravity: { strength: number; direction: number } }>
	): Map<string, number> {
		const scores = new Map<string, number>();
		const degreeMap = new Map<string, number>();

		for (const c of concepts) degreeMap.set(c.name, 0);
		for (const r of relations) {
			if (!degreeMap.has(r.from) || !degreeMap.has(r.to)) continue;
			const weight = r.gravity.strength * Math.max(0, r.gravity.direction);
			degreeMap.set(r.from, (degreeMap.get(r.from) || 0) + weight);
			degreeMap.set(r.to, (degreeMap.get(r.to) || 0) + weight);
		}

		let maxDegree = 0;
		for (const d of degreeMap.values()) {
			if (d > maxDegree) maxDegree = d;
		}

		for (const [name, degree] of degreeMap) {
			scores.set(name, maxDegree > 0 ? degree / maxDegree : 0);
		}

		return scores;
	}

	private computeAbstractness(
		concepts: Array<{ name: string }>,
		relations: Array<{ from: string; to: string; gravity: { strength: number; direction: number } }>
	): Map<string, number> {
		const scores = new Map<string, number>();
		const outWeight = new Map<string, number>();
		const inWeight = new Map<string, number>();

		for (const c of concepts) {
			outWeight.set(c.name, 0);
			inWeight.set(c.name, 0);
		}

		for (const r of relations) {
			if (!outWeight.has(r.from) || !inWeight.has(r.to)) continue;
			const weight = r.gravity.strength * Math.max(0, r.gravity.direction);
			outWeight.set(r.from, (outWeight.get(r.from) || 0) + weight);
			inWeight.set(r.to, (inWeight.get(r.to) || 0) + weight);
		}

		for (const c of concepts) {
			const out = outWeight.get(c.name) || 0;
			const total = out + (inWeight.get(c.name) || 0);
			scores.set(c.name, total > 0 ? out / total : 0);
		}

		return scores;
	}

	updateCommunityStats(): void {
		const communities = this.index.getCommunities();
		this.stats.communityStats = {};

		for (const community of communities) {
			let totalRelations = 0;
			for (const conceptName of community.concepts) {
				totalRelations += this.index.getRelations(conceptName).length;
			}
			this.stats.communityStats[community.id] = {
				conceptCount: community.concepts.length,
				avgRelations: community.concepts.length > 0 ? totalRelations / community.concepts.length : 0,
			};
		}
	}

	getConceptStat(name: string): ConceptStat | undefined {
		return this.stats.conceptStats[name];
	}

	getAllStats(): StatsData {
		return this.stats;
	}

	private ensureConceptStat(name: string): void {
		if (!this.stats.conceptStats[name]) {
			this.stats.conceptStats[name] = {
				mentionCount: 0,
				relationCount: 0,
				crossCommunityCount: 0,
				intraScore: 0,
				crossScore: 0,
				currentLevel: "leaf",
				levelSource: "auto",
				communities: [],
			};
		}
	}
}
