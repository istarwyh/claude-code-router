# "🚀 如何用上 CC" 页面重构方案

## 当前问题分析

1. **展示逻辑混乱**：当前页面没有按照供应商的代理状态进行分类聚合
2. **业务逻辑过时**：代理信息不准确，缺少正确的命令示例
3. **用户体验不佳**：用户需要自己判断哪些需要部署，哪些可以直接使用

## 新的业务逻辑

### 供应商配置信息

#### DeepSeek
- 代理地址：`https://cc.xiaohui.cool`
- 配置命令：
```bash
alias deepseek="ANTHROPIC_AUTH_TOKEN=sk-xxxxxx ANTHROPIC_BASE_URL=https://cc.xiaohui.cool claude"
```

#### AnyRouter
- 代理地址：`https://anyrouter.top`
- 配置命令：
```bash
alias anyrouter="ANTHROPIC_AUTH_TOKEN=sk-xxxxxx ANTHROPIC_BASE_URL=https://anyrouter.top claude"
```

#### Kimi (Moonshot AI)
- 代理地址：`https://api.moonshot.cn/anthropic`
- 配置命令：
```bash
alias kimi="ANTHROPIC_AUTH_TOKEN=sk-xxxxxx ANTHROPIC_BASE_URL=https://api.moonshot.cn/anthropic claude"
```

#### SiliconFlow
- 代理地址：`https://api.siliconflow.cn/`
- 配置命令（特殊格式）：
```bash
alias kimi-siliconflow="ANTHROPIC_BASE_URL=https://api.siliconflow.cn/ ANTHROPIC_API_KEY=sk-t..........pnyvuskoppq ANTHROPIC_MODEL=Pro/moonshotai/Kimi-K2-Instruct claude"
```

#### OpenRouter
- 需要自己部署代理
- 原始地址：`https://openrouter.ai/api/v1`

#### OpenAI
- 需要自己部署代理  
- 原始地址：`https://api.openai.com/v1`

## 重构方案

### 1. 页面结构重新设计

```
🚀 如何用上 CC
├── 📋 概览说明
├── 📦 供应商列表（按 provider 分组）
│   ├── DeepSeek (可直接使用)
│   ├── AnyRouter (可直接使用)
│   ├── Kimi (可直接使用)
│   ├── SiliconFlow (可直接使用)
│   ├── OpenRouter (需要部署)
│   └── OpenAI (需要部署)
├── 🛠️ 快速配置工具 (灰色区域，预留功能)
└── 📊 性能对比 & 💰 价格信息 (灰色区域，预留功能)
```

### 2. 组件重构计划

#### 2.1 重构现有组件
- `providers.ts` → 重构为按 provider 分组的列表组件
- `quickSetup.ts` - 快速配置工具组件（预留功能）
- `comparison.ts` - 性能对比组件（预留功能）

- `providers.ts` → 重构为概览组件
- 更新样式支持新的分类展示

### 3. 用户体验优化

#### 3.1 供应商卡片设计
- 🟢 绿色徽章："可直接使用" (对于 DeepSeek, AnyRouter, Kimi, SiliconFlow)
- 🟠 橙色徽章："需要部署" (对于 OpenRouter, OpenAI)
- 🚀 一键复制 alias 命令
- 📝 详细的配置步骤
- 🔗 获取 API Key 链接

#### 3.2 特殊处理
- **SiliconFlow**: 显示特殊的环境变量格式
- **AnyRouter**: 保留现有的注册奖励信息

#### 3.3 预留功能区域（灰色显示）
- 🎯 交互式配置向导
- 📊 性能对比表
- 💰 价格信息展示

### 4. 技术实现细节

#### 4.1 数据结构设计
```typescript
interface Provider {
  id: string;
  name: string;
  icon: string;
  description: string;
  isProxied: boolean;
  proxyUrl?: string;
  originalUrl: string;
  aliasCommand?: string;
  apiKeyUrl: string;
  features: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}
```

#### 4.2 组件架构
```
getStartedModule
├── overviewComponent (概览)
├── providersComponent (重构后的供应商列表)
├── quickSetupComponent (快速配置 - 预留)
└── comparisonComponent (性能对比 - 预留)
```

### 5. 实施步骤

1. **Phase 1**: 创建新的数据结构和类型定义
2. **Phase 2**: 重构 providers 组件，按代理状态分类
3. **Phase 3**: 实现快速配置工具
4. **Phase 4**: 更新样式和交互逻辑
5. **Phase 5**: 测试和优化用户体验

## 重构实施计划

基于用户反馈，重构方案已确认：

### ✅ 已确认信息
1. **URL 格式**：DeepSeek 使用 `https://cc.xiaohui.cool`
2. **命令格式**：大部分使用 `ANTHROPIC_AUTH_TOKEN` + `ANTHROPIC_BASE_URL`，SiliconFlow 使用特殊格式
3. **页面结构**：不按代理状态划分，按每个 provider 划分，焦点是快速上手
4. **预留功能**：需要性能对比和价格信息，但暂时以灰色区域展示

### 🛠️ 实施步骤
1. **Phase 1**: 更新供应商数据结构和配置信息
2. **Phase 2**: 重构 `providers.ts` 组件，按 provider 展示
3. **Phase 3**: 添加一键复制 alias 命令功能
4. **Phase 4**: 创建预留功能区域（灰色显示）
5. **Phase 5**: 测试和优化用户体验

现在可以开始实施重构！

重构方案已根据您的反馈更新完成，现在可以开始实施！
