/** @file программа "Приближенно равно", стр. 68 */
import assert from 'node:assert'

function assertApproxEqual(received, expected, message, tolerance = 0.01) {
  assert(Math.abs(received - expected) / expected <= tolerance, message)
}

export default assertApproxEqual
