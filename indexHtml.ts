import { faviconDataUrl } from './faviconServer';

export const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Claude Code Router - Multi-Provider API Proxy</title>
    <link rel="shortcut icon" type="image/svg+xml" href="${faviconDataUrl}">
    <style>
        :root {
            /* Design Tokens - Colors */
            --color-primary: #2563eb;
            --color-primary-dark: #1d4ed8;
            --color-primary-light: #3b82f6;
            --color-secondary: #7c3aed;
            --color-accent: #06b6d4;
            --color-success: #10b981;
            --color-warning: #f59e0b;
            --color-error: #ef4444;
            
            /* Text Colors */
            --color-text-primary: #0f172a;
            --color-text-secondary: #475569;
            --color-text-muted: #64748b;
            --color-text-inverse: #ffffff;
            
            /* Background Colors */
            --color-bg-primary: #ffffff;
            --color-bg-secondary: #f8fafc;
            --color-bg-tertiary: #f1f5f9;
            --color-bg-accent: #eff6ff;
            
            /* Border Colors */
            --color-border-light: #e2e8f0;
            --color-border-medium: #cbd5e1;
            --color-border-dark: #94a3b8;
            
            /* Typography */
            --font-family-primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            --font-family-mono: 'JetBrains Mono', 'SF Mono', Monaco, Inconsolata, 'Roboto Mono', Consolas, 'Courier New', monospace;
            
            /* Font Sizes */
            --font-size-xs: 0.75rem;
            --font-size-sm: 0.875rem;
            --font-size-base: 1rem;
            --font-size-lg: 1.125rem;
            --font-size-xl: 1.25rem;
            --font-size-2xl: 1.5rem;
            --font-size-3xl: 1.875rem;
            --font-size-4xl: 2.25rem;
            
            /* Spacing */
            --space-1: 0.25rem;
            --space-2: 0.5rem;
            --space-3: 0.75rem;
            --space-4: 1rem;
            --space-5: 1.25rem;
            --space-6: 1.5rem;
            --space-8: 2rem;
            --space-10: 2.5rem;
            --space-12: 3rem;
            --space-16: 4rem;
            --space-20: 5rem;
            
            /* Border Radius */
            --radius-sm: 0.25rem;
            --radius-md: 0.375rem;
            --radius-lg: 0.5rem;
            --radius-xl: 0.75rem;
            --radius-2xl: 1rem;
            --radius-3xl: 1.5rem;
            
            /* Shadows */
            --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
            --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
            --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
            --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
            
            /* Transitions */
            --transition-fast: 0.15s ease-out;
            --transition-normal: 0.2s ease-out;
            --transition-slow: 0.3s ease-out;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: var(--font-family-primary);
            line-height: 1.6;
            color: var(--color-text-primary);
            background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
            min-height: 100vh;
            padding: var(--space-8) var(--space-4);
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            background-color: var(--color-bg-primary);
            border-radius: var(--radius-2xl);
            box-shadow: var(--shadow-xl);
            overflow: hidden;
            padding: var(--space-8);
        }

        /* Hero Section */
        .hero {
            text-align: center;
            padding: var(--space-16) var(--space-8);
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            border-radius: var(--radius-xl);
            margin-bottom: var(--space-12);
        }

        .hero h1 {
            font-size: var(--font-size-4xl);
            color: var(--color-text-primary);
            margin-bottom: var(--space-4);
            font-weight: 800;
            background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .hero .subtitle {
            font-size: var(--font-size-xl);
            color: var(--color-text-secondary);
            margin-bottom: var(--space-8);
            max-width: 700px;
            margin-left: auto;
            margin-right: auto;
            line-height: 1.5;
        }

        .hero-actions {
            display: flex;
            gap: var(--space-4);
            justify-content: center;
            flex-wrap: wrap;
        }

        .btn {
            display: inline-flex;
            align-items: center;
            gap: var(--space-2);
            padding: var(--space-3) var(--space-6);
            border-radius: var(--radius-lg);
            font-weight: 600;
            text-decoration: none;
            transition: all var(--transition-normal);
            font-size: var(--font-size-base);
            border: 2px solid transparent;
        }

        .btn.primary {
            background-color: var(--color-primary);
            color: white;
        }

        .btn.primary:hover {
            background-color: var(--color-primary-dark);
            transform: translateY(-2px);
            box-shadow: var(--shadow-md);
        }

        .btn.secondary {
            background-color: white;
            color: var(--color-primary);
            border-color: var(--color-primary);
        }

        .btn.secondary:hover {
            background-color: var(--color-bg-accent);
            transform: translateY(-2px);
            box-shadow: var(--shadow-md);
        }

        .btn-icon {
            font-size: 1.2em;
        }

        /* Code Blocks */
        .code-block {
            background-color: #1e293b;
            color: #f8fafc;
            border-radius: var(--radius-lg);
            padding: var(--space-6);
            margin: var(--space-4) 0;
            overflow-x: auto;
            font-family: var(--font-family-mono);
            font-size: var(--font-size-sm);
            line-height: 1.6;
            position: relative;
        }

        .code-block pre {
            margin: 0;
            padding: 0;
        }

        .code-block code {
            font-family: inherit;
        }

        /* Sections */
        section {
            margin-bottom: var(--space-12);
        }

        h2 {
            font-size: var(--font-size-3xl);
            color: var(--color-text-primary);
            margin-bottom: var(--space-6);
            text-align: center;
        }

        h3 {
            font-size: var(--font-size-xl);
            color: var(--color-text-primary);
            margin-bottom: var(--space-4);
        }

        p {
            color: var(--color-text-secondary);
            margin-bottom: var(--space-4);
            line-height: 1.6;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .container {
                padding: var(--space-4);
                border-radius: var(--radius-xl);
            }

            .hero {
                padding: var(--space-8) var(--space-4);
            }

            .hero h1 {
                font-size: var(--font-size-3xl);
            }

            .hero .subtitle {
                font-size: var(--font-size-lg);
            }

            .btn {
                width: 100%;
                justify-content: center;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Hero Section -->
        <div class="hero">
            <h1>Claude Code Router</h1>
            <p class="subtitle">A Cloudflare Worker proxy that routes requests to multiple AI providers with a single API endpoint</p>
            <div class="hero-actions">
                <a href="https://github.com/yourusername/claude-code-router" class="btn primary" target="_blank">
                    <span class="btn-icon">📦</span>
                    <span>View on GitHub</span>
                </a>
                <a href="#quick-start" class="btn secondary">
                    <span class="btn-icon">🚀</span>
                    <span>Quick Start</span>
                </a>
            </div>
        </div>

        <!-- Quick Start -->
        <section id="quick-start">
            <h2>🚀 Quick Start</h2>
            
            <div class="code-block">
                <pre><code># Set your provider's base URL as an environment variable
export DEEPSEEK_BASE_URL=https://api.deepseek.com  # Or your preferred provider

# Make a request to the Claude Code Router
curl https://your-worker.workers.dev/v1/messages \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "model": "claude-3-5-sonnet-20241022",
    "messages": [
      {
        "role": "user",
        "content": "Hello, Claude!"
      }
    ]
  }'</code></pre>
            </div>
        </section>

        <!-- Supported Providers -->
        <section>
            <h2>🔌 Supported Providers</h2>
            <p>Claude Code Router supports the following AI providers. Click on any provider to learn more about configuration options.</p>
            
            <div class="providers-grid">
                <!-- DeepSeek -->
                <div class="provider-card">
                    <h3>DeepSeek</h3>
                    <p>High-performance reasoning models with excellent cost efficiency.</p>
                    <div class="code-block">
                        <pre><code>DEEPSEEK_BASE_URL=https://api.deepseek.com</code></pre>
                    </div>
                </div>

                <!-- OpenAI -->
                <div class="provider-card">
                    <h3>OpenAI</h3>
                    <p>Access to GPT-4o and other OpenAI models.</p>
                    <div class="code-block">
                        <pre><code>OPENAI_BASE_URL=https://api.openai.com/v1</code></pre>
                    </div>
                </div>

                <!-- Kimi -->
                <div class="provider-card">
                    <h3>Kimi (Moonshot)</h3>
                    <p>Advanced Chinese AI models with strong multilingual support.</p>
                    <div class="code-block">
                        <pre><code>KIMI_BASE_URL=https://api.moonshot.cn/v1</code></pre>
                    </div>
                </div>

                <!-- OpenRouter -->
                <div class="provider-card">
                    <h3>OpenRouter</h3>
                    <p>Access to multiple AI models through a single API.</p>
                    <div class="code-block">
                        <pre><code>OPENROUTER_BASE_URL=https://openrouter.ai/api/v1</code></pre>
                    </div>
                </div>

                <!-- AnyRouter -->
                <div class="provider-card">
                    <h3>AnyRouter</h3>
                    <p>Model proxy service with access to Claude and other models.</p>
                    <div class="code-block">
                        <pre><code>ANYROUTER_BASE_URL=https://api.anyrouter.top/v1</code></pre>
                    </div>
                </div>

                <!-- SiliconFlow -->
                <div class="provider-card">
                    <h3>SiliconFlow</h3>
                    <p>Chinese AI infrastructure platform with various models.</p>
                    <div class="code-block">
                        <pre><code>SILICONFLOW_BASE_URL=https://api.siliconflow.cn/v1</code></pre>
                    </div>
                </div>
            </div>
        </section>

        <!-- Configuration -->
        <section>
            <h2>⚙️ Configuration</h2>
            <p>Configure your provider by setting the appropriate environment variable before deploying the worker:</p>
            
            <div class="code-block">
                <pre><code># .dev.vars
# Choose one of the following providers by uncommenting the appropriate line:

# For DeepSeek
DEEPSEEK_BASE_URL=https://api.deepseek.com

# For OpenAI
# OPENAI_BASE_URL=https://api.openai.com/v1

# For Kimi (Moonshot)
# KIMI_BASE_URL=https://api.moonshot.cn/v1

# For OpenRouter
# OPENROUTER_BASE_URL=https://openrouter.ai/api/v1

# For AnyRouter
# ANYROUTER_BASE_URL=https://api.anyrouter.top/v1

# For SiliconFlow
# SILICONFLOW_BASE_URL=https://api.siliconflow.cn/v1</code></pre>
            </div>
        </section>

        <!-- Deployment -->
        <section>
            <h2>🚀 Deployment</h2>
            <p>Deploy to Cloudflare Workers with Wrangler:</p>
            
            <div class="code-block">
                <pre><code># Install Wrangler if you haven't already
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy the worker
wrangler deploy</code></pre>
            </div>
            
            <p>Make sure to set your environment variables in the Cloudflare Workers dashboard or in <code>wrangler.toml</code>.</p>
        </section>
    </div>
</body>
</html>`;
