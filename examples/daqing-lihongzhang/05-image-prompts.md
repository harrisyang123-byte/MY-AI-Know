# S01 图像提示词

## 概述

本文档包含 S01 场景的所有图像提示词，用于 Nano Banana 模型生成。

**风格基准：** 长安三万里超写实 3D 动画
**色彩基准：** 深灰偏蓝，冷调低饱和
**技术参数：** `hyperrealistic, in the visual style of Chang'an 30000 Miles, Lights Animation Studio style, cinematic 3D rendering, high quality CGI, Chinese aesthetic in 3D`

---

## 空间一致性策略

**核心原则：**
1. 先生成金雕视觉基准（S01-02-1），后续涉及金雕的镜头引用它
2. 先生成威海卫海湾全景（S01-03-1）作为空间基准，后续镜头引用这个空间保持一致性
3. S01-03 是连续的鹰POV长镜头，需要4张图保证连续性

---

## 图像生成顺序与参考图需求

| 顺序 | 图像 | 作用 | 参考图需求 |
|------|------|------|-----------|
| 1 | S01-02-1 | 金雕正面（视觉基准） | 无 |
| 2 | S01-02-2 | 金雕侧拍俯冲 | S01-02-1 |
| 3 | S01-02-3 | 鹰眼睛特写（转场） | S01-02-1 |
| 4 | S01-03-1 | 威海卫海湾全景（空间基准） | 无 |
| 5 | S01-03-2 | 克虏伯巨炮（飞行路径中间点） | S01-03-1 |
| 6 | S01-03-3 | 黄龙旗·海面船上（飞行路径中间点） | S01-03-1 |
| 7 | S01-03-4 | 定远舰甲板（尾帧） | S01-03-1 |
| 8 | S01-04 | 鹰盘旋 | S01-02-1 + S01-03-1 |
| 9 | S01-05 | 日军包围线 | S01-03-1 |
| 10 | S01-06-1 | 翼尖撞击前 | S01-02-1 |
| 11 | S01-06-2 | 翼尖撞击中 | S01-06-1 |
| 12 | S01-06-3 | 翼尖撞击后 | S01-06-1 |
| 13 | S01-07-1 | 鹰下坠首帧 | S01-02-1 |
| 14 | S01-07-2 | 鹰下坠尾帧 | S01-07-1 + S01-03-1 |

**总计：14 张图**

---

## 提示词详情

---

### 【S01-02-1】金雕穿云·首帧（仰拍正面）

**正向提示词：**
```
近景镜头，仰拍视角，金雕在深灰偏蓝的厚重云层中俯冲穿行。金雕正面朝向镜头，头朝向镜头（在画面上方），胸部朝向镜头。翅膀横向展开占满画面大部分，翼尖向两侧延伸。逆光轮廓光从鹰的背后（上方）打来，勾出翅膀边缘和身体轮廓的金色边缘（全片第一个暖色元素——克制到极致只给边缘），鹰的正面（胸部）几乎全在阴影里。大雪从画面上方高速掠过。光源微弱晨光6000K冷白偏暖（黎明=冷暖交界点）。云层低饱和有厚度。

medium close-up shot, low angle looking up at a golden eagle diving through thick gray-blue storm clouds. The eagle's front (chest) facing the camera, head facing the camera (at the top of frame), chest toward camera. Wings spread horizontally across the frame, wingtips extending to both sides. Rim lighting from behind (above) creates thin golden edge contour on wings and body (the first warm color element in the film), while the eagle's front (chest) remains almost entirely in shadow. Heavy snow streaking rapidly from top of frame, weak dawn light 6000K cool-white with slight warmth, low saturation thick clouds

hyperrealistic, in the visual style of Chang'an 30000 Miles, Lights Animation Studio style, cinematic 3D rendering, high quality CGI, Chinese aesthetic in 3D, cold desaturated color palette, volumetric lighting, physically accurate lighting, 85mm lens, f/2.8, photorealistic, 8K
```

