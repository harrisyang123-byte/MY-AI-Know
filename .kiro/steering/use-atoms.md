---
inclusion: auto
description: 指导 Kiro 优先使用 atoms/ 目录中的 agents 和 skills 能力库
---

# 使用 atoms 能力库

这个工作区的 `atoms/` 目录是我的能力库，包含 agents 和 skills。

**核心原则：`atoms/` 里有的，优先用 `atoms/` 里的。**

每次对话前，判断当前任务是否有对应的 agent 或 skill：
- 有对应 agent（`atoms/agents/`）→ 读取该 agent 文件，按其工作流程和阶段执行
- 有对应 skill（`atoms/skills/`）→ 读取该 skill 文件，按其流程和输出格式执行
- 用户明确指定 agent/skill → 必须读取并遵循，不能凭直觉自由发挥

**Agent 触发语法识别：** 用户说"加载 X"、"用 X"、"切换到 X"、"帮我启动 X" → 读取对应 agent 文件并按其流程执行。

用户说"帮我启动项目向导"或"不知道从哪开始" → 读取 `atoms/01.CORE/agents/project-guide.md` 并执行。

当前可用的 agents：`project-guide`、`creative-architect`、`prompt-alchemist`、`superpowers-dev`、`matteo-collina`
当前可用的 skills：`film-narrative`、`film-visual-language`、`film-directing`、`film-performance`、`film-art-direction`、`nano-banana-prompts`、`seedance-prompts`、`creative-workflow`、`film-narrative`

---

## ⚠️ 强制执行规则（违反即错误）

### 生成图像提示词时

**必须按以下顺序执行，不得跳过：**

1. 读取 `atoms/02.DOMAINS/FILM/agents/prompt-alchemist.md` 全文
2. 读取 `atoms/02.DOMAINS/FILM/skills/nano-banana-prompts/SKILL.md` 全文
3. 读取 `atoms/02.DOMAINS/FILM/skills/nano-banana-prompts/references/my-best-practices.md`
4. 过每个镜头的6项检查清单（见 prompt-alchemist.md 阶段二）
5. 输出提示词后，询问用户："这个提示词有什么问题吗？"

**禁止行为：**
- 禁止凭经验直接写提示词
- 禁止跳过知识库检查
- 禁止输出后不询问用户反馈直接 ⏸

### 修改分镜时

**必须按以下顺序执行：**

1. 读取 `atoms/02.DOMAINS/FILM/agents/creative-architect.md` 全文
2. 按阶段四 checklist 执行
3. 每个场景完成后更新 PROJECT.spec.md

**禁止行为：**
- 禁止不读 agent 文件直接修改分镜
- 禁止跳过视觉校验步骤
