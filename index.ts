import fs from "fs";
import decryptDES from "./des/decryptDES";
import encryptDES from "./des/encryptDES";

const key = "key1234";

const plaintext = fs.readFileSync("resources/test.txt", "ascii");

const cipherText = encryptDES({ plaintext, key });

fs.writeFileSync("resources/test.enc", cipherText);

console.log(`cipherText  : ${cipherText}`);

console.log(`originalText: ${decryptDES({ cipherText, key })}`);
