import { splitByLines } from '../../chapter_2/lc/index.js'

/**
 * @param {string} filePathA
 * @param {string} filePathB
 * @returns {Promise<string[]>}
 */
async function difference(filePathA, filePathB) {
  const fileLinesA = (await splitByLines(filePathA)) ?? []
  const fileLinesB = (await splitByLines(filePathB)) ?? []
  return [...new Set(fileLinesA).difference(new Set(fileLinesB))]
}

export default difference
