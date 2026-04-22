# Qinglv — 图像提示词（故事一：周末出游）

> 基于 04-directing.md 分镜稿，为 Nano Banana 生成的 9 张图提示词。
> 人物参考：小茉 = 参考图1，小源 = 参考图2

---

## 一致性保障方案

### 核心策略：先生成空间参考图，再放入人物

**原因**：人物会影响空间的生成，先确定空间，再放入人物，一致性更好。

### 生成顺序

```
第一步：生成 4 个空间参考图（见 05-prompts-spaces.md）
  - 空间图 A：书房（周五晚）
  - 空间图 B：卧室（周六早）
  - 空间图 C：玄关（周六早）
  - 空间图 D：客厅（周六晚）

第二步：准备人物参考图
  - 参考图1：小茉的人物形象
  - 参考图2：小源的人物形象

第三步：生成带人物的 9 张图
  - 每张图上传 3 张参考图（人物1 + 人物2 + 空间）
```

### 各图对应的空间参考图

| 图 | 场景 | 空间参考图 |
|----|------|------------|
| 图 1 | 书房 | 空间图 A |
| 图 2 | 书房 | 空间图 A |
| 图 3 | 卧室 | 空间图 B |
| 图 4 | 卧室+玄关 | 空间图 B + 空间图 C |
| 图 5 | 玄关 | 空间图 C |
| 图 6 | 玄关 | 空间图 C |
| 图 7 | 湖边 | 无（户外场景，描述一致即可） |
| 图 8 | 湖边 | 无（户外场景，描述一致即可） |
| 图 9 | 客厅 | 空间图 D |

### 湖边场景一致性保障

图 7 和图 8 是户外场景，无法使用空间参考图。一致性保障方式：

1. **统一的环境描述**：
   - 湖边绿道，两旁是绿树和柳条
   - 波光粼粼的湖面，和煦的阳光
   - 摇曳的柳条，远处的山影
   - 黄色单车

2. **统一的光线描述**：
   - 明亮、温暖、治愈
   - bright sunny day, afternoon warm light

3. **统一的风格标签**：
   - lakeside scenery, hand-drawn illustration style, Japanese illustration style, warm healing tone, soft colors

---

## 服装设定

### 居家服装
- **小茉**：紫色长袖长裤睡衣
- **小源**：灰色长袖长裤睡衣

### 外出服装
- **小茉**：白色短袖 + 淡黄色宽松裤子 + 白鞋
- **小源**：淡黄色休闲衬衫 + 白裤子 + 白鞋

---

## 图 1：建立镜头 / 钩子画面

**场景**：周五晚，书房，两人并排而坐

**布局**：单格，3:4 竖版

---

### 正向提示词：

周五晚上，温馨的书房场景。两张书桌拼在一起，形成一个长条形的工作区域。两人都面向墙坐着。

左侧（小茉的世界）：暖黄色台灯光笼罩，参考图1中的年轻女性坐在白色人体工学椅上，带鱼屏显示器上显示着美好的风景或旅行攻略。她脸上带着微笑，充满活力，身体微微前倾，眼神明亮。穿着紫色长袖长裤睡衣，舒适居家。左侧有窗户，窗帘半掩。整个左侧区域温暖、有序、向外探索的感觉。

右侧（小源的世界）：显示器冷色调蓝光为主，屏幕上是激烈的游戏画面。参考图2中的年轻男性坐在黑色人体工学椅上，专注地盯着屏幕，双手放在键盘鼠标上。他穿着灰色长袖长裤睡衣，表情冷静、专注、向内沉浸。整个右侧区域冷静、专注、向内沉浸的感觉。

两人并排而坐，都面向墙，但完全沉浸在各自的世界里，没有交流。这个画面讲述"同一屋檐下，两个世界"的核心矛盾。

wide shot, eye level, 35mm lens, f/2.8, cinematic composition, split lighting, warm cool contrast, white ergonomic chair, black ergonomic chair, window on left side, hand-drawn illustration style, Japanese illustration style, warm healing tone, soft colors, 3:4 aspect ratio, no dialogue bubbles

---

### 负向提示词：

人物看向对方, 交流, 对话, 均匀布光, 单一光源, 明亮室内, 现代简约风格, 欧美风格, 
looking at each other, conversation, even lighting, single light source, bright interior, modern minimalist style, western style, cartoon style, flat lighting

---

### 参考图：

