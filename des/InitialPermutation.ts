/**
 * IP Table (초기 치환 테이블)
 * */
const IP_TABLE: number[] = [
  58, 50, 42, 34, 26, 18, 10, 2,

  60, 52, 44, 36, 28, 20, 12, 4,

  62, 54, 46, 38, 30, 22, 14, 6,

  64, 56, 48, 40, 32, 24, 16, 8,

  57, 49, 41, 33, 25, 17, 9, 1,

  59, 51, 43, 35, 27, 19, 11, 3,

  61, 53, 45, 37, 29, 21, 13, 5,

  63, 55, 47, 39, 31, 23, 15, 7,
];
/**
 * IP Table을 통해 binaryPlainText값을 섞어(치환 시켜)줍니다.
 * IP_Table에 있는 위치값으로 binaryPlainText에 있는값을 가져와 치환합니다.( 58->plainText 58 번째에 있는 값. )
 * binaryPlainText = 0110000101000001011000100100001001100011010000110000000000000000
 * 치환후 테이블    = 0011111100000000000000000011001100000000000101010000000000111100
 *  */
export default function initialPermutation(binaryPlainText: string): string {
  return IP_TABLE.map((index) => binaryPlainText[index - 1]).join("");
}
