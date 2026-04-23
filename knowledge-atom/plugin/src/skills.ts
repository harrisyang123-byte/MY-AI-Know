import type { SkillDef, ExtractResult } from "./types";
import { LLMService, LLMMessage } from "./llmService";

export const BUILTIN_SKILLS: SkillDef[] = [
	{
		id: "ai-chat",
		name: "AI 对话",
		icon: "💬",
		description: "与 AI 讨论笔记内容，获取分析和建议",
		systemPrompt:
			"你是知识管理助手。根据用户问题和笔记内容，提供深入分析和关联建议。用中文回答。",
		userPromptTemplate: "{{userInput}}\n\n相关笔记内容:\n{{content}}",
		category: "analyze",
	},
	{
		id: "extract-and-split",
		name: "提取与拆分",
		icon: "🧠",
		description: "提取质子（概念+底层规律）、引力、标签与摘要",
		systemPrompt: `你是知识图谱构建专家。直接输出 JSON，不要任何其他文字。

从笔记中提取：
1. 概念：名称、一句话定义（剥离包装后的核心逻辑），底层规律（从大量事实中抽象出的不变规律），以及支撑该概念的原文例子和片段
2. 引力关系：两个概念之间的引力向量：
   - strength: 0-1, 引力强度
   - direction: -1 (排斥) 到 1 (吸引)
   - dimensions: 作用维度（如：逻辑推导、能量守恒）
   - context: 简短解释为什么产生这种引力
3. 标签：主题标签
4. 摘要：核心摘要

严格按以下 JSON 格式输出：
{
  "concepts": [{"name": "概念名", "definition": "第一性原则定义", "aliases": [], "firstPrinciples": ["规律1", "规律2"], "examples": ["原文中的具体例子1", "原文中的具体例子2"], "originalExcerpt": "与该概念最相关的原文片段（保留原文措辞）"}],
  "relations": [{"from": "概念A", "to": "概念B", "gravity": {"strength": 0.8, "direction": 1.0, "dimensions": ["逻辑"], "context": "A是B的基础"}, "confidence": 0.8}],
  "tags": ["标签1"],
  "summary": "一句话摘要"
}

重要：
- examples: 从原文中提取的具体例子、案例、数据点，保留原文措辞
- originalExcerpt: 与该概念最直接相关的原文段落，保留原文措辞不做改写
- 这两个字段帮助保留原始思考的上下文，便于后续回顾`,
		userPromptTemplate: "请从以下笔记中提取概念和引力关系，直接输出 JSON：\n\n{{content}}",
		category: "extract",
	},
	{
		id: "discuss-note",
		name: "讨论笔记",
		icon: "🗣️",
		description: "结合知识图谱和结晶元概念深度讨论笔记",
		systemPrompt: `你是知识管理专家。你拥有访问“结晶”（提炼出的元概念和第一性原理）的能力。

## 任务
1. 结合当前笔记内容回答用户问题。
2. 如果笔记涉及的概念已形成“结晶”，请引用这些元概念来提升讨论的深度。
3. 指出当前讨论如何支撑或挑战已有的逻辑结晶。

## 回答风格
- 深刻、结构化、富有洞察力。
- 避免复述笔记，要进行逻辑升维。`,
		userPromptTemplate: "当前笔记内容:\n{{content}}\n\n关联结晶元概念:\n{{crystalsDetail}}\n\n用户问题: {{userInput}}",
		category: "analyze",
	},
	{
		id: "gravity-probe",
		name: "引力探测",
		icon: "🔭",
		description: "分析给定概念与已有概念库的引力关联",
		systemPrompt: `你是知识图谱专家。分析当前概念与已有概念之间的引力关联。

## 判断标准
1. 两个概念有底层逻辑上的吸引（一致/互补）或排斥（冲突）。
2. 返回高置信度的关联。

## 输出格式
{
  "probes": [{"targetConcept": "概念B", "gravity": {"strength": 0.7, "direction": 1.0, "dimensions": ["逻辑"], "context": "A是B的基础"}, "reason": "理由"}]
}`,
		userPromptTemplate:
			"当前概念:\n{{currentConcept}}\n\n已有概念库:\n{{existingConcepts}}",
		category: "analyze",
	}
];

