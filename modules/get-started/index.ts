import { setupComponent } from './components/setup';
import { deploymentComponent } from './components/deployment';

export const getStartedModule = `
<section class="content-section" id="get-started">
    <!-- Hero Section -->
    <div class="hero">
        <div class="hero-content">
            <h1>Claude-Code-Router</h1>
            <p class="subtitle">Universal Claude API Proxy for Multiple Providers</p>
            <div class="badges">
                <a href="javascript:void(0)" class="badge" data-provider="deepseek" onclick="scrollToProvider('deepseek')">DeepSeek</a>
                <a href="javascript:void(0)" class="badge" data-provider="openai" onclick="scrollToProvider('openai')">OpenAI</a>
                <a href="javascript:void(0)" class="badge" data-provider="kimi" onclick="scrollToProvider('kimi')">Kimi</a>
                <a href="javascript:void(0)" class="badge" data-provider="openrouter" onclick="scrollToProvider('openrouter')">OpenRouter</a>
                <a href="javascript:void(0)" class="badge" data-provider="anyrouter" onclick="scrollToProvider('anyrouter')">AnyRouter</a>
                <a href="javascript:void(0)" class="badge" data-provider="siliconflow" onclick="scrollToProvider('siliconflow')">SiliconFlow</a>
            </div>
        </div>
    </div>

    ${setupComponent}
    ${deploymentComponent}
</section>`;

export * from './components/setup';
export * from './components/deployment';
