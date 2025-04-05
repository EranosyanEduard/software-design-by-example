import mock from 'mock-fs'
import { describe, expect, it } from 'vitest'
import { DiffState, logFile } from '../log_file.js'

describe('тест функции "logFile"', () => {
  const afterEach_ = () => {
    mock.restore()
  }

  it('должен отображать историю изменений файла (файл создан в 1-м комите)', async () => {
    expect.hasAssertions()

    /* before */
    const before = () => {
      const projectFixture = {
        backup: {
          '0.csv': 'username,john_doe\ncolors.txt,',
          '1.csv': 'username,john_doe\ncolors.txt,red',
          '2.csv': 'username,john_doe\ncolors.txt,red orange',
          '3.csv': 'username,john_doe\ncolors.txt,red orange yellow',
          '4.csv': 'username,john_doe\ncolors.txt,red orange yellow green',
          '5.csv': 'username,john_doe\ncolors.txt,red orange yellow green blue',
          '6.csv': 'username,john_doe\ncolors.txt,red orange yellow green blue purple',
          '7.csv': 'username,john_doe\nrainbow.txt,red orange yellow green blue purple',
          '8.csv': 'username,john_doe',
          '9.csv': 'username,john_doe\nred.txt,red'
        }
      }
      mock(projectFixture)
    }
    before()

    /* test */
    await expect(logFile({ filePath: 'rainbow.txt' })).resolves.toStrictEqual([
      ['8.csv', DiffState.REMOVED],
      ['7.csv', DiffState.RENAMED],
      ['6.csv', DiffState.CHANGED],
      ['5.csv', DiffState.CHANGED],
      ['4.csv', DiffState.CHANGED],
      ['3.csv', DiffState.CHANGED],
      ['2.csv', DiffState.CHANGED],
      ['1.csv', DiffState.CHANGED],
      ['0.csv', DiffState.CREATED]
    ])

    /* after */
    afterEach_()
  })

  it('должен отображать историю изменений файла (файл создан не в 1-м комите)', async () => {
    expect.hasAssertions()

    /* before */
    const before = () => {
      const projectFixture = {
        backup: {
          '0.csv': 'username,john_doe',
          '1.csv': 'username,john_doe\nred.txt,red',
          '2.csv': 'username,john_doe'
        }
      }
      mock(projectFixture)
    }
    before()

    /* test */
    await expect(logFile({ filePath: 'red.txt' })).resolves.toStrictEqual([
      ['2.csv', DiffState.REMOVED],
      ['1.csv', DiffState.CREATED]
    ])

    /* after */
    afterEach_()
  })

  it('не должен отображать историю изменений файла, если он не существует', async () => {
    expect.hasAssertions()

    /* before */
    const before = () => {
      const projectFixture = {
        backup: {
          '0.csv': 'username,john_doe',
          '1.csv': 'username,john_doe\nred.txt,red',
          '2.csv': 'username,john_doe'
        }
      }
      mock(projectFixture)
    }
    before()

    /* test */
    await expect(logFile({ filePath: 'colors.txt' })).resolves.toStrictEqual([])

    /* after */
    afterEach_()
  })
})
