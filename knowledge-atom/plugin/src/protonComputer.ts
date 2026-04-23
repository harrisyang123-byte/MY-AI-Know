import type { Community, ConceptEntry, Relation, KnowledgeProton, GravityVector } from "./types";

/**
 * ProtonComputer: 质子计算器 (V0.7.0 适配版)
 * 计算知识质子在引力网络中的权重与层级
 */
export class ProtonComputer {
	computeProtons(
		community: Community,
		concepts: Record<string, ConceptEntry>,
		relations: Relation[]
	): KnowledgeProton[] {
		const protons: KnowledgeProton[] = [];

		for (const conceptName of community.concepts) {
			const entry = concepts[conceptName];
			if (!entry) continue;

			protons.push({
				id: `p_${conceptName}`,
				conceptName,
				content: entry.definition,
				firstPrinciples: entry.firstPrinciples || [],
				centrality: entry.centrality,
				abstractness: entry.abstractness,
				sourceNotePath: entry.sources[0] || "",
				extractedAt: entry.extractedAt,
			});
		}

		return this.computeProtonMetrics(protons, relations);
	}

	/**
	 * 计算质子的核心属性
	 */
	computeProtonMetrics(
		protons: KnowledgeProton[],
		relations: Relation[]
	): KnowledgeProton[] {
		if (protons.length === 0) return [];

		// 1. 计算特征向量中心度 (基于引力能量)
		const centralityScores = this.computeGravityCentrality(protons, relations);

		// 2. 更新质子属性
		return protons.map(p => ({
			...p,
			centrality: centralityScores.get(p.id) || 0.1,
			// 抽象程度计算：被引用的广度（关联的维度数量）
			abstractness: this.computeAbstractness(p.id, relations)
		}));
	}

	/**
	 * 基于引力能量的中心度计算
	 */
	private computeGravityCentrality(
		protons: KnowledgeProton[],
		relations: Relation[]
	): Map<string, number> {
		const protonIds = protons.map(p => p.id);
		const adjacency = this.buildGravityAdjacency(protonIds, relations);

		let scores = new Map<string, number>();
		protonIds.forEach(id => scores.set(id, 1));

		// 幂迭代法计算主特征向量
		for (let iter = 0; iter < 50; iter++) {
			const newScores = new Map<string, number>();
			let maxScore = 0;

			for (const id of protonIds) {
				let sum = 0;
				const neighbors = adjacency.get(id) || new Map<string, number>();
				for (const [neighborId, energy] of neighbors) {
					sum += (scores.get(neighborId) || 0) * energy;
				}
				newScores.set(id, sum);
				maxScore = Math.max(maxScore, sum);
			}

			if (maxScore > 0) {
				for (const id of protonIds) {
					newScores.set(id, newScores.get(id)! / maxScore);
				}
			}

			let delta = 0;
			for (const id of protonIds) {
				delta += Math.abs(newScores.get(id)! - scores.get(id)!);
			}

			scores = newScores;
			if (delta < 0.001) break;
		}

		return scores;
	}

	/**
	 * 构建引力能量矩阵 (能量 = 强度 * 方向)
	 */
	private buildGravityAdjacency(
		protonIds: string[],
		relations: Relation[]
	): Map<string, Map<string, number>> {
		const adjacency = new Map<string, Map<string, number>>();
		protonIds.forEach(id => adjacency.set(id, new Map()));

		for (const rel of relations) {
			if (!adjacency.has(rel.from) || !adjacency.has(rel.to)) continue;

			// 引力中心度只考虑吸引力，排斥力视为网络权重的削弱
			const energy = Math.max(0, rel.gravity.strength * rel.gravity.direction);

			adjacency.get(rel.from)!.set(rel.to, energy);
			adjacency.get(rel.to)!.set(rel.from, energy);
		}

		return adjacency;
	}

	/**
	 * 计算抽象程度：基于关联维度的多样性与引力跨度
	 */
	private computeAbstractness(protonId: string, relations: Relation[]): number {
		const relevantRelations = relations.filter(r => r.from === protonId || r.to === protonId);
		if (relevantRelations.length === 0) return 0.1;

		const dimensionSet = new Set<string>();
		relevantRelations.forEach(r => {
			(r.gravity?.dimensions || []).forEach(d => dimensionSet.add(d));
		});

		// 维度越多，抽象潜力越大；引力强度越高，规律越普适
		const avgStrength = relevantRelations.reduce((sum, r) => sum + (r.gravity?.strength ?? 0), 0) / (relevantRelations.length || 1);
		const dimensionBonus = Math.min(1, dimensionSet.size / 5);

		return Math.min(1, (avgStrength * 0.4) + (dimensionBonus * 0.6));
	}
}
