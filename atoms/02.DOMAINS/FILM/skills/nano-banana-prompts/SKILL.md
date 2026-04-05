---
name: nano-banana-prompts
description: 为 Nano Banana（nano-banana-pro 和 nano-banana-2）生成电影级图像提示词。当用户提到"生成图像"、"分镜"、"镜头"、"提示词"、"prompt"、"画面"、"视觉化"、"图像生成"或需要将文字描述转化为图像时，立即使用此 skill。将分镜稿、场景描述、导演笔记转化为包含摄影参数、角色一致性控制、风格标签的可执行提示词。
---

# Nano Banana Prompts

将分镜稿、场景描述、导演笔记转化为 Nano Banana 可执行的电影级图像提示词。

## 工作流程

### 第一步：理解输入

用户可能提供的输入类型：

**类型 A：完整分镜稿（如 04-directing.md）**
- 包含：镜号、景别、机位、运动、时长、叙事目的、人物行动、视觉元素、台词
- 视觉元素已引用 03-art-direction.md（场景陈设、光源、服装、道具）
- 这是最完整的输入，6 要素都已具备

**类型 B：单个镜头描述**
- 文字描述一个画面，可能缺少技术参数

**类型 C：导演笔记**
- 情绪、氛围、参考风格，缺少具体画面描述

**类型 D：混合输入**
- 以上任意组合

**你的任务**：
- 如果是类型 A（完整分镜稿），直接提取 6 要素并转化为提示词
- 如果是类型 B/C/D，从输入中提取已有要素，缺失部分主动询问或基于上下文推断

**针对 04-directing.md 格式的特殊处理：**

当用户提供完整分镜稿时，你会看到这样的结构：
```
【镜号】标题
- 景别：XX | 机位：XX | 运动：XX | 时长：XX
- 叙事目的：...
- 台词：...
- 人物行动：...（行动节拍X）
- 视觉元素：
  - 引用 03-art-direction.md 场景X：[陈设/光源/服装/道具]
  - 分镜补充：[额外的视觉细节]
```

**提取策略：**
1. **Composition** ← 景别 + 机位 + 运动
2. **Subject** ← 人物行动 + 视觉元素中的服装
3. **Action** ← 人物行动（行动节拍）
4. **Location** ← 视觉元素中的陈设 + 分镜补充
5. **Style** ← 从场景编号推断（场景0=现实线=冷灰，场景A=回忆线=暖黄）
6. **Technical** ← 根据景别和叙事目的选择焦段/光圈

**光源处理（重要！）：**
- 视觉元素中的"光源"描述是艺术指导的权威来源
- 直接引用，不要改写
- 如果分镜补充中有"光源方向"，也要包含进去

### 第二步：一致性检查（关键！）

在生成任何提示词之前，先问这两个问题：

1. **角色一致性**："这个角色之前出现过吗？有参考图吗？"
   - 如果是系列镜头的第一个镜头 → 用完整外貌描述建立角色
   - 如果角色已经出现过 → 询问是否使用之前生成的图作为参考

2. **场景一致性**："这个场景之前出现过吗？有空间参考图吗？"
   - 如果是新场景且有人物 → 建议先生成无人物的空间参考图
   - 如果场景已经建立 → 询问是否使用之前的空间图作为参考

**为什么这很重要**：Nano Banana 的一致性控制依赖参考图。提前规划参考图策略可以避免后续返工。

### 第三步：读取知识库

每次生成前，先读取个人知识库：
```
atoms/02.DOMAINS/FILM/skills/nano-banana-prompts/references/my-best-practices.md
```

知识库记录了真实遇到的问题和解决方法。如果当前镜头和知识库中的某个案例相似（比如都涉及"单一光源"或"正对拍摄"），直接应用已验证的方法。

**如果知识库为空或没有相关案例**：基于提示词结构规范从零构建，生成满意结果后记得沉淀到知识库。

### 第四步：构建提示词

按照 6 要素结构构建，然后输出。

## 提示词结构

按以下顺序构建（Nano Banana 官方推荐）：

```
[Composition] [Subject] [Action] [Location] [Style] [Technical]
```

