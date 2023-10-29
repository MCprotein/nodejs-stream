import { createServer } from 'http'
import { createWriteStream, existsSync, mkdirSync } from 'fs'
import { createGunzip } from 'zlib'
import { basename, join } from 'path'

const server = createServer((req, res) => {
  const filename = basename(req.headers['x-filename'])
  const filePath = 'received_files'
  const destFilename = join(filePath, filename)

  if (!existsSync(filePath)) {
    mkdirSync(filePath)
  }

  console.log(`File request received: ${filename}`)

  req
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
