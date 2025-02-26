class Rectangle {
  constructor({ height, width }) {
    this.height = height
    this.width = width
  }

  /**
   * @param {Rectangle} other
   * @returns {boolean}
   */
  equals(other) {
    return this.height === other.height && this.width === other.width
  }
}

export default Rectangle
