# Skill 1: Prompt Engineering (提示词工程)

## 核心原理

### 什么是 Prompt Engineering？

把人类的自然语言需求，转化成AI模型能精确理解和执行的指令。

**本质**：这是一种"翻译"能力
- 输入：用户的模糊描述
- 输出：结构化的精确指令

### 为什么重要？

同样的需求，不同的提示词，结果天差地别！

- 差的提示词："一个办公室" → 生成：现代办公室，玻璃幕墙，电脑...
- 好的提示词："Qing Dynasty office, 8x6m, wooden furniture, candlelight..." → 生成：清代办公室，准确的历史细节

---

## 底层思维模型

### 关键认知1：AI不是"理解"语义，是"匹配"模式

AI的工作方式：
1. 把提示词分解成"概念"
2. 在训练数据中找到相似的"模式"
3. 组合这些模式生成图像

关键点：
- 概念越具体，匹配越精确
- 概念越常见，生成越准确
- 概念之间的关系要清晰

### 关键认知2：提示词有"权重"

**位置权重**：前面的词 > 后面的词，开头描述最重要

- "Qing Dynasty office interior, modern computer" → AI会生成：清代办公室 + 现代电脑（矛盾！）
- "Modern office interior, Qing Dynasty style" → AI会生成：现代办公室，带点清代元素

**重复权重**：重复的概念会被强化

- "candlelight, warm candlelight, soft candle glow" → 烛光效果会非常明显

**详细度权重**：描述越详细，权重越高

- "chair" → 普通椅子
- "Qing Dynasty guanmao chair, dark wood, traditional official furniture" → 精确的清代官帽椅

### 关键认知3：结构化 > 堆砌

不好的提示词（堆砌）：
```
"清代办公室,有门有窗有桌子有椅子有人,光线是烛光和月光,要真实,要有氛围,要像电影一样,要有细节,要准确..."
```
问题：信息混乱，AI不知道重点，容易遗漏关键信息

好的提示词（结构化）：
```
【场景定义】Qing Dynasty office interior
【空间】8x6m room, 3.5m ceiling
【元素】door, desk, chair, character
【光线】2800K candlelight + 6000K moonlight
【风格】hyperrealistic, cinematic
```
优势：层次清晰，重点明确，不会遗漏

### 关键认知4：具体 > 抽象

| 抽象词汇 | 问题 | 具体词汇 | 优势 |
|---------|------|---------|------|
| "大房间" | AI不知道多大 | "8x6 meters room" | 精确尺寸 |
| "暖光" | AI不知道多暖 | "2800K warm light" | 精确色温 |
| "古代" | AI不知道哪个朝代 | "Qing Dynasty (1644-1912)" | 精确时代 |

规则：能用数字的就用数字，能用专有名词的就用专有名词，能用技术术语的就用技术术语

### 关键认知5：英文 > 中文（对大多数模型）

大多数图像生成模型的训练数据是英文标注的，英文提示词的匹配精度 > 中文

但是：
- 不要机械翻译
- 要用AI训练数据中常见的英文表达
- 中文："清代官帽椅" → 英文："Qing Dynasty guanmao chair, traditional official furniture style"

---

## 7层提示词架构

### 第1层：场景定义 (Scene Definition)

**作用**：告诉AI"这是什么"

**必须包含**：
- 场景类型 (interior/exterior, office/bedroom...)
- 时代/风格 (Qing Dynasty, modern, medieval...)
- 地点（如果重要）

**位置**：永远放在最前面！（权重最高）

**示例**：
- "Qing Dynasty naval office interior"
- "Modern minimalist bedroom"
- "Medieval European castle exterior"

### 第2层：视角定义 (Viewpoint)

**作用**：告诉AI"从哪里看"

