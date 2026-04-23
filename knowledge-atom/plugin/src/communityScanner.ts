import type {
	Community,
	CommunityPhase,
	ConceptEntry,
	Relation,
	UserIntervention,
	KnowledgeProton,
} from "./types";
import type { KnowledgeIndex } from "./knowledgeIndex";

interface ScanConfig {
	energyDensityWeight: number;
	phaseStabilityWeight: number;
	scanIntervalMs: number;
}

const DEFAULT_CONFIG: ScanConfig = {
	energyDensityWeight: 0.6,
	phaseStabilityWeight: 0.4,
	scanIntervalMs: 30000,
};

interface ScanPriority {
	communityId: string;
	priority: number;
}

export class CommunityScanner {
	private config: ScanConfig;
	private lastScan: Record<string, number> = {};
	private activeInterventions: Set<string> = new Set();

	constructor(config: Partial<ScanConfig> = {}) {
		this.config = { ...DEFAULT_CONFIG, ...config };
	}

	setActiveInterventions(interventions: UserIntervention[]): void {
		this.activeInterventions = new Set(interventions.map((i) => i.targetId));
	}

	async scan(
		index: KnowledgeIndex,
		progressCallback?: (progress: number, message: string) => void,
		llm?: { executeCommunityNaming: (concepts: string[]) => Promise<string>; executeCommunityInsights?: (concepts: string[], name?: string) => Promise<{ principle?: string }> }
	): Promise<Community[]> {
		if (progressCallback) progressCallback(0, "加载知识索引数据...");

		const concepts = index.getConceptMap();
		const relations = index.getRelations();
		const interventions = index.getUserInterventions().filter(i => i.isActive);

		this.setActiveInterventions(interventions);

		if (progressCallback) progressCallback(10, "检测新社区...");

		// 总是重新检测社区，而不是用旧数据
		let communities: Community[] = [];
		if (Object.keys(concepts).length >= 2) {
			communities = await this.detectNewCommunities(concepts, relations);
		}

		if (progressCallback) progressCallback(30, `检测到 ${communities.length} 个社区，计算物理相态...`);

		// 扫描并更新社区
		const updatedCommunities = await this.scanAllCommunities(communities, concepts, relations);

		if (progressCallback) progressCallback(70, "计算质子中心...");

		// 计算质子
		const protonComputer = await import("./protonComputer").then(m => new m.ProtonComputer());
		for (let i = 0; i < updatedCommunities.length; i++) {
			const community = updatedCommunities[i];
			try {
				community.protons = protonComputer.computeProtons(community, concepts, relations) || [];
			} catch {
				community.protons = [];
			}

			if (progressCallback) {
				progressCallback(70 + (i / updatedCommunities.length) * 15, `计算社区 "${community.name || community.id}"...`);
			}
		}

		// AI 自动命名和第一性原则总结（仅对未命名社区）
		if (llm) {
			if (progressCallback) progressCallback(85, "AI 为社区命名和生成第一性原则...");

			for (let i = 0; i < updatedCommunities.length; i++) {
				const community = updatedCommunities[i];

				// PRD: 用户干预优先 - 已命名的社区不修改
				if (!community.isNamed && community.concepts.length >= 2) {
					try {
						if (progressCallback) {
							progressCallback(85 + (i / updatedCommunities.length) * 10, `AI 命名社区: ${community.concepts.slice(0, 3).join("、")}...`);
						}

						const name = await llm.executeCommunityNaming(community.concepts);
						community.name = name;
						community.isNamed = true;
						community.lastActiveAt = Date.now();
					} catch (e) {
						console.error("社区命名失败:", e);
					}
				}

				if (progressCallback) {
					progressCallback(85 + (i / updatedCommunities.length) * 10, `社区命名: ${community.name || "未命名"}`);
				}
			}
		}

		if (progressCallback) progressCallback(95, "保存更新...");

		await index.setCommunities(updatedCommunities);

		if (progressCallback) progressCallback(100, `完成! 共 ${updatedCommunities.length} 个社区`);

		return updatedCommunities;
	}

	async scanAllCommunities(
		communities: Community[],
		concepts: Record<string, ConceptEntry>,
		relations: Relation[]
	): Promise<Community[]> {
		const scanOrder = this.getScanOrder(communities);
		const updated: Community[] = [];

		for (const { communityId } of scanOrder) {
			if (this.activeInterventions.has(communityId)) {
				const community = communities.find((c) => c.id === communityId);
				if (community) {
					updated.push(community);
				}
				continue;
			}
			const community = communities.find((c) => c.id === communityId);
			if (!community) continue;

			const updatedCommunity = await this.scanCommunity(
				community,
				concepts,
				relations
			);
			updated.push(updatedCommunity);
		}

		return updated;
	}

