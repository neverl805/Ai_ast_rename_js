// test_resource_release.js
import { fileURLToPath } from "url";
import path from "path";
import { getLlama, LlamaChatSession } from "node-llama-cpp";

// 获取当前目录（适用于ES模块）
const __dirname = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const model_path = path.join(__dirname, "models/Phi-3.1-mini-4k-instruct-Q4_K_M.gguf")

async function runTest() {
    // 加载 Llama 实例及模型（请确保 modelPath 指向你的 gguf 模型文件）
    const llama = await getLlama();
    const model = await llama.loadModel({
        modelPath: model_path,
        useGPU: true
    });

    // 定义一个简单的测试问题
    const testPrompt = "你好，请简单自我介绍一下。";

    // 循环多次创建、使用、销毁会话
    for (let i = 0; i < 10; i++) {
        console.log(`\n===== 第 ${i + 1} 次测试 =====`);

        // 创建新的对话会话（注意：不同版本可能方法名不同，可查阅文档）
        const session = new LlamaChatSession({
            // 创建一个新的上下文，并获取 contextSequence（假设 createContext 和 getSequence 存在）
            contextSequence: (await model.createContext()).getSequence()
        });

        try {
            const response = await session.prompt(testPrompt);
            console.log("AI 回复：", response);
        } catch (error) {
            console.error("调用 prompt 时出错：", error);
        }

        // 尝试释放当前会话资源，如果库提供 close/dispose 方法则调用
        if (typeof session.close === "function") {
            session.close();
        }
        // 如果模型上下文有独立释放方法，也调用（例如：context.close()），
        // 此处假设 createContext 返回的上下文会在 session 内部管理

        // 如果你启动 Node 时启用了 --expose-gc, 可手动调用垃圾回收：
        if (global.gc) {
            global.gc();
            console.log("手动垃圾回收已触发");
        } else {
            console.warn("未启用 --expose-gc，无法手动触发垃圾回收");
        }
    }

    // 最后，释放模型资源（如果有 close/dispose 方法）
    if (typeof model.close === "function") {
        model.close();
    }
    console.log("\n测试结束，资源已释放。");
}

runTest().catch(err => console.error(err));
