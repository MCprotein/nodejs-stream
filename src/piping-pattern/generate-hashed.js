import { createReadStream, createWriteStream } from 'fs'
import { createHash } from 'crypto'

/**
 * pipe()를 호출할 때 { end: false }를 옵션으로 안하면 md5Stream, sha1Stream은 inputStream이 종료될때
 * 자동으로 종료된다.
 * 분기된 스트림은 동일한 청크를 수신한다.
 * 배압(Backpressure)은 바로 발생한다. InputStream에서 오는 흐름은 매우 빠르지만 분기된 스트림은 느리다.
 * 소스(비동기 파이핑)에서 데이터 사용을 시작한 후 추가적인 스트림으로 파이프하면 새로운 스트림은
 * 파이프된 이후의 새로운 데이터 청크만 수신한다.
 */

const filename = process.argv[2]
const sha1Stream = createHash('sha1').setEncoding('hex')
const md5Stream = createHash('md5').setEncoding('hex')
const inputStream = createReadStream(filename)

inputStream.pipe(sha1Stream).pipe(createWriteStream(`${filename}.sha1`))

inputStream.pipe(md5Stream).pipe(createWriteStream(`${filename}.md5`))

inputStream
  .on('data', (chunk) => {
    console.log(String(chunk))
  })
  .on('end', () => {
    console.log('끝1')
  })

inputStream
  .on('data', (chunk) => {
    console.log(String(chunk) + '와우')
  })
  .on('end', () => {
    console.log('끝2')
  })

inputStream
  .on('data', (chunk) => {
    console.log(String(chunk) + '와우2')
  })
  .on('end', () => {
    console.log('끝3')
  })
