export const howToImplementComponent = `
<!-- How to Implement Claude Code - 实现指南 -->
<div class="implementation-guide">
    <div class="guide-header">
        <h1>🏗️ 如何实现 Claude Code</h1>
        <p class="subtitle">基于 shareAI-lab/analysis_claude_code 的完整实现指南</p>
    </div>

    <!-- 系统架构全景 -->
    <div class="architecture-section">
        <h2>🎯 系统架构全景</h2>
        <div class="ascii-diagram">
            <pre>
                    Claude Code Agent 系统架构
    ┌─────────────────────────────────────────────────────────────────┐
    │                        用户交互层                               │
    │   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
    │   │   CLI接口   │  │  VSCode集成 │  │   Web界面   │           │
    │   │   (命令行)  │  │   (插件)    │  │  (浏览器)   │           │
    │   └─────────────┘  └─────────────┘  └─────────────┘           │
    └─────────────┬───────────────┬───────────────┬───────────────────┘
                  │               │               │
    ┌─────────────▼───────────────▼───────────────▼───────────────────┐
    │                      Agent核心调度层                           │
    │                                                                 │
    │  ┌─────────────────┐         ┌─────────────────┐               │
    │  │  nO主循环引擎   │◄────────┤  h2A消息队列   │               │
    │  │  (AgentLoop)    │         │  (AsyncQueue)   │               │
    │  │  • 任务调度     │         │  • 异步通信     │               │
    │  │  • 状态管理     │         │  • 流式处理     │               │
    │  │  • 异常处理     │         │  • 背压控制     │               │
    │  └─────────────────┘         └─────────────────┘               │
    │           │                           │                         │
    │           ▼                           ▼                         │
    │  ┌─────────────────┐         ┌─────────────────┐               │
    │  │  wu会话流生成器 │         │  wU2消息压缩器  │               │
    │  │ (StreamGen)     │         │ (Compressor)    │               │
    │  │  • 实时响应     │         │  • 智能压缩     │               │
    │  │  • 流式输出     │         │  • 上下文优化   │               │
    │  └─────────────────┘         └─────────────────┘               │
    └─────────────┬───────────────────────┬─────────────────────────────┘
                  │                       │
    ┌─────────────▼───────────────────────▼─────────────────────────────┐
    │                     工具执行与管理层                              │
    │                                                                   │
    │ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌─────────────────┐│
    │ │MH1工具引擎 │ │UH1并发控制│ │SubAgent管理│ │  权限验证网关   ││
    │ │(ToolEngine)│ │(Scheduler) │ │(TaskAgent) │ │ (PermissionGW)  ││
    │ │• 工具发现  │ │• 并发限制  │ │• 任务隔离  │ │ • 权限检查     ││
    │ │• 参数验证  │ │• 负载均衡  │ │• 错误恢复  │ │ • 安全审计     ││
    │ │• 执行调度  │ │• 资源管理  │ │• 状态同步  │ │ • 访问控制     ││
    │ └────────────┘ └────────────┘ └────────────┘ └─────────────────┘│
    │       │              │              │              │            │
    │       ▼              ▼              ▼              ▼            │
    │ ┌────────────────────────────────────────────────────────────────┐│
    │ │                    工具生态系统                              ││
    │ │ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐││
    │ │ │ 文件操作工具│ │ 搜索发现工具│ │ 任务管理工具│ │ 系统执行工具│││
    │ │ │• Read/Write │ │• Glob/Grep  │ │• Todo系统   │ │• Bash执行   │││
    │ │ │• Edit/Multi │ │• 模式匹配   │ │• 状态跟踪   │ │• 命令调用   │││
    │ │ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘││
    │ │ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐││
    │ │ │ 网络交互工具│ │ 特殊功能工具│ │ MCP集成工具 │ │ 开发者工具  │││
    │ │ │• WebFetch   │ │• Plan模式   │ │• 协议支持   │ │• 代码诊断   │││
    │ │ │• WebSearch  │ │• 退出计划   │ │• 服务发现   │ │• 性能监控   │││
    │ │ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘││
    │ └────────────────────────────────────────────────────────────────┘│
    └─────────────┬─────────────────────────────────────────────────────┘
                  │
    ┌─────────────▼─────────────────────────────────────────────────────┐
    │                    存储与持久化层                                │
    │                                                                   │
    │ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
    │ │短期记忆存储 │ │中期压缩历史 │ │长期持久存储 │ │状态缓存系统 │ │
    │ │(Messages)   │ │(Compressed) │ │(CLAUDE.md)  │ │(StateCache) │ │
    │ │• 当前会话   │ │• 历史摘要   │ │• 用户偏好   │ │• 工具状态   │ │
    │ │• 上下文队列 │ │• 关键信息   │ │• 配置信息   │ │• 执行历史   │ │
    │ │• 临时缓存   │ │• 压缩算法   │ │• 持久化机制 │ │• 性能指标   │ │
    │ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ │
    └───────────────────────────────────────────────────────────────────┘
            </pre>
        </div>
    </div>

    <!-- 实现步骤 -->
    <div id="markdown-implementation" class="markdown-content">
        <!-- Markdown内容将通过渲染器加载 -->
    </div>

    <!-- 关键代码示例 -->
    <div class="code-examples">
        <h2>💡 关键代码示例</h2>
        
        <div class="example-tabs">
            <button class="tab-btn active" onclick="showTab('agent-loop')">Agent循环</button>
            <button class="tab-btn" onclick="showTab('tool-engine')">工具引擎</button>
            <button class="tab-btn" onclick="showTab('security')">安全验证</button>
            <button class="tab-btn" onclick="showTab('storage')">存储管理</button>
        </div>

        <div class="tab-content active" id="agent-loop">
            <div class="code-block">
                <code>// 核心Agent循环实现
class ClaudeCodeAgent {
    async *run(messages: Message[]): AsyncGenerator<Message> {
        const context = await this.memoryManager.loadContext();
        
        for await (const message of this.messageQueue) {
            const tools = await this.toolEngine.discoverTools(message);
            
            for (const tool of tools) {
                if (await this.permissionGateway.validate(tool, context)) {
                    const result = await this.toolEngine.execute(tool);
                    yield result;
                }
            }
        }
    }
}</code>
                <button class="copy-btn" onclick="copyCode(this)">复制</button>
            </div>
        </div>

        <div class="tab-content" id="tool-engine">
            <div class="code-block">
                <code>// 工具引擎实现
class ToolEngine {
    private tools = new Map<string, Tool>();
    private scheduler = new ConcurrencyScheduler(10);
    
    async execute(tool: Tool, params: any): Promise<ToolResult> {
        // 1. 参数验证
        const validatedParams = await this.validateParams(tool, params);
        
        // 2. 权限检查
        await this.permissionGateway.check(tool, validatedParams);
        
        // 3. 并发控制
        return await this.scheduler.schedule(async () => {
            // 4. 工具执行
            return await tool.execute(validatedParams);
        });
    }
}</code>
                <button class="copy-btn" onclick="copyCode(this)">复制</button>
            </div>
        </div>

        <div class="tab-content" id="security">
            <div class="code-block">
                <code>// 安全验证框架
class PermissionGateway {
    async validate(tool: Tool, context: Context): Promise<boolean> {
        // 1. UI输入验证
        if (!this.validateUIInput(context)) return false;
        
        // 2. 消息路由验证
        if (!this.validateMessageRouting(tool, context)) return false;
        
        // 3. 工具调用验证
        if (!this.validateToolCall(tool)) return false;
        
        // 4. 参数内容验证
        if (!this.validateParameters(tool)) return false;
        
        // 5. 系统资源访问验证
        if (!this.validateResourceAccess(tool)) return false;
        
        // 6. 输出内容过滤
        return await this.validateOutput(tool);
    }
}</code>
                <button class="copy-btn" onclick="copyCode(this)">复制</button>
            </div>
        </div>

        <div class="tab-content" id="storage">
            <div class="code-block">
                <code>// 智能压缩存储
class MemoryManager {
    async compressContext(messages: Message[]): Promise<CompressedContext> {
        const importance = await this.calculateImportance(messages);
        
        return await this.compressor.compress({
            messages,
            preserveRatio: 0.3,
            importanceThreshold: 0.8,
            compressionAlgorithm: 'semantic-preserve'
        });
    }
}</code>
                <button class="copy-btn" onclick="copyCode(this)">复制</button>
            </div>
        </div>
    </div>

    <!-- 部署指南 -->
    <div class="deployment-guide">
        <h2>🚀 快速部署</h2>
        
        <div class="deploy-steps">
            <div class="step">
                <div class="step-number">1</div>
                <div class="step-content">
                    <h4>克隆项目</h4>
                    <div class="code-block">
                        <code>git clone https://github.com/shareAI-lab/open-claude-code.git
cd open-claude-code</code>
                        <button class="copy-btn" onclick="copyCode(this)">复制</button>
                    </div>
                </div>
            </div>
            
            <div class="step">
                <div class="step-number">2</div>
                <div class="step-content">
                    <h4>安装依赖</h4>
                    <div class="code-block">
                        <code>npm install</code>
                        <button class="copy-btn" onclick="copyCode(this)">复制</button>
                    </div>
                </div>
            </div>
            
            <div class="step">
                <div class="step-number">3</div>
                <div class="step-content">
                    <h4>配置环境</h4>
                    <div class="code-block">
                        <code>cp .env.example .env
# 编辑 .env 文件，配置 API 密钥</code>
                        <button class="copy-btn" onclick="copyCode(this)">复制</button>
                    </div>
                </div>
            </div>
            
            <div class="step">
                <div class="step-number">4</div>
                <div class="step-content">
                    <h4>启动开发</h4>
                    <div class="code-block">
                        <code>npm run dev</code>
                        <button class="copy-btn" onclick="copyCode(this)">复制</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 最佳实践 -->
    <div class="best-practices">
        <h2>📋 最佳实践</h2>
        
        <div class="practices-grid">
            <div class="practice-card">
                <h3>🎯 模块化设计</h3>
                <p>将系统拆分为独立的模块，每个模块负责特定的功能</p>
                <ul>
                    <li>AgentLoop: 核心调度</li>
                    <li>ToolEngine: 工具管理</li>
                    <li>Security: 安全验证</li>
                    <li>Storage: 存储管理</li>
                </ul>
            </div>
            
            <div class="practice-card">
                <h3>🔐 安全第一</h3>
                <p>在每个层级都实现安全验证机制</p>
                <ul>
                    <li>输入验证</li>
                    <li>权限检查</li>
                    <li>资源限制</li>
                    <li>输出过滤</li>
                </ul>
            </div>
            
            <div class="practice-card">
                <h3>⚡ 性能优化</h3>
                <p>通过异步处理和智能缓存提升性能</p>
                <ul>
                    <li>异步执行</li>
                    <li>并发控制</li>
                    <li>内存压缩</li>
                    <li>缓存策略</li>
                </ul>
            </div>
            
            <div class="practice-card">
                <h3>🧪 测试驱动</h3>
                <p>为每个模块编写全面的测试用例</p>
                <ul>
                    <li>单元测试</li>
                    <li>集成测试</li>
                    <li>安全测试</li>
                    <li>性能测试</li>
                </ul>
            </div>
        </div>
    </div>
</div>

<style>
.implementation-guide {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: var(--text-primary);
}

.guide-header {
    text-align: center;
    margin-bottom: 3rem;
}

.guide-header h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.subtitle {
    font-size: 1.2rem;
    color: var(--text-secondary);
}

.architecture-section,
.implementation-steps,
.code-examples,
.deployment-guide,
.best-practices {
    margin-bottom: 3rem;
}

.architecture-section h2,
.implementation-steps h2,
.code-examples h2,
.deployment-guide h2,
.best-practices h2 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
    color: var(--text-primary);
}

.ascii-diagram {
    background: var(--bg-secondary);
    border-radius: 12px;
    padding: 2rem;
    overflow-x: auto;
    border: 1px solid var(--border-color);
}

.ascii-diagram pre {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.9rem;
    line-height: 1.4;
    margin: 0;
    color: var(--text-primary);
}

.step-card {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 2rem;
    margin-bottom: 1.5rem;
    transition: all 0.3s ease;
}

.step-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.step-card h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: var(--text-primary);
}

.step-content p {
    color: var(--text-secondary);
    margin-bottom: 1rem;
}

.code-block {
    position: relative;
    background: var(--bg-code);
    border-radius: 8px;
    padding: 1rem;
    margin: 1rem 0;
    overflow-x: auto;
}

.code-block code {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.9rem;
    color: var(--text-code);
}

.copy-btn {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: var(--accent-color);
    color: white;
    border: none;
    border-radius: 4px;
    padding: 0.25rem 0.5rem;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.2s ease;
}

.copy-btn:hover {
    background: var(--accent-hover);
}

.example-tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid var(--border-color);
}

.tab-btn {
    background: none;
    border: none;
    padding: 0.75rem 1.5rem;
    cursor: pointer;
    border-radius: 8px 8px 0 0;
    color: var(--text-secondary);
    transition: all 0.3s ease;
}

.tab-btn.active {
    background: var(--accent-color);
    color: white;
}

.tab-content {
    display: none;
}

.tab-content.active {
    display: block;
}

.deploy-steps {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.step {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
}

.step-number {
    background: var(--accent-color);
    color: white;
    border-radius: 50%;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    flex-shrink: 0;
}

.step-content h4 {
    margin: 0 0 0.5rem 0;
    color: var(--text-primary);
}

.practices-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
}

.practice-card {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 1.5rem;
    transition: all 0.3s ease;
}

.practice-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.practice-card h3 {
    font-size: 1.25rem;
    margin-bottom: 1rem;
    color: var(--text-primary);
}

.practice-card ul {
    list-style: none;
    padding: 0;
}

.practice-card li {
    padding: 0.25rem 0;
    color: var(--text-secondary);
}

.practice-card li:before {
    content: "✓";
    color: var(--accent-color);
    margin-right: 0.5rem;
}

@media (max-width: 768px) {
    .implementation-guide {
        padding: 1rem;
    }
    
    .guide-header h1 {
        font-size: 2rem;
    }
    
    .deploy-steps {
        grid-template-columns: 1fr;
    }
    
    .practices-grid {
        grid-template-columns: 1fr;
    }
}
</style>

<script>
// 标签切换功能
function showTab(tabId) {
    // 隐藏所有标签内容
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // 移除所有标签按钮的激活状态
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 显示选中的标签内容
    document.getElementById(tabId).classList.add('active');
    event.target.classList.add('active');
}

// 复制代码功能
function copyCode(button) {
    const codeBlock = button.previousElementSibling;
    const text = codeBlock.textContent;
    
    navigator.clipboard.writeText(text).then(() => {
        const originalText = button.textContent;
        button.textContent = '已复制!';
        button.style.background = '#28a745';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 2000);
    });
}

// 初始化Markdown渲染器
function initializeMarkdownRenderer() {
    const container = document.getElementById('markdown-implementation');
    if (!container) return;

    // 创建Markdown渲染器实例
    const renderer = new MarkdownRenderer('markdown-implementation');
    
    // 加载Claude Code实现文档
    renderer.loadMarkdown('/docs/claude-code-implementation.md');
}

// 简单的Markdown渲染器类
class MarkdownRenderer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('Container not found:', containerId);
            return;
        }
        
        this.setupContainer();
    }

    setupContainer() {
        // 清空容器并添加基本结构
        this.container.innerHTML = `
            <div class="markdown-loading">
                <div class="spinner"></div>
                <p>正在加载实现指南...</p>
            </div>
            <div class="markdown-content-area" style="display: none;"></div>
            <div class="markdown-error" style="display: none;">
                <div class="error-icon">⚠️</div>
                <p>加载文档失败，请刷新重试</p>
            </div>
        `;
        
        this.loading = this.container.querySelector('.markdown-loading');
        this.contentArea = this.container.querySelector('.markdown-content-area');
        this.error = this.container.querySelector('.markdown-error');
    }

    async loadMarkdown(url) {
        this.showLoading();
        
        try {
            // 由于这是静态站点，我们需要处理本地文件
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`加载失败: ${response.status}`);
            }
            
            const markdown = await response.text();
            const html = this.renderMarkdown(markdown);
            this.renderContent(html);
        } catch (error) {
            console.error('加载Markdown失败:', error);
            this.showError();
            // 如果加载失败，显示备用内容
            this.renderFallbackContent();
        }
    }

    renderMarkdown(markdown) {
        let html = markdown;
        
        // 处理标题
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
        
        // 处理代码块
        html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        // 处理粗体和斜体
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // 处理链接
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
        
        // 处理列表
        html = html.replace(/^\* (.+)$/gm, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>\s*)+/gs, '<ul>$&</ul>');
        
        // 处理数字列表
        html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>\s*)+/gs, '<ol>$&</ol>');
        
        // 处理引用
        html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
        
        // 处理换行
        html = html.replace(/\n\n/g, '</p><p>');
        html = html.replace(/^<p>/, '<p>');
        html = html.replace(/<\/p>$/, '</p>');
        
        // 确保段落
        if (!html.startsWith('<')) {
            html = '<p>' + html + '</p>';
        }
        
        return html;
    }

    renderContent(html) {
        this.contentArea.innerHTML = html;
        this.hideLoading();
        this.hideError();
        this.showContent();
        
        // 添加代码高亮
        this.highlightCode();
    }

    highlightCode() {
        const codeBlocks = this.contentArea.querySelectorAll('pre code');
        codeBlocks.forEach(block => {
            let html = block.innerHTML;
            
            // TypeScript/JavaScript高亮
            html = html.replace(/\b(class|function|async|await|const|let|var|import|export|return|if|else|for|while|try|catch|throw|new|this|super|extends|implements|interface|type|enum|namespace|private|public|protected|static|readonly|abstract|override|as|from|of|in|instanceof|typeof|void|never|any|unknown|string|number|boolean|object|Array|Promise|async|await)\b/g, '<span style="color: #d73a49; font-weight: bold;">$1</span>');
            
            // 字符串高亮
            html = html.replace(/"([^"]*)"/g, '<span style="color: #032f62;">"$1"</span>');
            html = html.replace(/'([^']*)'/g, '<span style="color: #032f62;">\'$1\'</span>');
            
            // 注释高亮
            html = html.replace(/\/\/.*$/gm, '<span style="color: #6a737d; font-style: italic;">$&</span>');
            html = html.replace(/\/\*[\s\S]*?\*\//g, '<span style="color: #6a737d; font-style: italic;">$&</span>');
            
            // 数字高亮
            html = html.replace(/\b\d+\b/g, '<span style="color: #005cc5;">$&</span>');
            
            block.innerHTML = html;
        });
    }

    renderFallbackContent() {
        const fallbackContent = `
            <h1>🎯 如何实现 Claude Code</h1>
            <p>基于 shareAI-lab/analysis_claude_code 的完整实现指南</p>
            
            <h2>🚀 快速开始</h2>
            <p>Claude Code 是一个智能代码助手系统，提供从架构设计到实际部署的全链路指导。</p>
            
            <h3>系统架构</h3>
            <ul>
                <li><strong>用户交互层</strong> - CLI、VSCode、Web界面</li>
                <li><strong>Agent核心调度层</strong> - 消息队列、状态管理、流式处理</li>
                <li><strong>工具执行管理层</strong> - 权限验证、并发控制、任务隔离</li>
                <li><strong>存储与持久化层</strong> - 短期/中期/长期存储机制</li>
            </ul>
            
            <h3>核心特性</h3>
            <ul>
                <li>🔐 6层安全验证系统</li>
                <li>⚡ 智能压缩存储</li>
                <li>🔄 流式响应支持</li>
                <li>🛠️ 动态工具发现</li>
            </ul>
            
            <h2>📋 实现步骤</h2>
            <ol>
                <li><strong>项目初始化</strong> - 设置TypeScript环境和依赖</li>
                <li><strong>核心架构实现</strong> - 构建AgentLoop和消息队列</li>
                <li><strong>安全框架实现</strong> - 6层权限验证系统</li>
                <li><strong>存储系统实现</strong> - 分层存储和智能压缩</li>
                <li><strong>工具引擎实现</strong> - 并发控制和调度管理</li>
            </ol>
            
            <h2>🔧 技术栈</h2>
            <ul>
                <li>TypeScript - 类型安全和现代JavaScript</li>
                <li>Async Generators - 流式响应处理</li>
                <li>消息队列 - 异步通信和背压控制</li>
                <li>权限网关 - 多层安全验证</li>
            </ul>
        `;
        
        this.renderContent(fallbackContent);
    }

    showLoading() {
        this.loading.style.display = 'block';
        this.contentArea.style.display = 'none';
        this.error.style.display = 'none';
    }

    hideLoading() {
        this.loading.style.display = 'none';
    }

    showContent() {
        this.contentArea.style.display = 'block';
    }

    showError() {
        this.error.style.display = 'block';
        this.hideLoading();
        this.hideContent();
    }

    hideError() {
        this.error.style.display = 'none';
    }

    hideContent() {
        this.contentArea.style.display = 'none';
    }
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', () => {
    initializeMarkdownRenderer();
});

// 添加加载指示器样式
const style = document.createElement('style');
style.textContent = `
    .markdown-loading {
        text-align: center;
        padding: 4rem 2rem;
        color: var(--text-secondary);
    }
    
    .spinner {
        border: 3px solid var(--border-color);
        border-top: 3px solid var(--accent-color);
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .markdown-error {
        text-align: center;
        padding: 4rem 2rem;
        color: var(--text-secondary);
    }
    
    .error-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
    }
    
    .markdown-content-area {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
    }
`;
document.head.appendChild(style);
</script>
`;