**负向提示词：**
```
明亮画面, 均匀布光, 多光源, 鹰全身清晰可见, 温暖色调, 蓝天, 无云, 无雪, 卡通风格, 动漫风格, 鹰腹部朝向镜头, 鹰背面朝向镜头, 侧面视角,
bright scene, even lighting, multiple light sources, eagle fully visible in detail, warm color palette, blue sky, no clouds, no snow, cartoon style, anime style, flat lighting, eagle belly facing camera, eagle back facing camera, side view
```

**参考图：** 不需要（第一个镜头建立金雕视觉基准）
**分辨率：** 1K（16:9）

---

### 【S01-02-2】金雕穿云·中间帧（侧拍俯冲）

**正向提示词：**
```
近景镜头，侧拍视角，金雕俯冲穿过云层。金雕侧面朝向镜头，头朝向下方（俯冲方向），翅膀展开向后掠。可以清晰看到鹰的俯冲姿态：身体呈流线型，头在最前方，双翼向后延伸。深灰偏蓝厚重云层在画面中快速掠过。逆光轮廓光勾出翅膀和身体边缘的金色轮廓。大雪从画面上方高速掠过。

medium close-up shot, side view of a golden eagle diving through thick gray-blue storm clouds. The eagle's side profile facing the camera, head pointing downward (diving direction), wings spread and swept back. Clear view of diving posture: streamlined body, head at the front, wings extending backward. Thick gray-blue clouds streaking rapidly through frame. Rim lighting creates thin golden edge contour on wings and body. Heavy snow streaking rapidly from top of frame

hyperrealistic, in the visual style of Chang'an 30000 Miles, Lights Animation Studio style, cinematic 3D rendering, high quality CGI, Chinese aesthetic in 3D, cold desaturated color palette, volumetric lighting, physically accurate lighting, 85mm lens, f/2.8, photorealistic, 8K
```

**负向提示词：**
```
明亮画面, 均匀布光, 多光源, 鹰全身清晰可见, 温暖色调, 蓝天, 无云, 无雪, 平飞姿态, 滑翔姿态, 正面视角, 背面视角,
bright scene, even lighting, multiple light sources, eagle fully visible, warm colors, blue sky, no clouds, no snow, level flight, gliding posture, front view, back view, cartoon style, anime style
```

**参考图：** 需要（使用 S01-02-1 作为金雕参考）
**分辨率：** 1K（16:9）

---

### 【S01-02-3】鹰眼睛特写（转场）

**正向提示词：**
```
特写镜头，金雕眼睛。金雕头部侧面朝向镜头，眼睛占据画面中心。鹰眼金黄色虹膜，瞳孔黑色收缩（专注状态），眼睛周围有细密的羽毛纹理。逆光从侧面打来，眼睛边缘有金色轮廓光。背景是模糊的深灰偏蓝云层。大雪在画面中飞舞。这是从客观视角到鹰POV的转场镜头。

close-up shot, golden eagle eye. Eagle's head side profile facing the camera, eye occupies center of frame. Golden-yellow iris, black contracted pupil (focused state), fine feather texture around the eye. Rim lighting from the side creates golden edge contour on the eye. Blurred dark gray-blue cloud background. Heavy snow dancing in frame. This is a transition shot from objective view to eagle POV.

hyperrealistic, in the visual style of Chang'an 30000 Miles, Lights Animation Studio style, cinematic 3D rendering, high quality CGI, Chinese aesthetic in 3D, cold desaturated color palette, shallow depth of field, 85mm lens, f/1.8, photorealistic, 8K
```

**负向提示词：**
```
明亮画面, 均匀布光, 多光源, 温暖色调, 蓝天, 无雪, 人眼, 清晰背景, 大景深,
bright scene, even lighting, multiple light sources, warm colors, blue sky, no snow, human eye, sharp background, deep depth of field, cartoon style, anime style
```

**参考图：** 需要（使用 S01-02-1 作为金雕参考）
**分辨率：** 1K（16:9）

---

## S01-03 鹰POV长镜头·俯瞰威海卫（连续飞行）

**这是一个连续的长镜头，需要4张图保证视觉连续性**

