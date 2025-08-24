因为 AI 写代码越来越快，使用软件工程的手段驯服AI 就更加重要。

## 魔法词

- Brief
- KISS (Keep It Simple, Stupid)
- YAGNI (You Ain't Gonna Need It)
- DRY (Don't Repeat Yourself)
- SOLID

## 对魔法词的解释
### Brief
人类的阅读和识别能力都是有限的，根据实践我倡议每个方法、函数都应该简短，原则上不应该超过 7 行。 并且尽量不要有超过 3 个参数。且遵循纯函数设计原则，避免预期外的副作用。
### KISS
能用最直接的方法解决，就别绕弯子。代码要让新人一眼看懂，复杂的设计模式不是炫技工具。

### YAGNI
当前版本用不到的功能，一律不写。别为了"将来可能"的需求提前铺路，真需要时再加，重构比预设更可靠。

### DRY

尽量不要有重复的代码。有时候一味追求不重复会让代码难懂，而保证自己写的代码在需要的时候只需要改动一处，是更为实际的原则。

### SOLID
1. **S - 单一职责原则（Single Responsibility Principle, SRP）**：一个类应该只有一个引起它变化的原因。简单来说，一个类应该只负责一项职责。

2. **O - 开放封闭原则（Open Closed Principle, OCP）**：软件实体（类、模块、函数等等）应该可以扩展，但是不可修改。也就是说，对于扩展是开放的，对于修改是封闭的。

3. **L - 里氏替换原则（Liskov Substitution Principle, LSP）**：子类型必须能够替换掉它们的父类型。也就是说，在软件中，如果使用某个基类的地方都可以使用其子类，那么子类可以替换父类。

4. **I - 接口隔离原则（Interface Segregation Principle, ISP）**：A client should not to be forced to implement an interface that it doesn't use。也就是说，一个类对另一个类的依赖应该建立在最小的接口上，这鼓励我们在**内部实现中**将大的、复杂的接口拆分为更小、更具体的接口。

5. **D - 依赖倒置原则（Dependency Inversion Principle, DIP）**：高层模块不应该依赖低层模块，两者都应该依赖其抽象。也就是说，要针对接口编程，不要对实现编程。