import minimist from 'minimist'

class CliArgument {
  static Options = {
    DIR: new CliArgument({ arg: 'dir' }),
    FILES: new CliArgument({ arg: '_' }),
    OUTPUT: new CliArgument({ arg: 'output' }),
    SELECT: new CliArgument({ arg: 'select' }),
    TAG: new CliArgument({ arg: 'tag' })
  }

  /** @private */
  static defaultArgs() {
    return {
      [CliArgument.Options.DIR.shortArg]: '.',
      [CliArgument.Options.FILES.shortArg]: [],
      [CliArgument.Options.OUTPUT.shortArg]: 'terse',
      [CliArgument.Options.SELECT.shortArg]: '*',
      [CliArgument.Options.TAG.shortArg]: ''
    }
  }

  static parseArgs(args) {
    const cliArgs = CliArgument.defaultArgs()
    const parsedArgs = minimist(args)
    for (const arg in parsedArgs) {
      const shortArg = arg[0] ?? ''
      if (Object.hasOwn(cliArgs, shortArg)) {
        cliArgs[arg[0]] = parsedArgs[arg]
      } else {
        console.error(`неизвестная опция "${arg}"`)
      }
    }
    return cliArgs
  }

  constructor(options) {
    const { arg } = options
    this.arg = arg
    this.shortArg = arg[0]
  }

  toString() {
    return this.arg
  }
}

export default CliArgument
