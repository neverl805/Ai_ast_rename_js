// @ts-nocheck
/**
 * 标识符遍历模块
 * 从AST中遍历所有标识符，并应用重命名
 *
 * 从原始humanify项目移植而来
 */

// 简单声明这些模块，不尝试导入具体类型
declare module '@babel/core';
declare module '@babel/traverse';
declare module '@babel/generator';
declare module '@babel/types';

import {parseAsync, transformFromAstAsync, NodePath} from '@babel/core';
import _traverse from '@babel/traverse';
import {Identifier, toIdentifier, Node} from '@babel/types';
import {generate} from '@babel/generator';

import {logVerbose} from '../utils/logger.js';

// 处理@babel/traverse模块导入兼容性
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

            logVerbose(`已重命名: ${smallestScopeNode.name} -> ${safeRenamed}`);
            // 在AST中执行重命名
            smallestScope.scope.rename(smallestScopeNode.name, safeRenamed);


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
 * 获取标识符周围相关的代码上下文
 * 优化版本：只提取与标识符直接相关的代码片段，减少无关代码
 */
function getContextCode(
    path: NodePath<Identifier>,
    contextWindowSize: number
): string {
    // 获取标识符名称
    const identifierName = path.node.name;
    
    // 特殊情况：检查是否是函数名或函数参数
    const isFunctionRelated = isFunctionNameOrParam(path);
    
    // 尝试找到最小但有意义的包含上下文
    const relevantContext = findRelevantContext(path);
    
    // 判断所在上下文的类型
    const contextType = getNodeContextType(path);
    
    // 如果是函数参数，并且用于switch语句索引，做特殊处理
    if (isFunctionRelated && contextType.includes('function') && isParamUsedInSwitch(path, identifierName)) {
        return generateSimplifiedFunctionWithSwitch(path, identifierName);
    }
    
    // 根据不同上下文类型提取代码
    let contextCode = "";
    
    // 生成上下文代码字符串
    try {
        // 如果是函数相关上下文，考虑简化函数体
        if (isFunctionRelated && (contextType.includes('function') || contextType === 'variable_declaration')) {
            contextCode = generateSimplifiedFunctionContext(relevantContext, identifierName);
        } else {
            contextCode = generate(relevantContext.node, {minified: true}).code;
        }
    } catch (error) {
        // 如果生成失败，回退到最小作用域
        const fallbackContext = path.scope.block;
        contextCode = generate(fallbackContext, {minified: true}).code;
        logVerbose(`生成上下文代码失败，回退到作用域: ${error}`);
    }
    
    // 对过长的上下文进行裁剪，确保不超过上下文窗口大小
    if (contextCode.length > contextWindowSize) {
        // 添加标识符使用位置的代码片段
        const usageSnippets = findIdentifierUsages(path, identifierName, contextWindowSize);
        
        // 组合上下文片段
        contextCode = combineContextSnippets(usageSnippets, identifierName, contextType, contextWindowSize);
    }
    
    return contextCode;
}

/**
 * 检查标识符是否是函数名或函数参数
 */
function isFunctionNameOrParam(path: NodePath<Identifier>): boolean {
    // 检查是否是函数声明或函数表达式的名称
    if (path.parentPath?.isFunction() && path.parentPath.node.id === path.node) {
        return true;
    }
    
    // 检查是否是函数参数
    if (path.parentPath?.isFunction() || 
        (path.parentPath?.parentPath?.isFunction() && path.parentPath.parentPath.node.params.includes(path.node))) {
        return true;
    }
    
    // 检查是否是变量声明中的函数表达式
    if (path.parentPath?.isVariableDeclarator() && 
        path.parentPath.node.id === path.node && 
        path.parentPath.node.init && 
        (path.parentPath.node.init.type === 'FunctionExpression' || path.parentPath.node.init.type === 'ArrowFunctionExpression')) {
        return true;
    }
    
    // 检查是否是命名函数表达式
    if ((path.parentPath?.isFunctionExpression() || path.parentPath?.isArrowFunctionExpression()) && 
        path.parentPath.node.id === path.node) {
        return true;
    }
    
    return false;
}

/**
 * 检查参数是否在函数内部的switch语句中用作索引
 */
