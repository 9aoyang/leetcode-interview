export interface ErrorStack {
  line: number
  column: number
  filename: string
}

export interface ErrorMessage {
  message: string
  stack: Array<ErrorStack>
}

// 提取 Chrome 下获取到的TypeError详细信息
const messageReg = /TypeError:([^\n]+)/
// 提取所需内容的文件名，行号，列号
const lineReg = /((?:http|file):(?:\/{2,3})[^\/]+\/[^:]+):(\d+):(\d+)/

/**
 * 提取每行错误信息的文件名，行号，列号
 *
 * @param {string} lineInfo 一行错误信息
 * @returns {(ErrorStack | void)}
 */
function transformLine(lineInfo: string): ErrorStack | void {
  const res = lineInfo.match(lineReg)
  if (res) {
    const [, filename, line, column] = res
    return {
      filename,
      line: +line,
      column: +column
    }
  }
}

/**
 * 对原生错误信息进行处理
 *
 * @param {string} stack Error对象中的原生错误信息
 * @returns {Array<ErrorStack>}
 */
function transformStack(stack: string): Array<ErrorStack> {
  const stackLines = stack.split('\n')
  return stackLines.reduce((stackArr: Array<ErrorStack>, lineInfo: string) => {
    const lineObj = transformLine(lineInfo)
    return lineObj ? [...stackArr, lineObj] : stackArr
  }, [])
}

export function parseError(err: Error): ErrorMessage | void {
  let { stack: stackStr = '' } = err
  if (stackStr) {
    let message: RegExpMatchArray | string = stackStr.match(messageReg)!
    const stack = transformStack(stackStr)
    return {
      message: message ? message[1].trim() : '',
      stack
    }
  }
}
