# 规格：Todo 应用优先级功能

## 变更标识
- **名称**: add-task-priority
- **版本**: 1.0.0
- **状态**: 实施中

## 数据模型

### Task 模型扩展
```typescript
// 优先级枚举定义
enum TaskPriority {
  HIGH = 'high',
  MEDIUM = 'medium',  // 默认值
  LOW = 'low'
}

// 更新后的 Task 接口
interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: TaskPriority;  // 新增字段
  tags: string[];          // 如果已存在
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  userId: string;          // 如果有多用户
}
```

### 数据库 Schema（PostgreSQL 示例）
```sql
-- 向 tasks 表添加 priority 列
ALTER TABLE tasks 
ADD COLUMN priority VARCHAR(10) NOT NULL DEFAULT 'medium' 
CHECK (priority IN ('high', 'medium', 'low'));

-- 为 priority 列创建索引以优化筛选性能
CREATE INDEX idx_tasks_priority ON tasks(priority);
```

## API 规范

### 端点列表

#### 1. `GET /tasks` - 获取任务列表（增强）
**查询参数**：
- `priority` (可选) - 按优先级筛选：`high`, `medium`, `low`
- `sortBy` (可选) - 排序字段：`priority`, `dueDate`, `createdAt`
- `sortOrder` (可选) - 排序顺序：`asc`, `desc` (默认: `desc`)

**响应**：
```json
{
  "tasks": [
    {
      "id": "task_123",
      "title": "完成报告",
      "priority": "high",
      "completed": false,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "pageSize": 20
}
```

**优先级筛选逻辑**：
```typescript
function filterTasksByPriority(tasks: Task[], priority?: TaskPriority): Task[] {
  if (!priority) return tasks;
  return tasks.filter(task => task.priority === priority);
}
```

**优先级排序逻辑**：
```typescript
function sortTasksByPriority(tasks: Task[], order: 'asc' | 'desc' = 'desc'): Task[] {
  const priorityOrder = { high: 3, medium: 2, low: 1 };
  
  return tasks.sort((a, b) => {
    const aValue = priorityOrder[a.priority];
    const bValue = priorityOrder[b.priority];
    
    return order === 'desc' ? bValue - aValue : aValue - bValue;
  });
}
```

#### 2. `POST /tasks` - 创建任务（增强）
**请求体**：
```json
{
  "title": "新任务",
  "description": "任务描述",
  "priority": "high",  // 可选，默认 'medium'
  "dueDate": "2024-01-20",
  "tags": ["work", "urgent"]
}
```

**验证规则**：
```typescript
const prioritySchema = z.enum(['high', 'medium', 'low']).default('medium');
```

#### 3. `PATCH /tasks/:id` - 更新任务（增强）
**请求体**：
```json
{
  "priority": "low"  // 可单独更新优先级
}
```

#### 4. `PATCH /tasks/:id/priority` - 更新优先级（专用端点）
**请求体**：
```json
{
  "priority": "high"
}
```

**响应**：
```json
{
  "id": "task_123",
  "priority": "high",
  "previousPriority": "medium",
  "updatedAt": "2024-01-15T11:30:00Z"
}
```

## 业务逻辑

### 1. 优先级验证
```typescript
function validatePriority(priority: string): TaskPriority {
  const validPriorities: TaskPriority[] = ['high', 'medium', 'low'];
  
  if (!validPriorities.includes(priority as TaskPriority)) {
    throw new Error(`无效的优先级: ${priority}。允许的值: ${validPriorities.join(', ')}`);
  }
  
  return priority as TaskPriority;
}
```

### 2. 默认优先级
```typescript
const DEFAULT_PRIORITY: TaskPriority = 'medium';

function getPriorityOrDefault(priority?: string): TaskPriority {
  return priority ? validatePriority(priority) : DEFAULT_PRIORITY;
}
```

### 3. 优先级颜色映射
```typescript
const PRIORITY_COLORS: Record<TaskPriority, string> = {
  high: '#dc3545',    // 红色
  medium: '#fd7e14',  // 橙色
  low: '#28a745'      // 绿色
};

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  high: '高优先级',
  medium: '中优先级',
  low: '低优先级'
};
```

### 4. 优先级统计
```typescript
function getPriorityStats(tasks: Task[]): Record<TaskPriority, number> {
  const stats = { high: 0, medium: 0, low: 0 };
  
  tasks.forEach(task => {
    stats[task.priority]++;
  });
  
  return stats;
}
```

