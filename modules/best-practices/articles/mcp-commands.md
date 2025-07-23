# MCP 与常用命令 - 扩展 Claude Code 的能力边界

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

在 `~/.claude/mcp_servers.json` 中配置以下服务器：

```json
{
  "mcpadvisor": {
    "command": "npx",
    "args": ["-y", "@xiaohui-wang/mcpadvisor@1.0.4"],
    "description": "MCP 服务器顾问，帮助管理和优化 MCP 配置"
  },
  "context7": {
    "command": "npx",
    "args": ["-y", "@upstash/context7-mcp@latest"],
    "description": "为任何提示提供最新的文档和上下文"
  },
  "sequential-thinking": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"],
    "env": {},
    "disabled": false,
    "description": "提供结构化思维和推理能力"
  },
  "memory": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-memory"],
    "env": {},
    "description": "长期记忆和上下文保持"
  },
  "github": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-github"],
    "env": {
      "GITHUB_PERSONAL_ACCESS_TOKEN": "your_token_here"
    },
    "description": "GitHub 集成，支持仓库操作和 Issue 管理"
  },
  "filesystem": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-filesystem"],
    "env": {},
    "description": "文件系统访问和操作"
  }
}
```

### MCP 服务器管理命令

```bash
# 查看所有可用的 MCP 命令
claude mcp

# 添加新的 MCP 服务器
claude mcp add <name> <command> [args...]

# 带环境变量的服务器配置
claude mcp add my-server -e API_KEY=123 -- /path/to/server arg1 arg2

# 启用/禁用服务器
claude mcp enable <server-name>
claude mcp disable <server-name>

# 查看服务器状态
claude mcp status

# 重启所有服务器
claude mcp restart
```

### 实用 MCP 服务器推荐

#### 1. **GitHub 集成服务器**
```json
{
  "github": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-github"],
    "env": {
      "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxx"
    }
  }
}
```

**功能**：
- 创建和管理 Issues
- 提交 Pull Requests
- 代码审查自动化
- 仓库分析

#### 2. **数据库集成服务器**
```json
{
  "postgres": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-postgres"],
    "env": {
      "POSTGRES_CONNECTION_STRING": "postgresql://user:pass@localhost:5432/db"
    }
  }
}
```

**功能**：
- 数据库查询和分析
- 架构管理
- 性能优化建议

#### 3. **Web 搜索服务器**
```json
{
  "brave-search": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-brave-search"],
    "env": {
      "BRAVE_API_KEY": "your_api_key"
    }
  }
}
```

**功能**：
- 实时信息搜索
- 技术文档查找
- 最新趋势分析

## Claude Code 常用命令参数

### 基础命令参数

```bash
# 继续最近的对话
claude --continue

# 从历史对话中选择一个继续
claude --resume

# 启用调试模式（显示详细日志）
claude --debug

# 无限制模式（跳过权限检查）
claude --dangerously-skip-permissions

# 指定输出格式
claude --output-format json
claude --output-format stream-json

# 限制可用工具
claude --allowedTools Edit,Read,Bash
```

### 在 Claude 对话中使用命令

在 Claude 对话中，需要使用 `!` 前缀来执行命令：

```bash
# 查看权限状态
!claude permissions

# 添加特定权限
!claude permissions add Edit
!claude permissions add Bash(git:*)

# 查看 MCP 服务器状态
!claude mcp status

# 查看当前会话信息
!claude session info
```

