import type { ManifestOptions } from './backup.d.ts'

export interface CreateManifestOptions {
  readonly dirPath: string
  readonly fileExtension: ManifestOptions['fileExtension']
  readonly filePathHashPairs: ReadonlyArray<[string, string]>
  readonly manifestId: string
  readonly username: string
}

export declare function create(opts: CreateManifestOptions): Promise<void>
export type Create = typeof create

export declare function migrate(dirPath: string): Promise<void>
export type Migrate = typeof migrate

export type ParseCsv = (csv: string) => CreateManifestOptions['filePathHashPairs']

export type StringifyManifest = (
  opts: Pick<CreateManifestOptions, 'fileExtension' | 'filePathHashPairs'>
) => string
export type StringifyManifest_ = (
  filePathHashPairs: CreateManifestOptions['filePathHashPairs']
) => string
