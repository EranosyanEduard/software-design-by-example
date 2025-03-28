import fs from 'fs-extra'
import { env } from 'node:process'
import * as backupConfigApi from './backup_config.js'
import * as manifestApi from './manifest.js'
import findNew from './check-existing-files.js'
import hashExisting from './hash-existing-async.js'

/** @type {import('./backup.d.ts').ManifestOptions} */
const DEFAULT_MANIFEST_OPTIONS = {
  fileExtension: 'csv',
  id: NaN
}

/** @type {import('./backup.d.ts').Backup} */
const backup = async (opts) => {
  const { dst, src, manifest: optionalManifest } = opts
  const config = await backupConfigApi.read(dst)
  const manifest = {
    ...DEFAULT_MANIFEST_OPTIONS,
    ...optionalManifest
  }
  const manifestId = Number.isNaN(manifest.id)
    ? config.lastManifestId.toString().padStart(10, '0')
    : manifest.id.toString()
  const existing = await hashExisting(src)
  const needToCopy = await findNew(dst, existing)
  await copyFiles(dst, needToCopy)
  await manifestApi.create({
    dirPath: dst,
    fileExtension: manifest.fileExtension,
    filePathHashPairs: existing,
    manifestId,
    username: env.USERNAME ?? ''
  })
  await backupConfigApi.update(dst, { lastManifestId: config.lastManifestId + 1 })
}

const copyFiles = async (dst, needToCopy) => {
  const promises = Object.keys(needToCopy).map((hash) => {
    const srcPath = needToCopy[hash]
    const dstPath = `${dst}/${hash}.bck`
    fs.copyFile(srcPath, dstPath)
  })
  return Promise.all(promises)
}

export default backup
