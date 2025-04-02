/**
 * AST重命名工具演示脚本
 * 
 * 此脚本演示如何使用AST重命名工具处理JavaScript文件，
 * 将简短或不清晰的变量名替换为更具语义的名称。
 */

import fs from 'fs/promises';
import path from 'path';
import {optimizeCode, ModelType} from '../dist/index.js';
import chalk from 'chalk';

async function runDemo() {
  try {
    console.log(chalk.blue('='.repeat(60)));
    console.log(chalk.blue.bold('AST变量重命名工具演示'));
    console.log(chalk.blue('='.repeat(60)));
    
    // 读取示例文件
    const sampleFilePath = path.join(process.cwd(), 'demo', 'example-sample.js');
    const code = await fs.readFile(sampleFilePath, 'utf-8');
    
    console.log(chalk.green('✓ 已加载示例文件'));
    console.log(chalk.yellow('📊 代码统计:'));
    console.log(`  - 文件大小: ${(code.length / 1024).toFixed(2)} KB`);
    console.log(`  - 行数: ${code.split('\n').length}`);
    console.log();
    
    // 简单进度展示函数
    const showProgress = (progress) => {
      const percent = Math.floor(progress * 100);
      const bar = '█'.repeat(Math.floor(percent / 5)) + '░'.repeat(20 - Math.floor(percent / 5));
      process.stdout.write(`\r${chalk.yellow('处理进度:')} [${bar}] ${percent}%`);
    };
    
    console.log(chalk.blue('⚙️  开始处理代码...'));
    console.log();
    
    // 配置选项
    const options = {
      modelType: ModelType.LOCAL,
      modelConfig: {
        // 请替换为您实际的模型路径
        modelPath: process.env.MODEL_PATH || './models/Phi-3.1-mini-4k-instruct-Q4_K_M.gguf',
        useGPU: true
      },
      contextWindowSize: 3000,
      verbose: false,
      onProgress: showProgress
    };
    
    console.log(chalk.yellow('📝 使用配置:'));
    console.log(`  - 模型类型: ${options.modelType}`);
    console.log(`  - 模型路径: ${options.modelConfig.modelPath}`);
    console.log(`  - 使用GPU: ${options.modelConfig.useGPU}`);
    console.log(`  - 上下文窗口大小: ${options.contextWindowSize}`);
    console.log();
    
    const startTime = Date.now();
    
    // 处理代码
    try {
      const optimizedCode = await optimizeCode(code, options);
      
      const endTime = Date.now();
      const timeSpent = ((endTime - startTime) / 1000).toFixed(2);
      
      console.log(`\n\n${chalk.green('✓ 处理完成!')} 用时: ${chalk.bold(timeSpent)} 秒`);
      
      // 保存结果
      const outputPath = path.join(process.cwd(), 'demo', 'example-sample.optimized.js');
      await fs.writeFile(outputPath, optimizedCode, 'utf-8');
      
      console.log(chalk.green(`✓ 结果已保存到: ${outputPath}`));
      
      // 显示原始代码和优化后代码的对比
      console.log(chalk.blue('\n对比示例 (简单函数):'));
      const originalSample = code.split('\n').slice(6, 10).join('\n');
      console.log(chalk.yellow('\n原始代码:'));
      console.log(originalSample);
      
      // 尝试找到优化后代码中对应的函数
      const optimizedLines = optimizedCode.split('\n');
      let matchStart = -1;
      for (let i = 0; i < optimizedLines.length; i++) {
        if (optimizedLines[i].includes('function calc(') || 
            optimizedLines[i].includes('function calculate(')) {
          matchStart = i;
          break;
        }
      }
      
      if (matchStart >= 0) {
        console.log(chalk.green('\n优化后代码:'));
        const optimizedSample = optimizedLines.slice(matchStart, matchStart + 4).join('\n');
        console.log(optimizedSample);
      }
      
      console.log(chalk.blue('\n='.repeat(60)));
      console.log(chalk.blue.bold('演示完成! 请检查生成的文件以查看完整结果'));
      console.log(chalk.blue('='.repeat(60)));
      
    } catch (error) {
      console.error(chalk.red('处理代码时发生错误:'), error);
    }
    
  } catch (error) {
    console.error(chalk.red('运行演示时发生错误:'), error);
    process.exit(1);
  }
}

// 执行演示
runDemo(); 