function isParamUsedInSwitch(path: NodePath<Identifier>, paramName: string): boolean {
    // 找到包含此标识符的函数
    const functionParent = path.findParent(
        p => p.isFunctionDeclaration() || p.isFunctionExpression()
    );
    if (!functionParent) return false;
    
    // 检查此参数是否真的是函数参数
    const isParam = functionParent.node.params.some(param => 
        param.type === 'Identifier' && param.name === paramName
    );
    
    if (!isParam) return false;
    
    // 在函数体内查找switch语句
    let hasSwitchWithParam = false;

    functionParent.traverse({
        SwitchStatement(switchPath) {
            // 检查switch的判断表达式是否使用了该参数
            if (switchPath.node.discriminant.type === 'Identifier' && 
                switchPath.node.discriminant.name === paramName) {
                hasSwitchWithParam = true;
            }
        }
    });
    
    return hasSwitchWithParam;
}

/**
 * 生成包含简化switch语句的函数上下文
 */
function generateSimplifiedFunctionWithSwitch(path: NodePath<Identifier>, paramName: string): string {
    // 找到包含此标识符的函数
    const functionParent = path.findParent(p => p.isFunction());
    if (!functionParent) return "";
    

    
    // 查找并简化switch语句
    let switchFound = false;

    functionParent.traverse({
        SwitchStatement(switchPath) {
            // 检查switch的判断表达式是否使用了该参数
            if (switchPath.node.discriminant.type === 'Identifier' &&
                switchPath.node.discriminant.name === paramName) {
                switchFound = true;

                const sw_node = switchPath.node;
                sw_node.cases = []


            }
        }
    });

    if (switchFound) {
        // 生成修改后的函数代码
        return generate(functionParent.node, {
            minified: true
        }).code.replace(/^;\s*/, ''); // 移除可能的前导分号
    }
    
    return "";
}

/**
 * 生成简化的函数上下文
 */
function generateSimplifiedFunctionContext(contextPath: NodePath<Node>, targetName: string): string {
    // 如果不是函数相关上下文，直接生成原始代码
    if (!contextPath.isFunction() && !contextPath.isVariableDeclaration()) {
        return generate(contextPath.node, {minified: true, comments: true}).code;
    }
    
    // 拷贝节点以便修改
    const nodeClone = JSON.parse(JSON.stringify(contextPath.node));
    
    // 如果是变量声明且初始化为函数，处理该函数体
    if (contextPath.isVariableDeclaration()) {
        const declarator = nodeClone.declarations.find(d => 
            d.id.name === targetName || 
            (d.init && d.init.type.includes('Function') && d.init.id && d.init.id.name === targetName)
        );
        
        if (declarator && declarator.init && declarator.init.type.includes('Function')) {
            // 简化函数体，保留结构但减少内容
            if (declarator.init.body.type === 'BlockStatement' && declarator.init.body.body.length > 3) {
                declarator.init.body.body = simplifyFunctionBody(declarator.init.body.body, targetName);
            }
        }
    } 
    // 处理直接的函数声明/表达式
    else if (contextPath.isFunction()) {
        if (nodeClone.body.type === 'BlockStatement' && nodeClone.body.body.length > 3) {
            nodeClone.body.body = simplifyFunctionBody(nodeClone.body.body, targetName);
        }
    }
    
    // 生成简化后的代码
    return generate({type: 'Program', body: [nodeClone]}, {
        minified: false, 
        comments: true
    }).code.replace(/^;\s*/, ''); // 移除可能的前导分号
}

/**
 * 简化函数体，保留关键结构但减少详细内容
 */
