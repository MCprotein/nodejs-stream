import { Transform } from 'stream'

export class FilterByCountry extends Transform {
  constructor(country, options = {}) {
    options.objectMode = true
    super(options)
    this.country = country
  }

  _transform(record, enc, cb) {
    if (record.country === this.country) {
      this.push(record)
    }
    /**
     * 레코드 일치 여부에 관계없이 cb()를 호출하여 현재 레코드가 성공적으로 처리되었으며,
     * 스트림이 다른 레코드를 수신할 준비가 되었음을 알린다.
     */
    cb()
  }
}

\