const fs = require('fs');
const path = require('path');

const indexPath = path.join('knowledge-vault', '.knowledge-atom', 'index.json');
const data = JSON.parse(fs.readFileSync(indexPath, 'utf8'));

// 定义一些基础坐标
const protonCoords = {
  "人性弱点": { x: 210, y: 217 },
  "利己": { x: 300, y: 130 },
  "贪婪": { x: 130, y: 120 },
  "恐惧": { x: 140, y: 130 },
  "自私": { x: 280, y: 140 },
  "虚荣": { x: 270, y: 110 },
  "攀比": { x: 310, y: 120 },
  "懒惰": { x: 120, y: 140 },
  "拖延": { x: 150, y: 150 }
};

// 补全 protons 字段
for (const id in data.protons) {
  if (protonCoords[id]) {
    data.protons[id].x = protonCoords[id].x;
    data.protons[id].y = protonCoords[id].y;
  } else {
    data.protons[id].x = Math.random() * 400;
    data.protons[id].y = Math.random() * 400;
  }
}

fs.writeFileSync(indexPath, JSON.stringify(data, null, 2));
console.log('✅ 已补全所有质子坐标');