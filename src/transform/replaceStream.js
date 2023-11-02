import { Transform } from 'stream'

export class ReplaceStream extends Transform {
  constructor(searchStr, replaceStr, options) {
    super({ ...options, decodeStrings: false })
    this.searchStr = searchStr
    this.replaceStr = replaceStr
    this.tail = ''
  }

  _transform(chunk, encoding, cb) {
    const pieces = (this.tail + chunk).split(this.searchStr)
    const lastPiece = pieces[pieces.length - 1]
    const tailLen = this.searchStr.length - 1
    this.tail = lastPiece.slice(-tailLen)
    pieces[pieces.length - 1] = lastPiece.slice(0, -tailLen)

    this.push(pieces.join(this.replaceStr))
    cb()
  }

  _flush(callback) {
    this.push(this.tail)
    callback()
  }
}

const replaceStream = new ReplaceStream('World', 'Node.js')
replaceStream.on('data', (chunk) => console.log(chunk.toString()))
replaceStream.write('Hello W')
replaceStream.write('orld!')
replaceStream.end()

const searchStr = 'World'
const replaceStr = 'Node.js'
let tail = ''
const replaceStreamSimple = new Transform({
  defaultEncoding: 'utf8',

  transform(chunk, encoding, callback) {
    const pieces = (tail + chunk).split(searchStr)
    const lastPiece = pieces[pieces.length - 1]
    const tailLen = searchStr.length - 1
    tail = lastPiece.slice(-tailLen)
    pieces[pieces.length - 1] = lastPiece.slice(0, -tailLen)
    this.push(pieces.join(replaceStr))
    cb()
  },

  flush(cb) {
    this.push(tail)
    cb()
  }
})
