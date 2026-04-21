# S01 图像提示词

## 概述

本文档包含 S01 场景的所有图像提示词，用于 Nano Banana 模型生成。

**风格基准：** 长安三万里超写实 3D 动画
**色彩基准：** 深灰偏蓝，冷调低饱和
**技术参数：** `hyperrealistic, in the visual style of Chang'an 30000 Miles, Lights Animation Studio style, cinematic 3D rendering, high quality CGI, Chinese aesthetic in 3D`

---

## 空间一致性策略

**核心原则：** 先生成威海卫海湾全景（S01-03）作为空间基准，后续镜头引用这个空间保持一致性。

**金雕基准：** S01-02-1 作为金雕视觉基准，后续涉及金雕的镜头引用它。

---

## 图像生成顺序与参考图需求

| 顺序 | 图像 | 作用 | 参考图需求 |
|------|------|------|-----------|
| 1 | S01-02-1 | 金雕视觉基准 | 无 |
| 2 | S01-03 | 威海卫海湾空间基准 | 无 |
| 3 | S01-04 | 炮台 | S01-03 |
| 4 | S01-05-1 | 黄龙旗首帧 | 无 |
| 5 | S01-05-2 | 黄龙旗尾帧 | S01-05-1 |
| 6 | S01-06 | 甲板 | S01-03 |
| 7 | S01-07 | 鹰盘旋 | S01-02-1 + S01-03 |
| 8 | S01-08 | 日军包围线 | S01-03 |
| 9 | S01-09-1 | 翼尖撞击前 | S01-02-1 |
| 10 | S01-09-2 | 翼尖撞击中 | S01-09-1 |
| 11 | S01-09-3 | 翼尖撞击后 | S01-09-1 |
| 12 | S01-10-1 | 鹰下坠首帧 | S01-02-1 |
| 13 | S01-10-2 | 鹰下坠尾帧 | S01-10-1 + S01-03 |
| 14 | S01-02-2 | 金雕加速俯冲 | S01-02-1 |

**总计：14 张图**

---

## 提示词详情

---

### 【S01-02-1】金雕穿云·首帧（中速穿行）

**正向提示词：**
```
近景镜头，金雕在深灰偏蓝的厚重云层中穿行，大雪飞掠而过。金雕翅膀展开占满画面三分之二以上，逆光轮廓光勾出金色边缘（全片第一个暖色元素——克制到极致只给边缘），鹰正面几乎全在阴影里。光源微弱晨光6000K冷白偏暖（黎明=冷暖交界点）。云层低饱和有厚度，雪花在画面中高速穿过形成动态线条。

medium close-up shot, golden eagle flying through thick gray-blue storm clouds, wings spread filling two-thirds of the frame, rim lighting creates thin golden edge contour (the first warm color element in the film), eagle's front almost entirely in shadow, heavy snow streaking rapidly across frame, weak dawn light 6000K cool-white with slight warmth, low saturation thick clouds, motion blur on snowflakes

hyperrealistic, in the visual style of Chang'an 30000 Miles, Lights Animation Studio style, cinematic 3D rendering, high quality CGI, Chinese aesthetic in 3D, cold desaturated color palette, volumetric lighting, physically accurate lighting, 85mm lens, f/2.8, photorealistic, 8K
```

**负向提示词：**
```
明亮画面, 均匀布光, 多光源, 鹰全身清晰可见, 温暖色调, 蓝天, 无云, 无雪, 卡通风格, 动漫风格,
bright scene, even lighting, multiple light sources, eagle fully visible in detail, warm color palette, blue sky, no clouds, no snow, cartoon style, anime style, flat lighting
```

**参考图：** 不需要（第一个镜头建立金雕视觉基准）
**分辨率：** 1K（16:9）

---

### 【S01-02-2】金雕穿云·尾帧（加速俯冲）

