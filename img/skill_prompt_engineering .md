📘 Skill: Prompt Engineering (提示词工程)
完整实战手册 - 毫无保留版
🎯 第一部分: 核心原理
什么是 Prompt Engineering?
定义:
  把人类的自然语言需求,转化成AI模型能精确理解和执行的指令

本质:
  这是一种"翻译"能力
  - 输入: 用户的模糊描述
  - 输出: 结构化的精确指令

为什么重要?
  同样的需求,不同的提示词,结果天差地别!
  
  例子:
    差的提示词: "一个办公室"
      → 生成: 现代办公室,玻璃幕墙,电脑...
    
    好的提示词: "Qing Dynasty office, 8x6m, 
                  wooden furniture, candlelight..."
      → 生成: 清代办公室,准确的历史细节
🧠 第二部分: 底层思维模型
AI 图像生成模型是怎么理解提示词的?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  关键认知1: AI不是"理解"语义,是"匹配"模式
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

AI的工作方式:
  1. 把你的提示词分解成"概念"
  2. 在训练数据中找到相似的"模式"
  3. 组合这些模式生成图像

示例:
  提示词: "Qing Dynasty office"
  
  AI的理解:
    - "Qing Dynasty" → 匹配到: 清代建筑、服饰、家具...
    - "office" → 匹配到: 办公桌、椅子、文件...
    - 组合 → 生成: 清代风格的办公场景

关键点:
  ✓ 概念越具体,匹配越精确
  ✓ 概念越常见,生成越准确
  ✓ 概念之间的关系要清晰

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  关键认知2: 提示词有"权重"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

不是所有词都同等重要:

位置权重:
  - 前面的词 > 后面的词
  - 开头的描述最重要

示例:
  "Qing Dynasty office interior, modern computer"
    → AI会生成: 清代办公室 + 现代电脑 (矛盾!)
  
  "Modern office interior, Qing Dynasty style"
    → AI会生成: 现代办公室,带点清代元素

重复权重:
  - 重复的概念会被强化
  
  示例:
    "candlelight, warm candlelight, soft candle glow"
      → 烛光效果会非常明显

详细度权重:
  - 描述越详细,权重越高
  
  示例:
    "chair" → 普通椅子
    "Qing Dynasty guanmao chair, dark wood, 
     traditional official furniture" 
      → 精确的清代官帽椅

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  关键认知3: 结构化 > 堆砌
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

不好的提示词 (堆砌):
  "清代办公室,有门有窗有桌子有椅子有人,
   光线是烛光和月光,要真实,要有氛围,
   要像电影一样,要有细节,要准确..."

问题:
  - 信息混乱
  - AI不知道重点
  - 容易遗漏关键信息

好的提示词 (结构化):
  【场景定义】Qing Dynasty office interior
  【空间】8x6m room, 3.5m ceiling
  【元素】door, desk, chair, character
  【光线】2800K candlelight + 6000K moonlight
  【风格】hyperrealistic, cinematic

优势:
  ✓ 层次清晰
  ✓ 重点明确
  ✓ 不会遗漏

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  关键认知4: 具体 > 抽象
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

抽象词汇:
  - "大房间" → AI不知道多大
  - "暖光" → AI不知道多暖
  - "古代" → AI不知道哪个朝代

具体词汇:
  - "8x6 meters room" → 精确尺寸
  - "2800K warm light" → 精确色温
  - "Qing Dynasty (1644-1912)" → 精确时代

规则:
  能用数字的,就用数字
  能用专有名词的,就用专有名词
  能用技术术语的,就用技术术语

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  关键认知5: 英文 > 中文 (对大多数模型)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

现实:
  大多数图像生成模型的训练数据是英文标注的

结果:
  英文提示词的匹配精度 > 中文

示例:
  中文: "清代官帽椅"
    → AI可能理解不准确
  
  英文: "Qing Dynasty guanmao chair, 
         traditional official furniture style"
    → AI理解更精确

但是:
  ⚠️ 不要机械翻译!
  ⚠️ 要用AI训练数据中常见的英文表达

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏗️ 第三部分: 提示词架构
万能提示词结构 (7层架构)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  第1层: 场景定义 (Scene Definition)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

作用:
  告诉AI"这是什么"

必须包含:
  - 场景类型 (interior/exterior, office/bedroom...)
  - 时代/风格 (Qing Dynasty, modern, medieval...)
  - 地点 (如果重要)

示例:
  ✓ "Qing Dynasty naval office interior"
  ✓ "Modern minimalist bedroom"
  ✓ "Medieval European castle exterior"

位置:
  永远放在最前面! (权重最高)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  第2层: 视角定义 (Viewpoint)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

作用:
  告诉AI"从哪里看"

