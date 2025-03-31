import type { HashFile } from './hash_file.d.ts'

export interface BackupOptions {
  readonly dst: string
  readonly src: string
  readonly hashFile?: HashFile
  readonly manifest?: Partial<ManifestOptions>
}

export interface ManifestOptions {
  readonly id: number
  readonly fileExtension: 'json' | 'csv'
}

declare function backup(opts: BackupOptions): Promise<void>
export type Backup = typeof backup

export default backup
