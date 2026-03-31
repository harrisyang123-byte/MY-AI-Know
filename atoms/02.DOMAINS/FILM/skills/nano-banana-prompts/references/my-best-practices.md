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

---

## 待验证

- ARRI ALEXA + Kodak 5219 + Hou Hsiao-hsien aesthetic 的整体电影感，需要更多镜头积累
- 有参考图时人物一致性的效果