---

### 【S01-03-1】威海卫海湾全景（首帧，空间基准）

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

**参考图：** 不需要（空间基准图）
**分辨率：** 1K（16:9）

---

### 【S01-03-2】克虏伯巨炮中景（飞行路径中间点）

**正向提示词：**
```
中景镜头，鹰 POV，飞过炮台。克虏伯巨炮炮管黑色钢铁，有使用痕迹但缺乏保养。炮管上有积雪。炮口内膛漆黑吞噬光线。炮架铸铁深灰色铆钉加强筋。炮台水泥地面有裂缝和弹片痕迹，积雪覆盖。大雪在飘落。背景雪白刘公岛山脊（失焦）与黑色炮管极高对比。对角线构图，炮管从左下向右上延伸，炮口指向外海方向。

medium shot, eagle POV, flying past artillery battery. Krupp cannon barrel in black steel with signs of use but lacking maintenance. Snow accumulation on the barrel. Cannon muzzle interior pitch black absorbing light. Cast iron gun carriage in dark gray with rivets and reinforcement ribs. Concrete gun platform with cracks and shrapnel marks, covered in snow. Heavy snow falling. Background shows snow-white Liugong Island ridge (out of focus) creating extreme contrast with black cannon barrel. Diagonal composition, cannon barrel extending from lower left to upper right, muzzle pointing toward open sea.

hyperrealistic, in the visual style of Chang'an 30000 Miles, Lights Animation Studio style, cinematic 3D rendering, high quality CGI, Chinese aesthetic in 3D, cold desaturated color palette, volumetric lighting, physically accurate lighting, 50mm lens, f/4.0, photorealistic, 8K
```

**负向提示词：**
```
晴天, 蓝天, 明亮, 无雪, 保养良好的炮管, 温暖色调, 高饱和度, 正面视角,
clear weather, blue sky, bright scene, no snow, well-maintained cannon barrel, warm colors, high saturation, front view, cartoon style, anime style
```

**参考图：** 需要（使用 S01-03-1 作为空间参考）
**分辨率：** 1K（16:9）

---

### 【S01-03-3】黄龙旗·海面船上近景（飞行路径中间点）

**正向提示词：**
```
近景镜头，鹰 POV，俯瞰海面上整齐排列的北洋舰船，黄龙旗插在船头。海面深灰有浮冰，北洋舰船数艘整齐排列停泊，每艘船头旗杆上飘着黄龙旗。镜头聚焦其中一面黄龙旗——明黄色Pantone 116C丝绸质地五爪金龙深蓝刺绣（有磨损边缘但黄色仍然鲜明——大清最后的体面）。旗杆深色木质/铁质粗糙有缆绳痕，插在船头。船身随浪微晃。风雪从海面卷来，灰白偏蓝6500K极冷，密度从薄到厚从右下向左上蔓延。侧逆光旗面透光金黄色近乎发光（全片最纯粹的黄色展示）。大雪与雾混合。

medium close-up shot, eagle POV, looking down at neatly arranged Beiyang warships on the sea surface, Yellow Dragon Flag mounted on ship bow. Dark gray sea surface with floating ice, several Beiyang warships neatly arranged at anchor, each with Yellow Dragon Flag on bow flagpole. Camera focuses on one Yellow Dragon Flag - bright yellow Pantone 116C silk fabric with five-clawed golden dragon in dark blue embroidery (worn edges but yellow still vivid - the last dignity of Qing Dynasty). Dark wooden/iron flagpole rough with cable marks, mounted on ship bow. Ship hull swaying slightly with waves. Wind and snow rolling in from the sea, gray-white with blue tint 6500K extremely cold, density increasing from thin to thick from lower right to upper left. Side-backlight makes flag surface translucent golden-yellow almost glowing (the purest yellow display in the film). Heavy snow mixing with fog.

hyperrealistic, in the visual style of Chang'an 30000 Miles, Lights Animation Studio style, cinematic 3D rendering, high quality CGI, Chinese aesthetic in 3D, cold desaturated color palette except for the golden flag, volumetric lighting, physically accurate lighting, 85mm lens, f/2.8, photorealistic, 8K
```