需要上传 3 张参考图：
- 参考图1：小茉的人物形象（用于左侧人物）
- 参考图2：小源的人物形象（用于右侧人物）
- 参考图3：空间图 A（书房场景）

---

### 分辨率：2K

---

## 图 2：对话与情绪落点

**场景**：周五晚，书房，对话与失落

**布局**：上下两格，3:4 竖版

---

### 正向提示词：

**上格（对话）：** 左右分格布局。

左半部分：参考图1中的年轻女性特写，暖黄色台灯光笼罩。她转过头，脸上带着灿烂的、充满期待的笑容，眼睛里闪着光，向右侧伸出手机，屏幕上是湖边风景照。穿着紫色长袖长裤睡衣。表情灿烂、期待、眼睛有光。

右半部分：参考图2中的年轻男性特写，显示器冷蓝光照射。他的脸大部分被冷光照亮，眼神完全没有离开屏幕方向，只是嘴角微微动了一下，做出敷衍的回应。穿着灰色长袖长裤睡衣。表情敷衍、心不在焉。

**下格（情绪落点）：** 参考图1中的年轻女性面部特写，听到回应后，她脸上的笑容有瞬间的凝固，眼神里的光芒稍稍黯淡，然后又努力恢复了笑容。表情笑容凝固、眼神黯淡、一丝失落。背景虚化。

上下两格布局， 3:4 aspect ratio, split frame composition, medium close-up for upper frame, close-up for lower frame, 50mm lens, f/1.8, shallow depth of field, hand-drawn illustration style, Japanese illustration style, warm healing tone, soft colors

---

### 负向提示词：

均匀布光, 明亮室内, 人物看向镜头, 欧美风格, 
even lighting, bright interior, looking at camera, western style, cartoon style, flat lighting, multiple people in one frame

---

### 参考图：

需要上传 3 张参考图：
- 参考图1：小茉的人物形象
- 参考图2：小源的人物形象
- 参考图3：空间图 A（书房场景）

---

### 分辨率：2K

---

## 图 3：清晨的对比

**场景**：周六早，卧室，清晨阳光

**布局**：单格，3:4 竖版

---

### 正向提示词：

周六清晨，温馨的卧室场景。清晨的阳光从窗户洒入，整个房间沐浴在柔和的晨光中。

画面被巧妙地一分为二：

左侧：参考图1中的年轻女性已经坐起身，伸了个懒腰，脸上带着微笑，沐浴在清晨的阳光中。她穿着紫色长袖长裤睡衣，头发微微凌乱，整个人充满活力。阳光打在她的脸上，形成温暖的光晕。

右侧：参考图2中的年轻男性则用被子蒙着头，只露出一点头发，对阳光和闹钟声毫无反应。被子鼓起一个形状，完全看不到他的身体，只能看到被子边缘露出的一点头发。整个右侧区域还在沉睡中。

一个充满活力，一个沉浸梦乡，强烈的动态与静态对比。床边是窗户，清晨的阳光透过窗帘洒入。

wide shot, eye level, 35mm lens, f/2.8, morning natural light, golden hour, cinematic composition, hand-drawn illustration style, Japanese illustration style, warm healing tone, soft colors, 3:4 aspect ratio, split frame composition

---

### 负向提示词：

均匀布光, 两人都醒着, 两人都睡着, 明亮室内, 
even lighting, both awake, both asleep, bright interior, cartoon style, flat lighting

---

### 参考图：

需要上传 3 张参考图：
- 参考图1：小茉的人物形象
- 参考图2：小源的人物形象
- 参考图3：空间图 B（卧室场景）

---

### 分辨率：2K

---

## 图 4：小茉的准备

**场景**：周六早，卧室/衣柜，精心准备

**布局**：上下三格，3:4 竖版

---

### 正向提示词：

**格 1（化妆）：** 参考图1中的年轻女性特写，在玄关的全身镜前开心地化妆。她穿着紫色长袖长裤睡衣，脸上带着开心的表情，眼神明亮，正在涂口红或画眉毛。镜子里映出她的脸，晨光从窗户洒入，整个画面温暖明亮。

**格 2（挑衣服）：** 参考图1中的年轻女性中景，站在卧室衣柜前挑选今天出游的衣服。衣柜里挂着各种颜色的衣服，她穿着紫色长袖长裤睡衣，手里拿着一件白色短袖，表情认真挑选、期待。晨光从窗户洒入。

