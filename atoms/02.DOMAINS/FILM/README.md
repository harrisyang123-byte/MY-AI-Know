# 02.DOMAINS/FILM — 电影创作垂直领域

电影创作全流程的闭环板块。两个 Agent 分工协作，覆盖从叙事到 AI 视频生成的完整链路。

## 两个核心 Agent

**creative-architect** — 创意大脑
负责从主题出发，走完叙事、视觉、美术、分镜的完整创作流程。输出可直接交给 prompt-alchemist 的分镜稿。

**prompt-alchemist** — 技术翻译官
接收分镜稿，逐镜生成 AI 图像提示词（Nano Banana）和视频提示词（Seedance 2.0）。

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
 ▼
prompt-alchemist
 ├── 阶段一：解读分镜稿，确认参考图资产
 ├── 阶段二：逐镜生成图像提示词（nano-banana-prompts）
 ├── 阶段三：逐镜生成视频提示词（seedance-prompts）
 └── 阶段四：更新个人知识库
```

## 灵活入口

不需要从头走完整流程。以下场景都支持：

| 场景 | 操作 |
|------|------|
| 从头开始新项目 | 加载 `project-guide` → 初始化后加载 `creative-architect` |
| 继续已有项目的分镜 | 加载 `creative-architect`，告诉他从哪个场景继续 |
| 只对某几个分镜生成提示词 | 加载 `prompt-alchemist`，指定镜号范围 |
| 重新生成某个场景的提示词 | 加载 `prompt-alchemist`，告诉他场景编号 |
| 修改已有分镜 | 加载 `creative-architect`，告诉他要修改哪个场景 |

## Skills 说明

Skills 是 Agent 内部调用的执行模块，用户不需要直接调用。

| Skill | 被哪个 Agent 调用 | 职责 |
|-------|-----------------|------|
| film-narrative | creative-architect 阶段一 | 叙事定调（Save the Cat 节拍表） |
| film-visual-language | creative-architect 阶段二/四 | 视觉语言框架（景别/色彩/节奏） |
| film-performance | creative-architect 阶段二/四 | 表演节奏（行动节拍/张力曲线） |
| film-art-direction | creative-architect 阶段三 | 美术指导（道具级视觉元素） |
| film-directing | creative-architect 阶段四 | 分镜执行（Arijon 语法） |
| nano-banana-prompts | prompt-alchemist 阶段二 | 图像提示词生成 |
| nano-banana-pro | prompt-alchemist 阶段二 | 图像生成工具（Gemini） |
| seedance-prompts | prompt-alchemist 阶段三 | 视频提示词生成（Seedance 2.0） |

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
