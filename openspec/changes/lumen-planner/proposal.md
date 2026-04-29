# Proposal: Lumen Planner - 世界级AI设计师系统

## 目标

用 Lumen Planner 三层架构替换现有的 prompt-alchemist 和 nano-banana-prompts，构建一个世界级的AI提示词设计师系统。

核心改进：
- 从"单工具提示词写手"升级为"全栈AI设计师"
- 从"6要素提示词结构"升级为"7层提示词架构"
- 从"被动等待分镜稿"升级为"5步主动工作流"
- 从"单一知识沉淀"升级为"7大核心技能体系"

## 范围

### 新增文件
- `atoms/02.DOMAINS/FILM/agents/lumen-planner.md` — 新 Agent（三层架构：WHO AM I / WHAT I CAN DO / HOW I WORK）
- `atoms/02.DOMAINS/FILM/skills/lumen-prompts/SKILL.md` — 新 Skill（7大核心技能详细方法论）
- `atoms/02.DOMAINS/FILM/skills/lumen-prompts/references/knowledge-base.md` — 知识库（从旧知识库迁移+升级）

### 修改文件
- `atoms/02.DOMAINS/FILM/agents/creative-architect.md` — 更新引用（prompt-alchemist → lumen-planner）

### 删除文件
- `atoms/02.DOMAINS/FILM/agents/prompt-alchemist.md` — 旧 Agent
- `atoms/02.DOMAINS/FILM/skills/nano-banana-prompts/` — 旧 Skill 目录

## 架构设计

### 第一层：角色定义层 (WHO AM I)
- 身份：Lumen Planner，世界级AI设计师、资深设计总监
- 能力：艺术视觉 + 技术精通
- 定位：不是"写描述的翻译官"，而是"理解空间、量化光线、控制一致性、从错误中学习"的设计师

### 第二层：能力配置层 (WHAT I CAN DO)
- 7个核心技能（内功）：提示词工程、空间推理、图像分析、上下文整合、工具选择、迭代优化、知识检索
- 工具库（外功）：4大图像生成工具 + 2大编辑工具 + SubAgent 委托
- 3个SubAgent（团队）：image_sub_agent、video_sub_agent、three_d_sub_agent
- 6个专业技能库（知识）：amazon_product_image、instagram_post、branding_logo、brochure_design、storyboard_design、carousel_design

### 第三层：工作流程层 (HOW I WORK)
- 5步工作流：分析 → 策略 → 增强 → 执行 → 完成
- 核心原则：用户意图优先、渐进式工作、智能工具选择、批量处理、上下文管理、语言匹配
- 交互规则：有图像先分析、不确定就问、复杂任务分步、每阶段确认

## 验收标准

- [ ] lumen-planner.md 完整实现三层架构
- [ ] lumen-prompts/SKILL.md 完整实现7大核心技能方法论
- [ ] knowledge-base.md 从旧知识库迁移所有有效经验
- [ ] creative-architect.md 正确引用 lumen-planner
- [ ] 旧文件已删除
- [ ] 新架构与 FILM 域其他 skill（film-art-direction、film-directing 等）的引用关系正确
- [ ] 提示词输出格式兼容现有工作流
