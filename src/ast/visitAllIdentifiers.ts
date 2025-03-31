/**
 * 标识符遍历模块
 * 从AST中遍历所有标识符，并应用重命名
 * 
 * 从原始humanify项目移植而来
 */

import { parseAsync, transformFromAstAsync, NodePath } from '@babel/core';
import _traverse from '@babel/traverse';
import { Identifier, toIdentifier, Node } from '@babel/types';
import { logVerbose } from '../utils/logger.js';

// 处理@babel/traverse模块导入兼容性
// @ts-ignore
const traverse = _traverse.default || _traverse;

// 访问者函数类型，接受标识符名称和上下文，返回新名称的Promise
export type Visitor = (name: string, scope: string) => Promise<string>;

/**
 * 遍历所有标识符并应用重命名
 * 
 * @param code 原始代码
 * @param visitor 访问者函数，用于获取标识符的新名称
 * @param contextWindowSize 上下文窗口大小
 * @param onProgress 进度回调函数
 * @returns 重命名后的代码
 */
export async function visitAllIdentifiers(
  code: string,
  visitor: Visitor,
  contextWindowSize: number,
  onProgress?: (percentageDone: number) => void
): Promise<string> {
  // 解析代码为AST
  const ast = await parseAsync(code, { 
    sourceType: 'unambiguous',
    filename: 'file.tsx',
    presets: [
      '@babel/preset-env',
      '@babel/preset-typescript',
      '@babel/preset-react'
    ]
  });
  
  // 用于存储已重命名的标识符和已访问的标识符
  const renames = new Set<string>();
  const visited = new Set<string>();

  if (!ast) {
    throw new Error('代码解析失败');
  }

  // 找到所有作用域
  const scopes = findScopes(ast);
  const numRenamesExpected = scopes.length;
  
  logVerbose(`找到 ${numRenamesExpected} 个可能的重命名候选项`);

  // 遍历每个作用域
  for (const smallestScope of scopes) {
    // 跳过已访问过的标识符
    if (hasVisited(smallestScope, visited)) continue;

    const smallestScopeNode = smallestScope.node;
    if (smallestScopeNode.type !== 'Identifier') {
      throw new Error('未找到标识符');
    }
    
    // 获取标识符周围的代码上下文
    const surroundingCode = getContextCode(
      smallestScope,
      contextWindowSize
    );
    
    // 调用访问者函数获取新名称
    const renamed = await visitor(smallestScopeNode.name, surroundingCode);
    
    // 如果建议的名称与原名称不同，则应用重命名
    if (renamed !== smallestScopeNode.name) {
      // 确保新名称是有效的标识符，并处理命名冲突
      let safeRenamed = toIdentifier(renamed);
      while (
        renames.has(safeRenamed) ||
        smallestScope.scope.hasBinding(safeRenamed)
      ) {
        safeRenamed = `_${safeRenamed}`;
      }
      renames.add(safeRenamed);

      // 在AST中执行重命名
      smallestScope.scope.rename(smallestScopeNode.name, safeRenamed);
      
      logVerbose(`已重命名: ${smallestScopeNode.name} -> ${safeRenamed}`);
    }
    
    // 标记为已访问
    markVisited(smallestScope, smallestScopeNode.name, visited);

    // 更新进度
    if (onProgress) {
      onProgress(visited.size / numRenamesExpected);
    }
  }
  
  // 完成所有处理后报告100%进度
  if (onProgress) {
    onProgress(1);
  }

  // 将AST转换回代码
  const stringified = await transformFromAstAsync(ast, code, {
    filename: 'file.tsx', // 指定文件名，使Babel能够识别文件类型
  });
  if (stringified?.code == null) {
    throw new Error('代码生成失败');
  }
  
  return stringified.code;
}

/**
 * 在AST中找到所有作用域
 */
function findScopes(ast: Node): NodePath<Identifier>[] {
  const scopes: [nodePath: NodePath<Identifier>, scopeSize: number][] = [];
  
  traverse(ast, {
    BindingIdentifier(path: NodePath<Identifier>) {
      const bindingBlock = closestSurroundingContextPath(path).scope.block;
      const pathSize = (bindingBlock.end || 0) - (bindingBlock.start || 0);

      scopes.push([path, pathSize]);
    }
  });

  // 按作用域大小排序，从大到小
  scopes.sort((a, b) => b[1] - a[1]);

  return scopes.map(([nodePath]) => nodePath);
}

/**
 * 检查标识符是否已被访问
 */
function hasVisited(path: NodePath<Identifier>, visited: Set<string>): boolean {
  return visited.has(path.node.name);
}

/**
 * 将标识符标记为已访问
 */
function markVisited(
  path: NodePath<Identifier>,
  newName: string,
  visited: Set<string>
): void {
  visited.add(newName);
}

/**
 * 获取标识符周围的代码上下文
 */
function getContextCode(
  path: NodePath<Identifier>,
  contextWindowSize: number
): string {
  const surroundingPath = closestSurroundingContextPath(path);
  const code = `${surroundingPath}`; // 利用toString()获取代码
  
  if (code.length < contextWindowSize) {
    return code;
  }
  
  if (surroundingPath.isProgram()) {
    const start = path.node.start ?? 0;
    const end = path.node.end ?? code.length;
    
    // 根据标识符位置计算合适的上下文窗口
    if (end < contextWindowSize / 2) {
      return code.slice(0, contextWindowSize);
    }
    if (start > code.length - contextWindowSize / 2) {
      return code.slice(-contextWindowSize);
    }

    return code.slice(
      Math.max(0, start - contextWindowSize / 2),
      Math.min(code.length, end + contextWindowSize / 2)
    );
  } else {
    return code.slice(0, contextWindowSize);
  }
}

/**
 * 找到最近的包含上下文的路径
 */
function closestSurroundingContextPath(
  path: NodePath<Identifier>
): NodePath<Node> {
  const programOrBindingNode = path.findParent(
    (p: NodePath) => p.isProgram() || path.node.name in p.getOuterBindingIdentifiers()
  )?.scope.path;
  
  return programOrBindingNode ?? path.scope.path;
} 