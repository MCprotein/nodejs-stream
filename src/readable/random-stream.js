import { Readable } from 'stream'
import Chance from 'chance'

const chance = new Chance()

/**
 * options
 * 버퍼를 문자열로 변환하는데 사용되는 인코딩 인자 (기본값 null)
 * 객체 모드를 활성화하는 플래그 (objectMode, 기본값 false)
 * 내부 버퍼에 저장된 데이터의 상한. 설정된 상한 이상의 데이터는 더 이상 읽지 않아야 한다. (highWaterMark, 기본값 16KB)
 */
export class RandomStream extends Readable {
  constructor(options) {
    super(options)
    this.emittedBytes = 0
  }

  _read(size) {
    const chunk = chance.string({ length: size })
    this.push(chunk, 'utf8')
    this.emittedBytes += chunk.length
    /**
     * 5% 확률로 스트림을 종료한다.
     */
    if (chance.bool({ likelihood: 5 })) {
      this.push(null)
    }
  }
}

const randomStream = new RandomStream()
randomStream
  .on('data', (chunk) => {
    console.log(`Chunk received (${chunk.length} bytes): ${chunk.toString()}`)
  })
  .on('end', () => {
    console.log(`Produced ${randomStream.emittedBytes} bytes of random data`)
  })

/**
 * 단순화된 생성자
 */

const randomStreamSimple = new Readable({
  read(size) {
    const chunk = chance.string({ length: size })
    console.log(`Pushing chunk of size: ${chunk.length}`)
    this.push(chunk, 'utf8')
    if (chance.bool({ likelihood: 5 })) {
      this.push(null)
    }
  }
})
