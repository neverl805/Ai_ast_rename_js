/**
 * 文件处理模块
 * 处理代码文件并协调整个重命名流程
 */

import {RenameOptions} from './types.js';
import {preprocess} from './preprocessor.js';
import {visitAllIdentifiers, Visitor} from '../ast/visitAllIdentifiers.js';
import {createModel} from '../models/modelFactory.js';
import {logVerbose} from './logger.js';

/**
 * 处理单个代码文件
 * 
 * @param code JavaScript代码
 * @param options 处理选项
 * @returns 处理后的代码
 */
export async function processCodeFile(code: string, options: RenameOptions): Promise<string> {
  try {
    // 1. 记录开始时间
    const startTime = Date.now();
    logVerbose('开始处理代码', options.verbose);
    
    // 2. 预处理代码（如删除注释、简单的代码转换）
    const preprocessedCode = await preprocess(code);
    logVerbose('预处理完成', options.verbose);
    
    // 3. 创建LLM模型实例
    const model = createModel(options.modelType, options.modelConfig);
    logVerbose('模型初始化完成', options.verbose);
    
    // 4. 创建访问者函数，用于获取重命名建议
    const visitor: Visitor = async (name, context) => {
      // 对于以下模式的变量/函数，我们可以跳过处理
      // if (name.startsWith('_') || // 以下划线开头的私有变量
      //     name === 'i' || name === 'j' || name === 'k' || // 常见循环变量
      //     name.length > 10 || // 长名称可能已经有意义
      //     /^[A-Z][A-Z0-9_]+$/.test(name)) { // 常量（全大写）
      //   return name;
      // }
      
      try {
        // 根据名称长度选择合适的处理方法
        if (name.length <= 2 || /^[a-z]$/i.test(name)) {
          // 单个字母或非常短的名称更可能需要重命名
          return await model.suggestVariableName(name, context);
        } else {
          // 检查上下文中是否包含function关键字，决定使用哪种建议方法
          if (context.includes(`function ${name}`) || 
              context.includes(`class ${name}`) || 
              context.includes(`${name} = function`)) {
            return await model.suggestFunctionName(name, context);
          } else {
            return await model.suggestVariableName(name, context);
          }
        }
      } catch (error) {
        logVerbose(`处理 ${name} 时出错: ${error}`, options.verbose);
        return name; // 出错时保留原名
      }
    };
    
    // 5. 使用visitAllIdentifiers遍历所有标识符并应用重命名
    const renamedCode = await visitAllIdentifiers(
      preprocessedCode,
      visitor,
      options.contextWindowSize,
      options.onProgress
    );
    
    // 6. 记录完成时间
    const endTime = Date.now();
    logVerbose(`处理完成，耗时 ${(endTime - startTime) / 1000} 秒`, options.verbose);
    
    return renamedCode;
  } catch (error) {
    console.error('处理代码时发生错误:', error);
    throw error;
  }
} 