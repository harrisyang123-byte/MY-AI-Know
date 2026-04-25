# 技能库配置 (Skills Configuration)

## 7大核心技能（内功）

核心技能是 Lumen Planner 的内在能力，定义了"如何思考"和"如何决策"。

| # | 技能 | 核心能力 | 何时使用 | 详细文档 |
|---|------|---------|---------|---------|
| 1 | Prompt Engineering | 7层提示词架构、场景类型策略 | 构建任何提示词时 | [skill_prompt_engineering.md](../04_skills/skill_prompt_engineering.md) |
| 2 | Spatial Reasoning | 5步空间推理、矛盾检测、视角转换 | 涉及空间布局、机位设计时 | [skill_spatial_reasoning.md](../04_skills/skill_spatial_reasoning.md) |
| 3 | Image Analysis | 8维分析框架、特征提取 | 有参考图/生成结果需要分析时 | [skill_image_analysis.md](../04_skills/skill_image_analysis.md) |
| 4 | Context Integration | 3层上下文模型、7大实战技巧 | 多轮对话、跨镜头生成时 | [skill_context_integration.md](../04_skills/skill_context_integration.md) |
| 5 | Tool Selection | 4大工具决策矩阵、参数优化 | 选择生成工具时 | [skill_tool_selection.md](../04_skills/skill_tool_selection.md) |
| 6 | Iterative Refinement | 3种迭代模式、收敛策略 | 生成结果需要优化时 | [skill_iterative_refinement.md](../04_skills/skill_iterative_refinement.md) |
| 7 | Knowledge Retrieval | 5种检索工具、决策框架 | 需要外部知识/视觉参考时 | [skill_knowledge_retrieval.md](../04_skills/skill_knowledge_retrieval.md) |

### 技能依赖关系

```
Skill 1 (Prompt Engineering) ← 所有技能的基础输出形式
Skill 2 (Spatial Reasoning)  ← 为提示词提供空间逻辑
Skill 3 (Image Analysis)     ← 为提示词提供视觉信息
Skill 4 (Context Integration) ← 串联所有技能的"粘合剂"
Skill 5 (Tool Selection)     ← 决定执行方式
Skill 6 (Iterative Refinement) ← 优化循环
Skill 7 (Knowledge Retrieval) ← 补充知识缺口
```

### 技能调用规则

1. **Prompt Engineering**：每次构建提示词时必须使用7层架构
2. **Spatial Reasoning**：涉及空间布局时必须走5步流程
3. **Image Analysis**：有参考图时必须先分析再生成
4. **Context Integration**：多轮对话中持续维护3层上下文
5. **Tool Selection**：每次生成前必须走决策树
6. **Iterative Refinement**：生成结果不满意时启动迭代循环
7. **Knowledge Retrieval**：遇到知识盲区时才检索，不盲目搜索

---

## 6个专业技能库（知识）

专业技能库通过 `retrieve_skills` 检索，提供特定设计领域的专业指导。

| 技能ID | 名称 | 适用场景 |
|--------|------|---------|
| amazon_product_image | 亚马逊产品图 | 电商产品主图/场景图 |
| instagram_post | 社交媒体帖子 | Instagram帖子设计 |
| branding_logo | 品牌Logo | Logo设计和品牌标识 |
| brochure_design | 宣传册设计 | 折页/画册/宣传册 |
| storyboard_design | 故事板设计 | 影视/动画分镜 |
| carousel_design | 轮播图设计 | 社交媒体轮播/滑动 |

### 技能检索规则

1. 任务匹配可用技能时 → 调用 retrieve_skills
2. 用户选择了技能（skill ID）→ 调用 retrieve_skills
3. 需要设计指导 → 调用 retrieve_skills
4. **关键规则**：不要同时调用 retrieve_skills 和 search_image
   - 先检索技能，技能中包含搜索策略
   - 按技能指导进行后续搜索

---

## 搜索引擎（知识补充）

| 工具 | 功能 | 何时使用 |
|------|------|---------|
| search_web | 文本信息搜索 | 事实查询、概念了解、时效信息 |
| search_image | 视觉参考搜索 | 风格参考、灵感收集、案例研究 |
| search_website_content | 网页内容提取 | 深度信息、官网内容、详细资料 |

### 搜索工具选择

| 需求 | 工具 | biz_type |
|------|------|----------|
| 实时/流行内容 | search_image | 7 (WebSearch) |
| 特定品牌/产品 | search_image | 7 (WebSearch) |
| 设计参考/风格灵感 | search_image | 8 (Boutique) |
| retrieve_skills之后 | search_image | 8 (Boutique) |
| 概念/术语了解 | search_web | - |
| 品牌/公司信息 | search_web | - |
| 网站内容提取 | search_website_content | - |

---

## Kit系统（品牌资源）

| 工具 | 功能 | 何时使用 |
|------|------|---------|
| explore_kits | 探索品牌/项目资源包 | 用户消息中有 --kit="kit_id" |

### Kit使用流程

1. 检测用户消息中的 `--kit="kit_id"`
2. 调用 explore_kits 获取品牌资产
3. 提取资产（Logo/颜色/字体/指南）
4. 作为参考图像使用
5. 应用到生成中

### Kit资源类型

| Kit类型 | 包含内容 |
|---------|---------|
| 品牌Kit | Logo、品牌色、字体、设计指南 |
| 游戏Kit | 角色、场景、道具 |
| 视频Kit | 故事板、脚本、素材 |
