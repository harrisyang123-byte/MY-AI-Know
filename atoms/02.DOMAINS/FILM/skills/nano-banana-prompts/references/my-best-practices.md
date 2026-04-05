# 个人最佳实践

## 如何使用这份文档

这不是规则列表，是可迁移的经验库。每条记录一个真实遇到的问题、解决方法和背后的逻辑。

**总结原则：**
- 记问题本质，不记具体场景（"模型默认均匀布光"比"烛火透窗生成了4个光点"更可迁移）
- 记为什么有效，不只记怎么做（方法背后的逻辑才能举一反三）
- 记反向教训（负向提示词的价值往往比正向更大）
- 不追求完整，追求精准——一句话说清楚比三段话更有用
- 定期合并相似经验，避免重复堆积

**沉淀时机：** 一个镜头经过 2 轮以上矫正后达到满意效果，提炼核心问题和解决方法记录在此。

---

## 构图与镜头

### 正对拍摄需要明确打破透视默认行为

模型默认会加透视感让画面"有深度"，正对拍摄必须主动抑制。

正向：`camera positioned directly perpendicular to the subject surface, perfectly symmetrical framing, no perspective distortion`
负向：`angled shot, perspective distortion, asymmetrical`

适用：窗户、门、墙面、桌面俯拍等任何需要正对的场景。

---

## 光线

### 单一光源需要明确声明，否则模型会均匀布光

模型倾向于"均匀布光"让画面好看，电影感恰恰来自不均匀的光。

- 明确光源数量：`a single candle` / `two lanterns on the left wall`
- 描述光的传播方式而非光源本身：`diffused warm amber glow` / `warm pool of light`
- 多扇窗时控制哪几扇透光：`warm glow concentrated on center two panels, outer panels darker`
- 负向：`multiple candles, multiple light sources, even lighting`

### 透窗漫射光 ≠ 光源直接可见

描述烛火透窗，模型容易生成破洞透光或蜡烛清晰可见。

- 要漫射光晕：`only diffused warm amber glow visible through paper, light source hidden behind paper, no candle visible`
- 要窗纸完整：正向加 `intact paper panels`，负向加 `broken paper, holes in window, visible candle, visible flame`

### 景深选择取决于"想让观众看清什么"

- 人物情绪镜头（近景/特写）：f/1.8，浅景深，突出人物
- 空间/建筑镜头（全景/中景）：f/4.0，景深稍深，保留所有细节
- 全景建立镜头：35mm + f/2.8

---

## 建筑与场景

### 清代官署建筑需要主动描述规格，否则模型默认民居风格

模型对"清代建筑"的默认理解偏向民居或园林，官署的厚重压迫感需要主动描述。

- 明确建筑规格：清代官式建筑、青灰色厚重砖墙、朱红色廊柱
- 格扇窗细节：下有半人高槛墙，窗格自槛墙向上延伸至屋檐（非落地）
- 负向：`residential style, small window, floor-to-ceiling window`

### 烛火位置需要明确声明在桌面之上，否则模型会放到桌案底下

模型对"桌案上的烛火"理解不稳定，容易将烛台生成到桌案底部或地面。

- 正向明确：`candle and flame positioned above the table surface on top of the desk`
- 负向排除：`candle under the table, candle on the floor, candle beneath desk`

### 清代官署陈设需要主动描述权力感，否则空间显得简陋

模型对"清代室内"的默认陈设偏向简单民居，官署的厚重感需要主动列举。

- 必须包含：高大梁柱（朱红色）、横梁匾额、屏风、官帽椅
- 这些元素是官署空间感的核心，缺少任何一项都会让空间失去压迫感

---

## 待验证

- 有参考图时人物一致性的效果

---

## 本次迭代沉淀（S0-06b，总理衙门室内空间）

### 机位方向用绝对空间方向描述，不用left/right

模型对left/right的理解不稳定，容易把"right side light"理解成画面右侧（南墙）而不是东窗右侧。

- 用绝对方向：`light enters from EAST WINDOW, travels from EAST TO WEST`
- 不用：`light from right side, light from the right`
- 机位也用绝对方向：`camera on WEST WALL shooting DUE EAST`，不用`camera facing right`

### 桌案侧面朝向摄影机需要多重强调

模型默认生成桌案正面（抽屉面朝摄影机），需要从多个角度强调：

- 正向：`camera sees the SIDE of the desk, long edge running left to right, desk surface faces SOUTH, NOT a front view`
- 负向：`desk facing camera, desk front panel visible, desk drawers visible`
- 仅靠一句话不够，需要至少三句从不同角度描述同一件事

