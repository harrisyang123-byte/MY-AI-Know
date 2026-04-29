# 5步工作流 (5-Step Workflow)

## 工作流总览

```
Step 1: 分析 → Step 2: 策略 → Step 3: 增强 → Step 4: 执行 → Step 5: 完成
```

每个步骤有明确的输入、处理、输出，以及调用的技能和工具。

---

## Step 1: 分析阶段 (Analysis Phase)

**层级**：Input Layer → Core Layer

**目标**：接收和理解用户输入，输出结构化的任务理解

### 流程

```
用户输入
  │
  ├─ 文本输入 → Natural Language Understanding
  ├─ 图像输入 → analyse_image
  ├─ 视频输入 → analyse_video
  ├─ PDF输入 → analyse_pdf
  ├─ 画布上下文 → analyse_canvas
  └─ Kit引用 → explore_kits
  │
  ▼
结构化的任务理解
```

### 具体步骤

1. **接收用户输入**
   - 识别输入类型（文本/图像/视频/PDF/画布/Kit）
   - 如果有图像/视频 → 必须先调用 analyse_image / analyse_video
   - 如果有Kit引用 → 调用 explore_kits

2. **理解任务需求**
   - 提取显性需求（用户明确说的）
   - 推断隐性需求（用户没说但需要的）
   - 识别约束条件（必须遵守的规则）
   - 识别用户偏好（审美倾向）

3. **识别任务类型**
   - 单图生成 / 多图生成 / 批量生成
   - 图像编辑 / 视频生成 / 3D模型
   - 海报设计 / 产品图 / 社交媒体

4. **建立项目上下文**（Context Integration Skill）
   - 如果是首轮对话 → 建立完整的项目层
   - 如果是后续对话 → 更新现有上下文

### 输出

- 任务类型
- 用户意图
- 约束条件
- 参考资料
- 上下文信息

---

## Step 2: 策略阶段 (Strategy Phase)

**层级**：Core Layer (Skill System + Decision Core)

**目标**：制定执行计划，确定关键里程碑

### 流程

```
结构化的任务理解
  │
  ├─ 检索相关技能 → retrieve_skills (如果匹配)
  ├─ 空间推理 → Spatial Reasoning Skill (如果涉及空间)
  ├─ 图像分析 → Image Analysis Skill (如果有参考图)
  │
  ▼
执行计划
```

### 具体步骤

1. **检索相关技能**（如果任务匹配专业技能）
   - 调用 retrieve_skills 获取专业指导
   - 按技能指导制定执行计划
   - **注意**：不要同时调用 retrieve_skills 和 search_image

2. **空间推理**（如果涉及空间布局）
   - 建立坐标系
   - 定义边界
   - 放置元素
   - 验证合理性
   - 视角转换

3. **制定执行计划**
   - 确定关键里程碑
   - 识别需要的资源
   - 确定执行顺序
   - 预判可能的问题

4. **确定工具选择**（Tool Selection Skill）
   - 走工具选择决策树
   - 确定最佳工具
   - 确定参数配置

### 输出

- 执行计划
- 关键里程碑
- 需要的资源
- 工具选择
- 参数配置

---

## Step 3: 增强阶段 (Enhancement Phase)

**层级**：Core Layer + Support Layer

**目标**：构建精确提示词，搜索外部知识，整合上下文

### 流程

```
执行计划
  │
  ├─ 构建提示词 → Prompt Engineering Skill (7层架构)
  ├─ 搜索外部知识 → search_web (如果需要)
  ├─ 收集视觉参考 → search_image (如果需要)
  ├─ 提取网站内容 → search_website_content (如果需要)
  ├─ 探索Kit资产 → explore_kits (如果有Kit)
  ├─ 整合上下文 → Context Integration Skill
  │
  ▼
完整的、结构化的提示词 + 工具参数
```

### 具体步骤

1. **构建提示词**（Prompt Engineering Skill）
   - 按7层架构构建提示词
   - 第1层：场景定义 (Scene Definition)
   - 第2层：视角定义 (Viewpoint)
   - 第3层：空间布局 (Spatial Layout)
   - 第4层：元素描述 (Elements Description)
   - 第5层：人物描述 (Character Description)
   - 第6层：光线设置 (Lighting Setup)
   - 第7层：风格和技术要求 (Style & Technical)
   - 每层必须显式输出，标注"第X层：..."
   - 提示词用英语

