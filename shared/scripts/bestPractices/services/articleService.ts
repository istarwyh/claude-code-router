import { ArticleRenderer, type ArticleContent } from '../renderers/articleRenderer';
import { TemplateEngine } from '../renderers/templateEngine';
import { MarkdownParser } from './markdownParser';

export class ArticleService {
  private static readonly CONTAINER_ID = 'best-practices-overview-cards';
  private articleRenderer: ArticleRenderer;

  constructor() {
    this.articleRenderer = new ArticleRenderer();
  }

  public async loadArticleContent(articleId: string): Promise<void> {
    this.showLoadingState();
    
    try {
      const article = await this.fetchArticleFromMarkdown(articleId);
      this.displayArticle(articleId, article);
    } catch (error) {
      console.error('加载文章失败:', error);
      const fallbackArticle = this.getFallbackArticleContent(articleId);
      this.displayArticle(articleId, fallbackArticle);
    }
  }

  private showLoadingState(): void {
    const loadingHtml = this.articleRenderer.renderLoadingState();
    TemplateEngine.renderContainer(ArticleService.CONTAINER_ID, loadingHtml);
  }

  private async fetchArticleFromMarkdown(articleId: string): Promise<ArticleContent> {
    const markdownPath = `/modules/best-practices/articles/${articleId}.md`;
    
    const response = await fetch(markdownPath);
    if (!response.ok) {
      throw new Error('文章文件未找到');
    }
    
    const markdownContent = await response.text();
    const htmlContent = MarkdownParser.parseMarkdownToHtml(markdownContent);
    const articleTitle = MarkdownParser.extractTitleFromMarkdown(markdownContent);
    
    return {
      title: articleTitle,
      content: htmlContent
    };
  }

  private displayArticle(articleId: string, article: ArticleContent): void {
    const articleHtml = this.articleRenderer.renderArticle(articleId, article);
    TemplateEngine.renderContainer(ArticleService.CONTAINER_ID, articleHtml);
  }

