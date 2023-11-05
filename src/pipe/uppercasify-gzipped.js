import { createGzip, createGunzip } from 'zlib'
import { Transform, pipeline } from 'stream'

/**
 * echo 'Hello World!' | gzip | node src/pipe/uppercasify-gzipped.js | gunzip
 */

const uppercasify = new Transform({
  transform(chunk, enc, cb) {
    this.push(chunk.toString().toUpperCase())
    cb()
  }
})

pipeline(process.stdin, createGunzip(), uppercasify, createGzip(), process.stdout, (err) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
})