	getScanOrder(communities: Community[]): ScanPriority[] {
		const now = Date.now();
		const priorities: ScanPriority[] = [];

		for (const community of communities) {
			const lastScan = this.lastScan[community.id] || 0;
			const timeSinceLastScan = now - lastScan;

			// PRD: 计算每个社区的能量密度（活跃度 + 新增笔记数）
			const energyDensity = community.energyDensity;
			const phaseStability = this.getPhaseStabilityScore(community.phase);

			// PRD: 尘埃社区放到最后
			const fossilPenalty = community.phase === "fossil" ? -10 : 0;

			// PRD: 自适应轮询扫描策略 - 高能量区域优先扫描
			const priority =
				energyDensity * this.config.energyDensityWeight +
				(1 - phaseStability) * this.config.phaseStabilityWeight +
				Math.min(timeSinceLastScan / this.config.scanIntervalMs, 1) * 0.2 +
				fossilPenalty;

			priorities.push({
				communityId: community.id,
				priority,
			});
		}

		return priorities.sort((a, b) => b.priority - a.priority);
	}

	getPhaseStabilityScore(phase: CommunityPhase): number {
		switch (phase) {
			case "fossil":
				return 0.95;
			case "crystal":
				return 0.8;
			case "vapor":
				return 0.6;
			case "anomaly":
				return 0.4;
			default:
				return 0.5;
		}
	}

	async scanCommunity(
		community: Community,
		concepts: Record<string, ConceptEntry>,
		relations: Relation[]
	): Promise<Community> {
		this.lastScan[community.id] = Date.now();

		const updated: Community = { ...community };

		const newPhase = this.computeCommunityPhase(
			updated,
			concepts,
			relations
		);

		if (newPhase !== updated.phase) {
			updated.phase = newPhase;
			updated.lastActiveAt = Date.now();
		}

		updated.energyDensity = this.computeEnergyDensity(
			updated,
			concepts,
			relations
		);

		updated.cohesionStrength = this.computeModularityDegree(
			updated,
			relations
		);

		updated.stability = 1 - this.computeCrossDomainScore(
			updated,
			relations
		);

		updated.radius = this.computeCommunityRadius(updated);

		return updated;
	}

	computeCommunityPhase(
		community: Community,
		concepts: Record<string, ConceptEntry>,
		relations: Relation[]
	): CommunityPhase {
		const conceptCount = community.concepts.length;
		const now = Date.now();
		const daysSinceCreated = (now - community.createdAt) / (1000 * 60 * 60 * 24);
		const daysSinceActive = (now - community.lastActiveAt) / (1000 * 60 * 60 * 24);

		// 首先检查是否为尘埃的条件
		// PRD: 过去180天无新节点，用户点击<3次，未被活跃社区引用
		if (daysSinceActive > 180) {
			return "fossil";
		}

		// 检查裂变/冲突条件: 内部模块化度上升
		if (community.isNamed && conceptCount >= 5 && community.cohesionStrength > 0.6) {
			return "anomaly";
		}

		// 检查结晶条件
		// PRD: 生命周期>14天，存在中心节点（特征向量中心性显著高于均值，isNamed==true
		if (community.isNamed && conceptCount >= 5 && daysSinceCreated > 14) {
			return "crystal";
		}

		// 默认云团：isNamed==false 或其他情况
		return "vapor";
	}

	computeEnergyDensity(
		community: Community,
		concepts: Record<string, ConceptEntry>,
		relations: Relation[]
	): number {
		const conceptCount = community.concepts.length;
		const communityRelations = relations.filter(
			(r) =>
				community.concepts.includes(r.from) &&
				community.concepts.includes(r.to)
		);

		const relationDensity = conceptCount > 0
			? communityRelations.length / Math.max(conceptCount, 1)
			: 0;

		const now = Date.now();
		const daysSinceActive = (now - community.lastActiveAt) / (1000 * 60 * 60 * 24);
		const recencyScore = Math.max(0, 1 - daysSinceActive / 30);

		const density = (
			0.4 * relationDensity +
			0.3 * (conceptCount / 20) +
			0.3 * recencyScore
		);

		return Math.min(1, Math.max(0, density));
	}