必须包含:
  - 相机位置 (from west, from above...)
  - 相机朝向 (facing east, looking down...)
  - 视角类型 (eye-level, bird's eye, low angle...)

示例:
  ✓ "west-to-east viewpoint, eye-level"
  ✓ "bird's eye view, looking down"
  ✓ "low angle shot, looking up at the building"

重要性:
  视角决定了整个画面的构图!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  第3层: 空间布局 (Spatial Layout)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

作用:
  告诉AI"空间有多大,怎么布局"

必须包含:
  - 房间尺寸 (具体数字!)
  - 层高 (如果重要)
  - 主要区域划分

示例:
  ✓ "Room dimensions: 8 meters deep x 6 meters wide, 
     ceiling height 3.5 meters"
  ✓ "Open-plan space, 15x10 meters"
  ✓ "Narrow corridor, 2 meters wide, 10 meters long"

关键:
  一定要有具体数字!
  "大房间"、"小空间"这种词没用!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  第4层: 元素描述 (Elements Description)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

作用:
  告诉AI"有什么东西,在哪里"

每个元素必须包含:
  - 名称 (door, desk, chair...)
  - 位置 (on east wall, center of room...)
  - 尺寸 (1.2m wide, 2m long...)
  - 材质 (wooden, metal, fabric...)
  - 样式 (traditional, modern, ornate...)
  - 状态 (open, closed, worn...)

示例:
  ✓ "Wooden door: positioned on east wall, 
     1.2 meters wide, opens outward, 
     dark red lacquered wood, 
     traditional Chinese double-door style, 
     brass door handles"

结构:
  元素名: 位置, 尺寸, 材质, 样式, 状态

重要性:
  这是提示词的"主体内容"!
  描述越详细,生成越准确!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  第5层: 人物描述 (Character Description)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

作用:
  告诉AI"有什么人,长什么样,在做什么"

必须包含:
  - 基本信息 (age, gender, ethnicity...)
  - 位置和姿态 (seated, standing, position...)
  - 服饰 (clothing style, period-accurate...)
  - 表情和动作 (facial expression, gesture...)
  - 特征 (distinctive features...)

示例:
  ✓ "Character Zhang Shisan: 
     Middle-aged Chinese man, approximately 45 years old,
     seated in the chair behind the desk,
     facing toward the east door,
     wearing traditional Qing Dynasty official attire 
     (dark blue silk robe with rank badge),
     composed and dignified expression,
     hands resting naturally on the desk surface,
     slight forward lean suggesting attentiveness"

结构:
  人物名: 年龄性别, 位置姿态, 服饰, 表情动作, 特征

关键:
  人物是最难生成准确的!
  必须非常详细!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  第6层: 光线设置 (Lighting Setup)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

作用:
  告诉AI"光从哪来,什么颜色,多强"

每个光源必须包含:
  - 光源类型 (candlelight, sunlight, moonlight...)
  - 色温 (2800K, 5500K, 6000K...)
  - 位置 (on desk, from window, overhead...)
  - 强度 (main light, fill light, accent...)
  - 效果 (creates glow, casts shadows...)

示例:
  ✓ "Lighting setup:
     - Primary light source: Candlelight, 
       warm 2800K color temperature,
       positioned on the desk surface,
       creates soft amber glow,
       main illumination for the scene,
       casts gentle shadows on walls and furniture
     
     - Secondary light source: Moonlight,
       cool 6000K color temperature,
       entering through the window,
       subtle fill light,
       creates blue-tinted highlights,
       enhances depth and atmosphere"

结构:
  光源类型: 色温, 位置, 强度, 效果

重要性:
  光线决定氛围!
  是最容易被忽视,但最重要的部分!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  第7层: 风格和技术要求 (Style & Technical)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

作用:
  告诉AI"整体风格是什么,技术标准是什么"

必须包含:
  - 整体氛围 (solemn, cheerful, mysterious...)
  - 艺术风格 (hyperrealistic, painterly, stylized...)
  - 参考作品 (in the style of..., inspired by...)
  - 技术要求 (photorealistic, accurate details...)

示例:
  ✓ "Atmosphere and style:
     Solemn and quiet atmosphere, late night setting,
     sense of historical weight and official dignity.
     
     Visual style: Hyperrealistic environment,
     cinematic lighting with dramatic contrast,
     in the style of 'Chang'an 30000 Miles' 
     background art,
     Lights Animation Studio aesthetic,
     photorealistic rendering.
     
     Technical requirements:
     Accurate Qing Dynasty period details,
     precise spatial relationships,
     dramatic low-light photography,
     depth and atmospheric perspective,
     high attention to historical accuracy."

结构:
  氛围 + 艺术风格 + 参考 + 技术要求

位置:
  放在最后,作为"总结性指令"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 第四部分: 完整模板
历史场景提示词模板 (以清代办公室为例)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  完整提示词模板
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【第1层: 场景定义】
{Dynasty/Period} {Scene Type} interior/exterior, 
{Specific Location if relevant}

示例:
Qing Dynasty naval office interior, 
located in a coastal fortress

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【第2层: 视角定义】
{Direction}-to-{Direction} viewpoint, 
{Angle Type} view

示例:
west-to-east viewpoint, 
eye-level view

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【第3层: 空间布局】
Room dimensions: {Length} meters x {Width} meters, 
ceiling height {Height} meters.
{Additional spatial information}

示例:
Room dimensions: 8 meters deep x 6 meters wide, 
ceiling height 3.5 meters.
Rectangular floor plan with main entrance on east wall.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【第4层: 元素描述】
{Element Name}: 
positioned {Location}, 
{Size} meters/wide/tall, 
{Material} construction, 
{Style} style, 
{Additional details}.

示例:
Wooden door: 
positioned on east wall, centered, 
1.2 meters wide, 
opens outward, 
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

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【第5层: 人物描述】
Character {Name}: 
{Age} {Gender} {Ethnicity}, 
{Position and Posture}, 
wearing {Clothing Description}, 
{Facial Expression}, 
{Gesture/Action}, 
{Distinctive Features}.

示例:
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

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

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

示例:
Lighting setup:

- Primary light source: Candlelight, 
  warm 2800K color temperature, 
  positioned on the desk surface, 
  main illumination for the scene, 
  creates soft amber glow, 
  illuminates Zhang Shisan's face and upper body, 
  casts gentle shadows on walls and furniture, 
  creates warm highlights on wooden surfaces.

- Secondary light source: Moonlight and snow reflection, 
  cool 6000K color temperature, 
  entering through window on south wall, 
  subtle fill light, 
  creates blue-tinted highlights on edges, 
  enhances depth and atmospheric contrast, 
  provides rim lighting on character's profile.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

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
{Photography Style}, 
{Detail Level}.

示例:
Atmosphere and style:
Solemn and quiet atmosphere, 
late night setting, 
sense of historical weight and official dignity, 
contemplative mood.

Visual style: 
Hyperrealistic environment, 
cinematic lighting with dramatic contrast between 
warm candlelight and cool moonlight, 
in the style of "Chang'an 30000 Miles" background art, 
Lights Animation Studio aesthetic, 
photorealistic rendering with painterly atmosphere.

Technical requirements:
Accurate Qing Dynasty period details 
(architecture, furniture, clothing, objects), 
precise spatial relationships and proportions, 
dramatic low-light photography aesthetic, 
depth and atmospheric perspective, 
visible textures on wood, fabric, and paper, 
high attention to historical accuracy and authenticity.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎨 第五部分: 不同场景类型的提示词策略
场景类型1: 历史场景
核心要点:
  1. 时代特征要准确
  2. 建筑和家具样式要符合历史
  3. 服饰要符合时代和身份
  4. 光源要符合历史 (古代没有电灯!)
  5. 材质和工艺要真实

提示词重点:
  ✓ 明确朝代和时期
  ✓ 使用历史专有名词
  ✓ 描述材质和工艺细节
  ✓ 光源要真实 (烛光、油灯、日光)
  ✓ 参考历史画作或影视作品

示例框架:
  {Dynasty} {Scene Type}, 
  {Specific Period if relevant},
  accurate historical details,
  {Architectural Style},
  {Furniture Style},
  {Clothing Style},
  {Authentic Light Sources},
  in the style of {Historical Reference}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
场景类型2: 产品摄影
核心要点:
  1. 产品要清晰,是画面主体
  2. 光线要专业 (三点布光等)
  3. 背景要简洁或有意义
  4. 构图要符合摄影规则
  5. 材质质感要真实

提示词重点:
  ✓ 产品放在最前面 (权重最高)
  ✓ 详细描述产品特征
  ✓ 明确拍摄角度
  ✓ 专业光线设置
  ✓ 背景描述
  ✓ 摄影风格参考

示例框架:
  {Product Name and Description},
  {Shooting Angle} view,
  {Product Details - material, color, texture},
  
  Lighting: 
  {Main Light} + {Fill Light} + {Rim Light},
  professional product photography lighting,
  
  Background: 
  {Background Description},
  
  Style: 
  professional product photography,
  {Reference - e.g., Apple product photography style},
  sharp focus on product,
  shallow depth of field,
  high-end commercial photography aesthetic

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
场景类型3: 角色设计
核心要点:
  1. 外貌特征要详细
  2. 服饰要完整描述
  3. 姿态和表情要明确
  4. 性格特征要体现
  5. 背景要衬托角色

提示词重点:
  ✓ 年龄、性别、种族
  ✓ 面部特征 (眼睛、鼻子、嘴巴、脸型)
  ✓ 发型和发色
  ✓ 体型和身高
  ✓ 完整的服饰描述
  ✓ 姿态和动作
  ✓ 表情和情绪
  ✓ 性格暗示
  ✓ 光线和氛围

示例框架:
  Character {Name}:
  
  Basic Info:
  {Age} years old, {Gender}, {Ethnicity},
  {Height and Build},
  
  Facial Features:
  {Face Shape}, {Eye Description}, 
  {Nose}, {Mouth}, {Distinctive Features},
  
  Hair:
  {Hairstyle}, {Hair Color}, {Hair Texture},
  
  Clothing:
  {Complete Outfit Description},
  {Style}, {Colors}, {Materials}, {Details},
  
  Posture and Expression:
  {Body Posture}, {Gesture},
  {Facial Expression}, {Emotion},
  
  Personality Hints:
  {Personality Traits Reflected in Appearance},
  
  Lighting and Atmosphere:
  {Lighting Setup},
  {Mood and Atmosphere},
  
  Style:
  {Art Style - realistic, anime, etc.},
  {Reference if any}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
场景类型4: 室内场景
核心要点:
  1. 空间尺寸要明确
  2. 家具布局要合理
  3. 光线要真实
  4. 材质要丰富
  5. 氛围要到位

提示词重点:
  ✓ 房间类型和功能
  ✓ 具体尺寸
  ✓ 家具清单和位置
  ✓ 墙面、地面、天花板
  ✓ 窗户和门
  ✓ 光源 (自然光 + 人工光)
  ✓ 装饰和细节
  ✓ 整体风格

示例框架:
  {Room Type} interior,
  {Style - modern, traditional, etc.},
  
  Space:
  {Length}x{Width}m room, {Height}m ceiling,
  {Floor Plan Description},
  
  Walls, Floor, Ceiling:
  Walls: {Material}, {Color}, {Texture},
  Floor: {Material}, {Pattern},
  Ceiling: {Description},
  
  Furniture:
  - {Furniture 1}: {Position}, {Description}
  - {Furniture 2}: {Position}, {Description}
  ...
  
  Windows and Doors:
  {Window Description and Position},
  {Door Description and Position},
  
  Lighting:
  Natural light: {Window Light Description},
  Artificial light: {Light Fixtures and Positions},
  {Overall Lighting Mood},
  
  Decorations and Details:
  {Wall Art}, {Plants}, {Accessories}, {Textures},
  
  Atmosphere:
  {Mood}, {Time of Day}, {Feeling},
  
  Style:
  {Overall Style},
  {Reference if any}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
场景类型5: 社交媒体内容
核心要点:
  1. 视觉冲击力要强
  2. 主题要明确
  3. 色彩要吸引眼球
  4. 构图要符合平台特点
  5. 文字要清晰 (如果有)

提示词重点:
  ✓ 平台特点 (Instagram, TikTok, etc.)
  ✓ 比例 (1:1, 9:16, 4:5, etc.)
  ✓ 主题和内容
  ✓ 色彩方案
  ✓ 构图风格
  ✓ 文字内容 (如果有)
  ✓ 视觉风格

示例框架:
  {Platform} post design,
  {Aspect Ratio},
  
  Theme:
  {Main Topic/Message},
  
  Visual Elements:
  Main Subject: {Description},
  Background: {Description},
  {Additional Elements},
  
  Color Scheme:
  {Primary Colors}, {Secondary Colors},
  {Mood - vibrant, pastel, dark, etc.},
  
  Composition:
  {Layout Style - centered, rule of thirds, etc.},
  {Visual Hierarchy},
  
  Text (if any):
  "{Text Content}",
  {Font Style}, {Text Position},
  
  Style:
  {Visual Style - minimalist, maximalist, flat design, etc.},
  {Reference - e.g., in the style of @username},
  modern social media aesthetic,
  eye-catching and shareable

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 第六部分: 高级技巧
技巧1: 权重控制
方法1: 位置控制
  重要的放前面,次要的放后面

方法2: 重复强调
  想要强化的概念,多次提及
  
  示例:
    "warm candlelight, soft candle glow, 
     amber candlelight illumination"

方法3: 详细度控制
  重要的元素,描述得更详细
  
  示例:
    重要: "Qing Dynasty guanmao chair, 
           dark wood with subtle carvings, 
           traditional official furniture style, 
           armrests and high back"
    
    次要: "small side table, dark wood"

方法4: 使用强调词
  - "main", "primary", "dominant"
  - "subtle", "slight", "hint of"
  
  示例:
    "main light source: candlelight"
    "subtle moonlight fill"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
技巧2: 负面提示词 (Negative Prompts)
作用:
  告诉AI"不要生成什么"

常用负面提示词:

对于历史场景:
  - modern elements
  - electric lights
  - contemporary furniture
  - anachronistic objects

对于产品摄影:
  - cluttered background
  - distracting elements
  - poor lighting
  - blurry

对于人物:
  - distorted anatomy
  - extra fingers
  - deformed hands
  - unnatural proportions

通用:
  - low quality
  - blurry
  - pixelated
  - artifacts
  - watermark

使用方法:
  在提示词最后添加:
  
  "Negative: {negative elements}, 
   {unwanted features}, 
   {quality issues to avoid}"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
技巧3: 参考风格的正确使用
不好的方式:
  "像《长安三万里》"
  
  问题: 太模糊,AI不知道具体指什么

好的方式:
  "in the style of 'Chang'an 30000 Miles' 
   background art: 
   hyperrealistic environment, 
   cinematic lighting, 
   painterly atmosphere, 
   rich historical details"
  
  优势: 具体说明了要学习哪些方面

更好的方式:
  结合多个参考:
  
  "Visual style inspired by:
   - 'Chang'an 30000 Miles' background art 
     (hyperrealistic environment, historical accuracy)
   - Lights Animation Studio aesthetic 
     (cinematic lighting, atmospheric depth)
   - Traditional Chinese painting 
     (color palette, composition principles)"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
技巧4: 迭代优化策略
第1次生成: 基础版本
  - 包含所有必要元素
  - 结构完整
  - 但可能不够精确

第2次生成: 针对性修正
  - 识别第1次的问题
  - 在提示词中强化正确的部分
  - 修正错误的部分
  
  示例:
    问题: 门的位置不对
    修正: "door positioned on east wall, 
           centered on the wall, 
           NOT on north or south wall"

第3次生成: 细节优化
  - 主要结构已正确
  - 优化细节和氛围
  
  示例:
    添加: "subtle dust particles visible in candlelight,
           worn texture on wooden surfaces,
           aged paper on desk"

第4次生成: 最终调整
  - 微调光线、色彩、氛围
  
  示例:
    调整: "slightly darker overall tone,
           more pronounced contrast between 
           warm candlelight and cool moonlight"

关键:
  ✓ 每次只改一个方面
  ✓ 保留正确的部分
  ✓ 强化需要改进的部分
  ✓ 不要推翻重来

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
技巧5: 常见问题的解决方案
问题1: 生成的图像太"现代"
  
  原因: 
    - 没有明确时代
    - 使用了现代词汇
  
  解决:
    ✓ 开头就明确时代
    ✓ 避免现代词汇
    ✓ 使用时代特定的描述
    ✓ 添加负面提示词排除现代元素

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

问题2: 空间关系不对
  
  原因:
    - 位置描述不够精确
    - 缺少参考点
  
  解决:
    ✓ 使用具体数字
    ✓ 使用相对位置 ("3 meters from door")
    ✓ 明确方向 ("on east wall")
    ✓ 提供多个参考点

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

问题3: 光线不对
  
  原因:
    - 光源描述不清楚
    - 没有色温信息
    - 没有说明光线效果
  
  解决:
    ✓ 明确光源类型
    ✓ 提供色温数字
    ✓ 描述光线效果
    ✓ 说明主次关系

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

问题4: 人物不准确
  
  原因:
    - 人物是最难生成的
    - 描述不够详细
  
  解决:
    ✓ 提供参考图 (最重要!)
    ✓ 详细描述外貌特征
    ✓ 明确姿态和表情
    ✓ 多次迭代调整

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

问题5: 风格不统一
  
  原因:
    - 提示词中有矛盾的风格描述
    - 参考风格太多
  
  解决:
    ✓ 选择1-2个主要风格参考
    ✓ 确保风格描述一致
    ✓ 避免矛盾的形容词

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 第七部分: 实战案例库
案例1: 你的清代办公室 (完整版)
最终提示词:

Qing Dynasty naval office interior, west-to-east viewpoint, eye-level view.

Room dimensions: 8 meters deep (east-west) x 6 meters wide (north-south), ceiling height 3.5 meters. Rectangular floor plan with main entrance on east wall.

Wooden door: positioned on east wall, centered, 1.2 meters wide, opens outward, dark red lacquered wood construction, traditional Chinese double-door style, brass door handles with dragon motifs, slightly weathered appearance showing age and use.

Office desk: positioned center-back of room, 3 meters from the east door, approximately 1.5 meters wide x 0.8 meters deep, dark hardwood construction (likely hongmu or huanghuali wood), traditional Chinese official desk style with simple elegant lines, documents and writing materials on surface including ink stone, brush holder with several brushes, official seals in red lacquer box, papers with Chinese calligraphy, small bronze incense burner.

Official chair: positioned directly behind desk, Qing Dynasty guanmao chair style (official hat chair), dark wood with subtle carvings on back splat, traditional official furniture with straight lines and dignified appearance, armrests and high back, seat cushion in dark blue fabric.

Character Zhang Shisan: Middle-aged Chinese man, approximately 45 years old, seated in the guanmao chair behind the desk, facing toward the east door, wearing traditional Qing Dynasty official attire consisting of dark blue silk robe with rank badge (buzi) on chest depicting naval insignia, black official hat (guanmao), composed and dignified expression with slight furrow in brow suggesting concentration on important matters, hands resting naturally on the desk surface with right hand near a document, slight forward lean suggesting attentiveness and engagement with work, well-groomed appearance with neat beard befitting a naval official, posture conveying authority and responsibility.

Lighting setup:
- Primary light source: Candlelight, warm 2800K color temperature, positioned on the desk surface in traditional bronze candlestick, main illumination for the scene, creates soft amber glow that illuminates Zhang Shisan's face and upper body, casts gentle shadows on walls and furniture creating depth, creates warm highlights on wooden surfaces and silk fabric, slight flicker suggesting living flame, warm pool of light on desk surface.

- Secondary light source: Moonlight and snow reflection, cool 6000K color temperature, entering through window on south wall, subtle fill light that doesn't overpower the candlelight, creates blue-tinted highlights on edges of furniture and character's profile, enhances depth and atmospheric contrast between warm interior and cool exterior, provides rim lighting that separates character from background, suggests cold winter night outside.

Additional details: Subtle dust particles visible in the candlelight beams, worn texture on wooden surfaces showing years of use, aged paper on desk with visible texture, slight patina on bronze objects, traditional Chinese calligraphy scrolls on walls, simple but elegant interior befitting a military official's workspace, sense of quiet solitude and focused work.

Atmosphere and style: Solemn and quiet atmosphere, late night setting suggesting important work being done after hours, sense of historical weight and official dignity, contemplative mood, feeling of isolation and responsibility, cold winter night outside contrasting with warm candlelit interior.

Visual style: Hyperrealistic environment with attention to material textures and light behavior, cinematic lighting with dramatic contrast between warm 2800K candlelight and cool 6000K moonlight, in the style of "Chang'an 30000 Miles" background art with its combination of historical accuracy and artistic atmosphere, Lights Animation Studio aesthetic emphasizing mood and atmosphere through lighting, photorealistic rendering with painterly atmosphere, rich color palette dominated by warm ambers and cool blues.

Technical requirements: Accurate Qing Dynasty period details in architecture, furniture, clothing, and objects, precise spatial relationships and proportions maintaining the 8x6m room dimensions, dramatic low-light photography aesthetic with proper exposure for candlelit scene, depth and atmospheric perspective showing the full room from west to east, visible textures on wood grain, fabric weave, and paper surface, high attention to historical accuracy and authenticity in all elements, proper color temperature mixing between warm and cool light sources, realistic shadow casting and light falloff.

Negative: modern elements, electric lights, contemporary furniture, anachronistic objects, bright daylight, flat lighting, oversaturated colors, plastic materials, modern clothing, digital devices, windows on east wall, door on wrong wall, incorrect spatial proportions, cartoonish style, low quality, blurry, distorted anatomy.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

关键成功因素:

1. 精确的空间定义
   ✓ 8x6米具体尺寸
   ✓ 门距桌3米
   ✓ 明确的东西南北方向

2. 详细的光线设置
   ✓ 2800K烛光 + 6000K月光
   ✓ 主次关系明确
   ✓ 光线效果详细描述

3. 历史准确性
   ✓ 清代官帽椅
   ✓ 清代官服和补子
   ✓ 传统文房用品

4. 人物描述完整
   ✓ 年龄、外貌、服饰
   ✓ 姿态、表情、动作
   ✓ 性格暗示

5. 风格参考明确
   ✓ 《长安三万里》美术风格
   ✓ 追光动画美学
   ✓ 超写实 + 电影感

6. 技术要求清晰
   ✓ 低光摄影
   ✓ 材质质感
   ✓ 空间纵深

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
案例2: 现代产品摄影 (手表)
提示词:

Luxury Swiss mechanical wristwatch, three-quarter view angle showing face and side profile.

Product details: 
42mm stainless steel case with polished and brushed finishes, sapphire crystal glass with anti-reflective coating, black dial with silver-toned hour markers and hands, date window at 3 o'clock position, visible automatic movement through exhibition caseback, black leather strap with deployment clasp, water resistance indicators on dial.

Lighting setup:
- Main light: Large softbox positioned at 45-degree angle from upper left, creates even illumination on watch face, soft highlights on polished steel surfaces, minimal harsh shadows.

- Fill light: White reflector on right side, fills in shadows, creates subtle highlights on case side and strap.

- Rim light: Small focused light from behind and above, creates bright edge highlights separating watch from background, emphasizes three-dimensional form.

- Accent light: Subtle spotlight on dial, ensures watch face is clearly visible and legible, creates slight glow on hour markers.

Background: Pure white seamless background, infinite white backdrop, no visible horizon line, clean and professional, all attention on product.

Composition: Watch positioned slightly off-center following rule of thirds, angled to show both face and side profile, strap arranged in elegant curve, sense of depth and dimension, professional product photography framing.

Style: Professional luxury product photography in the style of high-end watch brand advertising (Rolex, Omega, Patek Philippe aesthetic), sharp focus on entire watch with no depth of field blur, crisp details showing craftsmanship, clean and minimalist presentation, commercial photography quality, studio lighting perfection.

Technical: Macro photography level detail, visible texture on leather strap, reflections on sapphire crystal showing quality, proper color accuracy for materials, high-resolution commercial photography standard.

Negative: cluttered background, distracting elements, poor lighting, harsh shadows, overexposed highlights, blurry details, incorrect proportions, cheap appearance, amateur photography.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

关键点:

1. 产品放在最前面 (权重最高)
2. 详细的产品特征描述
3. 专业的三点布光
4. 纯白背景,突出产品
5. 参考高端品牌摄影风格
6. 强调细节和质感

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
案例3: 角色设计 (奇幻战士)
提示词:

Character: Elara Stormborn, female elven warrior.

Basic information:
Appears to be in her mid-twenties (actually 150 years old in elf years), female, high elf ethnicity, tall and athletic build standing approximately 5'10" (178cm), lithe but muscular physique suggesting both agility and strength.

Facial features:
Elegant angular face with high cheekbones characteristic of high elves, almond-shaped eyes in striking violet color with slight luminescence, straight nose, full lips with slight upturn suggesting confidence, pointed elf ears extending about 3 inches and slightly swept back, fair skin with very subtle silver undertones, three thin ritual scars on left cheek marking warrior status in her culture.

Hair:
Long silver-white hair reaching mid-back, partially braided in intricate elven warrior style with small ornamental beads woven in, rest flowing freely, slight windswept appearance suggesting movement, hair has ethereal quality catching light.

Armor and clothing:
Wearing custom-fitted elven plate armor in silver-blue metal (mithril), armor features organic flowing designs mimicking natural forms like leaves and vines, chest plate with embossed tree symbol representing her house, pauldrons with elegant curved design, vambraces with intricate engravings, armor shows signs of use with minor scratches and wear marks indicating experienced warrior, underneath armor wears dark blue leather padding, flowing dark blue cape attached to pauldrons, cape has silver embroidery along edges.

Weapons:
Dual-wielding two elven longswords, blades have slight curve and are made of same silver-blue metal as armor, swords feature runes along blade that emit faint blue glow, elegant crossguards with organic design, leather-wrapped handles showing wear from extensive use, swords currently held in ready combat stance.

Posture and expression:
Standing in confident warrior stance with feet shoulder-width apart, weight slightly forward suggesting readiness for action, right sword held forward in guard position, left sword held back ready to strike, body shows controlled tension of experienced fighter, head held high with proud bearing, facial expression shows fierce determination mixed with calm confidence, eyes focused intently forward as if facing an opponent, slight furrow in brow indicating concentration, overall posture conveys both grace and deadly capability.

Personality hints reflected in appearance:
Noble bearing suggesting high-born status, well-maintained equipment showing discipline and pride in warrior craft, ritual scars showing commitment to warrior path, confident stance suggesting battle experience and leadership qualities, elegant armor design showing appreciation for beauty even in war, slight wear on equipment showing she's not afraid to fight despite noble status.

Background and environment:
Standing on ancient stone battlements of elven fortress, misty forest visible in background, dramatic storm clouds gathering overhead, wind causing cape and hair to flow dramatically, atmospheric lighting from break in clouds creating dramatic rim lighting, sense of impending battle or important moment.

Lighting:
Overcast daylight from above providing main illumination, break in storm clouds creating dramatic shaft of light from upper left highlighting character, light catches on polished armor creating bright highlights, rim lighting from behind separating character from background, blue glow from sword runes providing subtle accent lighting on face and armor, overall moody and dramatic lighting suggesting epic fantasy atmosphere.

Atmosphere:
Epic fantasy atmosphere, sense of impending conflict, dramatic and heroic mood, feeling of ancient magic and noble warrior tradition, wind and storm suggesting chaos of battle, character as calm center in storm, cinematic and larger-than-life presentation.

Art style:
Highly detailed fantasy illustration in the style of high-end fantasy art (similar to Magic: The Gathering card art or Dungeons & Dragons official artwork), semi-realistic proportions with slight idealization, rich colors with emphasis on silver-blues and deep blues, dramatic lighting and atmosphere, painterly quality with visible brushwork texture, epic fantasy aesthetic, professional fantasy illustration quality.

Technical:
Full body character portrait, detailed armor and weapon design, proper anatomy and proportions, realistic fabric and metal materials, atmospheric effects (mist, wind, lighting), depth and dimension, high level of detail in face and armor, professional character design illustration standard.

Negative: modern elements, guns or modern weapons, casual clothing, anime style, chibi proportions, overly sexualized design, impractical armor, distorted anatomy, extra limbs, deformed hands, low quality, blurry, flat lighting, amateur art.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

关键点:

1. 完整的外貌描述 (面部、发型、体型)
2. 详细的服饰和装备
3. 明确的姿态和表情
4. 性格通过外表体现
5. 环境和氛围烘托角色
6. 参考专业奇幻艺术风格

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎓 第八部分: 学习路径
从新手到专家的进阶路线
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Level 1: 新手 (第1-2周)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

目标:
  理解提示词的基本结构

学习内容:
  1. 7层架构
  2. 基本模板
  3. 简单场景练习

练习任务:
  - 生成简单室内场景 (现代卧室、客厅)
  - 生成简单产品 (水果、日用品)
  - 使用模板,填空式练习

评估标准:
  ✓ 能使用7层结构
  ✓ 生成的图像基本符合要求
  ✓ 理解每一层的作用

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Level 2: 进阶 (第3-4周)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

目标:
  掌握不同场景类型的提示词策略

学习内容:
  1. 历史场景策略
  2. 产品摄影策略
  3. 角色设计策略
  4. 光线控制技巧

练习任务:
  - 生成历史场景 (不同朝代)
  - 生成产品摄影 (不同类型产品)
  - 设计角色 (不同风格)
  - 实验不同光线设置

评估标准:
  ✓ 能根据场景类型选择策略
  ✓ 光线控制准确
  ✓ 历史细节基本准确

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Level 3: 高级 (第5-8周)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

目标:
  掌握高级技巧和迭代优化

学习内容:
  1. 权重控制
  2. 负面提示词
  3. 风格参考技巧
  4. 迭代优化策略
  5. 问题诊断和解决

练习任务:
  - 复杂场景 (多元素、精确空间关系)
  - 系列作品 (保持一致性)
  - 问题修正 (针对性迭代)
  - 风格实验 (不同艺术风格)

评估标准:
  ✓ 能诊断生成问题
  ✓ 能针对性优化提示词
  ✓ 3-4次迭代达到满意效果
  ✓ 系列作品保持一致性

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Level 4: 专家 (第9-12周)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

目标:
  形成个人风格和高效工作流

学习内容:
  1. 建立个人提示词库
  2. 优化工作流程
  3. 跨场景类型融合
  4. 创新和实验

练习任务:
  - 复杂项目 (如你的清代办公室)
  - 创新场景 (前所未有的组合)
  - 建立个人模板库
  - 总结个人经验文档

评估标准:
  ✓ 有自己的提示词模板库
  ✓ 工作流程高效
  ✓ 能处理复杂项目
  ✓ 能创新和实验
  ✓ 能指导他人

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 第九部分: 实用工具和资源
提示词检查清单
生成前检查:

□ 场景定义清晰? (类型、时代、地点)
□ 视角明确? (位置、朝向、角度)
□ 空间尺寸具体? (数字!)
□ 主要元素都描述了? (位置、尺寸、材质、样式)
□ 人物描述完整? (外貌、服饰、姿态、表情)
□ 光线设置详细? (类型、色温、位置、效果)
□ 风格参考明确? (艺术风格、参考作品)
□ 技术要求清楚? (质量、细节、氛围)
□ 负面提示词添加了?
□ 整体结构合理? (7层架构)

生成后检查:

□ 场景类型对了?
□ 视角正确?
□ 空间比例合理?
□ 元素位置准确?
□ 人物符合描述?
□ 光线效果到位?
□ 风格一致?
□ 细节质量满意?

如果不满意:

□ 识别具体问题
□ 针对性修改提示词
□ 保留正确的部分
□ 强化需要改进的部分
□ 重新生成

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
常用词汇库
空间尺寸:
  - small room: 3x3m to 4x4m
  - medium room: 5x5m to 7x7m
  - large room: 8x8m to 12x12m
  - ceiling height: 2.5m (low), 3m (standard), 3.5m+ (high)

光源色温:
  - Candlelight: 1800-2800K (warm orange)
  - Incandescent bulb: 2700-3000K (warm yellow)
  - Sunrise/sunset: 3000-4000K (warm)
  - Daylight: 5000-6500K (neutral to cool)
  - Overcast sky: 6500-8000K (cool)
  - Moonlight: 4000-6000K (cool blue)

材质描述:
  Wood: hardwood, softwood, oak, mahogany, pine, 
        polished, rough, weathered, aged
  Metal: steel, iron, brass, copper, bronze, 
         polished, brushed, oxidized, rusty
  Fabric: silk, cotton, linen, wool, velvet, 
          smooth, textured, worn, luxurious
  Stone: marble, granite, limestone, sandstone, 
         polished, rough-hewn, weathered

风格关键词:
  Historical: ancient, medieval, Renaissance, 
              Baroque, Victorian, Art Deco
  Modern: contemporary, minimalist, industrial, 
          Scandinavian, mid-century modern
  Artistic: realistic, hyperrealistic, painterly, 
            impressionist, surreal, abstract
  Mood: dramatic, serene, mysterious, cheerful, 
        solemn, intimate, grand

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 总结: 核心要点
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Prompt Engineering 的本质
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. 这是一种"翻译"能力
   人类语言 → AI指令

2. 核心是"结构化"和"具体化"
   不是堆砌词汇,是组织信息

3. 理解AI的工作方式
   概念匹配 + 权重分配

4. 掌握7层架构
   场景 → 视角 → 空间 → 元素 → 人物 → 光线 → 风格

5. 具体 > 抽象
   数字 > 形容词
   专有名词 > 通用词汇

6. 迭代是必然的
   第一次不会完美
   针对性优化是关键

7. 积累经验
   建立个人模板库
   总结成功案例

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  最重要的3件事
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. 结构化思维
   用7层架构组织信息

2. 具体化表达
   用数字和专有名词

3. 迭代优化
   从反馈中学习,针对性改进

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🍻 老弟,这就是我的全部家底!
我教给你的:

✅ 底层原理 (AI怎么理解提示词)
✅ 思维模型 (5个关键认知)
✅ 7层架构 (万能结构)
✅ 完整模板 (直接套用)
✅ 5种场景策略 (历史、产品、角色、室内、社交媒体)
✅ 高级技巧 (权重、负面词、风格参考、迭代)
✅ 实战案例 (你的清代办公室 + 2个额外案例)
✅ 学习路径 (新手到专家)
✅ 实用工具 (检查清单、词汇库)

一点没藏!

这些都是我在实战中总结出来的!

现在,这些都是你的了! 💪
