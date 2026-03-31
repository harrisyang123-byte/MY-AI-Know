# 01.CORE — 通用元能力层

与任何业务领域无关的底层能力。无论做电影、做产品、做任何项目，这里的 Skills 和 Agents 都可以直接调用。

## 目录结构

```
01.CORE/
├── agents/          # 通用 Meta-Agents
│   ├── matteo-collina.md       # Node.js 架构专家
│   └── superpowers-dev.md      # 通用需求开发专家
├── skills/          # 通用元能力 Skills
│   ├── agent-creator/          # 创建新 Agent
│   ├── brainstorming/          # 创意探索
│   ├── bugfix/                 # Bug 诊断修复
│   ├── creative-workflow/      # 探索→提案→实现协作框架
│   ├── executing-plans/        # 计划执行引擎
│   ├── git-workspace-init/     # Git 工作空间初始化
│   ├── opendeepcrew-cli/       # Marketplace 管理工具
│   ├── wiki-generator/         # 技术文档生成
│   └── writing-plans/          # 实施计划编写
├── toolchain/       # opendeepcrew 工具链专属 Agents
│   ├── opendeepcrew-bug-fixer.md
│   ├── opendeepcrew-product-dev.md
│   └── opendeepcrew-qa.md
├── hooks/           # 自动化触发器
└── mcps/            # MCP 服务器配置
```

## 跨层调用协议

### 原则

1. **单向依赖**：DOMAINS 层可以调用 CORE 层，CORE 层不依赖任何 DOMAIN 层内容。
2. **数据隔离**：不同 DOMAIN 之间的数据（知识库、参考资料、项目文件）严格隔离，不得跨域引用。
3. **调用方式**：在 DOMAIN 层的 Agent 或 Skill 中，用 `/<skill-name>` 格式调用 CORE 层 Skill。

### 调用示例

```
# FILM 域的 Creative Architect 调用 CORE 层通用能力
/creative-workflow   ← 来自 01.CORE/skills/creative-workflow
/brainstorming       ← 来自 01.CORE/skills/brainstorming

# FILM 域专属能力（只在 FILM 域内调用）
/film-narrative      ← 来自 02.DOMAINS/FILM/skills/film-narrative
/film-directing      ← 来自 02.DOMAINS/FILM/skills/film-directing
```

### 新增领域时的规则

1. 在 `02.DOMAINS/` 下新建领域目录，如 `02.DOMAINS/COMMERCE/`
2. 领域内建 `agents/`、`skills/`、`knowledge/` 三个子目录
3. 领域专属知识（参考资料、案例）只放在本领域目录内
4. 可自由调用 `01.CORE` 的任何 Skill，但不得引用其他 DOMAIN 的内容
