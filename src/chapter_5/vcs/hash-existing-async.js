import fs from 'fs-extra'
import { glob } from 'glob'

// [main]
const statPath = async (path) => {
  const stat = await fs.stat(path)
  return [path, stat]
}

const readPath = async (path) => {
  const content = await fs.readFile(path, 'utf-8')
  return [path, content]
}

const hashExisting = async ({ hashFile, rootDir }) => {
  const pattern = `${rootDir}/**/*`
  const options = {}
  const matches = await glob(pattern, options)
  const stats = await Promise.all(matches.map((path) => statPath(path)))
  const files = stats.filter(([, stat]) => stat.isFile())
  const contents = await Promise.all(files.map(([path]) => readPath(path)))
  const hashes = contents.map(([path, content]) => [path, hashFile(content)])
  return hashes
}
// [/main]

export default hashExisting
