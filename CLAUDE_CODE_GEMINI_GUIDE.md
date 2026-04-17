# Claude Code + Gemini API 使用指南

## 架构

```
Claude Code CLI → LiteLLM (127.0.0.1:4000) → Google Gemini API
```

## 每次使用步骤

### 1. 启动 LiteLLM（必须先启动）

```bash
litellm --config litellm-config.yaml --port 4000
```

看到 `Uvicorn running on http://0.0.0.0:4000` 即为成功。**保持此窗口不关。**

### 2. 启动 Claude Code（新开一个终端）

```powershell
$env:ANTHROPIC_BASE_URL='http://127.0.0.1:4000'; $env:ANTHROPIC_API_KEY='AQ.Ab8RN6Kl0Mn3AfFTvnB6cAjBtepbauTAbYvp_MIC2t358TO86Q'; claude
```

看到 `Welcome back!` 即为成功，现在可以正常对话。

## 可用模型

| 命令 | 模型 | 价格 (每百万token) | 用途 |
|------|------|-------------------|------|
| `/model gemini-3-flash` | Gemini 3 Flash ⭐默认 | $0.50 / $3 | 日常首选 |
| `/model gemini-3-pro` | Gemini 3.1 Pro | $2 / $12 | 复杂推理 |
| `/model gemini-3-flash-lite` | Gemini 3.1 Flash-Lite | **$0.25 / $1.50** | 最省钱 |
| `/model gemini-3-flash-image` | Gemini 3.1 Flash Image | $0.25/图片 | 图片生成(高效) |
| `/model gemini-3-pro-image` | Gemini 3 Pro Image | $2/图片 | 高质量图片 |

在 Claude Code 的 `>` 提示符下输入 `/model` 即可切换。

## 文件说明

| 文件 | 作用 |
|------|------|
| `litellm-config.yaml` | LiteLLM 模型配置（5个Gemini 3模型） |
| `models.yaml` | ccmr 模型路由配置 |
| `.env` | API Key 存储 |

## 常用快捷键

- Enter — 发送消息
- Shift+Enter — 换行不发送
- `/exit` 或 Ctrl+C — 退出
- `?` — 查看所有快捷键

## 注意事项

- LiteLLM 必须保持运行，Claude Code 才能正常工作
- 如果 LiteLLM 窗口关闭了，重新执行步骤1即可
- 所有模型均为 Preview 阶段，API 可能变动
