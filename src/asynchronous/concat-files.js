import { createWriteStream, createReadStream } from 'fs'
import { Readable, Transform } from 'stream'

/**
 * 1. Readable.from()으로 Readable 스트림을 만든다.
 *    파일을 읽어서 스트림으로 읽는것이기때문에 chunk는 파일 이름, 즉 파일 경로를 나타낸다.
 * 2. 파일을 처리할 Transform 스트림을 만든다. chunk는 object이기때문에 objectMode를 활성화하고 createReadStream()으로 파일을 읽는다.
 *    pipe() 옵션에 end: false를 주어 파일 읽기를 완료한 후에도 destStream이 닫히지 않도록 한다.
 * 3. 파일의 모든 내용이 destStream으로 전송되면 done 함수를 호출하여 다음 chunk를 처리한다.
 * 4. 모든 파일이 처리되면 종료 이벤트가 발생하며 destStream을 종료하고 concatFiles()의 cb()함수를 호출하여 전체 작업이 완료되었음을 알린다.
 */
export function concatFiles(dest, files) {
  return new Promise((resolve, reject) => {
    const destStream = createWriteStream(dest)
    Readable.from(files)
      .pipe(
        new Transform({
          objectMode: true,
          transform(filename, enc, done) {
            const src = createReadStream(filename)
            src.pipe(destStream, { end: false })
            src.on('error', done)
            src.on('end', done)
          }
        })
      )
      .on('error', reject)
      .on('finish', () => {
        destStream.end()
        resolve()
      })
  })
}

async function main() {
  try {
    await concatFiles(process.argv[2], process.argv.slice(3))
  } catch (error) {
    console.error(error)
    process.exit(1)
  }

  console.log('All files have been concatenated successfully')
}

main()
