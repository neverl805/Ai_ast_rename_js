/**
 * 标识符重命名模块
 * 使用LLM建议重命名代码中的标识符
 */

import { parse } from '@babel/parser';
import _traverse from '@babel/traverse';
import { transformFromAstSync } from '@babel/core';
import { Identifier } from '@babel/types';
import { IdentifierInfo, IdentifierType, LLMModel } from '../utils/types.js';
import { logVerbose, logWarning } from '../utils/logger.js';

// 处理@babel/traverse模块导入兼容性
// @ts-ignore
const traverse = _traverse.default || _traverse;

/**
 * 根据LLM建议重命名代码中的标识符
 * 
 * @param code 原始代码
 * @param identifiers 需要重命名的标识符信息
 * @param model LLM模型实例
 * @param onProgress 进度回调函数
 * @returns 重命名后的代码
 */
export async function renameIdentifiers(
  code: string,
  identifiers: IdentifierInfo[],
  model: LLMModel,
  onProgress?: (progress: number) => void
): Promise<string> {
  // 解析代码为AST
  const ast = parse(code, {
    sourceType: 'unambiguous',
    // @ts-ignore - babel-parser类型定义缺少presets属性
    filename: 'file.tsx', // 指定文件名，使Babel能够识别文件类型
    presets: [
      '@babel/preset-env',
      '@babel/preset-typescript',
      '@babel/preset-react'
    ]
  });
  
  // 保存重命名映射关系 (原始名称 -> 新名称)
  const renameMap = new Map<string, string>();
  
  // 收集已使用的名称，避免命名冲突
  const usedNames = new Set<string>();
  
  // 按顺序处理每个标识符
  for (let i = 0; i < identifiers.length; i++) {
    const identifier = identifiers[i];
    
    // 跳过已处理的标识符
    if (renameMap.has(identifier.name)) {
      continue;
    }
    
    try {
      // 根据标识符类型选择适当的命名建议方法
      let suggestedName: string;
      
      if (identifier.type === IdentifierType.FUNCTION || identifier.type === IdentifierType.CLASS) {
        suggestedName = await model.suggestFunctionName(identifier.name, identifier.context);
      } else {
        suggestedName = await model.suggestVariableName(identifier.name, identifier.context);
      }
      
      // 确保建议的名称是有效的JS标识符
      suggestedName = ensureValidIdentifier(suggestedName);
      
      // 处理命名冲突
      let finalName = suggestedName;
      let counter = 1;
      
      while (usedNames.has(finalName)) {
        finalName = `${suggestedName}${counter}`;
        counter++;
      }
      
      // 如果模型没有提供有意义的改变，则保留原名
      if (finalName === identifier.name || finalName.length <= 1) {
        continue;
      }
      
      // 保存重命名映射关系
      renameMap.set(identifier.name, finalName);
      usedNames.add(finalName);
      
      logVerbose(`重命名: ${identifier.name} -> ${finalName}`);
    } catch (error) {
      logWarning(`处理标识符 "${identifier.name}" 时发生错误，保留原名: ${error}`);
    }
    
    // 更新进度
    if (onProgress) {
      onProgress((i + 1) / identifiers.length);
    }
  }
  
  // 应用重命名到AST
  traverse(ast, {
    Identifier(path) {
      const name = path.node.name;
      
      // 检查是否需要重命名
      if (renameMap.has(name)) {
        // 避免修改导入的标识符或属性访问
        if (path.parent.type === 'ImportSpecifier' ||
            path.parent.type === 'ImportDefaultSpecifier' ||
            path.parent.type === 'ImportNamespaceSpecifier' ||
            (path.parent.type === 'MemberExpression' && path.parent.property === path.node && !path.parent.computed)) {
          return;
        }
        
        // 更新节点名称
        path.node.name = renameMap.get(name) as string;
      }
    }
  });
  
  // 将AST转换回代码
  const result = transformFromAstSync(ast, code, {
    filename: 'file.tsx', // 指定文件名，使Babel能够识别文件类型
    retainLines: true,
    compact: false,
  });
  
  return result?.code || code;
}

/**
 * 确保名称是有效的JavaScript标识符
 * 
 * @param name 候选标识符名称
 * @returns 有效的标识符名称
 */
function ensureValidIdentifier(name: string): string {
  // 移除非法字符
  name = name.trim().replace(/[^\w$]/g, '');
  
  // 确保不以数字开头
  if (/^\d/.test(name)) {
    name = '_' + name;
  }
  
  // 如果经处理后为空，使用默认值
  if (!name) {
    name = '_identifier';
  }
  
  return name;
} 