### Composition（构图/镜头）
来自分镜稿的景别和机位：
- 景别：`extreme close-up` / `close-up` / `medium shot` / `full body shot` / `wide shot` / `aerial view`
- 机位角度：`eye level` / `low angle` / `high angle` / `Dutch angle`
- 摄影机效果：`shallow depth of field` / `bokeh` / `motion blur`

### Subject（主体）
来自分镜稿的人物描述 + film-art-direction 的服装方案：
- 人物外貌：具体描述，越详细越好（用于一致性控制）
- 服装：颜色 + 材质 + 状态
- 情绪状态：来自 film-performance 的行动节拍

### Action（动作）
来自 film-performance 的人物行动节拍：
- 具体动作描述（动词 + 细节）
- 情绪与动作结合：`standing with tense posture` / `subtle grief expression`

### Location（场景）
来自 film-art-direction 的视觉元素清单：
- 场景陈设：具体物件描述
- 光源：来源 + 色温 + 方向
- 氛围：时代背景 + 环境细节

### Style（风格）
来自 film-visual-language 的视觉风格定调：
- 导演风格参考：`in the style of Wong Kar-wai` / `Hou Hsiao-hsien aesthetic`
- 胶片质感：`Kodak 5219 film stock` / `ARRI ALEXA` / `35mm film grain`
- 色彩风格：来自 film-visual-language 的色调描述转英文

### Technical（技术参数）
固定添加的电影感参数：
- 镜头焦段：`35mm lens`（广角叙事）/ `85mm lens`（人物情绪）/ `50mm lens`（自然视角）
- 光圈：`f/1.8`（浅景深）/ `f/2.8` / `f/8`（深焦）
- 质量标签：`cinematic`, `photorealistic`, `8K`, `professional cinematography`

## 一致性控制策略

Nano Banana 支持参考图控制，这是保持跨镜头一致性的核心机制。

### 角色一致性（跨镜头）

**策略选择：**

| 情况 | 策略 | Subject 部分写法 | 提示词中的说明 |
|------|------|------------------|----------------|
| 第一次出现该角色 | 完整外貌描述 | 详细描述外貌、服装、特征 | 无需参考图 |
| 角色已出现，有参考图 | 使用参考图 | 只写姿态和情绪，不描述外貌 | `the person from the reference image` |
| 角色已出现，无参考图 | 将上一个镜头的生成结果作为参考 | 只写姿态和情绪 | `the person from the reference image` |

**实施步骤：**
1. 开始生成系列镜头前，询问："这些镜头涉及哪些角色？是否已有参考图？"
2. 如果没有参考图，第一个镜头用完整描述，生成后告诉用户："这张图可以作为后续镜头的角色参考"
3. 后续镜头询问："使用上一个镜头的图作为参考吗？"

### 场景一致性（跨镜头）

**策略选择：**

| 情况 | 策略 | Location 部分写法 | 提示词中的说明 |
|------|------|-------------------|----------------|
| 新场景，无人物 | 直接生成空间 | 完整场景描述 | 无需参考图 |
| 新场景，有人物 | **先生成空间参考图** | 完整场景描述 | 建议先生成无人物版本 |
| 场景已建立，有参考图 | 使用参考图 | 只写光线变化和新增道具 | `same location as reference image` |

**为什么要先生成空间参考图**：
- 人物会影响空间的生成（模型会调整空间以适应人物）
- 先确定空间，再放入人物，一致性更好
- 可以避免"人物位置不对导致整个空间重新生成"的返工

**实施步骤：**
1. 遇到新场景且有人物时，主动建议："这是新场景，建议先生成一张无人物的空间参考图，确认后再生成带人物的镜头。要这样做吗？"
2. 用户确认后，先输出空间版提示词（Subject 部分留空）
3. 空间确认后，再输出带人物的版本

### 多图参考

Nano Banana 支持同时上传多张参考图（角色图 + 空间图）。当一个镜头需要保持角色和场景都一致时：
- 提示词中写：`the person from reference image 1, in the location from reference image 2`
- 输出时说明："需要上传 2 张参考图：图 1 是角色，图 2 是空间"

