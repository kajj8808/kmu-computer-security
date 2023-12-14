# PKI CHAT(RSA)

PKI 환경에서 공개키(RSA)를 활용한 채팅 프로그램

## 개발환경

- Node.js: [버전 18.17.0](https://nodejs.org/en)

## 설치 방법

```bash
npm install
```

개발 모드로 실행하려면:

```bash
npm run dev
```

## 사용 시나리오

1. 서버 실행후 http://localhost:3010 에 접속합니다.
2. 방 이름을 입력하고 방에 접속합니다.
3. 상대가 접속하기를 기다립니다.
4. 상대가 접속하였을 경우 채팅을 시작합니다.

### 클라이언트(웹) 시나리오 + 기능

- [x] 1. 웹 페이지 접속
- [x] 2. PKI 서버로 부터 PKI 서버 공개키 요청
- [x] 3. 자신의 개인키 + 공개키 요청
- [x] 4. 받아온 키들이 정상적인 키인지 확인(verify)
- [x] 5. 채팅방 작성 or 채팅방 입장
- [x] 6. 대화할 상대를 기다림
- [x] 7. 상대방 입장시 상대방의 key를 PKI 서버로 부터 받음
- [x] 8. 상대방 키들이 정상적인 키인지 확인(verify)
- [x] 9. 채팅 ( 보낼 경우 상대방 개인키 암호화 + 받을 경우 자신의 개인키로 복호화 )

### 서버 기능

- [x] Generate RSA Keys ( Node-RSA )
- [x] Sign Text ( crypto )
- [x] Peer Connection ( WEB RTC )
- [x] Chat ( Data Channel )

## 참고 자료

- ppt
- https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API (web rtc -> 피어 연결에 사용)
- https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Using_data_channels (data channel -> 클라이언트 채팅에 사용)
- https://nodejs.org/docs/v9.8.0/api/crypto.html (crypto -> 서명, 서명확인 을 위해 사용)
- https://www.npmjs.com/package/node-rsa (RSA -> RSA 키를 생성하는데 사용)
