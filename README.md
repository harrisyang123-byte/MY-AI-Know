# AI-atom

个人模块化 AI 工作流系统。管理 Agents、Skills 和项目状态，让 AI 在跨对话、跨项目中保持一致的行为和记忆。

## 快速开始

### 1. 启动 Claude Code

在项目目录下运行：

```powershell
cd D:\AI-atom - 副本
claude
```

### 2. 启动项目

进入 Claude Code 后，说以下任一指令：

- **"启动项目"** — 新项目或继续已有项目
- **"加载 creative-architect"** — 直接进入电影创作流程
- **"加载 lumen-planner"** — 进入AI视觉设计流程

### 3. 切换模型

不想用默认模型？可以切换：

```powershell
# 切换到 DeepSeek Chat
Copy-Item .claude\settings-deepseek-chat.json .claude\settings.json -Force
claude

# 切换到 DeepSeek Reasoner
Copy-Item .claude\settings-deepseek-reasoner.json .claude\settings.json -Force
claude

# 切换到 MiniMax
Copy-Item .claude\settings-minimax.json .claude\settings.json -Force
claude
```

或者直接运行脚本：

```powershell
.\scripts\use-deepseek.ps1
.\scripts\use-minimax.ps1
```

---

## 核心概念

- **Agent** — 定义"谁来做"和"怎么做"，每个 agent 是一个有完整工作流的角色
- **Skill** — 定义"具体怎么执行某一步"，被 agent 调用，不直接面向用户
- **Registry** — AI 的能力地图，定义在 `config/registry.json`

---

## 项目结构

```
AI-atom/
├── .claude/               # Claude Code 配置
│   └── settings.json      # 当前模型配置
│
├── config/                 # 配置文件
│   ├── registry.json       # Agent & Skill 索引
│   ├── litellm-config.yaml # 模型代理配置
│   └── models.yaml
│
├── atoms/                  # 能力库（核心）
│   ├── 01.CORE/            # 通用元能力
│   │   ├── agents/
│   │   │   ├── project-guide.md      # 项目启动向导 ⭐入口
│   │   │   ├── superpowers-dev.md    # 通用代码开发
│   │   │   ├── professional-developer.md  # OpenSpec 开发
│   │   │   └── matteo-collina.md     # Node.js 架构
│   │   └── skills/         # 通用元技能
│   │       ├── brainstorming/        # 创意头脑风暴
│   │       ├── creative-workflow/    # 协作工作流
│   │       ├── openspec/             # OpenSpec 变更管理
│   │       ├── design-system/        # 设计系统
│   │       ├── design/               # 设计技能
│   │       ├── slides/               # PPT 幻灯片
│   │       ├── brand/                # 品牌指南
│   │       ├── ui-styling/           # UI 样式
│   │       ├── ui-ux-pro-max/        # UI/UX 专业版
│   │       └── ...
│   │
│   └── 02.DOMAINS/         # 垂直领域
│       ├── FILM/           # 电影创作 ⭐
│       │   ├── agents/
│       │   │   ├── creative-architect.md  # 电影全才
│       │   │   └── lumen-planner.md       # AI视觉设计Agent
│       │   └── skills/
│       │       ├── film-narrative/        # 叙事定调
│       │       ├── film-visual-language/  # 视觉语言
│       │       ├── film-directing/        # 分镜执行
│       │       ├── film-screenplay/       # 剧本写作
│       │       ├── nano-banana-prompts/   # 图像提示词（已废弃，由 lumen-planner 替代）
│       │       ├── lumen-planner/         # AI视觉设计方法论知识库
│       │       └── seedance-prompts/      # 视频提示词
│       │
│       ├── PERSONAL/       # 个人事务
│       └── silver-economy-public-account/  # 银发经济公众号
│
├── examples/               # 项目案例
│   ├── daqing-lihongzhang/  # 大清李鸿章（电影项目）
│   └── silver-economy/     # 银发经济公众号
│
├── scripts/                # 工具脚本
├── docs/                   # 使用指南
└── workspace/              # AI 记忆
```

---

## Agents 列表

| Agent | 用途 | 触发词 |
|-------|------|--------|
| `project-guide` | 项目启动向导 | 启动项目、继续项目 |
| `creative-architect` | 电影创作全流程 | 电影创作、分镜 |
| `lumen-planner` | AI视觉设计（图像/视频提示词） | 图像生成、海报设计、做图、视觉设计 |
| `superpowers-dev` | 通用代码开发 | 开发需求、写代码 |
| `professional-developer` | OpenSpec 开发 | 项目开发 |
| `matteo-collina` | Node.js 架构 | Node.js、架构 |

---

## 当前项目

正在进行的项目：`examples/daqing-lihongzhang/`（大清李鸿章电影）

---

## 配置说明

当前使用的配置文件：`.claude/settings.json`

查看当前模型：
```powershell
cat .claude\settings.json
```