## 输出格式

```
【镜号 X 图像提示词】

正向提示词：
[中文叙事描述（人物、场景、情绪、动作）+ 英文技术参数（焦段、光圈、胶片、摄影机、风格标签）]
中英混写，叙事用中文，技术参数用英文

负向提示词：
模糊, 低质量, 变形的脸, 多余的肢体, 水印, 文字叠加, blurry, low quality, distorted face, extra limbs, watermark

参考图：[需要/不需要，需要时说明上传哪类参考图]
分辨率：[1K/2K/4K]
```

**实际示例（基于 04-directing.md 的 S0-06b，经过多轮迭代验证的最终版）：**

```
【S0-06b 室内空间建立 图像提示词（无人物，空间参考图）】

正向提示词：
1895年寒冬深夜，北京总理海军事务衙门正厅。清代亲王级官署，庄重威严，保存完好。高大朱红色梁柱笔直挺立，漆色饱满。墙面以深色木裙板装饰下半段，上半段白色抹灰平整光洁。青砖地面平整，桌案前铺深色官署地毯（有纹样）。

东墙（背景正中）：东窗居中，窗格严格按照参考图样式。东窗右侧悬挂北洋水师舰队图（纸张泛黄，平整悬挂）。画面左侧北墙方向可见深色木框绢面屏风边缘和博古架。

[桌案方向与位置——严格控制]
红木桌案水平居中于画面，the desk is centered horizontally in the frame。
Camera sees the SIDE of the desk, the long edge running left to right. The desk surface faces SOUTH. NOT a front view. Desk drawers and front panel NOT visible.
The desk is EXTREMELY CLOSE to the east wall — only 1 meter away, almost touching the east window.
Near edge of desk at the very bottom of the frame, far edge of desk almost at east window frame.

桌面堆满清代折本式奏折：黄色和蓝色绫面封皮，折叠成册，横竖交错叠放，部分散开，封面墨字标注清晰可见。黄铜单筒望远镜置于低矮V形木托架上，placed with care on the west end of desk (foreground side), treated as a precious object, brass handheld monocular telescope resting on a small low wooden V-shaped cradle, not casually placed。铜制高脚烛台置于桌面东端（背景侧，紧靠东窗），tall brass candlestick at the east end of desk, directly in front of east window。官帽椅侧面置于桌案北侧（画面左侧）。另一把官帽椅置于桌案南侧（画面前景右侧）。

[光影——严格控制]
主光：单支烛火，warm amber candlelight, THE ONLY WARM LIGHT SOURCE AND DOMINANT LIGHT, point light source at east end of desk, illuminates only immediate desk surface, candlelight is the overwhelming primary light source, 95% of total light in the scene。
辅光：月雪冷白光极度微弱，only 5% of the candlelight intensity。The cold moonlight enters THROUGH THE EAST WINDOW at a very steep diagonal angle, low angle raking light from east to west, angled slightly toward the south side of the room. Just barely enough to cast soft diagonal shadow outlines of the window lattice on the floor, shadows subtle and soft-edged. Cold light lands only on south portion of desk and south chair. Cold light does NOT reach north side, does NOT appear on walls。
室内其余部分极暗，rest of room in deep darkness, walls ceiling columns in shadow。暗部深灰无色彩倾向。

[机位——严格控制]
Camera on WEST WALL shooting STRICTLY DUE EAST.
East window centered in background, desk only 1 meter from east wall.
Desk centered horizontally in frame, long edge left to right, near edge at bottom of frame.
NOT a front view of desk. Desk surface faces south, away from camera.
Telescope on west end (foreground). Candle on east end (background, in front of window).
35mm lens, f/2.8, eye level, no people. East window must strictly match reference image.

hyperrealistic environment, cinematic Chinese architecture, volumetric candlelight, physically accurate lighting, in the visual style of Chang'an 30000 Miles background art, Lights Animation Studio style, cold desaturated, cinematic, photorealistic, 8K

负向提示词：
人物, 均匀布光, 明亮室内, 多支蜡烛, 烛火在桌下, 烛火在桌面西端, 望远镜随意放置, 光从南墙打入, 月光照射整个房间, 窗格投影垂直, 月光强于烛光, 桌案正面朝向摄影机, 桌案抽屉可见, 桌案偏左, 桌案偏右, 桌案远离东墙,
any person, even lighting, bright interior, multiple candles, candle under table, candle on west end, telescope casually placed, light from south wall, moonlight filling room, straight window shadows, moonlight stronger than candlelight, desk facing camera, desk front panel visible, desk off-center, desk far from east wall, bright walls, visible ceiling, cartoon style, flat lighting, anime style

参考图：东墙窗格参考图
分辨率：2K
```

