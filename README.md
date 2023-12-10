# PKI System

### Client 동작 시나리오

- [x] 1. 웹 페이지 접속
- [x] 2. PKI 서버로 부터 PKI 서버 공개키 요청
- [x] 3. 자신의 개인키 + 공개키 요청
- [x] 4. 받아온 키들이 정상적인 키인지 확인(verify)
- [] 5. 채팅방 작성 or 채팅방 입장
- [] 6. 대화할 상대를 기다림
- [] 7. 상대방 입장시 상대방의 key를 PKI 서버로 부터 받음
- [] 8. 상대방 키들이 정상적인 키인지 확인(verify)
- [] 9. 채팅 ( 보낼 경우 상대방 개인키 암호화 + 받을 경우 자신의 개인키로 복호화 )

### Server Functions

- [x] Generate RSA Keys ( Node-RSA )
- [x] Sign Text ( crypto )
- [] Get Rooms ( SOCKET IO )
- [] Peer Connection ( WEB RTC )
- [] Chat ( WEB RTC )

### WebRTC

- peer to peer 방식으로 동작
- 브라우저 끼리 연결되어 값을 교환하는 방식
- ws 과 다른점 (ws은 서버에 값을 전달하고 서버가 그 메세지를 전달해주는 방식)
- audio 데이터나 video 파일 같이 파일 크기가 큰 파일들을 공유하는데 사용하는게 대표적인 사용방식. (실제로 서버로 값이 넘어가지 않기때문에 서버사용량을 줄일수 있음)

### etc?

- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array
- atob
