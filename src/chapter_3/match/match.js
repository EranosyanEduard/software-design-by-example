/** @file Программа "Выбор подходящих строк", стр. 55 */
import { log, table } from 'node:console'
import { argv } from 'node:process'
import search from './search.one.js'

/** @returns {Promise<void>} */
async function match() {
  const [, , pattern = '', ...pathsToFiles] = argv
  const matches = await Promise.all(pathsToFiles.map((filePath) => search(filePath, pattern)))
  pathsToFiles.forEach((filePath, i) => {
    const lines = matches[i] ?? null
    if (lines === null) return
    log(`==> ${filePath} <==`)
    table(lines)
  })
}

export default match
