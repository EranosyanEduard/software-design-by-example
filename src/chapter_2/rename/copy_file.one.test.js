/** @import { CopyFileInput } from './copy_file.typedef' */
import fs from 'fs-extra'
import mock from 'mock-fs'
import { describe, expect, it } from 'vitest'
import copyFile from './copy_file.one'

describe('тест утилиты "copy_file.one"', () => {
  mock({
    user: {
      'red.txt': 'red',
      'green.txt': 'green',
      'green.bck': ''
    }
  })

  it('должен создать копию файла с указанным расширением, если файл существует, а копия - нет', async () => {
    expect.hasAssertions()

    /** @type {Readonly<CopyFileInput>} */
    const fixture = {
      filePath: './user/red.txt',
      newExtension: '.bck',
      oldExtension: '.txt'
    }

    await expect(copyFile(fixture)).resolves.toBeUndefined()
    await expect(fs.readFile('./user/red.txt', 'utf-8')).resolves.toBe('red')
    await expect(fs.readFile('./user/red.bck', 'utf-8')).resolves.toBe('red')
  })

  it('не должен создать копию файла с указанным расширением, если существует и файл, и копия', async () => {
    expect.hasAssertions()

    /** @type {Readonly<CopyFileInput>} */
    const fixture = {
      filePath: './user/green.txt',
      newExtension: '.bck',
      oldExtension: '.txt'
    }

    await expect(copyFile(fixture)).resolves.toBeUndefined()
    await expect(fs.readFile('./user/green.txt', 'utf-8')).resolves.toBe('green')
    await expect(fs.readFile('./user/green.bck', 'utf-8')).resolves.toBe('')
  })

  it('не должен создать копию файла с указанным расширением, если файл - это каталог', async () => {
    expect.hasAssertions()

    /** @type {Readonly<CopyFileInput>} */
    const fixture = {
      filePath: './user',
      newExtension: '.bck',
      oldExtension: '.txt'
    }

    await expect(copyFile(fixture)).resolves.toBeUndefined()
    await expect(fs.exists('./user')).resolves.toBeTruthy()
    await expect(fs.exists('./user.bck')).resolves.toBeFalsy()
    await expect(fs.exists('./user.txt')).resolves.toBeFalsy()
  })

  it('должен выбросить исключение, если файла не существует', async () => {
    expect.hasAssertions()

    /** @type {Readonly<CopyFileInput>} */
    const fixture = {
      filePath: './user/blue.txt',
      newExtension: '.bck',
      oldExtension: '.txt'
    }

    await expect(copyFile(fixture)).rejects.toThrow()
  })
})