**为什么这样写：**
- 机位用绝对空间方向（EAST/WEST/NORTH/SOUTH），不用left/right，避免模型误解
- 桌案方向用三句话从不同角度强调侧面朝向，单句不够
- 光源比例量化（95%/5%），模糊描述会让模型自己决定比例
- 叙事核心道具（望远镜）加`treated as a precious object`，影响呈现质感
- 追光动画风格空间参考图用`Chang'an 30000 Miles background art`替代`ARRI ALEXA + Kodak 5219`

## 重要原则

### 叙述式 > 关键词堆砌
Nano Banana 理解上下文，用完整句子描述画面效果更好。

❌ `candle, warm light, window, paper, glow`
✓ `A single candle behind the paper window casts a diffused warm amber glow`

### 情绪要具体可视化
不要用抽象情绪词，要描述可以被看到的表情和姿态。

❌ `sad` / `angry` / `nervous`
✓ `eyes glistening with unshed tears, jaw slightly clenched` / `fists clenched, shoulders raised` / `fingers fidgeting with sleeve edge`

### 每个镜头独立输出
不要在一个提示词里混合多个镜头，Nano Banana 一次生成一张图。

### 技术参数要匹配镜头意图

| 镜头意图 | 焦段 | 光圈 | 原因 |
|----------|------|------|------|
| 人物情绪特写 | 85mm | f/1.8 | 浅景深突出人物，背景虚化 |
| 空间建立镜头 | 35mm | f/2.8 | 广角展现空间，景深适中 |
| 人物与环境关系 | 50mm | f/2.8 | 自然视角，人物和环境都清晰 |
| 建筑细节 | 50mm | f/4.0 | 景深稍深，保留建筑细节 |

不要盲目套用参数，要理解镜头想表达什么。

## 多轮矫正与知识沉淀

### 矫正流程

生成提示词后，用户可能会多轮反馈调整。这是正常的——图像生成本身就是迭代过程。

**每轮矫正时的思考框架：**

1. **明确问题**：用户指出哪里不对（光源、构图、人物、氛围等）
2. **定位原因**：
   - 是提示词描述不准确？（比如"单一光源"没写清楚）
   - 是模型的默认行为在干扰？（比如模型倾向均匀布光）
   - 是负向提示词不够强？（没有抑制不想要的元素）
3. **修改策略**：
   - 如果是描述不准确 → 在正向提示词中更具体地描述
   - 如果是模型默认行为 → 在正向提示词中主动打破默认，同时在负向提示词中抑制
   - 如果是某个元素总是出现 → 在负向提示词中明确排除
4. **输出修改版**：标注改了什么、为什么这样改

**示例：**

用户反馈："窗户透光太均匀了，应该只有中间两扇窗透光"

分析：模型默认会让所有窗户都透光（均匀布光倾向）

修改：
- 正向加：`warm glow concentrated on center two panels, outer panels darker`
- 负向加：`even lighting across all panels, uniform glow`

输出时说明："我在正向提示词中明确了'光集中在中间两扇'，并在负向提示词中排除'均匀布光'，这样可以打破模型的默认均匀布光倾向。"

### 沉淀时机与方法

当一个镜头经过 2 轮以上矫正后达到满意效果，**主动询问用户**：

> "这个镜头调整了 X 轮，核心问题是 [问题描述]，解决方法是 [方法]。要记录到知识库吗？这样以后遇到类似情况可以直接应用。"

**用户确认后，按以下原则提炼并写入知识库：**

