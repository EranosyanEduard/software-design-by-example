/** @file программа "Утверждение для отображений", стр. 70 */
import assert from 'node:assert'

/**
 * @param {Map<unknown>} mapA
 * @param {Map<unknown>} mapB
 */
function assertSetEqual(mapA, mapB) {
  /**
   * @param {Map<unknown>} mapA_
   * @param {Map<unknown>} mapB_
   * @returns {boolean}
   */
  const go = (mapA_, mapB_) => {
    return [...mapA_].every(([key, value]) => mapB_.has(key) && mapB_.get(key) === value)
  }
  assert(mapA.size === mapB.size && go(mapA, mapB), 'Отображения не равны')
}

export default assertSetEqual