### 桌案水平居中需要明确声明

模型不会自动把桌案放在画面中央，需要明确：

- 正向：`the desk is centered horizontally in the frame`
- 负向：`desk shifted left, desk shifted right, desk off-center`

### 斜射光的投影也是斜的，需要同时描述

描述斜射月光时，只描述光的角度不够，投影方向也要同时描述，否则模型会生成垂直投影。

- 正向：`low angle raking light, diagonal shadow outlines of window lattice on floor, shadows angled not straight`
- 负向：`straight window lattice shadows, perpendicular shadows, vertical shadows`

### 两个光源的比例需要量化

"主光烛火，辅光月雪"这种描述太模糊，模型会自己决定比例。需要量化：

- `candlelight is 95% of total light, moonlight is only 5%`
- 这样模型才能正确理解"烛火主导，月光几乎不可见"

### 叙事道具的陈设方式要匹配其叙事地位

随手放置的道具和被郑重对待的道具，提示词写法不同。

- 普通道具：直接描述位置即可
- 叙事核心道具（如贯穿全片的信物）：`placed with care, treated as a precious object, not casually placed`
- 这不只是视觉描述，也是给模型的叙事信号，影响道具的呈现质感

### 追光动画风格的空间参考图技术参数

《长安三万里》风格：人物动画化，环境超写实。空间参考图（无人物）用写实参数：

- `hyperrealistic environment, cinematic Chinese architecture, volumetric candlelight, physically accurate lighting, in the visual style of Chang'an 30000 Miles background art, Lights Animation Studio style`
- 去掉：`ARRI ALEXA, Kodak 5219 film stock`（这是真人电影参数）
- 保留：`photorealistic, 8K, cinematic`（环境写实参数）

---

## 参考图与机位调整

### 同一空间调整机位：先声明相同空间，再只描述变化

有满意的空间参考图后，调整机位/推进镜头的最有效写法：先声明"和参考图相同的空间"，然后只描述变化，不重复描述空间细节。重复描述会和参考图产生冲突，模型会乱。

- 正向：`The same interior space as reference image 1. Same room, same furniture, same lighting. Camera change only: [机位描述]`
- 不要用：`same location as reference image` + 大量空间描述
- 不要用：完整重新描述空间

适用：同一场景的不同机位、推进镜头、景别变化。

### 窗纸容易被模型在调整机位时自行去掉

模型在推进镜头或调整机位时，容易把窗纸去掉，露出裸露窗框。

- 正向：`intact paper panels on window, paper window covering intact`
- 负向：`bare window frame, glass window, no paper panels, open window`

### 墙壁无光需要明确声明，否则推进镜头时模型会自己加光

调整机位或推进镜头时，模型容易在原本暗的墙壁上加光。

- 正向：`Walls must remain dark with no light on them, exactly as in reference image`
- 负向：`light on walls, illuminated walls, light spill on background walls`

### 低机位+桌案近端压底+西端出画是有效的电影感构图

摄影机低位靠近桌面，桌案近端压住画面底部，西端出画，东端（烛台+东窗）在画面右侧背景。纵深感强，烛火从画面深处打出，电影感强。西端出画不是问题，反而制造悬念。

- 提示词：`Camera positioned LOW near desk surface level, west end of desk completely out of frame to the left, desk surface fills lower half of frame, near edge at very bottom of frame`

### 带人物版本：空间参考图确认后，只描述人物和光线在人物上的效果

有满意的空间参考图后，带人物版本不要重复描述空间，只描述人物：

```
The same interior space as reference image 1. [窗格补充如有需要].
Camera position same as reference image 1.
The person from reference image 3 sits on [位置], facing [方向].
[上半身可见部位]. [表情/姿态].
[光线打在人物上的效果：主光方向+冷暖].
```

低机位+桌案压底时，坐着的人物露出上半身（肩膀、胸口、头部），腰部以下被桌案遮挡。

### 过度描述脸部光影会让模型生成诡异效果

强控脸部光影比例（如"70% in shadow"、"extreme underlighting"）会让模型生成不自然的恐怖感。烛光自然打在人物脸上本身就有电影感，不需要强控。

- 正确写法：`natural candlelight illuminates his face with warm amber glow, soft underlighting from below, natural shadows on face`
- 错误写法：`70% of his face in shadow, deep black eye sockets, extreme underlighting`
- 教训：描述光源位置和色温即可，让模型自然处理脸部光影，不要量化阴影比例

