# 个人最佳实践

经验导向，不是规则列表。每条记录一个可迁移的方法，说明背后的逻辑。

---

## 经验一：让模型真正"正对"拍摄

**问题：** 写了"facing the window"，模型仍然生成斜角透视，窗格变形不对称。

**方法：**
- 正向加：`camera positioned directly perpendicular to the subject surface, perfectly symmetrical framing, no perspective distortion`
- 负向加：`angled shot, perspective distortion, asymmetrical`

**逻辑：** 模型默认会加透视感让画面"有深度"，必须明确告诉它不要这样做。适用于任何需要正对拍摄的场景（窗户、门、墙面、桌面俯拍）。

---

## 经验二：空间/建筑镜头的景深选择

**问题：** 用 f/2.8 拍建筑全景，边缘砖墙和窗框轻微虚化，破坏了工整感。

**方法：**
- 人物情绪镜头（近景/特写）：f/1.8，浅景深，突出人物
- 空间/建筑镜头（全景/中景）：f/4.0，景深稍深，保留所有细节
- 全景建立镜头：35mm + f/2.8，广角叙事

**逻辑：** 景深选择取决于"你想让观众看清什么"。人物戏要虚化背景突出情绪，空间戏要让每个细节都清晰可读。

---

## 经验三：控制画面中的光源数量和位置

**问题：** 描述了"烛火透窗"，模型生成了4个均匀的光点，破坏了单一光源的氛围。

**方法：**
- 明确写光源数量：`a single candle` / `two lanterns on the left wall`
- 明确写光的传播方式而非光源本身：`diffused warm amber glow` / `warm pool of light`
- 多扇窗时控制哪几扇透光：`warm glow concentrated on center two panels, outer panels darker`
- 负向加：`multiple candles, multiple light sources`

**逻辑：** 模型倾向于"均匀布光"让画面好看，但电影感恰恰来自不均匀的光。要主动打破这个默认行为。

---

## 经验四：透窗光的正确描述方式

**问题：** 描述烛火透窗，模型生成了破洞透光，或者蜡烛清晰可见。

**方法：**
- 要漫射光晕（不见光源）：`only diffused warm amber glow visible through paper, light source hidden behind paper, no candle visible`
- 要窗纸完整：正向加 `intact paper panels`，负向加 `broken paper, holes in window, visible candle, visible flame`

**逻辑：** 窗纸透光是"光穿过介质后的漫射"，不是"光源直接可见"。这两种视觉效果完全不同，必须明确区分。

---

## 经验五：清代官署建筑的气派感

**问题：** 只写"清代官署建筑"，模型生成了普通民居风格，没有衙门气派。

**方法：**
- 明确建筑规格：清代官式建筑、青灰色厚重砖墙、朱红色廊柱
- 格扇窗细节：下有半人高槛墙，窗格自槛墙向上延伸至屋檐（非落地）
- 负向加：`residential style, small window, floor-to-ceiling window`

**逻辑：** 模型对"清代建筑"的默认理解偏向民居或园林，官署的厚重压迫感需要主动描述。落地格扇是殿内用法，衙署外侧有槛墙，这是建筑实物细节，不说清楚模型会用错。

---

## 待验证

- ARRI ALEXA + Kodak 5219 + Hou Hsiao-hsien aesthetic 的整体电影感，需要更多镜头积累
- 有参考图时人物一致性的效果
