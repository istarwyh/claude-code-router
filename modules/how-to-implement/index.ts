export const implementationModule = `
<!-- How to Implement Claude Code - 实现指南 -->
<section class="content-section" id="how-to-implement">
<div class="implementation-guide">
    <div class="guide-header">
        <h1>🏗️ 如何实现 Claude Code</h1>
        <p class="subtitle">基于 <a href="https://github.com/shareAI-lab/analysis_claude_code" target="_blank">shareAI-lab/analysis_claude_code</a> 的核心技术实现</p>
    </div>

    <!-- 核心架构设计 -->
    <div class="architecture-section">
        <h2>🎯 核心架构设计</h2>
        <div class="architecture-overview">
            <div class="layer">
                <h3>📱 用户交互层</h3>
                <p>CLI 接口 • VSCode 插件 • Web 界面</p>
            </div>
            <div class="layer">
                <h3>⚙️ Agent 核心调度层</h3>
                <p>AgentLoop 主循环 • 消息队列 • 流式处理</p>
            </div>
            <div class="layer">
                <h3>🛠️ 工具执行管理层</h3>
                <p>权限验证 • 并发控制 • 任务隔离</p>
            </div>
            <div class="layer">
                <h3>💾 存储与持久化层</h3>
                <p>短期/中期/长期存储机制</p>
            </div>
        </div>
    </div>

    <!-- 核心组件 -->
    <div class="core-components">
        <h2>⚙️ 核心组件</h2>
        <div class="components-grid">
            <div class="component-card">
                <h3>🔄 AgentLoop 主循环</h3>
                <p>任务调度、状态管理、异常处理</p>
            </div>
            <div class="component-card">
                <h3>🛠️ 工具引擎</h3>
                <p>工具发现、参数验证、执行调度</p>
            </div>
            <div class="component-card">
                <h3>🔐 权限管理</h3>
                <p>权限检查、安全审计、访问控制</p>
            </div>
            <div class="component-card">
                <h3>💾 存储系统</h3>
                <p>短期记忆、中期压缩、长期持久化</p>
            </div>
        </div>
    </div>

    <!-- 实现步骤 -->
    <div id="markdown-implementation" class="markdown-content">
        <!-- Markdown内容将通过渲染器加载 -->
    </div>

    <!-- 关键代码示例 -->
    <div class="code-examples">
        <h2>💡 核心代码片段</h2>
        
        <div class="example-tabs">
            <button class="tab-btn active" onclick="showTab(event, 'agent-loop')">Agent循环</button>
            <button class="tab-btn" onclick="showTab(event, 'tool-engine')">工具引擎</button>
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
    </div>
</div>

<style>
.implementation-guide {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: var(--color-text-primary);
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
    color: var(--color-text-secondary);
}

.architecture-section,
.implementation-steps,
.code-examples,
.quick-start,
.core-components {
    margin-bottom: 3rem;
}

.architecture-overview {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
}

.layer {
    background: var(--color-bg-primary);
    padding: 1.5rem;
    border-radius: 8px;
    border: 1px solid var(--color-border-light);
    text-align: center;
}

.layer h3 {
    margin: 0 0 0.5rem 0;
    color: var(--color-accent);
}

.layer p {
    margin: 0;
    color: var(--color-text-secondary);
    font-size: 0.9rem;
}

.components-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
}

.component-card {
    background: var(--color-bg-secondary);
    padding: 1.5rem;
    border-radius: 8px;
    border: 1px solid var(--color-border-light);
    text-align: center;
    transition: transform 0.2s ease;
}

.component-card:hover {
    transform: translateY(-2px);
}

.component-card h3 {
    margin: 0 0 0.5rem 0;
    color: var(--color-accent);
}

.component-card p {
    margin: 0;
    color: var(--color-text-secondary);
    font-size: 0.9rem;
}

.quick-start {
    padding: 2rem;
    background: var(--color-bg-secondary);
    border-radius: 12px;
    border: 1px solid var(--color-border-light);
}

.start-command {
    position: relative;
    margin: 1rem 0;
}

.start-command code {
    display: block;
    background: var(--color-bg-primary);
    padding: 1rem;
    border-radius: 8px;
    font-family: 'Monaco', 'Menlo', monospace;
    font-size: 0.9rem;
    line-height: 1.4;
    overflow-x: auto;
}

.start-note {
    margin-top: 1rem;
    color: var(--color-text-secondary);
    font-style: italic;
}

.start-note code {
    background: var(--color-bg-primary);
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-size: 0.9rem;
}

.architecture-section h2,
.implementation-steps h2,
.code-examples h2,
.deployment-guide h2,
.best-practices h2 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
    color: var(--color-text-primary);
}

.ascii-diagram {
    background: var(--color-bg-secondary);
    border-radius: 12px;
    padding: 2rem;
    overflow-x: auto;
    border: 1px solid var(--color-border-light);
}

.ascii-diagram pre {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.9rem;
    line-height: 1.4;
    margin: 0;
    color: var(--color-text-primary);
}

.step-card {
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border-light);
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
    color: var(--color-text-primary);
}

.step-content p {
    color: var(--color-text-secondary);
    margin-bottom: 1rem;
}

.code-block {
    position: relative;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border-light);
    border-radius: 8px;
    padding: 1rem;
    margin: 1rem 0;
    overflow-x: auto;
}

.code-block code {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.9rem;
    line-height: 1.5;
    color: var(--color-text-primary);
    white-space: pre;
    display: block;
}

.copy-btn {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: var(--color-accent);
    color: white;
    border: none;
    border-radius: 4px;
    padding: 0.25rem 0.5rem;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.2s ease;
}

.copy-btn:hover {
    background: var(--color-primary-dark);
    transform: translateY(-1px);
}

.example-tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid var(--color-border-light);
}

.tab-btn {
    background: none;
    border: none;
    padding: 0.75rem 1.5rem;
    cursor: pointer;
    border-radius: 8px 8px 0 0;
    color: var(--color-text-secondary);
    transition: all 0.3s ease;
}

.tab-btn.active {
    background: var(--color-accent);
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
    background: var(--color-accent);
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
    color: var(--color-text-primary);
}

.practices-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
}

.practice-card {
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border-light);
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
    color: var(--color-text-primary);
}

.practice-card ul {
    list-style: none;
    padding: 0;
}

.practice-card li {
    padding: 0.25rem 0;
    color: var(--color-text-secondary);
}

.practice-card li:before {
    content: "✓";
    color: var(--color-accent);
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
</section>
`; 
