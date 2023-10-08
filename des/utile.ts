/** binary xor 함수입니다. */
export function xorStrings(a: string, b: string): string {
  let result = "";
  for (let i = 0; i < a.length; i++) {
    result += a[i] === b[i] ? "0" : "1";
  }
  return result;
}
/** binary 값을 ascii으로 변경시켜줍니다.  */
export function binaryToAsciiString(binary: string): string {
  let str = "";
  for (let i = 0; i < binary.length; i += 8) {
    const byte = binary.slice(i, i + 8);
    const asciiValue = parseInt(byte, 2);
    str += String.fromCharCode(asciiValue);
  }
  return str;
}
/** ascii값을 64bitbinary 값으로 변경시켜줍니다.  */
export function asciiTo64BitBinary(input: string): string {
  let binaryText = input
    .split("")
    .map((char) => {
      const binary = char.charCodeAt(0).toString(2);
      return binary.padStart(8, "0"); // 8자리를 채워줍니다.
    })
    .join("");
  while (true) {
    if (binaryText.length !== 64) {
      binaryText += "00000000"; // 64가 아닐경우(8자리가 아닐경우) ex) aAbB 이런 경우일때 나머지 칸을 00000000 으로 없는값으로 처리해줍니다.
    } else {
      break;
    }
  }
  return binaryText;
}
import fs from "fs";

interface ISaveFile {
  text: string;
  saveType: "cipher" | "plain";
}
export function saveFile({ text, saveType }: ISaveFile) {
  if (saveType === "cipher") {
    console.log(`cipher Text: ${text}`);
    fs.writeFileSync("resources/test.enc", text);
    console.log("cipher Text  저장 완료!");
  } else {
    console.log(`plain text: ${text}`);
    fs.writeFileSync("resources/test_1.txt", text, "ascii");
    console.log("plaintext 저장 완료!");
  }
}
