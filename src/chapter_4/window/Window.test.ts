import { describe, expect, it } from "vitest";
import Window from "./Window.js";

describe('тест класса Window', () => {
  it('должен содержать другие окна', () => {
    expect.hasAssertions()

    const windowA = new Window({
      x: 0,
      y: 0,
      height: 100,
      width: 100
    })
    const windowB = new Window({
      x: 10,
      y: 10,
      height: 50,
      width: 50
    })
    const windowC = new Window({
      x: 0,
      y: 0,
      height: 100,
      width: 100
    })
    const windowD = new Window({
      x: 10,
      y: 10,
      height: 100,
      width: 100
    })

    expect(windowA.contains(windowB), 'внутри').toBeTruthy()
    expect(windowA.contains(windowC), 'совпадают').toBeTruthy()
    expect(windowA.contains(windowD), 'за пределами').toBeFalsy()
  })

  it('должен возвращать область пересечения окон', () => {
    expect.hasAssertions()

    const windowA = new Window({
      x: 200,
      y: 200,
      height: 300,
      width: 300
    })
    const windowB = new Window({
      x: 100,
      y: 100,
      height: 200,
      width: 200
    })
    const windowC = new Window({
      x: 100,
      y: 300,
      width: 500,
      height: 100
    })
    const windowD = new Window({
      x: 100,
      y: 100,
      width: 100,
      height: 100
    })
    const windowE = new Window({
      x: 200,
      y: 200,
      height: 300,
      width: 300
    })


    /*
            -----------
            |A        |
      ------|------   |
      |B    |    |    |
      |     -----|-----
      |          |
      ------------
    */
    const intersectionA = windowA.intersection(windowB)

    expect(intersectionA?.points.leftBottom.x).toBe(200)
    expect(intersectionA?.points.leftBottom.y).toBe(200)
    expect(intersectionA?.rectangle.height).toBe(100)
    expect(intersectionA?.rectangle.width).toBe(100)

        /*
            -----------
            |A        |
        -------------------
        |C  |         |   |
         ------------------
            |         |
            -----------
    */
    const intersectionB = windowA.intersection(windowC)

    expect(intersectionB?.points.leftBottom.x).toBe(200)
    expect(intersectionB?.points.leftBottom.y).toBe(300)
    expect(intersectionB?.rectangle.height).toBe(100)
    expect(intersectionB?.rectangle.width).toBe(300)

    expect(windowA.intersection(windowD), 'не пересекаются').toBeNull()

    /* "полное" наложение */
    const intersectionE = windowA.intersection(windowE);

    expect(intersectionE?.points.leftBottom.x).toBe(200)
    expect(intersectionE?.points.leftBottom.y).toBe(200)
    expect(intersectionE?.rectangle.height).toBe(300)
    expect(intersectionE?.rectangle.width).toBe(300)
  })
})
