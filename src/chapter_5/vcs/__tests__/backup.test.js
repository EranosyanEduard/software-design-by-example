import fs from 'fs-extra'
import { glob } from 'glob'
import mock from 'mock-fs'
import { env } from 'node:process'
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

  it('должен использовать пользовательскую функцию для хеширования файлов', async () => {
    expect.hasAssertions()

    /* before */
    /**
     * @param {string} filePath
     * @returns {Promise<[string, Record<string, string>]>}
     */
    const jsonManifestPathContentPair = async (filePath) => {
      const json = await fs.readFile(filePath, 'utf-8')
      return [filePath, JSON.parse(json)]
    }
    beforeEach_()

    /* test */
    await backup({
      dst: 'backup',
      hashFile: (fileContent) => fileContent.slice(0, 3),
      src: 'src',
      manifest: { fileExtension: 'json' }
    })

    const manifestsFilePaths = await glob('backup/*.json')
    const manifestsPathContentPairs = await Promise.all(
      manifestsFilePaths.map(jsonManifestPathContentPair)
    )

    expect(manifestsPathContentPairs).toStrictEqual([
      [
        'backup/0000000000.json',
        {
          'src/colors/red': 'red',
          'src/colors/green': 'gre',
          'src/colors/blue': 'blu',
          username: env.USERNAME
        }
      ]
    ])

    /* after */
    afterEach_()
  })
})
