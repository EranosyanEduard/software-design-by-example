/** @file программа "гистограмма счётчиков строк", стр. 55 */
import { glob } from 'glob'
import { log, table } from 'node:console'
import { resolve } from 'node:path'
import { argv, cwd } from 'node:process'
import histogram from './histogram.js'

/** @returns {Promise<void>} */
async function lh() {
  const [, , rootPath = '.'] = argv
  const absoluteRootPath = resolve(cwd(), rootPath)
  const pathsToFiles = await glob(`${absoluteRootPath}/**/*.*`)
  const histogram_ = await histogram(pathsToFiles)
  log('Количество строк в файле | Количество файлов')
  table(histogram_)
}

export default lh
