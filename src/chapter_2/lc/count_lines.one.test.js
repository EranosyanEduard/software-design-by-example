import mock from 'mock-fs'
import { describe, expect, it } from 'vitest'
import countLines from './count_lines.one'

describe('тест утилиты "count_lines.one"', () => {
  mock({
    user: {
      empty_dir: {},
      non_empty_dir: {
        'rgb.txt': 'red\ngreen\nblue\n'
      }
    }
  })

  it('должен вернуть количество строк в файле, если он существует', async () => {
    expect.hasAssertions()
    await expect(countLines('./user/non_empty_dir/rgb.txt')).resolves.toBe(3)
  })

  it('должен вернуть "null", если файл - это каталог', async () => {
    expect.hasAssertions()
    await expect(countLines('./user/empty_dir')).resolves.toBeNull()
  })

  it('должен выбросить исключение, если файла не существует', async () => {
    expect.hasAssertions()
    await expect(countLines('./errors')).rejects.toThrow()
  })
})
