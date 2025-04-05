/** @import { LogFile, Typedef } from './log_file.d.js' */
import { isEmpty, isObject } from 'es-toolkit/compat'
import { glob } from 'glob'
import { basename, resolve } from 'node:path'
import { diff } from './manifest.js'

/** @type {Typedef.DiffState} */
const DiffState = {
  CREATED: 'created',
  REMOVED: 'removed',
  CHANGED: 'changed',
  RENAMED: 'renamed'
}

/** @type {LogFile} */
const logFile = async ({ filePath, manifests = null }) => {
  const manifests_ = manifests ?? (await glob(resolve('**/*.{csv,json}')))
  const alphabeticSortedManifests = manifests_.toSorted((a, b) => a.localeCompare(b))
  /** @type {Awaited<ReturnType<typeof logFile>>} */
  const log = []
  for (let i = alphabeticSortedManifests.length - 1; i > 0; i--) {
    const newManifestFilePath = alphabeticSortedManifests[i]
    const newManifestFileName = basename(newManifestFilePath)
    const oldManifestFilePath = alphabeticSortedManifests[i - 1]
    const oldManifestFileName = basename(oldManifestFilePath)
    const { changed, created, removed, renamed } = await diff(
      oldManifestFilePath,
      newManifestFilePath
    )
    const renamedFile = renamed.find((renamedFile) => renamedFile.new === filePath) ?? null
    if (isObject(renamedFile)) {
      return log.concat(
        [[newManifestFileName, DiffState.RENAMED]],
        await logFile({
          filePath: renamedFile.old,
          manifests: alphabeticSortedManifests.slice(0, i)
        })
      )
    }
    if (created.includes(filePath)) {
      return log.concat([[newManifestFileName, DiffState.CREATED]])
    }
    if (changed.includes(filePath)) {
      log.push([newManifestFileName, DiffState.CHANGED])
    } else if (removed.includes(filePath)) {
      log.push([newManifestFileName, DiffState.REMOVED])
    }
    if (!isEmpty(log) && i === 1) {
      log.push([oldManifestFileName, DiffState.CREATED])
    }
  }
  return log
}

export { DiffState, logFile }
