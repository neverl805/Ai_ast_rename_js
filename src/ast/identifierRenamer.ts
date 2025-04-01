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
      
      // 检查模型提供的建议是否真的比原名更好
      // 如果原始名称已经足够长并且可能有意义，避免进行不必要的更改
      if (isLikelyMeaningful(identifier.name) && 
          !isSignificantlyBetter(identifier.name, finalName)) {
        continue;
      }
      
      // 确保最终名称遵循蛇形命名法
      finalName = ensureSnakeCase(finalName);
      
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

/**
 * 确保名称遵循蛇形命名法（Snake Case）
 * 
 * @param name 候选标识符名称
 * @returns 蛇形命名法格式的名称
 */
function ensureSnakeCase(name: string): string {
  // 如果名称包含连字符，转换为下划线
  if (name.includes('-')) {
    name = name.replace(/-/g, '_');
  }
  
  // 如果名称是驼峰命名法，转换为蛇形命名法
  if (/[A-Z]/.test(name)) {
    name = name.replace(/([A-Z])/g, '_$1').toLowerCase();
    
    // 移除开头的下划线（如果有）
    if (name.startsWith('_') && !/^_[a-z]/.test(name)) {
      name = name.substring(1);
    }
    
    // 处理可能的多余下划线
    name = name.replace(/__/g, '_');
  }
  
  // 确保全部小写
  name = name.toLowerCase();
  
  // 确保单词数量不超过3个
  return shortenNameIfNeeded(name);
}

/**
 * 判断原始名称是否可能已经有意义
 * 
 * @param name 原始名称
 * @returns 是否可能有意义
 */
function isLikelyMeaningful(name: string): boolean {
  // 排除单字母变量和常见的无意义变量名
  if (name.length <= 1 || ['a', 'b', 'c', 'x', 'y', 'z', 'tmp', 'temp', 'foo', 'bar'].includes(name)) {
    return false;
  }
  
  // 检查是否已经是蛇形命名法并且长度合适
  if (name.includes('_') && name.length >= 4) {
    return true;
  }
  
  // 检查是否包含常见的有意义单词
  const meaningfulWords = ['get', 'set', 'is', 'has', 'data', 'user', 'item', 'count', 'index', 'list'];
  for (const word of meaningfulWords) {
    if (name.toLowerCase().includes(word)) {
      return true;
    }
  }
  
  return false;
}

/**
 * 判断新名称是否显著优于原名称
 * 
 * @param originalName 原始名称
 * @param newName 新名称
 * @returns 是否显著更好
 */
function isSignificantlyBetter(originalName: string, newName: string): boolean {
  // 如果新名称比原名称长很多，可能更具描述性
  if (newName.length > originalName.length * 1.5 && newName.length >= 5) {
    return true;
  }
  
  // 如果原名称是缩写，而新名称是完整单词，则新名称更好
  if (originalName.length < 4 && newName.length >= 4) {
    return true;
  }
  
  // 检查单词数量限制（不超过3个单词）
  const newWordCount = (newName.match(/_/g) || []).length + 1;
  if (newWordCount > 3) {
    // 如果超过3个单词，不认为是更好的名称
    return false;
  }
  
  // 如果新名称包含更多的单词（通过下划线计数），可能更具描述性
  const originalWordCount = (originalName.match(/_/g) || []).length + 1;
  if (newWordCount > originalWordCount && newWordCount <= 3) {
    return true;
  }
  
  return false;
}

/**
 * 检查并缩短变量名以确保符合最大单词数限制
 * 不在当前代码中使用，但保留为未来可能的扩展
 * 
 * @param name 原始名称
 * @returns 优化后的名称
 */
function shortenNameIfNeeded(name: string): string {
  const parts = name.split('_');
  
  // 如果单词数量不超过3个，无需缩短
  if (parts.length <= 3) {
    return name;
  }
  
  // 常见单词的缩写映射
  const abbreviations: Record<string, string> = {
    'configuration': 'cfg',
    'config': 'cfg',
    'number': 'num',
    'index': 'idx',
    'count': 'cnt',
    'element': 'elem',
    'parameter': 'param',
    'parameters': 'params',
    'function': 'func',
    'calculate': 'calc',
    'initialize': 'init',
    'initialization': 'init',
    'authentication': 'auth',
    'request': 'req',
    'response': 'resp',
    'message': 'msg',
    'document': 'doc',
    'database': 'db',
    'information': 'info',
    'statistics': 'stats',
    'application': 'app',
    'directory': 'dir',
    'temporary': 'temp',
    'object': 'obj',
    'array': 'arr',
    'string': 'str',
    'boolean': 'bool',
    'value': 'val'
  };
  
  // 尝试缩写较长的单词
  const shortenedParts = parts.map(part => {
    // 检查是否有对应的缩写
    if (abbreviations[part.toLowerCase()]) {
      return abbreviations[part.toLowerCase()];
    }
    
    // 对于长单词，如果没有预定义的缩写，根据长度进行简单缩写
    if (part.length > 6) {
      // 保留单词前3-4个字符作为缩写
      return part.substring(0, Math.min(4, Math.ceil(part.length / 2)));
    }
    
    return part;
  });
  
  // 如果缩写后仍然超过3个单词，只保留前3个
  if (shortenedParts.length > 3) {
    return shortenedParts.slice(0, 3).join('_');
  }
  
  return shortenedParts.join('_');
} 