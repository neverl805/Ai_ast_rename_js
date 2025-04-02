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
        // const model = createModel(options.modelType, options.modelConfig);
        // logVerbose('模型初始化完成', options.verbose);

        // 4. 创建访问者函数，用于获取重命名建议
        const visitor: Visitor = async (name, context) => {
            // 对于以下模式的变量/函数，我们直接保留原名
            if (name.length > 10 || // 长名称可能已经有意义
                // /^[A-Z][A-Z0-9_]+$/.test(name) || // 常量（全大写）
                (name.includes('_') && isMeaningfulName(name))) { // 已经是可能有意义的蛇形命名
              return name;
            }

            console.log(name)
            console.log(context)
            return name;

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

        /**
         * 简单判断变量名是否可能有意义
         * 检查是否包含常见的有意义单词模式
         */
        function isMeaningfulName(name: string): boolean {
            // 常见有意义的前缀
            const meaningfulPrefixes = ['get_', 'set_', 'is_', 'has_', 'can_', 'should_', 'will_', 'do_', 'fetch_', 'create_', 'update_', 
                                        'delete_', 'remove_', 'add_', 'find_', 'calc_', 'compute_', 'handle_', 'process_'];
            // 常见有意义的单词
            const meaningfulWords = ['data', 'user', 'item', 'element', 'list', 'array', 'map', 'object', 'value', 'key', 
                                     'count', 'index', 'name', 'id', 'type', 'size', 'length', 'config', 'option', 'param',
                                     'callback', 'event', 'handler', 'listener', 'controller', 'view', 'model', 'service'];
            
            // 检查是否包含这些有意义的前缀
            const hasPrefix = meaningfulPrefixes.some(prefix => name.toLowerCase().startsWith(prefix));
            if (hasPrefix) return true;
            
            // 对于蛇形命名法，拆分单词后检查每个部分
            if (name.includes('_')) {
                const parts = name.split('_');
                // 检查是否每个部分都有意义
                const meaningfulParts = parts.filter(part => 
                    meaningfulWords.some(word => part.toLowerCase() === word || 
                                               (part.length > 3 && word.startsWith(part.toLowerCase())))
                );
                return meaningfulParts.length >= Math.ceil(parts.length / 2); // 如果超过一半的部分有意义，则认为整体有意义
            }
            
            // 简单检查是否包含有意义的单词
            return meaningfulWords.some(word => name.toLowerCase().includes(word));
        }

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

        if (model.modelInitialized) {
            logVerbose('模型资源已释放', options.verbose)
            model.model.dispose();
            model.llamaInstance.dispose();
            model.context.dispose();
        }


        return renamedCode;
    } catch (error) {
        console.error('处理代码时发生错误:', error);
        throw error;
    }
} 
