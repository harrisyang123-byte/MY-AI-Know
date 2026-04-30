# 02.DOMAINS/FILM — 电影创作垂直领域

电影创作全流程的闭环板块。两个 Agent 分工协作，覆盖从叙事到 AI 视频生成的完整链路。

## 两个核心 Agent

**creative-architect** — 创意大脑
负责从主题出发，走完叙事、视觉、美术、分镜的完整创作流程。输出可直接交给 Lumen Planner Agent 的分镜稿。

**lumen-planner** — 世界级AI设计师
接收分镜稿或设计需求，通过7大核心技能将创意转化为可执行的AI图像/视频提示词。具备空间理解、光线量化、一致性控制、迭代优化和知识沉淀能力。

**触发方式**：用户说"生成图像"/"做图"/"视觉设计"/"海报设计"/"产品摄影"等关键词时，自动切换到 Lumen Planner Agent。

## 标准创作流程

```
用户
 │
 ▼
creative-architect
 ├── 阶段一：叙事定调（film-narrative）
 │     Logline、人物小传、节拍表、核心场景清单
 ├── 阶段二：全片定调（film-visual-language + film-performance）
 │     视觉框架 + 表演基准
 ├── 阶段三：艺术指导（film-art-direction）
 │     逐场景道具/光线/服装
 └── 阶段四：分镜构思（film-directing + film-performance + film-visual-language）
       完整文字分镜稿 → 输出到 04-directing.md
 │
 ▼  用户说"生成图像"/"做图" → 切换到 Lumen Planner Agent
 │
lumen-planner (Agent)
 ├── 阶段一：分析（Image Analysis + Context Integration）
 │     理解需求、分析参考图、建立上下文
 ├── 阶段二：策略（Spatial Reasoning + Tool Selection + Knowledge Retrieval）
 │     空间推理、工具选择、知识检索
 ├── 阶段三：增强（Prompt Engineering + Context Integration）
 │     7层提示词构建、上下文整合
 ├── 阶段四：执行（工具/SubAgent调用）
 │     图像生成、批量处理
 └── 阶段五：完成与迭代（Iterative Refinement）
       质量评估、迭代优化、知识归档
 │
 ▼  用户需要视频 → 调用 /seedance-prompts
 │
seedance-prompts
 └── 将静态图 + 镜头运动描述 → Seedance 2.0 视频提示词
```

## 灵活入口

不需要从头走完整流程。以下场景都支持：

| 场景 | 操作 |
|------|------|
| 从头开始新项目 | 加载 `project-guide` → 初始化后加载 `creative-architect` |
| 继续已有项目的分镜 | 加载 `creative-architect`，告诉他从哪个场景继续 |
| 只对某几个分镜生成提示词 | 加载 `lumen-planner`，指定镜号范围 |
| 重新生成某个场景的提示词 | 加载 `lumen-planner`，告诉他场景编号 |
| 修改已有分镜 | 加载 `creative-architect`，告诉他要修改哪个场景 |
| 直接生成图像/海报/产品图 | 直接加载 `lumen-planner`，不需要经过 creative-architect |

## Skills 说明

Skills 是 Agent 内部调用的执行模块，用户不需要直接调用。

| Skill | 被哪个 Agent 调用 | 职责 |
|-------|-----------------|------|
| film-narrative | creative-architect 阶段一 | 叙事定调（Save the Cat 节拍表） |
| film-visual-language | creative-architect 阶段二/四 | 视觉语言框架（景别/色彩/节奏） |
| film-performance | creative-architect 阶段二/四 | 表演节奏（行动节拍/张力曲线） |
| film-art-direction | creative-architect 阶段三 | 美术指导（道具级视觉元素） |
| film-directing | creative-architect 阶段四 | 分镜执行（Arijon 语法） |
| lumen-planner (知识库) | lumen-planner Agent | 方法论知识库（7核心技能详解） |
| nano-banana-pro | lumen-planner Agent | 图像生成工具（Gemini） |
| seedance-prompts | lumen-planner Agent | 视频提示词生成（Seedance 2.0） |

## Agent ↔ Skill 关系

```
agents/lumen-planner.md          ← Agent定义（触发入口）
    │
    │ 引用方法论文档
    ▼
skills/lumen-planner/            ← 方法论知识库
    ├── SKILL.md                     知识库入口
    ├── 01_role/                     核心能力定义
    ├── 02_capabilities/             工具/SubAgent/技能配置
    ├── 03_workflow/                 工作流+核心原则
    ├── 04_skills/                   7个核心技能详解
    └── 05_integration/              完整系统提示词
```

## 项目文件结构

每个 FILM 项目存放在 `examples/<project-slug>/`：

```
PROJECT.spec.md          # 项目状态、进度、关键决策记录
00-scene-mapping.md      # 场景编号对应表（narrative 场景 ↔ 剧本场景）
01-narrative.md          # 阶段一输出：叙事定调
02-visual-style.md       # 阶段二输出：视听定调
03-art-direction.md      # 阶段三输出：艺术指导（最终版，日常查看）
03-art-direction-process.md  # 阶段三推导过程（仅修改时查看）
04-directing.md          # 阶段四输出：完整分镜稿
```
