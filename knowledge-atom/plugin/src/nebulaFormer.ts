import type { KnowledgeProton, GravityVector, ConceptNebula, Relation } from "./types";

export class NebulaFormer {
	private static readonly MIN_GRAVITY_THRESHOLD = 0.15;
	private static readonly MIN_CLUSTER_SIZE = 2;
	private static readonly MERGE_THRESHOLD = 0.3;

	static formNebulas(protons: KnowledgeProton[], relations: Relation[]): ConceptNebula[] {
		if (protons.length === 0) return [];
		if (protons.length === 1) {
			return [{
				id: `nebula_${protons[0].id}`,
				protons: [protons[0].id],
				cohesionStrength: 1.0,
				stability: 1.0,
				boundaryPoints: [],
				centerOfGravity: { x: 0, y: 0 },
				radius: 50,
				createdAt: Date.now(),
				lastUpdatedAt: Date.now()
			}];
		}

		const adjacency = new Map<string, Map<string, { energy: number; strength: number; direction: number }>>();
		for (const p of protons) adjacency.set(p.id, new Map());

		for (const rel of relations) {
			if (!adjacency.has(rel.from) || !adjacency.has(rel.to)) continue;
			const energy = Math.max(0, rel.gravity.strength * Math.max(0, rel.gravity.direction));
			if (energy < this.MIN_GRAVITY_THRESHOLD) continue;
			adjacency.get(rel.from)!.set(rel.to, { energy, strength: rel.gravity.strength, direction: rel.gravity.direction });
			adjacency.get(rel.to)!.set(rel.from, { energy, strength: rel.gravity.strength, direction: rel.gravity.direction });
		}

		const protonToCluster = this.hierarchicalClustering(protons, adjacency);

		const clusterMap = new Map<string, string[]>();
		for (const [protonId, clusterId] of protonToCluster) {
			if (!clusterMap.has(clusterId)) clusterMap.set(clusterId, []);
			clusterMap.get(clusterId)!.push(protonId);
		}

		const mergedClusters = this.mergeSmallClusters(clusterMap, adjacency);

		const nebulas: ConceptNebula[] = [];
		for (const [id, protonIds] of mergedClusters.entries()) {
			if (protonIds.length < this.MIN_CLUSTER_SIZE) continue;

			const cohesion = this.computeCohesion(protonIds, relations);
			const stability = this.computeStability(protonIds, relations, cohesion);
			const dominantDimension = this.findDominantDimension(protonIds, relations);

			nebulas.push({
				id: id,
				protons: protonIds,
				firstPrinciple: dominantDimension,
				cohesionStrength: cohesion,
				stability: stability,
				boundaryPoints: [],
				centerOfGravity: { x: 0, y: 0 },
				radius: 50 + protonIds.length * 15,
				createdAt: Date.now(),
				lastUpdatedAt: Date.now()
			});
		}

		for (const p of protons) {
			if (!protonToCluster.has(p.id) || !mergedClusters.has(protonToCluster.get(p.id)!)) {
				const soloId = `nebula_${p.id}`;
				nebulas.push({
					id: soloId,
					protons: [p.id],
					cohesionStrength: 0,
					stability: 0,
					boundaryPoints: [],
					centerOfGravity: { x: 0, y: 0 },
					radius: 40,
					createdAt: Date.now(),
					lastUpdatedAt: Date.now()
				});
			}
		}

		return nebulas;
	}

	private static hierarchicalClustering(
		protons: KnowledgeProton[],
		adjacency: Map<string, Map<string, { energy: number; strength: number; direction: number }>>
	): Map<string, string> {
		const clusterMap = new Map<string, string>();
		for (const p of protons) clusterMap.set(p.id, `nebula_${p.id}`);

		const edges: Array<{ from: string; to: string; energy: number }> = [];
		for (const [fromId, neighbors] of adjacency) {
			for (const [toId, data] of neighbors) {
				if (fromId < toId) {
					edges.push({ from: fromId, to: toId, energy: data.energy });
				}
			}
		}
		edges.sort((a, b) => b.energy - a.energy);

		const parent = new Map<string, string>();
		const rank = new Map<string, number>();
		for (const p of protons) {
			parent.set(p.id, p.id);
			rank.set(p.id, 0);
		}

		const find = (x: string): string => {
			while (parent.get(x) !== x) {
				parent.set(x, parent.get(parent.get(x)!)!);
				x = parent.get(x)!;
			}
			return x;
		};

		const union = (x: string, y: string): boolean => {
			const rx = find(x);
			const ry = find(y);
			if (rx === ry) return false;
			if (rank.get(rx)! < rank.get(ry)!) {
				parent.set(rx, ry);
			} else if (rank.get(rx)! > rank.get(ry)!) {
				parent.set(ry, rx);
			} else {
				parent.set(ry, rx);
				rank.set(rx, rank.get(rx)! + 1);
			}
			return true;
		};

		const clusterSizes = new Map<string, number>();
		for (const p of protons) clusterSizes.set(p.id, 1);

		const MAX_CLUSTER_SIZE = Math.max(8, Math.floor(protons.length / 2));

		for (const edge of edges) {
			const rootFrom = find(edge.from);
			const rootTo = find(edge.to);
			if (rootFrom === rootTo) continue;

			const sizeFrom = clusterSizes.get(rootFrom) || 1;
			const sizeTo = clusterSizes.get(rootTo) || 1;

			if (sizeFrom + sizeTo <= MAX_CLUSTER_SIZE) {
				union(edge.from, edge.to);
				const newRoot = find(edge.from);
				clusterSizes.set(newRoot, sizeFrom + sizeTo);
			}
		}

		for (const p of protons) {
			const root = find(p.id);
			clusterMap.set(p.id, `nebula_${root}`);
		}

		return clusterMap;
	}

