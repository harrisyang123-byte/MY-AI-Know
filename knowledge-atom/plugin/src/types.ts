// ====================================================
// 基础类型 (V0.7.0 引力模型)
// ====================================================

// 概念状态
export type ConceptStatus = "draft" | "confirmed";

export type ConceptLevel = "core" | "bridge" | "leaf";

export type DisplayMode = "label" | "color" | "mixed";

// ====================================================
// V0.7.0 引力模型核心类型
// ====================================================

// 引力向量 - 描述两个质子间的相互作用
export interface GravityVector {
  // 核心物理属性
  strength: number;           // 0-1，引力强度（底层规律一致性）
  direction: number;         // -1到1，负值=排斥，正值=吸引
  dimensions: string[];      // 作用维度，如["逻辑推导","时间先后","空间接近"]

  // 元数据
  context: string;           // AI生成的描述："A导致B" 或 "A与B对立"
  computedAt: string;        // 计算时间
  confidence: number;        // AI计算置信度
}

// 知识质子 - 不可再分的最小知识单元
export interface KnowledgeProton {
  id: string;
  conceptName: string;       // 对应的概念名
  content: string;           // 核心事实/逻辑（原始文本片段）
  firstPrinciples: string[]; // 剥离包装后的底层规律

  // 动态属性
  centrality: number;        // 0-1，网络中心度（基于引力网络计算）
  abstractness: number;      // 0-1，抽象程度（被引用的深度）

  // 元数据
  sourceNotePath: string;    // 来源笔记路径
  extractedAt: string;       // 提取时间
}

// 概念星云 - 由引力聚合的质子簇
export interface ConceptNebula {
  id: string;
  protons: string[];         // 包含的质子ID列表
  firstPrinciple?: string;   // 星云统一的底层规律（如果已识别）

  // 几何属性（用于可视化）
  boundaryPoints: Array<{x: number, y: number}>;  // 凸包顶点
  centerOfGravity: {x: number, y: number};       // 质心
  radius: number;            // 等效半径

  // 物理属性
  cohesionStrength: number;  // 0-1，内聚力（星云内部引力强度均值）
  stability: number;         // 0-1，稳定性（内聚力 - 外部扰动）

  // 元数据
  createdAt: number;
  lastUpdatedAt: number;
}

// 逻辑结晶 - 星云成熟后提炼出的元概念
export interface LogicalCrystal {
  id: string;
  nebulaId: string;          // 对应的星云ID
  metaConcept: string;       // 元概念名称（AI提取）
  description: string;       // 元概念描述

  // 成熟度指标
  maturity: number;          // 0-1，结晶成熟度
  coherenceScore: number;    // 0-1，质子间逻辑一致性
  exampleCount: number;      // 支撑该规律的例证（质子）数量

  // 状态
  state: "forming" | "stable" | "shattering" | "dissolved";

  // 元数据
  formedAt: number;
  lastStateChangeAt: number;
}

// 知识层级 - 用于组织显示
export interface KnowledgeLayer {
  id: string;
  depth: number;             // 0=事实层，1=规律层，2=元规律层...
  firstPrinciple?: string;   // 这一层的统一规律（可选）

  // 内容
  protons: string[];         // 属于该层的质子
  crystals: string[];        // 属于该层的结晶

  // 显示控制
  isExpanded: boolean;       // 是否展开显示
  displayOrder: number;      // 显示顺序
}

// ====================================================
// V0.6.0 兼容类型（逐步迁移）
// ====================================================

// 社区阶段 - 保持向后兼容
export type CommunityPhase = "vapor" | "crystal" | "anomaly" | "fossil";

// 干预类型 - 保持向后兼容
export type InterventionType =
  | "rename_community"
  | "merge_communities"
  | "move_concept"
  | "delete_community";

export interface UserIntervention {
  id: string;
  type: InterventionType;
  targetType: "community" | "concept";
  targetId: string;
  details: Record<string, unknown>;
  createdAt: number;
  isActive: boolean;
}

export interface GraphSettings {
  showLabels: boolean;
  textOpacity: number;
  nodeSizeScale: number;
  lineWidthScale: number;
  showArrows: boolean;
  showIsolatedFiles: boolean;
}

