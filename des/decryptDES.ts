import initialPermutation from "./InitialPermutation";
import expansion from "./expansion";
import finalPermutation from "./finalPermutation";
import generateRoundKeys from "./keyScheduling";
import pPermutation from "./permutation";
import sBoxSubstitution from "./substitution_sBox";
import { asciiTo64BitBinary, binaryToAsciiString, xorStrings } from "./utile";

interface IDecryptDESBlock {
  cipherText: string;
  key: string;
}
function decryptDESBlock({ cipherText, key }: IDecryptDESBlock) {
  // Initial Permutation
  // 이미 64bit binary값을 받아 실행하기에 변환은 시켜주지않습니다.
  const permutedText = initialPermutation(cipherText);
  // 16개의 roundkey 생성
  const roundKeys = generateRoundKeys(asciiTo64BitBinary(key));

  // round 부분입니다.
  // IP Table을 거친 값들을 각각 32비트로 잘라줍니다.
  let Li = permutedText.slice(0, 32);
  let Ri = permutedText.slice(32, 64);

  // 복호화 함수이기에 암호화 함수와 반대로 라운드를 돌아줍니다.
  for (let i = 15; i >= 0; i--) {
    // Ri에 확장 테이블을가지고 확장, 교체( Expansion , Permutation)를 적용합니다.
    const expansionRi = expansion(Ri);
    // round key와 48bit Ri 값을가지고 xor 을 진행합니다.
    const xorBit = xorStrings(expansionRi, roundKeys[i]);
    // Substitution 을 진행합니다. sbox를 적용시켜 줍니다. 48->32 bit가 됩니다.
    const sBoxedResult = sBoxSubstitution(xorBit);
    // PERMUTATION (P)를 진행합니다.
    const afterPPermutation = pPermutation(sBoxedResult);
    // Li와 Ri의 위치를 바꿔줍니다.
    const tempRi = Ri;
    Ri = xorStrings(Li, afterPPermutation);
    Li = tempRi;
  }

  // 16라운드를 거친후 값을 더하고 마지막 순열을 적용시켜줍니다.
  const combinedText = Ri + Li;
  const binaryResult = finalPermutation(combinedText);
  return binaryResult;
}

function divideTextIntoBinaryBlocks(cipherText: string, blockSize: number) {
  const blocks = [];
  for (let i = 0; i < cipherText.length; i += blockSize) {
    blocks.push(cipherText.slice(i, i + blockSize));
  }
  return blocks;
}

interface IDecryptDES {
  cipherText: string;
  key: string;
  iv: string;
}
export default function decryptDES({
  cipherText,
  key,
  iv,
}: IDecryptDES): string {
  // binary 값을 AsciiSting으로 변경시켜줍니다.
  // return binaryToAsciiString(binaryResult);dnl

  const cipherBlocks = divideTextIntoBinaryBlocks(cipherText, 64);
  let prevCipherBlock = asciiTo64BitBinary(iv);
  let plaintext = "";

  cipherBlocks.forEach((cipherBlock) => {
    const decCipherBlock = decryptDESBlock({ cipherText: cipherBlock, key });
    const xorWithIV = xorStrings(decCipherBlock, prevCipherBlock);
    prevCipherBlock = cipherBlock;
    plaintext += xorWithIV;
  });
  return binaryToAsciiString(plaintext)
    .split("")
    .filter((text) => text !== "\0")
    .join("");
}
