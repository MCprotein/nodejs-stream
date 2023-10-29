import { request } from 'http'
import { createGzip } from 'zlib'
import { createReadStream } from 'fs'
import { basename } from 'path'
import { createCipheriv, randomBytes } from 'crypto'

const [_, __, filename, serverHost, secret] = process.argv
const secretBuffer = Buffer.from(secret, 'hex')

const iv = randomBytes(16)

const httpRequestOptions = {
  hostname: serverHost,
  port: 3000,
  path: '/',
  method: 'PUT',
  headers: {
    'Content-Type': 'application/octet-stream',
    'Content-Encoding': 'gzip',
    'X-Filename': basename(filename),
    'X-Initialization-Vector': iv.toString('hex')
  }
}

const req = request(httpRequestOptions, (res) => [
  console.log(`Server response: ${res.statusCode}`)
])

createReadStream(filename)
  .pipe(createGzip())
  .pipe(createCipheriv('aes192', secretBuffer, iv))
  .pipe(req)
  .on('error', (error) => {
    console.error(error)
  })
  .on('finish', () => {
    console.log('File successfully sent')
    process.exit(0)
  })
