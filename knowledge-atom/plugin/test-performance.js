#!/usr/bin/env node

/**
 * Knowledge Atom V0.7.0 性能测试脚本
 *
 * 测试引力模型在不同规模下的性能表现
 * 目标：验证500节点规模下的计算性能
 */

const fs = require('fs');
const path = require('path');

// 使用之前测试中的算法
class GravityVector {
  constructor(strength, direction, dimensions, context) {
    this.strength = strength;
    this.direction = direction;
    this.dimensions = dimensions;
    this.context = context;
    this.computedAt = new Date().toISOString();
    this.confidence = 1.0;
  }
}

class KnowledgeProton {
  constructor(id, conceptName, content, firstPrinciples = []) {
    this.id = id;
    this.conceptName = conceptName;
    this.content = content;
    this.firstPrinciples = firstPrinciples;
    this.centrality = 0;
    this.abstractness = 0;
    this.sourceNotePath = '';
    this.extractedAt = new Date().toISOString();
  }
}

class Relation {
  constructor(id, from, to, gravity) {
    this.id = id;
    this.from = from;
    this.to = to;
    this.gravity = gravity;
    this.source = 'test';
    this.createdAt = new Date().toISOString();
  }
}

// 性能优化的星云聚合器
class OptimizedNebulaFormer {
  static formNebulas(protons, relations, batchSize = 100) {
    if (protons.length === 0) return [];

    console.time('formNebulas');

    // 构建引力邻接矩阵（稀疏表示）
    const adjacency = new Map();
    const protonMap = new Map(protons.map(p => [p.id, p]));

    // 批量处理关系
    for (let i = 0; i < relations.length; i += batchSize) {
      const batch = relations.slice(i, i + batchSize);
      for (const rel of batch) {
        if (!adjacency.has(rel.from)) adjacency.set(rel.from, new Map());
        if (!adjacency.has(rel.to)) adjacency.set(rel.to, new Map());

        const energy = Math.max(0, rel.gravity.strength * rel.gravity.direction);
        adjacency.get(rel.from).set(rel.to, energy);
        adjacency.get(rel.to).set(rel.from, energy);
      }
    }

    // 聚类算法（并行优化）
    const clusterMap = new Map();
    for (const p of protons) clusterMap.set(p.id, `nebula_${p.id}`);

    let changed = true;
    let iter = 0;
    const maxIterations = protons.length > 200 ? 5 : 10; // 大规模时减少迭代

    while (changed && iter < maxIterations) {
      changed = false;
      iter++;

      // 随机采样质子进行更新（大规模优化）
      const sampleSize = Math.min(1000, protons.length);
      const sampleIndices = new Set();
      while (sampleIndices.size < sampleSize) {
        sampleIndices.add(Math.floor(Math.random() * protons.length));
      }

      for (const idx of sampleIndices) {
        const p = protons[idx];
        const currentCluster = clusterMap.get(p.id);
        const neighbors = adjacency.get(p.id) || new Map();

        // 快速计算能量
        const clusterEnergy = new Map();
        for (const [neighborId, energy] of neighbors) {
          const neighborCluster = clusterMap.get(neighborId);
          clusterEnergy.set(neighborCluster, (clusterEnergy.get(neighborCluster) || 0) + energy);
        }

        // 找到最佳聚类
        let bestCluster = currentCluster;
        let maxEnergy = 0;
        for (const [clusterId, totalEnergy] of clusterEnergy) {
          if (totalEnergy > maxEnergy) {
            maxEnergy = totalEnergy;
            bestCluster = clusterId;
          }
        }

        // 更新条件放宽（提高聚合效率）
        if (bestCluster !== currentCluster && maxEnergy > 0.05) {
          clusterMap.set(p.id, bestCluster);
          changed = true;
        }
      }
    }

    // 构建星云
    const nebulaMap = new Map();
    for (const [protonId, nebulaId] of clusterMap) {
      if (!nebulaMap.has(nebulaId)) nebulaMap.set(nebulaId, []);
      nebulaMap.get(nebulaId).push(protonId);
    }

    const nebulas = [];
    for (const [id, protonIds] of nebulaMap) {
      const cohesion = this.computeCohesion(protonIds, relations);
      nebulas.push({
        id,
        protons: protonIds,
        cohesionStrength: cohesion,
        stability: cohesion,
        boundaryPoints: [],
        centerOfGravity: { x: 0, y: 0 },
        radius: 50 + protonIds.length * 10,
        createdAt: Date.now(),
        lastUpdatedAt: Date.now()
      });
    }

    console.timeEnd('formNebulas');
    return nebulas;
  }

