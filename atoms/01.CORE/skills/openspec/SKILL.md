# OpenSpec - 规范驱动开发框架

> 先写规格（Spec），再生成代码。通过 `/openspec` 命令控制 AI 行为，解决“AI 写跑偏、上下文丢失”问题。

---

## 🚀 快速开始

### 安装前置条件
- Node.js ≥ 20.19.0
- Claude Code 已安装

### 一键安装（推荐）
```bash
! 执行安装脚本（会自动检测并安装依赖）
/openspec:install
```

### 手动安装
1. **安装全局工具**：
   ```bash
   npm install -g @fission-ai/openspec@latest
   ```

2. **初始化项目**（在当前项目根目录）：
   ```bash
   openspec init
   ```

3. **测试安装**：
   ```bash
   openspec --version
   ```

---

## 📋 核心工作流（3 步）

### 1. 提案（Proposal）：定义要改什么
在 Claude Code 中执行：
```bash
/openspec:proposal "给 Todo 应用添加任务优先级功能"
```
**自动生成**：
```
openspec/changes/add-task-priority/
├── proposal.md    # 目标、范围、验收标准
└── spec.md       # 接口、数据结构、行为规则
```

### 2. 应用（Apply）：AI 按规格写代码
```bash
/openspec:apply add-task-priority
```
**AI 行为**：
- 严格按 `spec.md` 生成/修改代码
- 只改**提案范围内**的文件
- 自动生成**任务清单与验证步骤**

### 3. 归档（Archive）：完成后固化规范
```bash
/openspec:archive add-task-priority
```
**效果**：
- 把 `spec` 合并到 `openspec/specs/`（项目真相源）
- 变更移入 `changes/archive/`，留审计痕迹
- 后续 AI 自动读取最新规范

---

## 🔧 可用命令

### 主要工作流
| 命令 | 说明 | 示例 |
|------|------|------|
| `proposal <描述>` | 新建变更提案 | `/openspec:proposal "添加用户登录API"` |
| `apply <变更名>` | 按规格生成代码 | `/openspec:apply add-user-login` |
| `archive <变更名>` | 归档生效 | `/openspec:archive add-user-login` |

### 辅助命令
| 命令 | 说明 | 示例 |
|------|------|------|
| `explore` | 分析现有规范与依赖 | `/openspec:explore` |
| `list` | 查看所有进行中的变更 | `/openspec:list` |
| `status` | 检查 OpenSpec 安装状态 | `/openspec:status` |
| `install` | 自动安装配置 | `/openspec:install` |

### 项目配置命令
| 命令 | 说明 | 示例 |
|------|------|------|
| `config:init` | 在当前项目初始化 | `/openspec:config:init` |
| `config:verify` | 验证配置完整性 | `/openspec:config:verify` |

---

## 📁 项目结构

初始化后结构：
```
your-project/
├── .claude/commands/openspec/      # Claude Code 命令配置
├── openspec/
│   ├── specs/                     # 已生效的系统规范（真相源）
│   │   ├── project-structure.md   # 项目结构规范
│   │   ├── coding-standards.md    # 编码标准
│   │   └── api-conventions.md     # API 约定
│   ├── changes/                   # 待实现的变更提案
│   │   ├── add-feature-x/
│   │   │   ├── proposal.md
│   │   │   └── spec.md
│   │   └── fix-bug-y/
│   │       ├── proposal.md
│   │       └── spec.md
│   └── archive/                   # 已归档的历史变更
└── openspec.config.json          # 全局配置
```

---

## 🎯 最佳实践

### 1. **提案阶段要具体**
```markdown
# proposal.md 范例
## 目标
添加任务优先级功能，支持高、中、低三级。

## 范围
- 修改 Task 模型，添加 priority 字段
- 更新 API 端点 /tasks
- 添加优先级筛选功能
- 更新 UI 显示优先级标签

## 验收标准
- [ ] 任务模型有 priority 字段（enum: high, medium, low）
- [ ] API 支持按优先级筛选
- [ ] UI 显示彩色优先级标签
- [ ] 测试覆盖率 > 80%
```

