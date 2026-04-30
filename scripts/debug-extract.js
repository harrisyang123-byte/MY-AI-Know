// 调试代码：测试 processExtractResult 函数中的问题

const mockExtractResult = {
  concepts: [
    {
      name: "测试概念1",
      definition: "这是一个测试概念的定义",
      aliases: ["测试别名1"],
      firstPrinciples: ["测试规律1"]
    },
    {
      name: "测试概念2",
      definition: "这是另一个测试概念的定义",
      aliases: ["测试别名2"],
      firstPrinciples: ["测试规律2"]
    }
  ],
  relations: [
    {
      from: "测试概念1",
      to: "测试概念2",
      type: "correlate",
      context: "这两个概念相关",
      confidence: 0.8
    }
  ],
  tags: ["测试", "调试"],
  summary: "这是一个测试提取结果"
};

console.log("模拟 processExtractResult 调用...");
console.log("概念数量:", mockExtractResult.concepts.length);
console.log("关系数量:", mockExtractResult.relations.length);

// 模拟 processExtractResult 中的逻辑
const conceptEntries = mockExtractResult.concepts;
console.log("\n处理每个概念:");
for (const c of conceptEntries) {
  console.log(`- 处理概念: ${c.name}`);
  console.log(`  定义长度: ${c.definition.length}`);
  console.log(`  底层规律: ${c.firstPrinciples.join(", ")}`);

  // 模拟 getConcept 调用
  const existing = null; // 假设不存在

  if (existing) {
    console.log(`  概念已存在，合并更新`);
  } else {
    console.log(`  新增概念`);
    // 模拟 upsertConcept
    console.log(`  保存到索引...`);
    console.log(`  概念路径: 概念/${c.name}.md`);
  }
}

// 模拟写入概念笔记
console.log("\n写入概念笔记:");
const allRelations = []; // 假设没有关系
const communities = []; // 假设没有社区

for (const concept of conceptEntries) {
  console.log(`- 写入笔记: 概念/${concept.name}.md`);
  const entry = {
    name: concept.name,
    definition: concept.definition,
    aliases: concept.aliases,
    sources: ["测试源.md"],
    firstPrinciples: concept.firstPrinciples
  };

  if (entry) {
    console.log(`  概念对象有效，准备写入...`);
    // 模拟 writeConceptNote
    console.log(`  创建文件内容...`);
    console.log(`  写入成功`);
  } else {
    console.log(`  ❌ 错误: 无法获取概念对象`);
  }
}

console.log("\n问题诊断:");
console.log("1. getConcept 可能返回 undefined");
console.log("2. writeConceptNote 可能有错误");
console.log("3. 文件系统权限或路径问题");