# AI 能力库

个人模块化 AI 工作流系统。将 Agents、Skills 和项目状态统一管理，让 AI 在跨对话、跨项目的场景下保持一致的行为和记忆。

## 这是什么

一个运行在 Kiro IDE 中的 AI 能力库，核心思路是：

- **Agents** 定义"谁来做"和"怎么做"——每个 agent 是一个有完整工作流的角色
- **Skills** 定义"具体怎么执行某一步"——被 agent 调用，不直接面向用户
- **Steering** 定义"AI 的行事准则"——每次对话自动加载，约束 AI 的全局行为
- **Registry** 是 AI 的地图——启动时读取，知道有哪些能力可用
- **Workspace** 是 AI 的记忆——跨对话持久化当前项目状态

## 工程结构

```
registry.json                  # AI 全局索引（agent/skill 地图 + 触发关键词）
│
├── atoms/                     # 能力库
│   ├── 01.CORE/               # 通用元能力（任何领域可用）
│   │   ├── agents/
│   │   │   ├── project-guide.md      # 项目启动向导（入口）
│   │   │   ├── superpowers-dev.md    # 通用代码开发专家
│   │   │   └── matteo-collina.md     # Node.js 架构专家
│   │   ├── skills/
│   │   │   ├── brainstorming/        # 创意探索
│   │   │   ├── creative-workflow/    # 探索→提案→实现协作框架
│   │   │   ├── writing-plans/        # 实施计划编写
│   │   │   ├── executing-plans/      # 计划执行引擎
│   │   │   ├── bugfix/               # Bug 诊断修复
│   │   │   ├── wiki-generator/       # 技术文档生成
│   │   │   ├── agent-creator/        # 创建新 Agent
│   │   │   └── git-workspace-init/   # Git 工作空间初始化
│   │   ├── toolchain/         # opendeepcrew 工具链专属 Agents
│   │   ├── hooks/             # Kiro 自动化触发器
│   │   └── mcps/              # MCP 服务器配置
│   │
│   └── 02.DOMAINS/            # 垂直领域（特定业务专属）
│       └── FILM/              # 电影创作全流程
│           ├── agents/
│           │   ├── creative-architect.md   # 电影全才（叙事→视觉→美术→分镜）
│           │   └── prompt-alchemist.md     # 分镜稿→AI 图像/视频提示词
│           └── skills/
│               ├── film-narrative/         # 叙事定调（Save the Cat 节拍表）
│               ├── film-visual-language/   # 视觉语言框架
│               ├── film-art-direction/     # 美术指导（道具级）
│               ├── film-performance/       # 表演节奏
│               ├── film-directing/         # 分镜执行（Arijon 语法）
│               ├── nano-banana-prompts/    # 图像提示词生成
│               ├── nano-banana-pro/        # 图像生成工具
│               └── seedance-prompts/       # 视频提示词生成
│
├── examples/                  # 实际项目案例
│   └── daqing-lihongzhang/    # 大清李鸿章（进行中）
│
├── workspace/                 # AI 记忆与状态持久化
│   └── memory/
│       └── context.json       # 当前项目上下文（跨对话恢复用）
│
└── .kiro/
    └── steering/              # AI 行为规则（每次对话自动加载）
        ├── project-bootstrap.md   # 冷启动流程 + 工程运行说明 + atoms 使用规则
        ├── creative-workflow.md   # 创意协作三阶段工作流
        ├── ai-challenge.md        # 独立思考与批判性对话规则
        └── pua.md                 # 任务卡住时的激励引擎
```

## 架构原则

**单向依赖**：`02.DOMAINS` 可调用 `01.CORE`，反向不行。

**数据隔离**：不同 DOMAIN 之间的项目文件、知识库严格隔离，不得跨域引用。

**Agent 优先**：有对应 agent 的任务，必须读取 agent 文件按其流程执行，不能凭直觉自由发挥。

**状态持久化**：每次阶段切换后更新 `workspace/memory/context.json`，确保跨对话连贯性。

## 从哪里开始

**第一次使用 / 不知道从哪开始：**
在 Kiro 聊天框说："帮我启动项目向导"，AI 会加载 `project-guide` agent 引导你。

**继续已有项目：**
直接说："继续项目"，AI 会读取 `workspace/memory/context.json` 恢复上次状态。

**直接调用特定 agent：**
说"加载 creative-architect"或"用 prompt-alchemist"，AI 会读取对应文件并按其流程执行。

## 扩展指南

### 新增领域

1. 在 `atoms/02.DOMAINS/` 下新建目录，如 `02.DOMAINS/COMMERCE/`
2. 建 `agents/` 和 `skills/` 子目录
3. 在 `registry.json` 中添加新 agent/skill 的索引条目
4. 更新 `project-guide.md` 的领域识别表格，加入新领域的触发词和初始化模板

### 新增 Agent

1. 在对应层级的 `agents/` 目录下创建 `.md` 文件
2. front-matter 必须包含 `name` 和 `description` 字段
3. 在 `registry.json` 的 `agents` 数组中添加索引条目（含 `triggers` 关键词）

### 新增 Skill

1. 在对应层级的 `skills/` 目录下创建子目录，内含 `SKILL.md`
2. 在 `registry.json` 的 `skills` 数组中添加索引条目
