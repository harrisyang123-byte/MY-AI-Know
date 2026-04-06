# 个人最佳实践

这是你自己测试积累的知识库。每次发现好的效果，在这里记录。

## 格式

每条记录包含：
- 镜头类型
- 有效的提示词片段
- 为什么有效
- 避免的写法

---

## 压制烟雾/粒子效果

- 镜头类型：室内烛光场景
- 问题：Seedance 在烛光环境下默认添加烟雾粒子、大气粒子效果
- 有效压制片段：`no smoke, no fog, no particles, no atmospheric effects, clean air`
- 为什么有效：明确列出所有粒子类型，比单独写 `no smoke` 更彻底
- 避免的写法：只写 `no smoke`（不够，仍会出现雾气）；提到 `candlelight flickers`（容易触发烟雾联想）
