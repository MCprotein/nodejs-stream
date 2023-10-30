Readable 스트림에서 데이터를 수신하는 방법

- non-flowing (or paused) 모드
- flowing 모드

non-flowing 모드

리스너를 연결하는 작업이 포함되어 있으며 내부 버퍼가 비워질 때까지 데이터를 계속 읽는다.

내부 버퍼에서 동기적으로 데이터를 읽어 데이터 청크를 나타내는 Buffer 객체를 반환하는 read() 함수를 사용하여 수행할 수 있다.

read() 함수는 요청시 스트림에서 데이터를 강제로 가져온다.

Flowing 모드

데이터 이벤트에 리스너를 연결하면 스트림이 flowing 모드를 사용하도록 전환한다.

여기서 데이터는 read()를 사용하여 가져오지 않고, 대신 도착하자마자 데이터 리스너로 바로 전달된다.

<br/>
stream의 기본 동작모드는 non-flowing 모드이므로 flowing 모드를 활성화하려면 리스너를 데이터 이벤트에 연결하거나
resume() 함수를 명시적으로 호출해야 한다. <br/>
pause() 함수로 이벤트를 일시중지하여 들어오는 데이터를 내부 버퍼에 캐시할 수 있다. <br/>
pause()를 호출하면 non-flowing 모드로 전환된다.

<br/>
<br/>
사용자 지정 Readable 스트림을 구현하기 위해서는 Readable prototype을 상속하여 새로운 클래스를 만들어야 한다.<br/>
구현된 클래스는 _read()함수의 구현을 제공해야 한다.

```js
readable._read(size)
```

Readable 클래스는 내부적으로 \_read() 함수를 호출하는데 이 함수는 push() 함수를 사용하여 내부 버퍼를 채운다.<br/>

```js
readable.push(chunk)
```
