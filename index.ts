import fs from "fs";
import decryptDES from "./des/decryptDES";
import encryptDES from "./des/encryptDES";
import { saveFile } from "./des/utile";

const key = "key12345";

console.log("=========암호화=========");
const plaintext = fs.readFileSync(`${__dirname}/resources/test.txt`, "ascii");
if (plaintext.length > 8) {
  let blocks = Math.ceil(plaintext.length / 8);
  let cipherText = "";
  for (let i = 0; i < blocks; i++) {
    const block = plaintext.slice(i * 8, (i + 1) * 8);
    cipherText += encryptDES({ plaintext: block, key });
  }
  saveFile({ text: cipherText, saveType: "cipher" });
} else {
  const cipherText = encryptDES({ plaintext, key });
  saveFile({ text: cipherText, saveType: "cipher" });
}
//////////////////////////////////////////////////////////////////////
console.log("=========복호화=========");
const cipherText = fs.readFileSync(`${__dirname}/resources/test.enc`, "ascii");
if (cipherText.length > 64) {
  let blocks = Math.ceil(cipherText.length / 64);
  let plaintext = "";

  for (let i = 0; i < blocks; i++) {
    const block = cipherText.slice(i * 64, (i + 1) * 64);
    plaintext += decryptDES({ cipherText: block, key });
  }
  plaintext = plaintext
    .split("")
    .filter((text) => text !== "\0")
    .join("");
  saveFile({ text: plaintext, saveType: "plain" });
} else {
  const plaintext = decryptDES({ cipherText, key });
  saveFile({ text: plaintext, saveType: "plain" });
}