**负向提示词：**
```
晴天, 蓝天, 明亮, 无雪, 无风, 温暖色调背景, 高饱和度背景, 暗淡的旗帜, 旗杆在陆地上, 无船,
clear weather, blue sky, bright scene, no snow, no wind, warm color background, high saturation background, dull flag, flagpole on land, no ship, cartoon style, anime style
```

**参考图：** 需要（使用 S01-03-1 作为空间参考）
**分辨率：** 1K（16:9）

---

### 【S01-03-4】定远舰甲板中远景（尾帧）

**正向提示词：**
```
中远景镜头，鹰 POV，俯瞰定远舰甲板。甲板钢铁灰色防滑纹路有海盐腐蚀白斑和油污痕迹，积雪覆盖部分区域。主炮塔炮口朝前（停泊态非战斗态），炮塔上有积雪。桅杆帆索收拢信号旗未升。散落物件——粗麻缆绳一盘未整理（被雪部分覆盖）、木箱半开（空的或散落）、扫帚靠舱壁（被雪覆盖）。远处可能有一个士兵背影一动不动像雕塑（不确认是否活着）。海面深灰色有浮冰，不是平静如镜。大雪纷飞，死寂氛围。

medium long shot, eagle POV, looking down at Dingyuan battleship deck. Steel gray deck with anti-slip pattern, sea salt corrosion white spots and oil stains, snow covering parts of the deck. Main turret with cannon pointing forward (anchored position, non-combat state), snow on the turret. Mast and rigging stowed, signal flags not raised. Scattered objects - coiled hemp rope (partially covered by snow), half-open wooden crates (empty or scattered), broom leaning against cabin wall (covered by snow). Possibly a soldier's silhouette in the distance, motionless like a statue (uncertain if alive). Dark gray sea surface with floating ice, not mirror-calm. Heavy snow falling, atmosphere of deathly silence.

hyperrealistic, in the visual style of Chang'an 30000 Miles, Lights Animation Studio style, cinematic 3D rendering, high quality CGI, Chinese aesthetic in 3D, cold desaturated color palette, volumetric lighting, physically accurate lighting, 50mm lens, f/4.0, photorealistic, 8K
```

**负向提示词：**
```
晴天, 蓝天, 明亮, 无雪, 无浮冰, 活跃的士兵, 温暖色调, 高饱和度,
clear weather, blue sky, bright scene, no snow, no ice, active soldiers, warm colors, high saturation, cartoon style, anime style
```

**参考图：** 需要（使用 S01-03-1 作为空间参考）
**分辨率：** 1K（16:9）

---

### 【S01-04】鹰盘旋·风雪中的守护

**正向提示词：**
```
远景镜头，高角度俯拍，鹰在舰队上方盘旋。鹰翅膀展开滑翔不扇动，像一个沉默的守望者。舰队8-10艘舰船暗影剪影全无动态。大雪纷飞。天空深灰偏蓝的压抑色调。雪雾让远处模糊。鹰影/鹰本体是画面唯一活动。

long shot, high angle aerial view, golden eagle circling above the fleet. Eagle wings spread gliding without flapping, like a silent guardian. 8-10 warships as dark silhouettes with no movement. Heavy snow falling. Deep gray-blue oppressive sky. Snow fog blurs the distance. Eagle silhouette/form is the only moving element in frame.

hyperrealistic, in the visual style of Chang'an 30000 Miles, Lights Animation Studio style, cinematic 3D rendering, high quality CGI, Chinese aesthetic in 3D, cold desaturated color palette, volumetric lighting, atmospheric depth, 35mm lens, f/5.6, photorealistic, 8K
```

**负向提示词：**
```
晴天, 蓝天, 明亮, 无雪, 鹰扇动翅膀, 活跃的舰队, 温暖色调, 高饱和度,
clear weather, blue sky, bright scene, no snow, eagle flapping wings, active fleet, warm colors, high saturation, cartoon style, anime style
```

