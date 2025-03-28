export interface BackupConfig {
  readonly lastManifestId: number
}

export declare function read(dirPath: string): Promise<BackupConfig>
export type Read = typeof read

export declare function update(dirPath: string, config: BackupConfig): Promise<void>
export type Update = typeof update
