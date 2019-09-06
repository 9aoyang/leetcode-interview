import { ErrorMessage, ErrorStack, parseError } from '../src/foundations'

const httpExample: Array<ErrorStack> = [
  {
    line: 2,
    column: 9,
    filename: 'http://192.168.31.8:8000/c.js'
  },
  {
    line: 4,
    column: 15,
    filename: 'http://192.168.31.8:8000/b.js'
  },
  {
    line: 4,
    column: 3,
    filename: 'http://192.168.31.8:8000/a.js'
  },
  {
    line: 22,
    column: 3,
    filename: 'http://192.168.31.8:8000/a.js'
  }
]

const fileExample: Array<ErrorStack> = [
  {
    line: 2,
    column: 9,
    filename: 'file:///C:/index.html'
  },
  {
    line: 4,
    column: 15,
    filename: 'file:///C:/index.html'
  },
  {
    line: 4,
    column: 3,
    filename: 'file:///C:/index.html'
  },
  {
    line: 22,
    column: 3,
    filename: 'file:///C:/index.html'
  }
]

describe('Error parse test', () => {
  describe('Normal Test', () => {
    test('Chrome error parse(http)', () => {
      const error: Error = {
        name: '',
        message: 'Error raised',
        stack: `TypeError: Error raised
          at bar http://192.168.31.8:8000/c.js:2:9
          at foo http://192.168.31.8:8000/b.js:4:15
          at calc http://192.168.31.8:8000/a.js:4:3
          at <anonymous>:1:11
          at http://192.168.31.8:8000/a.js:22:3
        `
      }
      expect(parseError(error)).toEqual({
        message: 'Error raised',
        stack: httpExample
      })
    })
    test('Chrome error parse(file)', () => {
      const error: Error = {
        name: '',
        message: 'Error raised',
        stack: `TypeError: Error raised
          at bar file:///C:/index.html:2:9
          at foo file:///C:/index.html:4:15
          at calc file:///C:/index.html:4:3
          at <anonymous>:1:11
          at file:///C:/index.html:22:3
        `
      }
      expect(parseError(error)).toEqual({
        message: 'Error raised',
        stack: fileExample
      })
    })
    test('Firefox error parse(http)', () => {
      const error: Error = {
        name: '',
        message: 'Error raised',
        stack: `
          bar@http://192.168.31.8:8000/c.js:2:9
          foo@http://192.168.31.8:8000/b.js:4:15
          calc@http://192.168.31.8:8000/a.js:4:3
          <anonymous>:1:11
          http://192.168.31.8:8000/a.js:22:3
        `
      }
      expect(parseError(error)).toEqual({
        message: '',
        stack: httpExample
      })
    })
    test('Firefox error parse(file)', () => {
      const error: Error = {
        name: '',
        message: 'Error raised',
        stack: `
          bar@file:///C:/index.html:2:9
          foo@file:///C:/index.html:4:15
          calc@file:///C:/index.html:4:3
          <anonymous>:1:11
          file:///C:/index.html:22:3
        `
      }
      expect(parseError(error)).toEqual({
        message: '',
        stack: fileExample
      })
    })
  })
  describe('Abnormal test', () => {
    test('Error without stack attribute', () => {
      const error: Error = {
        name: '',
        message: ''
      }
      expect(parseError(error)).toBe(undefined)
    })
  })
})
