import splitByLines from './split_by_lines.one.js'

/**
 * @param {string} filePath
 * @returns {Promise<?number>}
 */
async function countLines(filePath) {
  const fileLines = await splitByLines(filePath)
  return Array.isArray(fileLines) ? fileLines.length - 1 : null
}

export default countLines
