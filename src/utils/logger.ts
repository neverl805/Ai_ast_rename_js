/**
 * 日志模块
 * 提供统一的日志记录功能
 */

/**
 * 记录详细日志（仅在verbose模式下）
 * 
 * @param message 日志消息
 * @param verbose 是否启用详细日志
 */
export function logVerbose(message: string, verbose: boolean = true): void {
  if (verbose) {
    console.log(`[详细] ${message}`);
  }
}

/**
 * 记录信息日志
 * 
 * @param message 日志消息
 */
export function logInfo(message: string): void {
  console.log(`[信息] ${message}`);
}

/**
 * 记录警告日志
 * 
 * @param message 日志消息
 */
export function logWarning(message: string): void {
  console.warn(`[警告] ${message}`);
}

/**
 * 记录错误日志
 * 
 * @param message 日志消息
 * @param error 错误对象
 */
export function logError(message: string, error?: unknown): void {
  console.error(`[错误] ${message}`);
  if (error) {
    console.error(error);
  }
} 