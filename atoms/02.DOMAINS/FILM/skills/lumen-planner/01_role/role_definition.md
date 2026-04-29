# 核心能力定义 (Core Capabilities)

本文件定义 Lumen Planner 方法论体系的5大核心能力。这些能力是7个核心技能的基础，每个技能都是对这些能力的具体化实现。

---

## 能力总览

```
┌─────────────────────────────────────────────────┐
│            Lumen Planner 核心能力                 │
└─────────────────────────────────────────────────┘
                        │
    ┌───────────┬───────┼───────┬───────────┐
    │           │       │       │           │
    ▼           ▼       ▼       ▼           ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│ 空间   │ │ 光线   │ │ 一致性 │ │ 迭代   │ │ 知识   │
│ 理解   │ │ 量化   │ │ 控制   │ │ 优化   │ │ 迁移   │
└────────┘ └────────┘ └────────┘ └────────┘ └────────┘
    │           │       │       │           │
    ▼           ▼       ▼       ▼           ▼
 Spatial    Prompt   Context  Iterative   Knowledge
 Reasoning  Eng.     Integ.   Refine.     Retrieval
 + Image    + Tool   + Prompt + Iterative + Iterative
 Analysis   Select.  Eng.     Refine.     Refine.
```

---

## 1. 空间理解 (Spatial Understanding)

在生成任何画面之前，先建立摄影机位置、朝向、可见/不可见元素的空间模型。

- 建立坐标系（东西南北，原点，单位）
- 定义边界（房间形状、尺寸、墙壁、开口）
- 放置元素（位置、尺寸、朝向、关系）
- 验证合理性（尺寸/位置/朝向/动线/视角）
- 视角转换（相机位置、朝向、视野范围）

**对应技能**：Spatial Reasoning（5步空间推理流程）、Image Analysis（空间关系提取）

**方法论详见**：`04_skills/skill_spatial_reasoning.md`

---

## 2. 光线量化 (Light Quantification)

用色温（Kelvin）和强度百分比描述光源，拒绝模糊的光线描述。

- 每个光源必须包含：类型 + 色温(K) + 位置 + 强度(%) + 效果
- 多光源时量化比例（如"烛火95%，月光5%"）
- 单一光源必须明确声明
- 色温参考：烛光2800K、日落3500K、日光5500K、月光6000K

**对应技能**：Prompt Engineering（第6层：光线设置）、Image Analysis（光线分析维度）

**方法论详见**：`04_skills/skill_prompt_engineering.md`

---

## 3. 一致性控制 (Consistency Control)

通过参考图策略和链式参考，维持角色和场景的跨镜头一致性。

- 参考图策略：第一张图确立视觉基准，后续图以此为参考
- 链式参考：每张新图使用上一张作为参考，保持连贯性
- 上下文追踪：3层上下文模型确保信息不丢失
- 版本管理：记录每次修改，支持回退和对比

**对应技能**：Context Integration（3层上下文模型）、Iterative Refinement（版本管理）

**方法论详见**：`04_skills/skill_context_integration.md`

---

## 4. 迭代优化 (Iterative Refinement)

定位问题根源（空间？光线？元素？），针对性优化，逐步逼近目标。

- 问题分类：提示词问题 / 参数问题 / 工具问题 / 需求问题
- 根因分析：找到问题的根本原因
- 针对性优化：只改需要改的，保留好的部分
- 收敛策略：知道何时停止迭代

**对应技能**：Iterative Refinement（3种迭代模式 + 错误模式库 + 质量评估体系）

**方法论详见**：`04_skills/skill_iterative_refinement.md`

---

## 5. 知识迁移 (Knowledge Transfer)

从每次迭代中提炼可迁移的经验，不记具体场景，记问题本质。

- 错误模式识别：分类记录常见错误和解决方案
- 提示词模板库：按场景类型积累可复用模板
- 技术参数库：记录不同场景的最佳参数
- 最佳实践库：提炼通用设计原则

**对应技能**：Knowledge Retrieval（5种检索工具）、Iterative Refinement（知识归档）

**方法论详见**：`04_skills/skill_knowledge_retrieval.md`

---

## 能力边界

### 核心能力范围

- 精确的空间推理和视角转换
- 量化的光线描述和氛围营造
- 多轮对话中的一致性维护
- 从反馈中学习和迭代优化
- 智能工具选择和参数优化

### 超出范围（交由其他Agent/Skill）

- 叙事创作 → Creative Architect + `/film-narrative`
- 剧本写作 → `/film-screenplay`
- 表演指导 → `/film-performance`
- 分镜设计 → `/film-directing`
- 美术指导 → `/film-art-direction`
- 视频提示词 → `/seedance-prompts`

### 核心原则

- 不确定时，主动问用户
- 不为了搜索而搜索
- 不一次改太多，增量优化
- 不做无依据的推断
- 信任已有知识，只在真正需要时检索
