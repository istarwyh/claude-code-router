# 自定义环境配置深度指南

配置 CLAUDE.md 文件、权限管理和 GitHub CLI 集成，让 Claude Code 更好地理解你的项目。

## 1. 创建 CLAUDE.md 文件

**作用**：作为项目记忆库，自动注入上下文，减少重复说明

**推荐位置**：
- 项目根目录（`CLAUDE.md`）
- 子目录（按需加载）
- 全局配置（`~/.claude/CLAUDE.md`）

**内容结构**：

```markdown
# 项目基础信息

- 技术栈：React + TypeScript + Node.js
- 运行环境：Node 18+, Python 3.9+

# 常用命令

- `npm run dev`: 启动开发服务器
- `npm run test`: 运行测试
- `npm run build`: 构建项目

# 代码规范

- 使用 ES modules
- 函数使用 camelCase 命名
- 组件使用 PascalCase 命名

# 测试策略

- 单元测试使用 Jest
- E2E 测试使用 Playwright
- 测试文件命名：*.test.ts

# 注意事项

- 提交前必须运行 lint 和测试
- 新功能需要更新文档
```

这个和 cursor rules 类似，很多 AI Coding 类产品都有给 LLM 补充 context 的文件需要配置。

## 2. 权限管理策略

**安全配置**：

```bash
# 查看当前权限
/permissions

# 允许特定操作
/permissions add Edit
/permissions add Bash(git commit:*)

# 跳过所有权限检查（谨慎使用）可以使用 Shift+ Tab 切换模式
claude --dangerously-skip-permissions
```

`claude --dangerously-skip-permissions` 也被称为 YOLO（You Only Live Once）模式 :)

## 3. GitHub CLI 集成

**安装**：

```bash
brew install gh  # macOS
```

**常用操作**：

- 创建 PR：`gh pr create`
- 查看 Issue：`gh issue view`
- 添加标签：`gh issue edit --add-label`

**配置 Claude Code 使用 GitHub CLI**：

```bash
# 认证
gh auth login

# 配置 Claude Code 使用 GitHub CLI
claude config set github.cli true
```

## 4. 项目特定配置

**目录结构配置**：

```markdown
# 项目结构说明

src/
├── components/     # React 组件
├── services/       # 业务逻辑
├── utils/          # 工具函数
├── types/          # TypeScript 类型定义
└── tests/          # 测试文件

# 重要文件说明

- `package.json`: 项目依赖和脚本
- `tsconfig.json`: TypeScript 配置
- `.eslintrc.js`: ESLint 规则
- `jest.config.js`: 测试配置
```

## 5. 最佳实践

- **定期更新**：保持 CLAUDE.md 文件的时效性
- **分层配置**：全局配置 + 项目配置 + 目录配置
- **权限最小化**：只给予必要的权限
- **版本控制**：将配置文件纳入版本控制
