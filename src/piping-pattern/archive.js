import { createReadStream, createWriteStream } from 'fs'
import { pipeline } from 'stream'
import { randomBytes } from 'crypto'
import { createCompressAndEncrypt } from './combined-stream.js'

const [, , password, source] = process.argv
const iv = randomBytes(16)
const destination = `${source}.gz.enc`

pipeline(
  createReadStream(source),
  createCompressAndEncrypt(password, iv),
  createWriteStream(destination),
  (err) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    console.log(`${destination} created with iv: ${iv.toString('hex')}`)
  }
)

/**
 * 작동은 되는데 아래 에러 발생
 * (node:43639) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 close listeners added to [Cipheriv]. Use emitter.setMaxListeners() to increase limit
 * (Use `node --trace-warnings ...` to show where the warning was created)
 * Error [ERR_STREAM_PREMATURE_CLOSE]: Premature close
 *  at new NodeError (node:internal/errors:399:5)
 *  at Cipheriv.<anonymous> (node:internal/streams/pipeline:352:14)
 *  at Cipheriv.emit (node:events:525:35)
 *  at emitCloseNT (node:internal/streams/destroy:132:10)
 *  at process.processTicksAndRejections (node:internal/process/task_queues:81:21) {
  * code: 'ERR_STREAM_PREMATURE_CLOSE'
}
 */
