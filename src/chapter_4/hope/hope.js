import caller from 'caller'
import _isEmpty from 'lodash-es/isEmpty.js'
import _isObject from 'lodash-es/isObject.js'
import _noop from 'lodash-es/noop.js'
import microtime from 'microtime'
import assert from 'node:assert'

class Hope {
  static currentTestSuitContext = null

  constructor() {
    this.testSuits = []
    this.passes = []
    this.fails = []
    this.errors = []
  }

  each(values) {
    return (comment, callback, options) => {
      values.forEach((value) => {
        this.test(comment, () => callback(value), options)
      })
    }
  }

  describe(comment, callback) {
    const previousContext = Hope.currentTestSuitContext
    const context = {
      comment,
      setup: null,
      teardown: null,
      todo: []
    }
    this.testSuits.push(context)
    Hope.currentTestSuitContext = context
    callback()
    Hope.currentTestSuitContext = previousContext
  }

  mock(func) {
    const throws = {}
    let totalFuncCalls = 0
    function decorator(...args) {
      const error = throws[++totalFuncCalls]
      if (_isObject(error)) {
        throw error
      }
      return func(...args)
    }
    decorator.mockNthThrows = (callOrder, error) => {
      throws[callOrder] = error
      return decorator
    }
    return decorator
  }

  setup(func) {
    if (_isObject(Hope.currentTestSuitContext)) {
      Hope.currentTestSuitContext.setup = func
    }
  }

  teardown(func) {
    if (_isObject(Hope.currentTestSuitContext)) {
      Hope.currentTestSuitContext.teardown = func
    }
  }

  test(comment, callback, options) {
    const currentContext = Hope.currentTestSuitContext ?? {
      comment: null,
      setup: null,
      teardown: null,
      todo: []
    }
    currentContext.todo.push([`${caller()}::${comment}`, callback, options])
    if (!this.testSuits.includes(currentContext)) {
      this.testSuits.push(currentContext)
    }
  }

  async run(options) {
    const { tagName = '' } = options
    const tagNames = tagName.split(/ *, */)
    const results = this.testSuits.flatMap(
      // eslint-disable-next-line no-unused-vars
      ({ comment: testSuitComment, setup, teardown, todo }) => {
        return todo.map(async ([comment, test, testOptions]) => {
          const { tagNames: testTagNames = [] } = testOptions ?? {}
          if (
            !_isEmpty(tagNames) &&
            !_isEmpty(testTagNames) &&
            !testTagNames.some((tagName_) => tagNames.includes(tagName_))
          ) {
            return
          }
          try {
            const setup_ = setup ?? _noop
            const teardown_ = teardown ?? _noop
            const start = microtime.now()
            setup_()
            const returned = test()
            if (returned instanceof Promise) await returned
            teardown_()
            const end = microtime.now()
            this.passes.push(`${comment}::${end - start}ms`)
          } catch (e) {
            if (e instanceof assert.AssertionError) {
              this.fails.push(`${comment}::${e.message}`)
            } else {
              this.errors.push(`${comment}::${e.message}`)
            }
          }
        })
      }
    )
    return Promise.all(results)
  }

  // [report]
  terse() {
    return this.cases()
      .map(([title, results]) => `${title}: ${results.length}`)
      .join(' ')
  }

  verbose() {
    let report = ''
    let prefix = ''
    for (const [title, results] of this.cases()) {
      report += `${prefix}${title}:`
      prefix = '\n'
      for (const r of results) {
        report += `${prefix}  ${r}`
      }
    }
    return report
  }

  cases() {
    return [
      ['passes', this.passes],
      ['fails', this.fails],
      ['errors', this.errors]
    ]
  }
  // [/report]
}

export default new Hope()
