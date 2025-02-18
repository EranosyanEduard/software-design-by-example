/** @file "Нахождение различий между 2-мя файлами", стр. 56 */
import { log } from 'node:console'
import { argv } from 'node:process'
import { intersection } from '../in_all/index.js'
import difference from './difference.js'

/** @enum {string} */
const Marker = {
  FILE_A: '1',
  FILE_B: '2',
  MATCH: '*'
}

/** @returns {Promise<void>} */
async function fileDiff() {
  const [, , pathToFileA = '', pathToFileB = ''] = argv
  const diffsA = await difference(pathToFileA, pathToFileB)
  const diffsB = await difference(pathToFileB, pathToFileA)
  const matches = await intersection([pathToFileA, pathToFileB])
  log(`==> ${pathToFileA} <==`)
  diffsA.forEach((diff) => {
    log(Marker.FILE_A, diff)
  })
  log(`\n==> ${pathToFileB} <==`)
  diffsB.forEach((diff) => {
    log(Marker.FILE_B, diff)
  })
  log(`\n==> ${pathToFileA} & ${pathToFileB} <==`)
  matches.forEach((match) => {
    log(Marker.MATCH, match)
  })
}

export default fileDiff
