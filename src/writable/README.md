<h1>Writable Stream</h1>

Backpressure

`<br/><br/>`

스트림이 소비되는 속도보다 더 빨리 데이터가 기록되는 병목현상이 발생할 수 있다.`<br/>`

이것을 방지하기 위해 writable.write()는 highWaterMark 제한을 초과하면 false를 반환한다.`<br/>`

highWaterMark는 내부 버퍼 크기의 제한으로, 버퍼가 비워지면 drain 이벤트가 발생하여 다시 쓰기를 시작해도 안전하다는것을 알린다. `<br/>`

이런 메커니즘이 BackPressure인데, 이것은 권고 메커니즘이고 무시하고 계속 스트림 쓰기를 해도 된다. 다만 메모리 사용량이 많아진다. `<br/>`

highWaterMark를 초과한다고 해서 스트림이 자동으로 차단되지는 않는다.`<br/>`
