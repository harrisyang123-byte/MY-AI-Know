# OpenSpec 命令参考手册

## 🎯 核心命令

### `/openspec:proposal <描述>`
**用途**: 创建新的变更提案
**参数**:
- `<描述>`: 提案的简要描述（1-2句话）

**示例**:
```bash
/openspec:proposal "添加用户认证功能"
/openspec:proposal "重构支付模块，支持多种支付方式"
```

**输出**:
```
✅ 提案创建成功: add-user-auth
📍 位置: openspec/changes/add-user-auth/
📝 请编辑文件:
  - proposal.md (目标、范围、验收标准)
  - spec.md (详细技术规格)
```

**生成的目录结构**:
```
openspec/changes/add-user-auth/
├── proposal.md    # 自动生成基础模板
└── spec.md       # 需要手动完善的技术规格
```

---

### `/openspec:apply <变更名>`
**用途**: 根据 spec 文件生成或修改代码
**参数**:
- `<变更名>`: 变更目录名称（不含路径）

**示例**:
```bash
/openspec:apply add-user-auth
/openspec:apply refactor-payment-module
```

**可选参数**:
- `--dry-run`: 仅显示计划，不实际修改文件
- `--verbose`: 显示详细执行日志
- `--skip-validation`: 跳过验证步骤

**工作流程**:
1. 读取 `openspec/changes/<变更名>/spec.md`
2. 分析现有代码结构
3. 根据规格生成/修改代码
4. 输出任务清单和验证步骤

**输出示例**:
```
🔧 开始应用变更: add-user-auth

📋 执行计划:
✓ 创建 src/models/User.ts
✓ 更新 src/api/auth.ts
✓ 添加测试文件: tests/auth.test.ts

📝 任务清单:
1. 配置环境变量
2. 运行数据库迁移
3. 测试 API 端点

✅ 变更应用完成！请执行验证步骤。
```

---

### `/openspec:archive <变更名>`
**用途**: 归档已完成的变更，将 spec 合并到项目真相源
**参数**:
- `<变更名>`: 要归档的变更目录名称

**示例**:
```bash
/openspec:archive add-user-auth
```

**效果**:
1. 将 `spec.md` 合并到 `openspec/specs/` 相关文件
2. 将变更目录移动到 `openspec/archive/`
3. 更新项目规范索引

**输出**:
```
📚 归档变更: add-user-auth
✓ spec 已合并到 openspec/specs/user-authentication.md
✓ 变更目录移动到 openspec/archive/add-user-auth/
✓ 项目规范已更新

📖 归档完成！新开发者可以通过 openspec/specs/ 了解项目约定。
```

---

## 🔍 查询命令

### `/openspec:explore`
**用途**: 分析现有规范和依赖关系
**参数**: 无

**输出**:
```
🔍 探索项目规范...

📁 现有规范:
• api-conventions.md (最后更新: 2024-01-15)
• coding-standards.md (最后更新: 2024-01-10)
• project-structure.md (最后更新: 2024-01-05)

📊 依赖关系:
api-conventions.md ← coding-standards.md
project-structure.md ← coding-standards.md

📈 统计:
• 规范文件: 3
• 变更提案: 2 (进行中)
• 归档变更: 5
• 总规范行数: 420
```

**分析内容**:
- 规范文件的时间和大小
- 文件间的引用关系
- 变更状态统计
- 潜在冲突检测

---

### `/openspec:list`
**用途**: 列出所有进行中的变更提案
**参数**: 无

**输出**:
```
📋 进行中的变更提案:

1. add-user-auth (创建: 2024-01-15)
   状态: spec 编写中
   进度: ███░░░░░░░ 30%

2. refactor-payment-module (创建: 2024-01-12)
   状态: 实施中
   进度: ███████░░░ 70%

3. add-task-priority (创建: 2024-01-10)
   状态: 已归档
   进度: ██████████ 100%

总计: 2 个进行中，1 个已归档
```

**显示信息**:
- 变更名称和创建日期
- 当前状态
- 进度条
- 简要描述

