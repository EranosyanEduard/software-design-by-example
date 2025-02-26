import assertApproxEqual from './assert_approx_equal.js'
import hope from './hope.js'

hope.test('относительная погрешность', () => assertApproxEqual(2, 2, 'должен пройти'), {
  tagNames: ['math']
})
hope.test('относительная погрешность', () => assertApproxEqual(1, 2, 'не должен пройти'), {
  tagNames: ['fails']
})