**正向提示词：**
```
近景镜头，金雕加速俯冲即将冲出云层，俯冲角度更陡。翅膀姿态略有变化，翼尖向后掠，身体更向前倾斜。深灰偏蓝厚重云层边缘可见（即将冲出），大雪飞掠而过。逆光轮廓光勾出金色边缘，鹰正面几乎全在阴影里。

medium close-up shot, golden eagle in steep diving posture, wings slightly swept back, body tilted forward aggressively, about to break through cloud layer, thick gray-blue storm clouds at edge, heavy snow streaking rapidly, rim lighting creates golden edge contour, eagle's front in shadow, diving angle steeper than previous shot

hyperrealistic, in the visual style of Chang'an 30000 Miles, Lights Animation Studio style, cinematic 3D rendering, high quality CGI, Chinese aesthetic in 3D, cold desaturated color palette, volumetric lighting, physically accurate lighting, 85mm lens, f/2.8, photorealistic, 8K
```

**负向提示词：**
```
明亮画面, 均匀布光, 多光源, 鹰全身清晰可见, 温暖色调, 蓝天, 无云, 无雪, 平飞姿态, 滑翔姿态,
bright scene, even lighting, multiple light sources, eagle fully visible, warm colors, blue sky, no clouds, no snow, level flight, gliding posture, cartoon style, anime style
```

**参考图：** 需要（使用 S01-02-1 作为金雕参考）
**分辨率：** 1K（16:9）

---

### 【S01-03】威海卫全景（空间基准）

**正向提示词：**
```
极远景镜头，鹰 POV，俯瞰威海卫海湾全景。鹰刚冲出云层——画面上方有厚重云层边缘（刚穿过的云），画面左右两侧也有稀薄残云正在消散，画面下方相对清晰（海湾全景展开）。海湾C形半包围结构，北洋舰船8-10艘在内侧（左），深灰近黑剪影，停泊态，黄龙旗下垂无风。日军舰船分散包围在外围（右），部分被雪雾遮蔽。海面深灰有浮冰，大雪纷飞能见度低。威海卫海岸线山脊积雪覆盖呈灰白色，有零星灯光。天空整体深灰偏蓝压抑色调，远处炮火暗红闪光是画面唯一暖点。

extreme long shot, eagle POV, aerial view of Weihaiwei Bay, eagle just breaking through cloud layer, thick gray-blue cloud layer edge at top of frame (clouds just passed through), thin remnant clouds dissipating on left and right sides of frame, lower portion relatively clear showing full bay panorama, C-shaped bay formation, 8-10 Beiyang warships on left side as dark gray silhouettes, anchored position, yellow dragon flags hanging limp, Japanese warships dispersed in encirclement on right side, partially obscured by snow fog, dark gray sea surface with floating ice, heavy snow falling, low visibility, snow-covered mountain ridge along coastline with scattered lights, deep gray-blue oppressive sky, distant artillery flash in dark red as only warm point in frame

hyperrealistic, in the visual style of Chang'an 30000 Miles background art, Lights Animation Studio style, cinematic 3D rendering, high quality CGI, Chinese aesthetic in 3D, cold desaturated color palette, aerial perspective, atmospheric depth, physically accurate cloud distribution around viewer, 35mm lens, f/4.0, photorealistic, 8K
```

**负向提示词：**
```
晴天, 蓝天, 明亮, 无雪, 无浮冰, 整齐排列的军舰, 清晰可见的包围圈, 温暖色调, 高饱和度, 只有顶部有云层, 完全脱离云层,
clear weather, blue sky, bright scene, no snow, no ice, neatly arranged warships, clearly visible encirclement, warm colors, high saturation, clouds only at top, completely clear of clouds, cartoon style
```

**参考图：** 不需要（空间建立镜头）
**分辨率：** 1K（16:9）

---

### 【S01-04】克虏伯巨炮

