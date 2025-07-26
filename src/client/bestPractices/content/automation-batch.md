# 自动化与批处理 - 让 Claude Code 成为你的开发生产力倍增器

学习如何将 Claude Code 集成到自动化工作流中，包括 CI/CD 流程和批处理任务。

## 1. 无头模式（Headless Mode）

### 1.1 基本用法

```bash
# CI/CD 集成
claude -p "运行所有测试并生成覆盖率报告" --output-format stream-json

# 批量处理
claude -p "为所有 TypeScript 文件添加类型检查" --allowedTools Edit
```

### 1.2 输出格式

**支持的输出格式**：

- `stream-json`：流式 JSON 输出，适合实时处理
- `json`：标准 JSON 格式
- `text`：纯文本格式
- `markdown`：Markdown 格式

## 2. 自动化脚本示例

### 2.1 Issue 自动分类

```bash
#!/bin/bash
# auto-triage.sh

ISSUE_NUMBER=$1
claude -p "
分析 GitHub Issue #$ISSUE_NUMBER 并添加合适的标签
步骤：
1. 读取 Issue 内容
2. 识别问题类型（bug/feature/docs）
3. 评估优先级
4. 添加标签
" --allowedTools mcp__github__add_labels
```

### 2.2 代码质量检查

```bash
#!/bin/bash
# quality-check.sh

claude -p "
对当前项目进行全面的代码质量检查：
1. 运行 ESLint 检查
2. 运行 TypeScript 类型检查
3. 检查测试覆盖率
4. 分析代码复杂度
5. 生成质量报告
" --allowedTools Bash,Read,Write
```

### 2.3 文档自动生成

```bash
#!/bin/bash
# generate-docs.sh

claude -p "
为项目生成完整的 API 文档：
1. 扫描所有源代码文件
2. 提取函数和类的注释
3. 生成 Markdown 格式的 API 文档
4. 更新 README.md 文件
" --allowedTools Read,Write,Glob
```

## 3. Pre-Commit Hooks

### 3.1 基础 Hook 配置

**.git/hooks/pre-commit**：

```bash
#!/bin/bash
# 使用 Claude 检查代码质量

claude -p "
检查即将提交的代码：
1. 运行 lint 检查
2. 确保测试通过
3. 验证代码风格一致性
4. 如有问题，提供修复建议
" --allowedTools Bash
```

### 3.2 高级 Hook 示例

```bash
#!/bin/bash
# advanced-pre-commit.sh

# 获取即将提交的文件
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(ts|js|tsx|jsx)$')

if [ -z "$STAGED_FILES" ]; then
    echo "No JavaScript/TypeScript files to check"
    exit 0
fi

# 使用 Claude 进行代码审查
claude -p "
对以下即将提交的文件进行代码审查：
$STAGED_FILES

检查项目：
1. 代码风格一致性
2. 潜在的 bug 和问题
3. 性能优化建议
4. 安全性检查
5. 测试覆盖情况

如果发现问题，请提供具体的修复建议。
" --allowedTools Read,Bash
```

## 4. Claude Code Hooks

### 4.1 Hook 系统概述

这个写 Spring 的应该很熟悉，类似简单的 Spring 生命周期扩展点，在 CC 执行的每个阶段执行对应的 Hook 动作。CC 也提醒你配置 Hooks 自动化运行后结果自负。

**配置位置**：
- `~/.claude/settings.json` - 用户设置
- `.claude/settings.json` - 项目设置

### 4.2 Hook 中的变量

- `$CLAUDE_FILE_PATHS` - 正在修改的文件
- `$CLAUDE_TOOL_INPUT` - 完整工具参数的 JSON 格式
- `$CLAUDE_NOTIFICATION` - 通知消息内容

### 4.3 PreToolUse Hook

**用途**：在 Claude 执行任何操作之前运行

```bash
[[hooks]]
event = "PreToolUse"
[hooks.matcher]
tool_name = "edit_file"
file_paths = ["src/production/**/*"]
command = "echo 'WARNING: Attempting to modify production files!' && exit 2"
```

### 4.4 PostToolUse Hook

**用途**：在工具使用后执行清理或格式化

```bash
[[hooks]]
event = "PostToolUse"
[hooks.matcher]
tool_name = "edit_file"
file_paths = ["src/**/*.ts"]
command = "npx prettier --write $CLAUDE_FILE_PATHS"
```

### 4.5 高级 Hook 示例

**自动测试运行**：

```bash
[[hooks]]
event = "PostToolUse"
[hooks.matcher]
tool_name = "edit_file"
file_paths = ["src/**/*.test.ts", "src/**/*.spec.ts"]
command = "npm test -- --testPathPattern=$CLAUDE_FILE_PATHS"
```

**代码质量检查**：

```bash
[[hooks]]
event = "PreToolUse"
[hooks.matcher]
tool_name = "edit_file"
command = """
echo "Running pre-edit checks..."
npm run lint -- $CLAUDE_FILE_PATHS
npm run type-check
"""
```

## 5. CI/CD 集成

### 5.1 GitHub Actions 集成

```yaml
name: Claude Code Review
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  claude-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Claude Code
        run: |
          npm install -g @anthropic/claude-code
          
      - name: Run Claude Code Review
        run: |
          claude -p "
          对这个 PR 进行代码审查：
          1. 检查代码质量
          2. 识别潜在问题
          3. 提供改进建议
          4. 验证测试覆盖
          " --allowedTools Read,Bash
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

### 5.2 自动化部署检查

```bash
#!/bin/bash
# deploy-check.sh

claude -p "
执行部署前检查：
1. 验证所有测试通过
2. 检查构建是否成功
3. 验证环境配置
4. 检查数据库迁移
5. 确认依赖版本兼容性
6. 生成部署报告
" --allowedTools Bash,Read,Write
```

## 6. 批处理任务

### 6.1 代码迁移

```bash
#!/bin/bash
# migrate-code.sh

claude -p "
执行代码迁移任务：
1. 将所有 JavaScript 文件转换为 TypeScript
2. 添加必要的类型定义
3. 更新导入语句
4. 修复类型错误
5. 运行测试确保功能正常
" --allowedTools Read,Write,Edit,Bash
```

### 6.2 文档更新

```bash
#!/bin/bash
# update-docs.sh

claude -p "
批量更新项目文档：
1. 扫描所有代码变更
2. 识别需要更新的文档
3. 生成新的 API 文档
4. 更新使用示例
5. 检查文档链接有效性
" --allowedTools Read,Write,Glob,WebFetch
```

## 7. 最佳实践

### 7.1 安全考虑

⚠️ **安全提醒**：
- 在自动化环境中使用时，注意 API 密钥的安全管理
- 限制自动化脚本的权限范围
- 定期审查自动化脚本的执行日志
- 为敏感操作添加人工确认步骤

### 7.2 性能优化

- **并行处理**：对独立任务使用并行执行
- **缓存机制**：缓存常用的分析结果
- **增量处理**：只处理变更的文件
- **资源限制**：设置合理的资源使用限制

### 7.3 监控和日志

- **执行日志**：记录所有自动化操作的详细日志
- **错误处理**：建立完善的错误处理和恢复机制
- **性能监控**：监控自动化任务的执行时间和资源使用
- **告警机制**：为关键失败设置告警通知

通过合理的自动化配置，Claude Code 可以成为你的开发生产力倍增器，大大提升开发效率和代码质量。
