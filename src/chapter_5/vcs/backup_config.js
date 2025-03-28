import fs from 'fs-extra'
import { resolve } from 'node:path'

const CONFIG_FILE_NAME = '.backup_config.json'

/** @type {import('./backup_config.d.ts').BackupConfig} */
const DEFAULT_BACKUP_CONFIG = {
  lastManifestId: 0
}

/** @type {import('./backup_config.d.ts').Read} */
const read = async (dirPath) => {
  const filePath = resolve(dirPath, CONFIG_FILE_NAME)
  if (!(await fs.exists(filePath))) return DEFAULT_BACKUP_CONFIG
  try {
    const config = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(config)
  } catch (error) {
    return DEFAULT_BACKUP_CONFIG
  }
}

/** @type {import('./backup_config.d.ts').Update} */
const update = async (dirPath, config) => {
  const filePath = resolve(dirPath, CONFIG_FILE_NAME)
  return fs.writeFile(filePath, JSON.stringify(config))
}

export { read, update }
