Node.js의 모든 스트림은 아래 네 가지 기본 추상 클래스중 하나의 구현이다.

- Readable
- Writable
- Duplex
- Transform

각 스트림 클래스는 EventEmitter의 인스턴스이다.

읽기 스트림: 읽기 마쳤을 때 end 이벤트
쓰기 스트림: 쓰기 마쳤을 때 finish 이벤트
에러 발생시: error 이벤트
