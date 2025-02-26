import assert from 'node:assert'
import assertMapEqual from './assert_map_equal.js'
import hope from './hope.js'

hope.test('тест утилиты "assertSetEqual"', () => {
  assertMapEqual(new Map(), new Map())
  assertMapEqual(
    new Map([
      ['a', 1],
      ['b', 2],
      ['c', 3]
    ]),
    new Map([
      ['c', 3],
      ['b', 2],
      ['a', 1]
    ])
  )
  assert.throws(() =>
    assertMapEqual(new Map([['obj', { a: 'a' }]]), new Map([['obj', { a: 'a' }]]))
  )

  const o = { a: 'a' }
  assertMapEqual(new Map([['obj', o]]), new Map([['obj', o]]))
})
