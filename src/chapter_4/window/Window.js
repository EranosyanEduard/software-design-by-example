import Point2d from './Point2d.js'
import Rectangle from './Rectangle.js'

class Window {
  constructor({ height, width, x, y }) {
    this.rectangle = new Rectangle({ height, width })
    this.points = {
      leftBottom: new Point2d({ x, y }),
      rightTop: new Point2d({ x: x + width, y: y + height })
    }
  }

  /**
   * Окно содержит окно `other` или они полностью совпадают.
   * @param {Window} other
   * @returns {boolean}
   */
  contains(other) {
    return (
      other.points.leftBottom.x >= this.points.leftBottom.x &&
      other.points.leftBottom.y >= this.points.leftBottom.y &&
      this.points.rightTop.x >= other.points.rightTop.y &&
      this.points.rightTop.y >= other.points.rightTop.y
    )
  }

  /**
   * @param {Window} other
   * @returns {Window | null}
   */
  intersection(other) {
    const leftWindow = this.points.leftBottom.x > other.points.leftBottom.x ? other : this
    const bottomWindow = this.points.leftBottom.y > other.points.leftBottom.y ? other : this
    const diffWindowX = Math.abs(this.points.leftBottom.x - other.points.leftBottom.x)
    const diffWindowY = Math.abs(this.points.leftBottom.y - other.points.leftBottom.y)
    const isIntersection =
      leftWindow.rectangle.width > diffWindowX && bottomWindow.rectangle.height > diffWindowY
    if (!isIntersection) return null
    const x1 = leftWindow.points.leftBottom.x + diffWindowX
    const x2 = Math.min(this.points.rightTop.x, other.points.rightTop.x)
    const y1 = bottomWindow.points.leftBottom.y + diffWindowY
    const y2 = Math.min(this.points.rightTop.y, other.points.rightTop.y)
    return new Window({
      x: x1,
      y: y1,
      height: y2 - y1,
      width: x2 - x1
    })
  }
}

export default Window
