import { glob } from 'glob'
import _isEmpty from 'lodash-es/isEmpty.js'
import { log } from 'node:console'
import { argv } from 'node:process'
import CliArgument from './cli_arg.js'
import hope from './hope.js'

async function main() {
  const [, , ...args] = argv
  const parsedArgs = CliArgument.parseArgs(args)
  const dir = parsedArgs[CliArgument.Options.DIR.shortArg]
  const output = parsedArgs[CliArgument.Options.OUTPUT.shortArg]
  const select = parsedArgs[CliArgument.Options.SELECT.shortArg]
  const tagName = parsedArgs[CliArgument.Options.TAG.shortArg]
  let files = parsedArgs[CliArgument.Options.FILES.shortArg]
  if (_isEmpty(files)) {
    files = await glob(`${dir}/**/${select}._test_.js`, { absolute: true })
  }
  await Promise.all(files?.map((filename) => import(filename)))
  await hope.run({ tagName })
  switch (output) {
    case 'terse':
      log(hope.terse())
      break
    case 'verbose':
      log(hope.verbose())
      break
  }
}

main()
