<h1>Transform Stream</h1>

데이터 변환을 처리하도록 설계된 Duplex 스트림이다. <br/><br/>

일반적인 Duplex 스트림에서는 소켓처럼 입력과 출력의 관계를 알지 못한다.<br/>
하지만 Transform 스트림은 Writable 스트림쪽에서 각 데이터 청크를 변환한다음 Readable 스트림에서 사용할 수 있도록 한다.<br/>

<br/>

Transform 스트림을 구현하려면 \_transform()과 \_flush()를 구현해야 한다.
