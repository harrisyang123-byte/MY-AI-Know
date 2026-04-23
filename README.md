# AI 能力库

个人模块化 AI 工作流系统。将 Agents、Skills 和项目状态统一管理，让 AI 在跨对话、跨项目的场景下保持一致的行为和记忆。

## 这是什么

一个运行在 Claude Code 中的 AI 能力库，核心思路是：

- **Agents** 定义"谁来做"和"怎么做"——每个 agent 是一个有完整工作流的角色
- **Skills** 定义"具体怎么执行某一步"——被 agent 调用，不直接面向用户
- **Steering** 定义"AI 的行事准则"——每次对话自动加载，约束 AI 的全局行为
- **Registry** 是 AI 的地图——启动时读取，知道有哪些能力可用
- **Workspace** 是 AI 的记忆——跨对话持久化当前项目状态

## 工程结构

```
AI-atom/
├── config/                     # 配置文件
│   ├── registry.json           # AI 全局索引（agent/skill 地图 + 触发关键词）
│   ├── litellm-config.yaml     # LiteLLM 模型代理配置
│   ├── models.yaml             # 模型定义
│   └── openspec.config.json    # OpenSpec 工作流配置
│
├── docs/                       # 使用指南
│   └── CLAUDE_CODE_GEMINI_GUIDE.md   # Claude Code 配置与模型切换
│
├── scripts/                    # 工具脚本
│   ├── start-proxy.ps1         # 启动 LiteLLM 代理
│   ├── use-deepseek.ps1        # 切换到 DeepSeek 模型
│   └── use-minimax.ps1         # 切换到 MiniMax 模型
│
├── atoms/                      # 能力库
│   ├── 01.CORE/                # 通用元能力（任何领域可用）
│   │   ├── agents/
│   │   │   ├── project-guide.md      # 项目启动向导（入口）
│   │   │   ├── superpowers-dev.md    # 通用代码开发专家
│   │   │   └── matteo-collina.md     # Node.js 架构专家
│   │   └── skills/
│   │       ├── brainstorming/        # 创意探索
│   │       ├── creative-workflow/    # 探索→提案→实现协作框架
│   │       ├── writing-plans/        # 实施计划编写
│   │       ├── executing-plans/      # 计划执行引擎
│   │       ├── bugfix/               # Bug 诊断修复
│   │       ├── wiki-generator/       # 技术文档生成
│   │       ├── agent-creator/        # 创建新 Agent
│   │       ├── openspec/             # OpenSpec 变更管理
│   │       ├── design-system/        # 设计系统
│   │       ├── design/               # 设计技能
│   │       ├── slides/               # PPT 幻灯片
│   │       ├── brand/                 # 品牌指南
│   │       ├── banner-design/        # Banner 设计
│   │       ├── ui-styling/           # UI 样式
│   │       ├── ui-ux-pro-max/        # UI/UX 专业版
│   │       ├── frontend-design/      # 前端设计
│   │       └── claude-launcher/      # Claude 启动器
│   │
│   └── 02.DOMAINS/            # 垂直领域（特定业务专属）
│       ├── FILM/              # 电影创作全流程
│       │   ├── agents/
│       │   │   ├── creative-architect.md   # 电影全才
│       │   │   └── prompt-alchemist.md      # 提示词翻译官
│       │   └── skills/
│       │       ├── film-narrative/         # 叙事定调
│       │       ├── film-visual-language/   # 视觉语言
│       │       ├── film-art-direction/      # 美术指导
│       │       ├── film-performance/       # 表演节奏
│       │       ├── film-directing/          # 分镜执行
│       │       ├── nano-banana-prompts/     # 图像提示词
│       │       ├── nano-banana-pro/          # 图像生成
│       │       └── seedance-prompts/        # 视频提示词
│       │
│       └── KNOWLEDGE/         # 知识管理
│           └── agents/
│               └── knowledge-architect.md   # 知识架构师
│
├── examples/                  # 实际项目案例
│   └── daqing-lihongzhang/    # 大清李鸿章（电影项目）
│
├── workspace/                 # AI 记忆与状态持久化
│   └── memory/
│       └── context.json       # 当前项目上下文
│
├── openspec/                  # OpenSpec 变更工作流
│
└── .kiro/                     # Kiro 专用配置
    └── steering/              # AI 行为规则
```

## 架构原则

**单向依赖**：`02.DOMAINS` 可调用 `01.CORE`，反向不行。

**数据隔离**：不同 DOMAIN 之间的项目文件、知识库严格隔离，不得跨域引用。

**Agent 优先**：有对应 agent 的任务，必须读取 agent 文件按其流程执行，不能凭直觉自由发挥。

**状态持久化**：每次阶段切换后更新 `workspace/memory/context.json`，确保跨对话连贯性。

## 从哪里开始

**第一次使用 / 不知道从哪开始：**
在 Claude Code 聊天框说"启动项目"，AI 会加载 `project-guide` agent 引导你。

**继续已有项目：**
直接说"继续项目"，AI 会读取 `workspace/memory/context.json` 恢复上次状态。

**直接调用特定 agent：**
说"加载 creative-architect"或"用 prompt-alchemist"，AI 会读取对应文件并按其流程执行。

## 模型切换

运行 `scripts/start-proxy.ps1` 启动 LiteLLM，然后：

- `scripts/use-deepseek.ps1` — 切换到 DeepSeek
- `scripts/use-minimax.ps1` — 切换到 MiniMax

## 扩展指南

### 新增领域

1. 在 `atoms/02.DOMAINS/` 下新建目录
2. 建 `agents/` 和 `skills/` 子目录
3. 在 `config/registry.json` 中添加索引条目
4. 更新 `project-guide.md` 的领域识别表格

### 新增 Agent

1. 在对应层级的 `agents/` 目录下创建 `.md` 文件
2. front-matter 必须包含 `name` 和 `description` 字段
3. 在 `config/registry.json` 的 `agents` 数组中添加索引

### 新增 Skill

1. 在对应层级的 `skills/` 目录下创建子目录，内含 `SKILL.md`
2. 在 `config/registry.json` 的 `skills` 数组中添加索引