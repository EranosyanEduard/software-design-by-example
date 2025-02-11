import fs from 'fs-extra'
import { resolve } from 'node:path'
import { cwd } from 'node:process'

/**
 * @param {string} filePath
 * @returns {Promise<?number>}
 */
async function countLines(filePath) {
  const absoluteFilePath = resolve(cwd(), filePath)
  const stats = await fs.stat(absoluteFilePath)
  if (stats.isFile()) {
    const content = await fs.readFile(absoluteFilePath, 'utf-8')
    return content.split('\n').length - 1
  }
  return null
}

export default countLines
