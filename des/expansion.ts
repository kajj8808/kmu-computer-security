const E_TABLE: number[] = [
  32, 1, 2, 3, 4, 5,

  4, 5, 6, 7, 8, 9,

  8, 9, 10, 11, 12, 13,

  12, 13, 14, 15, 16, 17,

  16, 17, 18, 19, 20, 21,

  20, 21, 22, 23, 24, 25,

  24, 25, 26, 27, 28, 29,

  28, 29, 30, 31, 32, 1,
];
/** 확장 테이블을 가지고 32bit Ri를 48bit Ri로 변환시켜주고 교체하는 함수입니다. */
export default function expansion(Ri: string): string {
  return E_TABLE.map((index) => Ri[index - 1]).join("");
}
