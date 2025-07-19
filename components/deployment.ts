export const deploymentComponent = `
<!-- Self-Deployment -->
<div class="deployment">
    <h2>🔒 Deploy Your Own Instance</h2>
    <p class="deployment-subtitle">For maximum data security and to access all AI providers beyond OpenRouter</p>
    
    <div class="deployment-reason">
        <h3>🤔 Why Self-Deploy?</h3>
        <div class="reason-grid">
            <div class="reason-item">
                <h4>🌐 Access All Providers</h4>
                <p>cc.xiaohui.cool only supports DeepSeek. Self-deploy to use OpenRouter, OpenAI and more.</p>
            </div>
            <div class="reason-item">
                <h4>🔐 Data Security</h4>
                <p>Your API keys and requests never pass through third-party servers when you control the infrastructure.</p>
            </div>
            <div class="reason-item">
                <h4>⚙️ Full Control</h4>
                <p>Configure any provider, custom model mappings, and deployment settings according to your needs.</p>
            </div>
            <div class="reason-item">
                <h4>📊 Zero Logs</h4>
                <p>No request logging or data retention when you deploy your own instance to Cloudflare Workers.</p>
            </div>
        </div>
    </div>
    
    <div class="deployment-steps">
        <div class="deployment-step">
            <h3>1. Clone & Install</h3>
            <div class="code-block">git clone https://github.com/istarwyh/claude-code-router<br>cd claude-code-router<br>npm install</div>
        </div>

        <div class="deployment-step">
            <h3>2. Configure Provider (Secure Method)</h3>
            <p><strong>Recommended:</strong> Use Wrangler secrets for secure configuration:</p>
            <div class="code-block"># For DeepSeek<br>wrangler secret put OPENAI_COMPATIBLE_BASE_URL<br># Enter: https://api.deepseek.com<br><br># For OpenAI<br>wrangler secret put OPENAI_BASE_URL<br># Enter: https://api.openai.com/v1<br><br># For Kimi (Moonshot AI)<br># Enter: https://api.moonshot.cn/v1<br><br># For SiliconFlow<br># Enter: https://api.siliconflow.cn/v1<br><br># Or for OpenRouter<br># Enter: https://openrouter.ai/api/v1</div>
            <div class="note">Using secrets ensures your API endpoints are encrypted and not visible in your code repository.</div>
        </div>

        <div class="deployment-step">
            <h3>3. Deploy to Cloudflare</h3>
            <div class="code-block">npm run deploy</div>
            <div class="note">Your custom domain will be provided after deployment. Update your ANTHROPIC_BASE_URL accordingly.</div>
        </div>
    </div>
</div>

<!-- Footer -->
<div class="footer">
    <div class="footer-links">
        <a href="https://github.com/istarwyh/claude-code-router" target="_blank">GitHub</a>
        <a href="https://claude.ai/code" target="_blank">Claude Code</a>
        <a href="https://developers.cloudflare.com/workers/" target="_blank">Cloudflare Workers</a>
        <a href="/terms">Terms</a>
        <a href="/privacy">Privacy</a>
    </div>
    <div class="footer-copyright">
        Made with ❤️ for the Claude Code community
    </div>
</div>
`;
