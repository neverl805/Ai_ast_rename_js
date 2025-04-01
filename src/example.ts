/**
 * 示例用法
 * 演示如何使用AST重命名工具
 */

import fs from 'fs/promises';
import path from 'path';
import {optimizeCode, ModelType, RenameOptions} from './index.js';

async function main() {
    try {

        // 读取JS文件
        const filePath = 'E:\\cursor_project\\ast_rename\\ast_rename_core\\demo\\test.js';
        const code = await fs.readFile(filePath, 'utf-8');

        console.log(`开始处理文件: ${filePath}`);
        console.log(`代码长度: ${code.length} 字符`);

        // 简单进度展示函数
        const showProgress = (progress: number) => {
            const percent = Math.floor(progress * 100);
            process.stdout.write(`\r处理进度: ${percent}%`);
        };

        // 配置选项
        const options: RenameOptions = {
            modelType: ModelType.LOCAL, // 使用本地模型演示
            modelConfig: {
                modelPath: 'E:\\model_cache\\Phi-3.1-mini-4k-instruct-Q4_K_M.gguf', // 本地模型路径，实际使用需要替换
                useGPU: true
            },
            contextWindowSize: 3000,
            verbose: true,
            onProgress: showProgress
        };

        // 处理代码
        const optimizedCode = await optimizeCode(code, options);

        // 保存结果
        const ext = path.extname(filePath);
        const baseName = path.basename(filePath, ext);
        const outputPath = path.join(path.dirname(filePath), `${baseName}.optimized${ext}`);

        await fs.writeFile(outputPath, optimizedCode, 'utf-8');

        console.log(`\n处理完成!`);
        console.log(`结果已保存到: ${outputPath}`);
    } catch (error) {
        console.error('处理文件时发生错误:', error);
        process.exit(1);
    }
}

// 执行主函数
main(); 
