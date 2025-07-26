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
\`\`\

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
\`\`\

#### 2. 文件系统集成

访问和操作本地文件系统：

\`\`\`bash
# 读取项目文档
"请读取 /docs/api.md 文件内容"

# 批量处理文件
"在 /src 目录下找到所有 .ts 文件，并添加类型注解"
\`\`\

#### 3. Git 集成

直接操作 Git 仓库：

\`\`\`bash
# 查看提交历史
"显示最近 10 次提交记录"

# 分析代码变更
"分析 feature/auth 分支与 main 分支的差异"
\`\`\

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
\`\`\

### 上下文管理命令

\`\`\`bash
# 设置项目上下文
/context set project "React TypeScript 电商平台"

# 添加关键文件到上下文
/context add README.md package.json

# 清除上下文
/context clear
\`\`\

### 代码生成命令

\`\`\`bash
# 生成 React 组件
/component UserProfile --props "name, avatar, email"

# 生成 API 路由
/api users --crud --auth

# 生成测试文件
/test UserService --coverage
\`\`\

### 调试和诊断命令

\`\`\`bash
# 诊断系统状态
/diagnose

# 查看日志
/logs --recent 100

# 性能分析
/performance analyze
\`\`\

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
\`\`\

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
\`\`\

## 故障排除

### 常见问题

1. **MCP 服务器连接失败**
   \`\`\`bash
   # 检查服务器状态
   claude --debug-mcp
   
   # 重启 MCP 服务器
   claude --restart-mcp
   \`\`\

2. **权限被拒绝**
   \`\`\`bash
   # 临时跳过权限检查
   claude --skip-permissions
   
   # 更新权限配置
   /permissions add Bash(*) Edit(*) Write(*)
   \`\`\

3. **上下文丢失**
   \`\`\`bash
   # 重新加载项目上下文
   /context reload
   
   # 手动设置上下文文件
   /context add CLAUDE.md package.json
   \`\`\

## 最佳实践

1. **定期更新 MCP 服务器**：保持工具链的最新状态
2. **合理配置权限**：平衡安全性和便利性
3. **创建项目文档**：维护 CLAUDE.md 文件
4. **使用版本控制**：将 MCP 配置纳入版本管理

---