**格 3（准备完成）：** 参考图1中的年轻女性全身，已经换好精心搭配的出游服装。她站在玄关的全身镜前，对着镜子里的自己比了个"耶"的手势，脸上带着灿烂的笑容，自信满满。穿着精心搭配的出游服装：白色短袖搭配淡黄色宽松裤子，穿着白色运动鞋。

上下三格布局， vertical triptych, close-up for top, medium shot for middle, full body for bottom, 50mm lens, f/2.8, morning natural light, hand-drawn illustration style, Japanese illustration style, warm healing tone, soft colors, 3:4 aspect ratio, montage sequence

---

### 负向提示词：

同一格内多个人物, 均匀布光, 暗淡室内, 
multiple people in one frame, even lighting, dark interior, cartoon style, flat lighting

---

### 参考图：

需要上传 3 张参考图：
- 参考图1：小茉的人物形象
- 参考图2：空间图 B（卧室场景，用于格 2）
- 参考图3：空间图 C（玄关场景，用于格 1、格 3）

**注意**：图 4 涉及两个场景（卧室和玄关），格 2 在卧室挑衣服，格 1 和格 3 在玄关照镜子。

---

### 分辨率：2K

---

## 图 5：时间的流逝与情绪的变化

**场景**：周六早，玄关，等待与愤怒

**布局**：上下三格，3:4 竖版

---

### 正向提示词：

**格 1（9:00 期待）：** 参考图1中的年轻女性中近景，站在大门口，身体姿态轻松。她穿着精心搭配的出游服装：白色短袖搭配淡黄色宽松裤子，穿着白色运动鞋。嘴角上扬，眼睛弯成月牙，脸上带着灿烂的微笑，眼神明亮充满期待。一手拿手机看时间，一手自然下垂，身体微微前倾，姿态轻松。眼神看向卧室方向，充满期待。背景是大门口，身后是玄关，可以看到部分客厅。早晨的自然光从窗户洒入。

**格 2（9:15 疑惑）：** 参考图1中的年轻女性中近景，同一位置，但姿态开始变化。她穿着同样的出游服装：白色短袖搭配淡黄色宽松裤子，穿着白色运动鞋。笑容已经消失，眉头微微皱起，嘴角放平，眼神里带着一丝困惑和不解。双手抱胸，身体重心换到另一条腿，开始显出不耐烦的姿态。眼神看向卧室方向，但眼神里多了几分质疑。背景相同，光线一致。

**格 3（9:30 愤怒）：** 参考图1中的年轻女性中近景，同一位置，姿态明显紧绷。她穿着同样的出游服装：白色短袖搭配淡黄色宽松裤子，穿着白色运动鞋。眉头紧锁，嘴角下撇，眼神里流露出明显的不耐烦和怒气，嘴唇微微抿紧。双臂紧紧抱在胸前，身体前倾，脚尖不耐烦地轻点地面，整个人散发着"我要发火了"的气场。眼神怒视卧室方向，眼神犀利。背景相同，光线一致。

上下三格布局， vertical triptych, same character three different emotions, medium close-up for all three, 50mm lens, f/2.8, morning natural light, consistent background, hand-drawn illustration style, Japanese illustration style, warm healing tone, soft colors, 3:4 aspect ratio, emotional progression

---

### 负向提示词：

不同人物, 不同服装, 不同背景, 均匀布光, 
different characters, different outfits, different backgrounds, even lighting, cartoon style, flat lighting

---

### 参考图：

需要上传 2 张参考图：
- 参考图1：小茉的人物形象
- 参考图2：空间图 C（玄关场景）

---

### 分辨率：2K

---

## 图 6：冲突的顶点

**场景**：周六早，玄关，冲突爆发

**布局**：单格，3:4 竖版

---

### 正向提示词：

小源的主观视角（POV）。从洗手间门口看向玄关。

前景：参考图2中的年轻男性刚从洗手间出来，睡眼惺忪，头发还有点乱。他穿着灰色长袖长裤睡衣，表情无辜、困惑，刚洗漱完的样子。他的身体在画面边缘，只能看到部分身体。

中景：参考图1中的年轻女性站在大门口，双臂抱在胸前，正怒视着前方。她穿着精心搭配的出游服装：白色短袖搭配淡黄色宽松裤子，穿着白色运动鞋。眉头紧锁，眼神犀利，压着火气，整个人散发着强大的气场。她的姿态紧绷，双臂紧紧抱在胸前，身体前倾，形成压迫感。

背景是玄关，可以看到大门口和部分客厅。早晨的自然光从窗户洒入。

