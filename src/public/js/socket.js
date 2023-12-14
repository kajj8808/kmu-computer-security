//socket part //
let myStream;
let myPeerConnection;
let myDataChannel;
let peerPublicKey;

const socket = io();

// peer A
socket.on("welcome", async () => {
  myDataChannel = myPeerConnection.createDataChannel("chat");
  myDataChannel.addEventListener("message", (event) => {
    // peer a가 메세지를 받는 경우
    console.log(
      `peer b: ${event.data}\n복호화된 메세지${decryptText(
        event.data,
        clientPrivateKey
      )}`
    );

    addChat({
      message: decryptText(event.data, clientPrivateKey),
      isMe: false,
    });
  });
  // 2. create offer
  const offer = await myPeerConnection.createOffer();
  myPeerConnection.setLocalDescription(offer); // A.위치 설정
  socket.emit("offer", offer, roomName);
});

// 3.create Answer 상대방이 전송한 offer 를 받아서 Answer작성
// peer B
socket.on("offer", async (offer) => {
  myPeerConnection.addEventListener("datachannel", (event) => {
    // peer b가 메세지를 받는 경우
    myDataChannel = event.channel;
    myDataChannel.addEventListener("message", (event) => {
      console.log(
        `peer a: ${event.data}\n복호화된 메세지${decryptText(
          event.data,
          clientPrivateKey
        )}`
      );
      addChat({
        message: decryptText(event.data, clientPrivateKey),
        isMe: false,
      });
    });
  });
  myPeerConnection.setRemoteDescription(offer);
  const answer = await myPeerConnection.createAnswer();
  myPeerConnection.setLocalDescription(answer); // B.위치 설정
  socket.emit("answer", answer, roomName);
});

socket.on("answer", (answer) => {
  myPeerConnection.setRemoteDescription(answer); // 위치 설정
});

socket.on("ice", (ice) => {
  //console.log("recive ice");
  myPeerConnection.addIceCandidate(ice);
  enabledChatForm();
});

socket.on("peer_public_key", async ({ signedPublicKey, publicKey }) => {
  // 4. 앨리스와 밥은 서버의 공개키를 활용하여 상대방의 공개키의 사실 여부를 검증한다.
  const currentPublicKey = await verifySignedText({
    signedText: signedPublicKey,
    originalText: publicKey,
  });
  // 서명 확인후 peerPublicKey에 할당
  if (currentPublicKey) {
    const serverPublicKey = await getServerPublicKey();
    console.log(`서버 공개키\n${serverPublicKey}`);
    console.log(`상대peer의 공개키\n${publicKey}`);
    console.log(`상대peer의 공개키에 대한 서명\n${publicKey}`);
    console.log(`정상적인 공개키 ${currentPublicKey}`);
    peerPublicKey = publicKey;
  }
});

function makeConnection() {
  // Text STUN Server (Google)
  // Peer 연결
  myPeerConnection = new RTCPeerConnection({
    iceServers: [
      {
        urls: [
          "stun:stun.l.google.com:19302",
          "stun:stun1.l.google.com:19302",
          "stun:stun2.l.google.com:19302",
          "stun:stun3.l.google.com:19302",
          "stun:stun4.l.google.com:19302",
        ],
      },
    ],
  });
  myPeerConnection.addEventListener("icecandidate", handleIce);
}

function handleIce(data) {
  socket.emit("ice", data.candidate, roomName);
}

// crypto의 초기부분을 셋업합니다. 개인키 공개키를 받아오는 역활을합니다.
async function cryptoInit() {
  socket.emit("init", setClientKeys);
}