![Claude Debug 模式示例](https://xiaohui-zhangjiakou.oss-cn-zhangjiakou.aliyuncs.com/image/202507202037009.png)

## 自定义 Slash 命令

### 创建命令目录

```bash
# 项目级命令（优先级更高）
mkdir -p .claude/commands

# 用户级命令（全局可用）
mkdir -p ~/.claude/commands
```

### 基础 Slash 命令示例

#### 修复 GitHub Issue 命令

```markdown
# .claude/commands/fix-issue.md

请分析和修复 GitHub issue: $ARGUMENTS

执行步骤：

1. 使用 `gh issue view $ARGUMENTS` 获取详细信息
2. 理解问题描述和重现步骤
3. 搜索相关代码文件
4. 分析问题根因
5. 实现修复方案
6. 编写或更新测试用例
7. 运行测试验证修复效果
8. 提交代码并创建 PR
9. 在 Issue 中关联 PR

注意事项：
- 确保修复不会引入新的问题
- 遵循项目的代码规范
- 更新相关文档
```

**使用方法**：
```bash
/fix-issue 1234
```

#### 代码审查命令

```markdown
# .claude/commands/code-review.md

对指定的代码变更进行全面审查：$ARGUMENTS

审查清单：

## 代码质量
- [ ] 代码逻辑清晰，易于理解
- [ ] 遵循项目代码规范
- [ ] 没有明显的性能问题
- [ ] 错误处理充分

## 安全性
- [ ] 没有安全漏洞
- [ ] 输入验证充分
- [ ] 敏感信息处理正确

## 测试覆盖
- [ ] 新功能有对应测试
- [ ] 测试用例覆盖边界情况
- [ ] 现有测试仍然通过

## 文档更新
- [ ] API 变更有文档说明
- [ ] README 更新（如需要）
- [ ] 注释清晰有用

审查完成后提供：
1. 问题列表及建议修复方案
2. 代码质量评分（1-10）
3. 合并建议
```

### Meta-Slash-Commands（命令生成器）

创建一个能够生成其他 Slash 命令的命令：

```markdown
---
allowed-tools: Write(*),Read(*),Bash(mkdir:*),Bash(ls:*),Bash(echo:*),Bash(cp:*),Bash(date:*)
description: 生成一个支持版本管理的新斜杠命令
version: 1.0.0
author: xiaohui
---

# 生成带版本管理的斜杠命令

您正在创建一个内置版本管理的新 Slash Command。根据 `$ARGUMENTS` 中的用户需求，生成一个完整的带版本控制的 Slash Command 文件。

## 版本管理功能

此命令支持：
- **语义化版本控制** (MAJOR.MINOR.PATCH)
- 更新现有命令时**自动创建备份**
- 在 YAML Frontmatter 中**跟踪版本历史**
- **生成更新日志**

## 指令：

1. **解析参数**：格式应为 `<command-name> "<description>" [project|user] [version] [additional-requirements]`
   - `command-name`: 斜杠命令的名称（不带 `/`）
   - `description`: 命令的作用
   - `scope`: "project" (`.claude/commands/`) 或 "user" (`~/.claude/commands/`) - 默认为 "user"
   - `version`: 语义化版本（新命令默认为 "1.0.0"）
   - `additional-requirements`: 任何所需的特殊功能

2. **版本管理流程**：
   - 检查命令文件是否已存在
   - 如果存在：使用当前版本号创建备份
   - 更新版本号（适当递增）
   - 向 Frontmatter 添加更新日志条目

3. **生成带增强 YAML Frontmatter 的命令文件**：
   ```yaml
   ---
   allowed-tools: [适当的工具]
   description: [命令描述]
   version: "X.Y.Z"
   created: "YYYY-MM-DD"
   updated: "YYYY-MM-DD"
   changelog:
     - version: "X.Y.Z"
       date: "YYYY-MM-DD"
       changes: ["初始版本" 或具体更改]
   ---
   ```

## 示例 allowed-tools 模式：
- `Bash(git:*)` - 用于 Git 命令
- `Bash(gh:*)` - 用于 GitHub CLI 命令
- `Read(*)`, `Write(*)`, `Edit(*)` - 用于文件操作
- `LS(*)`, `Glob(*)`, `Grep(*)` - 用于目录/搜索操作
- `WebFetch(*)`, `WebSearch(*)` - 用于 Web 操作

## 命令参数：$ARGUMENTS

现在使用版本管理创建 Slash Command 命令文件，确保它遵循 Claude Code 斜杠命令的最佳实践。
```

![Meta命令示例](https://xiaohui-zhangjiakou.oss-cn-zhangjiakou.aliyuncs.com/image/202507201749933.png)

## 高级用法和技巧

### 1. **命令组合和管道**

```bash
# 将多个命令组合使用
/analyze-code src/ | /generate-docs | /create-pr "docs: 更新API文档"

# 条件执行
/run-tests && /deploy-staging || /notify-team "测试失败"
```

### 2. **动态参数替换**

```markdown
# 支持环境变量和动态值
执行命令：git commit -m "fix: 修复issue #$ARGUMENTS (authored by $USER on $DATE)"
```

### 3. **交互式命令**

```markdown
# 支持用户输入确认
在执行删除操作前，请确认：
- 文件路径：$ARGUMENTS
- 是否继续？(y/N)
```

## 故障排除

### 常见问题

1. **MCP 服务器无法启动**
   ```bash
   # 检查服务器状态
   claude mcp status
   
   # 查看详细错误日志
   claude --debug mcp start <server-name>
   ```

2. **权限问题**
   ```bash
   # 重置权限
   claude permissions reset
   
   # 查看当前权限
   claude permissions list
   ```

3. **命令未找到**
   ```bash
   # 刷新命令缓存
   claude commands refresh
   
   # 列出所有可用命令
   claude commands list
   ```

### 性能优化

1. **限制并发 MCP 连接**
2. **定期清理命令缓存**
3. **使用轻量级 MCP 服务器**
4. **合理配置超时时间**

---

*通过合理配置 MCP 服务器和创建自定义命令，Claude Code 的能力可以无限扩展，成为真正的开发生产力倍增器。*