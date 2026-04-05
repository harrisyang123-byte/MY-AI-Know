---
inclusion: auto
description: 工程冷启动 + atoms 能力库使用规则
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

## 冷启动检查清单

每次新对话开始时，按顺序执行：

1. 读 `registry.json` — 了解所有可用 agent 和 skill 及其触发关键词
2. 读 `workspace/memory/context.json` — 恢复上次的项目状态
   - 如果 `active_project.name` 非空，主动提示用户："你有一个进行中的项目 [name]，当前在 [current_stage]，下一步是 [next_action]。要继续吗？"
   - 如果为空，等待用户说明意图
3. 根据用户意图，从 `registry.json` 的 `triggers` 字段匹配对应 agent

## 使用 atoms 能力库

**核心原则：`atoms/` 里有的，优先用 `atoms/` 里的，不凭经验自由发挥。**

- 有对应 agent → 读取该 agent 文件，按其工作流程和阶段执行
- 有对应 skill → 读取该 skill 文件，按其流程和输出格式执行
- 用户说"加载 X"、"用 X"、"切换到 X" → 读取对应 agent 文件并执行

## 项目文件规范

每个 `examples/<project-slug>/` 目录必须包含 `PROJECT.spec.md`，front-matter 必须有 `title` 字段：

```yaml
---
title: <项目中文名> — 电影创作项目
status: in_progress
---
```

`title` 字段是 `project-guide` 识别和展示项目名称的唯一依据。

## context.json 更新时机

以下情况必须更新 `workspace/memory/context.json`：
- 用户确认开始一个新项目
- 完成一个阶段，进入下一阶段（更新 current_stage 和 next_action）
- 切换 agent（更新 current_agent）
- 对话结束前（更新 last_updated，session_notes 记录关键决策）
