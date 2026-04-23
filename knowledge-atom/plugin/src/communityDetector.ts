import type { Relation, Community, GravityVector, KnowledgeProton, ConceptNebula } from "./types";
import { COMMUNITY_COLORS, PHASE_COLORS } from "./types";
import { NebulaFormer } from "./nebulaFormer";

/**
 * CommunityDetector: 社区检测器 (V0.7.0 适配版)
 * 封装星云聚合逻辑，对接旧版 UI 需要的 Community 接口
 */
export class CommunityDetector {
	/**
	 * 基于引力检测社区（星云）
	 */
	static detect(protons: KnowledgeProton[], relations: Relation[]): Community[] {
		if (protons.length === 0) return [];

		// 1. 调用星云聚合器进行底层聚类
		const nebulas = NebulaFormer.formNebulas(protons, relations);

		// 2. 将星云转换为社区对象以适配现有 UI 和存储
		return this.convertNebulasToCommunities(nebulas, protons);
	}

	/**
	 * 将星云对象转换为社区对象
	 */
	private static convertNebulasToCommunities(nebulas: ConceptNebula[], allProtons: KnowledgeProton[]): Community[] {
		const protonMap = new Map<string, KnowledgeProton>();
		allProtons.forEach(p => protonMap.set(p.id, p));

		return nebulas.map((nebula, index) => {
			const nebulaProtons = nebula.protons
				.map(id => protonMap.get(id))
				.filter((p): p is KnowledgeProton => !!p);

			const conceptNames = nebulaProtons.map(p => p.conceptName);

			return {
				id: nebula.id,
				name: nebula.firstPrinciple || `星云 ${index + 1}`,
				firstPrinciple: nebula.firstPrinciple,
				phase: nebula.stability > 0.7 ? "crystal" : "vapor",
				concepts: conceptNames,
				protons: nebulaProtons,
				cohesionStrength: nebula.cohesionStrength,
				stability: nebula.stability,
				boundaryPoints: nebula.boundaryPoints,
				centerOfGravity: nebula.centerOfGravity,
				radius: nebula.radius,
				energyDensity: nebula.cohesionStrength, // 能量密度映射为内聚力
				velocity: 0,
				createdAt: nebula.createdAt,
				lastActiveAt: nebula.lastUpdatedAt,
				isNamed: !!nebula.firstPrinciple,
				x: nebula.centerOfGravity.x,
				y: nebula.centerOfGravity.y,
				vx: 0,
				vy: 0,
				color: COMMUNITY_COLORS[index % COMMUNITY_COLORS.length]
			};
		});
	}

	/**
	 * 兼容性方法：从标签自动命名（如果 AI 没给名字）
	 */
	static labelCommunities(
		communities: Community[],
		conceptTags: Record<string, string[]> = {}
	): void {
		for (const comm of communities) {
			if (comm.isNamed) continue;

			const tagFreq = new Map<string, number>();
			for (const name of comm.concepts) {
				const tags = conceptTags[name] || [];
				for (const tag of tags) {
					tagFreq.set(tag, (tagFreq.get(tag) || 0) + 1);
				}
			}

			if (tagFreq.size > 0) {
				const sorted = [...tagFreq.entries()].sort((a, b) => b[1] - a[1]);
				comm.name = sorted[0][0];
			} else {
				comm.name = comm.concepts[0] || "未命名星云";
			}
		}
	}
}
