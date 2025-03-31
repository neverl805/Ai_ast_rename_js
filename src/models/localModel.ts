/**
 * 本地LLM模型实现
 * 使用本地加载的语言模型进行分析
 *
 * 注意：此实现是一个简化版，实际生产中需要集成具体的本地LLM库，如llama.cpp的Node.js绑定
 */
import {LLMModel, LocalModelConfig} from '../utils/types.js';
import {logVerbose, logWarning} from '../utils/logger.js';
import path from 'path';
import os from 'os';
import fs from 'fs';

// 类型定义
type GetLlamaFunc = (options: { gpu: boolean | string }) => Promise<any>;

// 在实际应用中，需要安装这些依赖项
// 注意：可能需要通过npm安装：npm install node-llama-cpp
let getLlama: GetLlamaFunc | undefined;
let LlamaChatSession: any;
let LlamaGrammar: any;

try {
    // 动态导入，这样如果不使用本地模型，不会报错
    const llamaCpp = await import('node-llama-cpp');
    getLlama = llamaCpp.getLlama as GetLlamaFunc;
    LlamaChatSession = llamaCpp.LlamaChatSession;
    LlamaGrammar = llamaCpp.LlamaGrammar;
} catch (error) {
    logWarning('未安装node-llama-cpp库，无法使用本地模型。如需使用本地模型，请先安装: npm install node-llama-cpp');
}

// 模型存放路径
const MODEL_DIRECTORY = path.join(os.homedir(), '.ast-rename-core', 'models');

// 创建模型目录
function ensureModelDirectory() {
    if (!fs.existsSync(MODEL_DIRECTORY)) {
        fs.mkdirSync(MODEL_DIRECTORY, {recursive: true});
    }
}

/**
 * GBNF语法类，用于限制LLM输出的格式
 */
class Gbnf {
    rule: string;
    genStart: number;
    genEnd?: number;

    constructor(rule: string, genStart: number, genEnd?: number) {
        this.rule = rule;
        this.genStart = genStart;
        this.genEnd = genEnd;
    }

    toString() {
        return this.rule;
    }

    parseResult(result: string) {
        return result.slice(this.genStart, this.genEnd);
    }
}

/**
 * 创建GBNF格式的语法规则
 */
function gbnf(
    strings: TemplateStringsArray,
    ...values: (string | RegExp)[]
) {
    const numRegexes = values.filter((value) => value instanceof RegExp).length;
    if (numRegexes > 1) {
        throw new Error("只支持每条规则一个变量");
    }

    let rule = "root ::=";
    for (let i = 0; i < strings.length; i++) {
        rule += ` "${strings[i].replaceAll('"', '\\"')}"`;

        const value = values[i];
        if (value instanceof RegExp) {
            rule += ` ` + value.source;
        } else if (typeof value == "string") {
            rule += ` "${value.replaceAll('"', '\\"')}"`;
        }
    }

    if (numRegexes === 0) {
        return new Gbnf(rule, 0, undefined);
    }

    let startVar = 0;
    let endVar = 0;
    let isPastRegex = false;
    for (let i = 0; i < strings.length; i++) {
        if (isPastRegex) {
            endVar -= strings[i].length;
        } else {
            startVar += strings[i].length;
        }

        const value = values[i];
        if (value instanceof RegExp) {
            isPastRegex = true;
        } else if (typeof value == "string") {
            if (isPastRegex) {
                endVar -= value.length;
            } else {
                startVar += value.length;
            }
        }
    }

    return new Gbnf(rule, startVar, endVar);
}

/**
 * 本地LLM模型实现类
 */
export class LocalModel implements LLMModel {
    private modelPath: string;
    private useGPU: boolean;
    private llamaInstance: any;
    private model: any;
    private context: any;
    private modelInitialized: boolean = false;
    private modelInitializing: boolean = false;
    private initPromise: Promise<void> | null = null;
    private gpuFailed: boolean = false;  // 跟踪GPU是否失败