---

## 多机位/推进镜头与人物裁切

**适用场景：** 同一场景需要多个机位或景别；有人物的推进镜头；需要控制人物在画面中的裁切范围。

### 推进镜头带人物的正确生成流程

不要直接生成推进版带人物，模型会强行完整展示人物。正确流程是四步：

1. 全景空间图（无人物）——确认空间
2. 推进版空间图（无人物）——确认机位
3. 全景带人物图——确认人物位置和角度
4. 推进版带人物——用步骤2+步骤3作为参考图

步骤4的提示词只说机位变化，人物裁切自然跟随机位参考图。

### 有机位参考图时，用参考图+可见部位说明控制人物裁切

模型默认想完整展示人物。有了推进后的空间参考图（无人物），加一句说明该机位下人物自然可见的部位，效果最好。

- 正向：`严格参考图X的机位，人物只露出[可见部位，如手部袖口]`
- 不要描述人物全身，让机位参考图决定裁切

### 人物裁切不要用文字强控，用参考图+一句说明

文字描述人物裁切（如"only upper body visible"）效果不稳定，模型会自己决定。有了机位参考图后，只需一句话说明可见部位即可，其余交给参考图。

---

## 书法/文字类特写镜头

**适用场景：** 需要生成清代手写奏折、书信、文书等带文字的特写镜头。

### 手写书法感需要用物理质感描述，不能用规则描述

描述字体规格（字号、间距数值）模型无法理解，需要描述墨水和纸张的物理质感：

正向关键词组合（已验证有效）：
```
ultra-fine hairline-thin strokes, needle-sharp Guan Ge Ti small regular script, slender delicate thread-like calligraphy, NO thick or bold lines at all, tapered strokes thinning to a fine point at both ends, visible brush tip pressure variation (minor, not dramatic), natural handwritten nuances: minor variations in stroke thickness, slight hand tremor in lines (not perfectly straight), minor variations in character size (not perfectly identical), rich black ink with natural uneven density: darker at stroke starts, lighter at tapering ends, subtle ink bleed into rice paper fibers, tiny feathering at stroke edges, no flat solid black, no harsh digital ink, aged light beige rice paper with visible uneven natural fiber texture, subtle foxing and uneven yellowing from age
```

负向关键词（必须包含）：
```
printed font, digital vector, uniform stroke weight, perfectly straight lines, perfectly aligned characters, solid flat black ink, smooth modern paper, no fiber texture, rigid grid layout, bold strokes, thick lines, no hand variation, no ink bleed, computer-generated text, AI artifacts
```

### 书法文字类镜头：纯文字描述比参考图更有效

经过多轮迭代验证：对于奏折书法特写，不上传参考图，只用物理质感文字描述，效果反而更好。

原因：参考图会让模型锚定整体场景构图，反而干扰对文字细节的生成。纯文字描述时，模型可以专注于书法质感本身。

**结论：书法/文字类特写，不需要参考图，用物理质感描述即可。**

### 清代奏折字体关键词：用"Chinese imperial document script"效果最好

`Authentic Qing Guan Ge Ti small regular script` 效果不稳定，模型理解不准确。
用 `Chinese imperial document script` 模型能更准确理解清代官方文书的字体风格。

适用：所有清代官方文书、奏折、圣旨等场景。

### 俯拍时手的左右方向需要用绝对空间方向描述

张十三面朝南坐，摄影机从北往南俯拍：
- 他的左手在东侧 → 画面左侧
- 正向：`elderly man's left hand rests on the LEFT SIDE of the folio from camera's perspective`
- 负向：`right hand, hand on right side of frame, both hands`

### 俯拍奏折特写的完整提示词模板（已验证）

参见本次S0-07迭代最终版本，核心结构：
1. 参考图1锁定场景（same desk and folios）
2. 机位：bird's eye view from NORTH looking SOUTH
3. 手：elderly left hand on LEFT SIDE of frame
4. 书法：参考图2 + 物理质感描述
5. 文字内容
6. 光线 + 技术参数

### 参考图方向与分镜方向一致时，不需要重复描述机位

当参考图的拍摄方向和当前分镜方向一致时，只需说 `Same camera direction as reference image 1`，不需要重新描述机位方向（如"camera on west wall facing east"）。重复描述机位反而会让模型产生混乱，偏离参考图。

适用：同一场景内，机位方向不变，只改变景别（如从全景推进到近景）。
