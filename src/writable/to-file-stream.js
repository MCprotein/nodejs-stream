import { Writable } from 'stream'
import { promises as fs } from 'fs'
import { dirname, join } from 'path'
import { mkdirp } from 'mkdirp'

export class ToFileStream extends Writable {
  constructor(options) {
    super({ ...options, objectMode: true })
  }

  /**
   * object를 받아서 write stream으로 전달하므로 objectMode를 true로 설정한다.
   * highWaterMark: default 16KB backpressure를 위한 buffer size
   * decodeStrings: default true, string을 받아서 buffer로 변환한다. 이 옵션은 객체모드에서 무시된다.
   */
  _write(chunk, encoding, cb) {
    mkdirp(dirname(chunk.path))
      .then(() => fs.writeFile(chunk.path, chunk.content))
      .then(() => cb())
      .catch(cb)
  }
}

const tfs = new ToFileStream()
tfs.write({ path: join('files', 'file1.txt'), content: 'Hello' })
tfs.write({ path: join('files', 'file2.txt'), content: 'Node.js' })
tfs.write({ path: join('files', 'file3.txt'), content: 'streams' })
tfs.end(() => console.log('All files created'))

const tfsSimple = new Writable({
  objectMode: true,
  write(chunk, encoding, cb) {
    mkdirp(dirname(chunk.path))
      .then(() => fs.writeFile(chunk.path, chunk.content))
      .then(() => cb())
      .catch(cb)
  }
})