function simplifyFunctionBody(bodyStatements, targetName) {
    // 检查是否有switch语句
    const switchIndex = bodyStatements.findIndex(stmt => 
        stmt.type === 'SwitchStatement'
    );
    
    // 如果函数体很长但没有switch，保留前2个和最后1个语句，中间用注释替代
    if (switchIndex === -1) {
        if (bodyStatements.length <= 3) return bodyStatements;
        
        return [
            ...bodyStatements.slice(0, 2),
            {
                type: 'ExpressionStatement',
                expression: {
                    type: 'StringLiteral',
                    value: '/* ... function body simplified ... */'
                }
            },
            bodyStatements[bodyStatements.length - 1]
        ];
    }
    
    // 有switch语句，保留它并简化其他部分
    const result = [];
    
    // 添加switch前的最多2个语句
    const preSwitch = bodyStatements.slice(0, Math.min(switchIndex, 2));
    result.push(...preSwitch);
    
    // 如果switch前有更多语句，添加省略注释
    if (switchIndex > 2) {
        result.push({
            type: 'ExpressionStatement',
            expression: {
                type: 'StringLiteral',
                value: '/* ... code before switch simplified ... */'
            }
        });
    }
    
    // 添加switch语句但简化case内容
    const switchStatement = JSON.parse(JSON.stringify(bodyStatements[switchIndex]));
    
    // 简化每个case
    if (switchStatement.cases && switchStatement.cases.length > 0) {
        switchStatement.cases = switchStatement.cases.map(caseItem => {
            // 保留case表达式
            return {
                type: 'SwitchCase',
                test: caseItem.test,
                // 替换case内部的语句为注释
                consequent: [{
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'StringLiteral',
                        value: '/* case code simplified */'
                    }
                }]
            };
        });
    }
    
    result.push(switchStatement);
    
    // 如果switch后有更多语句，添加省略注释加最后一个语句
    if (bodyStatements.length > switchIndex + 1) {
        result.push({
            type: 'ExpressionStatement',
            expression: {
                type: 'StringLiteral',
                value: '/* ... code after switch simplified ... */'
            }
        });
        
        // 添加最后一个语句（可能是return）
        result.push(bodyStatements[bodyStatements.length - 1]);
    }
    
    return result;
}

/**
 * 找到标识符的相关上下文节点
 * 尝试找到最小但有意义的上下文，而不是整个函数或文件
 */
function findRelevantContext(path: NodePath<Identifier>): NodePath<Node> {
    const identifierName = path.node.name;
    
    // 检查是否是函数名或参数 - 这里直接使用上面定义的辅助函数
    if (isFunctionNameOrParam(path)) {
        // 如果是函数名或参数，返回整个函数
        const functionParent = path.findParent(p => p.isFunction());
        if (functionParent) {
            return functionParent;
        }
        
        // 检查是否是变量声明中的函数赋值
        const varDeclParent = path.findParent(p => p.isVariableDeclaration());
        if (varDeclParent) {
            return varDeclParent;
        }
    }
    
    // 1. 如果是函数参数，返回整个函数声明
    if (path.parentPath?.isFunction()) {
        return path.parentPath;
    }
    
    // 2. 如果是变量声明，返回变量声明语句和初始化表达式
    if (path.parentPath?.isVariableDeclarator()) {
        // 如果变量声明有初始化表达式，包含它
        if (path.parentPath.node.init) {
            return path.parentPath.parentPath || path.parentPath;
        }
    }
    
    // 3. 如果是类方法名，返回整个方法定义
    if (path.parentPath?.isClassMethod() || path.parentPath?.isObjectMethod()) {
        return path.parentPath;
    }
    
    // 4. 如果是属性名，返回包含该属性的对象表达式
    if (path.parentPath?.isObjectProperty() && path.parentPath.node.key === path.node) {
        return path.parentPath.parentPath || path.parentPath;
    }
    
    // 5. 对于其他类型的标识符，查找最近的有意义语句
    const nearestStatement = path.getStatementParent();
    if (nearestStatement) {
        return nearestStatement;
    }
    
    // 6. 如果以上都不适用，尝试找到包含该标识符的最小代码块
    const blockParent = path.findParent(p => p.isBlockStatement());
    if (blockParent) {
        // 如果代码块不太大，返回整个代码块
        const blockCode = generate(blockParent.node, {minified: true}).code;
        if (blockCode.length < 1000) {
            return blockParent;
        }
        
        // 否则只返回包含该标识符的直接相关语句
        return findSmallestRelevantParent(path);
    }
    
    // 7. 最后的回退方案: 使用标识符所在的作用域
    return findSmallestRelevantParent(path);
}

/**
 * 找到最小的相关父节点
 */
function findSmallestRelevantParent(path: NodePath<Identifier>): NodePath<Node> {
    // 尝试找到函数声明、表达式语句或变量声明等有意义的父节点
    const relevantParent = path.findParent((p: NodePath) => 
        p.isFunctionDeclaration() || 
        p.isVariableDeclaration() || 
        p.isExpressionStatement() ||
        p.isReturnStatement() ||
        p.isIfStatement() ||
        p.isForStatement() ||
        p.isWhileStatement() ||
        p.isSwitchStatement()
    );
    
    if (relevantParent) {
        return relevantParent;
    }
    
    // 回退到标识符的直接父节点
    return path.parentPath || path;
}

