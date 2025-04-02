# JavaScript/TypeScript AST智能变量重命名工具


## 目录

- [项目介绍](#项目介绍)
- [项目作用](#项目作用)
- [代码原理](#代码原理)
    - [核心技术栈](#核心技术栈)
    - [处理流程](#处理流程)
    - [智能识别算法](#智能识别算法)
    - [LLM整合](#llm整合)
- [使用流程](#使用流程)
    - [安装与配置](#安装与配置)
    - [使用方式](#使用方式)
    - [配置参数详解](#配置参数详解)
- [应用场景](#应用场景)
- [代码示例](#代码示例)
- [最佳实践与限制](#最佳实践与限制)
- [未来规划](#未来规划)
- [结语](#结语)

*欢迎贡献代码和提供反馈，一起让代码更易读、更易维护！*
加v一起讨论: xu970821582

## 项目介绍

AST智能变量重命名工具是一个基于抽象语法树(AST)和大型语言模型(LLM)的JavaScript/TypeScript代码优化工具。它能够智能识别代码中的变量、函数和类名，并利用人工智能技术将简短或语义不明确的标识符重命名为更具描述性和可读性的名称，从而提升代码的可维护性。

与传统的代码美化或格式化工具不同，本项目不仅关注代码的外观，更注重提升代码的语义清晰度。通过理解代码的上下文和结构，它能够为开发者提供更加智能化的命名建议，使代码本身更加自解释(self-explanatory)。

## 项目作用

在现代软件开发中，代码可读性和可维护性与功能实现同等重要。清晰的变量和函数命名能够:

1. **降低认知负担**：开发者可以更快理解代码逻辑，减少阅读和理解代码所需的时间
2. **减少文档需求**：良好的命名本身就是最好的文档，减少了额外注释的需要
3. **提高维护效率**：在代码维护阶段，清晰的命名可以大大减少理解原始代码意图的时间
4. **降低错误率**：明确的命名减少了误解代码意图的可能性，从而降低bug产生的概率
5. **促进团队协作**：统一且语义化的命名有助于团队成员之间的沟通和协作

本工具特别适合以下场景：

- **遗留代码优化**：处理混淆或压缩过的历史代码
- **第三方库集成**：优化引入的外部代码，提高可读性
- **代码审查辅助**：作为代码审查过程中的自动化工具
- **学习辅助工具**：帮助初学者理解简化的代码示例
- **代码标准化**：为团队代码库建立一致的命名风格

## 代码原理

### 核心技术栈

本项目结合了多种技术，主要包括：

1. **AST(抽象语法树)分析**：使用Babel进行JavaScript/TypeScript代码解析
2. **上下文识别**：分析变量和函数的使用上下文
3. **大型语言模型(LLM)推理**：利用AI模型根据上下文提供命名建议
4. **作用域分析**：确保重命名不破坏代码的语义和结构

### 处理流程


工具的工作流程如下：

1. **代码解析**：使用Babel将源代码解析为AST(抽象语法树)
2. **标识符收集**：遍历AST，收集所有变量、函数和类名
3. **上下文提取**：为每个标识符提取周围的代码上下文
4. **智能筛选**：对已经具有明确语义的标识符(如常量或已有良好命名的变量)进行过滤
5. **LLM分析**：将需要优化的标识符及其上下文发送给LLM进行分析
6. **命名建议**：LLM返回更具语义的命名建议
7. **安全替换**：在确保不破坏代码结构和作用域的前提下进行重命名
8. **代码生成**：将修改后的AST转换回源代码

### 智能识别算法

本工具使用了一系列启发式规则来识别哪些标识符需要重命名：

```javascript
function isMeaningfulName(name: string): boolean {
    // 常见有意义的前缀
    const meaningfulPrefixes = ['get_', 'set_', 'is_', 'has_', 'can_'...];
    // 常见有意义的单词
    const meaningfulWords = ['data', 'user', 'item', 'element'...];
    
    // 检查是否包含这些有意义的前缀
    const hasPrefix = meaningfulPrefixes.some(prefix => 
        name.toLowerCase().startsWith(prefix));
    if (hasPrefix) return true;
    
    // 对于蛇形命名法，拆分单词后检查每个部分
    if (name.includes('_')) {
        const parts = name.split('_');
        // 检查是否每个部分都有意义
        const meaningfulParts = parts.filter(part => 
            meaningfulWords.some(word => part.toLowerCase() === word || 
                                       (part.length > 3 && word.startsWith(part.toLowerCase())))
        );
        return meaningfulParts.length >= Math.ceil(parts.length / 2);
    }
    
    // 简单检查是否包含有意义的单词
    return meaningfulWords.some(word => name.toLowerCase().includes(word));
}
```

### LLM整合

本工具支持两种主要的LLM集成方式：

1. **本地模型**：利用`node-llama-cpp`在本地运行轻量级模型，保证隐私和低延迟
2. **云API模型**：可扩展支持OpenAI等云服务提供的强大模型

通过模型工厂模式，系统能够灵活切换不同的LLM后端：
此次结合的是基于llama-cpp的本地模型，具体的模型下载及配置请参考[node-llama-cpp](https://github.com/BoscoTheDog/node-llama-cpp)

```typescript
// 加载模型，根据GPU状态决定是否使用GPU层
try {
    this.model = await this.llamaInstance.loadModel({
        modelPath: this.modelPath,
        gpuLayers: this.useGPU && !this.gpuFailed ? undefined : 0,
        defaultContextFlashAttention: true
    });
} catch (error) {
    // 如果模型加载失败且正在使用GPU，尝试回退到CPU
    if (this.useGPU && !this.gpuFailed) {
        logWarning(`使用GPU加载模型失败，错误: ${error}。将回退到CPU模式`);
        this.gpuFailed = true;

        // 如果我们因为GPU问题失败，创建新的llama实例并重试
        this.llamaInstance = await getLlama({gpu: false});
        this.model = await this.llamaInstance.loadModel({
            modelPath: this.modelPath,
            gpuLayers: 0 // 显式设置为0，使用CPU
        });
    } else {
        throw error;
    }
}

// 创建上下文
try {
    this.context = await this.model.createContext();
} catch (error) {
    throw new Error(`创建模型上下文失败: ${error}`);
}

const gpuMode = this.useGPU && !this.gpuFailed ? "GPU" : "CPU";
logVerbose(`模型初始化成功，使用${gpuMode}模式`);
```

## 使用流程

### 安装与配置

1. **安装工具**

```bash
npm install # 会默认下载一个2b的大模型"hf:BoscoTheDog/Phi-3.1-mini-4k-instruct-Q4_K_M_gguf_chunked.gguf:Q8_0"
```

2. **下载模型**（如使用本地模型）

```bash
可自行到huggingface.co下载模型
https://node-llama-cpp.withcat.ai/guide/choosing-a-model
```

### 使用方式

#### 具体参考src/example.ts 可直接运行


### 配置参数详解

| 参数 | 类型 | 说明 |
|------|------|------|
| `modelType` | `ModelType` | 模型类型，可选 `LOCAL` 或 `OPENAI`,目前只有本地，可自行二开 |
| `modelConfig` | `Object` | 模型配置，包含模型路径和GPU设置等 |
| `contextWindowSize` | `number` | 上下文窗口大小，决定分析每个变量时考虑的代码范围 |
| `verbose` | `boolean` | 是否启用详细日志输出 |
| `onProgress` | `Function` | 进度回调函数，接收0-1之间的数值表示进度 |

## 应用场景

### 1. 代码库现代化改造

许多企业面临着维护老旧代码库的挑战。这些代码可能是在变量命名规范不完善的年代编写的，或由不同背景的开发者创建，导致命名风格不一致。本工具可以帮助:

- 统一代码库的命名风格
- 提升历史代码的可读性
- 降低新开发者理解旧代码的门槛

### 2. 处理压缩或混淆的代码

在接手第三方库或遗留系统时，可能会遇到经过压缩或混淆处理的代码。这些代码通常具有极短且无意义的变量名（如a, b, c等）。使用本工具可以:

- 恢复混淆代码的可读性
- 重建代码的语义结构
- 辅助理解复杂算法和逻辑

### 3. 代码审查与质量控制

作为代码审查流程的一部分，本工具可以:

- 自动检测并建议改进不清晰的命名
- 作为CI/CD流程的一环，提前发现潜在的可读性问题
- 为团队提供统一的命名参考标准

### 4. 教学与培训

在编程教育和团队培训中，本工具可以:

- 展示如何从简单命名转变为语义化命名
- 作为最佳实践的示例工具
- 帮助初学者理解良好命名的重要性

### 5. 跨语言代码迁移

当需要将代码从一种语言迁移到另一种语言时（如从Java迁移到TypeScript），本工具可以:

- 在迁移过程中优化变量命名
- 适应目标语言的命名惯例
- 提升迁移后代码的可维护性

## 代码示例

下面是一些实际代码优化的例子，展示了工具的功能和效果：

### 示例1：简单函数重命名

**优化前：**

```javascript
function calc(a, b) {
  let r = a + b;
  return r * 2;
}
```

**优化后：**

```javascript
function calculateValue(firstNumber, secondNumber) {
  let result = firstNumber + secondNumber;
  return result * 2;
}
```

### 示例2：处理循环和条件逻辑

**优化前：**

```javascript
function proc(arr) {
  let res = [];
  for (let i = 0; i < arr.length; i++) {
    let e = arr[i];
    if (e > 10) {
      res.push(e * 2);
    }
  }
  return res;
}
```

**优化后：**

```javascript
function processArray(inputArray) {
  let results = [];
  for (let index = 0; index < inputArray.length; index++) {
    let element = inputArray[index];
    if (element > 10) {
      results.push(element * 2);
    }
  }
  return results;
}
```

### 示例3：改进类和方法名

**优化前：**

```javascript
class Util {
  constructor(cfg) {
    this.cfg = cfg;
    this.d = new Date();
  }

  getV(k) {
    return this.cfg[k] || null;
  }

  setV(k, v) {
    this.cfg[k] = v;
  }
}
```

**优化后：**

```javascript
class ConfigurationUtility {
  constructor(configuration) {
    this.configuration = configuration;
    this.creationDate = new Date();
  }

  getValue(key) {
    return this.configuration[key] || null;
  }

  setValue(key, value) {
    this.configuration[key] = value;
  }
}
```

### 示例4：混淆代码恢复

**优化前：**

```javascript
function a(e,t){var n=[];var r=e.length;var i=0;for(;i<r;i+=t){if(i+t<r){n.push(e.substring(i,i+t))}else{n.push(e.substring(i,r))}}return n}
```

**优化后：**

```javascript
function splitStringIntoChunks(inputString, chunkSize) {
  var chunks = [];
  var stringLength = inputString.length;
  var currentPosition = 0;
  
  for (; currentPosition < stringLength; currentPosition += chunkSize) {
    if (currentPosition + chunkSize < stringLength) {
      chunks.push(inputString.substring(currentPosition, currentPosition + chunkSize));
    } else {
      chunks.push(inputString.substring(currentPosition, stringLength));
    }
  }
  
  return chunks;
}
```

## 最佳实践与限制

### node-llama-cpp建议

1. 模型下载建议使用小模型,除非你显存足够大,否则不要下载大模型
2. 需要自己提前配置好cuda环境，否则会用cpu跑模型，速度会变慢
3. 因为这个库是基于llama-cpp开发，llama-cpp的更新频率较高,所以建议根据官方文档，自行编译新版node-llama-cpp
4. 显卡建议至少3060/4060以上，显存8g起，不然可能会很吃力
5. node版本必须大于20.0.0

### 最佳实践

1. **逐步应用**: 对于大型项目，建议按模块逐步应用重命名
2. **代码审查**: 机器生成的命名建议应经过人工审查
3. **结合测试**: 重命名后应运行完整的测试套件，确保功能正常
4. **版本控制**: 使用Git等版本控制系统，便于比较和回滚更改

### 当前限制以及需要优化的点

1. 工具目前仅支持JavaScript和TypeScript
2. 对于特定领域的专业术语，通用LLM可能无法提供最佳命名
3. 极其复杂的代码结构可能导致上下文不足，影响命名质量
4. 本地模型对硬件有一定要求，特别是启用GPU加速时
5. 当文件过大时，可能会导致内存溢出以及速度变慢
6. 任务执行逻辑还待优化，目前是串行执行，效率较低

## 未来规划

1. 支持更多编程语言（Python、Java等）
2. 添加自定义命名规则和风格配置
3. 提供可视化界面和IDE插件
4. 支持批量处理和目录递归处理
5. 集成更多专业领域的语言模型

## 结语

AST智能变量重命名工具代表了AI辅助编程的一个具体应用方向。它不仅能提高现有代码的质量，更能帮助开发者培养良好的命名习惯。随着AI技术的不断发展，我们期待这类工具能进一步提升软件开发的效率和质量。

---
