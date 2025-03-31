/**
 * 代码预处理模块
 * 处理代码以便于后续分析
 */

import { transformSync } from '@babel/core';
import * as t from '@babel/types';

/**
 * 预处理JavaScript代码
 * 执行一些基本的转换，使代码更易于分析
 * 
 * @param code 原始JavaScript代码
 * @returns 预处理后的代码
 */
export async function preprocess(code: string): Promise<string> {
  try {
    const result = transformSync(code, {
      filename: 'file.tsx',
      plugins: [
        // 将 void 0 转换为 undefined
        {
          visitor: {
            UnaryExpression(path) {
              if (
                path.node.operator === 'void' && 
                path.node.argument.type === 'NumericLiteral'
              ) {
                path.replaceWith(t.identifier('undefined'));
              }
            },
          },
        },
        
        // 翻转比较表达式以提高可读性 (如 1 < x 改为 x > 1)
        {
          visitor: {
            BinaryExpression(path) {
              const node = path.node;
              
              // 交换操作符左右两侧的操作数，确保常量在右侧 (如 3+x 转换为 x+3)
              const mappings: Record<string, any> = {
                '+': '+',
                '-': '-',
                '*': '*',
                '/': '/',
                '%': '%',
                '==': '==',
                '===': '==='
              };
              
              if (
                t.isLiteral(node.left) && 
                !t.isLiteral(node.right) && 
                mappings[node.operator]
              ) {
                // @ts-ignore - 类型错误，但实际函数可以正确运行
                path.replaceWith(t.binaryExpression(
                  mappings[node.operator],
                  node.right,
                  node.left
                ));
              }
            },
          },
        },
        
        // 将科学计数法转换为普通数字 (如 5e3 转换为 5000)
        {
          visitor: {
            NumericLiteral(path) {
              const raw = path.node.extra?.raw as string;
              if (raw && raw.includes('e')) {
                path.replaceWith(t.numericLiteral(Number(raw)));
              }
            },
          },
        },
      ],
    });
    
    return result?.code || code;
  } catch (error) {
    console.error('预处理代码时发生错误：', error);
    // 如果出错，返回原始代码，确保流程继续
    return code;
  }
} 