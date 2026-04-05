---
inclusion: auto
description: 工程冷启动说明——告诉 AI 这个工程是什么、怎么运行、从哪里开始
---

# 工程运行说明

## 这是什么

这是一个模块化 AI 能力库，运行在 Kiro IDE 中。所有 `.md` 文件都是 Kiro 的 agent 或 skill 定义文件，不是普通文档。

## 工程结构

```
registry.json         ← 全局 agent/skill 索引，AI 启动时必读
atoms/
  01.CORE/agents/     ← 通用 agent，直接在 Kiro 聊天中调用
  01.CORE/skills/     ← 通用 skill，被 agent 内部调用（用 /skill-name 语法）
  02.DOMAINS/FILM/    ← 电影创作专属 agent 和 skill
examples/             ← 实际项目文件（每个子目录是一个项目）
workspace/
  memory/context.json ← 跨对话状态，AI 启动时必读
.kiro/steering/       ← 自动加载的 AI 行为规则（当前目录）
```

## 如何运行

**在 Kiro 聊天框中，直接说你想做什么。**

AI 会根据任务自动匹配对应的 agent 或 skill（参考 `use-atoms.md` 的规则）。

如果你不知道从哪里开始，说："帮我启动项目向导"，AI 会加载 `project-guide` agent 引导你。

## 当前可用 Agents

| Agent | 文件位置 | 用途 |
|-------|---------|------|
| project-guide | `atoms/01.CORE/agents/project-guide.md` | 项目启动向导，新项目初始化或继续已有项目 |
| creative-architect | `atoms/02.DOMAINS/FILM/agents/creative-architect.md` | 电影创作全流程（叙事→视觉→美术→分镜） |
| prompt-alchemist | `atoms/02.DOMAINS/FILM/agents/prompt-alchemist.md` | 分镜稿转 AI 图像/视频提示词 |
| superpowers-dev | `atoms/01.CORE/agents/superpowers-dev.md` | 通用代码开发需求 |
| matteo-collina | `atoms/01.CORE/agents/matteo-collina.md` | Node.js 架构专家 |

## 项目文件规范

每个 `examples/<project-slug>/` 目录必须包含 `PROJECT.spec.md`，其 front-matter 必须有 `title` 字段：

```yaml
---
title: <项目中文名> — 电影创作项目
status: in_progress
---
```

`title` 字段是 `project-guide` 识别和展示项目名称的唯一依据。

## AI 冷启动检查清单

每次新对话开始时，按顺序执行：

1. **读 `registry.json`** — 了解所有可用 agent 和 skill，以及触发关键词
2. **读 `workspace/memory/context.json`** — 恢复上次的项目状态
   - 如果 `active_project.name` 非空，主动提示用户："你有一个进行中的项目 [name]，当前在 [current_stage]，下一步是 [next_action]。要继续吗？"
   - 如果为空，等待用户说明意图
3. 根据用户意图，从 `registry.json` 的 `triggers` 字段匹配对应 agent

## context.json 更新时机

以下情况必须更新 `workspace/memory/context.json`：
- 用户确认开始一个新项目（填写 active_project 所有字段）
- 完成一个阶段，进入下一阶段（更新 current_stage 和 next_action）
- 切换 agent（更新 current_agent）
- 对话结束前（更新 last_updated 为当前时间，session_notes 记录关键决策）
