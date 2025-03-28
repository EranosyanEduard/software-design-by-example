import fs from 'fs-extra'
import { glob } from 'glob'
import { basename, resolve } from 'node:path'

/** @type {import('./manifest.d.ts').ParseCsv} */
const parseCsv = (csv) => {
  return csv.split('\n').map((filePathHashPair) => filePathHashPair.split(','))
}

/** @type {import('./manifest.d.ts').StringifyManifest_} */
const stringifyManifestCsv = (filePathHashPairs) => {
  return filePathHashPairs.map(([path, hash]) => `${path},${hash}`).join('\n')
}

/** @type {import('./manifest.d.ts').StringifyManifest_} */
const stringifyManifestJson = (filePathHashPairs) => {
  const dict = filePathHashPairs.reduce((acc, [path, hash]) => {
    acc[path] = hash
    return acc
  }, {})
  return JSON.stringify(dict)
}

/** @type {import('./manifest.d.ts').StringifyManifest} */
const stringifyManifest = (opts) => {
  const { fileExtension, filePathHashPairs } = opts
  switch (fileExtension) {
    case 'csv':
      return stringifyManifestCsv(filePathHashPairs)
    case 'json':
      return stringifyManifestJson(filePathHashPairs)
  }
  throw new Error('Недопустимое расширение файла манифеста')
}

/** @type {import('./manifest.d.ts').Create} */
const create = async (opts) => {
  const { dirPath, fileExtension, filePathHashPairs, manifestId, username } = opts

  const content = stringifyManifest({
    fileExtension,
    filePathHashPairs: [['username', username], ...filePathHashPairs.toSorted()]
  })
  const filePath = resolve(dirPath, `${manifestId}.${fileExtension}`)
  await fs.writeFile(filePath, content, 'utf-8')
}

/** @type {import('./manifest.d.ts').Migrate} */
const migrate = async (dirPath) => {
  const allManifestFilePaths = await glob(resolve(dirPath, '*.csv'))
  for (const filePath of allManifestFilePaths) {
    const content = await fs.readFile(filePath, 'utf-8')
    const [usernamePair = [], ...filePathHashPairs] = parseCsv(content)
    const [, username = ''] = usernamePair
    await create({
      dirPath,
      fileExtension: 'json',
      filePathHashPairs,
      manifestId: basename(filePath, '.csv'),
      username
    })
    await fs.remove(filePath)
  }
}

export { create, migrate }
