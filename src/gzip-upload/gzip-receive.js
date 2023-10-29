import { createServer } from 'http'
import { createWriteStream, existsSync, mkdirSync } from 'fs'
import { createGunzip } from 'zlib'
import { basename, join } from 'path'
import { createDecipheriv, randomBytes } from 'crypto'
const secret = randomBytes(24)
console.log(`Generated secret: ${secret.toString('hex')}`)

const server = createServer((req, res) => {
  const filename = basename(req.headers['x-filename'])

  const iv = Buffer.from(req.headers['x-initialization-vector'], 'hex')

  const filePath = 'received_files'
  const destFilename = join(filePath, filename)

  if (!existsSync(filePath)) {
    mkdirSync(filePath)
  }

  console.log(`File request received: ${filename}`)

  req
    .pipe(createDecipheriv('aes192', secret, iv))
    .pipe(createGunzip())
    .pipe(createWriteStream(destFilename))
    .on('error', (error) => {
      console.error(error)
    })
    .on('finish', () => {
      res.writeHead(201, { 'Content-Type': 'text/plain' })
      res.end('OK\n')
      console.log(`File saved: ${destFilename}`)
    })
})

server.listen(3000, () => console.log('Listening on http://localhost:3000'))