**必须包含**：
- 相机位置 (from west, from above...)
- 相机朝向 (facing east, looking down...)
- 视角类型 (eye-level, bird's eye, low angle...)

**铁律**：用绝对空间方向（EAST/WEST/NORTH/SOUTH），不用left/right

**示例**：
- "west-to-east viewpoint, eye-level view"
- "bird's eye view, looking down"
- "low angle shot, looking up at the building"

**重要性**：视角决定了整个画面的构图！

### 第3层：空间布局 (Spatial Layout)

**作用**：告诉AI"空间有多大，怎么布局"

**必须包含**：
- 房间尺寸（具体数字！）
- 层高（如果重要）
- 主要区域划分

**关键**：一定要有具体数字！"大房间"、"小空间"这种词没用！

**示例**：
- "Room dimensions: 8 meters deep x 6 meters wide, ceiling height 3.5 meters"
- "Open-plan space, 15x10 meters"
- "Narrow corridor, 2 meters wide, 10 meters long"

### 第4层：元素描述 (Elements Description)

**作用**：告诉AI"有什么东西，在哪里"

**每个元素必须包含**：
- 名称 (door, desk, chair...)
- 位置 (on east wall, center of room...)
- 尺寸 (1.2m wide, 2m long...)
- 材质 (wooden, metal, fabric...)
- 样式 (traditional, modern, ornate...)
- 状态 (open, closed, worn...)

**结构**：元素名: 位置, 尺寸, 材质, 样式, 状态

**示例**：
```
Wooden door: positioned on east wall, centered,
1.2 meters wide, opens outward,
dark red lacquered wood construction,
traditional Chinese double-door style,
brass door handles with dragon motifs,
slightly weathered appearance.
```

**重要性**：这是提示词的"主体内容"！描述越详细，生成越准确！

**叙事核心道具**：加 `treated as a precious object`

### 第5层：人物描述 (Character Description)

**作用**：告诉AI"有什么人，长什么样，在做什么"

**必须包含**：
- 基本信息 (age, gender, ethnicity...)
- 位置和姿态 (seated, standing, position...)
- 服饰 (clothing style, period-accurate...)
- 表情和动作 (facial expression, gesture...)
- 特征 (distinctive features...)

**人物描述策略**：
- 第一次出现：完整外貌描述（年龄性别 + 位置姿态 + 服饰 + 表情动作 + 特征）
- 已出现有参考图：只写姿态和情绪

**示例**：
```
Character Zhang Shisan:
Middle-aged Chinese man, approximately 45 years old,
seated in the guanmao chair behind the desk,
facing toward the east door,
wearing traditional Qing Dynasty official attire
(dark blue silk robe with rank badge on chest,
black official hat),
composed and dignified expression,
slight furrow in brow suggesting concentration,
hands resting naturally on the desk surface,
right hand near a document,
slight forward lean suggesting attentiveness,
well-groomed appearance befitting a naval official.
```

**关键**：人物是最难生成准确的！必须非常详细！

### 第6层：光线设置 (Lighting Setup)

**作用**：告诉AI"光从哪来，什么颜色，多强"

**每个光源必须包含**：
- 光源类型 (candlelight, sunlight, moonlight...)
- 色温 (2800K, 5500K, 6000K...)
- 位置 (on desk, from window, overhead...)
- 强度 (main light, fill light, accent...)
- 效果 (creates glow, casts shadows...)

**多光源规则**：
- 多光源时量化比例（如"烛火95%，月光5%"）
- 单一光源必须明确声明

**色温参考**：
| 光源 | 色温 |
|------|------|
| 烛光 | 2800K |
| 钨丝灯 | 3200K |
| 日落 | 3500K |
| 日光 | 5500K |
| 阴天 | 6500K |
| 月光 | 6000K |

**示例**：
```
Lighting setup:
- Primary light source: Candlelight,
  warm 2800K color temperature,
  positioned on the desk surface,
  main illumination for the scene (95% of total light),
  creates soft amber glow,
  illuminates Zhang Shisan's face and upper body,
  casts gentle shadows on walls and furniture,
  creates warm highlights on wooden surfaces.

- Secondary light source: Moonlight and snow reflection,
  cool 6000K color temperature,
  entering through window on south wall,
  subtle fill light (5% of total light),
  creates blue-tinted highlights on edges,
  enhances depth and atmospheric contrast,
  provides rim lighting on character's profile.
```

**重要性**：光线决定氛围！是最容易被忽视，但最重要的部分！

### 第7层：风格和技术要求 (Style & Technical)

**作用**：告诉AI"整体风格是什么，技术标准是什么"

**必须包含**：
- 整体氛围 (solemn, cheerful, mysterious...)
- 艺术风格 (hyperrealistic, painterly, stylized...)
- 参考作品 (in the style of..., inspired by...)
- 技术要求 (photorealistic, accurate details...)

**位置**：放在最后，作为"总结性指令"

**示例**：
```
Atmosphere and style:
Solemn and quiet atmosphere, late night setting,
sense of historical weight and official dignity.

Visual style: Hyperrealistic environment,
cinematic lighting with dramatic contrast,
in the style of 'Chang'an 30000 Miles' background art,
Lights Animation Studio aesthetic,
photorealistic rendering.

Technical requirements:
Accurate Qing Dynasty period details,
precise spatial relationships,
dramatic low-light photography,
depth and atmospheric perspective,
high attention to historical accuracy.
```

---

## 不同场景类型策略

### 历史场景

- 时代特征准确，建筑家具符合历史
- 光源符合时代（古代没有电灯！）
- 材质和工艺真实
- 参考历史画作或影视作品
- 负向提示词：现代家具、电灯、玻璃窗、水泥墙

### 产品摄影

- 产品放最前面（权重最高）
- 专业光线（三点布光）
- 简洁背景
- 材质质感真实
- 强调产品细节

### 角色设计

- 外貌特征详细（面部+发型+体型）
- 服饰完整描述
- 姿态和表情明确
- 性格特征体现
- 多角度参考

### 室内场景

- 空间尺寸明确
- 家具布局合理
- 光线真实
- 氛围到位
- 材质描述详细

### 社交媒体

- 视觉冲击力强
- 主题明确
- 文字清晰
- 尺寸适配平台
- 风格统一

---

## 完整提示词模板

```
【第1层: 场景定义】
{Dynasty/Period} {Scene Type} interior/exterior,
{Specific Location if relevant}

【第2层: 视角定义】
{Direction}-to-{Direction} viewpoint,
{Angle Type} view

【第3层: 空间布局】
Room dimensions: {Length} meters x {Width} meters,
ceiling height {Height} meters.
{Additional spatial information}

【第4层: 元素描述】
{Element Name}:
positioned {Location},
{Size} meters/wide/tall,
{Material} construction,
{Style} style,
{Additional details}.

【第5层: 人物描述】
Character {Name}:
{Age} {Gender} {Ethnicity},
{Position and Posture},
wearing {Clothing Description},
{Facial Expression},
{Gesture/Action},
{Distinctive Features}.

【第6层: 光线设置】
Lighting setup:
- Primary light source: {Type},
  {Color Temperature}K color temperature,
  positioned {Location},
  {Intensity Description},
  creates {Effect},
  {Shadow Description}.
- Secondary light source: {Type},
  {Color Temperature}K color temperature,
  {Location},
  {Intensity Description},
  creates {Effect}.

【第7层: 风格和技术要求】
Atmosphere and style:
{Mood Description},
{Time of Day},
{Emotional Tone}.

Visual style:
{Realism Level},
{Lighting Style},
in the style of {Reference},
{Additional Style Notes}.

Technical requirements:
{Historical Accuracy},
{Spatial Precision},
{Rendering Quality},
{Detail Level}.
```

---

## 高级技巧

### 技巧1：负向提示词管理

从历史错误中提炼负向提示词：

```
常见错误 → 对应负向提示词
门窗纸发光 → "door paper glowing, window paper glowing"
现代元素混入 → "modern furniture, electric lights, glass windows"
光线过亮 → "bright, overexposed, harsh lighting"
```

### 技巧2：权重强化

通过重复和详细描述强化关键概念：

```
普通: "candlelight"
强化: "candlelight, warm amber candle glow, soft flickering flame light"
```

### 技巧3：矛盾解决

当用户需求有矛盾时，在提示词中明确优先级：

```
用户: "明亮但低调"
解决: "overall low-key atmosphere with focused bright area on desk surface,
       dramatic chiaroscuro lighting,
       80% of scene in shadow, 20% illuminated"
```

### 技巧4：参考图策略

- 第一张图确立视觉基准
- 后续图以此为参考
- 链式参考保持连贯性

### 技巧5：多工具适配

不同工具的提示词风格不同：

| 工具 | 提示词风格 |
|------|-----------|
| gpt_image_2 | 详细、结构化、7层架构 |
| midjourney | 短而简单、描述性词汇 |
| nano_banana_pro | 用户原话、不添加修改 |

### 技巧6：叙事核心道具标记

当某个元素是叙事核心时，加 `treated as a precious object` 强化其存在感：

```
普通: "A letter on the desk"
强化: "A letter on the desk, treated as a precious object"
```

### 技巧7：人物描述策略

- **第一次出现**：完整外貌描述（年龄性别 + 位置姿态 + 服饰 + 表情动作 + 特征）
- **已出现有参考图**：只写姿态和情绪，不重复外貌
- **多人物**：每个人物单独一段，明确相互位置关系

---

## 贯穿案例：清代海军衙门办公室完整7层提示词

以下展示如何将7层架构应用于一个完整的场景，从需求到最终提示词：

**用户需求**："生成一个清代海军官员的办公室，西向东拍，房间8m x 6m，深夜，有烛光，像长安三万里那种感觉"

### 第1层：场景定义

```
Qing Dynasty naval office interior, located in a coastal fortress
```

### 第2层：视角定义

```
west-to-east viewpoint, eye-level view
```

### 第3层：空间布局

```
Room dimensions: 8 meters deep x 6 meters wide, ceiling height 3.5 meters.
Rectangular floor plan with main entrance on east wall.
```

### 第4层：元素描述

```
Wooden door:
positioned on east wall, centered,
1.2 meters wide, opens outward,
dark red lacquered wood construction,
traditional Chinese double-door style,
brass door handles with dragon motifs,
slightly weathered appearance.

Office desk:
positioned center-back of room,
3 meters from the east door,
approximately 1.5 meters wide x 0.8 meters deep,
dark hardwood construction,
traditional Chinese official desk style,
documents and writing materials on surface,
ink stone, brush holder, official seals.

Official chair:
positioned directly behind desk,
Qing Dynasty guanmao chair style,
dark wood with subtle carvings,
traditional official furniture,
armrests and high back.
```

### 第5层：人物描述

```
Character Zhang Shisan:
Middle-aged Chinese man, approximately 45 years old,
seated in the guanmao chair behind the desk,
facing toward the east door,
wearing traditional Qing Dynasty official attire
(dark blue silk robe with rank badge on chest,
black official hat),
composed and dignified expression,
slight furrow in brow suggesting concentration,
hands resting naturally on the desk surface,
right hand near a document,
slight forward lean suggesting attentiveness,
well-groomed appearance befitting a naval official.
```

### 第6层：光线设置

```
Lighting setup:
- Primary light source: Candlelight,
  warm 2800K color temperature,
  positioned on the desk surface,
  main illumination for the scene (95% of total light),
  creates soft amber glow,
  illuminates Zhang Shisan's face and upper body,
  casts gentle shadows on walls and furniture,
  creates warm highlights on wooden surfaces.

- Secondary light source: Moonlight and snow reflection,
  cool 6000K color temperature,
  entering through window on south wall,
  subtle fill light (5% of total light),
  creates blue-tinted highlights on edges,
  enhances depth and atmospheric contrast,
  provides rim lighting on character's profile.
```

### 第7层：风格和技术要求

```
Atmosphere and style:
Solemn and quiet atmosphere, late night setting,
sense of historical weight and official dignity.

Visual style: Hyperrealistic environment,
cinematic lighting with dramatic contrast,
in the style of 'Chang'an 30000 Miles' background art,
Lights Animation Studio aesthetic,
photorealistic rendering.

Technical requirements:
Accurate Qing Dynasty period details,
precise spatial relationships,
dramatic low-light photography,
depth and atmospheric perspective,
high attention to historical accuracy.
```

### 完整提示词（合并）

```
Qing Dynasty naval office interior, located in a coastal fortress,
west-to-east viewpoint, eye-level view,
Room dimensions: 8 meters deep x 6 meters wide, ceiling height 3.5 meters,
Rectangular floor plan with main entrance on east wall.

Wooden door: positioned on east wall, centered, 1.2 meters wide, opens outward,
dark red lacquered wood construction, traditional Chinese double-door style,
brass door handles with dragon motifs, slightly weathered appearance.

Office desk: positioned center-back of room, 3 meters from the east door,
approximately 1.5 meters wide x 0.8 meters deep, dark hardwood construction,
traditional Chinese official desk style, documents and writing materials on surface,
ink stone, brush holder, official seals.

Official chair: positioned directly behind desk, Qing Dynasty guanmao chair style,
dark wood with subtle carvings, traditional official furniture, armrests and high back.

Character Zhang Shisan: Middle-aged Chinese man, approximately 45 years old,
seated in the guanmao chair behind the desk, facing toward the east door,
wearing traditional Qing Dynasty official attire (dark blue silk robe with rank badge on chest,
black official hat), composed and dignified expression,
slight furrow in brow suggesting concentration,
hands resting naturally on the desk surface, right hand near a document,
slight forward lean suggesting attentiveness,
well-groomed appearance befitting a naval official.

Lighting setup: Primary light source: Candlelight, warm 2800K color temperature,
positioned on the desk surface, main illumination for the scene (95% of total light),
creates soft amber glow, illuminates Zhang Shisan's face and upper body,
casts gentle shadows on walls and furniture, creates warm highlights on wooden surfaces.
Secondary light source: Moonlight and snow reflection, cool 6000K color temperature,
entering through window on south wall, subtle fill light (5% of total light),
creates blue-tinted highlights on edges, enhances depth and atmospheric contrast,
provides rim lighting on character's profile.

Atmosphere and style: Solemn and quiet atmosphere, late night setting,
sense of historical weight and official dignity.
Visual style: Hyperrealistic environment, cinematic lighting with dramatic contrast,
in the style of 'Chang'an 30000 Miles' background art,
Lights Animation Studio aesthetic, photorealistic rendering.
Technical requirements: Accurate Qing Dynasty period details,
precise spatial relationships, dramatic low-light photography,
depth and atmospheric perspective, high attention to historical accuracy.
```

---

## 负向提示词管理体系

### 来源：从历史错误中提炼

每次迭代中发现的问题，都应转化为负向提示词，防止同类错误再次出现。

### 常见错误 → 负向提示词对照表

| 错误类型 | 具体表现 | 负向提示词 |
|---------|---------|-----------|
| 门窗纸发光 | 窗纸/门纸自发光 | `door paper glowing, window paper glowing` |
| 现代元素混入 | 历史场景出现现代物品 | `modern furniture, electric lights, glass windows, concrete walls` |
| 光线过亮 | 低调场景过亮 | `bright, overexposed, harsh lighting, flat lighting` |
| 空间矛盾 | 摄影机后方物体可见 | `camera-back wall visible, impossible perspective` |
| 人物不一致 | 同一人物外貌变化 | `different face, inconsistent character` |
| 时代错误 | 不符合历史时代 | `anachronistic elements, wrong period details` |

### 负向提示词管理原则

1. **来源可追溯**：每条负向提示词必须记录来源错误
2. **按场景分类**：不同场景类型使用不同的负向提示词集合
3. **持续积累**：每次迭代发现新错误，立即添加到库中
4. **定期清理**：验证负向提示词是否仍然有效，删除无效的

### 按场景类型的负向提示词模板

**历史场景**：
```
modern furniture, electric lights, glass windows, concrete walls,
fluorescent lighting, plastic materials, digital displays,
contemporary clothing, modern architecture
```

**产品摄影**：
```
cluttered background, distracting elements, low quality,
blurry, noisy, overexposed, underexposed, distorted,
unprofessional, amateur
```

**室内场景**：
```
impossible perspective, floating furniture, wrong proportions,
inconsistent lighting, flat 2D look, cartoon style
```

---

## 提示词质量检查清单

每次构建提示词后，检查以下项目：

- □ 第1层场景定义是否放在最前面？
- □ 第2层视角是否使用绝对方向（东西南北）？
- □ 第3层空间是否有具体数字？
- □ 第4层元素是否包含名称+位置+尺寸+材质+样式+状态？
- □ 第5层人物是否足够详细？
- □ 第6层光线是否包含量化色温和强度？
- □ 第7层风格是否包含氛围+风格+参考+技术要求？
- □ 负向提示词是否包含已知错误？
- □ 提示词是否使用英文？
- □ 是否有模糊词汇需要替换为具体描述？
