import { MarkdownParser } from './MarkdownParser';

export interface Article {
  id: string;
  title: string;
  content: string;
}

export class ArticleService {
  private markdownParser: MarkdownParser;
  private cache: Map<string, Article> = new Map();

  constructor() {
    this.markdownParser = new MarkdownParser();
  }

  public async getArticle(cardId: string): Promise<Article> {
    // 检查缓存
    if (this.cache.has(cardId)) {
      return this.cache.get(cardId)!;
    }

    try {
      // 模拟从服务器获取 Markdown 内容
      const markdownContent = await this.fetchMarkdownContent(cardId);
      
      // 解析 Markdown
      const htmlContent = this.markdownParser.parse(markdownContent);
      
      const article: Article = {
        id: cardId,
        title: this.getTitleFromCardId(cardId),
        content: htmlContent
      };

      // 缓存结果
      this.cache.set(cardId, article);
      
      return article;
    } catch (error) {
      throw new Error(`无法加载文章 ${cardId}: ${error.message}`);
    }
  }

  private async fetchMarkdownContent(cardId: string): Promise<string> {
    // 在实际应用中，这里会从服务器获取 Markdown 文件
    // 现在我们返回一个模拟的内容
    return this.getMockMarkdownContent(cardId);
  }

  private getMockMarkdownContent(cardId: string): string {
    const mockContent = {
      'workflow-overview': `
# 我现在的工作流

## 概述
基于 Claude Code 的完整开发工作流，从需求到部署的全流程最佳实践。

## 工作流时序图

\`\`\`mermaid
sequenceDiagram
    participant Dev as 开发者
    participant CC as Claude Code
    participant Git as GitHub
    participant CI as CI/CD
    
    Dev->>CC: 提出需求
    CC->>CC: 分析需求
    CC->>Git: 创建分支
    CC->>CC: 生成代码
    CC->>Git: 提交代码
    CC->>Dev: 请求审查
    Dev->>CC: 提供反馈
    CC->>Git: 修改代码
    CC->>Git: 合并到主分支
    Git->>CI: 触发部署
\`\`\`

## 核心步骤

1. **需求分析**: 明确功能需求和技术要求
2. **环境准备**: 配置开发环境和依赖
3. **代码生成**: 使用 Claude Code 生成高质量代码
4. **测试验证**: 运行测试确保代码质量
5. **代码审查**: 人工审查 AI 生成的代码
6. **集成测试**: 确保新功能与现有系统兼容
7. **部署上线**: 自动化部署到生产环境
8. **监控反馈**: 监控系统运行状态

## 最佳实践

- 始终保持代码审查的习惯
- 使用 TDD 方法确保代码质量
- 定期更新项目记忆库
- 合理使用 MCP 服务器扩展功能
      `,
      'environment-config': `
# 自定义环境配置

## CLAUDE.md 文件配置

创建项目记忆库，让 Claude Code 更好地理解你的项目：

\`\`\`markdown
# 项目记忆库

## 项目概述
这是一个 TypeScript + React 项目...

## 技术栈
- Frontend: React, TypeScript, Tailwind CSS
- Backend: Node.js, Express
- Database: PostgreSQL
- Deployment: Vercel

## 代码规范
- 使用 ESLint + Prettier
- 遵循函数式编程原则
- 优先使用 TypeScript 类型安全
\`\`\`

## 权限管理策略

配置 Claude Code 的操作权限：

\`\`\`bash
# 允许文件操作
claude --allow-file-operations

# 限制网络访问
claude --no-network

# 自定义权限配置
claude --permissions-config ./permissions.json
\`\`\`

## GitHub CLI 集成

无缝集成 GitHub 工作流：

\`\`\`bash
# 安装 GitHub CLI
brew install gh

# 认证
gh auth login

# 配置 Claude Code 使用 GitHub CLI
claude config set github.cli true
\`\`\`
      `,
      // 其他文章的模拟内容...
    };

    return mockContent[cardId] || `# ${cardId}\n\n内容正在开发中...`;
  }

  private getTitleFromCardId(cardId: string): string {
    const titles = {
      'workflow-overview': '我现在的工作流',
      'environment-config': '自定义环境配置',
      'mcp-commands': 'MCP 与常用命令',
      'core-workflow': '核心工作流程',
      'context-management': '上下文管理',
      'automation-batch': '自动化与批处理',
      'concurrent-claude': '多 Claude 并发干活'
    };

    return titles[cardId] || cardId;
  }
}
