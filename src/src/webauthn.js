// تسجيل الدخول بالبصمة / Face ID عبر WebAuthn
// كل بيانات الاعتماد مرتبطة بالجهاز نفسه ومخزّنة محلياً (localStorage) — لا تُرسل لأي سيرفر
// يدعم Face ID / Touch ID على آيفون (Safari) وبصمة الإصبع على أندرويد (Chrome)

const STORAGE_PREFIX = "daftar_webauthn_";

export function isWebAuthnSupported() {
  return typeof window !== "undefined" && !!window.PublicKeyCredential;
}

export function hasBiometricSetup(username) {
  try {
    return !!localStorage.getItem(STORAGE_PREFIX + username);
  } catch {
    return false;
  }
}

function bufferToBase64(buf) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

function base64ToBuffer(b64) {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function randomChallenge() {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return arr;
}

// تفعيل البصمة لأول مرة على هذا الجهاز لهذا المستخدم
export async function registerBiometric(username) {
  if (!isWebAuthnSupported()) {
    throw new Error("هذا المتصفح لا يدعم تسجيل الدخول بالبصمة");
  }

  const userId = new Uint8Array(16);
  crypto.getRandomValues(userId);

  const credential = await navigator.credentials.create({
    publicKey: {
      challenge: randomChallenge(),
      rp: { name: "دفترنا" },
      user: {
        id: userId,
        name: username,
        displayName: username === "nasser" ? "ناصر" : "أسماء",
      },
      pubKeyCredParams: [
        { type: "public-key", alg: -7 },   // ES256
        { type: "public-key", alg: -257 }, // RS256
      ],
      authenticatorSelection: {
        authenticatorAttachment: "platform", // يفرض Face ID / Touch ID / بصمة الجهاز نفسه (مو مفتاح خارجي)
        userVerification: "required",
        residentKey: "preferred",
      },
      timeout: 60000,
      attestation: "none",
    },
  });

  if (!credential) throw new Error("لم يتم إنشاء بيانات الاعتماد");

  const credentialId = bufferToBase64(credential.rawId);
  try {
    localStorage.setItem(STORAGE_PREFIX + username, credentialId);
  } catch {
    throw new Error("تعذّر حفظ بيانات البصمة على هذا الجهاز");
  }
  return true;
}

// محاولة الدخول بالبصمة بعد التفعيل
export async function loginWithBiometric(username) {
  if (!isWebAuthnSupported()) {
    throw new Error("هذا المتصفح لا يدعم تسجيل الدخول بالبصمة");
  }

  let credentialId;
  try {
    credentialId = localStorage.getItem(STORAGE_PREFIX + username);
  } catch {
    credentialId = null;
  }
  if (!credentialId) {
    throw new Error("لم يتم تفعيل البصمة على هذا الجهاز لهذا الحساب");
  }

  const assertion = await navigator.credentials.get({
    publicKey: {
      challenge: randomChallenge(),
      allowCredentials: [
        {
          id: base64ToBuffer(credentialId),
          type: "public-key",
          transports: ["internal"],
        },
      ],
      userVerification: "required",
      timeout: 60000,
    },
  });

  if (!assertion) throw new Error("فشل التحقق من البصمة");
  return true;
}

// لو محتاج تلغي تفعيل البصمة من هذا الجهاز
export function removeBiometric(username) {
  try {
    localStorage.removeItem(STORAGE_PREFIX + username);
  } catch {}
}
