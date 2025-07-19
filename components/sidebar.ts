export const sidebarComponent = `
<!-- Sidebar Toggle Button -->
<button class="sidebar-toggle" onclick="toggleSidebar()" title="Quick Configuration Guide">
    ⚙️
</button>

<!-- Overlay -->
<div class="overlay" id="overlay" onclick="closeSidebar()"></div>

<!-- Sidebar -->
<div class="sidebar" id="sidebar">
    <div class="sidebar-header">
        <h3>🚀 Quick Setup Guide</h3>
        <button class="sidebar-close" onclick="closeSidebar()">&times;</button>
    </div>
    
    <div class="sidebar-content">
        <div class="sidebar-section">
            <h3>🌙 Kimi (Moonshot AI) Setup</h3>
            <h4>1. Get Your API Key</h4>
            <p>Visit <a href="https://platform.moonshot.cn" target="_blank" style="color: var(--color-primary);">platform.moonshot.cn</a> to get your API key</p>
            
            <h4>2. Quick Shell Alias</h4>
            <p>Add this to your shell config for easy Kimi usage:</p>
            <div class="code-block">alias kimi="ANTHROPIC_AUTH_TOKEN=sk-xxx ANTHROPIC_BASE_URL=https://api.moonshot.cn/anthropic claude"</div>
            <div class="note">Replace the API key with your actual key from Moonshot AI</div>
            
            <h4>3. Just Use command 'kimi' </h4>
        
        </div>

        <div class="sidebar-section">
            <h3>💡 Pro Tips</h3>
            <ul style="padding-left: var(--space-5); color: var(--color-text-secondary);">
                <li>Always use quotes around your API key</li>
                <li>Add aliases to ~/.bashrc or ~/.zshrc for persistence</li>
                <li>Use different aliases for different providers</li>
                <li>Test with "claude --help" before coding</li>
            </ul>
        </div>
    </div>
</div>
`;
