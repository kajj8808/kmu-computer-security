import { stringTo64BitBinary } from "./utile";

/** 56 bit key로 변환하고, 치환하는 테이블입니다.(8의 배수의 값이 없습니다.)*/
const PC1_TABLE: number[] = [
  57, 49, 41, 33, 25, 17, 9,

  1, 58, 50, 42, 34, 26, 18,

  10, 2, 59, 51, 43, 35, 27,

  19, 11, 3, 60, 52, 44, 36,

  63, 55, 47, 39, 31, 23, 15,

  7, 62, 54, 46, 38, 30, 22,

  14, 6, 61, 53, 45, 37, 29,

  21, 13, 5, 28, 20, 12, 4,
];

/** 48비트 키로 전환하기 위해 사용하는 테이블 입니다.  */
const PC2_TABLE: number[] = [
  14, 17, 11, 24, 1, 5, 3, 28,

  15, 6, 21, 10, 23, 19, 12, 4,

  26, 8, 16, 7, 27, 20, 13, 2,

  41, 52, 31, 37, 47, 55, 30, 40,

  51, 45, 33, 48, 44, 49, 39, 56,

  34, 53, 46, 42, 50, 36, 29, 32,
];

const LEFT_SHIFTS: number[] = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];

/**
 * PC1 Table에 있는 순서로 binaryKey를 치환하는 함수입니다.
 * 반환 값으로 56bit으로 치환된 값을 반환합니다.
 * */
function PC1Converter(binaryKey: string): string {
  const permutedKey = PC1_TABLE.map((index) => binaryKey[index - 1]).join("");
  return permutedKey;
}
/**
 * 56bit로 되어있는 binarykey를 parameter로 받아 16개의 라운드 키를 반환하는 함수입니다.
 * + 64bit으로 받아도 56bit으로 변환하는 PC1 Table을 걸치기에 64bit으로 되어있는 binarykey를 받아도 작동 합니다.
 */
export default function generateRoundKeys(binaryKey: string): string[] {
  // PERMUTED CHOICE 1 table을 가지고 값을 56bit key값으로 치환시켜 줍니다.
  const permutedKey = PC1Converter(binaryKey);
  const roundKeys: string[] = [];
  // PC1테이블을 거친 값들을 28bit씩 잘라줍니다.
  let C = permutedKey.slice(0, 28);
  let D = permutedKey.slice(28, 56);

  // 16개의 라운드 키 생성
  for (let i = 0; i < 16; i++) {
    /* 
      LeftCircularShift를 진행합니다. ( 12345 -> 12345.slice(2) + 12345.slice(0, 2) -> 34512 ) 
      이때 LEFT_SHIFTS를 통해 1 , 2 , 9 , 16 의 경우 한번, 아닌 경우 두번을 진행합니다.
    */
    C = C.slice(LEFT_SHIFTS[i]) + C.slice(0, LEFT_SHIFTS[i]);
    D = D.slice(LEFT_SHIFTS[i]) + D.slice(0, LEFT_SHIFTS[i]);

    // PERMUTED CHOICE 2 table 치환을 합니다. (값을 한번더 섞어주고 48bit으로 만들어줍니다.)
    const combinedKey = C + D;
    const roundKey = PC2_TABLE.map((index) => combinedKey[index - 1]).join("");

    // 48bit key roundKey를 추가해줍니다.
    roundKeys.push(roundKey);
  }
  // 16 roundKey를 return합니다.
  return roundKeys;
}
