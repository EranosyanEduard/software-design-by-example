import assert from 'node:assert'
import assertSetEqual from './assert_set_equal.js'
import hope from './hope.js'

hope.test('тест утилиты "assertSetEqual"', () => {
  assertSetEqual(new Set(), new Set())
  assertSetEqual(new Set([1, 2, 3]), new Set([3, 2, 1]))
  assert.throws(() => assertSetEqual(new Set([{ a: 'a' }]), new Set([{ a: 'a' }])))

  const o = { a: 'a' }
  assertSetEqual(new Set([o]), new Set([o]))
})
