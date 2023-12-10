/**
 * base64 String값을 Uint8Array buffer으로 변환합니다.
 * @param {string} base64String
 * @returns {Uint8Array}
 */
function base64ToBuffer(base64String) {
  const binaryString = window.atob(base64String);
  const buffer = new Uint8Array(
    binaryString.split("").map((text) => text.charCodeAt(0))
  ).buffer;
  return buffer;
}

/**
 * PEM 형식의 문자열에서 pem header footer 를 걸러주는 함수.
 * @param {string} pemKey - PEM 형식의 문자열입니다.
 * @returns {Uint8Array} - Uint8Array 형식을 리턴합니다.
 */
function pemToBinary(pemKey) {
  // PEM 형식의 header 와 footer 를 잘라줍니다.
  const pemHeader = "-----BEGIN PUBLIC KEY-----";
  const pemFooter = "-----END PUBLIC KEY-----";
  // base64 string 만 남게됩니다.
  const pemContents = pemKey.substring(
    pemHeader.length,
    pemKey.length - pemFooter.length
  );

  // 이진 문자열에서 Uint8Array(바이너리 값)으로 변환합니다.
  const binaryString = base64ToBuffer(pemContents);
  return binaryString;
}
