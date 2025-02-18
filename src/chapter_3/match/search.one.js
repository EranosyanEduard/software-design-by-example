import { splitByLines } from '../../chapter_2/lc/index.js'

/**
 * @param {string} filePath
 * @param {string} pattern
 * @returns {Promise<?Record<string, string>>}
 */
async function search(filePath, pattern) {
  const fileLines = await splitByLines(filePath)
  if (Array.isArray(fileLines)) {
    return fileLines.reduce((acc, line, i) => {
      if (line.includes(pattern)) {
        acc[i + 1] = line
      }
      return acc
    }, {})
  }
  return null
}

export default search
