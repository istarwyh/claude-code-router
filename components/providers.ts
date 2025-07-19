export const providersComponent = `
<!-- Supported Providers -->
<div class="providers">
    <h2>🚀 Supported AI Providers</h2>
    <p style="text-align: center; color: var(--color-text-secondary); margin-bottom: var(--space-8); font-size: var(--font-size-lg);">Click any provider above to learn more, or scroll to see all options</p>
    <div class="provider-grid">
        <div class="provider-card" id="deepseek">
            <div class="provider-badge shared-ready">Shared Ready</div>
            <h3><span class="provider-icon deepseek">DS</span>DeepSeek</h3>
            <p>High-performance reasoning models with excellent cost efficiency. Perfect for complex coding tasks.</p>
            <div class="provider-example">OPENAI_COMPATIBLE_BASE_URL=https://api.deepseek.com</div>
            <div class="provider-links">
                <a href="https://platform.deepseek.com" target="_blank">Get API Key →</a>
            </div>
        </div>
        
        <div class="provider-card" id="openai">
            <div class="provider-badge deploy-required">Deploy Required</div>
            <h3><span class="provider-icon openai">AI</span>OpenAI</h3>
            <p>Industry-leading GPT models including GPT-4o and GPT-4o-mini for diverse AI applications.</p>
            <div class="provider-example">OPENAI_COMPATIBLE_BASE_URL=https://api.openai.com/v1</div>
            <div class="provider-links">
                <a href="https://platform.openai.com" target="_blank">Get API Key →</a>
            </div>
        </div>
        
        <div class="provider-card" id="kimi">
            <div class="provider-badge deploy-required">Deploy Required</div>
            <h3><span class="provider-icon kimi">KM</span>Kimi (Moonshot AI)</h3>
            <p>Advanced Chinese AI models with strong multilingual capabilities and long context support.</p>
            <div class="provider-example">OPENAI_COMPATIBLE_BASE_URL=https://api.moonshot.cn/v1</div>
            <div class="provider-links">
                <a href="https://platform.moonshot.cn" target="_blank">Get API Key →</a>
            </div>
        </div>
        
        <div class="provider-card" id="openrouter">
            <div class="provider-badge deploy-required">Deploy Required</div>
            <h3><span class="provider-icon openrouter">OR</span>OpenRouter</h3>
            <p>Access to multiple AI models through a single API, including Claude, GPT, and open-source models.</p>
            <div class="provider-example">OPENAI_COMPATIBLE_BASE_URL=https://openrouter.ai/api/v1</div>
            <div class="provider-links">
                <a href="https://openrouter.ai" target="_blank">Get API Key →</a>
            </div>
        </div>
        
        <div class="provider-card" id="anyrouter" onclick="window.open('https://anyrouter.top/register?aff=4Ly0', '_blank')" style="cursor: pointer;">
            <div class="register-bonus">🎁 $100 Free Credits</div>
            <h3><span class="provider-icon anyrouter">AR</span>AnyRouter</h3>
            <p><strong>Model proxy service</strong> - Provides access to Claude and other models. Click to register and get $100 free credits!</p>
            <div class="provider-example">ANTHROPIC_BASE_URL=https://anyrouter.top</div>
            <div class="provider-links">
                <a href="https://anyrouter.top/console/token?aff=4Ly0" target="_blank" onclick="event.stopPropagation();">Get API Key →</a>
            </div>
        </div>
        
        <div class="provider-card" id="siliconflow">
            <div class="provider-badge deploy-required">Deploy Required</div>
            <h3><span class="provider-icon siliconflow">SF</span>SiliconFlow</h3>
            <p>Chinese AI infrastructure platform providing access to various domestic and international models.</p>
            <div class="provider-example">OPENAI_COMPATIBLE_BASE_URL=https://api.siliconflow.cn/v1</div>
            <div class="provider-links">
                <a href="https://siliconflow.cn" target="_blank">Get API Key →</a>
            </div>
        </div>
    </div>
</div>
`;
