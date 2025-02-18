import { countLines } from '../../chapter_2/lc/index.js'

/**
 * @param {readonly string[]} pathsToFiles
 * @returns {Promise<Record<string, number>>}
 */
async function histogram(pathsToFiles) {
  const filesLines = await Promise.all(pathsToFiles.map(countLines))
  return filesLines.reduce((acc, fileTotalLines) => {
    if (typeof fileTotalLines === 'number') {
      acc[fileTotalLines] ??= 0
      acc[fileTotalLines]++
    }
    return acc
  }, {})
}

export default histogram