**参考图：** 需要（使用 S01-02-1 作为金雕参考，S01-03-1 作为空间参考）
**分辨率：** 1K（16:9）

---

### 【S01-05】日军合围线·雪雾中的威胁

**正向提示词：**
```
远景镜头，鹰 POV，高角度俯拍日军舰队。日军舰船分散包围（非整齐排列的半圆），部分被雪雾遮蔽。舰身浅灰/白色（新舰vs旧舰的视觉区分）。烟囱有烟（在运作中）。雪雾让远处模糊，看不到完整包围圈，只能看到部分舰船。外海深蓝色稍亮有微浪。大雪纷飞，能见度低。

long shot, eagle POV, high angle aerial view of Japanese fleet. Japanese warships dispersed in encirclement (not neatly arranged semicircle), partially obscured by snow fog. Ship hulls in light gray/white (visual distinction of new vs old ships). Smoke from chimneys (in operation). Snow fog blurs the distance, cannot see complete encirclement, only partial ships visible. Open sea in deep blue slightly brighter with light waves. Heavy snow falling, low visibility.

hyperrealistic, in the visual style of Chang'an 30000 Miles, Lights Animation Studio style, cinematic 3D rendering, high quality CGI, Chinese aesthetic in 3D, cold desaturated color palette, volumetric lighting, atmospheric depth, 35mm lens, f/4.0, photorealistic, 8K
```

**负向提示词：**
```
晴天, 蓝天, 明亮, 无雪, 整齐排列的军舰, 清晰可见的包围圈, 温暖色调, 高饱和度,
clear weather, blue sky, bright scene, no snow, neatly arranged warships, clearly visible encirclement, warm colors, high saturation, cartoon style, anime style
```

**参考图：** 需要（使用 S01-03-1 作为空间参考）
**分辨率：** 1K（16:9）

---

### 【S01-06-1】翼尖撞击前

**正向提示词：**
```
特写镜头，鹰翼特写。鹰翼逆光金色边缘，羽毛整齐排列，滑翔姿态完美。大雪纷飞。翼尖占满画面三分之二以上，羽毛纹理清晰可见。

close-up shot, eagle wing tip. Eagle wing with backlit golden edge, feathers neatly arranged, perfect gliding posture. Heavy snow falling. Wing tip occupies more than two-thirds of frame, feather texture clearly visible.

hyperrealistic, in the visual style of Chang'an 30000 Miles, Lights Animation Studio style, cinematic 3D rendering, high quality CGI, Chinese aesthetic in 3D, cold desaturated color palette, volumetric lighting, physically accurate lighting, 85mm lens, f/2.8, photorealistic, 8K
```

**负向提示词：**
```
明亮画面, 均匀布光, 多光源, 温暖色调, 蓝天, 无雪, 混乱的羽毛,
bright scene, even lighting, multiple light sources, warm colors, blue sky, no snow, disordered feathers, cartoon style, anime style
```

**参考图：** 需要（使用 S01-02-1 作为金雕参考）
**分辨率：** 1K（16:9）

---

### 【S01-06-2】翼尖撞击中

**正向提示词：**
```
极特写镜头，鹰翼尖撞击瞬间。流弹切入翼尖，空气波纹，雪花被气流卷起。翼尖外端三根飞羽根部断裂，羽毛开始炸开向四周散落。逆光金色边缘，羽毛散落时每一片都短暂反射逆光。

extreme close-up shot, eagle wing tip impact moment. Stray bullet cutting into wing tip, air ripples, snowflakes being swept up by airflow. Three flight feathers at outer wing tip breaking at root, feathers starting to explode outward. Backlit golden edge, each scattered feather briefly reflecting the backlight.

hyperrealistic, in the visual style of Chang'an 30000 Miles, Lights Animation Studio style, cinematic 3D rendering, high quality CGI, Chinese aesthetic in 3D, cold desaturated color palette, volumetric lighting, physically accurate lighting, motion blur, 85mm lens, f/2.8, photorealistic, 8K
```

