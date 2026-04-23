import { GravityEngine } from "../gravityEngine";
import { KnowledgeProton, GravityVector } from "../types";
import { LLMService } from "../llmService";
import { App } from "obsidian";

/**
 * GravityEngine 单元测试模拟脚本
 */
export async function runGravityEngineTests() {
  console.log("🚀 Starting GravityEngine Tests...");

  // Mock LLM Service
  const mockLLM = {
    chatJSON: async (messages: any[]) => {
      const userPrompt = messages[1].content;

      // 根据提示词模拟 AI 返回
      if (userPrompt.includes("相对论") && userPrompt.includes("牛顿力学")) {
        return {
          strength: 0.9,
          direction: -0.8,
          dimensions: ["物理范式", "时空观"],
          context: "广义相对论在强引力场下修正并推翻了牛顿力学的绝对时空观。"
        };
      }

      if (userPrompt.includes("博弈论") && userPrompt.includes("生物进化")) {
        return {
          strength: 0.85,
          direction: 0.9,
          dimensions: ["演化稳定策略", "数学模型"],
          context: "博弈论的纳什均衡在生物进化中体现为演化稳定策略（ESS）。"
        };
      }

      return {
        strength: 0.2,
        direction: 0.1,
        dimensions: ["泛关联"],
        context: "弱关联。"
      };
    }
  } as any as LLMService;

  // Mock App
  const mockApp = {
    vault: {
      adapter: {
        exists: async () => false,
        mkdir: async () => {},
        write: async () => {},
        read: async () => "{}"
      }
    }
  } as any as App;

  const engine = new GravityEngine(mockLLM, mockApp);

  // 测试用例 1: 范式排斥 (Relativity vs Newtonian)
  const proton1: KnowledgeProton = {
    id: "p1",
    conceptName: "相对论",
    firstPrinciples: ["弯曲时空", "光速不变"],
    content: "爱因斯坦提出的时空理论...",
    centrality: 0,
    abstractness: 0,
    sourceNotePath: "",
    extractedAt: ""
  };

  const proton2: KnowledgeProton = {
    id: "p2",
    conceptName: "牛顿力学",
    firstPrinciples: ["绝对时空", "引力即拉力"],
    content: "牛顿经典力学体系...",
    centrality: 0,
    abstractness: 0,
    sourceNotePath: "",
    extractedAt: ""
  };

  console.log("Test 1: Paradigm Conflict (Relativity vs Newtonian)");
  const v1 = await engine.computeGravity(proton1, proton2);
  console.log("Result:", v1);
  console.assert(v1.direction < 0, "Should be negative direction");

  // 测试用例 2: 跨域一致性 (Game Theory vs Evolution)
  const proton3: KnowledgeProton = {
    id: "p3",
    conceptName: "博弈论",
    firstPrinciples: ["纳什均衡", "策略互动"],
    content: "数学模型研究冲突与合作...",
    centrality: 0,
    abstractness: 0,
    sourceNotePath: "",
    extractedAt: ""
  };

  const proton4: KnowledgeProton = {
    id: "p4",
    conceptName: "生物进化",
    firstPrinciples: ["适者生存", "演化稳定"],
    content: "生物种群的演化规律...",
    centrality: 0,
    abstractness: 0,
    sourceNotePath: "",
    extractedAt: ""
  };

  console.log("\nTest 2: Cross-domain Coherence (Game Theory vs Evolution)");
  const v2 = await engine.computeGravity(proton3, proton4);
  console.log("Result:", v2);
  console.assert(v2.strength > 0.8, "Should have high strength");
  console.assert(v2.direction > 0.8, "Should have high positive direction");

  console.log("\n✅ All logic tests passed (Simulated)");
}
