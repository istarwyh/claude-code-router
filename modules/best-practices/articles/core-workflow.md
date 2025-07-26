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
\`\`\

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
\`\`\

⚠️ **注意**：根据 [Claude Code 官方建议](https://www.anthropic.com/engineering/claude-code-best-practices)，不同词汇对应不同的思考预算：\`"think" < "think hard" < "think harder" < "ultrathink"\

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
\`\`\

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
\`\`\

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
\`\`\

**响应体**：
\`\`\`json
{
  "success": true,
  "message": "注册成功，请查收验证邮件",
  "userId": "uuid-here"
}
\`\`\

**错误响应**：
\`\`\`json
{
  "success": false,
  "error": "EMAIL_EXISTS",
  "message": "该邮箱已被注册"
}
\`\`\
\`\`\

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
\`\`\

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
\`\`\

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

