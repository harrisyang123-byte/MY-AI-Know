#!/bin/bash

# OpenSpec 安装脚本
# 用法: /openspec:install 或 bash scripts/install.sh

set -e

echo "🚀 OpenSpec 安装开始..."
echo "================================"

# 检查 Node.js 版本
echo "1. 检查 Node.js 版本..."
NODE_VERSION=$(node --version 2>/dev/null | cut -d'v' -f2 || echo "0")
if [ -z "$NODE_VERSION" ]; then
    echo "❌ Node.js 未安装"
    echo "请先安装 Node.js ≥ 20.19.0"
    echo "下载地址: https://nodejs.org/"
    exit 1
fi

# 解析版本号
NODE_MAJOR=$(echo "$NODE_VERSION" | cut -d'.' -f1)
if [ "$NODE_MAJOR" -lt 20 ]; then
    echo "❌ Node.js 版本过低: $NODE_VERSION"
    echo "需要 Node.js ≥ 20.19.0"
    echo "请使用 nvm 升级:"
    echo "  nvm install 20"
    echo "  nvm use 20"
    exit 1
fi

echo "✅ Node.js 版本: $NODE_VERSION"

# 检查是否在 git 项目中
if [ ! -d ".git" ]; then
    echo "⚠️  当前目录不是 git 项目根目录"
    echo "建议在 git 项目中初始化 OpenSpec"
    read -p "是否继续? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 安装全局包
echo "2. 安装 @fission-ai/openspec..."
if command -v openspec &>/dev/null; then
    CURRENT_VERSION=$(openspec --version 2>/dev/null || echo "unknown")
    echo "✅ OpenSpec 已安装: $CURRENT_VERSION"

    read -p "是否重新安装? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "重新安装 OpenSpec..."
        npm install -g @fission-ai/openspec@latest
    fi
else
    echo "正在安装 OpenSpec..."
    npm install -g @fission-ai/openspec@latest
fi

# 验证安装
if command -v openspec &>/dev/null; then
    OPENSPEC_VERSION=$(openspec --version)
    echo "✅ OpenSpec 安装成功: $OPENSPEC_VERSION"
else
    echo "❌ OpenSpec 安装失败"
    echo "请手动运行: npm install -g @fission-ai/openspec@latest"
    exit 1
fi

# 初始化配置
echo "3. 初始化 OpenSpec 配置..."
if [ -f "openspec.config.json" ] || [ -d "openspec" ] || [ -d ".claude/commands/openspec" ]; then
    echo "⚠️  OpenSpec 配置已存在"

    echo "当前结构:"
    ls -la openspec.config.json 2>/dev/null || echo "  openspec.config.json: 不存在"
    ls -la openspec/ 2>/dev/null || echo "  openspec/: 不存在"
    ls -la .claude/commands/openspec/ 2>/dev/null || echo "  .claude/commands/openspec/: 不存在"

    echo ""
    echo "选项:"
    echo "  1) 保留现有配置"
    echo "  2) 重新初始化 (会覆盖现有配置)"
    echo "  3) 跳过初始化"

    read -p "请选择 (1/2/3): " -n 1 -r
    echo

    case $REPLY in
        1)
            echo "✅ 保留现有配置"
            ;;
        2)
            echo "正在重新初始化..."
            openspec init --force
            ;;
        3)
            echo "跳过初始化"
            ;;
        *)
            echo "无效选择，跳过初始化"
            ;;
    esac
else
    echo "正在初始化 OpenSpec..."
    openspec init

    echo "✅ OpenSpec 配置初始化完成"
fi

# 验证配置
echo "4. 验证配置..."
if [ -f "openspec.config.json" ]; then
    echo "✅ openspec.config.json 存在"
else
    echo "⚠️  openspec.config.json 不存在，但可能使用默认配置"
fi

if [ -d "openspec" ]; then
    echo "✅ openspec/ 目录存在"
    echo "  内容:"
    ls -la openspec/
else
    echo "❌ openspec/ 目录不存在，请手动运行: openspec init"
fi

if [ -d ".claude/commands/openspec" ]; then
    echo "✅ .claude/commands/openspec/ 目录存在"
else
    echo "⚠️  .claude/commands/openspec/ 不存在"
    echo "Claude Code 命令可能无法直接使用，但 openspec CLI 仍可用"
fi

echo ""
echo "================================"
echo "🎉 OpenSpec 安装完成!"
echo ""
echo "下一步:"
echo "1. 在 Claude Code 中测试命令:"
echo "   /openspec:status"
echo ""
echo "2. 创建第一个提案:"
echo "   /openspec:proposal \"添加示例功能\""
echo ""
echo "3. 查看帮助:"
echo "   /openspec  # 显示所有可用命令"
echo ""
echo "官方文档: https://openspec.fission.ai"
echo "问题反馈: https://github.com/Fission-AI/OpenSpec/issues"