	computeModularityDegree(
		community: Community,
		relations: Relation[]
	): number {
		if (community.protons.length < 2) return 0;

		const intraRelations: number[] = [];

		for (const proton of community.protons) {
			let count = 0;
			for (const rel of relations) {
				if (
					(rel.from === proton.conceptName && community.concepts.includes(rel.to)) ||
					(rel.to === proton.conceptName && community.concepts.includes(rel.from))
				) {
					count++;
				}
			}
			intraRelations.push(count);
		}

		const mean = intraRelations.reduce((a, b) => a + b, 0) / intraRelations.length;
		const variance = intraRelations.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / intraRelations.length;
		const stdDev = Math.sqrt(variance);

		const normalizedVariance = mean > 0 ? stdDev / mean : 0;

		return Math.min(1, normalizedVariance);
	}

	computeCrossDomainScore(
		community: Community,
		relations: Relation[]
	): number {
		let crossRelations = 0;
		let totalRelations = 0;

		for (const conceptName of community.concepts) {
			for (const rel of relations) {
				if (rel.from !== conceptName && rel.to !== conceptName) continue;
				totalRelations++;
				const otherConcept = rel.from === conceptName ? rel.to : rel.from;
				if (!community.concepts.includes(otherConcept)) {
					crossRelations++;
				}
			}
		}

		if (totalRelations === 0) return 0;

		return crossRelations / totalRelations;
	}

	computeCommunityRadius(community: Community): number {
		const baseRadius = 100;
		const conceptMultiplier = 8;
		const energyMultiplier = 50;

		return Math.max(
			baseRadius,
			baseRadius +
				community.concepts.length * conceptMultiplier +
				community.energyDensity * energyMultiplier
		);
	}

	async detectNewCommunities(
		concepts: Record<string, ConceptEntry>,
		relations: Relation[]
	): Promise<Community[]> {
		const adjacency = this.buildAdjacencyMatrix(concepts, relations);
		const communities = this.louvainCommunityDetection(adjacency);
		return communities;
	}

	buildAdjacencyMatrix(
		concepts: Record<string, ConceptEntry>,
		relations: Relation[]
	): Map<string, Map<string, number>> {
		const adjacency = new Map<string, Map<string, number>>();

		for (const name of Object.keys(concepts)) {
			adjacency.set(name, new Map<string, number>());
		}

		for (const rel of relations) {
			const weight = rel.gravity?.confidence || 0.5;
			const fromMap = adjacency.get(rel.from);
			if (fromMap) {
				fromMap.set(rel.to, (fromMap.get(rel.to) || 0) + weight);
			}
			const toMap = adjacency.get(rel.to);
			if (toMap) {
				toMap.set(rel.from, (toMap.get(rel.from) || 0) + weight);
			}
		}

		return adjacency;
	}

	louvainCommunityDetection(
		adjacency: Map<string, Map<string, number>>
	): Community[] {
		const communities: Community[] = [];

		const conceptNames = Array.from(adjacency.keys());
		if (conceptNames.length === 0) return [];

		const visited = new Set<string>();

		// 使用简单的连通分量检测 + 贪心合并
		for (const startName of conceptNames) {
			if (visited.has(startName)) continue;

			const queue: string[] = [startName];
			const component: string[] = [];

			while (queue.length > 0) {
				const current = queue.shift()!;
				if (visited.has(current)) continue;
				visited.add(current);
				component.push(current);

				const neighbors = adjacency.get(current) || new Map();
				for (const [neighbor, weight] of neighbors) {
					if (!visited.has(neighbor) && weight > 0.1) {
						queue.push(neighbor);
					}
				}
			}

			if (component.length >= 2) {
				communities.push({
					id: `c_${communities.length}`,
					phase: "vapor",
					concepts: component,
					protons: [],
					cohesionStrength: 0.5,
					stability: 0.5,
					boundaryPoints: [],
					centerOfGravity: { x: (communities.length % 3 - 1) * 300, y: Math.floor(communities.length / 3 - 1) * 250 },
					energyDensity: 0.5,
					velocity: 0.5,
					createdAt: Date.now(),
					lastActiveAt: Date.now(),
					isNamed: false,
					x: (communities.length % 3 - 1) * 300,
					y: Math.floor(communities.length / 3 - 1) * 250,
					vx: 0,
					vy: 0,
					radius: 100 + component.length * 10,
				});
			}
		}

		return communities;
	}
}
