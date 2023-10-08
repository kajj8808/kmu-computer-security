# 컴퓨터 보안 Repasitory

계명대학교 컴퓨터 보안에 대한 git 저장소 입니다.

## DES

### 개발환경

[Typescript - 5.0](https://www.npmjs.com/package/typescript?activeTab=readme)

[Bun - 1.0.2](https://www.npmjs.com/package/bun/v/1.0.2)

### 기능 구현

- [x] Initial Permutation
- [x] Ascii to Binary
- [x] Binary to Ascii
- [x] xorStrings (xor 함수 구현)
- [x] 16 round 구현
- [x] 파일 읽어서 plainText으로 사용
- [x] cipyerText 저장 ( 암호화된 text 저장 )
- [x] cipyerText 파일 복호화 ( 암호화된 text 파일 복호화 )

### Key

- [x] 64bitKey를가지고 16개의 roundKey생성

### Round

- [x] expansion
- [x] sBox (substitution)
- [x] permutation
- [x] finalPermutation

### 참고 페이지

- https://page.math.tu-berlin.de/~kant/teaching/hess/krypto-ws2006/des.htm
- https://www.rapidtables.com/convert/number/ascii-hex-bin-dec-converter.html
