# Atoms — 双层模块化知识库

## 架构概览

```
atoms/
├── 01.CORE/          # 通用元能力层（与业务无关，任何项目可用）
│   ├── agents/       # 通用 Meta-Agents
│   ├── skills/       # 通用元能力 Skills
│   ├── hooks/        # 自动化触发器
│   └── mcps/         # MCP 服务器配置
│
└── 02.DOMAINS/       # 垂直领域层（特定业务场景专属）
    └── FILM/         # 电影创作板块
        ├── agents/   # 电影专属 Agents
        └── skills/   # 电影专属 Skills
```

## 核心规则

- DOMAINS 可调用 CORE，CORE 不依赖 DOMAINS
- 不同 DOMAIN 之间数据严格隔离
- 新增领域：在 `02.DOMAINS/` 下新建目录即可

## 详细说明

- CORE 层：见 [01.CORE/README.md](01.CORE/README.md)
- FILM 域：见 [02.DOMAINS/FILM/README.md](02.DOMAINS/FILM/README.md)
