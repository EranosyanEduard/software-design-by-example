import type { ManifestOptions } from './backup.d.ts'

export namespace Typedef {
  export interface CreateManifestOptions {
    readonly dirPath: string
    readonly fileExtension: ManifestOptions['fileExtension']
    readonly filePathHashPairs: ReadonlyArray<[string, string]>
    readonly manifestId: string
    readonly username: string
  }

  export interface DiffResult {
    readonly changed: ReturnType<FindChangedFiles>
    readonly created: ReturnType<FindCreatedFiles>
    readonly renamed: ReturnType<FindRenamedFiles>
    readonly removed: ReturnType<FindRemovedFiles>
  }
  export type FindChangedFiles = (
    oldManifest: ReturnType<ParseManifestJson>,
    newManifest: ReturnType<ParseManifestJson>
  ) => string[]
  export type FindCreatedFiles = (
    opts: Omit<FindUniqueFilesArgs, 'diff'>
  ) => ReturnType<FindUniqueFiles>
  export type FindRenamedFiles = (
    oldManifest: ReturnType<ParseManifestJson>,
    newManifest: ReturnType<ParseManifestJson>
  ) => Array<{ readonly old: string; readonly new: string }>
  export type FindRemovedFiles = (
    opts: Omit<FindUniqueFilesArgs, 'diff'>
  ) => ReturnType<FindUniqueFiles>
  export type FindUniqueFiles = (opts: FindUniqueFilesArgs) => string[]
  interface FindUniqueFilesArgs {
    readonly diff: (filePath: string, renamedFile: ReturnType<FindRenamedFiles>[number]) => boolean
    readonly oldManifest: ReturnType<ParseManifestJson>
    readonly newManifest: ReturnType<ParseManifestJson>
    readonly renamedFiles: ReturnType<FindRenamedFiles>
  }

  export type ObjectifyManifest = (
    parsedManifest: ParseManifestResult
  ) => ReturnType<ParseManifestJson>

  export type ParseManifestCsv = ParseManifest_<CreateManifestOptions['filePathHashPairs']>
  export type ParseManifestJson = ParseManifest_<Record<string, string>>
  type ParseManifest_<R> = (stringifyManifest: string) => R
  type ParseManifest = (opts: ParseManifestArgs) => ParseManifestResult
  interface ParseManifestArgs {
    readonly manifestFilePath: string
    readonly stringifyManifest: string
  }
  type ParseManifestResult = ReturnType<ParseManifestCsv | ParseManifestJson>

  export type ReadManifest = (filePath: string) => Promise<ParseManifestResult>

  export type StringifyManifest = (
    opts: Pick<CreateManifestOptions, 'fileExtension' | 'filePathHashPairs'>
  ) => string
  export type StringifyManifest_ = (
    filePathHashPairs: CreateManifestOptions['filePathHashPairs']
  ) => string
}

export declare function create(opts: Typedef.CreateManifestOptions): Promise<void>
export type Create = typeof create

export declare function diff(
  oldManifestFilePath: string,
  newManifestFilePath: string
): Promise<Typedef.DiffResult>
export type Diff = typeof diff

export declare function migrate(dirPath: string): Promise<void>
export type Migrate = typeof migrate