1. **记问题本质，不记具体场景**
   - ❌ "烛火透窗生成了 4 个光点"
   - ✓ "模型默认均匀布光，单一光源需要明确声明"

2. **记为什么有效，不只记怎么做**
   - ❌ "正向加 `single candle`，负向加 `multiple light sources`"
   - ✓ "模型倾向均匀布光让画面好看，电影感恰恰来自不均匀的光。需要明确光源数量并在负向排除多光源"

3. **记反向教训**
   - 负向提示词的价值往往比正向更大
   - 记录"什么不能做"和"为什么不能做"

4. **保持精简**
   - 一句话说清楚比三段话更有用
   - 定期合并相似经验，避免重复堆积

### 知识库路径

`atoms/02.DOMAINS/FILM/skills/nano-banana-prompts/references/my-best-practices.md`

知识库的价值在于可迁移性——不是记住"这个镜头怎么调"，而是记住"这类问题怎么解决"。


## 常见问题处理

### 用户输入不完整怎么办？

如果用户只给了一句话（比如"李鸿章站在窗前"），不要直接猜测，而是主动询问缺失的要素：

- "这是什么景别的镜头？特写还是全景？"
- "想要什么样的光线氛围？"
- "有参考的导演风格或电影吗？"

**原因**：提示词的质量直接影响生成结果，与其猜错返工，不如一开始就问清楚。

### 用户要求"电影感"但没有具体描述怎么办？

"电影感"是模糊的，需要拆解成可执行的技术参数：

1. **询问参考**："有没有参考的电影或导演？比如侯孝贤、王家卫、贾樟柯？"
2. **如果没有参考**，基于场景类型给出建议：
   - 历史题材 → 侯孝贤美学（长镜头、自然光、35mm 胶片）
   - 都市情感 → 王家卫美学（浅景深、霓虹色调、慢动作）
   - 现实主义 → 贾樟柯美学（固定机位、自然光、纪实感）

### 用户说"不对"但没说哪里不对怎么办？

主动引导用户具体化反馈：

"我看看能不能帮你定位问题。是这些方面的问题吗？
- 光线：太亮/太暗/光源位置不对？
- 构图：角度不对/景别不对/人物位置不对？
- 人物：表情不对/服装不对/姿态不对？
- 氛围：太现代/不够压抑/色调不对？"

**原因**：模糊的反馈无法定位问题，主动提供选项可以加速迭代。

### 生成结果和预期差距很大怎么办？

先判断是提示词的问题还是模型的限制：

1. **检查提示词**：是否有关键信息缺失或描述不清？
2. **检查负向提示词**：是否排除了不想要的元素？
3. **检查参考图**：如果使用了参考图，参考图本身是否符合预期？

如果以上都没问题，可能是模型的限制。这时候：
- 尝试调整描述方式（换个角度描述同一个画面）
- 尝试分步生成（先生成空间，再加人物）
- 如果多次尝试都不行，诚实告诉用户："这个效果可能超出了模型的能力范围，我们可以尝试调整预期或换个方案"

### 用户要求批量生成多个镜头怎么办？

**不要一次性输出所有提示词**，原因：
- 第一个镜头可能需要调整，调整后的经验可以应用到后续镜头
- 一致性控制需要前一个镜头的生成结果作为参考

**正确做法**：
1. 先生成第 1-2 个镜头
2. 用户确认满意后，询问："这两个镜头的风格和效果满意吗？我可以用同样的方法生成后续镜头"
3. 如果需要调整，先调整前面的，再继续后面的

## 输出检查清单

每次输出提示词前，快速过一遍：

- ✓ 6 要素（Composition, Subject, Action, Location, Style, Technical）都有了吗？
- ✓ 一致性策略确定了吗？（是否需要参考图？）
- ✓ 知识库中有相关案例吗？（如果有，应用了吗？）
- ✓ 技术参数匹配镜头意图吗？（焦段、光圈、景深）
- ✓ 负向提示词覆盖了常见问题吗？（模糊、变形、多余元素）
- ✓ 输出格式完整吗？（正向、负向、参考图说明、分辨率）

如果以上任何一条答案是"不确定"，先补充完整再输出。
