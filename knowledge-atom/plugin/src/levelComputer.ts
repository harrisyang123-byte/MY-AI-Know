import type { ConceptLevel, ConceptStat, StatsData } from "./types";

export interface LevelResult {
	level: ConceptLevel;
	reason: string;
}

export class LevelComputer {
	static computeLevel(
		conceptName: string,
		conceptStat: ConceptStat,
		allStats: StatsData,
		totalConcepts: number
	): LevelResult {
		if (totalConcepts < 5) {
			return conceptStat.relationCount >= 3
				? { level: "core", reason: "概念数<5，关系≥3" }
				: { level: "leaf", reason: "概念数<5，关系<3" };
		}

		if (conceptStat.crossScore >= 0.4 && conceptStat.crossCommunityCount >= 2) {
			return {
				level: "bridge",
				reason: `跨${conceptStat.crossCommunityCount}个社区，crossScore=${conceptStat.crossScore.toFixed(2)}`,
			};
		}

		const allRelationCounts = Object.values(allStats.conceptStats)
			.map((s) => s.relationCount)
			.sort((a, b) => b - a);
		const top15Index = Math.max(0, Math.floor(allRelationCounts.length * 0.15) - 1);
		const top15Threshold = allRelationCounts[top15Index] || 0;

		if (conceptStat.intraScore >= 0.6 && conceptStat.relationCount >= top15Threshold) {
			return {
				level: "core",
				reason: `intraScore=${conceptStat.intraScore.toFixed(2)}，关系数排名前15%`,
			};
		}

		return { level: "leaf", reason: "不满足core或bridge条件" };
	}

	static computeAll(stats: StatsData): Map<string, LevelResult> {
		const results = new Map<string, LevelResult>();
		const totalConcepts = Object.keys(stats.conceptStats).length;

		for (const [name, conceptStat] of Object.entries(stats.conceptStats)) {
			const result = this.computeLevel(name, conceptStat, stats, totalConcepts);
			results.set(name, result);
		}

		return results;
	}

	static shouldRecompute(oldStats: StatsData, newConceptCount: number): boolean {
		if (oldStats.totalConcepts === 0) return true;
		const delta = Math.abs(newConceptCount - oldStats.totalConcepts);
		const ratio = delta / oldStats.totalConcepts;
		return ratio >= 0.1;
	}
}
