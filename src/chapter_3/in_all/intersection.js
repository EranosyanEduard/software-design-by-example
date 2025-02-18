import { splitByLines } from '../../chapter_2/lc/index.js'

/**
 * @param {readonly string[]} pathsToFiles
 * @returns {Promise<string[]>}
 */
async function intersection(pathsToFiles) {
  const [head = [], ...tail] = await Promise.all(pathsToFiles.map(splitByLines))
  return tail.length === 0
    ? []
    : [...tail.reduce((acc, lines) => acc.intersection(new Set(lines)), new Set(head))]
}

export default intersection
