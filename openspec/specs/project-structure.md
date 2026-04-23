# 项目结构规范

## 目录架构

```
AI-atom/
├── atoms/                    # 核心原子模块
│   ├── 01.CORE/             # 核心功能
│   │   ├── agents/         # Agent 定义
│   │   ├── skills/         # Skill 工具
│   │   └── hooks/          # 钩子脚本
│   └── 02.DOMAINS/         # 领域模块
│       └── FILM/          # 影视领域
│
├── .kiro/                   # Kiro 配置
│   ├── skills/             # Kiro Skills
│   ├── hooks/              # Kiro Hooks
│   └── steering/           # 引导文件
│
├── .claude/                 # Claude 配置
│   ├── skills/             # Claude Skills
│   ├── commands/           # 命令
│   └── settings.json       # 设置
│
├── openspec/                # OpenSpec 规范
│   ├── specs/              # 已生效的规范
│   ├── changes/            # 进行中的变更
│   └── archive/            # 已归档的变更
│
└── openspec.config.json    # OpenSpec 配置
```

## 命名约定

- **文件**: kebab-case (如 `my-file.md`)
- **目录**: kebab-case (如 `my-directory`)
- **Skill 名**: kebab-case (如 `openspec-propose`)
- **Change 名**: kebab-case (如 `add-new-feature`)

## Skill 结构

每个 Skill 应该包含：
- `SKILL.md`: 主说明文件
- `references/`: 参考文档（可选）
- `scripts/`: 脚本文件（可选）
- `templates/`: 模板文件（可选）