### 2. **规格阶段要详尽**
```markdown
# spec.md 范例
## 数据结构
```typescript
interface Task {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';  // 新增字段
  completed: boolean;
  createdAt: Date;
}
```

## API 端点
- `GET /tasks?priority=high` - 按优先级筛选
- `POST /tasks` - 创建带优先级的任务
- `PATCH /tasks/:id/priority` - 更新优先级
```

### 3. **应用阶段的协作**
```bash
# 先让 AI 生成代码
/openspec:apply add-task-priority

# 手动审查生成的代码
# 运行测试
# 修复问题

# 确认无误后归档
/openspec:archive add-task-priority
```

---

## ⚖️ OpenSpec vs Kiro Steering

| 维度 | **OpenSpec** | **Kiro（动态引导）** |
|------|--------------|-------------------|
| **控制方式** | 静态、文件化、事前控制 | 动态、运行时、拦截式 |
| **工作流** | 写 `spec` → AI 严格遵守 | Hook/Steering 实时修改 AI 行为 |
| **审计性** | 变更可审计、可回溯、团队可评审 | 实时记录，但不一定结构化 |
| **适用场景** | 遗留系统、风险高、多人协作 | 快速原型、实时干预、自动化流程 |
| **学习曲线** | 中等（需要写规范文档） | 低到中等（即时反馈） |

### 如何选择？
- **高风险变更** → OpenSpec（确保 AI 不跑偏）
- **团队协作** → OpenSpec（规范可评审、可存档）
- **快速原型** → Kiro（灵活、即时）
- **自动化流程** → Kiro（实时拦截修改）

---

## 🧪 实战示例

### 场景：给 Todo 应用添加标签功能

#### 第 1 步：创建提案
```bash
/openspec:proposal "给Todo应用添加标签功能"
```

#### 第 2 步：完善提案
编辑 `openspec/changes/add-tags/proposal.md`：
```markdown
## 目标
支持给任务添加多个标签。

## 范围
- Task 模型添加 tags 字段（string[]）
- API 支持标签 CRUD
- UI 显示标签并支持筛选

## 验收标准
- [ ] 任务可添加/移除标签
- [ ] API 支持按标签筛选
- [ ] UI 显示标签云
```

#### 第 3 步：编写规格
编辑 `openspec/changes/add-tags/spec.md`：
```markdown
## 数据结构
```typescript
interface Task {
  id: string;
  title: string;
  tags: string[];  // 新增
  completed: boolean;
}
```

## API 端点
- `GET /tasks?tag=work` - 按标签筛选
- `POST /tasks/:id/tags` - 添加标签
- `DELETE /tasks/:id/tags/:tag` - 移除标签
```

#### 第 4 步：生成代码
```bash
/openspec:apply add-tags
```

#### 第 5 步：归档
```bash
/openspec:archive add-tags
```

---

## 🚨 故障排除

### 常见问题

#### 1. 安装失败
```bash
# 检查 Node.js 版本
node --version  # 需要 ≥ 20.19.0

# 使用 nvm 切换版本
nvm install 20
nvm use 20

# 清理 npm 缓存
npm cache clean --force
```

#### 2. 命令不识别
```bash
# 检查 .claude/commands/openspec/ 是否存在
ls -la .claude/commands/

# 重新初始化
openspec init --force
```

#### 3. AI 不按规格执行
```bash
# 检查 spec.md 是否格式正确
cat openspec/changes/<change-name>/spec.md

# 使用更详细的命令
/openspec:apply <change-name> --verbose
```

#### 4. 配置丢失
```bash
# 重新生成配置
/openspec:config:init
```

---

## 🔗 相关资源

- **官方仓库**: https://github.com/Fission-AI/OpenSpec
- **文档**: https://openspec.fission.ai
- **问题反馈**: https://github.com/Fission-AI/OpenSpec/issues

---

## 🎓 学习路径

1. **初学者**：从 `/examples/todo-app/` 开始，熟悉工作流
2. **中级**：尝试规范复杂的 API 或组件
3. **高级**：结合 CI/CD 集成 OpenSpec 流程
4. **专家**：贡献自定义命令或扩展

---

**提示**：每次变更都应该有完整的提案→规格→实现→归档流程，确保项目规范始终是最新、准确的“真相源”。