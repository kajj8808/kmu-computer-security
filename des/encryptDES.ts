import initialPermutation from "./InitialPermutation";
import expansion from "./expansion";
import finalPermutation from "./finalPermutation";
import generateRoundKeys from "./keyScheduling";
import pPermutation from "./permutation";
import sBoxSubstitution from "./substitution_sBox";
import { asciiTo64BitBinary, xorStrings } from "./utile";

interface IEncryptDES {
  plaintext: string;
  key: string;
}
export default function encryptDES({ plaintext, key }: IEncryptDES): string {
  // Initial Permutation
  const permutedText = initialPermutation(asciiTo64BitBinary(plaintext));
  // 16개의 roundkey 생성
  const roundKeys = generateRoundKeys(asciiTo64BitBinary(key));

  // round 부분입니다.
  // IP Table을 거친 값들을 각각 32비트로 잘라줍니다.
  let Li = permutedText.slice(0, 32);
  let Ri = permutedText.slice(32, 64);
  // 16번의 라운드를 돕니다.
  for (let i = 0; i < 16; i++) {
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
  const cipherText = finalPermutation(Ri + Li);
  return cipherText;
}