export interface ConceptEntry {
	name: string;
	definition: string;
	centrality: number;        // 0-1 连续分数替代离散层级
	abstractness: number;      // 0-1 抽象深度
	status: ConceptStatus;
	aliases: string[];
	sources: string[];
	notePath: string;
	extractedAt: string;
	firstPrinciples: string[]; // 底层规律
	examples: string[];        // 原文中的例子
	originalExcerpt: string;   // 最相关的原文片段
}

export interface Relation {
	id: string;
	from: string;
	to: string;
	gravity: GravityVector;    // 统一使用引力向量
	source: string;
	createdAt: string;
}

export interface Community {
	id: string;
	name?: string;
	firstPrinciple?: string;
	phase: CommunityPhase;
	concepts: string[];
	protons: KnowledgeProton[]; // 使用新的质子定义

	// 物理与几何属性 (适配星云模型)
	cohesionStrength: number;  // 内聚力
	stability: number;         // 稳定性
	boundaryPoints: Array<{x: number, y: number}>;
	centerOfGravity: {x: number, y: number};
	radius: number;

	energyDensity: number;
	velocity: number;
	createdAt: number;
	lastActiveAt: number;
	isNamed: boolean;
	x: number;
	y: number;
	vx: number;
	vy: number;
	color?: string;
}

export interface NoteIndex {
	filePath: string;
	title: string;
	summary: string;
	tags: string[];
	concepts: string[];
	implicitLinksAdded: string[];
	indexedAt: string;
}

export interface IndexData {
	version: number;
	updatedAt: string;
	concepts: Record<string, ConceptEntry>;
	relations: Relation[];
	notes: Record<string, NoteIndex>;
	communities: Community[];
	crystals: Record<string, LogicalCrystal>; // V0.7.0 新增
	userInterventions: UserIntervention[];
	knowledgeLayers: KnowledgeLayer[]; // V0.7.0 新增
}

export interface ModelCapability {
	id: string;
	name: string;
	icon: string;
	description: string;
}

export const MODEL_CAPABILITIES: ModelCapability[] = [
	{ id: "knowledge-extraction", name: "知识提取", icon: "⭐", description: "从文本中提取概念、关系、标签" },
	{ id: "complex-reasoning", name: "复杂推理", icon: "🧠", description: "深度思考、逻辑推理、分析隐藏关联" },
	{ id: "visual-understanding", name: "图形理解", icon: "🖼️", description: "理解图片、图表、视觉内容" },
	{ id: "daily-preference", name: "日常首选", icon: "⭐", description: "综合能力均衡，响应快成本低" },
	{ id: "most-economical", name: "最省钱", icon: "💴", description: "调用成本最低" },
	{ id: "daily-chat", name: "日常对话", icon: "💬", description: "普通聊天对话" },
	{ id: "local-proxy", name: "本地代理", icon: "🔌", description: "通过本地代理访问" },
];

export interface ModelProfile {
	id: string;
	name: string;
	apiBase: string;
	apiKey: string;
	model: string;
	maxTokens: number;
	temperature: number;
	capabilities?: string[];
}

export interface SkillDef {
	id: string;
	name: string;
	icon: string;
	description: string;
	systemPrompt: string;
	userPromptTemplate: string;
	category: "extract" | "analyze" | "create";
}

export interface GraphFilter {
	communities: string[];
	minConfidence: number;
	showSourceNotes: boolean;
	relationTypes: string[]; // 兼容旧版
	levels: string[]; // 兼容旧版
}

export interface ExtractResult {
	concepts: Array<{
		name: string;
		definition: string;
		aliases: string[];
		firstPrinciples: string[];
		examples: string[];
		originalExcerpt: string;
	}>;
	relations: Array<{
		from: string;
		to: string;
		gravity: GravityVector;
		source: string;
		context: string;
		confidence: number;
	}>;
	tags: string[];
	summary: string;
}

export interface ImplicitLinkResult {
  links: Array<{
    from: string;
    to: string;
    reason: string;
    suggestedType: string; // 兼容旧版
    suggestedGravity: GravityVector;
    confidence: number;
  }>;
}

