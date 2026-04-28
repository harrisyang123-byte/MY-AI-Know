# Qinglv — 空间参考图提示词

> 用于先生成空间参考图，保障环境一致性。
> 生成顺序：先空间参考图 → 再人物参考图 → 最后生成带人物的图。

---

## 空间图 A：书房（周五晚）

**用途**：图 1、图 2 的空间参考

---

### 正向提示词：

周五晚上，温馨的书房场景。两张书桌拼在一起，形成一个长条形的工作区域。两人都面向墙坐着。

左侧（女生的区域）：暖黄色台灯光笼罩。书桌前有一把白色人体工学椅子。书桌上有带鱼屏显示器，屏幕上显示着美好的风景或旅行攻略。桌面整洁，有台灯、键盘、鼠标。左侧有窗户，窗帘半掩。暖黄色灯光营造出温暖、有序、向外探索的氛围。

右侧（男生的区域）：显示器冷色调蓝光为主。书桌前有一把黑色人体工学椅子。屏幕上是激烈的游戏画面。桌面有键盘、鼠标、游戏手柄。冷蓝色光营造出冷静、专注、向内沉浸的氛围。

房间整体较暗，只有两盏灯（台灯和显示器）作为光源。冷暖光形成强烈对比。窗户在左侧，有窗帘。

wide shot, eye level, 35mm lens, f/2.8, cinematic composition, split lighting, warm cool contrast, no people, empty room, study room, dual desk setup, white ergonomic chair, black ergonomic chair, window on left side, hand-drawn illustration style, Japanese illustration style, warm healing tone, soft colors, 3:4 aspect ratio

---

### 负向提示词：

人物, 均匀布光, 明亮室内, 单一光源, 
any person, even lighting, bright interior, single light source, cartoon style, flat lighting

---

### 分辨率：2K

---

## 空间图 B：卧室（周六早）

**用途**：图 3、图 4 的空间参考

---

### 正向提示词：

周六清晨，温馨的卧室场景。清晨的阳光从窗户洒入，整个房间沐浴在柔和的晨光中。

一张双人床居中摆放，床头靠墙。床的一侧是窗户，清晨的阳光透过窗帘洒入，形成柔和的光晕。另一侧是床头柜，床头柜上有台灯。床上有一床大被子，被子下隐约可见两个枕头。

房间一侧有衣柜，衣柜门关闭。

整个房间明亮、温暖、充满清晨的活力感。晨光从窗户斜射入，形成柔和的光影。

wide shot, eye level, 35mm lens, f/2.8, morning natural light, golden hour, cinematic composition, bedroom, no people, empty room, hand-drawn illustration style, Japanese illustration style, warm healing tone, soft colors, 3:4 aspect ratio

---

### 负向提示词：

人物, 均匀布光, 暗淡室内, 
any person, even lighting, dark interior, cartoon style, flat lighting

---

### 分辨率：2K

---

## 空间图 C：玄关+客厅（周六早）

**用途**：图 5、图 6 的空间参考

---

### 空间布局说明

玄关和客厅是同一个连续的大空间，入户门进来后直接看到客厅区域。

**空间布局（俯视图）：**

```
          阳台落地窗（整面）
    ==============================
    |                            |
[沙发] ————— [茶几] ————— [电视]
    |
[落地灯]
    |
[全身镜]  [挂衣钩]  [鞋柜]
    |
  入户门
```

**相对位置：**
- 入户门在空间的一角
- 入户门进来，左侧是玄关区域（鞋柜、全身镜、挂衣钩）
- 入户门进来，正前方是客厅区域
- 客厅区域：沙发在左侧（靠墙），电视在右侧（对面墙），茶几在中间
- 阳台落地窗：沙发和电视旁边是一整面阳台落地窗，贯穿整个客厅区域
- 落地灯在沙发旁边

---

### 正向提示词：

周六早晨，温馨的玄关+客厅场景。玄关和客厅是同一个连续的大空间，入户门进来后直接看到客厅区域。早晨的自然光从两侧窗户洒入。

**玄关区域（入户门附近）：**
- 入户门在空间的一角
- 门旁边是鞋柜，上面放着几双鞋
- 鞋柜旁边有全身镜，镜框简洁
- 墙上有挂衣钩，挂着几件外套
- 有一个小凳子，方便换鞋

**客厅区域（入户门正前方）：**
- 沙发在左侧，靠墙摆放，暖白色，沙发上有一条浅色毯子
- 电视在右侧，对面墙，电视柜简洁
- 茶几在沙发和电视之间，上面放着水果盘
- 落地灯在沙发旁边，发出暖黄色的光
- 阳台落地窗：沙发和电视旁边是一整面阳台落地窗，贯穿整个客厅区域，窗帘半掩

地面是木地板，干净整洁。整个空间明亮、整洁、充满生活气息。早晨的自然光从阳台落地窗洒入，形成柔和的光影。