---

### `/openspec:status`
**用途**: 检查 OpenSpec 安装和配置状态
**参数**: 无

**输出**:
```
🛠️ OpenSpec 状态检查:

✓ OpenSpec CLI 已安装: v1.2.0
✓ openspec.config.json 存在
✓ openspec/ 目录结构完整
✓ .claude/commands/openspec/ 配置存在
✓ Node.js 版本: v20.19.0 ✅

📊 配置摘要:
• 项目类型: web-application
• 默认 AI 模型: claude-3-5-sonnet-20241022
• 自动归档: 已禁用
• 验证步骤: 已启用

📍 路径:
• 规范位置: openspec/specs/
• 变更位置: openspec/changes/
• 配置文件: openspec.config.json
```

**检查项目**:
- OpenSpec CLI 安装状态
- 配置文件完整性
- 目录结构
- Claude Code 集成
- 依赖项版本

---

## ⚙️ 配置命令

### `/openspec:config:init`
**用途**: 在当前项目初始化 OpenSpec 配置
**参数**:
- `--force`: 强制覆盖现有配置

**示例**:
```bash
/openspec:config:init
/openspec:config:init --force
```

**创建的目录**:
```
.claude/commands/openspec/
├── proposal.json
├── apply.json
├── archive.json
└── explore.json

openspec/
├── specs/
│   ├── project-structure.md
│   ├── coding-standards.md
│   └── api-conventions.md
├── changes/
└── archive/

openspec.config.json
```

---

### `/openspec:config:verify`
**用途**: 验证 OpenSpec 配置完整性
**参数**: 无

**检查项目**:
- 所有必需文件是否存在
- 配置文件格式是否正确
- 目录权限是否正常
- Claude Code 命令是否可访问

**输出示例**:
```
🔍 验证配置完整性...

✓ openspec.config.json 格式正确
✓ openspec/specs/ 目录存在
✓ openspec/changes/ 目录存在
✓ .claude/commands/openspec/ 命令配置完整
✓ 所有文件权限正常

✅ 配置验证通过！
```

---

## 🔄 维护命令

### `/openspec:clean`
**用途**: 清理临时文件和缓存
**参数**:
- `--all`: 清理所有临时文件（包括生成的代码）

**示例**:
```bash
/openspec:clean           # 仅清理缓存
/openspec:clean --all    # 清理所有临时文件
```

**清理内容**:
- AI 生成的临时文件
- 缓存的分析结果
- 旧的日志文件
- 未引用的中间文件

---

### `/openspec:migrate`
**用途**: 迁移旧版本配置或规范格式
**参数**:
- `--from <版本>`: 指定源版本
- `--to <版本>`: 指定目标版本

**示例**:
```bash
/openspec:migrate --from 0.9.0 --to 1.0.0
```

**支持迁移**:
- 配置格式更新
- 规范文件结构调整
- 变更提案格式升级
- 与 Claude Code 集成改进

---

## 🎨 高级命令

### `/openspec:generate <模板类型>`
**用途**: 基于模板生成特定类型的内容
**参数**:
- `<模板类型>`: api, component, model, test, migration

**示例**:
```bash
/openspec:generate api --name UserAPI --method GET,POST,PUT
/openspec:generate component --name UserProfile --props name,email
```

**可用模板**:
- `api`: REST API 端点
- `component`: UI 组件
- `model`: 数据模型
- `test`: 测试文件
- `migration`: 数据库迁移

---

### `/openspec:analyze <路径>`
**用途**: 分析现有代码，生成规范建议
**参数**:
- `<路径>`: 要分析的目录或文件

**示例**:
```bash
/openspec:analyze src/models/
/openspec:analyze package.json
```

**输出**:
- 代码结构分析
- 潜在规范建议
- 与现有规范的差距分析
- 重构建议

---

## ⚠️ 安全命令

### `/openspec:audit`
**用途**: 审计规范与代码的一致性
**参数**: 无

