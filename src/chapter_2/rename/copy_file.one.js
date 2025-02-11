/** @import { CopyFileInput } from './copy_file.typedef' */
import fs from 'fs-extra'
import { resolve } from 'node:path'
import { cwd } from 'node:process'

/**
 * @param {CopyFileInput} input
 * @returns {Promise<void>}
 */
async function copyFile(input) {
  const { filePath, newExtension, oldExtension } = input
  const oldAbsoluteFilePath = resolve(cwd(), filePath)
  const newAbsoluteFilePath = oldAbsoluteFilePath.replace(oldExtension, newExtension)
  const stats = await fs.stat(oldAbsoluteFilePath)
  if (!stats.isFile() || (await fs.exists(newAbsoluteFilePath))) return
  await fs.copyFile(oldAbsoluteFilePath, newAbsoluteFilePath)
}

export default copyFile
