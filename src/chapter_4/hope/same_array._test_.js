import assert from 'node:assert'
import assertSameArray from './assert_same_array.js'
import hope from './hope.js'

hope.test('тест утилиты "assertSameArray"', () => {
  assertSameArray([], [])
  assertSameArray([1, 2, 3], [3, 2, 1])
  assert.throws(() => assertSameArray([1, 2, 3], []))
  assert.throws(() => assertSameArray([1, 2, 3], [3, 2, 0]))
  assert.throws(() => assertSameArray([1, 2, 3], [1, 1, 1]))
})
