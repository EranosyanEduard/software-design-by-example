/** @file программа "Утверждение для массивов", стр. 70 */
import assert from 'node:assert'

/**
 * @param {readonly unknown[]} arrA
 * @param {readonly unknown[]} arrB
 */
function assertSetEqual(arrA, arrB) {
  /**
   * @param {readonly unknown[]} arrA_
   * @param {readonly unknown[]} arrB_
   * @returns {boolean}
   */
  const go = (arrA_, arrB_) => {
    /** @type {number[]} */
    const indices = []
    for (const element of arrA_) {
      const index = arrB_.findIndex((it, i) => it === element && !indices.includes(i))
      if (index === -1) return false
      indices.push(index)
    }
    return true
  }
  assert(arrA.length === arrB.length && go(arrA, arrB), 'Массивы не содержат одинаковые элементы')
}

export default assertSetEqual
