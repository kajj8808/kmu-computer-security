let SERVER_PUBLIC_KEY = ""; // final
let PUBLIC_KEY; // final
let PRIVATE_KEY; // final

/**
 * PEM 형식의 CryptoKey 변환 함수
 * @param {string} pemKey - PEM 형식의 공개 키.
 * @returns {Promise<CryptoKey>} - crypto.subtle.verify 의 key에 맞는 형식값
 */
async function importPublicKey(pemKey) {
  // PEM 형식에서 DER 형식으로 변환합니다.
  const binaryDer = pemToBinary(pemKey);

  const publicKey = await crypto.subtle.importKey(
    "spki",
    binaryDer,
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: { name: "SHA-256" },
    },
    false,
    ["verify"]
  );

  return publicKey;
}

/**
 * 서명 확인 함수
 * @param {Object} params
 * @param {string} params.signedText - 서명된 공개 키 (base64).
 * @param {string} params.originalText - 공개키
 * @returns {Promise<boolean>} - 정상적인 서명이면 true 아닌경우 false를 리턴합니다.
 *
 */
async function verifySignedText({ signedText, originalText }) {
  const algorithm = {
    name: "RSASSA-PKCS1-v1_5",
    hash: { name: "SHA-256" },
  };

  const publicKey = await importPublicKey(SERVER_PUBLIC_KEY);

  const signedPublicKeyBuffer = base64ToBuffer(signedText);
  const dataBuffer = new TextEncoder().encode(originalText).buffer;

  const result = await crypto.subtle.verify(
    algorithm,
    publicKey,
    signedPublicKeyBuffer,
    dataBuffer
  );

  return result;
}

async function setClientKeys({ publicKey, privateKey, signedText }) {
  const currentKeys = await verifySignedText({
    originalText: publicKey + privateKey,
    signedText,
  });
  if (currentKeys) {
    PUBLIC_KEY = publicKey;
    PRIVATE_KEY = privateKey;
  } else {
    // 정상적인 key 가 아닐경우 입장을 막습니다.
    welcomeForm.querySelector("button").disabled = true;
  }
}

async function cryptoInit() {
  // pki 서버에서 public를 얻어옵니다.
  const { public_key } = await (
    await fetch("/public-key", {
      method: "get",
    })
  ).json();
  SERVER_PUBLIC_KEY = public_key;
  socket.emit("init", setClientKeys);
}
