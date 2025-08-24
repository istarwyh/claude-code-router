# 新增“最佳实践”卡片操作指南

本指南定义向最佳实践模块新增一张卡片的标准流程（SOP）。
你阅读本指南并收到一段 Markdown 内容后，应严格按此文执行，完成卡片新增。

## 适用范围

- 模块：`src/client/bestPractices/`
- 内容：单篇 Markdown 文章 + 概览卡片元数据

## 前置条件

- 已准备好文章 Markdown 内容（中文，带适当小标题）
- 具备卡片必要元信息：
  - 必填：`id`、`title`、`category`
  - 可选：`description`、`imageUrl`、`tags`、`tips`、`difficulty`、`readTime`、`overview`、`sections`、`lastUpdated`、`version`

## 分类与类型

- 内置分类：`workflow` | `configuration` | `mcp-commands` | `context` | `automation` | `concurrency` | `tools`
- 分类图标配置：`src/client/bestPractices/data/categoryConfig.ts`
- 类型定义（勿破坏）：`src/client/shared/types/ContentCard.ts` 中的 `PracticeCard`

如需新增分类，需同时：
- 在 `categoryConfig.ts` 新增图标
- 在 `PracticeCard.category` 联合类型中加入新分类字面量

## 命名规范

- 文件名与 `id` 建议一致，使用 kebab-case
- 例：`software-engineering-with-claude`

## 实施步骤

1. 新增 Markdown 文章文件

- 路径：`src/client/bestPractices/content/`
- 文件名：`<id>.md`
- 示例：

```text
src/client/bestPractices/content/software-engineering-with-claude.md
```

2. 注册卡片元数据（概览展示）

- 文件：`src/client/bestPractices/data/cardsData.ts`
- 在导出的 `bestPracticesCards` 数组中新增一项。示例模板：

```ts
{
  id: 'software-engineering-with-claude',
  title: '软件工程与 Claude',
  description: '用软件工程方法驯服 AI：Brief、KISS、YAGNI、DRY、SOLID 的落地指南',
  category: 'workflow',
  difficulty: 'intermediate',
  readTime: '10 分钟',
  imageUrl: 'https://example.com/cover.jpeg',
  tags: ['KISS', 'YAGNI', 'DRY', 'SOLID', 'Brief'],
  tips: [
    { type: 'info', title: '流程先行', content: '先定义数据与边界，再写代码' },
    { type: 'success', title: '减复杂', content: '消除特殊分支，代码自然变短' }
  ],
  sections: [
    { title: 'Brief', content: '函数短小、参数精简、纯函数优先', type: 'text' },
    { title: 'KISS', content: '能直不绕，优先简单方案', type: 'text' },
    { title: 'YAGNI', content: '不为未来的假想需求提前设计', type: 'text' },
    { title: 'DRY', content: '消除重复，抽象在恰当层次', type: 'text' },
    { title: 'SOLID', content: '以可维护性为核心的 OO 原则', type: 'text' }
  ],
  lastUpdated: '2025-08-24',
  version: '1.0.0'
}
```

3. 建立 id→Markdown 内容映射（文章加载）

- 文件：`src/client/bestPractices/services/ArticleService.ts`
- 在 `contentMap` 中新增一条：

```ts
'software-engineering-with-claude': async () => (
  await import('../content/software-engineering-with-claude.md')
).default,
```

- 可选：在 `getTitleFromCardId()` 中添加标题兜底映射：

```ts
'software-engineering-with-claude': '软件工程与 Claude',
```

4. 构建与本地验证

- 构建：

```bash
npm run build:client
```

- 本地预览（Cloudflare Workers 开发服务器）：

```bash
npm run dev
```

- 验收点：
  - 概览页出现新卡片（标题、图片、信息完整）
  - 点击卡片进入文章页，右上角“返回概览”按钮可用
  - 移动端展示正常，无遮挡

## 内容撰写建议

- 文章使用清晰层级的小标题（## / ###），适度分段
- 可使用代码块、列表、Mermaid 图（由统一渲染器处理）
- 避免过度冗长，突出“做法与原因”

## 常见错误与排查

- 导入路径错误：确认 `contentMap` 中相对路径与文件名一致
- 分类缺图标/未在类型中注册：仅在新增分类时需要处理
- 构建未更新：确保执行 `npm run build:client`

## Definition of Done（完成判定）

- 文章文件已落位：`src/client/bestPractices/content/<id>.md`
- `cardsData.ts` 已新增卡片项
- `ArticleService.ts` 已添加 `contentMap` 映射（及可选标题映射）
- 构建通过，无错误
- 本地手动验收通过（概览展示、跳转阅读、返回导航、移动端视图）

## AI 执行说明

当你（AI）被要求根据一段给定 Markdown 内容新增卡片时：

1. 选择 `id`（若用户未提供则从标题归一化生成 kebab-case）
2. 将用户提供的封面图作为 `imageUrl`（若有）
3. `category`：参考 src/client/shared/types/ContentCard.ts 中的枚举，也可以自己添加
4. `difficulty`：默认 `intermediate`；`readTime` 可设为 5–15 分钟
5. 从 Markdown 小标题中抽取 3–6 条 `sections`
6. 根据内容提炼 1–3 条 `tips`（类型可用 `info|success|warning|tip|expert`）
7. 完成步骤 1–4 的所有修改与构建
8. 复述修改点并提供人工验收清单
