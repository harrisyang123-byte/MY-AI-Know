# Claude Code 配置指南

## 配置状态：✅ 已完成

当前配置：DeepSeek（直接模式）

## 使用方法

### 直接运行 Claude Code
```powershell
claude
```

### 切换模型

**切换到 MiniMax**
```powershell
Copy-Item .claude\settings-minimax.json .claude\settings.json -Force
claude
```

**切换到 DeepSeek Chat**
```powershell
Copy-Item .claude\settings-deepseek-chat.json .claude\settings.json -Force
claude
```

**切换到 DeepSeek Reasoner**
```powershell
Copy-Item .claude\settings-deepseek-reasoner.json .claude\settings.json -Force
claude
```

**切换到 DeepSeek V4 Flash**
```powershell
Copy-Item .claude\settings-deepseek-v4-flash.json .claude\settings.json -Force
claude
```

**切换到 DeepSeek V4 Pro**
```powershell
Copy-Item .claude\settings-deepseek-v4-pro.json .claude\settings.json -Force
claude
```

## 配置文件列表

| 配置文件 | API | 说明 |
|----------|-----|------|
| `.claude/settings.json` | 当前使用 | 现在是 DeepSeek |
| `.claude/settings-minimax.json` | MiniMax | MiniMax M2.7 |
| `.claude/settings-deepseek.json` | DeepSeek | DeepSeek通用配置 |
| `.claude/settings-deepseek-chat.json` | DeepSeek | DeepSeek Chat |
| `.claude/settings-deepseek-reasoner.json` | DeepSeek | DeepSeek Reasoner |
| `.claude/settings-deepseek-v4-flash.json` | DeepSeek | DeepSeek V4 Flash (新) |
| `.claude/settings-deepseek-v4-pro.json` | DeepSeek | DeepSeek V4 Pro (新) |

## 判断当前模型

**方法1：看配置文件**
```powershell
cat .claude\settings.json
```
看 `ANTHROPIC_BASE_URL` 和 `ANTHROPIC_MODEL`：
- `https://api.minimaxi.com/anthropic` → MiniMax
- `https://api.deepseek.com/v1` → DeepSeek
  - `ANTHROPIC_MODEL: deepseek-v4-flash` → DeepSeek V4 Flash
  - `ANTHROPIC_MODEL: deepseek-v4-pro` → DeepSeek V4 Pro
  - 没有 `ANTHROPIC_MODEL` → DeepSeek Chat/Reasoner

**方法2：直接问它**
```
你是什么模型？
```

## 配置详情

- ✅ API Key 已配置
- ✅ 无需代理
- ✅ 六个配置文件，手动切换即可
- ⚠️ 注意：DeepSeek 的配置中，V4 Flash 和 V4 Pro 已在配置文件中明确指定模型名
- 🆕 DeepSeek V4 Flash: 快速响应，适合日常任务
- 🆕 DeepSeek V4 Pro: 高性能，适合复杂任务
