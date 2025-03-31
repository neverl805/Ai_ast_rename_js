/**
 * AST-Rename-Core
 * 
 * 一个基于AST和大型语言模型的JavaScript代码变量重命名工具
 * 用于改进代码可读性和可维护性
 */

import { processCodeFile } from './utils/fileProcessor.js';
import { RenameOptions, LLMModel } from './utils/types.js';

/**
 * 处理JavaScript代码，使用LLM优化变量和函数名
 * 
 * @param code 要处理的JavaScript代码
 * @param options 处理选项
 * @param existingModel 可选的现有模型实例，如果提供则会复用
 * @returns 处理后的代码
 */
export async function optimizeCode(
  code: string, 
  options: RenameOptions, 
  existingModel?: LLMModel
): Promise<string> {
  // 安全检查
  if (!code || typeof code !== 'string') {
    throw new Error('代码必须是非空字符串');
  }
  
  return await processCodeFile(code, options, existingModel);
}

// 导出公共API
export * from './utils/types.js';
export * from './models/modelFactory.js'; 