	private static mergeSmallClusters(
		clusterMap: Map<string, string[]>,
		adjacency: Map<string, Map<string, { energy: number; strength: number; direction: number }>>
	): Map<string, string[]> {
		const result = new Map(clusterMap);

		let changed = true;
		let iter = 0;
		while (changed && iter < 5) {
			changed = false;
			iter++;

			const smallClusters = [...result.entries()].filter(([_, ids]) => ids.length < this.MIN_CLUSTER_SIZE);
			for (const [smallId, smallProtons] of smallClusters) {
				let bestTarget: string | null = null;
				let bestEnergy = 0;

				for (const [targetId, targetProtons] of result) {
					if (targetId === smallId) continue;
					if (targetProtons.length + smallProtons.length > 12) continue;

					let crossEnergy = 0;
					for (const sp of smallProtons) {
						const neighbors = adjacency.get(sp);
						if (!neighbors) continue;
						for (const tp of targetProtons) {
							const data = neighbors.get(tp);
							if (data) crossEnergy += data.energy;
						}
					}

					if (crossEnergy > bestEnergy) {
						bestEnergy = crossEnergy;
						bestTarget = targetId;
					}
				}

				if (bestTarget && bestEnergy > this.MERGE_THRESHOLD) {
					const targetProtons = result.get(bestTarget)!;
					targetProtons.push(...smallProtons);
					result.delete(smallId);
					changed = true;
				}
			}
		}

		return result;
	}

	private static computeCohesion(protonIds: string[], relations: Relation[]): number {
		if (protonIds.length < 2) return 1.0;

		let totalEnergy = 0;
		let pairCount = 0;
		const idSet = new Set(protonIds);

		for (const rel of relations) {
			if (idSet.has(rel.from) && idSet.has(rel.to)) {
				totalEnergy += rel.gravity.strength * Math.max(0, rel.gravity.direction);
				pairCount++;
			}
		}

		const maxPossiblePairs = protonIds.length * (protonIds.length - 1) / 2;
		if (maxPossiblePairs === 0) return 0.5;

		const density = pairCount / maxPossiblePairs;
		const avgEnergy = pairCount > 0 ? totalEnergy / pairCount : 0;

		return Math.max(0, Math.min(1, density * 0.4 + avgEnergy * 0.6));
	}

	private static computeStability(protonIds: string[], relations: Relation[], cohesion: number): number {
		if (protonIds.length < 2) return 0.5;

		const idSet = new Set(protonIds);
		let externalDisturbance = 0;

		for (const rel of relations) {
			const fromInside = idSet.has(rel.from);
			const toInside = idSet.has(rel.to);
			if (fromInside !== toInside) {
				externalDisturbance += rel.gravity.strength * 0.5;
			}
		}

		const normalizedDisturbance = Math.min(1, externalDisturbance / Math.max(1, protonIds.length));
		return Math.max(0, Math.min(1, cohesion - normalizedDisturbance * 0.3));
	}

	private static findDominantDimension(protonIds: string[], relations: Relation[]): string | undefined {
		if (protonIds.length < 2) return undefined;

		const idSet = new Set(protonIds);
		const dimensionCounts = new Map<string, number>();

		for (const rel of relations) {
			if (idSet.has(rel.from) && idSet.has(rel.to)) {
				for (const dim of (rel.gravity.dimensions || [])) {
					dimensionCounts.set(dim, (dimensionCounts.get(dim) || 0) + 1);
				}
			}
		}

		let bestDim = "";
		let bestCount = 0;
		for (const [dim, count] of dimensionCounts) {
			if (count > bestCount) {
				bestCount = count;
				bestDim = dim;
			}
		}

		return bestDim || undefined;
	}

	static computeConvexHull(points: Array<{ x: number, y: number }>): Array<{ x: number, y: number }> {
		if (points.length <= 2) return [...points];

		let pivot = points[0];
		for (const p of points) {
			if (p.y < pivot.y || (p.y === pivot.y && p.x < pivot.x)) {
				pivot = p;
			}
		}

		const sorted = [...points].sort((a, b) => {
			const angleA = Math.atan2(a.y - pivot.y, a.x - pivot.x);
			const angleB = Math.atan2(b.y - pivot.y, b.x - pivot.x);
			if (Math.abs(angleA - angleB) > 1e-10) return angleA - angleB;
			const distA = (a.x - pivot.x) ** 2 + (a.y - pivot.y) ** 2;
			const distB = (b.x - pivot.x) ** 2 + (b.y - pivot.y) ** 2;
			return distA - distB;
		});

		const hull: Array<{ x: number, y: number }> = [];
		for (const p of sorted) {
			while (hull.length >= 2) {
				const a = hull[hull.length - 2];
				const b = hull[hull.length - 1];
				const crossProduct = (b.x - a.x) * (p.y - b.y) - (b.y - a.y) * (p.x - b.x);
				if (crossProduct <= 0) {
					hull.pop();
				} else {
					break;
				}
			}
			hull.push(p);
		}

		return hull;
	}
}
