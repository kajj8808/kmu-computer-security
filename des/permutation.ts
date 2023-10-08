const P_TABLE: number[] = [
  16, 7, 20, 21, 29, 12, 28, 17, 1, 15, 23, 26, 5, 18, 31, 10, 2, 8, 24, 14, 32,
  27, 3, 9, 19, 13, 30, 6, 22, 11, 4, 25,
];

export default function pPermutation(input: string): string {
  return P_TABLE.map((index) => input[index - 1]).join("");
}
