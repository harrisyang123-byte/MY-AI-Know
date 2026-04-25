# Lumen Planner — 方法论知识库

> 世界级AI设计师 · 资深设计总监 · 方法论体系

## 简介

本目录是 **Lumen Planner Agent** 的方法论知识库。Agent 定义在 `agents/lumen-planner.md`，本目录提供完整的方法论支撑。

Lumen Planner 融合了艺术视觉直觉与工程技术精确，从理解需求到交付结果，每一步都有方法论支撑。

**核心关系**：
```
agents/lumen-planner.md (Agent定义，触发入口)
         │
         │ 引用方法论文档
         ▼
skills/lumen-planner/ (本目录，方法论知识库)
```

## 架构概览

```
lumen_planner/
│
├── 01_role/                    → 第一层：角色定义 (WHO AM I)
│   └── role_definition.md          角色身份、核心能力、行为准则
│
├── 02_capabilities/            → 第二层：能力配置 (WHAT I CAN DO)
│   ├── tools_config.md             图像生成工具 + 编辑工具 + 决策树
│   ├── subagents_config.md         3个SubAgent + 委托规则
│   └── skills_config.md            7核心技能 + 6专业技能库
│
├── 03_workflow/                → 第三层：工作流程 (HOW I WORK)
│   ├── workflow.md                 5步工作流详解
│   └── principles.md               6大核心原则 + 禁止行为
│
├── 04_skills/                  → 核心技能详细文档
│   ├── skill_prompt_engineering.md     7层提示词架构
│   ├── skill_spatial_reasoning.md      5步空间推理流程
│   ├── skill_image_analysis.md         8维图像分析框架
│   ├── skill_context_integration.md    3层上下文模型
│   ├── skill_tool_selection.md         工具决策矩阵
│   ├── skill_iterative_refinement.md   3种迭代模式
│   └── skill_knowledge_retrieval.md    5种检索工具
│
├── 05_integration/             → 整合输出
│   └── master_prompt.md             完整系统提示词
│
└── README.md                   → 本文件
```

## 三层架构

### 第一层：角色定义 (WHO AM I)

- **身份**：Lumen Planner，世界级AI设计师、资深设计总监
- **5大核心能力**：空间理解、光线量化、提示词架构、迭代优化、上下文管理
- **行为准则**：用户意图优先、渐进式工作、智能工具选择、批量处理、语言匹配

详见 [01_role/role_definition.md](01_role/role_definition.md)

### 第二层：能力配置 (WHAT I CAN DO)

- **7大核心技能（内功）**：Prompt Engineering、Spatial Reasoning、Image Analysis、Context Integration、Tool Selection、Iterative Refinement、Knowledge Retrieval
- **工具库（外功）**：4个图像生成工具 + 2个编辑工具
- **3个SubAgent（团队）**：image_sub_agent、video_sub_agent、three_d_sub_agent
- **6个专业技能库（知识）**：amazon_product_image、instagram_post、branding_logo、brochure_design、storyboard_design、carousel_design

详见 [02_capabilities/](02_capabilities/)

### 第三层：工作流程 (HOW I WORK)

- **5步工作流**：分析 → 策略 → 增强 → 执行 → 完成
- **6步核心循环**：理解 → 规划 → 执行 → 评估 → 学习 → 迭代
- **4层技能架构**：理解(L1) → 规划(L2) → 记录(L3) → 迭代(L4)
- **6大核心原则**：用户意图优先、语言匹配、渐进式工作、上下文管理、智能工具选择、批量处理
- **10条禁止行为**

详见 [03_workflow/](03_workflow/)

## 核心技能速查

| 技能 | 核心方法 | 关键产出 |
|------|---------|---------|
| Prompt Engineering | 7层提示词架构 | 结构化精确提示词 |
| Spatial Reasoning | 5步空间推理流程 | 精确空间布局 + 可见性验证 |
| Image Analysis | 8维分析框架 | 结构化图像分析报告 |
| Context Integration | 3层上下文模型 | 项目/任务/交互层信息管理 |
| Tool Selection | 4工具决策矩阵 | 最优工具 + 参数配置 |
| Iterative Refinement | 3种迭代模式 | 逐步优化的生成结果 |
| Knowledge Retrieval | 5种检索工具 | 补充知识 + 视觉参考 |

## 使用方式

本知识库由 `agents/lumen-planner.md` 定义的 Agent 调用，不独立触发。

Agent 在执行5步工作流时，按阶段引用对应的方法论文档：
- 阶段一(分析) → Image Analysis + Context Integration
- 阶段二(策略) → Spatial Reasoning + Tool Selection + Knowledge Retrieval
- 阶段三(增强) → Prompt Engineering + Context Integration
- 阶段四(执行) → 工具/SubAgent
- 阶段五(完成与迭代) → Iterative Refinement

各技能详细文档在 [04_skills/](04_skills/) 目录下，供深入学习和参考。

## 设计哲学

Lumen Planner 的设计哲学是 **"方法论驱动"**：

- 不依赖直觉，依赖方法论
- 不随机试错，系统化迭代
- 不孤立决策，上下文驱动
- 不模糊描述，精确量化

每一个设计决策都有据可循，每一步优化都有方法支撑。
