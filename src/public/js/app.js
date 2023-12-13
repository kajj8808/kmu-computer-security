let clientPublicKey;
let clientPrivateKey;
let roomName;

const welcome = document.getElementById("welcome");
const welcomeForm = welcome.querySelector("form");
const chat = document.getElementById("chat");
const chatList = chat.querySelector("ul");
const chatForm = chat.querySelector("form");
const chatWaitText = chat.querySelector("h3");

chat.hidden = true;

function showChatRoom() {
  welcome.hidden = true;
  chat.hidden = false;
  makeConnection();
}

function enabledChatForm() {
  chatForm.querySelector("button").disabled = false;
  chatForm.querySelector("input").focus();
  chatWaitText.hidden = true;
}

function handleWelcomeSubmit(event) {
  event.preventDefault();
  const input = welcomeForm.querySelector("input");
  socket.emit("join_room", input.value, showChatRoom);
  roomName = input.value;
  input.value = "";
}

function handleChatSubmit(event) {
  event.preventDefault();
  const input = chatForm.querySelector("input");
  const message = input.value;
  myDataChannel.send(encryptText(message, peerPublicKey));
  addChat({ message: message, isMe: true });
  input.value = "";
}

function addChat({ message, isMe }) {
  const li = document.createElement("li");
  const span = document.createElement("span");
  span.innerText = message;
  span.classList.add(isMe ? "reverse" : "normal");
  li.appendChild(span);
  chatList.appendChild(li);
}

welcomeForm.addEventListener("submit", handleWelcomeSubmit);
chatForm.addEventListener("submit", handleChatSubmit);

// crypto.js
cryptoInit();
