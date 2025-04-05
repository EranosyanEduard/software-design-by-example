export namespace Typedef {
  export type FileState = 'changed' | 'created' | 'removed' | 'renamed'

  export type DiffState = Record<Uppercase<FileState>, FileState>

  export interface LogFileArgs {
    readonly filePath: string
    readonly manifests?: readonly string[]
  }
}

export declare const DiffState: Typedef.DiffState

export declare function logFile(
  opts: Typedef.LogFileArgs
): Promise<Array<[string, Typedef.FileState]>>
export type LogFile = typeof logFile
