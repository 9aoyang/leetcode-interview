export interface ErrorStack {
  line: number
  column: number
  filename: string
}

export interface ErrorMessage {
  message: string
  stack: Array<ErrorStack>
}

const messageReg = /TypeError:([^\n]+)/
const lineReg = /((?:http|file):(?:\/{2,3})[^\/]+\/[^:]+):(\d+):(\d+)/

function transformLine(lineInfo: string): ErrorStack | void {
  const res = lineInfo.match(lineReg)
  if (res) {
    const [, filename, line, column] = lineInfo.match(lineReg)
    return {
      filename,
      line: +line,
      column: +column
    }
  }
}

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
