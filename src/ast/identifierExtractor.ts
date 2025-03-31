/**
 * 标识符提取模块
 * 从AST中提取需要重命名的标识符
 */

import { parse } from '@babel/parser';
import _traverse from '@babel/traverse';
import { Identifier, Node } from '@babel/types';
import { NodePath } from '@babel/traverse';
import { IdentifierInfo, IdentifierType } from '../utils/types.js';

// 处理@babel/traverse模块导入兼容性
// @ts-ignore
const traverse = _traverse.default || _traverse;

/**
 * 从代码中提取标识符信息
 * 
 * @param code JavaScript代码
 * @param contextWindowSize 上下文窗口大小
 * @returns 提取的标识符信息数组
 */
export async function extractIdentifiers(
  code: string, 
  contextWindowSize: number
): Promise<IdentifierInfo[]> {
  // 解析代码为AST
  const ast = parse(code, {
    sourceType: 'unambiguous', // 自动检测模块类型
    // @ts-ignore - babel-parser类型定义缺少presets属性
    filename: 'file.tsx', // 指定文件名，使Babel能够识别文件类型
    presets: [
      '@babel/preset-env',
      '@babel/preset-typescript',
      '@babel/preset-react'
    ]
  });
  
  // 存储提取的标识符
  const identifiers: IdentifierInfo[] = [];
  // 已处理的标识符名称集合，避免重复
  const processedNames = new Set<string>();
  
  // 遍历AST
  traverse(ast, {
    // 处理函数声明
    FunctionDeclaration(path) {
      const name = path.node.id?.name;
      if (name && !processedNames.has(name)) {
        const context = getContext(path, code, contextWindowSize);
        
        identifiers.push({
          name,
          type: IdentifierType.FUNCTION,
          context,
          location: {
            start: path.node.start || 0,
            end: path.node.end || 0
          }
        });
        
        processedNames.add(name);
      }
    },
    
    // 处理变量声明
    VariableDeclarator(path) {
      if (path.node.id.type === 'Identifier') {
        const name = path.node.id.name;
        if (!processedNames.has(name)) {
          const context = getContext(path, code, contextWindowSize);
          
          identifiers.push({
            name,
            type: IdentifierType.VARIABLE,
            context,
            location: {
              start: path.node.start || 0,
              end: path.node.end || 0
            }
          });
          
          processedNames.add(name);
        }
      }
    },
    
    // 处理函数参数
    Function(path) {
      for (const param of path.node.params) {
        if (param.type === 'Identifier') {
          const name = param.name;
          if (!processedNames.has(name)) {
            const context = getContext(path, code, contextWindowSize);
            
            identifiers.push({
              name,
              type: IdentifierType.PARAMETER,
              context,
              location: {
                start: param.start || 0,
                end: param.end || 0
              }
            });
            
            processedNames.add(name);
          }
        }
      }
    },
    
    // 处理类声明
    ClassDeclaration(path) {
      const name = path.node.id?.name;
      if (name && !processedNames.has(name)) {
        const context = getContext(path, code, contextWindowSize);
        
        identifiers.push({
          name,
          type: IdentifierType.CLASS,
          context,
          location: {
            start: path.node.start || 0,
            end: path.node.end || 0
          }
        });
        
        processedNames.add(name);
      }
    }
  });
  
  return identifiers;
}

/**
 * 获取节点周围的代码上下文
 * 
 * @param path Babel节点路径
 * @param code 原始代码
 * @param contextSize 上下文窗口大小
 * @returns 提取的上下文代码
 */
function getContext(path: NodePath, code: string, contextSize: number): string {
  // 寻找最近的有意义上下文节点（函数、类、程序）
  const contextPath = path.findParent(p => 
    p.isFunction() || p.isClass() || p.isProgram()
  );
  
  if (!contextPath) {
    return path.toString();
  }
  
  const contextNode = contextPath.node;
  const start = contextNode.start || 0;
  const end = contextNode.end || code.length;
  
  // 提取上下文代码
  let context = code.slice(start, end);
  
  // 限制上下文大小
  if (context.length > contextSize) {
    // 如果当前节点的位置已知，尝试保留节点周围的代码
    const nodeStart = (path.node as Node).start || 0;
    const nodeEnd = (path.node as Node).end || 0;
    
    if (nodeStart >= start && nodeEnd <= end) {
      const nodePos = nodeStart - start;
      const halfContextSize = Math.floor(contextSize / 2);
      
      let contextStart = Math.max(0, nodePos - halfContextSize);
      let contextEnd = Math.min(context.length, nodePos + halfContextSize);
      
      // 确保上下文大小不超过限制
      if (contextEnd - contextStart > contextSize) {
        if (nodePos < context.length / 2) {
          contextEnd = contextStart + contextSize;
        } else {
          contextStart = contextEnd - contextSize;
        }
      }
      
      context = context.slice(contextStart, contextEnd);
    } else {
      // 如果无法确定节点位置，简单截取前部分内容
      context = context.slice(0, contextSize);
    }
  }
  
  return context;
} 