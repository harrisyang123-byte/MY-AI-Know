import assert from "node:assert";
import test from "node:test";
import { NebulaFormer } from "../nebulaFormer";
import type { KnowledgeProton, Relation } from "../types";

test("NebulaFormer - computeConvexHull", () => {
	const points = [
		{ x: 0, y: 0 },
		{ x: 10, y: 0 },
		{ x: 10, y: 10 },
		{ x: 0, y: 10 },
		{ x: 5, y: 5 } // 内部点，不应在凸包上
	];

	const hull = NebulaFormer.computeConvexHull(points);

	assert.strictEqual(hull.length, 4);
	assert.ok(hull.some(p => p.x === 0 && p.y === 0));
	assert.ok(hull.some(p => p.x === 10 && p.y === 0));
	assert.ok(hull.some(p => p.x === 10 && p.y === 10));
	assert.ok(hull.some(p => p.x === 0 && p.y === 10));
	assert.ok(!hull.some(p => p.x === 5 && p.y === 5));
});

test("NebulaFormer - formNebulas (Basic Clustering)", () => {
	const protons: KnowledgeProton[] = [
		{ id: "p1", conceptName: "A", content: "", firstPrinciples: [], centrality: 0, abstractness: 0, sourceNotePath: "", extractedAt: "" },
		{ id: "p2", conceptName: "B", content: "", firstPrinciples: [], centrality: 0, abstractness: 0, sourceNotePath: "", extractedAt: "" },
		{ id: "p3", conceptName: "C", content: "", firstPrinciples: [], centrality: 0, abstractness: 0, sourceNotePath: "", extractedAt: "" }
	];

	const relations: Relation[] = [
		{
			id: "r1", from: "p1", to: "p2",
			gravity: { strength: 1.0, direction: 1.0, dimensions: ["logic"], context: "attract", computedAt: "", confidence: 1.0 },
			source: "test", createdAt: ""
		}
	];

	const nebulas = NebulaFormer.formNebulas(protons, relations);

	// p1 和 p2 应该聚合在一起，p3 独立
	assert.strictEqual(nebulas.length, 2);
	const nebula1 = nebulas.find(n => n.protons.includes("p1"));
	assert.ok(nebula1?.protons.includes("p2"));
	assert.ok(!nebula1?.protons.includes("p3"));
});
