import { providersComponent } from './providers';

export const setupComponent = `
<!-- Setup Instructions -->
<div class="setup">
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
                <h3>🎯 Choose Your Provider</h3>
                <p>Select your preferred AI provider and get the API key. Click any provider below for detailed setup instructions:</p>
                
                ${providersComponent}
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
