# 快速实践集成指令

## 🚀 一键集成命令

当你有新的 Claude Code 实践时，直接使用以下指令：

```
请将以下 Claude Code 实践集成到"如何用好 CC"模块中：

[在这里粘贴你的实践描述]

请按照以下要求处理：
1. 分析实践内容，确定分类（环境配置/工具集成/工作流程/自动化/协作）
2. 评估难度等级（初级/中级/高级）
3. 提取关键信息（命令、快捷键、核心功能）
4. 组织成简洁专业的内容格式
5. 说明应该添加到项目的哪个位置
6. 提供具体的代码更新建议

格式要求：
- 标题简洁明了
- 描述分段清晰，适当换行
- 命令展示专业，支持复制
- 警告提示简洁内联
- 避免冗长列表
```

## 📋 示例使用

**输入**：
```
请将以下 Claude Code 实践集成到"如何用好 CC"模块中：

启动 Claude Code 时使用 --dangerously-skip-permissions 后缀，即 claude --dangerously-skip-permissions 可以启动 cc 自动运行模式，之后需要接管的时候使用 Shift+Tab 便可以切换需要人类确认的模式

请按照以下要求处理：
1. 分析实践内容，确定分类（环境配置/工具集成/工作流程/自动化/协作）
2. 评估难度等级（初级/中级/高级）
3. 提取关键信息（命令、快捷键、使用场景）
4. 组织成结构化的内容格式
5. 说明应该添加到项目的哪个位置
6. 提供具体的代码更新建议

格式要求：标题简洁、描述清晰、示例完整、注意事项明确。
```

**预期输出格式**：

### 🤖 自动运行模式控制
**分类**：自动化与批处理 | **难度**：高级 | **标签**：`自动化` `权限管理`

**功能描述**：
跳过权限确认，启用全自动化操作模式。

⚠️ 高风险操作，建议配合 Git 等版本控制系统使用

**命令展示**：
```
Command: claude --dangerously-skip-permissions [复制按钮]
Shortcut: [Shift] + [Tab] → 切换回人工确认模式
```

**集成位置**：
- 文件：`modules/best-practices/components/bestPractices.ts`
- 分类：🤖 自动化与批处理
- 位置：practice-items 中添加新的 practice-item

**代码结构**：
```html
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
    <!-- 命令块和快捷键块 -->
  </div>
</div>
```

## 🎯 快速检查清单

使用此指令时，AI 应该确保：

- [ ] 实践分类准确（6个主要分类之一）
- [ ] 难度评估合理（考虑用户技能要求）
- [ ] 命令格式正确（可直接复制使用）
- [ ] 安全提醒完整（特别是高风险操作）
- [ ] 集成位置明确（具体文件和组件位置）
- [ ] 代码示例可用（符合现有代码结构）

## 🔄 持续优化

每次使用后可以：
1. 检查集成效果是否符合预期
2. 根据用户反馈调整格式
3. 完善分类体系和标签系统
4. 优化学习路径的连贯性

---

*使用这个快速指令，可以高效地将 Claude Code 实践整合到知识库中。*
