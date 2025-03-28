import fs from 'fs-extra'
import { glob } from 'glob'
import mock from 'mock-fs'
import { describe, expect, it } from 'vitest'
import { migrate } from '../manifest.js'

describe('тест функции "migrate"', () => {
  const projectFixture = {
    backup: {
      '0.csv': 'username,john_doe\nred.txt,red',
      '1.csv': 'username,john_doe\nred.txt,red\ngreen.txt,green',
      '2.csv': 'username,john_doe\nred.txt,red\ngreen.txt,green\nblue.txt,blue'
    }
  }
  const afterEach_ = () => {
    mock.restore()
  }
  const beforeEach_ = () => {
    mock(projectFixture)
  }

  it('должен производить миграцию файлов манифестов из csv в json формат', async () => {
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
    await migrate('./backup')

    const manifestsFilePaths = await glob('backup/*.json')
    const manifestsPathContentPairs = await Promise.all(
      manifestsFilePaths.map(jsonManifestPathContentPair)
    )

    expect(manifestsPathContentPairs).toStrictEqual([
      [
        'backup/2.json',
        {
          'red.txt': 'red',
          'green.txt': 'green',
          'blue.txt': 'blue',
          username: 'john_doe'
        }
      ],
      [
        'backup/1.json',
        {
          'red.txt': 'red',
          'green.txt': 'green',
          username: 'john_doe'
        }
      ],
      [
        'backup/0.json',
        {
          'red.txt': 'red',
          username: 'john_doe'
        }
      ]
    ])
    await expect(glob('backup/*.csv')).resolves.toHaveLength(0)

    /* after */
    afterEach_()
  })
})