## 用户界面规范

### 1. 优先级显示组件
```typescriptx
// PriorityBadge.tsx
interface PriorityBadgeProps {
  priority: TaskPriority;
  size?: 'sm' | 'md' | 'lg';
}

export function PriorityBadge({ priority, size = 'md' }: PriorityBadgeProps) {
  const color = PRIORITY_COLORS[priority];
  const label = PRIORITY_LABELS[priority];
  
  return (
    <span 
      className={`priority-badge priority-${priority} size-${size}`}
      style={{ backgroundColor: color }}
    >
      {label}
    </span>
  );
}
```

### 2. 优先级选择器
```typescriptx
// PrioritySelector.tsx
interface PrioritySelectorProps {
  value: TaskPriority;
  onChange: (priority: TaskPriority) => void;
  includeAll?: boolean;
}

export function PrioritySelector({ 
  value, 
  onChange, 
  includeAll = false 
}: PrioritySelectorProps) {
  const options = includeAll 
    ? [{ value: 'all', label: '全部' }, ...Object.entries(PRIORITY_LABELS)]
    : Object.entries(PRIORITY_LABELS);
  
  return (
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value as TaskPriority)}
      className="priority-selector"
    >
      {options.map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}
```

### 3. 任务列表项
```typescriptx
// TaskItem.tsx（更新）
interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onPriorityChange: (id: string, priority: TaskPriority) => void;
}

export function TaskItem({ task, onToggleComplete, onPriorityChange }: TaskItemProps) {
  return (
    <div className="task-item">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggleComplete(task.id)}
      />
      
      <div className="task-content">
        <h3>{task.title}</h3>
        {task.description && <p>{task.description}</p>}
      </div>
      
      {/* 新增：优先级显示和选择 */}
      <div className="task-priority">
        <PriorityBadge priority={task.priority} />
        <PrioritySelector
          value={task.priority}
          onChange={(priority) => onPriorityChange(task.id, priority)}
        />
      </div>
      
      <div className="task-meta">
        <span>{formatDate(task.createdAt)}</span>
        {task.dueDate && <span>截止: {formatDate(task.dueDate)}</span>}
      </div>
    </div>
  );
}
```

### 4. 任务列表筛选控件
```typescriptx
// TaskFilter.tsx
interface TaskFilterProps {
  selectedPriority?: TaskPriority | 'all';
  onPriorityChange: (priority?: TaskPriority) => void;
}

export function TaskFilter({ selectedPriority, onPriorityChange }: TaskFilterProps) {
  const priorities: Array<TaskPriority | 'all'> = ['all', 'high', 'medium', 'low'];
  
  return (
    <div className="task-filter">
      <h4>按优先级筛选</h4>
      <div className="priority-filters">
        {priorities.map(priority => (
          <button
            key={priority}
            className={`priority-filter-btn ${selectedPriority === priority ? 'active' : ''}`}
            onClick={() => onPriorityChange(priority === 'all' ? undefined : priority)}
          >
            {priority === 'all' ? '全部' : PRIORITY_LABELS[priority]}
          </button>
        ))}
      </div>
    </div>
  );
}
```

## 测试规范

### 1. 单元测试
```typescript
// priority.test.ts
describe('Priority utilities', () => {
  test('validatePriority accepts valid priorities', () => {
    expect(validatePriority('high')).toBe('high');
    expect(validatePriority('medium')).toBe('medium');
    expect(validatePriority('low')).toBe('low');
  });
  
  test('validatePriority rejects invalid priorities', () => {
    expect(() => validatePriority('urgent')).toThrow();
    expect(() => validatePriority('')).toThrow();
  });
  
  test('getPriorityOrDefault returns default for undefined', () => {
    expect(getPriorityOrDefault()).toBe('medium');
  });
  
  test('sortTasksByPriority sorts correctly', () => {
    const tasks = [
      { priority: 'low' },
      { priority: 'high' },
      { priority: 'medium' }
    ] as Task[];
    
    const sorted = sortTasksByPriority(tasks, 'desc');
    expect(sorted.map(t => t.priority)).toEqual(['high', 'medium', 'low']);
  });
});
```

