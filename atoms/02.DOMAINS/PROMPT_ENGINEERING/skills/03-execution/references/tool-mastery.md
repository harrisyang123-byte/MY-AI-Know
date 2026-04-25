# Skill 3.2: 工具精通与参数调优

## gpt_image_2 深度解析

### 核心优势

1. **多参考图支持**
   - base_image_url：编辑基础图像
   - reference_image_urls：风格/元素参考

   | 场景 | 配置 |
   |------|------|
   | 编辑现有图像 | base_image_url = 要编辑的图，prompt = "change X to Y, keep everything else" |
   | 参考多张图生成新图 | reference_image_urls = [图1, 图2, 图3]，prompt = "combine the style of first, the layout of second..." |
   | 基于一张图生成变体 | base_image_url = 原图，prompt = "same scene, but from a different angle" |

2. **质量控制**
   - high：最终交付物，商业使用
   - medium（默认）：大多数情况
   - low：快速草图，概念验证
   - auto：让模型自己决定

3. **尺寸灵活性**
   - 格式："宽x高"（如 "2048x2048"）
   - 限制：宽高必须是 16 的倍数，最长边 < 3840，比例 ≤ 3:1

   | 用途 | 比例 | 尺寸 |
   |------|------|------|
   | 社交媒体/头像 | 1:1 | 2048x2048 |
   | 横屏/演示 | 16:9 | 2560x1440 |
   | 竖屏/手机 | 9:16 | 1440x2560 |
   | 电影感 | 21:9 | 2560x1088 |
   | 摄影 | 3:2 | 2400x1600 |

### 参数组合策略

| 策略 | quality | size | 适用 |
|------|---------|------|------|
| 高质量最终交付 | high | 根据用途 | 项目最终版本 |
| 快速迭代 | medium/low | 1024x1024 | 探索阶段 |
| 精确编辑 | high | 匹配原图 | 局部修改 |
| 风格融合 | medium | 根据用途 | 新视觉风格 |

## nano_banana_2 深度解析

### 核心优势

1. **多分辨率支持**：512（快速预览）/ 1K（标准）/ 2K（高质量）/ 4K（超高质量）
2. **任务类型明确**
3. **文字渲染能力**（独特优势）
4. **比例支持**：8:1 到 1:8 全覆盖

### 任务类型详解

| task_type | 适用场景 | 关键配置 |
|-----------|----------|----------|
| TEXT_TO_IMAGE | 没有参考图，纯文本生成 | prompt 要非常详细 |
| REFERENCE_TO_IMAGE | 有参考图 | prompt 中说明每张图的作用 |
| EDIT_SINGLE_IMAGE | 修改现有图像 | aspect_ratio **必须匹配原图** |
| FUSION_MULTI_IMAGES | 合并多张图元素 | prompt: "combine X from first, Y from second" |

### 文字渲染技巧

```
- 明确文字内容: 'text says "XXX"'
- 说明字体风格: "bold sans-serif font"
- 说明文字位置: "centered at top"
- 说明文字颜色: "white text on dark background"
- 分辨率用 2K 保证文字清晰
```

## midjourney 深度解析

### 核心特点

- 自动优化构图、增强氛围、提升质感
- 代价：精确控制能力下降，可能偏离原始意图

### 提示词风格对比

| ✓ 好（关键词式） | ✗ 差（精确指令式） |
|---|---|
| "ancient Chinese naval office, candlelight, mysterious atmosphere, cinematic lighting, dark blue tones" | "Camera on west wall shooting due east, the desk is 1.5 meters from the east window..." |

### 特殊功能

- **sref**：风格参考，保持系列图像风格一致
- **niji7**：动漫/东方美学模式，is_anime_or_oriental_aesthetic_style: true

## 工具组合策略

| 需求 | 组合方案 |
|------|----------|
| 艺术感 + 精确控制 | Midjourney(艺术) → gpt_image_2(精确编辑) |
| 文字 + 风格化 | nano_banana_2(文字) + 风格参考图 |
| 快速草图 + 高清输出 | nano_banana_pro(快速) → upscale_image(高清) |
| 改变比例 + 保持质量 | reframe_image(比例) + 可能需要 upscale |

## 工具选择决策树（执行阶段）

```
任务到手 → 用户指定工具？
├─ 是 → 使用指定工具
└─ 否 → 需要渲染文字？
    ├─ 是 → nano_banana_2
    └─ 否 → 多参考图需要精确遵循？
        ├─ 是 → gpt_image_2
        └─ 否 → 需要强烈艺术化/氛围感？
            ├─ 是 → midjourney
            └─ 否 → 需要编辑现有图像？
                ├─ 是 → gpt_image_2 或 nano_banana_2
                └─ 否 → 任务复杂度？
                    ├─ 高 → gpt_image_2
                    ├─ 中 → nano_banana_2
                    └─ 低 → nano_banana_pro
```