/**
 * 确定标识符所在的上下文类型
 */
function getNodeContextType(path: NodePath<Identifier>): string {
    if (path.parentPath?.isFunction() || path.parentPath?.isFunctionDeclaration()) {
        return 'function_declaration';
    }
    
    if (path.parentPath?.isFunctionExpression() || path.parentPath?.isArrowFunctionExpression()) {
        return 'function_expression';
    }
    
    if (path.parentPath?.isVariableDeclarator()) {
        return 'variable_declaration';
    }
    
    if (path.parentPath?.isClassMethod()) {
        return 'class_method';
    }
    
    if (path.parentPath?.isClassDeclaration()) {
        return 'class_declaration';
    }
    
    if (path.parentPath?.isObjectProperty()) {
        return 'object_property';
    }
    
    if (path.parentPath?.isCallExpression()) {
        return 'function_call';
    }
    
    if (path.parentPath?.isMemberExpression()) {
        return 'member_expression';
    }
    
    return 'other';
}

/**
 * 查找标识符的所有使用位置
 * 返回每个使用位置周围的代码片段
 */
function findIdentifierUsages(
    path: NodePath<Identifier>, 
    identifierName: string, 
    maxLength: number
): string[] {
    const usageSnippets: string[] = [];
    const binding = path.scope.getBinding(identifierName);
    
    // 如果找到绑定，收集所有引用位置的代码片段
    if (binding) {
        // 添加声明位置的代码片段
        const declarationNode = binding.path.node;
        if (declarationNode) {
            let declarationParent = binding.path.getStatementParent();
            if (declarationParent) {
                const declarationCode = generate(declarationParent.node, {minified: true}).code;
                if (declarationCode.length <= maxLength / 3) {
                    usageSnippets.push(declarationCode);
                }
            }
        }
        
        // 添加每个引用位置的代码片段
        for (const reference of binding.referencePaths) {
            const statementParent = reference.getStatementParent();
            if (statementParent && statementParent.node) {
                const referenceCode = generate(statementParent.node, {minified: true}).code;
                
                // 如果代码片段不太长，添加到结果中
                if (referenceCode.length <= maxLength / 3 && !usageSnippets.includes(referenceCode)) {
                    usageSnippets.push(referenceCode);
                }
            }
        }
    }
    
    return usageSnippets;
}

/**
 * 组合多个上下文片段成为一个连贯的上下文字符串
 */
function combineContextSnippets(
    snippets: string[],
    identifierName: string,
    contextType: string,
    maxLength: number
): string {
    // 如果没有片段，返回空字符串
    if (snippets.length === 0) {
        return `/* No relevant context found for '${identifierName}' */`;
    }
    
    // 计算每个片段可以分配的最大长度
    const snippetMaxLength = Math.floor(maxLength / snippets.length);
    
    // 组合所有片段
    let combinedContext = `/* Context for '${identifierName}' (${contextType}) */\n\n`;
    
    for (let i = 0; i < snippets.length; i++) {
        const snippet = snippets[i];
        
        // 如果片段不存在，跳过
        if (!snippet) continue;
        
        // 如果片段太长，截断它
        let processedSnippet = snippet;
        if (snippet.length > snippetMaxLength) {
            // 尝试保留包含标识符的部分
            const identifierIndex = snippet.indexOf(identifierName);
            
            if (identifierIndex >= 0) {
                // 计算截取的起始位置，尽量保留标识符周围的代码
                const startPos = Math.max(0, identifierIndex - Math.floor(snippetMaxLength / 2));
                processedSnippet = snippet.substring(startPos, startPos + snippetMaxLength);
                
                // 在截断的代码片段两端添加省略号
                if (startPos > 0) {
                    processedSnippet = `/* ... */ ${processedSnippet}`;
                }
                if (startPos + snippetMaxLength < snippet.length) {
                    processedSnippet = `${processedSnippet} /* ... */`;
                }
            } else {
                // 如果找不到标识符，简单地截取前面的部分
                processedSnippet = snippet.substring(0, snippetMaxLength) + " /* ... */";
            }
        }
        
        // 添加片段编号和分隔符
        combinedContext += `/* Snippet ${i + 1} */\n${processedSnippet}\n\n`;
    }
    
    return combinedContext;
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
