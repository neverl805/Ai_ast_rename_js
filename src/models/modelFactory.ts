/**
 * 模型工厂模块
 * 负责创建不同类型的LLM模型实例
 */

import { LLMModel, ModelType, OpenAIConfig, LocalModelConfig } from '../utils/types.js';
import { LocalModel } from './localModel.js';

/**
 * 创建LLM模型实例
 * 
 * @param modelType 模型类型
 * @param config 模型配置
 * @returns LLM模型实例
 */
export function createModel(
  modelType: ModelType, 
  config: OpenAIConfig | LocalModelConfig
): LLMModel {
  switch (modelType) {
    
    case ModelType.LOCAL:
      return new LocalModel(config as LocalModelConfig);
    
    default:
      throw new Error(`不支持的模型类型: ${modelType}`);
  }
} 
