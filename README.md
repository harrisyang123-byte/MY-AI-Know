# 我的 AI 知识库

个人 Skills、Agents 和工作流的模块化知识库，采用双层架构管理。

## 结构

```
atoms/
├── 01.CORE/          # 通用元能力（任何项目可用）
│   ├── agents/       # Matteo Collina、Superpowers Dev
│   ├── skills/       # brainstorming、bugfix、skill-creator 等
│   ├── toolchain/    # opendeepcrew 工具链 Agents
│   ├── hooks/        # 自动化触发器
│   └── mcps/         # MCP 服务器配置
│
└── 02.DOMAINS/       # 垂直领域（特定业务专属）
    └── FILM/         # 电影创作全流程
        ├── agents/   # Creative Architect、Prompt Alchemist
        └── skills/   # film-narrative、film-directing 等

examples/             # 实际项目案例
└── daqing-lihongzhang/
```

**规则：** DOMAINS 可调用 CORE，反向不行；不同 DOMAIN 之间数据隔离。

## 新增领域

在 `atoms/02.DOMAINS/` 下新建目录，加 `agents/` 和 `skills/` 子目录即可。
