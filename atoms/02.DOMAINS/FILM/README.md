# 02.DOMAINS/FILM — 电影创作垂直领域

电影创作全流程的闭环板块。从叙事定调到 AI 视频生成，所有专属能力都在这里。

## 目录结构

```
FILM/
├── agents/
│   ├── creative-architect.md   # 电影全才创意大脑（叙事→视觉→美术→表演→分镜）
│   └── prompt-alchemist.md     # 提示词翻译官（分镜稿→图像/视频提示词）
├── skills/
│   ├── film-narrative/         # 叙事定调（Save the Cat 节拍表）
│   ├── film-visual-language/   # 视觉语言框架（景别/色彩/节奏）
│   ├── film-art-direction/     # 美术指导（道具级视觉元素）
│   ├── film-performance/       # 表演节奏（行动节拍/张力曲线）
│   ├── film-directing/         # 分镜执行（Arijon 语法）
│   ├── nano-banana-pro/        # 图像生成工具（Gemini 3 Pro）
│   ├── nano-banana-prompts/    # 图像提示词生成
│   └── seedance-prompts/       # 视频提示词生成（Seedance 2.0）
└── README.md
```

## 完整创作流程

```
film-narrative          叙事定调（节拍表 + 人物小传 + 场景清单）
       ↓
film-visual-language    全片视觉框架定调（模式一）
film-performance        全片表演基准定调（模式一）
       ↓
film-art-direction      逐场景美术方案（道具级）
       ↓
film-performance        逐场景行动节拍（模式二）
film-directing          逐场景分镜设计
film-visual-language    逐镜视觉校验（模式二）
       ↓
nano-banana-prompts     图像提示词生成
       ↓
seedance-prompts        视频提示词生成
```

## 调用的 CORE 层能力

- `/creative-workflow` — 探索→提案→实现的协作框架
- `/brainstorming` — 创意探索（项目启动阶段）

## 领域知识库位置

各 Skill 的参考资料在对应 skill 目录的 `references/` 子目录内：
- `film-art-direction/references/period-references.md` — 时代背景视觉参考
- `film-directing/references/axis-crossing.md` — 越轴处理方案
- `film-narrative/references/save-the-cat-beats.md` — 节拍定义
- `nano-banana-prompts/references/my-best-practices.md` — 个人图像提示词知识库
- `seedance-prompts/references/my-best-practices.md` — 个人视频提示词知识库