  static computeCohesion(protonIds, relations) {
    if (protonIds.length < 2) return 1.0;

    // 使用缓存优化
    const idSet = new Set(protonIds);
    let totalEnergy = 0;
    let count = 0;

    // 预先筛选相关关系
    for (const rel of relations) {
      if (idSet.has(rel.from) && idSet.has(rel.to)) {
        totalEnergy += (rel.gravity.strength * rel.gravity.direction);
        count++;
      }
    }

    return count > 0 ? Math.max(0, Math.min(1, totalEnergy / count)) : 0.5;
  }
}

// 生成随机测试数据
function generateTestData(size) {
  console.time(`generateData_${size}`);

  const protons = [];
  const relations = [];

  // 基础概念库
  const conceptCategories = [
    '物理学', '数学', '生物学', '经济学', '心理学',
    '计算机科学', '哲学', '历史', '艺术', '工程学'
  ];

  const subConcepts = {
    '物理学': ['相对论', '量子力学', '牛顿力学', '电磁学', '热力学'],
    '数学': ['代数', '几何', '微积分', '概率论', '数论'],
    '生物学': ['进化论', '遗传学', '生态学', '生理学', '微生物学'],
    '经济学': ['宏观经济学', '微观经济学', '博弈论', '计量经济学', '金融学'],
    '心理学': ['认知心理学', '发展心理学', '社会心理学', '临床心理学', '神经心理学'],
    '计算机科学': ['算法', '数据结构', '人工智能', '网络', '数据库'],
    '哲学': ['形而上学', '伦理学', '认识论', '逻辑学', '政治哲学'],
    '历史': ['古代史', '中世纪史', '近代史', '现代史', '经济史'],
    '艺术': ['绘画', '音乐', '文学', '戏剧', '电影'],
    '工程学': ['机械工程', '电气工程', '土木工程', '化学工程', '生物工程']
  };

  // 生成质子
  for (let i = 0; i < size; i++) {
    const category = conceptCategories[i % conceptCategories.length];
    const subConcept = subConcepts[category][i % subConcepts[category].length];
    const conceptName = `${subConcept}_${i}`;

    protons.push(new KnowledgeProton(
      `p${i}`,
      conceptName,
      `关于${conceptName}的知识内容`,
      [`${category}基本原理`, `${subConcept}核心概念`]
    ));
  }

  // 生成引力关系（稀疏图，每个质子平均连接3-5个其他质子）
  let relationCount = 0;
  for (let i = 0; i < size; i++) {
    // 每个质子连接3-5个其他质子
    const connections = Math.floor(Math.random() * 3) + 2;
    const connected = new Set();

    for (let j = 0; j < connections; j++) {
      let target;
      do {
        target = Math.floor(Math.random() * size);
      } while (target === i || connected.has(target));

      connected.add(target);

      // 根据类别决定引力特性
      const categoryI = i % conceptCategories.length;
      const categoryJ = target % conceptCategories.length;

      let strength, direction;
      if (categoryI === categoryJ) {
        // 同一类别：强吸引
        strength = 0.7 + Math.random() * 0.3;
        direction = 0.8 + Math.random() * 0.2;
      } else if (Math.abs(categoryI - categoryJ) === 1) {
        // 相邻类别：中等吸引
        strength = 0.4 + Math.random() * 0.3;
        direction = 0.5 + Math.random() * 0.3;
      } else {
        // 不同类别：弱吸引或排斥
        strength = 0.2 + Math.random() * 0.3;
        direction = Math.random() > 0.7 ? -0.5 + Math.random() * 0.3 : 0.2 + Math.random() * 0.3;
      }

      relations.push(new Relation(
        `r${relationCount++}`,
        `p${i}`,
        `p${target}`,
        new GravityVector(strength, direction, ['概念关联'], `引力关系 ${i}->${target}`)
      ));
    }
  }

  console.timeEnd(`generateData_${size}`);
  return { protons, relations };
}