2. **判断是否需要检索**（Knowledge Retrieval Skill）
   - 知识盲区？→ search_web + search_image
   - 时效性信息？→ search_web
   - 专业领域？→ search_web + retrieve_skills
   - 视觉参考？→ search_image
   - 品牌/项目资源？→ explore_kits
   - 不需要？→ 跳过检索

3. **搜索外部知识**（如果需要）
   - 使用 search_web 了解概念/品牌/产品
   - 使用 search_image 获取视觉参考
   - 使用 search_website_content 提取深度信息

4. **整合上下文信息**（Context Integration Skill）
   - 将新信息整合到3层上下文模型
   - 检查信息冲突
   - 更新项目层/任务层/交互层

5. **提示词质量检查**
   - 场景定义是否在最前？
   - 空间描述是否用绝对方向？
   - 光源是否量化（色温K + 强度%）？
   - 是否用英文？
   - 是否翻译了用户意图？

### 输出

- 完整的、结构化的提示词
- 工具参数配置
- 补充的参考资料（如果有检索）
- 更新的上下文信息

---

## Step 4: 执行阶段 (Execution Phase)

**层级**：Output Layer (Direct Tools / SubAgents)

**目标**：调用工具，生成结果

### 流程

```
完整的提示词 + 工具参数
  │
  ├─ 执行生成
  │   ├─ 简单任务 → 直接调用工具
  │   └─ 复杂任务 → 委托给 SubAgent
  │
  ▼
生成结果
```

### 具体步骤

1. **执行生成**
   - 简单任务（单图生成/编辑）→ 直接调用工具
   - 复杂任务（批量/视频/3D）→ 委托给SubAgent
   - 多个输出 → 一次调用

2. **展示结果**
   - 展示生成结果
   - 简要说明关键决策

3. **迭代优化**（如果需要）（Iterative Refinement Skill）
   - 评估生成结果
   - 分析问题
   - 针对性优化
   - 重新生成

### 输出

- 生成结果（图像/视频/3D/HTML）
- 提示词记录
- 工具和参数记录

---

## Step 5: 完成阶段 (Completion Phase)

**层级**：Output Layer → User

**目标**：总结结果，提供后续建议，归档知识

### 流程

```
生成结果
  │
  ├─ 总结结果
  ├─ 提供后续建议
  ├─ 归档知识
  │
  ▼
用户
```

### 具体步骤

1. **总结结果**
   - 展示生成结果
   - 说明关键决策和理由
   - 标注版本信息

2. **提供后续建议**
   - 技术优化建议（分辨率/细节）
   - 内容扩展建议（其他角度/细节特写）
   - 应用场景建议（视频/不同时间版本）
   - 风格变化建议

3. **归档知识**
   - 记录错误模式和解决方案
   - 更新提示词模板库
   - 记录用户偏好
   - 更新上下文信息

4. **不调用工具**
   - 完成阶段不调用任何工具
   - 只做总结和建议

### 输出

- 结果总结
- 后续建议
- 知识归档

---

## 工作流与技能映射

| 步骤 | 主要技能 | 辅助技能 |
|------|---------|---------|
| Step 1: 分析 | Image Analysis, Context Integration | Knowledge Retrieval |
| Step 2: 策略 | Spatial Reasoning, Tool Selection | Context Integration |
| Step 3: 增强 | Prompt Engineering, Knowledge Retrieval | Context Integration |
| Step 4: 执行 | - | Iterative Refinement |
| Step 5: 完成 | Context Integration | - |

---

## 特殊场景处理

### 场景1：用户直接给出完整需求

```
用户: "生成一张清代海军官员办公室，西向东拍，8m x 6m，烛光+月光，写实电影感"
→ Step 1: 快速分析（信息完整，无需追问）
→ Step 2: 空间推理 + 工具选择
→ Step 3: 跳过（信息充足）
→ Step 4: 构建提示词 + 执行
→ Step 5: 总结
```

### 场景2：用户需求模糊

```
用户: "帮我设计一个办公室"
→ Step 1: 分析（信息不足，需要追问）
→ 主动询问：风格？尺寸？氛围？
→ Step 2-5: 根据用户补充信息继续
```

### 场景3：迭代优化

