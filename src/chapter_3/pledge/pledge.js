/** @file "Any и all", стр. 57 */

class Pledge {
  /**
   * @param {Pledge[]} pledges
   * @returns {Pledge}
   */
  static all(...pledges) {
    const values = []
    const isResolved = () => values.length === pledges.length
    let isRejected = false
    return new Pledge((resolve, reject) => {
      /** @type {typeof reject} */
      const reject_ = (error) => {
        if (isRejected || isResolved()) return
        isRejected = true
        reject(error)
      }
      /** @type {typeof resolve} */
      const resolve_ = (value) => {
        if (!isRejected) values.push(value)
        if (isResolved()) resolve(values)
      }
      pledges.forEach((pledge) => {
        pledge.then(resolve_).catch(reject_)
      })
    })
  }

  /**
   * @param {Pledge[]} pledges
   * @returns {Pledge}
   */
  static any(...pledges) {
    let rejectTotalCalls = 0
    let isResolved = false
    const isRejected = () => pledges.length === rejectTotalCalls
    return new Pledge((resolve, reject) => {
      /** @type {typeof reject} */
      const reject_ = (error) => {
        if (!isResolved) rejectTotalCalls++
        if (isRejected()) reject(error)
      }
      /** @type {typeof resolve} */
      const resolve_ = (value) => {
        if (isResolved || isRejected()) return
        isResolved = true
        resolve(value)
      }
      pledges.forEach((pledge) => {
        pledge.then(resolve_).catch(reject_)
      })
    })
  }

  /** @param {(resolve: (value: unknown) => void, reject: (e: Error) => void) => void} action  */
  constructor(action) {
    /** @type {Array<(value: unknown) => unknown>} */
    this.actionCallbacks = []
    /** @type {(e: Error) => void} */
    this.errorCallback = () => {}
    action(this.onResolve.bind(this), this.onReject.bind(this))
  }

  /**
   * @param {(value: unknown) => unknown} thenHandler
   * @returns {Pledge}
   */
  then(thenHandler) {
    this.actionCallbacks.push(thenHandler)
    return this
  }

  /**
   * @param {(e: Error) => void} errorHandler
   * @returns {Pledge}
   */
  catch(errorHandler) {
    this.errorCallback = errorHandler
    return this
  }

  /** @param {unknown} value  */
  onResolve(value) {
    let storedValue = value
    try {
      this.actionCallbacks.forEach((action) => {
        storedValue = action(storedValue)
      })
    } catch (error) {
      this.actionCallbacks = []
      this.onReject(error)
    }
  }

  /** @param {Error} error  */
  onReject(error) {
    this.errorCallback(error)
  }
}

export default Pledge
