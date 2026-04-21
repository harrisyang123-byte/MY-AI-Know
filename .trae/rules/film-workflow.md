# 电影创作工作流

## 适用场景

当用户提到电影创作、叙事、分镜、美术指导、视觉定调等相关话题时，加载此工作流。

## 核心 Agent

- **creative-architect**: 电影创作全才（`atoms/02.DOMAINS/FILM/agents/creative-architect.md`）
- **prompt-alchemist**: 提示词翻译官（`atoms/02.DOMAINS/FILM/agents/prompt-alchemist.md`）

## 创作流程

### 1. 叙事定调
使用 `film-narrative` skill，基于 Save the Cat 节拍表构建故事框架。

### 2. 视觉语言
使用 `film-visual-language` skill，确定影片的视觉风格和镜头语言。

### 3. 美术指导
使用 `film-art-direction` skill，细化场景、道具、色彩方案。

### 4. 表演节奏
使用 `film-performance` skill，规划演员表演和情绪节奏。

### 5. 分镜执行
使用 `film-directing` skill，基于 Arijon 语法设计具体镜头。

### 6. 提示词生成
- 图像：使用 `nano-banana-prompts` skill
- 视频：使用 `seedance-prompts` skill

## 领域隔离

FILM 领域可调用 CORE 领域的 skills，但 CORE 不得反向调用 FILM。
