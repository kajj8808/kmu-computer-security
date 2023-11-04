import fs from "fs";
import decryptDES from "./des/decryptDES";
import encryptDES from "./des/encryptDES";
import { saveFile, xorStrings } from "./des/utile";

// 8자리 key 입니다. 암호화 복호화 할때 사용합니다.
const key = "key12345";

// 초기화 벡터 (IV) 입니다. 암호화 복호화 할때 사용합니다.
const iv = "iv123456";

let cipherText = "";
// 암호화할 평문을 파일에서 불러옵니다.
const plaintext = fs.readFileSync(`${__dirname}/resources/test.txt`, "ascii");
console.log("=========입력값=========");
console.log(`plaintext: ${plaintext}`);
console.log("=========암호화=========");
cipherText = encryptDES({ plaintext, key, iv });
saveFile({ text: cipherText, saveType: "cipher" });

//////////////////////////////////////////////////////////////////////////////////
console.log("=========복호화=========");
// 암호화된 ciphert text를 파일에서 불러옵니다.
cipherText = fs.readFileSync(`${__dirname}/resources/test.enc`, "ascii");
const decryptedBlock = decryptDES({ cipherText, key, iv });
saveFile({ text: decryptedBlock, saveType: "plain" });
