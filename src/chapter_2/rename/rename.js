/** @file программа "переименование файлов", стр. 34 */
import { argv } from 'node:process'
import copyFile from './copy_file.one.js'

/** @returns {Promise<void>} */
async function rename() {
  const [, , oldExtension = '', newExtension = '', ...pathsToFiles] = argv
  const promises = pathsToFiles.map((filePath) =>
    copyFile({ filePath, newExtension, oldExtension })
  )
  await Promise.all(promises)
}

export default rename
