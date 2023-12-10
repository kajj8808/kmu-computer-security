const welcome = document.getElementById("welcome");
const welcomeForm = welcome.querySelector("form");
const chat = document.getElementById("chat");

chat.hidden = true;

let roomName;

function startChat() {
  welcome.hidden = true;
  chat.hidden = false;
}

function handleWelcomeSubmit(event) {
  event.preventDefault();
  const input = welcomeForm.querySelector("input");
  socket.emit("join_room", input.value, startChat);
  roomName = input.value;
  input.value = "";
}

welcomeForm.addEventListener("submit", handleWelcomeSubmit);

//socket part //
let publicKey;
let privateKey;

const socket = io();

socket.on("welcome", () => {
  console.log("Some one joined");
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

// crypto.js
cryptoInit();

socket.emit("test");
