import { faviconDataUrl } from './faviconServer';

export const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Claude Code Router - Multi-Provider API Proxy</title>
    <link rel="shortcut icon" type="image/svg+xml" href="${faviconDataUrl}">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(45deg, #2c3e50, #3498db);
            color: white;
            text-align: center;
            padding: 40px 20px;
        }

        .header h1 {
            font-size: 2.2em;
            margin-bottom: 10px;
            font-weight: 300;
        }

        .header p {
            font-size: 1.1em;
            opacity: 0.9;
        }

        .content {
            padding: 40px;
        }

        .step {
            margin-bottom: 30px;
            padding: 20px;
            border-left: 4px solid #3498db;
            background: #f8f9fa;
            border-radius: 0 8px 8px 0;
        }

        .step h2 {
            color: #2c3e50;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            font-size: 1.3em;
        }

        .step-number {
            background: #3498db;
            color: white;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
            font-weight: bold;
            font-size: 0.9em;
        }

        .code-block {
            background: #2c3e50;
            color: #ecf0f1;
            padding: 15px;
            border-radius: 6px;
            font-family: 'Monaco', 'Menlo', monospace;
            margin: 15px 0;
            overflow-x: auto;
            font-size: 0.9em;
        }

        .success {
            background: linear-gradient(45deg, #27ae60, #2ecc71);
            color: white;
            padding: 25px;
            border-radius: 8px;
            text-align: center;
            margin: 30px 0;
        }

        .success h2 {
            margin-bottom: 10px;
            font-size: 1.5em;
        }

        .footer-links {
            text-align: center;
            padding: 20px;
            background: #f8f9fa;
            border-top: 1px solid #e9ecef;
        }

        .footer-links a {
            color: #6c757d;
            text-decoration: none;
            margin: 0 15px;
            font-size: 0.9em;
        }

        .footer-links a:hover {
            color: #3498db;
        }

        .note {
            background: #e3f2fd;
            border: 1px solid #bbdefb;
            color: #1565c0;
            padding: 12px;
            border-radius: 6px;
            margin: 10px 0;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Claude Code Router</h1>
            <p>Multi-Provider API Proxy for Claude Code</p>
        </div>

        <div class="content">
            <div class="step">
                <h2><span class="step-number">1</span>Install Claude Code</h2>
                <div class="code-block">npm install -g @anthropic-ai/claude-code</div>
                <div class="note">Or download from <a href="https://claude.ai/code" target="_blank">claude.ai/code</a></div>
            </div>

            <div class="step">
                <h2><span class="step-number">2</span>Get API Key</h2>
                <p>Choose a provider and get your API key:</p>
                <ul style="margin: 15px 0; padding-left: 30px;">
                    <li><strong>OpenRouter:</strong> <a href="https://openrouter.ai" target="_blank">openrouter.ai</a> (Works with shared instance)</li>
                    <li><strong>DeepSeek:</strong> <a href="https://platform.deepseek.com" target="_blank">platform.deepseek.com</a> (Requires deployment)</li>
                    <li><strong>OpenAI:</strong> <a href="https://platform.openai.com" target="_blank">platform.openai.com</a> (Requires deployment)</li>
                    <li><strong>Kimi:</strong> <a href="https://platform.moonshot.cn" target="_blank">platform.moonshot.cn</a> (Requires deployment)</li>
                    <li><strong>SiliconFlow:</strong> <a href="https://siliconflow.cn" target="_blank">siliconflow.cn</a> (Requires deployment)</li>
                </ul>
            </div>

            <div class="step">
                <h2><span class="step-number">3</span>Configure</h2>
                <p>Add these to your shell config (<code>~/.bashrc</code> or <code>~/.zshrc</code>):</p>
                <div class="code-block">export ANTHROPIC_BASE_URL="https://cc.yovy.app"
export ANTHROPIC_API_KEY="your-api-key"</div>
                <div class="note">
                    <p><strong>Deployment required for:</strong> DeepSeek, OpenAI, Kimi, SiliconFlow</p>
                    <p><strong>Works with shared instance:</strong> OpenRouter</p>
                </div>
                <p>Then reload your shell:</p>
                <div class="code-block">source ~/.bashrc</div>
            </div>

            <div class="success">
                <h2>🎉 Ready to go!</h2>
                <p>Run <code>claude</code> in your terminal and enjoy access to multiple AI providers through Claude Code</p>
            </div>

            <div class="note">
                <p><strong>For data privacy:</strong> Consider <a href="https://github.com/luohy15/y-router?tab=readme-ov-file#setup" target="_blank">self-deploying y-router</a> to Cloudflare Workers instead of using this shared instance.</p>
            </div>
        </div>

        <div class="footer-links">
            <a href="https://github.com/luohy15/y-router" target="_blank">GitHub</a>
            <a href="https://openrouter.ai" target="_blank">OpenRouter</a>
            <a href="https://claude.ai/code" target="_blank">Claude Code</a>
            <a href="https://yovy.app" target="_blank">Yovy Chat</a>
            <br>
            <a href="/terms">Terms</a>
            <a href="/privacy">Privacy</a>
        </div>
    </div>
</body>
</html>`;