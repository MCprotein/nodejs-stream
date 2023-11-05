<h1>Pipe</h1>

유닉스 파이프의 개념은 Douglas McIlroy가 발명했다.`<br/>`
프로그램의 출력이 다음 프로그램의 입력으로 연결될 수 있다.`<br/>`

```sh
echo Hello World! | sed s/World/Node.js/g
```

결과: Hello Node.js! `<br/>`

비슷한 방식으로 Readable 스트림의 pipe() 함수를 사용하여 스트림을 연결할 수 있다.

```js
readable.pipe(writable, [options])
```

pipe() 함수는 첫 번째 인자에 전달된 Writable 스트림을 반환하는데, 이 스트림이 Readable이면 연결된 호출을 만들 수 있다.`<br/>`
이러면 자동으로 suction이 발생하여 read()와 write()를 호출하지 않아도 되고, back pressure도 제어할 필요가 없다.`<br/>`

<br/>

pipe()에서 에러 이벤트는 파이프라인을 통해 전파되지 않는다. `<br/>`

```js
stream1.pipe(stream2).on('error', () => {})
```

위 파이프라인에서 리스너를 연결한 stream2에서 발생하는 에러만 포착한다.`<br/>`
stream1에서 발생한 에러를 보려면 아래와 같이 작성해야 한다.

```js
stream1
  .on('error', () => {})
  .pipe(stream2)
  .on('error', () => {})
```

<br/>
보기에도 안좋고, 에러가 발생해서 파이프가 해제되었을때 실패한 스트림이 제대로 파괴되지 않아 메모리 누수가 발생할 수 있다.<br/>

이렇게 수동으로 하기보다는 pipeline()을 사용하는것이 좋다.

```
pipeline(stream1, stream2, stream3, ..., cb)
```

파이프라인이 정상적으로 종료되든, 에러로 종료되든 어쨋든 완료가 되면 모든 스트림이 제거된다.
