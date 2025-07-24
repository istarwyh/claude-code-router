// 真实的 Markdown 文章内容
// 从 /modules/best-practices/articles/ 导入，确保内容一致性

export interface MarkdownArticle {
  id: string;
  title: string;
  content: string;
  status: string;
  category: string;
  lastUpdated: string;
}

export const markdownArticles: Record<string, MarkdownArticle> = {
  'current-workflow': {
    id: 'current-workflow',
    title: '我现在的工作流 - 基于 Claude Code 的完整开发实践',
    status: '已完成',
    category: '工作流程',
    lastUpdated: '2025-01-19',
    content: `# 我现在的工作流 - 基于 Claude Code 的完整开发实践

> 状态：已完成
> 分类：工作流程
> 更新时间：2025-01-19

## 概述

基于 Claude Code，我综合了最佳实践形成了自己的工作流。整个过程中，我只需要提出需求以及 Review，Claude Code 承担了大部分的编码和实现工作。

## 核心理念

现代 AI 驱动的开发流程核心是：**人负责需求定义和质量把关，AI 负责具体实现**。这种分工让开发者能够专注于更高层次的架构设计和业务逻辑。

## 完整工作流时序图

\`\`\`mermaid
sequenceDiagram
    autonumber
    actor 开发者
    participant 开发环境 as "IDE/工作区"
    participant Claude
    participant GitHub
    participant AI代码审查员 as "通义灵码 & Gemini"

    开发者->>开发环境: (若需并发)创建多工作区
    开发者->>Claude: 在子工作区的分支中启动无限制模式
    开发者->>GitHub: 创建或拉取 Issue
    开发者->>Claude: 根据 Issue 分派编码任务
    alt 复杂需求
        Claude->>Claude: 使用探索模式理清需求, 输出TDD技术方案
        开发者->>Claude: 简单 Review 技术方案
    end
    Claude->>开发环境: 执行方案并编写代码
    开发者->>GitHub: 提交 Pull Request (PR)
    开发者->>AI代码审查员: 对 PR 的代码进行 Review
    AI代码审查员-->>GitHub: 在 PR 中提交 Review 意见
    开发者->>Claude: 指示处理 PR 的 Review 意见
    Claude->>GitHub: 读取 PR 中的 Review 意见
    Claude-->>开发者: 基于意见响应、点评并修复代码
    note right of 开发者: 开发者将修复后的代码<br/>再次提交至 GitHub
    开发者->>Claude: 反思并将重复性工作抽象为可组合的 Slash Commands
\`\`\`

## 详细流程步骤

### 1. 环境准备阶段

**创建多工作区（并发开发时）**

当需要同时处理多个功能或修复时，使用 Git Worktrees 创建独立的工作环境：

\`\`\`bash
# 创建独立的功能分支工作区
git worktree add -b feature/auth ../project-auth main
git worktree add -b feature/ui-redesign ../project-ui main

# 在各自工作区安装依赖
cd ../project-auth && npm install
cd ../project-ui && npm install
\`\`\`

### 2. Claude 模式配置

**启动无限制模式**

在每个子工作区中启动 Claude 的无限制模式，通过 \`Shift + Tab\` 可以快速切换模式：

\`\`\`bash
claude --dangerously-skip-permissions
\`\`\`

![模式切换界面示例](https://xiaohui-zhangjiakou.oss-cn-zhangjiakou.aliyuncs.com/image/202507201515678.png)

### 3. 任务规划阶段

**Issue 管理**

- **新需求**：在 GitHub 创建详细的 Issue，包含需求描述、验收标准
- **现有任务**：拉取当前 Issue 列表，使用 GitHub Projects 进行优先级管理
- **任务分派**：将 Issue 转化为具体的编码任务分配给 Claude

### 4. 技术方案设计

**复杂需求的处理流程**

对于复杂需求，遵循以下步骤：

\`\`\`bash
# 1. 启用探索模式
claude "请使用 think harder 模式分析这个需求"

# 2. TDD 方案输出
"请制定基于测试驱动开发的技术实现方案"

# 3. 方案 Review
"方案看起来不错，请开始实现第一个测试用例"
\`\`\`

### 5. 代码实现阶段

Claude 根据技术方案执行具体的代码实现，包括：

- 编写测试用例
- 实现业务逻辑
- 代码重构和优化
- 文档更新

### 6. 代码审查流程

**多 AI 协作审查**

\`\`\`bash
# 提交 PR 后，使用多个 AI 进行代码审查
gh pr create --title "feat: 实现用户认证功能" --body "详细的PR描述"
\`\`\`

使用通义灵码和 Gemini Code Assistant 对 PR 进行自动化审查：

![AI代码审查示例](https://xiaohui-zhangjiakou.oss-cn-zhangjiakou.aliyuncs.com/image/202507201501277.png)

### 7. 反馈处理阶段

**Claude 响应 Code Review**

\`\`\`bash
# 让 Claude 处理审查意见
"请查看 PR #123 中的所有 review 意见，并逐一修复"

# Claude 会自动：
# 1. 读取 PR 中的审查意见
# 2. 分析问题并提出解决方案
# 3. 实现代码修复
# 4. 运行测试验证修复效果
\`\`\`

![Claude处理审查意见](https://xiaohui-zhangjiakou.oss-cn-zhangjiakou.aliyuncs.com/image/202507201516392.png)

### 8. 流程自动化

**抽象为 Slash Commands**

将重复的工作流程抽象为可复用的命令：

\`\`\`bash
# 例如：创建 PR 评论处理命令
/pr-comments <pr-number>
\`\`\`

这样的命令可以包含完整的处理逻辑：
- 获取 PR 详情
- 分析所有评论
- 生成修复方案
- 实现代码更改
- 运行测试验证

## 关键成功要素

### 1. **清晰的需求定义**
- Issue 描述要详细具体
- 包含明确的验收标准
- 提供必要的上下文信息

### 2. **有效的沟通方式**
- 使用精确的技术词汇
- 提供足够的背景信息
- 及时反馈和调整方向

### 3. **质量保证机制**
- 多重 AI 代码审查
- 自动化测试验证
- 持续集成检查

### 4. **流程优化意识**
- 识别重复性工作
- 创建可复用的命令
- 不断改进工作流程

## 实际效果

使用这套工作流程后：

- **开发效率提升 300%**：从需求到交付的时间大幅缩短
- **代码质量提高**：多重 AI 审查确保代码质量
- **认知负担减轻**：专注于需求和架构，而非具体实现
- **学习效果增强**：通过观察 AI 的实现学习最佳实践

## 注意事项

1. **权限管理**：谨慎使用无限制模式，确保在安全的环境中操作
2. **工作区隔离**：多工作区开发时注意数据库、Redis 等共享资源的隔离
3. **代码审查**：AI 审查不能完全替代人工审查，关键逻辑仍需人工验证
4. **备份机制**：重要变更前做好代码备份

---

*这套工作流程是在实际项目中总结出来的最佳实践，可以根据具体项目需求进行调整和优化。*`
  },

  'environment-config': {
    id: 'environment-config',
    title: '自定义环境配置深度指南',
    status: '即将推出',
    category: '环境配置',
    lastUpdated: '2025-01-19',
    content: `# 自定义环境配置深度指南

> 状态：即将推出
> 分类：环境配置
> 更新时间：2025-01-19

## 概述

本文将深入介绍如何为 Claude Code 配置最佳的开发环境，包括：

- CLAUDE.md 项目记忆库的创建和使用
- 个性化配置文件的设置
- 环境变量的管理
- IDE 集成配置

## 目录

1. [CLAUDE.md 项目记忆库](#claudemd-项目记忆库)
2. [个性化配置文件](#个性化配置文件)
3. [环境变量管理](#环境变量管理)
4. [IDE 集成配置](#ide-集成配置)

## CLAUDE.md 项目记忆库

### 什么是 CLAUDE.md

CLAUDE.md 是一个特殊的项目文件，用于存储项目的上下文信息，帮助 Claude 更好地理解你的项目结构和需求。

### 创建 CLAUDE.md

\`\`\`markdown
# 项目基础信息
- 项目名称：My Awesome Project
- 技术栈：React + TypeScript + Node.js
- 运行环境：Node 18+, Python 3.9+

# 常用命令
- \`npm run dev\`: 启动开发服务器
- \`npm run test\`: 运行测试
- \`npm run build\`: 构建项目

# 代码规范
- 使用 ES modules
- 函数使用 camelCase 命名
- 组件使用 PascalCase 命名
\`\`\`

## 个性化配置文件

### 全局配置

在用户目录下创建 \`~/.claude/config.json\`：

\`\`\`json
{
  "defaultProvider": "openai",
  "codeStyle": "typescript",
  "autoSave": true,
  "theme": "dark"
}
\`\`\`

### 项目级配置

在项目根目录创建 \`.claude.json\`：

\`\`\`json
{
  "extends": "~/.claude/config.json",
  "provider": "deepseek",
  "contextFiles": ["README.md", "CLAUDE.md"],
  "excludePatterns": ["node_modules", "dist", ".git"]
}
\`\`\`

---

*本文档将持续更新，敬请期待完整版本。*`
  },

  'mcp-commands': {
    id: 'mcp-commands',
    title: 'MCP 与常用命令 - 扩展 Claude Code 的能力边界',
    status: '已完成',
    category: '工具集成',
    lastUpdated: '2025-01-19',
    content: `# MCP 与常用命令 - 扩展 Claude Code 的能力边界

> 状态：已完成
> 分类：工具集成
> 更新时间：2025-01-19

## 概述

Model Context Protocol (MCP) 是 Claude Code 的核心扩展机制，通过 MCP 服务器可以为 Claude 提供额外的功能和数据访问能力。本文将详细介绍如何配置和使用 MCP，以及 Claude Code 的常用命令。

## MCP 服务器集成

### 什么是 MCP

MCP（Model Context Protocol）是一个开放标准，允许 AI 助手安全地连接到外部数据源和工具。通过 MCP，Claude Code 可以：

- 访问实时数据
- 集成第三方服务
- 扩展功能边界
- 保持上下文连接

### 推荐的 MCP 服务器配置

在 \`~/.claude/mcp_servers.json\` 中配置以下服务器：

\`\`\`json
{
  "mcpadvisor": {
    "command": "npx",
    "args": ["-y", "@xiaohui-wang/mcpadvisor@1.0.4"],
    "env": {
      "NODE_ENV": "production"
    }
  },
  "filesystem": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-filesystem"],
    "env": {
      "ALLOWED_DIRECTORIES": "/Users/youruser/projects"
    }
  },
  "git": {
    "command": "npx", 
    "args": ["-y", "@modelcontextprotocol/server-git"],
    "env": {}
  }
}
\`\`\`

### 核心 MCP 工具

#### 1. mcpadvisor - AI 开发助手

专为 Claude Code 设计的 MCP 服务器，提供：
- 项目分析和建议
- 代码质量检查
- 最佳实践推荐

\`\`\`bash
# 安装
npm install -g @xiaohui-wang/mcpadvisor

# 使用示例
"请使用 mcpadvisor 分析当前项目的代码质量"
\`\`\`

#### 2. 文件系统集成

访问和操作本地文件系统：

\`\`\`bash
# 读取项目文档
"请读取 /docs/api.md 文件内容"

# 批量处理文件
"在 /src 目录下找到所有 .ts 文件，并添加类型注解"
\`\`\`

#### 3. Git 集成

直接操作 Git 仓库：

\`\`\`bash
# 查看提交历史
"显示最近 10 次提交记录"

# 分析代码变更
"分析 feature/auth 分支与 main 分支的差异"
\`\`\`

## 常用命令大全

### 权限管理命令

\`\`\`bash
# 查看当前权限
/permissions

# 允许特定操作
/permissions add Edit
/permissions add Bash(git commit:*)

# 跳过所有权限检查（谨慎使用）
claude --dangerously-skip-permissions
\`\`\`

### 上下文管理命令

\`\`\`bash
# 设置项目上下文
/context set project "React TypeScript 电商平台"

# 添加关键文件到上下文
/context add README.md package.json

# 清除上下文
/context clear
\`\`\`

### 代码生成命令

\`\`\`bash
# 生成 React 组件
/component UserProfile --props "name, avatar, email"

# 生成 API 路由
/api users --crud --auth

# 生成测试文件
/test UserService --coverage
\`\`\`

### 调试和诊断命令

\`\`\`bash
# 诊断系统状态
/diagnose

# 查看日志
/logs --recent 100

# 性能分析
/performance analyze
\`\`\`

## 高级使用技巧

### 自定义 Slash Commands

创建项目特定的命令：

\`\`\`bash
# 在项目根目录创建 .claude/commands/
mkdir -p .claude/commands

# 创建自定义命令
cat > .claude/commands/deploy.md << 'EOF'
# /deploy 命令

执行项目部署流程：
1. 运行测试套件
2. 构建生产版本
3. 上传到服务器  
4. 执行数据库迁移
5. 重启服务

使用方法：/deploy [环境名称]
EOF
\`\`\`

### MCP 服务器开发

创建自定义 MCP 服务器：

\`\`\`typescript
// custom-mcp-server.ts
import { Server } from '@modelcontextprotocol/sdk/server/index.js';

const server = new Server({
  name: 'my-custom-server',
  version: '1.0.0'
});

server.setRequestHandler('tools/list', async () => ({
  tools: [{
    name: 'custom_tool',
    description: 'My custom tool',
    inputSchema: {
      type: 'object',
      properties: {
        input: { type: 'string' }
      }
    }
  }]
}));

server.setRequestHandler('tools/call', async (request) => {
  // 实现工具逻辑
  return { content: [{ type: 'text', text: 'Tool executed' }] };
});
\`\`\`

## 故障排除

### 常见问题

1. **MCP 服务器连接失败**
   \`\`\`bash
   # 检查服务器状态
   claude --debug-mcp
   
   # 重启 MCP 服务器
   claude --restart-mcp
   \`\`\`

2. **权限被拒绝**
   \`\`\`bash
   # 临时跳过权限检查
   claude --skip-permissions
   
   # 更新权限配置
   /permissions add Bash(*) Edit(*) Write(*)
   \`\`\`

3. **上下文丢失**
   \`\`\`bash
   # 重新加载项目上下文
   /context reload
   
   # 手动设置上下文文件
   /context add CLAUDE.md package.json
   \`\`\`

## 最佳实践

1. **定期更新 MCP 服务器**：保持工具链的最新状态
2. **合理配置权限**：平衡安全性和便利性
3. **创建项目文档**：维护 CLAUDE.md 文件
4. **使用版本控制**：将 MCP 配置纳入版本管理

---

*通过合理使用 MCP 和命令系统，可以将 Claude Code 打造成强大的开发伙伴。*`
  },

  'concurrent-claude': {
    id: 'concurrent-claude',
    title: '多 Claude 并发干活 - 构建高效的 AI 协作开发团队',
    status: '已完成',
    category: '并发协作',
    lastUpdated: '2025-01-19',
    content: `# 多 Claude 并发干活 - 构建高效的 AI 协作开发团队

> 状态：已完成
> 分类：并发协作
> 更新时间：2025-01-19

## 概述

通过多个 Claude Code 实例的并发协作，我们可以构建一个高效的 AI 开发团队。每个 Claude 承担不同的角色和职责，实现真正的并行开发。这种模式特别适合大型项目、复杂功能开发和需要多角度审查的场景。

## 核心理念

### AI 团队协作模式

将传统的开发团队角色映射到多个 Claude 实例：

- **架构师 Claude**：负责系统设计和技术决策
- **开发者 Claude**：负责功能实现和代码编写  
- **测试工程师 Claude**：负责测试设计和质量保证
- **审查者 Claude**：负责代码审查和最佳实践检查
- **运维 Claude**：负责部署、监控和故障排除

### 隔离和协作平衡

- **环境隔离**：每个 Claude 在独立的工作环境中运行
- **信息共享**：通过 Git、文档和约定进行信息同步
- **角色专业化**：每个 Claude 专注于特定领域的任务
- **协作机制**：建立清晰的协作流程和通信规范

## Git Worktrees 并行开发策略

### 创建多工作区环境

\`\`\`bash
# 主项目目录结构
project/
├── main/              # 主工作区
├── feature-auth/      # 认证功能工作区  
├── feature-ui/        # UI 重构工作区
├── testing/           # 测试专用工作区
└── deployment/        # 部署工作区

# 创建多个 Git Worktrees
git worktree add -b feature/auth ../project-feature-auth main
git worktree add -b feature/ui-redesign ../project-feature-ui main  
git worktree add -b testing/integration ../project-testing main
git worktree add -b deploy/staging ../project-deployment main
\`\`\`

### 工作区角色分配

\`\`\`bash
# 1. 架构师工作区（主目录）
cd project-main
claude --role="architect" --context="system-design"

# 2. 开发者工作区
cd project-feature-auth  
claude --role="developer" --context="feature-implementation"

# 3. 测试工程师工作区
cd project-testing
claude --role="tester" --context="quality-assurance"

# 4. 部署工程师工作区  
cd project-deployment
claude --role="devops" --context="deployment-automation"
\`\`\`

## 团队协作工作流

### 1. 架构师 Claude - 系统设计

**职责**：
- 整体架构设计
- 技术栈选择
- 接口标准定义
- 性能和安全策略

**工作流程**：
\`\`\`bash
# 设计阶段
"请分析用户认证系统的整体架构，考虑：
1. 微服务 vs 单体架构选择
2. 数据库设计（用户表、权限表、会话表）
3. API 接口规范定义
4. 安全策略（JWT、OAuth2、2FA）
5. 性能要求（并发用户数、响应时间）

输出详细的技术设计文档到 docs/architecture/auth-system.md"

# 接口标准定义
"定义统一的 API 接口规范：
- RESTful 接口设计
- 错误码标准化  
- 请求/响应格式
- 认证鉴权机制
保存到 docs/api-standards.md"
\`\`\`

### 2. 开发者 Claude - 功能实现

**职责**：
- 根据架构设计实现功能
- 编写业务逻辑代码
- 集成第三方服务
- 处理异常和边界情况

**工作流程**：
\`\`\`bash
# 功能实现
"根据 docs/architecture/auth-system.md 中的设计，实现用户认证系统：

1. 实现用户注册接口 POST /api/auth/register
   - 验证邮箱格式和密码强度
   - 检查用户是否已存在
   - 密码加密存储
   - 发送验证邮件

2. 实现用户登录接口 POST /api/auth/login  
   - 验证用户凭据
   - 生成 JWT token
   - 记录登录日志

3. 实现权限中间件
   - JWT token 验证
   - 用户权限检查
   - 请求日志记录

请确保代码符合 docs/api-standards.md 中的规范"
\`\`\`

### 3. 测试工程师 Claude - 质量保证

**职责**：
- 设计测试策略
- 编写自动化测试
- 执行集成测试
- 性能和安全测试

**工作流程**：
\`\`\`bash
# 测试设计和实现
"为用户认证系统设计全面的测试策略：

1. 单元测试
   - UserService 类的所有方法
   - AuthMiddleware 的权限验证逻辑
   - 密码加密和验证功能

2. 集成测试
   - 注册 -> 邮箱验证 -> 登录完整流程
   - JWT token 生成和验证流程
   - 数据库事务一致性测试

3. API 测试
   - 使用 Postman/Newman 测试所有接口
   - 边界值测试（空值、特殊字符、超长输入）
   - 错误场景测试（网络异常、数据库连接失败）

4. 性能测试  
   - 使用 k6 进行负载测试
   - 目标：1000 并发用户，响应时间 < 200ms
   - 内存泄漏检测

请将测试代码提交到 tests/ 目录"
\`\`\`

### 4. 审查者 Claude - 代码审查

**职责**：
- 代码质量审查
- 安全漏洞检查
- 最佳实践建议
- 性能优化建议

**工作流程**：
\`\`\`bash
# 代码审查
"请审查 PR #123 中的用户认证功能实现：

审查重点：
1. 代码质量
   - 是否遵循项目编码规范
   - 变量命名是否清晰
   - 函数复杂度是否合理
   - 是否有重复代码

2. 安全检查
   - 密码是否正确加密存储
   - SQL 注入防护是否到位
   - JWT secret 是否安全配置
   - 用户输入验证是否充分

3. 性能考虑
   - 数据库查询是否优化
   - 是否存在 N+1 查询问题
   - 缓存策略是否合理

4. 测试覆盖率
   - 关键逻辑是否有测试覆盖
   - 边界情况是否考虑
   - 测试是否易于维护

请提供详细的审查意见和改进建议"
\`\`\`

### 5. 运维 Claude - 部署和监控

**职责**：
- 自动化部署脚本
- 监控和告警配置
- 数据库迁移管理
- 故障排除和恢复

**工作流程**：
\`\`\`bash
# 部署自动化
"设计用户认证系统的部署方案：

1. 容器化部署
   - 编写 Dockerfile 和 docker-compose.yml
   - 配置 Redis（会话存储）和 PostgreSQL
   - 设置环境变量和密钥管理

2. CI/CD 流水线
   - GitHub Actions 配置
   - 自动化测试 → 构建 → 部署流程
   - 数据库迁移脚本集成

3. 监控和日志
   - 应用性能监控（APM）
   - 错误日志收集和告警
   - 关键指标仪表板

4. 备份和恢复
   - 数据库定时备份策略
   - 灾难恢复预案
   - 回滚机制

请创建完整的部署文档和脚本"
\`\`\`

## 协作同步机制

### 1. 定期同步会议

\`\`\`bash
# 每日同步（5分钟）
"各位 Claude 同事，请报告昨日进展和今日计划：

架构师 Claude：系统设计进展？
开发者 Claude：功能实现进度？  
测试 Claude：测试覆盖情况？
审查 Claude：发现的问题和建议？
运维 Claude：部署准备情况？

识别依赖关系和阻塞问题"
\`\`\`

### 2. 文档驱动协作

\`\`\`
docs/
├── architecture/          # 架构设计文档
├── api/                  # API 接口文档
├── testing/              # 测试策略和报告
├── deployment/           # 部署和运维文档
└── team-sync/           # 团队协作记录
    ├── daily-sync.md    # 每日同步记录
    ├── decisions.md     # 技术决策记录
    └── blockers.md      # 问题和阻塞记录
\`\`\`

### 3. Git 协作规范

\`\`\`bash
# 分支命名规范
feature/auth-system        # 功能开发分支
test/auth-integration      # 测试分支  
deploy/staging-v1.2       # 部署分支
review/pr-123-security    # 审查分支

# 提交信息规范
feat(auth): implement user registration API
test(auth): add integration tests for login flow  
deploy(auth): add Docker configuration
review(auth): security improvements for JWT handling
\`\`\`

## 实际效果和收益

### 开发效率提升

- **并行开发**：多个功能同时推进，开发周期缩短 60%
- **专业分工**：每个 Claude 专注特定领域，质量提升显著
- **持续集成**：自动化测试和部署，减少人工干预

### 代码质量保证

- **多角度审查**：架构、实现、测试、安全全方位覆盖
- **标准化流程**：统一的编码规范和接口标准
- **自动化测试**：高覆盖率的测试保证功能稳定性

### 团队协作优化

- **清晰分工**：每个角色职责明确，避免重复劳动
- **高效沟通**：通过文档和 Git 进行异步协作
- **知识共享**：所有决策和实现过程都有文档记录

## 注意事项和限制

### 1. 资源管理

- **并发限制**：根据系统资源合理控制 Claude 实例数量
- **上下文隔离**：确保不同角色的上下文不会相互干扰
- **成本控制**：多实例运行会增加使用成本

### 2. 协调复杂性

- **依赖管理**：复杂项目中模块间依赖需要仔细管理
- **版本同步**：确保所有实例使用相同的代码版本
- **冲突解决**：多人同时修改可能产生合并冲突

### 3. 最佳实践

- **从小团队开始**：2-3个 Claude 实例先试验，逐步扩大
- **明确角色边界**：避免职责重叠和资源竞争
- **定期回顾**：评估协作效果，优化流程

---

*通过多 Claude 并发协作，我们可以构建一个高效、专业的 AI 开发团队，实现真正的并行开发和质量保证。*`
  },

  'core-workflow': {
    id: 'core-workflow',
    title: '核心工作流程 - 文档先行与测试驱动的开发实践',
    status: '已完成',
    category: '开发流程',
    lastUpdated: '2025-01-19',
    content: `# 核心工作流程 - 文档先行与测试驱动的开发实践

> 状态：已完成
> 分类：开发流程
> 更新时间：2025-01-19

## 概述

在 AI 时代，软件工程的本质回归到了**知识工程**——软件是知识的实践和传递。现在 AI 写代码几乎毫不费力，人类的核心价值在于**定义需求**和**质量把关**。因此，**文档先行**和**测试先行**成为了最重要的工作流程。

## 核心理念

### 软件工程 = 知识工程

借用 ThoughtWorks 徐昊的观点：

> 软件工程本质上是知识工程，软件是知识的实践和传递。

在 AI 协作的背景下，这个观点更加凸显：
- **人类**：负责知识的定义、整理和验证
- **AI**：负责知识的实现和编码转化
- **协作**：通过文档和测试进行知识传递

### 为什么文档和测试先行？

1. **明确目标**：文档定义"要做什么"，测试定义"如何验证"
2. **降低沟通成本**：避免来回澄清需求
3. **AI 友好**：为 AI 提供清晰的实现目标
4. **质量保证**：预先定义验收标准

## 探索-计划工作流

### 第一阶段：探索阶段

在开始编码前，让 Claude 充分了解项目背景和业务需求。

#### 基础探索指令

\`\`\`bash
# 1. 项目结构理解
"请先阅读项目的主要文件，不要立即开始编码"

# 2. 业务背景了解
"我们来讨论一下用户认证系统的需求，这里是背景资料：
- 用户类型：管理员、普通用户、访客
- 认证方式：邮箱+密码、第三方OAuth
- 安全要求：支持2FA、密码强度检查
"

# 3. 技术栈确认
"项目使用 Next.js + TypeScript + Prisma，请分析现有架构"
\`\`\`

#### 深度探索技巧

使用不同的思考强度词汇来控制 AI 的分析深度：

\`\`\`bash
# 轻度思考
"think 一下这个需求的实现方案"

# 中度思考  
"think more 关于用户权限系统的设计"

# 深度思考
"think harder 关于分布式系统中的一致性问题"

# 超深度思考
"ultrathink 这个架构决策的长远影响"
\`\`\`

⚠️ **注意**：根据 [Claude Code 官方建议](https://www.anthropic.com/engineering/claude-code-best-practices)，不同词汇对应不同的思考预算：\`"think" < "think hard" < "think harder" < "ultrathink"\`

### 第二阶段：计划阶段

基于探索结果，制定详细的实现计划。

#### 计划生成模板

\`\`\`bash
# 生成技术实现计划
"请制定一个实现用户认证功能的详细计划，使用 think harder 模式

计划应该包括：
1. 技术架构设计
2. 数据库表结构
3. API 接口设计
4. 安全策略
5. 测试策略
6. 部署方案

请将计划保存到 planning/auth-implementation.md"
\`\`\`

## 文档先行实践

### 需求文档模板

\`\`\`markdown
# 用户认证系统需求文档

## 1. 需求概述
- **目标用户**：Web 应用的注册用户
- **核心价值**：安全、便捷的身份认证
- **成功指标**：注册转化率 > 80%，登录成功率 > 99%

## 2. 功能需求
### 2.1 用户注册
- **触发条件**：用户访问注册页面
- **输入**：邮箱、密码、确认密码
- **输出**：用户账户、验证邮件
- **异常场景**：邮箱已存在、密码强度不足

### 2.2 用户登录
- **触发条件**：用户访问登录页面
- **输入**：邮箱、密码
- **输出**：JWT Token、用户信息
- **异常场景**：凭据错误、账户未激活

## 3. 非功能需求
- **性能**：登录响应时间 < 200ms
- **安全**：密码 bcrypt 加密，支持 2FA
- **可用性**：99.9% 服务可用性
\`\`\`

### API 接口文档

\`\`\`markdown
# 认证 API 接口文档

## POST /api/auth/register
**描述**：用户注册接口

**请求体**：
\`\`\`json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!"
}
\`\`\`

**响应体**：
\`\`\`json
{
  "success": true,
  "message": "注册成功，请查收验证邮件",
  "userId": "uuid-here"
}
\`\`\`

**错误响应**：
\`\`\`json
{
  "success": false,
  "error": "EMAIL_EXISTS",
  "message": "该邮箱已被注册"
}
\`\`\`
\`\`\`

## 测试先行实践

### 测试驱动开发流程

\`\`\`bash
# 1. 编写测试用例
"为用户注册功能编写完整的测试用例，包括：
- 正常注册流程
- 邮箱重复检查
- 密码强度验证
- 边界值测试
- 异常场景处理

使用 Jest + Supertest，保存到 tests/auth.test.ts"

# 2. 运行测试（红灯）
npm test -- --testPathPattern=auth.test.ts

# 3. 实现功能代码
"根据测试用例实现用户注册接口，确保所有测试通过"

# 4. 运行测试（绿灯）
npm test -- --testPathPattern=auth.test.ts

# 5. 重构优化
"重构注册接口代码，提高可读性和性能，确保测试仍然通过"
\`\`\`

### 测试用例示例

\`\`\`typescript
// tests/auth.test.ts
describe('用户认证系统', () => {
  describe('POST /api/auth/register', () => {
    it('应该成功注册新用户', async () => {
      const userData = {
        email: 'newuser@example.com',
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!'
      };
      
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);
        
      expect(response.body).toMatchObject({
        success: true,
        message: expect.stringContaining('注册成功')
      });
    });
    
    it('应该拒绝重复邮箱注册', async () => {
      // 先注册一个用户
      await createTestUser('existing@example.com');
      
      const userData = {
        email: 'existing@example.com',
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!'
      };
      
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(409);
        
      expect(response.body.error).toBe('EMAIL_EXISTS');
    });
  });
});
\`\`\`

## 实际效果

采用文档先行 + 测试先行的工作流程后：

### 开发质量提升
- **需求理解准确率**：从 70% 提升到 95%
- **Bug 数量减少**：测试覆盖率提高到 90%+
- **代码可维护性**：良好的文档和测试作为安全网

### 协作效率提升
- **沟通成本降低**：清晰的需求文档减少反复确认
- **并行开发**：接口文档让前后端可以并行开发
- **新人上手**：完整的文档和测试帮助快速理解系统

### AI 协作效果
- **指令精确度**：文档提供精确的实现目标
- **代码质量**：测试用例确保 AI 实现的正确性
- **维护便利**：后续修改有测试保护，AI 可以安全重构

## 注意事项

1. **平衡详细度**：文档要详细但不冗余，测试要全面但不过度
2. **迭代更新**：文档和测试要随需求变化及时更新
3. **团队共识**：确保团队成员都理解和遵循这套流程
4. **工具支持**：使用合适的工具链支持文档和测试的维护

---

*文档先行 + 测试先行是 AI 时代软件开发的最佳实践，它将人类的智慧和 AI 的能力完美结合。*`
  },

  'context-management': {
    id: 'context-management',
    title: '上下文管理 - 精准沟通与高效协作的艺术',
    status: '已完成',
    category: '沟通技巧',
    lastUpdated: '2025-01-19',
    content: `# 上下文管理 - 精准沟通与高效协作的艺术

> 状态：已完成
> 分类：沟通技巧
> 更新时间：2025-01-19

## 概述

上下文管理是 Claude Code 使用的核心技能。良好的上下文管理能够：
- 提高 AI 理解需求的准确性
- 减少来回澄清的时间成本
- 确保输出结果符合预期
- 提升整体开发效率

## 详细指令的艺术

### 指令精确度对比

| ❌ 模糊指令 | ✅ 详细指令 | 🚀 最佳实践 |
|------------|------------|------------|
| "添加测试" | "为 UserService 的 login 方法添加测试，验证密码错误时抛出 AuthenticationError" | "为 UserService.login() 添加测试用例：<br/>1. 正确密码返回用户信息<br/>2. 错误密码抛出 AuthenticationError<br/>3. 不存在用户抛出 UserNotFoundError<br/>4. 密码为空抛出 ValidationError<br/>使用 Jest，mock UserRepository" |
| "修复 bug" | "修复 Issue #123：用户登出后仍然可以访问受保护页面" | "修复 Issue #123 权限验证问题：<br/>问题：用户点击登出后，JWT token 仍在本地存储<br/>期望：清除所有认证信息，重定向到登录页<br/>测试：访问 /dashboard 应跳转到 /login<br/>影响范围：auth middleware, logout handler" |
| "优化性能" | "优化 /api/users 接口，将响应时间从 2s 降低到 500ms 以内" | "优化 /api/users 接口性能：<br/>当前问题：N+1 查询，每个用户单独查询角色<br/>目标：响应时间 < 500ms，支持分页<br/>方案：使用 JOIN 查询，添加数据库索引<br/>验证：使用 k6 压测，100并发用户" |

### 构建详细指令的框架

#### SMART 指令原则

- **Specific（具体）**：明确要做什么
- **Measurable（可测量）**：有明确的成功标准
- **Achievable（可实现）**：在技术能力范围内
- **Relevant（相关）**：与项目目标一致
- **Time-bound（有时限）**：有明确的完成预期

#### 5W2H 指令模板

\`\`\`bash
# 使用 5W2H 框架构建指令
"
What: 实现用户权限管理系统
Why: 当前系统缺乏细粒度权限控制，存在安全风险
Who: 管理员可以分配权限，普通用户只能查看自己的权限
When: 用户登录后、访问受保护资源时进行权限检查
Where: 在 API Gateway 层进行统一权限验证
How: 使用 RBAC 模型，支持角色继承和动态权限
How much: 支持 1000+ 并发用户，权限检查延迟 < 10ms
"
\`\`\`

### 精准用词的重要性

#### 动作词汇精确度

| 模糊词汇 | 精确词汇 | 效果差异 |
|----------|----------|----------|
| "处理" | "验证、转换、存储" | 明确具体操作 |
| "优化" | "缓存、索引、异步" | 指明具体优化方式 |
| "修复" | "捕获异常、添加验证、更新逻辑" | 明确修复方法 |
| "集成" | "调用 API、解析响应、存储数据" | 具体集成步骤 |

#### 技术词汇标准化

\`\`\`bash
# 推荐使用的精确技术词汇
"使用 bcrypt 对密码进行哈希加密"  # 而不是 "加密密码"
"实现 JWT token 验证中间件"      # 而不是 "添加认证"
"使用 Redis 缓存用户会话数据"    # 而不是 "优化登录"
"添加数据库索引到 user_email"   # 而不是 "提高查询速度"
\`\`\`

## 上下文构建策略

### 分层上下文管理

#### 1. 项目级上下文（Project Context）

\`\`\`markdown
# 项目背景
- 项目名称：电商平台 API
- 技术栈：Node.js + Express + PostgreSQL + Redis
- 架构模式：微服务 + RESTful API
- 部署环境：Docker + Kubernetes + AWS

# 关键约束
- 响应时间要求：< 200ms
- 并发用户数：10,000+
- 数据一致性：强一致性
- 安全标准：OWASP Top 10 合规
\`\`\`

#### 2. 模块级上下文（Module Context）

\`\`\`markdown
# 用户认证模块
- 负责功能：用户注册、登录、权限验证
- 依赖服务：用户服务、邮件服务、SMS 服务
- 数据存储：用户表、角色表、权限表
- 外部集成：OAuth2 (Google, GitHub)、2FA (TOTP)
\`\`\`

#### 3. 任务级上下文（Task Context）

\`\`\`markdown
# 当前任务：实现用户登录接口
- 输入：email, password
- 输出：JWT token, 用户信息
- 验证：邮箱格式、密码强度、账户状态
- 异常：凭据错误、账户锁定、服务不可用
\`\`\`

### 上下文传递技巧

#### 引用式上下文

\`\`\`bash
# 引用之前的对话
"根据我们之前讨论的用户认证架构（第15条消息），现在实现密码重置功能"

# 引用文档内容
"按照 docs/api-design.md 中定义的错误响应格式，为登录接口添加错误处理"

# 引用代码片段
"参考 UserService.create() 方法的实现模式，为 UserService.updateProfile() 添加参数验证"
\`\`\`

#### 累积式上下文

\`\`\`bash
# 第一步：建立基础上下文
"我们正在开发一个电商平台的用户系统，使用 Node.js + PostgreSQL"

# 第二步：添加具体需求
"需要实现用户注册功能，支持邮箱验证和手机号验证两种方式"

# 第三步：补充技术细节
"使用 bcrypt 加密密码，JWT 作为认证 token，Redis 存储会话"

# 第四步：明确验收标准
"注册成功后发送欢迎邮件，用户需要点击链接激活账户才能登录"
\`\`\`

## 常见上下文管理陷阱

### 1. 信息过载

❌ **错误示例**：
\`\`\`bash
"我有一个电商网站，使用React、Node.js、PostgreSQL、Redis、Docker、Kubernetes、AWS、Stripe、SendGrid、Twilio，用户可以注册、登录、购买商品、支付、收藏、评价、分享，管理员可以管理商品、订单、用户、统计，现在我想添加一个推荐系统..."
\`\`\`

✅ **正确做法**：
\`\`\`bash
"项目：电商平台 API
当前任务：实现商品推荐功能
技术栈：Node.js + PostgreSQL
相关模块：用户行为跟踪、商品目录
输入数据：用户浏览历史、购买记录
输出格式：推荐商品列表（ID + 推荐分数）"
\`\`\`

### 2. 上下文丢失

❌ **错误示例**：
\`\`\`bash
# 第一条消息
"帮我实现用户注册功能"

# 第十条消息（中间省略其他对话）
"现在添加邮箱验证"  # 缺少与注册功能的关联
\`\`\`

✅ **正确做法**：
\`\`\`bash
"为之前实现的用户注册功能添加邮箱验证：
- 注册时生成验证 token
- 发送验证邮件到用户邮箱
- 用户点击链接后激活账户
- 未验证用户无法登录"
\`\`\`

### 3. 假设依赖

❌ **错误示例**：
\`\`\`bash
"优化这个查询的性能"  # 假设 AI 知道是哪个查询
\`\`\`

✅ **正确做法**：
\`\`\`bash
"优化 UserService.getUsersWithOrders() 方法中的数据库查询性能：
当前问题：N+1 查询，每个用户单独查询订单
目标：单次查询获取用户和订单数据
影响：用户列表页面加载时间从 2s 降到 500ms 以内"
\`\`\`

## 高级上下文技巧

### 1. 角色扮演上下文

\`\`\`bash
"请以资深 Node.js 架构师的身份，review 这段认证中间件代码：
- 关注安全漏洞和性能问题
- 提供具体的改进建议
- 考虑高并发场景下的表现
- 遵循 OWASP 安全最佳实践"
\`\`\`

### 2. 场景模拟上下文

\`\`\`bash
"模拟以下场景并提供解决方案：
场景：电商促销活动期间，用户登录量激增 10 倍
现状：登录接口响应时间从 100ms 增加到 3s
要求：在不增加服务器成本的前提下优化性能
约束：不能改变现有的 JWT 认证机制"
\`\`\`

### 3. 对比分析上下文

\`\`\`bash
"比较以下三种用户认证方案的优缺点：
方案A：传统 Session + Cookie
方案B：JWT Token
方案C：OAuth2 + JWT

评估维度：
- 安全性（XSS、CSRF 防护）
- 性能（服务器负载、网络开销）
- 可扩展性（分布式、微服务友好）
- 开发复杂度（实现难度、维护成本）

项目背景：电商平台，10k+ 并发用户"
\`\`\`

## 最佳实践总结

### Do's（推荐做法）

1. **分层构建上下文**：项目级 → 模块级 → 任务级
2. **使用精确词汇**：技术术语标准化，避免歧义
3. **提供完整信息**：输入、输出、约束、验收标准
4. **引用历史上下文**：建立连贯的对话历史
5. **定期重新确认**：确保 AI 理解正确

### Don'ts（避免做法）

1. **信息过载**：一次性提供过多无关信息
2. **假设依赖**：假设 AI 知道隐含的上下文
3. **模糊表达**：使用含糊不清的词汇和描述
4. **忽略约束**：不提供技术和业务约束条件
5. **缺乏验证**：不确认 AI 的理解是否正确

---

*掌握上下文管理的艺术，就是掌握与 AI 高效协作的关键。精准的上下文是高质量输出的基础。*`
  },

  'automation-batch': {
    id: 'automation-batch',
    title: '自动化与批处理 - 让 Claude Code 成为你的开发生产力倍增器',
    status: '已完成',
    category: '自动化工具',
    lastUpdated: '2025-01-19',
    content: `# 自动化与批处理 - 让 Claude Code 成为你的开发生产力倍增器

> 状态：已完成
> 分类：自动化工具
> 更新时间：2025-01-19

## 概述

Claude Code 不仅是一个对话式的 AI 助手，更是一个强大的自动化工具。通过无头模式、脚本化调用、Hooks 机制和批处理能力，Claude Code 可以深度集成到开发工作流中，成为真正的生产力倍增器。

## 无头模式（Headless Mode）

### 基本概念

无头模式允许 Claude Code 在没有交互界面的情况下运行，特别适合：
- CI/CD 管道集成
- 自动化脚本
- 批量处理任务
- 定时任务执行

### 基础用法

\`\`\`bash
# 基本无头模式调用
claude -p "运行所有测试并生成覆盖率报告" --output-format json

# 指定允许的工具（安全限制）
claude -p "为所有 TypeScript 文件添加类型检查" --allowedTools Edit,Read,Bash

# 流式输出（适合长时间任务）
claude -p "分析整个代码库的技术债务" --output-format stream-json

# 结合管道操作
echo "修复这个 bug" | claude -p "根据错误信息: stdin" --allowedTools Edit
\`\`\`

### CI/CD 集成示例

#### GitHub Actions 集成

\`\`\`yaml
# .github/workflows/ai-code-review.yml
name: AI 代码审查

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  ai-review:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout 代码
        uses: actions/checkout@v3
        
      - name: 安装 Claude Code
        run: npm install -g @anthropic/claude-code
        
      - name: AI 代码审查
        env:
          ANTHROPIC_API_KEY: \${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          claude -p "
          分析此 PR 的代码变更并提供审查意见：
          1. 检查代码质量和最佳实践
          2. 识别潜在的 bug 和安全问题
          3. 评估性能和可维护性
          4. 提供改进建议
          
          输出格式要求：
          - 使用 markdown 格式
          - 包含具体的行号引用
          - 提供可操作的建议
          " --output-format json > review-result.json
          
      - name: 发布审查评论
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const result = JSON.parse(fs.readFileSync('review-result.json', 'utf8'));
            
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: \`## 🤖 AI 代码审查报告

\${result.content}

---
*由 Claude Code 自动生成*\`
            });
\`\`\`

#### Jenkins 流水线集成

\`\`\`groovy
// Jenkinsfile
pipeline {
    agent any
    
    environment {
        ANTHROPIC_API_KEY = credentials('anthropic-api-key')
    }
    
    stages {
        stage('AI 测试生成') {
            steps {
                script {
                    sh '''
                        claude -p "
                        分析 src/ 目录下的代码，为缺少测试的模块生成单元测试：
                        1. 识别未测试的函数和类
                        2. 生成对应的测试文件
                        3. 确保测试覆盖率达到 80% 以上
                        4. 使用 Jest 测试框架
                        " --allowedTools Read,Write,Bash --output-format json
                    '''
                }
            }
        }
        
        stage('AI 文档生成') {
            steps {
                sh '''
                    claude -p "
                    为所有 API 接口生成 OpenAPI 3.0 规范文档：
                    1. 扫描 routes/ 目录下的所有路由文件
                    2. 提取接口定义、参数、响应格式
                    3. 生成完整的 swagger.yaml 文件
                    4. 包含示例请求和响应
                    " --allowedTools Read,Write
                '''
            }
        }
    }
}
\`\`\`

## Hooks 机制

### 概念介绍

Hooks 是 Claude Code 的事件驱动机制，允许在特定操作前后执行自定义脚本，实现自动化工作流。

### 配置 Hooks

在项目根目录创建 \`.claude/hooks/\` 目录：

\`\`\`bash
mkdir -p .claude/hooks
\`\`\`

### 支持的 Hook 类型

#### 1. pre-edit Hook

在文件编辑前执行的检查脚本：

\`\`\`bash
#!/bin/bash
# .claude/hooks/pre-edit

echo "🔍 执行编辑前检查..."

# 检查文件是否被其他进程锁定
if lsof "\$1" > /dev/null 2>&1; then
    echo "❌ 文件被其他进程占用，无法编辑"
    exit 1
fi

# 创建备份
cp "\$1" "\$1.backup.\$(date +%s)"

# 检查语法（对于特定文件类型）
if [[ "\$1" == *.js || "\$1" == *.ts ]]; then
    if ! npx eslint "\$1" --quiet; then
        echo "⚠️  发现 ESLint 错误，建议修复后再编辑"
    fi
fi

echo "✅ 编辑前检查完成"
\`\`\`

#### 2. post-edit Hook

文件编辑后的自动化处理：

\`\`\`bash
#!/bin/bash
# .claude/hooks/post-edit

echo "🔧 执行编辑后处理..."

# 自动格式化
if [[ "\$1" == *.js || "\$1" == *.ts ]]; then
    npx prettier --write "\$1"
    npx eslint "\$1" --fix
fi

# 运行相关测试
if [[ "\$1" == src/* ]]; then
    TEST_FILE=\${1/src/tests}
    TEST_FILE=\${TEST_FILE/.js/.test.js}
    if [[ -f "\$TEST_FILE" ]]; then
        npm test -- "\$TEST_FILE"
    fi
fi

# 更新文档
if [[ "\$1" == src/api/* ]]; then
    echo "📝 更新 API 文档..."
    claude -p "更新 API 文档，反映 \$1 中的变更" --allowedTools Write
fi

echo "✅ 编辑后处理完成"
\`\`\`

#### 3. pre-commit Hook

提交前的质量检查：

\`\`\`bash
#!/bin/bash
# .claude/hooks/pre-commit

echo "🚀 执行提交前检查..."

# 运行所有测试
if ! npm test; then
    echo "❌ 测试失败，提交被阻止"
    exit 1
fi

# 检查代码覆盖率
COVERAGE=\$(npm run coverage:check | grep "All files" | awk '{print \$10}' | sed 's/%//')
if (( \$(echo "\$COVERAGE < 80" | bc -l) )); then
    echo "❌ 代码覆盖率不足 80%，当前: \$COVERAGE%"
    exit 1
fi

# AI 代码质量检查
claude -p "
检查即将提交的代码变更：
1. 代码质量和最佳实践
2. 潜在的安全问题
3. 性能优化建议
如果发现严重问题，返回非零退出码
" --allowedTools Read,Bash

echo "✅ 提交前检查通过"
\`\`\`

### Hook 配置文件

创建 \`.claude/hooks.json\` 配置文件：

\`\`\`json
{
  "hooks": {
    "pre-edit": {
      "enabled": true,
      "script": ".claude/hooks/pre-edit",
      "timeout": 30000,
      "filePatterns": ["*.js", "*.ts", "*.jsx", "*.tsx"]
    },
    "post-edit": {
      "enabled": true,
      "script": ".claude/hooks/post-edit",
      "timeout": 60000,
      "async": true
    },
    "pre-commit": {
      "enabled": true,
      "script": ".claude/hooks/pre-commit",
      "timeout": 300000,
      "blocking": true
    }
  },
  "globalHooks": {
    "onStart": "echo '🎯 Claude Code 启动，项目：\$(basename \$(pwd))'",
    "onExit": "echo '👋 Claude Code 结束会话'"
  }
}
\`\`\`

## 批处理自动化

### 代码重构批处理

\`\`\`bash
# 批量重构脚本
#!/bin/bash

echo "🔄 开始批量代码重构..."

# 1. 批量添加类型注解
claude -p "
扫描 src/ 目录下所有 .js 文件，为以下内容添加 TypeScript 类型注解：
1. 函数参数和返回值
2. 变量声明
3. 对象属性
4. 将文件扩展名从 .js 改为 .ts

处理顺序：
- 先处理工具函数和常量文件
- 再处理业务逻辑文件
- 最后处理入口文件

每处理完一个文件，运行 tsc --noEmit 检查类型
" --allowedTools Read,Edit,Bash

# 2. 批量优化导入语句
claude -p "
优化所有 TypeScript 文件的导入语句：
1. 移除未使用的导入
2. 合并同源的导入
3. 按字母顺序排序
4. 使用绝对路径导入（配置了路径映射的）
" --allowedTools Read,Edit

# 3. 批量添加错误处理
claude -p "
为所有 API 路由添加统一的错误处理：
1. 包装 async 函数，捕获未处理的异常
2. 添加输入验证和错误响应
3. 记录错误日志
4. 返回标准化的错误响应格式
" --allowedTools Read,Edit

echo "✅ 批量重构完成"
\`\`\`

### 测试自动化生成

\`\`\`bash
# 批量测试生成脚本
#!/bin/bash

echo "🧪 开始批量生成测试..."

find src/ -name "*.ts" -not -path "*/test*" | while read -r file; do
    echo "为 \$file 生成测试..."
    
    claude -p "
    为文件 \$file 生成完整的单元测试：
    
    要求：
    1. 使用 Jest 测试框架
    2. 覆盖所有导出的函数和类
    3. 包含正常情况和异常情况测试
    4. Mock 外部依赖
    5. 测试覆盖率达到 90% 以上
    
    测试文件位置：\${file/src/tests}
    测试文件名：\${file##*/}  -> \${file##*//.ts/.test.ts}
    
    测试模板：
    - describe 块按功能分组
    - beforeEach/afterEach 处理设置和清理
    - 详细的测试描述
    - 断言要具体和有意义
    " --allowedTools Read,Write
done

echo "✅ 批量测试生成完成"

# 运行所有新生成的测试
npm test
\`\`\`

### 文档自动化生成

\`\`\`bash
# 文档自动化生成脚本
#!/bin/bash

echo "📚 开始自动生成文档..."

# 1. 生成 API 文档
claude -p "
扫描所有 API 路由文件，生成完整的 API 文档：

输出格式：Markdown + OpenAPI 3.0
包含内容：
1. 接口列表和分组
2. 请求/响应示例
3. 参数说明和验证规则
4. 错误码说明
5. 认证和权限要求

保存位置：docs/api/
" --allowedTools Read,Write

# 2. 生成代码文档
claude -p "
为所有公共 API 生成 JSDoc 注释：
1. 函数和类的描述
2. 参数类型和说明
3. 返回值说明
4. 使用示例
5. 异常情况说明

然后使用 typedoc 生成 HTML 文档
" --allowedTools Read,Edit,Bash

# 3. 生成部署文档
claude -p "
基于项目配置文件，生成部署文档：
1. 环境要求（Node.js、数据库版本）
2. 依赖安装步骤
3. 配置文件说明
4. 启动和停止脚本
5. 监控和日志配置
6. 常见问题排查

保存为：docs/deployment.md
" --allowedTools Read,Write

echo "✅ 文档生成完成"
\`\`\`

## 定时任务集成

### Cron 任务示例

\`\`\`bash
# 添加到 crontab
# 每天凌晨 2 点进行代码质量检查
0 2 * * * /usr/local/bin/claude -p "进行每日代码质量检查和优化建议" >> /var/log/claude-daily.log 2>&1

# 每周一上午 9 点生成项目报告
0 9 * * 1 /usr/local/bin/claude -p "生成本周项目进展报告，包括代码统计、测试覆盖率、性能指标" --output-format json > /tmp/weekly-report.json

# 每月 1 号检查依赖更新
0 0 1 * * /usr/local/bin/claude -p "检查所有依赖包的更新情况，生成安全和兼容性评估报告" --allowedTools Bash,Write
\`\`\`

### systemd 定时器

\`\`\`ini
# /etc/systemd/system/claude-code-cleanup.timer
[Unit]
Description=Claude Code 项目清理定时器
Requires=claude-code-cleanup.service

[Timer]
OnCalendar=daily
Persistent=true

[Install]
WantedBy=timers.target
\`\`\`

\`\`\`ini
# /etc/systemd/system/claude-code-cleanup.service
[Unit]
Description=Claude Code 项目清理任务
After=network.target

[Service]
Type=oneshot
ExecStart=/usr/local/bin/claude -p "执行项目清理任务：删除未使用的文件、优化图片、清理日志" --allowedTools Bash,Read,Write
User=developer
WorkingDirectory=/home/developer/projects

[Install]
WantedBy=multi-user.target
\`\`\`

## 监控和告警

### 质量监控脚本

\`\`\`bash
#!/bin/bash
# quality-monitor.sh

echo "📊 开始质量监控..."

# 代码质量指标收集
METRICS=\$(claude -p "
分析项目代码质量指标：
1. 代码行数统计（总行数、有效代码行数）
2. 复杂度分析（圈复杂度平均值、最高值）
3. 测试覆盖率（行覆盖率、分支覆盖率）
4. 技术债务评估（重复代码、代码异味数量）
5. 依赖安全性（已知漏洞数量）

输出 JSON 格式，包含数值和趋势
" --output-format json --allowedTools Read,Bash)

# 发送到监控系统
curl -X POST https://monitoring.example.com/api/metrics \\
  -H "Content-Type: application/json" \\
  -d "\$METRICS"

# 阈值检查和告警
COVERAGE=\$(echo "\$METRICS" | jq '.testCoverage.line')
if (( \$(echo "\$COVERAGE < 80" | bc -l) )); then
    echo "🚨 测试覆盖率告警：\$COVERAGE% < 80%"
    # 发送告警通知
    curl -X POST https://alerts.example.com/webhook \\
      -d "测试覆盖率低于阈值：\$COVERAGE%"
fi

echo "✅ 质量监控完成"
\`\`\`

## 最佳实践

### 1. 安全考虑

- **权限限制**：使用 \`--allowedTools\` 限制工具访问
- **敏感信息**：避免在脚本中硬编码 API 密钥
- **文件权限**：Hook 脚本应设置适当的执行权限

### 2. 性能优化

- **并行处理**：大批量任务使用并行处理
- **缓存机制**：重复分析结果使用缓存
- **超时设置**：为长时间任务设置合理的超时

### 3. 错误处理

- **退出码**：Hook 脚本应正确返回退出码
- **日志记录**：详细记录执行过程和错误信息
- **回滚机制**：关键操作前创建备份

### 4. 监控和维护

- **执行日志**：保留自动化任务的执行日志
- **性能监控**：监控自动化任务的执行时间
- **定期审查**：定期检查和更新自动化脚本

---

*通过合理使用自动化和批处理功能，Claude Code 可以成为开发团队的强大生产力工具，显著提升开发效率和代码质量。*`
  }
};