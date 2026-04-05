---
inclusion: auto
description: 工程冷启动规则 + atoms 能力库使用原则
---

## 冷启动

每次新对话开始时，立即加载并执行 `atoms/01.CORE/agents/project-guide.md`。

不要等用户说话，不要自行判断，直接按 project-guide 的流程走。

## 使用 atoms 能力库

**核心原则：`atoms/` 里有的，优先用 `atoms/` 里的，不凭经验自由发挥。**

- 有对应 agent → 读取该 agent 文件，按其工作流程和阶段执行
- 有对应 skill → 读取该 skill 文件，按其流程和输出格式执行
- 用户说"加载 X"、"用 X"、"切换到 X" → 读取对应 agent 文件并执行