wide shot, eye level, 35mm lens, f/2.8, morning natural light, cinematic composition, open plan living space, entrance hall connected to living room, full body mirror, shoe cabinet, coat hooks, sofa, coffee table, TV, floor lamp, large balcony floor-to-ceiling window, no people, empty room, hand-drawn illustration style, Japanese illustration style, warm healing tone, soft colors, 3:4 aspect ratio

---

### 负向提示词：

人物, 均匀布光, 暗淡室内, 
any person, even lighting, dark interior, cartoon style, flat lighting

---

### 分辨率：2K

---

## 空间图 D：玄关+客厅（周六晚）

**用途**：图 9 的空间参考

---

### 空间布局说明

与空间图 C 是同一个空间，但时间不同（周六晚上），光线氛围不同。

**空间布局（俯视图）：**

```
          阳台落地窗（整面）
    ==============================
    |                            |
[沙发] ————— [茶几] ————— [电视]
    |
[落地灯]
    |
[全身镜]  [挂衣钩]  [鞋柜]
    |
  入户门
```

---

### 正向提示词：

周六晚上，温馨的玄关+客厅场景。玄关和客厅是同一个连续的大空间，入户门进来后直接看到客厅区域。与书房形成呼应，但不再是冷暖光分割，而是统一的暖光。

**玄关区域（入户门附近）：**
- 入户门在空间的一角
- 门旁边是鞋柜
- 鞋柜旁边有全身镜
- 墙上有挂衣钩
- 有一个小凳子

**客厅区域（入户门正前方）：**
- 沙发在左侧，靠墙摆放，暖白色，沙发上有一条浅色毯子
- 电视在右侧，对面墙，播放着柔和的画面
- 茶几在沙发和电视之间，上面放着水果盘
- 落地灯在沙发旁边，发出暖黄色的光，笼罩整个空间
- 阳台落地窗：沙发和电视旁边是一整面阳台落地窗，窗帘拉上，外面是夜晚的城市灯光（模糊可见）

地面是木地板。整个空间温馨、舒适、充满家的感觉。统一的暖黄色灯光，营造出和谐、宁静的氛围。

wide shot, eye level, 35mm lens, f/2.8, warm ambient light, open plan living space, entrance hall connected to living room, full body mirror, shoe cabinet, coat hooks, sofa, coffee table, TV, floor lamp, large balcony floor-to-ceiling window, no people, empty room, cozy atmosphere, hand-drawn illustration style, Japanese illustration style, warm healing tone, soft colors, 3:4 aspect ratio

---

### 负向提示词：

人物, 均匀布光, 冷色调, 冷暖光对比, 
any person, even lighting, cold tones, warm cool contrast, cartoon style, flat lighting

---

### 分辨率：2K

---

## 使用说明

### 生成顺序

```
1. 生成空间图 A（书房）
2. 生成空间图 B（卧室）
3. 生成空间图 C（玄关）
4. 生成空间图 D（客厅）
5. 上传人物参考图1（小茉）
6. 上传人物参考图2（小源）
7. 生成图 1-9（带人物）
```

### 参考图使用方式

生成带人物的图时，需要上传 **3 张参考图**：

| 参考图 | 用途 |
|--------|------|
| 参考图1 | 小茉的人物形象 |
| 参考图2 | 小源的人物形象 |
| 参考图3 | 对应的空间参考图 |

**提示词中写法**：
- `the person from reference image 1`（小茉）
- `the person from reference image 2`（小源）
- `in the location from reference image 3`（空间）

### 各图对应的空间参考图

| 图 | 场景 | 空间参考图 |
|----|------|------------|
| 图 1 | 书房 | 空间图 A |
| 图 2 | 书房 | 空间图 A |
| 图 3 | 卧室 | 空间图 B |
| 图 4 | 卧室+玄关 | 空间图 B + 空间图 C |
| 图 5 | 玄关+客厅 | 空间图 C |
| 图 6 | 玄关+客厅 | 空间图 C |
| 图 7 | 湖边 | 无（户外场景） |
| 图 8 | 湖边 | 无（户外场景） |
| 图 9 | 玄关+客厅 | 空间图 D |

**注意**：空间图 C 和空间图 D 是同一个空间（玄关+客厅），区别在于时间（周六早 vs 周六晚）和光线氛围。

---

## 版本记录

- v1：创建 4 个空间参考图提示词
- v2：添加手绘插画风风格标签（hand-drawn illustration style）
- v3：修正卧室场景，改为双人床+一床大被子，衣柜门关闭（空房间状态）
- v4：细化书房场景，两张桌子拼在一起，两人面向墙，窗户在左侧，白色/黑色人体工学椅
- v5：修正卧室场景，移除穿衣镜，床一侧是窗户，另一侧是床头柜+台灯；玄关添加全身镜
- v6：将玄关和客厅合并为同一个连续空间，添加详细的空间布局图和家具相对位置
- v7：将窗户改为一整面阳台落地窗，贯穿整个客厅区域