```
用户: "太亮了"
→ Step 1: 分析反馈（光线问题）
→ Step 4: Iterative Refinement → 调整光线 → 重新生成
→ Step 5: 总结
```

### 场景4：多角度生成

```
用户: "再生成一个南向北拍"
→ Step 1: 分析（新视角，同一场景）
→ Step 2: Spatial Reasoning（视角转换）
→ Step 4: 构建新提示词 + 执行（保持一致性）
→ Step 5: 总结
```

---

## 核心循环架构

### 6步核心循环

5步工作流背后，是一个持续运转的6步核心循环，确保每次任务都经过完整的理解→规划→执行→评估→学习→迭代闭环：

```
┌──────────────────────────────────────────────────────────────┐
│                     Core Loop                                │
│                                                              │
│   1. 理解 (Understanding)                                    │
│      ↓ [Skill: Image Analysis + Context Integration]         │
│                                                              │
│   2. 规划 (Planning)                                         │
│      ↓ [Skill: Spatial Reasoning + Tool Selection]           │
│                                                              │
│   3. 执行 (Execution)                                        │
│      ↓ [Skill: Prompt Engineering → 工具/SubAgent]           │
│                                                              │
│   4. 评估 (Evaluation)                                       │
│      ↓ [Skill: Iterative Refinement - 质量评估]              │
│                                                              │
│   5. 学习 (Learning)                                         │
│      ↓ [Skill: Iterative Refinement - 错误识别+知识归档]     │
│                                                              │
│   6. 迭代 (Iteration)                                        │
│      ↓ [Skill: Iterative Refinement - 反馈分析+改进建议]     │
│                                                              │
│      → 回到步骤1                                             │
└──────────────────────────────────────────────────────────────┘
```

### 数据流

```
用户输入
  → [Image Analysis + Context Integration] 分析理解
  → [Spatial Reasoning] 空间推理
  → [Prompt Engineering] 提示词构建
  → [Tool Selection] 工具选择
  → 生成执行
  → [Iterative Refinement - 质量评估] 评估
  → [Iterative Refinement - 错误识别] 错误识别
  → [Iterative Refinement - 反馈分析] 反馈分析
  → [Iterative Refinement - 版本管理] 版本管理
  → [Iterative Refinement - 知识归档] 知识归档
  → [Iterative Refinement - 改进建议] 改进建议
  → 回到用户输入（继续迭代或完成）
```

### 4层技能架构映射

imgprompt.md定义的4层技能架构与7个核心技能的映射关系：

| 4层架构 | 子技能 | 对应核心技能 |
|---------|--------|-------------|
| **Layer 1: 理解能力** | 多模态内容分析 | Image Analysis |
| | 需求意图理解 | Context Integration |
| | 空间关系推理 | Spatial Reasoning |
| **Layer 2: 建立流程** | 任务分解与规划 | Context Integration + Tool Selection |
| | 提示词工程 | Prompt Engineering |
| | 工具选择与调度 | Tool Selection |
| | 版本管理与迭代 | Iterative Refinement |
| **Layer 3: 记录经验** | 错误模式识别 | Iterative Refinement (错误模式库) |
| | 知识库构建 | Iterative Refinement (知识库构建) |
| | 案例研究归档 | Iterative Refinement (案例归档) |
| **Layer 4: 持续迭代** | 反馈分析与响应 | Iterative Refinement (反馈分析) |
| | 质量评估 | Iterative Refinement (质量评估) |
| | A/B测试与优化 | Iterative Refinement (A/B测试) |
| | 自动化改进建议 | Iterative Refinement (改进建议) |

### 技能依赖关系

```
Layer 1 (理解) 是基础，必须先执行
  ↓
Layer 2 (规划) 依赖 Layer 1 的输出
  ↓
Layer 3 (记录) 贯穿整个过程
  ↓
Layer 4 (迭代) 在每次生成后触发
```

### 循环触发条件

| 触发条件 | 进入循环位置 | 说明 |
|---------|------------|------|
| 新任务 | 从步骤1开始 | 完整走6步 |
| 迭代优化 | 从步骤4开始 | 跳过理解/规划，直接执行+评估 |
| 视角变更 | 从步骤2开始 | 重新空间推理，保持其他不变 |
| 风格调整 | 从步骤3开始 | 重新构建提示词，保持空间不变 |
| 反馈修改 | 从步骤4开始 | 基于反馈调整，重新执行 |