export const COMMUNITY_COLORS = [
	"#4a9eff",
	"#f5a623",
	"#7ed321",
	"#bd10e0",
	"#ff5a5a",
	"#50e3c2",
	"#f8e71c",
	"#9b9b9b",
];

export const PHASE_COLORS: Record<string, string> = {
	vapor: "#4a9eff",
	crystal: "#7ed321",
	anomaly: "#ff5a5a",
	fossil: "#6b7280",
};

export const HOVER_COLOR = "#a855f7";

export const RELATION_TYPE_META: Record<string, { symbol: string, label: string, color: string, hasArrow: boolean }> = {
	cause: { symbol: "→", label: "因果", color: "#818cf8", hasArrow: true },
	correlate: { symbol: "-", label: "相关", color: "#94a3b8", hasArrow: false },
	contain: { symbol: "∋", label: "包含", color: "#34d399", hasArrow: true },
	synonym: { symbol: "=", label: "同义", color: "#fbbf24", hasArrow: false },
	oppose: { symbol: "≠", label: "对立", color: "#f87171", hasArrow: false },
	"cross-domain": { symbol: "×", label: "跨域", color: "#c084fc", hasArrow: false },
};

export const DEFAULT_MODEL_PROFILES: ModelProfile[] = [
	{
		id: "deepseek-chat",
		name: "DeepSeek Chat",
		apiBase: "https://api.deepseek.com/v1",
		apiKey: "",
		model: "deepseek-chat",
		maxTokens: 4096,
		temperature: 0.3,
		capabilities: ["日常对话", "知识提取"],
	},
	{
		id: "deepseek-reasoner",
		name: "DeepSeek Reasoner",
		apiBase: "https://api.deepseek.com/v1",
		apiKey: "",
		model: "deepseek-reasoner",
		maxTokens: 16384,
		temperature: 0.3,
		capabilities: ["复杂推理", "知识提取"],
	},
	{
		id: "gpt-4o-mini",
		name: "GPT-4o Mini",
		apiBase: "https://api.openai.com/v1",
		apiKey: "",
		model: "gpt-4o-mini",
		maxTokens: 4096,
		temperature: 0.3,
		capabilities: ["图形理解", "知识提取"],
	},
	{
		id: "gemini-3-flash-preview",
		name: "Gemini 3 Flash",
		apiBase: "https://generativelanguage.googleapis.com/v1beta",
		apiKey: "",
		model: "gemini-3-flash-preview",
		maxTokens: 8192,
		temperature: 0.3,
		capabilities: ["日常首选", "知识提取"],
	},
	{
		id: "gemini-3.1-pro-preview",
		name: "Gemini 3.1 Pro",
		apiBase: "https://generativelanguage.googleapis.com/v1beta",
		apiKey: "",
		model: "gemini-3.1-pro-preview",
		maxTokens: 16384,
		temperature: 0.3,
		capabilities: ["复杂推理", "知识提取"],
	},
	{
		id: "gemini-3.1-flash-lite-preview",
		name: "Gemini 3.1 Flash-Lite",
		apiBase: "https://generativelanguage.googleapis.com/v1beta",
		apiKey: "",
		model: "gemini-3.1-flash-lite-preview",
		maxTokens: 4096,
		temperature: 0.3,
		capabilities: ["最省钱", "知识提取"],
	},
	{
		id: "local-litellm",
		name: "Local LiteLLM",
		apiBase: "http://127.0.0.1:4000/v1",
		apiKey: "",
		model: "gemini-3-flash",
		maxTokens: 2048,
		temperature: 0.3,
		capabilities: ["本地代理", "知识提取"],
	},
];

export interface ConceptStat {
	mentionCount: number;
	relationCount: number;
	crossCommunityCount: number;
	intraScore: number;
	crossScore: number;
	currentLevel: ConceptLevel;
	levelSource: "auto" | "manual";
	communities: string[];
}

export interface CommunityStat {
	conceptCount: number;
	avgRelations: number;
}

export interface StatsData {
	lastComputedAt: string;
	totalNotes: number;
	totalConcepts: number;
	totalRelations: number;
	conceptStats: Record<string, ConceptStat>;
	communityStats: Record<string, CommunityStat>;
}