**正向提示词：**
```
中景镜头，鹰 POV，飞过炮台。同一空间环境参考图S01-03。克虏伯巨炮炮管黑色钢铁，缺乏保养，表面有锈蚀痕迹和剥落的油漆，炮管上有积雪。炮管从左下向右上延伸（对角线构图），炮口指向外海方向，炮口内膛漆黑吞噬光线。炮架铸铁深灰色铆钉加强筋，有锈迹。炮台水泥地面有裂缝和弹片痕迹，积雪覆盖。大雪在飘落。背景雪白刘公岛山脊（失焦）与黑色炮管极高对比。黎明侧光从左侧打来，炮管表面狭长高光带=钢铁寒光。

medium shot, eagle POV, flying past coastal battery, same spatial environment as reference image S01-03, Krupp cannon black steel barrel lacking maintenance with rust marks and peeling paint, snow on barrel, diagonal composition, muzzle pointing toward open sea, dark muzzle interior, cast iron carriage with rivets showing rust, cracked concrete floor with shrapnel marks, snow-covered ground, heavy snow falling, blurred snow-white Liugong Island mountain ridge in background, dawn side light from left

hyperrealistic, in the visual style of Chang'an 30000 Miles background art, Lights Animation Studio style, cinematic 3D rendering, high quality CGI, Chinese aesthetic in 3D, cold desaturated, high contrast, neglected weapon, 50mm lens, f/4.0, photorealistic, 8K
```

**负向提示词：**
```
明亮画面, 无雪, 无积雪, 温暖色调, 新炮管, 保养良好, 光洁表面, 干净地面, 蓝天, 清晰背景,
bright scene, no snow, no snow accumulation, warm colors, new cannon barrel, well-maintained, pristine surface, clean ground, blue sky, sharp background, cartoon style
```

**参考图：** 需要（使用 S01-03 作为空间参考）
**分辨率：** 1K（16:9）

---

### 【S01-05-1】黄龙旗·首帧（光线强）

**正向提示词：**
```
近景镜头，鹰 POV，仰拍黄龙旗。黄龙旗明黄色Pantone 116C丝绸质地，五爪金龙深蓝刺绣，有磨损边缘但黄色仍然鲜明（大清最后的体面）。旗杆深色木质/铁质粗糙有缆绳痕。侧逆光旗面透光金黄色近乎发光（全片最纯粹的黄色展示）。风雪刚开始卷来，灰白偏蓝6500K极冷，从右下向左上蔓延。大雪与雾混合。

medium close-up shot, eagle POV, low angle looking up at Yellow Dragon Flag, bright yellow Pantone 116C silk fabric with dark blue five-claw dragon embroidery, worn edges but yellow still vivid, dark wooden/iron flagpole with rope marks, strong backlit translucent flag glowing golden yellow (the purest yellow in the film), wind and snow just starting to swirl in from lower right, gray-white-blue 6500K extremely cold tone, heavy snow mixing with fog

hyperrealistic, in the visual style of Chang'an 30000 Miles, Lights Animation Studio style, cinematic 3D rendering, high quality CGI, Chinese aesthetic in 3D, golden yellow as focal point against cold desaturated background, dramatic backlighting, 85mm lens, f/2.8, photorealistic, 8K
```

**负向提示词：**
```
均匀布光, 无风雪, 温暖环境, 新旗, 无磨损, 多光源, 风雪吞没,
even lighting, no wind or snow, warm environment, new flag, no wear, multiple light sources, flag obscured by snow
```

**参考图：** 不需要
**分辨率：** 1K（16:9）

---

### 【S01-05-2】黄龙旗·尾帧（风雪吞没）

**正向提示词：**
```
近景镜头，鹰 POV，仰拍黄龙旗被风雪吞没。金黄色被洗掉，只剩隐约旗杆轮廓。风雪密度极大，灰白偏蓝6500K极冷，雪雾弥漫，能见度极低。旗面几乎不可见，被风雪遮蔽。光线被风雪散射，对比度急剧下降。

medium close-up shot, eagle POV, low angle, Yellow Dragon Flag being swallowed by blizzard, golden yellow washed out, only faint flagpole silhouette visible, extremely dense wind and snow, gray-white-blue 6500K extremely cold, heavy snow fog, very low visibility, flag face almost invisible, obscured by snow, light scattered by snow, contrast dramatically reduced

hyperrealistic, in the visual style of Chang'an 30000 Miles, Lights Animation Studio style, cinematic 3D rendering, high quality CGI, Chinese aesthetic in 3D, cold desaturated, low contrast, atmospheric fog, 85mm lens, f/2.8, photorealistic, 8K
```

