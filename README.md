# JavaScript/TypeScript AST重命名工具

这是一个基于抽象语法树(AST)和大型语言模型(LLM)的JavaScript/TypeScript代码变量重命名工具，旨在提高代码的可读性和可维护性。

## 功能特点

- 使用AST(抽象语法树)分析JavaScript/TypeScript代码
- 自动识别变量、函数和类名
- 使用大语言模型(LLM)为短变量名和意义不明确的函数名提供更有语义的命名建议
- 支持本地模型(使用node-llama-cpp)，无需依赖云API
- 支持多种语言模型类型，可扩展
- 保持语法正确性和作用域完整性
- 智能识别有意义的变量名，避免不必要的重命名
- 实时进度显示

## 安装方法

```bash
npm install ast-ai-rename
```

## 使用方法

### 基本用法

```javascript
import { optimizeCode, ModelType } from 'ast-ai-rename';

// 待优化的代码
const code = `
function f(x, y) {
  let a = x + y;
  return a * 2;
}
`;

// 配置选项
const options = {
  modelType: ModelType.LOCAL,
  modelConfig: {
    modelPath: '/path/to/your/model.gguf', // 本地模型路径
    useGPU: true // 是否使用GPU加速
  },
  contextWindowSize: 3000,
  verbose: true
};

// 优化代码
const optimizedCode = await optimizeCode(code, options);
console.log(optimizedCode);
// 输出可能是:
// function calculateSum(firstNumber, secondNumber) {
//   let sum = firstNumber + secondNumber;
//   return sum * 2;
// }
```

### 选项说明

`optimizeCode`函数接受以下选项：

- `modelType`: 模型类型，可选 `ModelType.LOCAL` 或 `ModelType.OPENAI`
- `modelConfig`: 模型配置
  - 对于本地模型: `{ modelPath: string, useGPU?: boolean }`
- `contextWindowSize`: 上下文窗口大小，决定了分析每个变量时考虑的代码范围
- `verbose`: 是否输出详细日志
- `onProgress`: 进度回调函数，接收一个0-1之间的数值表示进度

## CLI命令行工具

该工具也提供命令行接口：

```bash
npx ast-rename optimize path/to/file.js --model=local --model-path=/path/to/model.gguf
```

## 项目结构

- `src/`: 源代码目录
  - `ast/`: AST相关处理代码
    - `visitAllIdentifiers.ts`: 遍历AST并应用重命名的核心逻辑
  - `models/`: 语言模型相关代码
    - `modelFactory.ts`: 模型工厂，负责创建不同类型的模型实例
    - `localModel.ts`: 本地LLM模型实现
  - `utils/`: 工具函数和类型定义
    - `fileProcessor.ts`: 文件处理逻辑
    - `preprocessor.ts`: 代码预处理
    - `types.ts`: 类型定义
    - `logger.ts`: 日志工具
  - `index.ts`: 主入口文件，导出公共API
  - `example.ts`: 使用示例

## 依赖项

- Node.js >= 20.0.0
- 核心依赖:
  - @babel/core: 用于AST解析和转换
  - node-llama-cpp: 用于本地LLM推理

## 模型推荐

对于本地模型，推荐使用以下模型：

- Phi-3-mini-4k-instruct: 适合代码分析的轻量级模型
- CodeLlama: 专门针对代码优化的模型

## 开发注意事项

1. AST解析使用Babel，支持TypeScript和React JSX
2. 本地模型使用node-llama-cpp调用，确保已安装该库并正确配置
3. 智能检测已经语义明确的变量名，避免不必要的重命名

## 许可证

MIT
