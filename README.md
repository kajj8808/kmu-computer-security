# DES

1. DES 알고리즘에서 사용되는 각 기능을 함수로 완성하시오. (openssl등 외부 api사용 금지)

2. text 문서를 입력받아 암호화 하시오.

3. 암호화된 문서를 복호화 하시오.

4. 원 문서와 복호화 된 문서가 동일한지 검증하시오.

## 개발환경

- Typescript: [버전 5.0](https://www.npmjs.com/package/typescript?activeTab=readme)

- Bun: [버전 1.0.2](https://www.npmjs.com/package/bun/v/1.0.2)

## 설치 방법

필요한 typescript와 bun-type 패키지를 아래 명령어로 설치하세요:

```bash
bun install
```

개발 모드로 실행하려면:

```bash
bun run dev
```

## 기능 구현

- [x] 초기 치환 (Initial Permutation)
- [x] Ascii to Binary
- [x] Binary to Ascii
- [x] xor 함수 (xorStrings)
- [x] 16 round 구현
- [x] 파일 읽어서 plainText으로 사용
- [x] cipyerText 저장 ( 암호화된 text 저장 )
- [x] cipyerText 파일 복호화 ( 암호화된 text 파일 복호화 )

## Key

- [x] 64bitKey를가지고 16개의 roundKey생성

## Round

- [x] expansion
- [x] sBox (substitution)
- [x] permutation
- [x] finalPermutation

## 참고 자료

- ppt
- https://page.math.tu-berlin.de/~kant/teaching/hess/krypto-ws2006/des.htm
- https://www.rapidtables.com/convert/number/ascii-hex-bin-dec-converter.html