    /**
     * 创建本地模型实例
     *
     * @param config 本地模型配置
     */
    constructor(config: LocalModelConfig) {
        this.modelPath = config.modelPath;
        this.useGPU = config.useGPU || false;

        logVerbose(`初始化本地模型: ${this.modelPath}, GPU: ${this.useGPU}`);

        // 确保模型目录存在
        ensureModelDirectory();

        // 检查模型文件是否存在
        if (!fs.existsSync(this.modelPath)) {
            logWarning(`模型文件 ${this.modelPath} 不存在，请检查路径是否正确`);
        }

        // 非阻塞地开始初始化模型
        this.startInitialization();
    }

    /**
     * 开始异步初始化模型
     */
    private startInitialization(): void {
        if (!this.modelInitialized && !this.modelInitializing) {
            this.modelInitializing = true;
            this.initPromise = this.initializeModel().catch(error => {
                logWarning(`模型初始化失败: ${error}`);
                this.modelInitializing = false;
            });
        }
    }

    /**
     * 初始化模型
     * 实际加载模型的逻辑
     */
    private async initializeModel(): Promise<void> {
        // 如果模型已经初始化或正在初始化中，则无需重复操作
        if (this.modelInitialized || (this.modelInitializing && this.initPromise)) {
            if (this.initPromise) {
                await this.initPromise;  // 等待现有的初始化完成
            }
            return;
        }

        try {
            if (!getLlama) {
                throw new Error('未安装node-llama-cpp库');
            }

            // 初始化llama实例，先尝试使用GPU（如果启用）
            let useGpuOption = this.useGPU && !this.gpuFailed ? "auto" : false;

            try {
                this.llamaInstance = await getLlama({gpu: useGpuOption});
            } catch (error) {
                // 捕获可能的CUDA初始化错误
                if (this.useGPU && !this.gpuFailed) {
                    logWarning(`GPU初始化失败，错误: ${error}。将回退到CPU模式`);
                    this.gpuFailed = true;  // 标记GPU失败

                    // 重试，但使用CPU模式
                    this.llamaInstance = await getLlama({gpu: false});
                } else {
                    // 如果不是使用GPU错误或者已经尝试过回退，则抛出
                    throw error;
                }
            }

            // 加载模型，根据GPU状态决定是否使用GPU层
            try {
                this.model = await this.llamaInstance.loadModel({
                    modelPath: this.modelPath,
                    gpuLayers: this.useGPU && !this.gpuFailed ? undefined : 0
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
                        gpuLayers: 0  // 显式设置为0，使用CPU
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
            this.modelInitialized = true;
        } catch (error) {
            this.modelInitializing = false;
            logWarning(`初始化模型时出错: ${error}`);
            throw new Error(`初始化模型失败: ${error}`);
        } finally {
            this.modelInitializing = false;
        }
    }

    /**
     * 使用本地LLM提供推理
     */
    private async prompt(systemPrompt: string, userPrompt: string, responseGrammar: Gbnf): Promise<string> {
        // 确保模型已初始化
        if (!this.modelInitialized) {
            await this.initializeModel();
        }

        // 如果初始化失败，则使用后备方法
        if (!this.modelInitialized) {
            return this.fallbackSuggestName(userPrompt, systemPrompt);
        }

        try {
            if (!LlamaChatSession || !LlamaGrammar) {
                throw new Error('LlamaChatSession或LlamaGrammar未定义');
            }

            const session = new LlamaChatSession({
                contextSequence: this.context.getSequence(),
                autoDisposeSequence: true,
                systemPrompt,
            });

            const response = await session.promptWithMeta(userPrompt, {
                temperature: 0.8,
                grammar: new LlamaGrammar(this.llamaInstance, {
                    grammar: `${responseGrammar}`
                }),
                stopOnAbortSignal: true
            });

            session.dispose();
            return responseGrammar.parseResult(response.responseText);
        } catch (error) {
            logWarning(`模型推理时出错: ${error}`);

            // 检查是否是CUDA错误
            const errorStr = String(error);
            if (
                this.useGPU &&
                !this.gpuFailed &&
                (errorStr.includes('CUDA error') || errorStr.includes('GPU') || errorStr.includes('cuda'))
            ) {
                logWarning('检测到CUDA错误，将重新初始化为CPU模式');
                this.gpuFailed = true;
                this.modelInitialized = false;

                // 尝试重新初始化模型并重试一次
                try {
                    await this.initializeModel();
                    return this.prompt(systemPrompt, userPrompt, responseGrammar);
                } catch (reinitError) {
                    logWarning(`重新初始化模型失败: ${reinitError}`);
                }
            }

            // 失败时返回一个合理的默认值
            return this.fallbackSuggestName(userPrompt, systemPrompt);
        }
    }

    /**
     * 分析变量名并提供更好的命名建议
     *
     * @param name 原始变量名
     * @param context 代码上下文
     * @returns 建议的变量名
     */
    async suggestVariableName(name: string, context: string): Promise<string> {
        logVerbose(`分析变量 ${name}`);

        try {
            // 直接请求模型提供一个好的变量名，单次推理完成
            const result = await this.prompt(
                `You are a coding assistant that helps improve code readability by suggesting better variable names.`,
                `I have a variable named '${name}' in the following JavaScript/TypeScript code context:
        
                ${context}
                
                Analyze what this variable does based on its usage, and suggest a descriptive and meaningful name for it. 
                The name should follow these guidelines:
                - Use camelCase
                - Be descriptive but concise
                - Avoid abbreviations unless they're very common
                - Use common naming conventions for specific types (e.g., 'count' for counters, 'is/has' for booleans)`,
                gbnf`A good name for this variable would be '${/[a-zA-Z][a-zA-Z0-9_]*/}'`
            );

            logVerbose(`变量 ${name} 建议重命名为: ${result}`);

            return result;
        } catch (error) {
            logWarning(`分析变量 ${name} 时出错: ${error}`);

            // 如果出错，使用简单的启发式方法
            return this.fallbackSuggestName(name, context);
        }
    }

    /**
     * 分析函数并提供更好的命名建议
     *
     * @param name 原始函数名
     * @param context 代码上下文
     * @returns 建议的函数名
     */
    async suggestFunctionName(name: string, context: string): Promise<string> {
        logVerbose(`分析函数 ${name}`);

        try {
            // 直接请求模型提供一个好的函数名，单次推理完成
            const result = await this.prompt(
                `You are a coding assistant that helps improve code readability by suggesting better function names.`,
                `I have a function named '${name}' in the following JavaScript/TypeScript code context:
        
                ${context}
                
                Analyze what this function does, and suggest a descriptive and meaningful name for it.
                The name should follow these guidelines:
                - Use camelCase
                - Start with a verb (e.g., get, fetch, calculate, process)
                - Be descriptive but concise
                - Follow the "verb + noun" pattern where appropriate
                - Reflect the function's primary purpose`,
                gbnf`A good name for this function would be '${/[a-zA-Z][a-zA-Z0-9_]*/}'`
            );

            logVerbose(`函数 ${name} 建议重命名为: ${result}`);

            return result;
        } catch (error) {
            logWarning(`分析函数 ${name} 时出错: ${error}`);

            // 如果出错，使用简单的启发式方法
            return this.fallbackSuggestName(name, context);
        }
    }

    /**
     * 当LLM分析失败时的后备方案
     */
    private fallbackSuggestName(name: string, context: string): string {
        // 对于单字母变量，使用启发式规则
        if (name.length === 1) {
            if (name === 'i' || name === 'j' || name === 'k') return 'index';
            if (name === 'n') return 'count';
            if (name === 'x' || name === 'y' || name === 'z') return 'position';
            if (name === 'e') return 'event';
            if (name === 'v') return 'value';
            if (name === 'f') return 'callback';
            if (name === 'p') return 'param';
            if (name === 's') return 'string';
            if (name === 'o') return 'object';
            if (name === 'a') return 'array';
            return 'value';
        }

        // 如果变量名已经足够长，可能不需要修改
        if (name.length >= 3) {
            return name;
        }

        // 检查上下文中的一些模式
        if (context.includes('for') && context.includes(`${name}++`)) return 'index';
        if (context.includes('length') && context.includes(name)) return 'size';
        if (context.includes('function') && context.includes(`return ${name}`)) return 'result';

        // 默认返回
        return name.length > 1 ? name : 'value';
    }
} 