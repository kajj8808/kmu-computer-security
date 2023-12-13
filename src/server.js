import http from "http";
import SocketIO from "socket.io";
import express from "express";
import nodeRSA from "node-rsa";
import crypto from "crypto";

const app = express();

const serverRSA = new nodeRSA({ b: 2048 });

// 1. 서버(인증기관)는 자신의 공개키/개인키를 생성하여 보관한다.
const serverPublicKey = serverRSA.exportKey("public");
const serverPrivateKey = serverRSA.exportKey("private");
console.log(`서버 공개키\n ${serverPublicKey}\n`);
console.log(`서버 개인키\n ${serverPrivateKey}\n`);

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/public-key", (_, res) => res.send({ public_key: serverPublicKey }));

app.get("/*", (_, res) => res.redirect("/"));

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

function signText(text) {
  const signedText = crypto
    .sign("SHA256", text, serverPrivateKey)
    .toString("base64");
  return signedText;
}

function generateClientKeys() {
  // client keys
  const clientRSA = new nodeRSA({ b: 1024 });
  const publicKey = clientRSA.exportKey("public");
  const privateKey = clientRSA.exportKey("private");
  // sign
  const signedText = crypto
    .sign("SHA256", publicKey + privateKey, serverPrivateKey)
    .toString("base64");
  const keys = { publicKey, privateKey, signedText };
  return keys;
}

wsServer.on("connection", (socket) => {
  socket.on("init", (setKeys) => {
    // 2. 서버는 앨리스와 밥의 공개키/개인키를 발급하여 전달한다.
    const keys = generateClientKeys();
    socket.keys = keys;
    setKeys(keys);
  });

  socket.on("join_room", (roomName, done) => {
    socket.join(roomName);
    socket.to(roomName).emit("welcome");
    done();
  });
  // 2. create offer
  socket.on("offer", (offer, roomName) => {
    // 3.을 진행하기 위해 offer 상대방에게 전송
    socket.to(roomName).emit("offer", offer);
  });
  // 3.create Answer  -> send answer
  socket.on("answer", (answer, roomName) => {
    socket.to(roomName).emit("answer", answer);
  });
  socket.on("ice", (ice, roomName) => {
    //3. 앨리스와 밥이 서버에 동시에 접속하면,
    //   서버는 앨리스에게 밥의 공개키, 서버의 공개키,
    //   밥의 공개키에 대한 서명값을 전달한다.
    //   동일하게 밥에게는 앨리스의 공개키, 서버의 공개키, 앨리스의 공개키에 대한 서명값을 전달한다.
    const publicKey = socket.keys.publicKey;
    socket.to(roomName).emit("ice", ice); // 동시 접속 ( 서로의 위치를 확인하고 연결 )
    socket.to(roomName).emit("peer_public_key", {
      publicKey: publicKey,
      signedPublicKey: signText(publicKey),
    }); // 서로의 키 전달
  });
});

const handleListen = () => console.log(`Listening on http://localhost:3010`);
httpServer.listen(3010, handleListen);
