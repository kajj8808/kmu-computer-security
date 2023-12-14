# PKI System

다음의 주어진 그림과 같이 PKI를 구성한 뒤 RSA를 사용한 양자간 채팅 프로그램을 완성하시오.

(구현에 필요한 내용은 다음을 참고하시오.)

1. 서버(인증기관)는 자신의 공개키/개인키를 생성하여 보관한다.

2. 서버는 앨리스와 밥의 공개키/개인키를 발급하여 전달한다.

3. 앨리스와 밥이 서버에 동시에 접속하면, 서버는 앨리스에게 밥의 공개키, 서버의 공개키, 밥의 공개키에 대한 서명값을 전달한다. 동일하게 밥에게는 앨리스의 공개키, 서버의 공개키, 앨리스의 공개키에 대한 서명값을 전달한다.

4. 앨리스와 밥은 서버의 공개키를 활용하여 상대방의 공개키의 사실 여부를 검증한다.

5. 서버로 부터 보낸 사실이 확인되면 앨리스와 밥은 상대방의 공개키를 사용하여 메시지를 암호화하여 서버를 통해 상대방에게 전달하고, 메시지를 받은 사용자를 자신의 개인키를 사용하여 복호화 한다.

### Client 동작 시나리오

- [x] 1. 웹 페이지 접속
- [x] 2. PKI 서버로 부터 PKI 서버 공개키 요청
- [x] 3. 자신의 개인키 + 공개키 요청
- [x] 4. 받아온 키들이 정상적인 키인지 확인(verify)
- [x] 5. 채팅방 작성 or 채팅방 입장
- [x] 6. 대화할 상대를 기다림
- [x] 7. 상대방 입장시 상대방의 key를 PKI 서버로 부터 받음
- [x] 8. 상대방 키들이 정상적인 키인지 확인(verify)
- [x] 9. 채팅 ( 보낼 경우 상대방 개인키 암호화 + 받을 경우 자신의 개인키로 복호화 )

### Server Functions

- [x] Generate RSA Keys ( Node-RSA )
- [x] Sign Text ( crypto )
- [x] Peer Connection ( WEB RTC )
- [x] Chat ( Data Channel )

### WebRTC

- peer to peer 방식으로 동작
- 브라우저 끼리 연결되어 값을 교환하는 방식
- ws 과 다른점 (ws은 서버에 값을 전달하고 서버가 그 메세지를 전달해주는 방식)
- audio 데이터나 video 파일 같이 파일 크기가 큰 파일들을 공유하는데 사용하는게 대표적인 사용방식. (실제로 서버로 값이 넘어가지 않기때문에 서버사용량을 줄일수 있음)

### etc?

- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array
- atob
- STUN Server(STUN 서버는 컴퓨터가 공용 IP를 찾게 해줌.)

### WEB RTC

1. 커넥션 생성 (myPeerConnection = new RTCPeerConnection());
2. create offer {peer a} ( const offer = await myPeerConnection.createOffer();)
3. create Answer {peer b}
4. ice candidate (인터넷 연결 생성)