export class SkillEngine {
	private llm: LLMService;

	constructor(llm: LLMService) {
		this.llm = llm;
	}

	updateLLM(llm: LLMService): void {
		this.llm = llm;
	}

	async executeChat(userInput: string, content: string): Promise<string> {
		const skill = BUILTIN_SKILLS.find((s) => s.id === "ai-chat")!;
		const userMsg = skill.userPromptTemplate
			.replace("{{userInput}}", userInput)
			.replace("{{content}}", content);

		const messages: LLMMessage[] = [
			{ role: "system", content: skill.systemPrompt },
			{ role: "user", content: userMsg },
		];

		return this.llm.chatWithTimeout(messages, 60000);
	}

	async executeExtractAndSplit(content: string): Promise<ExtractResult> {
		const skill = BUILTIN_SKILLS.find((s) => s.id === "extract-and-split")!;
		const userMsg = skill.userPromptTemplate.replace("{{content}}", content);

		const messages: LLMMessage[] = [
			{ role: "system", content: skill.systemPrompt },
			{ role: "user", content: userMsg },
		];

		return this.llm.chatJSON<ExtractResult>(messages, 300000);
	}

	async executeDiscussNote(
		userInput: string,
		content: string,
		crystals: Array<{ metaConcept: string; description: string }>
	): Promise<string> {
		const skill = BUILTIN_SKILLS.find((s) => s.id === "discuss-note")!;

		const formatCrystals = (crystals: Array<{ metaConcept: string; description: string }>) => {
			if (crystals.length === 0) return "（暂无关联结晶，请继续探索底层规律）";
			return crystals.map(c => `- 【${c.metaConcept}】: ${c.description}`).join("\n");
		};

		const userMsg = skill.userPromptTemplate
			.replace("{{content}}", content)
			.replace("{{crystalsDetail}}", formatCrystals(crystals))
			.replace("{{userInput}}", userInput);

		const messages: LLMMessage[] = [
			{ role: "system", content: skill.systemPrompt },
			{ role: "user", content: userMsg },
		];

		return this.llm.chatWithTimeout(messages, 120000);
	}

	async executeGravityProbe(
		currentConcept: { name: string; definition: string },
		existingConcepts: Array<{ name: string; definition: string }>
	): Promise<{ probes: Array<{ targetConcept: string; gravity: any; reason: string }> }> {
		const skill = BUILTIN_SKILLS.find((s) => s.id === "gravity-probe")!;

		const formatConcepts = (concepts: Array<{ name: string; definition: string }>) => {
			if (concepts.length === 0) return "（无）";
			return concepts.map(c => `- ${c.name}: ${c.definition}`).join("\n");
		};

		const userMsg = skill.userPromptTemplate
			.replace("{{currentConcept}}", `${currentConcept.name}: ${currentConcept.definition}`)
			.replace("{{existingConcepts}}", formatConcepts(existingConcepts));

		const messages: LLMMessage[] = [
			{ role: "system", content: skill.systemPrompt },
			{ role: "user", content: userMsg },
		];

		return this.llm.chatJSON(messages, 300000);
	}

	async executeCommunityNaming(conceptNames: string[]): Promise<string> {
		const messages: LLMMessage[] = [
			{ role: "system", content: "你是知识图谱专家。为给定的一组相关概念生成一个简洁的社区名称，只返回名称本身，不要任何解释。" },
			{ role: "user", content: `请为以下概念组生成一个社区名称：\n${conceptNames.join("、")}` },
		];

		return this.llm.chatWithTimeout(messages, 30000);
	}
}
