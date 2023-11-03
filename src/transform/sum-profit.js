import { Transform } from 'stream'

export class SumProfit extends Transform {
  constructor(options = {}) {
    options.objectMode = true
    super(options)
    this.total = 0
  }

  /**
   * 합계를 더하면서 this.push()를 호출하지 않는다.
   * 이것은 데이터가 스트림을 통해 흐르는 동안 값이 방출되지 않는것을 의미한다.
   * 하지만 별개로 현재 레코드가 처리되었고 다른 레코드를 수신할 준비가 되었음을 알리기 위해 cb()를 호출한다.
   */
  _transform(record, enc, cb) {
    this.total += Number.parseFloat(record.profit)
    cb()
  }

  /**
   * 모든 데이터가 처리되면 flush() 함수가 호출된다.
   * 따라서 최종 결과를 내보내려면 _flush() 함수를 구현하여 flush()의 동작을 정의해야 한다.
   * _flush()는 스트림이 닫히기 전에 자동으로 호출된다.
   * 여기서는 this.push()를 호출하여 합계를 스트림에 내보낸다.
   */
  _flush(cb) {
    this.push(this.total.toString())
    cb()
  }
}