**负向提示词：**
```
明亮画面, 均匀布光, 多光源, 温暖色调, 蓝天, 无雪, 完整的羽毛,
bright scene, even lighting, multiple light sources, warm colors, blue sky, no snow, intact feathers, cartoon style, anime style
```

**参考图：** 需要（使用 S01-06-1 作为参考）
**分辨率：** 1K（16:9）

---

### 【S01-06-3】翼尖撞击后

**正向提示词：**
```
特写镜头，羽毛炸开后。金色碎片飘散，翼尖断裂处。背景深灰偏蓝天空。大雪纷飞。羽毛散落在空中，每一片都反射逆光。

close-up shot, after feather explosion. Golden fragments scattering, broken wing tip. Background dark gray-blue sky. Heavy snow falling. Feathers scattered in air, each reflecting backlight.

hyperrealistic, in the visual style of Chang'an 30000 Miles, Lights Animation Studio style, cinematic 3D rendering, high quality CGI, Chinese aesthetic in 3D, cold desaturated color palette, volumetric lighting, physically accurate lighting, 85mm lens, f/2.8, photorealistic, 8K
```

**负向提示词：**
```
明亮画面, 均匀布光, 多光源, 温暖色调, 蓝天, 无雪, 整齐的羽毛,
bright scene, even lighting, multiple light sources, warm colors, blue sky, no snow, neat feathers, cartoon style, anime style
```

**参考图：** 需要（使用 S01-06-1 作为参考）
**分辨率：** 1K（16:9）

---

### 【S01-07-1】鹰下坠首帧

**正向提示词：**
```
中近景镜头，鹰开始下坠。翅膀开始折叠（不对称，被击中的右翼折叠更快），整个身形在收缩。背景天空和残云，大雪纷飞。鹰的姿态与盘旋时的舒展完全不同——狼狈的、失控的。

medium close-up shot, eagle beginning to fall. Wings starting to fold (asymmetrically, the hit right wing folding faster), entire body contracting. Background sky and remnant clouds, heavy snow falling. Eagle's posture completely different from the graceful circling - disheveled, out of control.

hyperrealistic, in the visual style of Chang'an 30000 Miles, Lights Animation Studio style, cinematic 3D rendering, high quality CGI, Chinese aesthetic in 3D, cold desaturated color palette, volumetric lighting, physically accurate lighting, 85mm lens, f/2.8, photorealistic, 8K
```

**负向提示词：**
```
明亮画面, 均匀布光, 多光源, 温暖色调, 蓝天, 无雪, 舒展的翅膀, 优雅的姿态,
bright scene, even lighting, multiple light sources, warm colors, blue sky, no snow, spread wings, graceful posture, cartoon style, anime style
```

**参考图：** 需要（使用 S01-02-1 作为金雕参考）
**分辨率：** 1K（16:9）

---

### 【S01-07-2】鹰下坠尾帧

**正向提示词：**
```
中近景镜头，鹰继续下坠。翅膀折叠更多，背景放大后显示海面/舰队/浮冰。大雪因下坠速度而在画面中形成线条。鹰影在快速缩小。

medium close-up shot, eagle continuing to fall. Wings folded more, background enlarged showing sea surface/fleet/floating ice. Heavy snow forming lines in frame due to falling speed. Eagle silhouette rapidly shrinking.

hyperrealistic, in the visual style of Chang'an 30000 Miles, Lights Animation Studio style, cinematic 3D rendering, high quality CGI, Chinese aesthetic in 3D, cold desaturated color palette, volumetric lighting, physically accurate lighting, motion blur, 85mm lens, f/2.8, photorealistic, 8K
```

**负向提示词：**
```
明亮画面, 均匀布光, 多光源, 温暖色调, 蓝天, 无雪, 舒展的翅膀, 优雅的姿态, 静止画面,
bright scene, even lighting, multiple light sources, warm colors, blue sky, no snow, spread wings, graceful posture, static frame, cartoon style, anime style
```

**参考图：** 需要（使用 S01-07-1 和 S01-03-1 作为参考）
**分辨率：** 1K（16:9）