**检查内容**:
- 规范是否被正确实施
- 代码是否遵循所有规范
- 是否有未记录的变更
- 安全性和合规性检查

**输出**:
```
🔒 规范审计报告:

✓ 认证规范完全实施
⚠️  支付规范部分偏离 (3个问题)
❌ 数据保护规范未实施

📋 问题列表:
1. User 模型缺少加密字段
2. API 端点缺少速率限制
3. 日志包含敏感信息
```

---

### `/openspec:backup`
**用途**: 备份 OpenSpec 配置和规范
**参数**:
- `--path <目录>`: 备份目标路径
- `--include-changes`: 包含进行中的变更

**示例**:
```bash
/openspec:backup --path ./backups/
/openspec:backup --include-changes
```

**备份内容**:
- 所有规范文件
- 配置文件
- 可选：进行中的变更提案
- 元数据和时间戳

---

## 🆘 帮助命令

### `/openspec:help`
**用途**: 显示帮助信息
**参数**: 
- `[命令名]`: 特定命令的详细帮助

**示例**:
```bash
/openspec:help
/openspec:help proposal
/openspec:help apply
```

**输出**:
```
OpenSpec - 规范驱动开发框架

可用命令:
• proposal    - 创建变更提案
• apply      - 实施变更
• archive    - 归档变更
• explore    - 分析规范
• list       - 列出变更
• status     - 检查状态

使用 /openspec:help <命令> 获取详细帮助。
```

---

## 📋 命令组合示例

### 完整工作流
```bash
# 1. 创建提案
/openspec:proposal "添加购物车功能"

# 2. 编辑 spec.md（手动）
# 3. 应用变更
/openspec:apply add-shopping-cart

# 4. 测试和验证（手动）
# 5. 归档
/openspec:archive add-shopping-cart
```

### 批量操作
```bash
# 检查所有进行中的变更
/openspec:list

# 批量应用多个变更
/openspec:apply feature-a
/openspec:apply feature-b
/openspec:apply bugfix-c

# 批量归档
/openspec:archive feature-a
/openspec:archive feature-b
```

### 项目管理
```bash
# 初始化新项目
mkdir my-project && cd my-project
git init
/openspec:config:init

# 探索项目状态
/openspec:explore
/openspec:status

# 定期审计
/openspec:audit
/openspec:backup
```

---

## 🚨 错误代码参考

| 代码 | 含义 | 解决方法 |
|------|------|----------|
| ERR_OPENSPEC_NOT_INSTALLED | OpenSpec CLI 未安装 | 运行 `/openspec:install` |
| ERR_CONFIG_MISSING | 配置文件缺失 | 运行 `/openspec:config:init` |
| ERR_SPEC_NOT_FOUND | 规范文件未找到 | 检查 openspec/changes/<名称>/spec.md |
| ERR_VALIDATION_FAILED | 验证失败 | 检查规范格式或运行 `--skip-validation` |
| ERR_AI_UNAVAILABLE | AI 服务不可用 | 检查网络或更换模型配置 |
| ERR_PERMISSION_DENIED | 权限不足 | 检查文件权限或使用 sudo |
| ERR_VERSION_MISMATCH | 版本不兼容 | 运行 `/openspec:migrate` |

---

## 🔧 调试参数

所有命令都支持以下调试参数：

```bash
# 显示详细日志
/openspec:apply <变更> --verbose

# 仅显示计划，不执行
/openspec:apply <变更> --dry-run

# 跳过验证步骤
/openspec:apply <变更> --skip-validation

# 指定日志级别
/openspec:apply <变更> --log-level debug

# 输出到文件
/openspec:apply <变更> --output report.json
```

---

## 📚 相关资源

- **官方文档**: https://openspec.fission.ai
- **GitHub 仓库**: https://github.com/Fission-AI/OpenSpec
- **示例项目**: https://github.com/Fission-AI/OpenSpec-Examples
- **问题反馈**: https://github.com/Fission-AI/OpenSpec/issues
- **社区讨论**: https://discord.gg/fission-ai