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
  const serverPublicKey = await getServerPublicKey();
  const publicKey = await importPublicKey(serverPublicKey);

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

/**
 * App에서 사용할 키를 발급받습니다.
 * @param {Object} params
 * @param {string} params.publicKey - 공개키
 * @param {string} params.privateKey - 개인키
 * @param {string} params.signedText - publickey + privatekey를 합친후 서명을 한 text
 * @returns
 *
 */
async function setClientKeys({ publicKey, privateKey, signedText }) {
  const currentKeys = await verifySignedText({
    originalText: publicKey + privateKey,
    signedText,
  });

  if (currentKeys) {
    console.log(`서버로 부터 받은 개인 키 \n ${privateKey} \n`);
    console.log(`서버로 부터 받은 공개 키 \n ${publicKey} \n`);
    clientPublicKey = publicKey;
    clientPrivateKey = privateKey;
  } else {
    // 정상적인 key 가 아닐경우 입장을 막습니다.
    welcomeForm.querySelector("button").disabled = true;
  }
}

async function getServerPublicKey() {
  const { public_key } = await (
    await fetch("/public-key", {
      method: "get",
    })
  ).json();
  return public_key;
}

function encryptText(text, publicKeyPEM) {
  console.log(publicKeyPEM);
  const publicKey = new JSEncrypt();
  publicKey.setPublicKey(publicKeyPEM);
  const encrypted = publicKey.encrypt(text);
  return encrypted;
}

function decryptText(encryptedText, privateKeyPEM) {
  const privateKey = new JSEncrypt();
  privateKey.setPrivateKey(privateKeyPEM);
  const decryptText = privateKey.decrypt(encryptedText);
  return decryptText;
}
