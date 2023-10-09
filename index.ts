import fs from "fs";
import decryptDES from "./des/decryptDES";
import encryptDES from "./des/encryptDES";
import { saveFile } from "./des/utile";

// 8자리 key 입니다. 암호화 복호화 할때 사용합니다.
const key = "key12345";

// 암호화할 평문을 파일에서 불러옵니다.
const plaintext = fs.readFileSync(`${__dirname}/resources/test.txt`, "ascii");
console.log("=========입력값=========");
console.log(`plaintext: ${plaintext}`);
console.log("=========암호화=========");
// 평문의 길이가 8이상(64bit)일때는 나눠서 암호화를 한후 합친값을 저장합니다.
if (plaintext.length > 8) {
  let blocks = Math.ceil(plaintext.length / 8);
  let cipherText = "";
  for (let i = 0; i < blocks; i++) {
    const block = plaintext.slice(i * 8, (i + 1) * 8);
    cipherText += encryptDES({ plaintext: block, key });
  }
  saveFile({ text: cipherText, saveType: "cipher" });
} else {
  // 8자리의 경우 암호화를 한후 저장을 해줍니다.
  const cipherText = encryptDES({ plaintext, key });
  saveFile({ text: cipherText, saveType: "cipher" });
}
//////////////////////////////////////////////////////////////////////////////////
console.log("=========복호화=========");
// 암호화된 ciphert text를 파일에서 불러옵니다.
const cipherText = fs.readFileSync(`${__dirname}/resources/test.enc`, "ascii");
// 길이가 64이상이라면 8자리 이상의 평문을 암호화 한것이므로 64bit으로 잘라 복호화 시킨다음 복호화 된 평문을 test_1파일로 저장합니다..
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
  // 64이하일 경우 8자리의 평문이기에 복호화를 해준다음 test_1파일로 저장해줍니다.
  const plaintext = decryptDES({ cipherText, key });
  saveFile({ text: plaintext, saveType: "plain" });
}
