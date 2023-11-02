<h1>Duplex Stream</h1>
Duplex 스트림은 읽기, 쓰기가 모두 가능한 스트림이다.<br/>
즉, stream.Readable, stream.Writable 두 스트림의 함수를 상속받는다.<br/>
<br/>
_read(), _write()를 모두 구현해야하고, options는 Readable, Writable 모두에게 전달된다.<br/>
allowHalfOpen(default: true)가 false이면 Readable, Writable 중 하나의 스트림이 끝날때 다른 스트림도 종료된다.<br/>
<br/>
ReadableObjectMode, WritableObjectMode를 각각 사용할 수 있다.
<br/>
