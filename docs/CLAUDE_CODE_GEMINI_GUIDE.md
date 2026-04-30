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

## 配置文件列表

| 配置文件 | API | 说明 |
|----------|-----|------|
| `.claude/settings.json` | 当前使用 | 现在是 DeepSeek |
| `.claude/settings-minimax.json` | MiniMax | MiniMax M2.7 |
| `.claude/settings-deepseek-chat.json` | DeepSeek | DeepSeek Chat |
| `.claude/settings-deepseek-reasoner.json` | DeepSeek | DeepSeek Reasoner |

## 判断当前模型

**方法1：看配置文件**
```powershell
cat .claude\settings.json
```
看 `ANTHROPIC_BASE_URL`：
- `https://api.minimaxi.com/anthropic` → MiniMax
- `https://api.deepseek.com/v1` → DeepSeek

**方法2：直接问它**
```
你是什么模型？
```

## 配置详情

- ✅ API Key 已配置
- ✅ 无需代理
- ✅ 三个配置文件，手动切换即可
- ⚠️ 注意：DeepSeek 的两个配置用的是同一个 API，实际模型在 Claude Code 中用 `/model` 命令切换（如果用代理的话）
