import http from "http";
import SocketIO from "socket.io";
import express from "express";
import nodeRSA from "node-rsa";
import crypto from "crypto";

const app = express();

const serverRSA = new nodeRSA({ b: 2048 });
const PUBLIC_KEY = serverRSA.exportKey("public");
const PRIVATE_KEY = serverRSA.exportKey("private");

//console.log(`public key : ${serverRSA.exportKey("public")}`);

/* const signText = crypto.sign("SHA256", "Hello", serverRSA.exportKey("private"));
console.log(signText);

const verti = crypto.verify(
  "SHA256",
  "Hello",
  serverRSA.exportKey("public"),
  signText
);
console.log(verti); */

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/public-key", (_, res) => res.send({ public_key: PUBLIC_KEY }));

app.get("/*", (_, res) => res.redirect("/"));

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

function generateClientKeys() {
  // client keys
  const clientRSA = new nodeRSA({ b: 1024 });
  const publicKey = clientRSA.exportKey("public");
  const privateKey = clientRSA.exportKey("private");
  // sign
  const signedText = crypto
    .sign("SHA256", publicKey + privateKey, PRIVATE_KEY)
    .toString("base64");
  const keys = { publicKey, privateKey, signedText };
  return keys;
}

wsServer.on("connection", (socket) => {
  socket.on("test", () => {
    const originalPublicKey = socket.keys.publicKey;
    const signedPublicKey = crypto
      .sign("SHA256", originalPublicKey, PRIVATE_KEY)
      .toString("base64");
    socket.emit("user-public-key", { originalPublicKey, signedPublicKey });
  });

  socket.on("init", (setKeys) => {
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
  // 4
  socket.on("ice", (ice, roomName) => {
    socket.to(roomName).emit("ice", ice);
    socket.to(roomName).emit("keys", socket.keys);
  });
});

const handleListen = () => console.log(`Listening on http://localhost:3010`);
httpServer.listen(3010, handleListen);
