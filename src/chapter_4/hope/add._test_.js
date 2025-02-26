import assert from 'node:assert'
import hope from './hope.js'
import { log } from 'node:console'

hope.describe('add', () => {
  hope.setup(() => {
    log('test setup')
  })

  hope.teardown(() => {
    log('test teardown')
  })

  hope.test('Sum of 1 and 2', () => assert(1 + 2 === 3), { tagNames: ['math'] })

  hope.test('Test mock feature', () => {
    const add = (x, y) => {
      return x + y
    }
    const mockedAdd = hope
      .mock(add)
      .mockNthThrows(2, new Error('error 2'))
      .mockNthThrows(4, new Error('error 4'))

    assert(mockedAdd(1, 2) === 3, 'call 1')
    assert.throws(() => mockedAdd(1, 2), 'call 2')
    assert(mockedAdd(3, 4) === 7, 'call 3')
    assert.throws(() => mockedAdd(1, 2), 'call 4')
    assert(mockedAdd(5, 6) === 11, 'call 5')
  })

  hope.each([1, 2, 3])('Test each feature', (number) => {
    assert(number > 0, 'positive number')
  })

  hope.test('async test', async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 2_000)
    })
    assert(true)
  })
})
