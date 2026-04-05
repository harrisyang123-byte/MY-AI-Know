---
name: skill-creator
description: 创建和优化 Skill 文件的指南。当用户想从零创建新 Skill、改进现有 Skill、或优化 Skill 的 description 触发准确性时使用。
---

# Skill Creator

创建和迭代改进 Skill 文件。Skill 是定义 AI 执行某类任务的知识和流程的 Markdown 文件。

## Skill 文件结构

```
skill-name/
├── SKILL.md          ← 必须，包含 frontmatter + 执行指令
├── scripts/          ← 可选，可执行脚本（确定性/重复性任务）
├── references/       ← 可选，按需加载到上下文的参考文档
└── assets/           ← 可选，模板、图标等输出用文件
```

### 三层加载机制

1. **Metadata**（name + description）— 始终在上下文中，约 100 词
2. **SKILL.md 正文** — skill 触发时加载，建议控制在 500 行以内
3. **Bundled resources** — 按需加载，无限制

超过 500 行时，拆分到 `references/` 子文件，在 SKILL.md 中明确指向。

## Frontmatter 规范

```
---
name: skill-name          ← kebab-case，小写字母+数字+连字符，最长 64 字符
description: ...          ← 最长 1024 字符，不能含 < >
---
```

### description 怎么写

description 是 AI 决定是否调用这个 skill 的唯一依据，写法直接影响触发准确率：

- 同时说清楚"这个 skill 做什么"和"什么时候用它"
- 适当"pushy"——与其写"如何生成图表"，不如写"如何生成图表。当用户提到数据可视化、想展示指标、或需要任何图表时都应使用，即使他们没有明确说'图表'"
- 覆盖用户可能用的不同表达方式

## 创建流程

### 1. 理解需求

确认：
- 这个 skill 让 AI 能做什么？
- 什么时候应该触发？（用户会说什么）
- 期望的输出格式是什么？
- 需要引用哪些已有资源？

### 2. 编写 SKILL.md

结构建议：
- 用祈使句写指令（"读取文件"而不是"应该读取文件"）
- 解释每条规则背后的 why，而不是堆砌 MUST/NEVER
- 为关键输出定义固定格式模板
- 大型参考文档（>300 行）放进 `references/`，并在 SKILL.md 中说明何时读取

### 3. 验证格式

```bash
python3 atoms/01.CORE/skills/skill-creator/scripts/quick_validate.py <skill目录路径>
```

### 4. 注册到 registry

在 `registry.json` 的 `skills` 数组中添加：

```json
{ "name": "<skill-name>", "path": "atoms/<domain>/skills/<skill-name>", "domain": "<CORE|FILM>" }
```

## 修改流程

1. 直接编辑对应的 `SKILL.md`
2. 运行 `quick_validate.py` 验证格式
3. 如果改了 name，同步更新 `registry.json`

## 写作原则

- **解释 why**：今天的 LLM 很聪明，理解原因比死记规则更有效
- **保持精简**：删掉不起作用的内容，避免过度约束
- **避免过拟合**：skill 会被用在无数不同的 prompt 上，不要为某个具体例子写死规则
- **多域组织**：如果 skill 支持多个场景，按场景拆分到 `references/` 子文件，SKILL.md 只做选择和指向
