---
name: "claude-launcher"
description: "启动和管理Claude Code多模型环境，包括LiteLLM代理服务和Claude Code客户端。在需要启动Claude环境或解决Claude相关问题时调用此技能。"
---

# Claude启动器技能

本技能提供完整的Claude Code多模型环境启动和管理功能，支持Gemini、DeepSeek等多种模型。

## 什么时候调用此技能

- 需要启动Claude Code环境时
- 需要切换AI模型时
- Claude Code出现连接或配置问题时
- 需要了解当前可用的模型列表时
- 需要故障排除和修复Claude环境时

## 🚀 快速启动命令

### 一键启动完整环境
```bash
# 终端1：启动LiteLLM服务
litellm --config litellm-config.yaml --port 4000

# 终端2：启动Claude Code（新开终端）
$env:ANTHROPIC_BASE_URL='http://127.0.0.1:4000'
$env:ANTHROPIC_API_KEY='YOUR_API_KEY_HERE'
claude
```

### 验证启动成功
- **LiteLLM服务**：看到 `Uvicorn running on http://0.0.0.0:4000`
- **Claude Code**：看到欢迎界面和 `❯` 提示符

## 🔧 可用模型列表

### Gemini系列（Google AI）
- `/model gemini-3-flash` - 默认模型，速度快
- `/model gemini-3-pro` - 复杂推理，能力强
- `/model gemini-3-flash-lite` - 最省钱选项
- `/model gemini-3-flash-image` - 图片生成
- `/model gemini-3-pro-image` - 高质量图片

### DeepSeek系列（推荐使用）
- `/model deepseek-chat` - 通用对话，免费
- `/model deepseek-reasoner` - 深度推理，逻辑能力强，**强烈推荐**

### 其他模型
- `/model qwen-turbo` - 阿里通义千问
- `/model qwen-plus` - 通义千问增强版

## 🛠️ 故障排除指南

### 常见问题快速修复

#### 1. LiteLLM启动失败
```bash
# 检查端口占用
netstat -ano | findstr :4000

# 更换端口启动
litellm --config litellm-config.yaml --port 4001
```

#### 2. Claude Code连接失败
- 确认LiteLLM服务正在运行
- 检查环境变量设置：`echo $env:ANTHROPIC_BASE_URL`
- 验证防火墙设置

#### 3. 模型切换失败
- 检查 `litellm-config.yaml` 模型配置
- 验证API密钥有效性
- 查看LiteLLM日志获取详细错误

#### 4. API认证错误
- 检查 `.env` 文件中的API密钥格式
- 验证密钥是否在对应平台有效
- 检查配额和使用限制

### 配置文件位置
- **主配置**：`d:\AI-atom\litellm-config.yaml`
- **API密钥**：`d:\AI-atom\.env`
- **使用指南**：`d:\AI-atom\CLAUDE_CODE_GEMINI_GUIDE.md`

## 📋 系统架构理解

```
用户 → Claude Code CLI → LiteLLM代理(4000端口) → 多模型API
```

**关键组件：**
1. **LiteLLM代理**：统一的多模型接口，处理认证和路由
2. **Claude Code**：用户交互界面，通过环境变量连接到代理
3. **模型API**：实际的AI服务提供商（Gemini/DeepSeek等）

## 🔄 模型切换操作

### 在Claude Code中操作
```bash
# 查看当前模型
/model

# 切换到DeepSeek推理器（推荐）
/model deepseek-reasoner

# 切换回Gemini默认模型
/model gemini-3-flash

# 查看所有可用模型
/models
```

### 模型选择建议
- **日常使用**：`deepseek-chat` 或 `gemini-3-flash`
- **复杂推理**：`deepseek-reasoner`（免费且强大）
- **成本敏感**：`gemini-3-flash-lite` 或 `deepseek-chat`

## ⚡ 常用操作命令

### 环境检查
```bash
# 检查LiteLLM服务状态
curl http://127.0.0.1:4000/health

# 检查环境变量
echo $env:ANTHROPIC_BASE_URL
echo $env:ANTHROPIC_API_KEY
```

### 日志查看
```bash
# 启用详细日志
$env:LITELLM_LOG='DEBUG'
claude
```

### 快速重启
```bash
# 停止现有服务（Ctrl+C）
# 重新执行启动命令
```

## 🔒 安全注意事项

1. **API密钥保护**
   - 不要提交 `.env` 文件到版本控制
   - 定期轮换API密钥
   - 设置使用限额

2. **服务安全**
   - 服务默认只在本地运行
   - 不要暴露到公网
   - 定期更新软件版本

## 📞 技术支持资源

### 官方文档
- [LiteLLM文档](https://docs.litellm.ai/)
- [Claude Code文档](https://docs.anthropic.com/claude-code)
- [DeepSeek API文档](https://platform.deepseek.com/api-docs/)

### 本地文档
- **完整指南**：`d:\AI-atom\CLAUDE_CODE_GEMINI_GUIDE.md`
- **配置文件**：`d:\AI-atom\litellm-config.yaml`
- **API密钥**：`d:\AI-atom\.env`

## 🎯 技能使用示例

### 场景1：启动Claude环境
```
用户：帮我启动Claude
技能：启动LiteLLM服务，然后启动Claude Code客户端
```

### 场景2：切换模型
```
用户：我想用DeepSeek模型
技能：指导用户在Claude Code中输入 `/model deepseek-reasoner`
```

### 场景3：故障排除
```
用户：Claude连接失败了
技能：检查LiteLLM服务状态，验证环境变量，提供修复方案
```

## 💡 最佳实践

1. **启动顺序**：先启动LiteLLM，再启动Claude Code
2. **模型选择**：根据任务复杂度选择合适的模型
3. **成本控制**：优先使用免费模型（DeepSeek）
4. **问题诊断**：从LiteLLM日志开始排查问题
5. **版本更新**：定期检查软件更新