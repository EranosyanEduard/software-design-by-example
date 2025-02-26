/** @file программа "Утверждение для множеств", стр. 70 */
import _isEmpty from 'lodash-es/isEmpty.js'
import assert from 'node:assert'

/**
 * @param {Set<unknown>} setA
 * @param {Set<unknown>} setB
 */
function assertSetEqual(setA, setB) {
  assert(_isEmpty(setA.difference(setB)), 'Множества не равны')
}

export default assertSetEqual
