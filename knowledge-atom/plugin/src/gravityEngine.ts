import { App } from "obsidian";
import { LLMService, LLMMessage } from "./llmService";
import { GravityVector, KnowledgeProton } from "./types";

export interface GravityCacheEntry {
  vector: GravityVector;
  expiresAt: number;
}

export class GravityEngine {
  private llm: LLMService;
  private app: App;
  private cache: Map<string, GravityCacheEntry> = new Map();
  private readonly CACHE_FILE = ".knowledge-atom/gravity-cache.json";
  private readonly CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7天

  constructor(llm: LLMService, app: App) {
    this.llm = llm;
    this.app = app;
  }

  /**
   * 加载缓存
   */
  async loadCache(): Promise<void> {
    try {
      const adapter = this.app.vault.adapter;
      if (await adapter.exists(this.CACHE_FILE)) {
        const raw = await adapter.read(this.CACHE_FILE);
        const data = JSON.parse(raw);
        this.cache = new Map(Object.entries(data));

        // 清理过期缓存
        const now = Date.now();
        for (const [key, entry] of this.cache.entries()) {
          if (entry.expiresAt < now) {
            this.cache.delete(key);
          }
        }
      }
    } catch (e) {
      console.error("Failed to load gravity cache:", e);
      this.cache = new Map();
    }
  }

  /**
   * 保存缓存
   */
  async saveCache(): Promise<void> {
    try {
      const adapter = this.app.vault.adapter;
      const dir = ".knowledge-atom";
      if (!(await adapter.exists(dir))) {
        await adapter.mkdir(dir);
      }

      const data = Object.fromEntries(this.cache);
      await adapter.write(this.CACHE_FILE, JSON.stringify(data, null, 2));
    } catch (e) {
      console.error("Failed to save gravity cache:", e);
    }
  }

  /**
   * 计算两个质子间的引力
   */
  async computeGravity(protonA: KnowledgeProton, protonB: KnowledgeProton): Promise<GravityVector> {
    const cacheKey = this.getCacheKey(protonA.id, protonB.id);
    const cached = this.cache.get(cacheKey);

    if (cached && cached.expiresAt > Date.now()) {
      return cached.vector;
    }

    // 调用 AI 计算引力
    const vector = await this.evaluateGravityWithAI(protonA, protonB);

    // 存入缓存
    this.cache.set(cacheKey, {
      vector,
      expiresAt: Date.now() + this.CACHE_TTL
    });

    await this.saveCache();
    return vector;
  }

  /**
   * 生成缓存键 (确保 ID 顺序无关)
   */
  private getCacheKey(idA: string, idB: string): string {
    return [idA, idB].sort().join("<->");
  }

  /**
   * 调用 AI 评估引力
   */
  private async evaluateGravityWithAI(protonA: KnowledgeProton, protonB: KnowledgeProton): Promise<GravityVector> {
    const systemPrompt = `你是一个深思熟虑的知识架构师。你的任务是根据“第一性原则”评估两个知识点（质子）之间的关联性。

    评估准则：
    1. 忽略表面的名词、行业、场景包装。
    2. 深入探讨底层的逻辑、公理、或因果机制。
    3. 引力强度 (strength)：0-1，反映底层规律的一致性程度。
    4. 引力方向 (direction)：-1到1。正值表示吸引（规律一致、互补、因果），负值表示排斥（逻辑冲突、范式对立）。
    5. 作用维度 (dimensions)：识别规律在哪些特定维度上产生共鸣（如：博弈论、能量守恒、心智模型）。

    必须以 JSON 格式返回，包含以下字段：
    - strength (number): 0.0-1.0
    - direction (number): -1.0-1.0
    - dimensions (string[]): 维度列表
    - context (string): 简短的自然语言解释，说明为什么产生这种引力。`;

    const userPrompt = `请评估以下两个知识质子之间的引力：

    质子 A:
    名称: ${protonA.conceptName}
    底层规律: ${protonA.firstPrinciples.join(", ")}
    内容摘要: ${protonA.content.substring(0, 300)}

    质子 B:
    名称: ${protonB.conceptName}
    底层规律: ${protonB.firstPrinciples.join(", ")}
    内容摘要: ${protonB.content.substring(0, 300)}

    请输出 JSON 评估结果：`;

    const messages: LLMMessage[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ];

    try {
      const result = await this.llm.chatJSON<any>(messages);

      return {
        strength: result.strength ?? 0.5,
        direction: result.direction ?? 0.0,
        dimensions: result.dimensions ?? [],
        context: result.context ?? "AI 计算完成",
        computedAt: new Date().toISOString(),
        confidence: 0.8 // 默认置信度
      };
    } catch (e) {
      console.error("AI Gravity Evaluation failed:", e);
      return {
        strength: 0,
        direction: 0,
        dimensions: [],
        context: "计算失败: " + (e instanceof Error ? e.message : String(e)),
        computedAt: new Date().toISOString(),
        confidence: 0
      };
    }
  }

  /**
   * 增量更新：清除受影响质子的缓存
   */
  async updateGravityForProton(protonId: string): Promise<void> {
    let changed = false;
    for (const key of this.cache.keys()) {
      if (key.includes(protonId)) {
        this.cache.delete(key);
        changed = true;
      }
    }

    if (changed) {
      await this.saveCache();
    }
  }
}
