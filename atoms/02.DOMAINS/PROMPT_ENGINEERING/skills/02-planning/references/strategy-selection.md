# Skill 2.2: 策略选择与工具匹配

## 策略决策树

```
这是什么类型的任务？
├─ 图像生成
│   └─ 全新生成还是编辑？
│       ├─ 全新生成 → 需要文字渲染？→ nano_banana_2
│       │                多参考图精确控制？→ gpt_image_2
│       │                强烈艺术化？→ midjourney
│       │                简单清晰？→ nano_banana_pro
│       └─ 编辑现有图 → 调整尺寸？→ reframe_image
│                        提升分辨率？→ upscale_image
│                        修改内容？→ gpt_image_2 / nano_banana_2
│                        风格转换？→ gpt_image_2 (reference)
├─ 视频生成 → 委托 video_sub_agent
├─ 3D模型 → 委托 three_d_sub_agent
└─ 其他 → 使用对应专用工具
```

## 工具特性对照表

| 工具 | 最强项 | 次强项 | 弱项 |
|------|--------|--------|------|
| gpt_image_2 | 复杂指令理解 | 多参考图处理 | 极度风格化 |
| nano_banana_2 | 文字渲染 | 参考图生成 | 抽象艺术 |
| nano_banana_pro | 简单快速 | 清晰指令 | 复杂场景 |
| midjourney | 艺术化氛围 | 视觉冲击 | 精确控制/文字 |

### 任务-工具匹配速查

| 任务特征 | 推荐工具 |
|----------|----------|
| 复杂场景 + 多参考图 + 精确控制 | gpt_image_2 |
| 文字渲染 + 设计类 | nano_banana_2 |
| 简单清晰 + 快速生成 | nano_banana_pro |
| 艺术化 + 氛围感 + 风格化 | midjourney |
| 批量生成 + 多角度 | image_sub_agent |
| 图像编辑 + 尺寸调整 | reframe_image / upscale_image |

## 四种策略组合模式

### 模式1：渐进式生成（复杂项目）

```
阶段1: 概念探索 → midjourney → 3-5个概念图 → 用户选择方向
阶段2: 精细化 → gpt_image_2 → 高质量主图 → 用户确认细节
阶段3: 衍生变体 → image_sub_agent → 系列图像 → 最终交付
```

### 模式2：参考驱动生成（有明确参考）

```
步骤1: 分析参考 → analyse_image → 提取风格/布局/元素/光线
步骤2: 搜索补充 → search_image（如需要）
步骤3: 生成 → gpt_image_2（多参考图）→ 明确每张参考图的作用
步骤4: 迭代修正 → 同上 EDIT 模式 → 基于反馈精确修改
```

### 模式3：搜索增强生成（需要真实参考）

```
步骤1: 理解需求 → 识别需要搜索的关键概念
步骤2: 并行搜索 → search_image（每个概念单独搜索）
步骤3: 参考整合 → 分析搜索结果，提取可用元素
步骤4: 生成 → 根据复杂度选择工具 → 融合搜索到的元素
```

### 模式4：分治法（超复杂任务）

```
任务1: 生成背景（无人物）
任务2: 生成角色立绘
任务3: 使用 FUSION_MULTI_IMAGES 融合
```

适用：一次生成多次失败时；用户对某些元素有极高要求时

## 参数配置策略

### gpt_image_2 参数策略

| 场景 | quality | size | 适用 |
|------|---------|------|------|
| 高质量最终交付 | high | 根据用途 | 项目最终版本 |
| 快速迭代探索 | low | 1024x1024 | 方向探索，多方案对比 |
| 精确编辑 | high | 匹配原图 | 局部修改，元素替换 |
| 风格融合 | medium | 根据用途 | 创造新视觉风格 |

### nano_banana_2 参数策略

| 场景 | task_type | resolution | aspect_ratio |
|------|-----------|------------|--------------|
| 参考图驱动 | REFERENCE_TO_IMAGE | 1K | 匹配主参考图 |
| 精确编辑 | EDIT_SINGLE_IMAGE | 匹配原图 | **必须匹配原图** |
| 文字设计 | TEXT_TO_IMAGE | 2K | 根据用途 |
| 多图融合 | FUSION_MULTI_IMAGES | 1K | 根据用途 |

### midjourney 提示词风格

- ✓ 简短关键词式："ancient Chinese naval office, candlelight, mysterious atmosphere, cinematic lighting"
- ✗ 长句精确指令："Camera on west wall shooting due east, the desk is 1.5 meters from the east window..."