**负向提示词：**
```
明亮画面, 金黄色清晰可见, 无风雪, 高对比度, 温暖色调, 清晰旗面,
bright scene, golden yellow clearly visible, no blizzard, high contrast, warm colors, clear flag face
```

**参考图：** 需要（使用 S01-05-1 作为参考）
**分辨率：** 1K（16:9）

---

### 【S01-06】定远舰甲板

**正向提示词：**
```
中远景镜头，鹰 POV，中高角度俯拍定远舰甲板。同一空间环境参考图S01-03。甲板钢铁灰色防滑纹路，有海盐腐蚀白斑和油污痕迹，积雪覆盖部分区域。主炮塔炮口朝前（停泊态非战斗态），炮塔上有积雪。桅杆帆索收拢信号旗未升。散落物件：粗麻缆绳一盘未整理（被雪部分覆盖）、木箱半开、扫帚靠舱壁（被雪覆盖）。远处可能有一个士兵背影一动不动像雕塑。海面深灰色有浮冰，大雪纷飞。黎明天光5500K中性偏冷弱。

medium long shot, eagle POV, medium-high angle looking down at Dingyuan battleship deck, same spatial environment as reference image S01-03, steel gray deck with anti-slip pattern, salt corrosion and oil stains, snow covering parts of deck, main turret muzzle forward, snow on turret, mast rigging stowed, scattered objects: coiled rope partially snow-covered, half-open crate, broom against bulkhead, possible soldier silhouette motionless, dark gray sea with floating ice, heavy snow, dawn light 5500K

hyperrealistic, in the visual style of Chang'an 30000 Miles background art, Lights Animation Studio style, cinematic 3D rendering, high quality CGI, Chinese aesthetic in 3D, cold desaturated, low key, 50mm lens, f/4.0, photorealistic, 8K
```

**负向提示词：**
```
明亮画面, 无雪, 无积雪, 无浮冰, 战斗状态, 活动士兵, 温暖色调, 高饱和度,
bright scene, no snow, no snow accumulation, no floating ice, combat ready, active soldiers, warm colors, high saturation
```

**参考图：** 需要（使用 S01-03 作为空间参考）
**分辨率：** 1K（16:9）

---

### 【S01-07】鹰盘旋

**正向提示词：**
```
远景镜头，客观视角，高角度俯拍。同一空间环境参考图S01-03。金雕在舰队上方盘旋，翅膀展开滑翔不扇动，像一个沉默的守望者。舰队8-10艘舰船暗影剪影全无动态，缩成下部一簇暗影。天空深灰偏蓝压抑色调，大雪纷飞，雪雾让远处模糊。漫射光6000K冷白强度弱，整体极度低调接近单色灰阶为主。

long shot, objective view, high angle, same spatial environment as reference image S01-03, golden eagle from reference image S01-02-1 circling above the fleet, wings spread gliding, silent guardian posture, 8-10 warship silhouettes below, deep gray-blue oppressive sky, heavy snow, snow fog blurring distance, diffused light 6000K weak, extremely low key, nearly monochromatic

hyperrealistic, in the visual style of Chang'an 30000 Miles, Lights Animation Studio style, cinematic 3D rendering, high quality CGI, Chinese aesthetic in 3D, cold desaturated, nearly monochromatic, 85mm lens, f/4.0, photorealistic, 8K
```

**负向提示词：**
```
明亮画面, 鹰扇动翅膀, 活跃舰队, 温暖色调, 蓝天, 无雪, 高对比度,
bright scene, eagle flapping wings, active fleet, warm colors, blue sky, no snow, high contrast
```

