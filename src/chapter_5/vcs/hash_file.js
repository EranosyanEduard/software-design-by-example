import crypto from 'crypto'

/** @type {import('./hash_file.d.ts').HashFile} */
const hashPath = (content) => {
  const hasher = crypto.createHash('sha1').setEncoding('hex')
  hasher.write(content)
  hasher.end()
  return hasher.read()
}

export default hashPath
