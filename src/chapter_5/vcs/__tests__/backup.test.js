import { glob } from 'glob'
import mock from 'mock-fs'
import { describe, expect, it } from 'vitest'
import backup from '../backup.js'

describe('тест функции "backup"', () => {
  /**
   * @param {readonly string[]} strings
   * @returns {string[]}
   */
  const sortAlphabeticalOrder = (strings) => strings.toSorted((a, b) => a.localeCompare(b))
  const projectFixture = {
    backup: {},
    src: {
      colors: {
        red: 'red',
        green: 'green',
        blue: 'blue'
      }
    }
  }
  const afterEach_ = () => {
    mock.restore()
  }
  const beforeEach_ = () => {
    mock(projectFixture)
  }

  it('должен использовать порядковую нумерацию манифестов', async () => {
    expect.hasAssertions()

    /* before */
    beforeEach_()

    /* test */
    await backup({ dst: 'backup', src: 'src' })
    await backup({ dst: 'backup', src: 'src' })
    await backup({ dst: 'backup', src: 'src' })

    expect(sortAlphabeticalOrder(await glob('backup/*.csv'))).toStrictEqual([
      'backup/0000000000.csv',
      'backup/0000000001.csv',
      'backup/0000000002.csv'
    ])

    /* after */
    afterEach_()
  })

  it('должен сохранять манифесты в различных форматах', async () => {
    expect.hasAssertions()

    /* before */
    beforeEach_()

    /* test */
    await backup({ dst: 'backup', src: 'src' })
    await backup({
      dst: 'backup',
      src: 'src',
      manifest: { fileExtension: 'json' }
    })
    await backup({ dst: 'backup', src: 'src' })
    await backup({
      dst: 'backup',
      src: 'src',
      manifest: { fileExtension: 'json' }
    })

    expect(sortAlphabeticalOrder(await glob('backup/*.csv'))).toStrictEqual([
      'backup/0000000000.csv',
      'backup/0000000002.csv'
    ])
    expect(sortAlphabeticalOrder(await glob('backup/*.json'))).toStrictEqual([
      'backup/0000000001.json',
      'backup/0000000003.json'
    ])

    /* after */
    afterEach_()
  })
})
