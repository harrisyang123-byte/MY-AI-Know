# 02.DOMAINS/silver-economy-public-account — 银发经济公众号项目

用产品经理的系统思维，为3.2亿中国老年人提供深度价值内容，打造个人IP并实现持续变现。

**定位**：产品经理系统化解决银发群体的真实需求  
**口号**：不是教科技，而是解心结  
**核心团队**：杨颜宇（产品经理）+ OpenClaw AI助手

---

## 核心 Agent

**silver-pm** — 银发经济产品经理智能体  
负责从竞品分析、用户洞察、内容策略到文章生产的完整工作流。用产品思维驱动每一个内容决策，输出可直接发布的高质量文章。

---

## 标准工作流

```
用户
 │
 ▼
silver-pm
 ├── 模式一：竞品分析（competitor-analysis）
 │     抓取文章 → 解构选题/标题/结构/情绪 → 提炼规律
 ├── 模式二：用户洞察（user-insight）
 │     需求挖掘 → 痛点排序 → 用户画像更新
 ├── 模式三：内容策略（content-strategy）
 │     选题决策 → 内容矩阵 → 发布节奏
 └── 模式四：文章生产（article-production）
       选题 → 结构设计 → 初稿 → 情绪校验 → 发布版本
```

---

## Skills 说明

| Skill | 职责 |
|-------|------|
| `competitor-analysis` | 竞品文章深度解构：选题规律、标题公式、情绪结构、爆款特征 |
| `user-insight` | 银发用户需求挖掘：痛点识别、代际冲突分析、情感需求建模 |
| `content-strategy` | 内容策略制定：选题矩阵、差异化定位、发布节奏规划 |
| `article-production` | 文章生产工作流：结构模板、情绪节奏、标题优化、发布校验 |

---

## 项目文件结构

```
silver-economy-public-account/
├── README.md                    # 本文件
├── agents/
│   └── silver-pm.md             # 核心 Agent
├── skills/
│   ├── competitor-analysis/     # 竞品分析
│   │   └── SKILL.md
│   ├── user-insight/            # 用户洞察
│   │   └── SKILL.md
│   ├── content-strategy/        # 内容策略
│   │   └── SKILL.md
│   └── article-production/      # 文章生产
│       ├── SKILL.md
│       └── references/
│           └── title-formulas.md  # 标题公式库
└── TODO.md
```

项目实际内容（分析报告、文章草稿等）存放在 `examples/silver-economy/`。

---

## 项目阶段

| 阶段 | 时间 | 目标 |
|------|------|------|
| 第一阶段：市场验证 | 1-2个月 | 竞品分析、用户调研、内容A/B测试，粉丝1000+ |
| 第二阶段：系统建设 | 3-6个月 | AI内容工作流、稳定增长，月粉丝+3000 |
| 第三阶段：IP商业化 | 6-12个月 | 个人IP、知识付费、付费社群 |

**当前阶段**：第一阶段 — 市场验证与MVP测试  
**启动时间**：2026年4月10日
