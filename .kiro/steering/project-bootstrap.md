---
inclusion: auto
description: 工程冷启动规则 + atoms 能力库使用原则
---

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