POV shot, medium shot, eye level, 35mm lens, f/2.8, shallow depth of field, cinematic composition, hand-drawn illustration style, Japanese illustration style, warm healing tone, soft colors, 3:4 aspect ratio, conflict tension

---

### 负向提示词：

两人并排站立, 均匀布光, 明亮室内, 
standing side by side, even lighting, bright interior, cartoon style, flat lighting

---

### 参考图：

需要上传 3 张参考图：
- 参考图1：小茉的人物形象
- 参考图2：小源的人物形象
- 参考图3：空间图 C（玄关场景）

---

### 分辨率：2K

---

## 图 7：骑行与感官唤醒

**场景**：周六上午，湖边绿道，骑行

**布局**：上下两格，3:4 竖版

---

### 正向提示词：

**上格（骑行）：** 侧拍，两人一前一后骑着黄色单车。湖边绿道，两旁是绿树和柳条，阳光明媚。

小茉在前面：参考图1中的年轻女性骑着黄色单车，穿着精心搭配的出游服装：白色短袖搭配淡黄色宽松裤子，穿着白色运动鞋。她微微侧着头，对着身后的小源说话，脸上带着"虽然我还在生气，但还是跟你说话"的表情，带着一点小埋怨。

小源在后面：参考图2中的年轻男性骑着黄色单车，跟着小茉。他穿着淡黄色休闲衬衫搭配白裤子，穿着白色运动鞋，表情无奈但也在听。

整个画面明亮、温暖，湖边绿道，两旁是绿树。

**下格（小源 POV）：** 小源的主观视角，模拟他眼中所见。

前景：自行车的车把，部分可见。

中景：前方小茉的背影，她穿着白色短袖搭配淡黄色宽松裤子，头发被风轻轻吹起。她骑着黄色单车，姿态轻松。

远景：波光粼粼的湖面，和煦的阳光，摇曳的柳条，远处的山影。整个画面色调非常明亮、温暖、治愈。

上下两格布局, medium shot for upper, POV shot for lower, 35mm lens, f/2.8, bright sunny day, lakeside scenery, hand-drawn illustration style, Japanese illustration style, warm healing tone, soft colors, 3:4 aspect ratio, sensory awakening

---

### 负向提示词：

阴天, 暗淡, 均匀布光, 
cloudy day, dark, even lighting, cartoon style, flat lighting

---

### 参考图：

需要上传 2 张参考图：
- 参考图1：小茉的人物形象
- 参考图2：小源的人物形象

**注意**：湖边场景为户外，无空间参考图，通过统一的环境描述保障一致性。

---

### 分辨率：2K

---

## 图 8：转变与和解

**场景**：周六下午，湖边栏杆，停驻与和解

**布局**：上下两格，3:4 竖版

---

### 正向提示词：

**上格（小源的笑容）：** 参考图2中的年轻男性面部特写。午后的阳光打在他的脸上，他的表情完全放松了下来，嘴角不自觉地上扬，露出了一个发自内心的、轻松的微笑。这是他这个故事里第一个真正的笑容。他穿着淡黄色休闲衬衫，头发被风吹得有点乱。背景是湖面和阳光，虚化处理。光线温暖明亮。

**下格（停驻与和解）：** 从侧后方拍摄，两人背影或侧影。

他们已经停下自行车，并排站在湖边的栏杆上，眺望着远方的湖景。两辆黄色的单车就停在他们身边。

小源主动伸出手，自然地环绕在小茉的肩膀上。小茉感受到他的示好，安心地将头靠在他的肩膀上，并且双手轻轻握住了他搭在自己肩上的手。

小茉穿着白色短袖搭配淡黄色宽松裤子，穿着白色运动鞋。小源穿着淡黄色休闲衬衫搭配白裤子，穿着白色运动鞋。

背景是波光粼粼的湖面，和煦的阳光，摇曳的柳条。整个画面温暖、治愈、满足。

上下两格布局, close-up for upper, medium shot for lower, 50mm lens, f/2.8, afternoon warm light, lakeside scenery, hand-drawn illustration style, Japanese illustration style, warm healing tone, soft colors, 3:4 aspect ratio, reconciliation

---

### 负向提示词：

正面拍摄, 均匀布光, 阴天, 
front view, even lighting, cloudy day, cartoon style, flat lighting

---

### 参考图：

需要上传 2 张参考图：
- 参考图1：小茉的人物形象
- 参考图2：小源的人物形象

