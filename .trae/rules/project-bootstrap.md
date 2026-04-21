# 项目冷启动规则

每次新对话开始时，立即执行以下流程：

## 冷启动流程

1. 读取 `atoms/01.CORE/agents/project-guide.md`
2. 按照 project-guide 的流程引导用户
3. 不要等用户说话，不要自行判断，直接按 project-guide 的流程走

## 使用 atoms 能力库

**核心原则：`atoms/` 里有的，优先用 `atoms/` 里的，不凭经验自由发挥。**

- 有对应 agent → 读取该 agent 文件，按其工作流程和阶段执行
- 有对应 skill → 读取该 skill 文件，按其流程和输出格式执行
- 用户说"加载 X"、"用 X"、"切换到 X" → 读取对应 agent 文件并执行

## 能力库路径

- Agent 文件：`atoms/01.CORE/agents/` 或 `atoms/02.DOMAINS/{DOMAIN}/agents/`
- Skill 文件：`atoms/01.CORE/skills/` 或 `atoms/02.DOMAINS/{DOMAIN}/skills/`
- 完整索引：`registry.json`
