import { invert } from 'es-toolkit/object'
import fs from 'fs-extra'
import { glob } from 'glob'
import { basename, resolve } from 'node:path'

/** @type {import('./manifest.d.ts').Typedef.ObjectifyManifest} */
const objectifyManifest = (parsedManifest) => {
  return Array.isArray(parsedManifest)
    ? parsedManifest.reduce((acc, [filePath, fileHash]) => {
        acc[filePath] = fileHash
        return acc
      }, {})
    : parsedManifest
}

/** @type {import('./manifest.d.ts').Typedef.ParseManifestCsv} */
const parseManifestCsv = (csv) => {
  return csv.split('\n').map((filePathHashPair) => filePathHashPair.split(','))
}

/** @type {import('./manifest.d.ts').Typedef.ParseManifestJson} */
const parseManifestJson = (json) => {
  return JSON.parse(json)
}

/** @type {import('./manifest.d.ts').Typedef.ParseManifest} */
const parseManifest = ({ manifestFilePath, stringifyManifest }) => {
  if (manifestFilePath.endsWith('.csv')) return parseManifestCsv(stringifyManifest)
  if (manifestFilePath.endsWith('.json')) return parseManifestJson(stringifyManifest)
  throw new Error('Недопустимое расширение файла манифеста')
}

/** @type {import('./manifest.d.ts').Typedef.ReadManifest} */
const readManifest = async (filePath) => {
  const content = await fs.readFile(resolve(filePath), 'utf-8')
  return parseManifest({
    manifestFilePath: filePath,
    stringifyManifest: content
  })
}

/** @type {import('./manifest.d.ts').Typedef.StringifyManifest_} */
const stringifyManifestCsv = (filePathHashPairs) => {
  return filePathHashPairs.map(([path, hash]) => `${path},${hash}`).join('\n')
}

/** @type {import('./manifest.d.ts').Typedef.StringifyManifest_} */
const stringifyManifestJson = (filePathHashPairs) => {
  const dict = filePathHashPairs.reduce((acc, [path, hash]) => {
    acc[path] = hash
    return acc
  }, {})
  return JSON.stringify(dict)
}

/** @type {import('./manifest.d.ts').Typedef.StringifyManifest} */
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

/** @type {import('./manifest.d.ts').Typedef.FindChangedFiles} */
const findChangedFiles = (oldManifest, newManifest) => {
  const oldFilePaths = new Set(Object.keys(oldManifest))
  const newFilePaths = new Set(Object.keys(newManifest))
  const sameFilePaths = oldFilePaths.intersection(newFilePaths)
  const changed = []
  for (const filePath of sameFilePaths) {
    if (oldManifest[filePath] !== newManifest[filePath]) {
      changed.push(filePath)
    }
  }
  return changed
}

/** @type {import('./manifest.d.ts').Typedef.FindRenamedFiles} */
const findRenamedFiles = (oldManifest, newManifest) => {
  const invertedOldManifest = invert(oldManifest)
  const invertedNewManifest = invert(newManifest)
  const oldFilePaths = new Set(Object.values(oldManifest))
  const newFilePaths = new Set(Object.values(newManifest))
  const sameFileHashes = oldFilePaths.intersection(newFilePaths)
  const renamed = []
  for (const fileHash of sameFileHashes) {
    const oldFilePath = invertedOldManifest[fileHash]
    const newFilePath = invertedNewManifest[fileHash]
    if (oldFilePath !== newFilePath)
      renamed.push({
        old: oldFilePath,
        new: newFilePath
      })
  }
  return renamed
}

/** @type {import('./manifest.d.ts').Typedef.FindUniqueFiles} */
const findUniqueFiles = (opts) => {
  const { diff, newManifest, oldManifest, renamedFiles } = opts
  const oldFilePaths = new Set(Object.keys(oldManifest))
  const newFilePaths = new Set(Object.keys(newManifest))
  const diffFilePaths = oldFilePaths.difference(newFilePaths)
  const uniqueFiles = []
  for (const filePath of diffFilePaths) {
    if (renamedFiles.every((renamedFile) => diff(filePath, renamedFile))) {
      uniqueFiles.push(filePath)
    }
  }
  return uniqueFiles
}

/** @type {import('./manifest.d.ts').Typedef.FindCreatedFiles} */
const findCreatedFiles = (opts) => {
  const { newManifest, oldManifest, renamedFiles } = opts
  return findUniqueFiles({
    diff: (filePath, renamedFile) => filePath !== renamedFile.new,
    newManifest: oldManifest,
    oldManifest: newManifest,
    renamedFiles
  })
}

/** @type {import('./manifest.d.ts').Typedef.FindRemovedFiles} */
const findRemovedFiles = (opts) => {
  const { newManifest, oldManifest, renamedFiles } = opts
  return findUniqueFiles({
    diff: (filePath, renamedFile) => filePath !== renamedFile.old,
    newManifest,
    oldManifest,
    renamedFiles
  })
}

/** @type {import('./manifest.d.ts').Diff} */
const diff = async (oldManifestFilePath, newManifestFilePath) => {
  const oldManifest = objectifyManifest(await readManifest(oldManifestFilePath))
  const newManifest = objectifyManifest(await readManifest(newManifestFilePath))
  const changed = findChangedFiles(oldManifest, newManifest)
  const renamed = findRenamedFiles(oldManifest, newManifest)
  const created = findCreatedFiles({
    newManifest,
    oldManifest,
    renamedFiles: renamed
  })
  const removed = findRemovedFiles({
    newManifest,
    oldManifest,
    renamedFiles: renamed
  })
  return { changed, created, renamed, removed }
}
/** @type {import('./manifest.d.ts').Migrate} */
const migrate = async (dirPath) => {
  const allManifestFilePaths = await glob(resolve(dirPath, '*.csv'))
  for (const filePath of allManifestFilePaths) {
    const [usernamePair = [], ...filePathHashPairs] = await readManifest(filePath)
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

export { create, diff, migrate }
