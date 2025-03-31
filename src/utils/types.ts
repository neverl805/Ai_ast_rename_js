/**
 * 核心类型定义
 */

/**
 * 模型类型
 */
export enum ModelType {
  OPENAI = "openai", 
  LOCAL = "local"
}

/**
 * 大语言模型接口
 */
export interface LLMModel {
  [x: string]: any;
  /**
   * 分析变量名并提供更好的命名建议
   */
  suggestVariableName(name: string, context: string): Promise<string>;
  /**
   * 分析函数并提供更好的命名建议
   */
  suggestFunctionName(name: string, context: string): Promise<string>;
}

/**
 * OpenAI模型配置
 */
export interface OpenAIConfig {
  apiKey: string;
  model: string;
  baseURL?: string;
}

/**
 * 本地模型配置
 */
export interface LocalModelConfig {
  modelPath: string;
  useGPU?: boolean;
}

/**
 * 重命名操作的配置选项
 */
export interface RenameOptions {
  /**
   * 模型类型
   */
  modelType: ModelType;
  
  /**
   * 模型配置
   */
  modelConfig: OpenAIConfig | LocalModelConfig;
  
  /**
   * 上下文窗口大小
   */
  contextWindowSize: number;
  
  /**
   * 是否启用详细日志
   */
  verbose?: boolean;
  
  /**
   * 进度回调函数
   */
  onProgress?: (progress: number) => void;
}

/**
 * 标识符类型
 */
export enum IdentifierType {
  VARIABLE,
  FUNCTION,
  PARAMETER,
  CLASS
}

/**
 * 标识符信息
 */
export interface IdentifierInfo {
  name: string;
  type: IdentifierType;
  context: string;
  location: {
    start: number;
    end: number;
  };
} 