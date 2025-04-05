import mock from 'mock-fs'
import { describe, expect, it } from 'vitest'
import { diff } from '../manifest.js'

describe('тест функции "diff"', () => {
  const projectFixture = {
    backup: {
      '0.csv': ['username,john_doe', 'red.txt,red', 'green.txt,green', 'blue.txt,blue'].join('\n'),
      '1.csv': [
        'username,john_doe',
        'red.txt,RED',
        'green_color.txt,green',
        'white.txt,white'
      ].join('\n')
    }
  }
  const afterEach_ = () => {
    mock.restore()
  }
  const beforeEach_ = () => {
    mock(projectFixture)
  }

  it('должен "вычислять" разницу между файлами манифеста', async () => {
    expect.hasAssertions()

    /* before */
    beforeEach_()

    /* test */
    await expect(diff('./backup/0.csv', './backup/1.csv')).resolves.toStrictEqual({
      changed: ['red.txt'],
      created: ['white.txt'],
      renamed: [{ old: 'green.txt', new: 'green_color.txt' }],
      removed: ['blue.txt']
    })

    /* after */
    afterEach_()
  })
})