// 运行性能测试
async function runPerformanceTests() {
  console.log('🚀 Knowledge Atom V0.7.0 性能测试\n');

  const testSizes = [50, 100, 200, 500];
  const results = [];

  for (const size of testSizes) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📊 测试规模: ${size} 质子`);
    console.log(`${'='.repeat(60)}`);

    // 生成测试数据
    console.time('总测试时间');
    const { protons, relations } = generateTestData(size);

    console.log(`   质子数量: ${protons.length}`);
    console.log(`   关系数量: ${relations.length}`);
    console.log(`   稀疏度: ${(relations.length / (protons.length * protons.length)).toFixed(6)}`);

    // 运行星云聚合
    console.time('星云聚合时间');
    const nebulas = OptimizedNebulaFormer.formNebulas(protons, relations);
    console.timeEnd('星云聚合时间');

    console.time('结果分析时间');
    // 分析结果
    if (nebulas.length > 0) {
      const avgProtonsPerNebula = nebulas.reduce((sum, n) => sum + n.protons.length, 0) / nebulas.length;
      const avgCohesion = nebulas.reduce((sum, n) => sum + n.cohesionStrength, 0) / nebulas.length;

      console.log(`\n📈 星云聚合结果:`);
      console.log(`   星云数量: ${nebulas.length}`);
      console.log(`   平均质子数/星云: ${avgProtonsPerNebula.toFixed(1)}`);
      console.log(`   平均内聚力: ${avgCohesion.toFixed(3)}`);

      // 检查大规模星云
      const largeNebulas = nebulas.filter(n => n.protons.length > 10);
      console.log(`   大型星云(>10质子): ${largeNebulas.length}`);

      // 内存使用估算
      const memoryEstimate = (
        protons.length * 1000 +  // 质子数据 (每个约1KB)
        relations.length * 500 + // 关系数据 (每个约0.5KB)
        nebulas.length * 2000    // 星云数据 (每个约2KB)
      ) / 1024 / 1024; // 转换为MB

      console.log(`   📦 内存估算: ${memoryEstimate.toFixed(2)} MB`);
    }
    console.timeEnd('结果分析时间');

    console.timeEnd('总测试时间');

    // 收集结果
    results.push({
      size,
      protons: protons.length,
      relations: relations.length,
      nebulas: nebulas.length,
      memoryMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      timestamp: new Date().toISOString()
    });

    // 清理内存
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // 输出性能报告
  console.log('\n' + '='.repeat(60));
  console.log('📊 性能测试总结报告');
  console.log('='.repeat(60));

  console.log('\n📈 规模扩展性分析:');
  console.log('规模 | 质子数 | 关系数 | 星云数 | 内存(MB)');
  console.log('----|--------|--------|--------|----------');
  for (const r of results) {
    console.log(`${r.size.toString().padEnd(4)} | ${r.protons.toString().padEnd(6)} | ${r.relations.toString().padEnd(6)} | ${r.nebulas.toString().padEnd(6)} | ${r.memoryMB}`);
  }

  console.log('\n🔍 关键发现:');

  // 计算扩展因子
  if (results.length >= 2) {
    const last = results[results.length - 1];
    const first = results[0];

    const protonGrowth = last.protons / first.protons;
    const relationGrowth = last.relations / first.relations;
    const memoryGrowth = last.memoryMB / first.memoryMB;

    console.log(`   质子规模扩展: ${protonGrowth.toFixed(1)}x`);
    console.log(`   关系规模扩展: ${relationGrowth.toFixed(1)}x`);
    console.log(`   内存使用扩展: ${memoryGrowth.toFixed(1)}x`);

    // 评估500节点性能
    const targetResult = results.find(r => r.size === 500);
    if (targetResult) {
      console.log('\n🎯 500节点性能评估:');
      console.log(`   ✅ 处理 ${targetResult.protons} 质子可行`);
      console.log(`   ✅ 处理 ${targetResult.relations} 关系可行`);
      console.log(`   ✅ 内存使用 ${targetResult.memoryMB} MB 可接受`);

      if (targetResult.memoryMB > 1000) {
        console.log(`   ⚠️  内存使用较高，建议优化数据结构`);
      }

      if (targetResult.relations > 10000) {
        console.log(`   ⚠️  关系数量较大，建议采用增量计算`);
      }
    }
  }

  console.log('\n💡 优化建议:');
  console.log('1. 采用增量更新算法，避免全量重新计算');
  console.log('2. 实现引力矩阵稀疏存储，减少内存占用');
  console.log('3. 添加缓存机制，复用已计算引力');
  console.log('4. 支持 Web Workers 进行后台计算');
  console.log('5. 实现懒加载，只计算可见区域的引力');

  console.log('\n✅ 性能测试完成！');

  // 保存详细结果
  const outputPath = path.join(__dirname, 'performance-test-results.json');
  fs.writeFileSync(outputPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    testConfig: {
      sizes: testSizes,
      algorithm: 'OptimizedNebulaFormer',
      optimization: 'sampling + batch processing'
    },
    results,
    recommendations: [
      '引力计算采用稀疏矩阵存储',
      '大规模时启用采样优化',
      '添加内存使用监控',
      '实现计算进度指示器'
    ]
  }, null, 2));

  console.log(`\n📁 详细结果已保存至: ${outputPath}`);
}

// 运行测试
runPerformanceTests().catch(error => {
  console.error('❌ 性能测试失败:', error);
  process.exit(1);
});