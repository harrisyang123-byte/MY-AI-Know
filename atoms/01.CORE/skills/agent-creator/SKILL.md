---
name: agent-creator
description: 创建和修改 Agent 的指南。当用户想要创建新的 Agent 或修改现有 Agent 时使用此 Skill。Agent 是定义 AI 角色、行为准则和工作流程的 Markdown 文件，存放在 atoms/agents 目录下。
---

# Agent Creator

创建和修改 Agent 文件。Agent 格式详见 [references/agent-format.md](references/agent-format.md)。

## 创建流程

### 1. 理解需求

向用户确认：
- Agent 的角色定位是什么？
- 需要哪些核心能力？
- 工作流程是怎样的？有哪些阶段？
- 需要引用哪些已有的 Skill？

从最关键的问题开始，避免一次问太多。

### 2. 创建文件

根据 agent 所属领域，在对应目录下新建 `.md` 文件：
- 通用 agent → `atoms/01.CORE/agents/<agent-name>.md`
- FILM 域 agent → `atoms/02.DOMAINS/FILM/agents/<agent-name>.md`

按 `agent-format.md` 的模板结构填充内容。

### 3. 注册到 registry

在 `registry.json` 的 `agents` 数组中添加条目：

```json
{
  "name": "<agent-name>",
  "path": "atoms/<domain>/agents/<agent-name>.md",
  "domain": "<CORE|FILM>",
  "description": "<简短描述>",
  "triggers": ["触发关键词1", "触发关键词2"]
}
```

## 修改流程

1. 直接编辑对应的 agent `.md` 文件
2. 如果改了 name、description 或 triggers，同步更新 `registry.json`