**参考图：** 需要（使用 S01-02-1 作为金雕参考，S01-03 作为空间参考）
**分辨率：** 1K（16:9）

---

### 【S01-08】日军包围线

**正向提示词：**
```
远景镜头，鹰 POV，高角度俯拍日军舰队。同一空间环境参考图S01-03。日军舰船分散包围（非整齐排列的半圆），舰身浅灰/白色（新舰），烟囱有烟在运作中。大雪纷飞能见度低，雪雾让远处模糊，看不到完整包围圈，只能看到部分舰船形成"感觉被包围"而非"看到完整包围"。外海深蓝色稍亮有微浪。

long shot, eagle POV, high angle, same spatial environment as reference image S01-03, Japanese fleet in dispersed encirclement, ship hulls light gray/white, smoke from stacks, heavy snow with low visibility, snow fog obscuring distance, incomplete view of encirclement, open sea deep blue slightly brighter, dawn light

hyperrealistic, in the visual style of Chang'an 30000 Miles background art, Lights Animation Studio style, cinematic 3D rendering, high quality CGI, Chinese aesthetic in 3D, cold desaturated, atmospheric fog, 35mm lens, f/4.0, photorealistic, 8K
```

**负向提示词：**
```
整齐排列, 完整包围圈可见, 晴天, 无雪, 温暖色调, 高对比度, 蓝天,
neat formation, complete encirclement visible, clear weather, no snow, warm colors, high contrast, blue sky
```

**参考图：** 需要（使用 S01-03 作为空间参考）
**分辨率：** 1K（16:9）

---

### 【S01-09-1】翼尖特写·首帧（撞击前）

**正向提示词：**
```
特写镜头，鹰翼逆光金色边缘，羽毛整齐排列，滑翔姿态完美。大雪纷飞。翼尖占满画面三分之二以上，羽毛纹理清晰可见。黎明恒定光，逆光轮廓光。

close-up shot, golden eagle wing tip with golden rim lighting edge, feathers neatly arranged in perfect gliding posture, heavy snow falling, wing tip filling two-thirds of frame, feather texture clearly visible, dawn light, backlight rim lighting

hyperrealistic, in the visual style of Chang'an 30000 Miles, Lights Animation Studio style, cinematic 3D rendering, high quality CGI, Chinese aesthetic in 3D, golden rim lighting against cold background, 85mm lens, f/2.8, photorealistic, 8K
```

**负向提示词：**
```
凌乱羽毛, 断裂羽毛, 撞击痕迹, 均匀布光, 无雪, 温暖色调,
disheveled feathers, broken feathers, impact marks, even lighting, no snow, warm colors
```

**参考图：** 需要（使用 S01-02-1 作为金雕参考）
**分辨率：** 1K（16:9）

---

### 【S01-09-2】翼尖特写·中间帧（撞击瞬间）

**正向提示词：**
```
特写镜头，流弹从画面右外侧高速切入翼尖，只看到一道残影和空气波纹。雪花在撞击瞬间被气流卷起。翼尖外端三根飞羽根部即将断裂。黎明恒定光。

close-up shot, projectile cutting into wing tip from right side of frame, only a blur trail and air ripple visible, snowflakes being whipped up by air disturbance at impact moment, three outer flight feathers at root about to break, dawn light

hyperrealistic, in the visual style of Chang'an 30000 Miles, Lights Animation Studio style, cinematic 3D rendering, high quality CGI, Chinese aesthetic in 3D, motion blur on projectile, dynamic air disturbance, 85mm lens, f/2.8, photorealistic, 8K
```

**负向提示词：**
```
清晰可见的子弹, 羽毛已散落, 均匀布光, 无雪, 温暖色调,
clearly visible bullet, feathers already scattered, even lighting, no snow, warm colors
```

**参考图：** 需要（使用 S01-09-1 作为参考）
**分辨率：** 1K（16:9）

---

### 【S01-09-3】翼尖特写·尾帧（羽毛炸开）

