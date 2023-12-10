let SERVER_PUBLIC_KEY = ""; // final
let PUBLIC_KEY; // final
let PRIVATE_KEY; // final

const welcome = document.getElementById("welcome");
const welcomeForm = welcome.querySelector("form");
const chat = document.getElementById("chat");
const chatList = chat.querySelector("ul");
const chatForm = chat.querySelector("form");
const chatWaitText = chat.querySelector("h3");

chat.hidden = true;

let roomName;
let myStream;
let myPeerConnection;
let myDataChannel;

function startChat() {
  welcome.hidden = true;
  chat.hidden = false;
  makeConnection();
}

function handleWelcomeSubmit(event) {
  event.preventDefault();
  const input = welcomeForm.querySelector("input");
  socket.emit("join_room", input.value, startChat);
  roomName = input.value;
  input.value = "";
}

function handleChatSubmit(event) {
  event.preventDefault();
  const input = chatForm.querySelector("input");
  const message = input.value;
  myDataChannel.send(message);
  addChat({ message: message, isMe: true });
  input.value = "";
}

function addChat({ message, isMe }) {
  const li = document.createElement("li");
  const span = document.createElement("span");
  span.innerText = message;
  span.classList.add(isMe ? "normal" : "reverse");
  li.appendChild(span);
  chatList.appendChild(li);
}

welcomeForm.addEventListener("submit", handleWelcomeSubmit);
chatForm.addEventListener("submit", handleChatSubmit);
//socket part //
let publicKey;
let privateKey;

const socket = io();

// peer A
socket.on("welcome", async () => {
  myDataChannel = myPeerConnection.createDataChannel("chat");
  myDataChannel.addEventListener("message", (event) => {
    addChat({ message: event.data, isMe: false });
  });
  //console.log("made data channel");
  // 2. create offer
  const offer = await myPeerConnection.createOffer();
  myPeerConnection.setLocalDescription(offer); // A.위치 설정
  socket.emit("offer", offer, roomName);
});

socket.on("user-public-key", async ({ originalPublicKey, signedPublicKey }) => {
  const currentSign = await verifySignedText({
    originalText: originalPublicKey,
    signedText: signedPublicKey,
  });

  if (currentSign) {
    console.log(originalPublicKey);
  }
});

// 3.create Answer 상대방이 전송한 offer 를 받아서 Answer작성
// peer B
socket.on("offer", async (offer) => {
  myPeerConnection.addEventListener("datachannel", (event) => {
    myDataChannel = event.channel;
    myDataChannel.addEventListener("message", (event) => {
      addChat({ message: event.data, isMe: false });
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
  chatForm.querySelector("button").disabled = false;
  chatWaitText.hidden = true;
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

// crypto.js
cryptoInit();

socket.emit("test");
