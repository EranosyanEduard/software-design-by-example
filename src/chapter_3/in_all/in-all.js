/** @file Программа "Поиск строк во всех файлах", стр. 55 */
import { log } from 'node:console'
import { argv } from 'node:process'
import intersection from './intersection.js'

/** @returns {Promise<void>} */
async function inAll() {
  const [, , ...pathsToFiles] = argv
  const matches = await intersection(pathsToFiles)
  matches.forEach((match) => log(match))
}

export default inAll
