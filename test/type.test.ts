import { connected } from '../src/type'

describe('connect specs:', () => {
  it('should connect async method', () => {
    const timeToDelay = 2
    expect(connected.delay(timeToDelay).payload).toBe(`hello ${timeToDelay}`)
  })

  it('should connect sync method', () => {
    const date = new Date()
    expect(connected.setMessage(date).payload).toBe(date.getMilliseconds())
  })
})
