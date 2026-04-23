import type { ConceptNebula, KnowledgeProton, LogicalCrystal, Relation } from "./types";
import { LLMService, LLMMessage } from "./llmService";

/**
 * CrystalSynthesizer: 结晶合成器
 * 负责从成熟星云中提炼“结晶”（元概念/第一性原理）
 */
export class CrystalSynthesizer {
	private llm: LLMService;

	constructor(llm: LLMService) {
		this.llm = llm;
	}

	/**
	 * 从星云中合成结晶
	 * @param nebula 目标星云
	 * @param protons 属于该星云的所有质子
	 */
	async synthesizeCrystal(nebula: ConceptNebula, protons: KnowledgeProton[]): Promise<LogicalCrystal> {
		const coherence = this.calculateCoherence(protons);
		const exampleCount = protons.length;

		// 1. 调用 AI 提炼元概念
		const extraction = await this.extractMetaConcept(protons);

		// 2. 计算初始成熟度 (一致性 70% + 例证 30%)
		// 基础成熟度 = (一致性 * 0.7) + (min(exampleCount / 10, 1) * 0.3)
		const maturity = Math.min(1, (coherence * 0.7) + (Math.min(exampleCount / 10, 1) * 0.3));

		return {
			id: `crystal_${nebula.id}`,
			nebulaId: nebula.id,
			metaConcept: extraction.title,
			description: extraction.description,
			maturity: maturity,
			coherenceScore: coherence,
			exampleCount: exampleCount,
			state: maturity > 0.6 ? "stable" : "forming",
			formedAt: Date.now(),
			lastStateChangeAt: Date.now()
		};
	}

	/**
	 * 评估扰动对结晶的影响
	 * @param crystal 当前结晶
	 * @param nebula 关联星云
	 * @param incomingProtons 新加入的质子
	 * @param internalRelations 星云内部所有关系
	 */
	assessImpact(
		crystal: LogicalCrystal,
		nebula: ConceptNebula,
		incomingProtons: KnowledgeProton[],
		internalRelations: Relation[]
	): "integrate" | "shatter" | "noop" {
		if (incomingProtons.length === 0) return "noop";

		// 计算新加入质子的平均引力方向
		let totalDirection = 0;
		let relationCount = 0;
		const nebulaProtonIds = new Set(nebula.protons);

		for (const rel of internalRelations) {
			const isInternalToNew = incomingProtons.some(p => p.id === rel.from || p.id === rel.to);
			const interactsWithNebula = (nebulaProtonIds.has(rel.from) && incomingProtons.some(p => p.id === rel.to)) ||
										(nebulaProtonIds.has(rel.to) && incomingProtons.some(p => p.id === rel.from));

			if (isInternalToNew || interactsWithNebula) {
				totalDirection += (rel.gravity.strength * rel.gravity.direction);
				relationCount++;
			}
		}

		const avgDirection = relationCount > 0 ? totalDirection / relationCount : 0;

		// 如果平均引力方向为负（排斥力强），且强度超过阈值，则可能触发破碎
		if (avgDirection < -0.3 && crystal.maturity < 0.9) {
			return "shatter";
		}

		// 如果引力方向为正且强度达标，则融入
		if (avgDirection > 0.2) {
			return "integrate";
		}

		return "noop";
	}

	/**
	 * 计算星云内部一致性分数
	 */
	private calculateCoherence(protons: KnowledgeProton[]): number {
		if (protons.length <= 1) return 1.0;

		// 检查底层规律的重合度
		const principleCounts = new Map<string, number>();
		protons.forEach(p => {
			p.firstPrinciples.forEach(fp => {
				principleCounts.set(fp, (principleCounts.get(fp) || 0) + 1);
			});
		});

		let maxCount = 0;
		for (const count of principleCounts.values()) {
			maxCount = Math.max(maxCount, count);
		}

		return maxCount / protons.length;
	}

	/**
	 * 调用 AI 提炼元概念
	 */
	private async extractMetaConcept(protons: KnowledgeProton[]): Promise<{ title: string; description: string }> {
		const systemPrompt = `你是一个知识炼金术士。你的任务是从一组具有强关联性的“知识质子”中，提炼出它们背后的核心规律或元概念。

		要求：
		1. 提炼出的标题应当具有“去背景化”的特征（即不仅限于当前讨论的具体行业或场景）。
		2. 描述应当阐明这些事实背后的第一性原则。
		3. 语言精炼且富有洞察力。

		必须以 JSON 格式返回：
		- title: 元概念名称
		- description: 元概念描述`;

		const userPrompt = `请从以下质子中提炼结晶：

		${protons.map((p, i) => `质子 ${i+1} [${p.conceptName}]:
		底层规律: ${p.firstPrinciples.join(", ")}
		内容: ${p.content.substring(0, 150)}`).join("\n\n")}

		提炼结果 (JSON):`;

		const messages: LLMMessage[] = [
			{ role: "system", content: systemPrompt },
			{ role: "user", content: userPrompt }
		];

		try {
			return await this.llm.chatJSON<{ title: string; description: string }>(messages);
		} catch (e) {
			console.error("Meta-concept extraction failed:", e);
			return {
				title: "形成中的结晶",
				description: "正在通过质子引力自动聚合..."
			};
		}
	}
}