**正向提示词：**
```
极特写镜头，翼尖外端三根飞羽根部断裂，羽毛炸开向四周散落，每一片羽毛短暂反射逆光形成金色碎片飘散（美的毁灭）。背景深灰偏蓝天空。大雪纷飞。

extreme close-up shot, three outer flight feathers broken at root, feathers exploding outward in all directions, each feather briefly catching backlight creating golden fragments drifting (beautiful destruction), deep gray-blue sky background, heavy snow falling

hyperrealistic, in the visual style of Chang'an 30000 Miles, Lights Animation Studio style, cinematic 3D rendering, high quality CGI, Chinese aesthetic in 3D, golden feather fragments against cold sky, dramatic moment, 85mm lens, f/2.8, photorealistic, 8K
```

**负向提示词：**
```
整齐羽毛, 无羽毛散落, 均匀布光, 无雪, 温暖色调, 清晰背景,
neat feathers, no scattered feathers, even lighting, no snow, warm colors, sharp background
```

**参考图：** 需要（使用 S01-09-1 作为参考）
**分辨率：** 1K（16:9）

---

### 【S01-10-1】鹰下坠·首帧（天空背景）

**正向提示词：**
```
中近景镜头，客观视角，平角度与鹰同高。鹰被击中后开始下坠，翅膀开始向内折叠，不对称（被击中的右翼折叠更快），整个身形在收缩。背景天空和残云，大雪纷飞，雪花因下坠速度而在画面中形成线条。

medium close-up shot, objective view, eye level with eagle, eagle beginning to fall after being hit, wings starting to fold inward asymmetrically (right wing hit folds faster), body posture contracting, sky and remnant clouds background, heavy snow falling, snowflakes forming streaks due to falling speed

hyperrealistic, in the visual style of Chang'an 30000 Miles, Lights Animation Studio style, cinematic 3D rendering, high quality CGI, Chinese aesthetic in 3D, desperate falling posture, 85mm lens, f/2.8, photorealistic, 8K
```

**负向提示词：**
```
舒展翅膀, 对称姿态, 滑翔姿态, 温暖色调, 蓝天, 无雪,
spread wings, symmetric posture, gliding posture, warm colors, blue sky, no snow
```

**参考图：** 需要（使用 S01-02-1 作为金雕参考）
**分辨率：** 1K（16:9）

---

### 【S01-10-2】鹰下坠·尾帧（海面背景）

**正向提示词：**
```
中近景镜头，客观视角，鹰继续急速下坠，翅膀折叠更多，姿态更加狼狈。同一空间环境参考图S01-03。背景放大后显示海面、舰队剪影和浮冰。大雪纷飞，雪花因下坠速度形成更密集的线条。光线因速度而模糊化。

medium close-up shot, objective view, eagle from reference image S01-10-1 continuing rapid fall, wings folded more, desperate posture, same spatial environment as reference image S01-03, background enlarged showing sea surface, fleet silhouettes and floating ice, heavy snow, denser snowflake streaks, light blurring due to speed

hyperrealistic, in the visual style of Chang'an 30000 Miles, Lights Animation Studio style, cinematic 3D rendering, high quality CGI, Chinese aesthetic in 3D, motion blur, desperate descent, 85mm lens, f/2.8, photorealistic, 8K
```

**负向提示词：**
```
舒展翅膀, 天空背景, 温暖色调, 清晰画面, 无雪,
spread wings, sky background, warm colors, sharp image, no snow
```

**参考图：** 需要（使用 S01-10-1 和 S01-03 作为参考）
**分辨率：** 1K（16:9）

---

## 注意事项

1. **生成顺序**：按照上表顺序生成，确保参考图已准备好
2. **空间一致性**：S01-03 是空间基准，涉及威海卫海湾的镜头都引用它
3. **金雕一致性**：S01-02-1 是金雕基准，后续涉及金雕的镜头都引用它
4. **物理真实**：冲出云层后周围都有残云，不只是上方
5. **叙事逻辑**：炮台是"缺乏保养"状态，体现"困兽爪牙"