### 2. API 测试
```typescript
// tasks.api.test.ts
describe('Tasks API with priority', () => {
  test('GET /tasks with priority filter', async () => {
    const response = await request(app)
      .get('/tasks?priority=high')
      .expect(200);
    
    expect(response.body.tasks.every((t: Task) => t.priority === 'high')).toBe(true);
  });
  
  test('POST /tasks with priority', async () => {
    const newTask = {
      title: '测试任务',
      priority: 'high'
    };
    
    const response = await request(app)
      .post('/tasks')
      .send(newTask)
      .expect(201);
    
    expect(response.body.priority).toBe('high');
  });
});
```

### 3. UI 组件测试
```typescriptx
// PriorityBadge.test.tsx
describe('PriorityBadge', () => {
  test('renders correct label for high priority', () => {
    render(<PriorityBadge priority="high" />);
    expect(screen.getByText('高优先级')).toBeInTheDocument();
  });
  
  test('applies correct color class', () => {
    render(<PriorityBadge priority="medium" />);
    expect(screen.getByText('中优先级')).toHaveClass('priority-medium');
  });
});
```

## 部署与迁移

### 数据库迁移脚本
```sql
-- migration/001_add_task_priority.sql
BEGIN;

-- 添加 priority 列
ALTER TABLE tasks 
ADD COLUMN priority VARCHAR(10) NOT NULL DEFAULT 'medium';

-- 添加约束
ALTER TABLE tasks 
ADD CONSTRAINT check_task_priority 
CHECK (priority IN ('high', 'medium', 'low'));

-- 创建索引
CREATE INDEX idx_tasks_priority ON tasks(priority);

-- 回滚脚本（如果需要）
-- ALTER TABLE tasks DROP CONSTRAINT check_task_priority;
-- DROP INDEX idx_tasks_priority;
-- ALTER TABLE tasks DROP COLUMN priority;

COMMIT;
```

### 环境变量配置
```env
# 默认优先级配置
DEFAULT_TASK_PRIORITY=medium

# 优先级颜色（可选）
PRIORITY_COLOR_HIGH=#dc3545
PRIORITY_COLOR_MEDIUM=#fd7e14
PRIORITY_COLOR_LOW=#28a745
```

## 监控与日志

### 关键指标
- 任务优先级分布统计
- 优先级变更频率
- 按优先级筛选的使用情况

### 日志格式
```json
{
  "event": "task_priority_changed",
  "taskId": "task_123",
  "previousPriority": "medium",
  "newPriority": "high",
  "userId": "user_456",
  "timestamp": "2024-01-15T11:30:00Z"
}
```

## 向后兼容性

### 处理现有数据
1. **迁移脚本**：将所有现有任务的 priority 设置为 'medium'
2. **API 兼容**：对未提供 priority 的请求使用默认值
3. **客户端兼容**：旧客户端仍能工作，看不到优先级功能

### 版本支持
- API v1: 支持优先级参数，但非必需
- API v2: priority 字段为必需（计划中）

---

## 实施清单

### 阶段一：数据层
- [ ] 创建数据库迁移脚本
- [ ] 更新 Task 模型定义
- [ ] 添加数据验证逻辑
- [ ] 编写数据层测试

### 阶段二：API 层
- [ ] 更新 API 端点文档
- [ ] 实现优先级筛选逻辑
- [ ] 添加优先级验证中间件
- [ ] 编写 API 测试

### 阶段三：业务逻辑
- [ ] 实现优先级工具函数
- [ ] 添加默认值处理
- [ ] 编写业务逻辑测试

### 阶段四：用户界面
- [ ] 创建 PriorityBadge 组件
- [ ] 创建 PrioritySelector 组件
- [ ] 更新 TaskItem 组件
- [ ] 添加任务筛选控件
- [ ] 编写 UI 组件测试

### 阶段五：集成与部署
- [ ] 运行完整测试套件
- [ ] 执行数据库迁移
- [ ] 更新 API 文档
- [ ] 部署到测试环境
- [ ] 用户验收测试

---

## 变更历史

| 版本 | 日期 | 变更描述 | 作者 |
|------|------|----------|------|
| 1.0.0 | 2024-01-15 | 初始规格 | AI-atom |
| 1.0.1 | 2024-01-16 | 添加 UI 组件细节 | AI-atom |

---

**注意事项**：
1. 所有变更必须通过测试套件
2. 数据库迁移必须在事务中执行
3. UI 组件需要支持暗色主题
4. 移动端需要响应式设计
5. 所有字符串需要支持国际化（i18n）