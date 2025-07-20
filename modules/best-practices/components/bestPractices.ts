export const bestPracticesComponent = `
<section class="practices-page" id="best-practices">
  <div class="practices-page__header">
    <h2>⚡ 如何用好 CC</h2>
  </div>

  <div class="practices-page__grid practices-grid">
    <div class="practice-category">
      <div class="category-header">
        <h3><span class="category-icon">⚙️</span>自定义环境配置</h3>
        <p>优化你的 Claude Code 工作环境</p>
      </div>
      <div class="practice-items">
        <div class="practice-item practice-beginner">
          <div class="practice-header">
            <h4>斜杠命令速查表</h4>
            <div class="practice-badges">
              <span class="badge badge-beginner">初级</span>
              <span class="badge badge-config">配置</span>
            </div>
          </div>
          
          <div class="practice-description">
            <p>掌握 Claude Code 内置命令，快速执行常用操作。</p>
          </div>
          
          <div class="practice-details">
            <div class="command-groups">
              <div class="command-group">
                <h5>🔧 系统管理</h5>
                <div class="command-list">
                  <div class="command-item">
                    <code>/config</code>
                    <span>查看/修改配置</span>
                  </div>
                  <div class="command-item">
                    <code>/doctor</code>
                    <span>健康状况检查</span>
                  </div>
                  <div class="command-item">
                    <code>/status</code>
                    <span>账户和系统状态</span>
                  </div>
                </div>
              </div>
              
              <div class="command-group">
                <h5>💬 会话控制</h5>
                <div class="command-list">
                  <div class="command-item">
                    <code>/clear</code>
                    <span>清除对话历史</span>
                  </div>
                  <div class="command-item">
                    <code>/compact</code>
                    <span>压缩对话内容</span>
                  </div>
                  <div class="command-item">
                    <code>/cost</code>
                    <span>令牌使用统计</span>
                  </div>
                </div>
              </div>
              
              <div class="command-group">
                <h5>📁 项目管理</h5>
                <div class="command-list">
                  <div class="command-item">
                    <code>/init</code>
                    <span>初始化项目配置</span>
                  </div>
                  <div class="command-item">
                    <code>/memory</code>
                    <span>编辑记忆文件</span>
                  </div>
                  <div class="command-item">
                    <code>/review</code>
                    <span>请求代码审查</span>
                  </div>
                  <div class="command-item">
                    <code>/review</code>
                    <span>review 最近打开的 PR</span>
                  </div>
                  <div class="command-item">
                    <code>/pr-comments</code>
                    <span>获取最近打开 PR 的评论</span>
                  </div>
                </div>
              </div>
              
              <div class="command-group">
                <h5>🔐 账户操作</h5>
                <div class="command-list">
                  <div class="command-item">
                    <code>/login</code>
                    <span>切换 Anthropic 账户</span>
                  </div>
                  <div class="command-item">
                    <code>/logout</code>
                    <span>登出当前账户</span>
                  </div>
                  <div class="command-item">
                    <code>/model</code>
                    <span>选择 AI 模型</span>
                  </div>
                </div>
              </div>
              
              <div class="command-group">
                <h5>🛠️ 其他工具</h5>
                <div class="command-list">
                  <div class="command-item">
                    <code>/bug</code>
                    <span>报告错误给 Anthropic</span>
                  </div>
                  <div class="command-item">
                    <code>/help</code>
                    <span>获取使用帮助</span>
                  </div>
                  <div class="command-item">
                    <code>/vim</code>
                    <span>进入 vim 模式</span>
                  </div>
                  <div class="command-item">
                    <code>/mcp</code>
                    <span>管理已安装的 MCP</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="practice-tips">
              <h5>💡 使用技巧</h5>
              <ul>
                <li>项目启动时使用 <code>/init</code> 初始化配置</li>
                <li>遇到问题时使用 <code>/doctor</code> 快速诊断</li>
                <li>长对话时使用 <code>/compact</code> 优化性能</li>
                <li>开发完成后使用 <code>/review</code> 进行代码审查</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="practice-item">
          <h4>CLAUDE.md 项目记忆库</h4>
          <p>自动注入上下文，减少重复说明</p>
          <div class="practice-status">即将推出</div>
        </div>
        <div class="practice-item">
          <h4>个性化配置文件</h4>
          <p>定制化的代码风格和工作流程</p>
          <div class="practice-status">即将推出</div>
        </div>
      </div>
    </div>

    <div class="practice-category">
      <div class="category-header">
        <h3><span class="category-icon">🔧</span>扩展工具集成</h3>
        <p>与开发工具的深度整合</p>
      </div>
      <div class="practice-items">
        <div class="practice-item">
          <h4>IDE 插件优化</h4>
          <p>VS Code、Cursor 等编辑器的最佳配置</p>
          <div class="practice-status">即将推出</div>
        </div>
        <div class="practice-item">
          <h4>命令行工具</h4>
          <p>提升终端操作效率的工具链</p>
          <div class="practice-status">即将推出</div>
        </div>
      </div>
    </div>

    <div class="practice-category">
      <div class="category-header">
        <h3><span class="category-icon">🔄</span>核心工作流程</h3>
        <p>高效的代码协作模式</p>
      </div>
      <div class="practice-items">
        <div class="practice-item">
          <h4>代码审查流程</h4>
          <p>AI 辅助的代码质量保证</p>
          <div class="practice-status">即将推出</div>
        </div>
        <div class="practice-item">
          <h4>调试与测试</h4>
          <p>智能化的问题诊断和解决</p>
          <div class="practice-status">即将推出</div>
        </div>
      </div>
    </div>

    <div class="practice-category">
      <div class="category-header">
        <h3><span class="category-icon">⚡</span>工作流程优化</h3>
        <p>提升开发效率的进阶技巧</p>
      </div>
      <div class="practice-items">
        <div class="practice-item">
          <h4>上下文管理</h4>
          <p>优化长对话和复杂项目的上下文</p>
          <div class="practice-status">即将推出</div>
        </div>
        <div class="practice-item">
          <h4>批量处理</h4>
          <p>高效处理重复性开发任务</p>
          <div class="practice-status">即将推出</div>
        </div>
      </div>
    </div>

    <div class="practice-category">
      <div class="category-header">
        <h3><span class="category-icon">🤖</span>自动化与批处理</h3>
        <p>让 AI 处理重复性工作</p>
      </div>
      <div class="practice-items">
        <div class="practice-item practice-advanced">
          <div class="practice-header">
            <h4>自动运行模式控制</h4>
            <div class="practice-badges">
              <span class="badge badge-advanced">高级</span>
              <span class="badge badge-automation">自动化</span>
            </div>
          </div>
          
          <div class="practice-description">
            <p>跳过权限确认，启用全自动化操作模式。</p>
            <p class="practice-warning-inline">
              <span class="warning-icon">⚠️</span>
              高风险操作，建议配合 Git 等版本控制系统使用
            </p>
          </div>
          
          <div class="practice-details">
            <div class="command-container">
              <div class="command-block" data-command="claude --dangerously-skip-permissions">
                <div class="command-header">
                  <span class="command-label">Command</span>
                  <button class="copy-btn" onclick="copyCommand(this)" title="复制命令">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  </button>
                </div>
                <code>claude --dangerously-skip-permissions</code>
              </div>
              
              <div class="shortcut-container">
                <div class="shortcut-block">
                  <span class="shortcut-label">Shortcut</span>
                  <div class="shortcut-keys">
                    <kbd>Shift</kbd> + <kbd>Tab</kbd>
                  </div>
                  <span class="shortcut-desc">切换回人工确认模式</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="practice-item">
          <h4>代码生成模板</h4>
          <p>标准化的代码结构和模式</p>
          <div class="practice-status">即将推出</div>
        </div>
        <div class="practice-item">
          <h4>CI/CD 集成</h4>
          <p>自动化的构建和部署流程</p>
          <div class="practice-status">即将推出</div>
        </div>
      </div>
    </div>

    <div class="practice-category">
      <div class="category-header">
        <h3><span class="category-icon">👥</span>多 Claude 实例协作</h3>
        <p>团队协作的高级模式</p>
      </div>
      <div class="practice-items">
        <div class="practice-item">
          <h4>角色分工</h4>
          <p>不同 Claude 实例的专业化分工</p>
          <div class="practice-status">即将推出</div>
        </div>
        <div class="practice-item">
          <h4>知识共享</h4>
          <p>团队间的最佳实践传播</p>
          <div class="practice-status">即将推出</div>
        </div>
      </div>
    </div>
  </div>

  <div class="practices-page__footer practices-footer">
    <div class="footer-note">
      <p>💡 <strong>提示</strong>：这些最佳实践基于 Anthropic 官方指南和社区经验总结，我们正在逐步完善每个模块的详细内容。</p>
    </div>
  </div>
</section>`;