**注意**：湖边场景为户外，无空间参考图，通过统一的环境描述保障一致性。

---

### 分辨率：2K

---

## 图 9：最终画面 / 呼应

**场景**：周六晚，客厅，和谐的居家时光

**布局**：单格，3:4 竖版

---

### 正向提示词：

周六晚上，温馨的客厅场景。与图 1 呼应，但不再是冷暖光分割，而是统一的暖光。

客厅的暖白色沙发上，两人都换上了舒适的睡衣，以最放松的姿态依偎在一起，身上盖着一条浅色毯子。

小茉：参考图1中的年轻女性，穿着紫色长袖长裤睡衣，安心地靠在小源的肩膀上，表情满足、安心。

小源：参考图2中的年轻男性，穿着灰色长袖长裤睡衣，手臂环绕着小茉，表情温柔、满足。

他们面前的茶几上放着水果盘，电视里播放着柔和的画面。整个场景被落地灯的暖黄色光笼罩，非常温馨。两人共同沐浴在统一的、温暖的灯光下，身体紧紧挨在一起。

这个画面与图 1 形成对比：图 1 是冷暖光分割的两个世界，图 9 是统一暖光的和谐世界。

wide shot, eye level, 35mm lens, f/2.8, warm ambient light, living room, cozy atmosphere, hand-drawn illustration style, Japanese illustration style, warm healing tone, soft colors, 3:4 aspect ratio, harmonious ending

---

### 负向提示词：

冷暖光对比, 两人分开坐, 均匀布光, 冷色调, 
warm cool contrast, sitting apart, even lighting, cold tones, cartoon style, flat lighting

---

### 参考图：

需要上传 3 张参考图：
- 参考图1：小茉的人物形象
- 参考图2：小源的人物形象
- 参考图3：空间图 D（客厅场景）

---

### 分辨率：2K

---

## 使用说明

### 完整生成顺序

```
第一步：生成 4 个空间参考图（见 05-prompts-spaces.md）
  1. 空间图 A：书房（周五晚）
  2. 空间图 B：卧室（周六早）
  3. 空间图 C：玄关（周六早）
  4. 空间图 D：客厅（周六晚）

第二步：准备人物参考图
  - 参考图1：小茉的人物形象
  - 参考图2：小源的人物形象

第三步：生成带人物的 9 张图
  - 图 1-2：上传人物1 + 人物2 + 空间图 A
  - 图 3：上传人物1 + 人物2 + 空间图 B
  - 图 4：上传人物1 + 空间图 B + 空间图 C（涉及卧室和玄关两个场景）
  - 图 5-6：上传人物1 + 人物2 + 空间图 C
  - 图 7-8：上传人物1 + 人物2（湖边场景，无空间参考图）
  - 图 9：上传人物1 + 人物2 + 空间图 D
```

### 参考图上传顺序

1. 先上传参考图1（小茉的人物形象）
2. 再上传参考图2（小源的人物形象）
3. 然后输入对应的提示词

### 服装一致性

| 场景 | 小茉服装 | 小源服装 |
|------|----------|----------|
| 场景一（周五晚） | 紫色长袖长裤睡衣 | 灰色长袖长裤睡衣 |
| 场景二（周六早） | 紫色睡衣 → 白色短袖 + 淡黄色宽松裤子 + 白鞋 | 灰色长袖长裤睡衣 |
| 场景三（周六上午） | 白色短袖 + 淡黄色宽松裤子 + 白鞋 | 淡黄色休闲衬衫 + 白裤子 + 白鞋 |
| 场景四（周六晚） | 紫色长袖长裤睡衣 | 灰色长袖长裤睡衣 |

### 风格标签

每张图都使用以下风格标签：
- hand-drawn illustration style（手绘插画风）
- Japanese illustration style（日系插画风格）
- warm healing tone（温暖治愈色调）
- soft colors（柔和色调）
- cinematic composition（电影感构图）

---

## 版本记录

- v1：基于 04-directing.md v2 生成，9 张图提示词
- v2：更新服装设定，居家/外出服装明确
- v3：添加一致性保障方案，创建空间参考图提示词（05-prompts-spaces.md）
- v4：添加手绘插画风风格标签（hand-drawn illustration style）
- v5：细化书房场景，两张桌子拼在一起，两人面向墙，窗户在左侧，白色/黑色人体工学椅
- v6：修正卧室场景，移除穿衣镜；玄关添加全身镜；图 4 镜子场景改为玄关
