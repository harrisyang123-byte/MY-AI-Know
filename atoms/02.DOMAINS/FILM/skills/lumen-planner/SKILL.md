---
name: lumen-planner
description: "Lumen Planner 方法论知识库。7核心技能完整方法论：Prompt Engineering(7层架构)、Spatial Reasoning(5步推理)、Image Analysis(8维分析)、Context Integration(3层模型)、Tool Selection(4工具矩阵)、Iterative Refinement(3种模式)、Knowledge Retrieval(5种工具)。由 lumen-planner agent 调用，不独立触发。"
---

# Lumen Planner — 方法论知识库

本目录是 Lumen Planner Agent 的方法论知识库，包含完整的技能体系、工作流程和配置信息。

**使用方式**：由 `agents/lumen-planner.md` 定义的 Agent 在执行任务时引用。Agent 按工作流阶段调用对应的方法论文档，确保每一步都有方法论支撑。

**不独立触发**：本知识库不作为独立 skill 使用，必须通过 Lumen Planner Agent 调用。

## 核心架构

```
┌─────────────────────────────────────────────────┐
│              Lumen Planner System                │
└─────────────────────────────────────────────────┘
                        │
    ┌───────────────────┼───────────────────┐
    │                   │                   │
    ▼                   ▼                   ▼
┌──────────┐    ┌──────────────┐    ┌──────────┐
│  Input   │    │    Core      │    │  Output  │
│  Layer   │    │    Layer     │    │  Layer   │
└──────────┘    └──────────────┘    └──────────┘
    │                   │                   │
    └───────────────────┴───────────────────┘
                        │
                        ▼
                ┌──────────────┐
                │   Support    │
                │   Layer      │
                └──────────────┘
```

## 5步工作流

```
Step 1: 分析 → Step 2: 策略 → Step 3: 增强 → Step 4: 执行 → Step 5: 完成
```

每步调用对应技能，详见 [03_workflow/workflow.md](03_workflow/workflow.md)。

## 6步核心循环

5步工作流背后是持续运转的6步核心循环：

```
1. 理解 → [Image Analysis + Context Integration]
2. 规划 → [Spatial Reasoning + Tool Selection]
3. 执行 → [Prompt Engineering → 工具/SubAgent]
4. 评估 → [Iterative Refinement - 质量评估]
5. 学习 → [Iterative Refinement - 错误识别+知识归档]
6. 迭代 → [Iterative Refinement - 反馈分析+改进建议]
→ 回到步骤1
```

4层技能架构：理解(L1) → 规划(L2) → 记录(L3) → 迭代(L4)，详见 [03_workflow/workflow.md](03_workflow/workflow.md)。

## 7大核心技能

| # | 技能 | 核心方法 | 何时调用 |
|---|------|---------|---------|
| 1 | Prompt Engineering | 7层提示词架构 | 构建任何提示词时 |
| 2 | Spatial Reasoning | 5步空间推理 | 涉及空间布局、机位设计时 |
| 3 | Image Analysis | 8维分析框架 | 有参考图/生成结果需分析时 |
| 4 | Context Integration | 3层上下文模型 | 多轮对话、跨镜头生成时 |
| 5 | Tool Selection | 4工具决策矩阵 | 选择生成工具时 |
| 6 | Iterative Refinement | 3种迭代模式 | 生成结果需优化时 |
| 7 | Knowledge Retrieval | 5种检索工具 | 需要外部知识/视觉参考时 |

详细文档见 [04_skills/](04_skills/) 目录。

## 工具矩阵

**图像生成**：gpt_image_2（默认）、nano_banana_2、nano_banana_pro、midjourney
**图像编辑**：reframe_image、upscale_image
**SubAgent**：image_sub_agent、video_sub_agent、three_d_sub_agent

工具选择决策树详见 [02_capabilities/tools_config.md](02_capabilities/tools_config.md)。

## 6大核心原则

1. **用户意图优先** — 理解真实需求，不过度解读
2. **语言匹配** — 响应用户语言，提示词用英语
3. **渐进式工作** — 复杂任务分步骤，关键节点确认
4. **上下文管理** — 3层模型确保信息不丢失
5. **智能工具选择** — 默认最稳工具，有理由才换
6. **批量处理** — 多输出一次调用

## 文档索引

| 目录 | 内容 |
|------|------|
| [01_role/](01_role/role_definition.md) | 角色定义、5大核心能力、行为准则 |
| [02_capabilities/](02_capabilities/) | 工具配置、SubAgent配置、技能库配置 |
| [03_workflow/](03_workflow/) | 5步工作流、核心原则 |
| [04_skills/](04_skills/) | 7个核心技能详细文档 |
| [05_integration/](05_integration/master_prompt.md) | 整合后的完整系统提示词 |
