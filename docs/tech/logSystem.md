# 前端日志系统最佳实践

> 基于分布式追踪理念的前端日志系统设计与实践指南

## 🎯 设计目标

### 核心理念

1. **链路追踪** - 使用 `traceId` 和 `spanId` 追踪完整的用户操作流程
2. **简洁易用** - 提供简化 API，减少重复参数传递
3. **上下文管理** - 自动管理当前操作的 category 和 traceId
4. **多环境支持** - 开发环境详细日志，生产环境关键信息

### 术语统一

- **Trace（追踪）** - 完整的用户操作链路
- **Span（片段）** - 链路中的具体操作步骤
- **Category（分类）** - 业务功能分类：plan-execute、todolist、workspace、ui、general

## 🏗️ 系统架构

### 核心组件

```typescript
// 日志上下文管理器
class LogContext {
  private static currentCategory: LogCategory = 'general';
  private static currentTraceId?: string;
}

// 主日志类
class Logger {
  // 支持多级别：debug, info, warn, error
  // 支持多输出：console, localStorage, 调试面板
}

// 便捷API
export const logFlow = {
  // 简化API（推荐）
  trace: (traceName: string, category?: LogCategory) => string,
  step: (operation: string, data?: any) => void,
  done: (success?: boolean, result?: any) => void,
  info: (message: string, data?: any) => void,
  warn: (message: string, data?: any) => void,
  err: (message: string, data?: any) => void,

  // 详细API（高级用法）
  startTrace: (category: LogCategory, traceName: string) => string,
  span: (category: LogCategory, traceId: string, operation: string, data?: any) => void,
  endTrace: (category: LogCategory, traceId: string, success: boolean, result?: any) => void
};
```

## 📝 API 使用指南

### 1. 简化 API（推荐日常使用）

开始一个完整追踪：

```typescript
// 自动设置上下文，返回 traceId
const traceId = logFlow.trace('TodoList Generation', 'plan-execute');
```

记录操作步骤：

```typescript
// 使用当前上下文，无需重复传参
logFlow.step('Starting todolist generation');
logFlow.step('Workspace loaded', { id: 'xxx', title: 'workspace' });
```

记录不同级别的日志：

```typescript
logFlow.info('Operation completed');
logFlow.warn('Potential issue detected', { reason: 'xxx' });
logFlow.err('Operation failed', error);
```

结束追踪：

```typescript
// 成功完成
logFlow.done(true, { result: 'success' });

// 失败结束
logFlow.done(false, error);
```

### 2. 详细 API（高级定制）

精细化控制：

```typescript
// 手动指定所有参数
const traceId = logFlow.startTrace('plan-execute', 'Complex Operation');
logFlow.span('plan-execute', traceId, 'Step 1', data);
logFlow.endTrace('plan-execute', traceId, true, result);
```

### 3. 上下文管理

手动管理上下文：

```typescript
// 设置上下文
logFlow.setContext('workspace', traceId);

// 使用简化API，自动使用当前上下文
logFlow.step('File operation');

// 重置上下文
logFlow.resetContext();
```

## 🎨 实践模式

### 1. 标准业务流程模式

```typescript
class PlanExecuteCallbacks {
  async postFirstMessage(
    userInput: string,
    assistantResponse: string,
  ): Promise<string> {
    // 开始追踪
    logFlow.trace('TodoList Generation', 'plan-execute');

    try {
      logFlow.step('Starting todolist generation');

      const result = await this.generateTodoList(userInput, assistantResponse);

      if (result) {
        logFlow.step('TodoList generated successfully', {
          title: result.title,
          contentLength: result['todolist.md'].length,
        });

        this.updateWorkspace(result);

        // 成功结束
        logFlow.done(true, { title: result.title });
        return result.title;
      } else {
        logFlow.step('Generation failed, using fallback');
        logFlow.done(false, 'No result from generation');
        return this.getFallbackTitle(userInput);
      }
    } catch (error) {
      logFlow.err('TodoList generation error', error);
      logFlow.done(false, error);
      return this.getFallbackTitle(userInput);
    }
  }
}
```

### 2. 错误处理模式

```typescript
private async updateWorkspace(todoResult: TodoListResult): void {
  try {
    logFlow.step('Starting workspace update');

    const workspace = this.getWorkspace();
    if (!workspace) {
      logFlow.err('No active workspace found');
      return;
    }

    const success = this.saveToWorkspace(workspace, todoResult);

    logFlow.step('Workspace updated', {
      action: success ? 'updated' : 'created',
      size: todoResult['todolist.md'].length
    });

  } catch (error) {
    logFlow.err('Failed to update workspace', error);
    throw error; // 可选：重新抛出让上层处理
  }
}
```

## 🔧 配置与优化

### 1. 环境配置

```typescript
// 开发环境：启用所有日志
const isEnabled = process.env.NODE_ENV === 'development';

// 生产环境：只记录 warn 和 error
const productionFilter = (level: LogLevel) => ['warn', 'error'].includes(level);
```

### 2. 性能优化

```typescript
// 大数据对象记录时，只记录关键信息
logFlow.step('Large data processed', {
  count: largeArray.length,
  firstItem: largeArray[0]?.id,
  lastItem: largeArray[largeArray.length - 1]?.id,
  // 避免： largeArray  // 可能导致序列化性能问题
});
```

### 3. 日志分级策略

- **debug** - 详细的调试信息（仅开发环境）
- **info** - 关键业务步骤（开发+测试环境）
- **warn** - 潜在问题提醒（所有环境）
- **error** - 错误信息（所有环境，需要告警）

## 📊 日志输出格式

### 标准格式

```
[2025-07-08T08:50:34.618Z] INFO 🎯 [plan-execute] 📍 Span: TodoList generated successfully | Data: {"title":"示例","contentLength":124} | Trace: plan-execute_1751964627071_c4ouiu
```

### 字段说明

- **Timestamp** - ISO 8601 格式时间戳
- **Level** - 日志级别：DEBUG/INFO/WARN/ERROR
- **Icon** - 分类图标：🎯(plan-execute), 📋(todolist), 🏠(workspace), 🎨(ui), 📝(general)
- **Category** - 业务分类
- **Message** - 具体操作描述
- **Data** - 结构化数据（可选）
- **Trace** - 追踪 ID（可选）

## 🛠️ 调试工具

### 开发者工具

```typescript
// 浏览器控制台可用
window.debugLogger.downloadLogs(); // 下载日志文件
window.debugLogger.clearLogs(); // 清空日志
window.debugLogger.getLogs(); // 获取日志内容
```

## ⚠️ 注意事项

### 1. 数据安全

- 避免记录敏感信息（密码、token 等）
- 大对象记录关键字段，避免完整序列化
- 生产环境限制日志级别

### 2. 性能考虑

- 避免在高频操作中记录详细日志
- 使用异步写入，避免阻塞主线程
- 定期清理历史日志，控制存储大小

### 3. 错误处理

- 日志记录本身不应影响业务逻辑
- 序列化失败时使用降级方案
- 避免在日志回调中再次记录日志（循环依赖）

## 📚 扩展阅读

### 相关规范

- [OpenTelemetry Tracing Specification](https://opentelemetry.io/docs/specs/otel/trace/)
- [Structured Logging Best Practices](https://betterstack.com/community/guides/logging/structured-logging/)

### 调试面板集成

调试日志面板作为独立组件，提供开发环境下实时日志的查询，以及与 LLM 配合调试时方便复制日志给 LLM 作为 prompt，提高开发效率。