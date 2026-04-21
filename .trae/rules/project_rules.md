# AI 能力库 — Trae IDE 项目规则

每次对话自动加载这些规则，确保 AI 行为与 Kiro IDE 中一致。

## 核心原则

**atoms 优先**：`atoms/` 目录中有的能力，优先使用其中的定义和流程，不凭经验自由发挥。

- 有对应 agent → 读取该 agent 文件，按其工作流程和阶段执行
- 有对应 skill → 读取该 skill 文件，按其流程和输出格式执行
- 用户说"加载 X"、"用 X"、"切换到 X" → 读取对应 agent 文件并执行

## 架构原则

**单向依赖**：`02.DOMAINS` 可调用 `01.CORE`，反向不行。

**数据隔离**：不同 DOMAIN 之间的项目文件、知识库严格隔离，不得跨域引用。

**Agent 优先**：有对应 agent 的任务，必须读取 agent 文件按其流程执行，不能凭直觉自由发挥。

**状态持久化**：每次阶段切换后更新 `workspace/memory/context.json`，确保跨对话连贯性。

## 使用方式

**第一次使用 / 不知道从哪开始：**
在聊天框说："帮我启动项目向导"，AI 会加载 project-guide agent 引导你。

**继续已有项目：**
直接说："继续项目"，AI 会读取 `workspace/memory/context.json` 恢复上次状态。

**直接调用特定 agent：**
说"加载 creative-architect"或"用 prompt-alchemist"，AI 会读取对应文件并按其流程执行。

## 能力库索引

完整的 agent 和 skill 列表见 `registry.json` 文件。
