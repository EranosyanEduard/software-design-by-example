/** @file программа "подсчёт строк", стр. 34 */
import { log } from 'node:console'
import { argv } from 'node:process'
import countLines from './count_lines.one.js'

/** @returns {Promise<void>} */
async function lc() {
  const [, , ...pathsToFiles] = argv
  const filesLines = await Promise.all(pathsToFiles.map(countLines))
  let totalLines = 0
  pathsToFiles.forEach((filePath, i) => {
    const fileTotalLines = filesLines[i] ?? 0
    totalLines += fileTotalLines
    log(`${filePath}: ${fileTotalLines}`)
  })
  log(`total lines: ${totalLines}`)
}

export default lc
