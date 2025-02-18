/** @file программа "head", стр. 54 */
import { log } from 'node:console'
import { argv } from 'node:process'
import { splitByLines } from '../../chapter_2/lc/index.js'

/** @returns {Promise<void>} */
async function head() {
  const [, , totalLines = '5', ...pathsToFiles] = argv
  const totalLines_ = Number(totalLines)
  const filesLines = await Promise.all(pathsToFiles.map(splitByLines))
  pathsToFiles.forEach((filePath, i) => {
    log(`==> ${filePath} <==`)
    log(filesLines[i]?.slice(0, totalLines_).join('\n'))
  })
}

export default head
