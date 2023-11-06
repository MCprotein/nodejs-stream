import { Transform } from 'stream'

/**
 * 1. userTransform() 함수는 사용자가 정의한 함수이다.
 * 2. userTransform() 함수가 끝나는것을 기다리지 않고 done() 함수를 호출한다.
 *    userTransform() 함수에 this._onComplete() 함수가 콜백으로 전달된다.
 * 3. _flush() 함수는 스트림이 종료되기 직전에 호출되는데, 아직 작업이 실행중이면 done() 함수를호출하지 않고 this.terminateCb 변수에 저장한다.
 * 4. 스트림이 제대로 종료되는 방법을 이해하려면 _onComplete() 함수를 살펴봐야 한다.
 *    이 함수는 비동기 작업이 완료될 때마다 호출되며, 이때마다 this.running을 감소시킨다.
 *    작업이 없으면 this.terminateCb()를 호출하여 스트림을 종료한다.
 */
export class ParallelStream extends Transform {
  constructor(userTransform, options) {
    super({ objectMode: true, ...options })
    this.userTransform = userTransform
    this.running = 0
    this.terminateCb = null
  }

  _transform(chunk, enc, done) {
    this.running++
    this.userTransform(chunk, enc, this.push.bind(this), this._onComplete.bind(this))
    done()
  }

  _flush(done) {
    if (!this.running) done()

    this.terminateCb = done
  }

  _onComplete(err) {
    this.running--
    if (err) return this.emit('error', err)
    if (!this.running) this.terminateCb && this.terminateCb()
  }
}
