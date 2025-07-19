export const setupComponent = `
<!-- Setup Instructions -->
<div class="setup">
    <h2>Quick Setup Guide</h2>
    
    <div class="important-notice">
        <h3>⚠️ Important: Provider Access Notice</h3>
        <div class="notice-content">
            <div class="notice-item">
                <strong>🌐 Shared Instance (cc.xiaohui.cool):</strong>
                <p>Supports <strong>DeepSeek</strong> and <strong>AnyRouter</strong> by default. You can use them immediately with your API key.</p>
            </div>
            <div class="notice-item">
                <strong>🚀 Self-Deployed Instance:</strong>
                <p>Required for <strong>OpenRouter, OpenAI</strong> and other providers. You must deploy your own instance to configure these providers.</p>
            </div>
        </div>
    </div>
    
    <div class="steps">
        <div class="step">
            <div class="step-number">1</div>
            <div class="step-content">
                <h3>Install Claude Code</h3>
                <p>Get the official Claude Code CLI tool from Anthropic.</p>
                <div class="code-block">npm install -g @anthropic-ai/claude-code</div>
                <div class="note">Or download from <a href="https://claude.ai/code" target="_blank" style="color: var(--color-primary-dark); text-decoration: none;">claude.ai/code</a></div>
            </div>
        </div>

        <div class="step">
            <div class="step-number">2</div>
            <div class="step-content">
                <h3>Choose Your Provider & Get API Key</h3>
                <p>Sign up with any supported provider and obtain your API key:</p>
                <ul style="margin: var(--space-4) 0; padding-left: var(--space-5); color: var(--color-text-secondary);">
                    <li><strong>DeepSeek:</strong> <a href="https://platform.deepseek.com" target="_blank" style="color: var(--color-primary);">platform.deepseek.com</a></li>
                    <li><strong>OpenAI:</strong> <a href="https://platform.openai.com" target="_blank" style="color: var(--color-primary);">platform.openai.com</a></li>
                    <li><strong>Kimi:</strong> <a href="https://platform.moonshot.cn" target="_blank" style="color: var(--color-primary);">platform.moonshot.cn</a></li>
                    <li><strong>OpenRouter:</strong> <a href="https://openrouter.ai" target="_blank" style="color: var(--color-primary);">openrouter.ai</a></li>
                    <li><strong>SiliconFlow:</strong> <a href="https://siliconflow.cn" target="_blank" style="color: var(--color-primary);">siliconflow.cn</a></li>
                    <li><strong>AnyRouter:</strong> <a href="https://anyrouter.top/register?aff=4Ly0" target="_blank" style="color: var(--color-primary);">anyrouter.top</a> - 🎁 $100 free credits</li>
                </ul>
            </div>
        </div>

        <div class="step">
            <div class="step-number">3</div>
            <div class="step-content">
                <h3>Configure Environment</h3>
                <p>Add these to your shell config (<code>~/.bashrc</code> or <code>~/.zshrc</code>):</p>
                <div class="config-tabs">
                    <div class="config-tab">
                        <strong>For OpenRouter:</strong>
                        <div class="code-block">export ANTHROPIC_BASE_URL="https://cc.xiaohui.cool"<br>export ANTHROPIC_API_KEY="your-openrouter-api-key"</div>
                    </div>
                    <div class="config-tab">
                        <strong>For AnyRouter:</strong>
                        <div class="code-block">export ANTHROPIC_BASE_URL="https://anyrouter.top"<br>export ANTHROPIC_API_KEY="your-anyrouter-api-key"</div>
                    </div>
                </div>
                <p>Then reload your shell:</p>
                <div class="code-block">source ~/.bashrc  # or source ~/.zshrc</div>
            </div>
        </div>
    </div>

    <div class="success">
        <h2>🚀 Ready to Code!</h2>
        <p>Run <code style="background: rgba(255,255,255,0.2); padding: var(--space-1) var(--space-2); border-radius: var(--radius-md);">claude</code> in your terminal and enjoy Claude with your preferred AI provider</p>
    </div>
</div>
`;