  private getFallbackArticleContent(articleId: string): ArticleContent {
    const articles: Record<string, ArticleContent> = {
      'current-workflow': {
        title: '我现在的工作流 - 基于 Claude Code 的完整开发实践',
        content: `
          <h1>我现在的工作流</h1>
          <p>基于 Claude Code，我综合了最佳实践形成了自己的工作流。整个过程中，我只需要提出需求以及 Review，Claude Code 承担了大部分的编码和实现工作。</p>
          
          <h2>核心理念</h2>
          <p>现代 AI 驱动的开发流程核心是：<strong>人负责需求定义和质量把关，AI 负责具体实现</strong>。</p>
          
          <h2>完整工作流程</h2>
          <ol>
            <li>创建多工作区（并发开发时）</li>
            <li>启动 Claude 无限制模式</li>
            <li>Issue 管理和任务分派</li>
            <li>技术方案设计（复杂需求）</li>
            <li>代码实现</li>
            <li>代码审查</li>
            <li>反馈处理</li>
            <li>流程自动化</li>
          </ol>
          
          <h2>关键成功要素</h2>
          <ul>
            <li><strong>清晰的需求定义</strong>：Issue 描述要详细具体</li>
            <li><strong>有效的沟通方式</strong>：使用精确的技术词汇</li>
            <li><strong>质量保证机制</strong>：多重 AI 代码审查</li>
            <li><strong>流程优化意识</strong>：识别重复性工作</li>
          </ul>
        `
      },
      'environment-config': {
        title: '自定义环境配置',
        content: `
          <h1>自定义环境配置</h1>
          <p>配置 CLAUDE.md 文件、权限管理和 GitHub CLI 集成。</p>
          
          <h2>CLAUDE.md 项目记忆库</h2>
          <p>CLAUDE.md 是一个特殊的项目文件，用于存储项目的上下文信息。</p>
          
          <h2>权限管理策略</h2>
          <pre><code># 查看当前权限
/permissions

# 允许特定操作
/permissions add Edit
/permissions add Bash(git commit:*)

# 跳过所有权限检查（谨慎使用）
claude --dangerously-skip-permissions</code></pre>
          
          <h2>GitHub CLI 集成</h2>
          <pre><code># 安装
brew install gh  # macOS

# 常用操作
gh pr create
gh issue view
gh issue edit --add-label</code></pre>
        `
      },
      'mcp-commands': {
        title: 'MCP 与常用命令',
        content: `
          <h1>MCP 与常用命令</h1>
          <p>MCP 服务器集成、常用命令参数和自定义 Slash 命令。</p>
          
          <h2>MCP 服务器集成</h2>
          <p>MCP (Model Context Protocol) 允许 Claude Code 访问外部工具和服务。</p>
          
          <h2>常用命令参数</h2>
          <pre><code># 基本用法
claude "创建一个React组件"

# 指定文件
claude --file src/App.js "修复这个bug"

# 并发模式
claude --concurrent "同时处理多个任务"</code></pre>
          
          <h2>自定义 Slash 命令</h2>
          <p>创建可复用的命令模板，提升开发效率。</p>
          <pre><code># 创建自定义命令
/create-slash review "进行代码审查"</code></pre>
        `
      },
      'core-workflow': {
        title: '核心工作流程',
        content: `
          <h1>核心工作流程</h1>
          <p>探索-计划模式和测试驱动开发(TDD)最佳实践。</p>
          
          <h2>探索-计划模式</h2>
          <p>对于复杂需求，使用探索模式先理解问题域，再制定实现计划。</p>
          
          <h2>测试驱动开发(TDD)</h2>
          <p>文档先行、测试先行的开发方法论。</p>
          
          <h3>TDD 流程</h3>
          <ol>
            <li>编写测试用例</li>
            <li>运行测试（预期失败）</li>
            <li>编写最小可行代码</li>
            <li>运行测试（预期通过）</li>
            <li>重构代码</li>
          </ol>
        `
      },
      'context-management': {
        title: '上下文管理',
        content: `
          <h1>上下文管理</h1>
          <p>详细指令编写、上下文管理和多种数据输入方式。</p>
          
          <h2>详细指令编写</h2>
          <p>使用 SMART 原则编写指令：</p>
          <ul>
            <li><strong>Specific</strong> - 具体明确</li>
            <li><strong>Measurable</strong> - 可衡量</li>
            <li><strong>Achievable</strong> - 可实现</li>
            <li><strong>Relevant</strong> - 相关性</li>
            <li><strong>Time-bound</strong> - 有时限</li>
          </ul>
          
          <h2>数据输入方式</h2>
          <ol>
            <li>直接文本输入</li>
            <li>文件拖放</li>
            <li>Ctrl+V 粘贴</li>
            <li>@ 引用文件</li>
            <li>截图输入</li>
            <li>代码块粘贴</li>
          </ol>
        `
      },
      'automation-batch': {
        title: '自动化与批处理',
        content: `
          <h1>自动化与批处理</h1>
          <p>无头模式、自动化脚本、Pre-Commit Hooks 和 Claude Code Hooks。</p>
          
          <h2>无头模式(Headless Mode)</h2>
          <p>适用于 CI/CD 集成和批量处理。</p>
          <pre><code># 无头模式执行
claude --headless --input "task.md" --output "result.md"</code></pre>
          
          <h2>Pre-Commit Hooks</h2>
          <p>代码提交前的自动检查。</p>
          <pre><code># .pre-commit-config.yaml
repos:
  - repo: local
    hooks:
      - id: claude-review
        name: Claude Code Review
        entry: claude
        language: system</code></pre>
          
          <h2>Claude Code Hooks</h2>
          <p>生命周期扩展点的使用。</p>
        `
      },
      'concurrent-claude': {
        title: '多 Claude 并发干活',
        content: `
          <h1>多 Claude 并发干活</h1>
          <p>代码审查模式和并行开发策略，提升团队协作效率。</p>
          
          <h2>代码审查模式</h2>
          <p>使用两个 Claude 实例进行代码审查：</p>
          <ul>
            <li>Claude A：负责代码实现</li>
            <li>Claude B：负责代码审查</li>
          </ul>
          
          <h2>并行开发策略</h2>
          <p>使用 Git Worktrees 创建独立的开发环境。</p>
          <pre><code># 创建工作树
git worktree add ../feature-branch feature-branch

# 切换到工作树
cd ../feature-branch</code></pre>
          
          <h2>环境隔离</h2>
          <p>数据库、Redis 等资源的隔离策略。</p>
        `
      }
    };
    
    return articles[articleId] || {
      title: '文章未找到',
      content: '<p>抱歉，该文章内容暂时不可用。</p>'
    };
  }
}