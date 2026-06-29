import { useState, useRef } from "react";
import { USERS } from "../data";
import { isWebAuthnSupported, hasBiometricSetup, registerBiometric, loginWithBiometric } from "../webauthn";
import { useTheme } from "../ThemeContext";

const ORBS_DARK = [
  { size: 320, top: "-80px", right: "-60px", color: "rgba(124,58,237,0.45)", delay: "0s" },
  { size: 220, bottom: "40px", left: "-40px", color: "rgba(240,171,252,0.30)", delay: "-3s" },
  { size: 160, top: "38%", left: "16%", color: "rgba(167,139,250,0.25)", delay: "-5s" },
];
const ORBS_LIGHT = [
  { size: 320, top: "-80px", right: "-60px", color: "rgba(124,58,237,0.18)", delay: "0s" },
  { size: 220, bottom: "40px", left: "-40px", color: "rgba(192,38,211,0.14)", delay: "-3s" },
  { size: 160, top: "38%", left: "16%", color: "rgba(124,58,237,0.10)", delay: "-5s" },
];

export default function AuthScreen({ onLogin }) {
  const { theme, mode, toggleTheme } = useTheme();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [shake, setShake] = useState(false);
  const [opening, setOpening] = useState(false);
  const [biometricBusy, setBiometricBusy] = useState(false);
  const [biometricError, setBiometricError] = useState("");
  const [showSetupPrompt, setShowSetupPrompt] = useState(null); // username waiting for biometric setup offer
  const [setupBusy, setSetupBusy] = useState(false);
  const cardRef = useRef(null);

  const webAuthnSupported = isWebAuthnSupported();
  const ORBS = mode === "dark" ? ORBS_DARK : ORBS_LIGHT;

  // آخر مستخدم استخدم هذا الجهاز (لتعبئة اسم المستخدم تلقائياً مع خيار البصمة)
  const lastUser = (() => {
    try { return localStorage.getItem("daftar_last_user") || ""; } catch (e) { return ""; }
  })();
  const lastUserHasBiometric = lastUser && hasBiometricSetup(lastUser);

  function rememberUser(u) {
    try { localStorage.setItem("daftar_last_user", u); } catch (e) { /* ignore */ }
  }

  function completeLogin(u) {
    rememberUser(u);
    setOpening(true);
    setTimeout(() => onLogin(u), 620);
  }

  function handleLogin() {
    const u = username.trim().toLowerCase();
    const p = password;
    if (USERS[u] === p) {
      if (webAuthnSupported && !hasBiometricSetup(u)) {
        setShowSetupPrompt(u);
      } else {
        completeLogin(u);
      }
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }

  async function handleBiometricLogin() {
    setBiometricError("");
    setBiometricBusy(true);
    try {
      await loginWithBiometric(lastUser);
      completeLogin(lastUser);
    } catch (e) {
      setBiometricError("تعذّر التحقق من البصمة. جرّب كلمة المرور.");
    } finally {
      setBiometricBusy(false);
    }
  }

  async function handleEnableBiometric() {
    setSetupBusy(true);
    try {
      await registerBiometric(showSetupPrompt);
      const u = showSetupPrompt;
      setShowSetupPrompt(null);
      completeLogin(u);
    } catch (e) {
      setShowSetupPrompt(null);
      completeLogin(username.trim().toLowerCase());
    } finally {
      setSetupBusy(false);
    }
  }

  function handleSkipBiometric() {
    const u = showSetupPrompt;
    setShowSetupPrompt(null);
    completeLogin(u);
  }

  function handleKey(e) {
    if (e.key === "Enter") handleLogin();
  }

  const inputStyle = {
    width: "100%",
    background: theme.inputBg,
    border: `1.5px solid ${theme.border}`,
    borderRadius: 13,
    padding: "13px 15px",
    fontFamily: "inherit",
    fontSize: 15,
    outline: "none",
    textAlign: "right",
    color: theme.text,
    transition: "all 0.25s ease",
    WebkitAppearance: "none",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        position: "relative",
        overflow: "hidden",
        background: theme.appBg,
        transition: "background 0.4s ease",
      }}
    >
      <button
        onClick={toggleTheme}
        title="تبديل المظهر"
        style={{
          position: "absolute",
          top: 20,
          insetInlineEnd: 20,
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: `1px solid ${theme.border}`,
          background: theme.surface,
          fontSize: 16,
          cursor: "pointer",
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {mode === "dark" ? "☀️" : "🌙"}
      </button>

      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        {ORBS.map((o, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: o.size,
              height: o.size,
              top: o.top,
              right: o.right,
              bottom: o.bottom,
              left: o.left,
              borderRadius: "50%",
              filter: "blur(60px)",
              opacity: 0.5,
              background: `radial-gradient(circle, ${o.color}, transparent)`,
              animation: `orbFloat ${8 + i}s ease-in-out infinite alternate`,
              animationDelay: o.delay,
            }}
          />
        ))}
      </div>

      <div
        ref={cardRef}
        style={{
          background: theme.authGradient,
          backdropFilter: "blur(28px) saturate(180%)",
          WebkitBackdropFilter: "blur(28px) saturate(180%)",
          border: `1px solid ${theme.border}`,
          borderRadius: 32,
          padding: "44px 34px",
          width: "100%",
          maxWidth: 380,
          boxShadow: "0 1px 0 rgba(255,255,255,0.06) inset, 0 24px 70px rgba(0,0,0,0.25), 0 0 60px rgba(124,58,237,0.12)",
          position: "relative",
          zIndex: 1,
          animation: opening
            ? "bookOpen 0.6s cubic-bezier(0.6,0,0.4,1) forwards"
            : "fadeSlideUp 0.7s var(--spring, cubic-bezier(0.34,1.56,0.64,1)) both",
          transform: shake ? undefined : "none",
          transformOrigin: "right center",
          transition: "background 0.4s ease, border-color 0.4s ease",
        }}
        className={shake ? "shake-anim" : ""}
      >
        <style>{`
          .shake-anim { animation: shakeX 0.45s ease; }
          @keyframes shakeX {
            0%, 100% { transform: translateX(0); }
            20% { transform: translateX(-9px); }
            40% { transform: translateX(8px); }
            60% { transform: translateX(-6px); }
            80% { transform: translateX(5px); }
          }
        `}</style>

        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              width: 86,
              height: 86,
              margin: "0 auto 18px",
              borderRadius: 24,
              background: "linear-gradient(150deg, #6D28D9 0%, #A78BFA 60%, #F0ABFC 120%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 38,
              boxShadow: "0 10px 32px rgba(124,58,237,0.45), inset 0 1px 0 rgba(255,255,255,0.25)",
              animation: "popIn 0.8s var(--spring, cubic-bezier(0.34,1.56,0.64,1)) 0.15s both",
              position: "relative",
            }}
          >
            📖
          </div>
          <h1
            style={{
              fontFamily: "Amiri, serif",
              fontSize: 25,
              color: theme.violetLight,
              fontWeight: 700,
              letterSpacing: 0.3,
            }}
          >
            دفترنا
          </h1>
          <p style={{ fontSize: 13, color: theme.textMuted, marginTop: 6, letterSpacing: 0.2 }}>
            دروس الحياة — ناصر وأسماء
          </p>
        </div>

        {lastUserHasBiometric && (
          <div style={{ marginBottom: 22 }}>
            <button
              onClick={handleBiometricLogin}
              disabled={biometricBusy}
              style={{
                width: "100%",
                background: theme.surface,
                border: `1.5px solid ${theme.border}`,
                borderRadius: 16,
                padding: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                color: theme.violetLight,
                fontFamily: "inherit",
                fontSize: 15,
                fontWeight: 700,
                cursor: biometricBusy ? "default" : "pointer",
                opacity: biometricBusy ? 0.7 : 1,
                transition: "all 0.25s ease",
              }}
            >
              <span style={{ fontSize: 20 }}>{biometricBusy ? "⏳" : "🔓"}</span>
              {biometricBusy ? "جارٍ التحقق..." : `دخول بالبصمة (${lastUser === "nasser" ? "ناصر" : "أسماء"})`}
            </button>
            {biometricError && (
              <p style={{ fontSize: 11.5, color: theme.red, textAlign: "center", marginTop: 8 }}>
                {biometricError}
              </p>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "18px 0" }}>
              <div style={{ flex: 1, height: 1, background: theme.borderSoft }} />
              <span style={{ fontSize: 11.5, color: theme.textMuted }}>أو</span>
              <div style={{ flex: 1, height: 1, background: theme.borderSoft }} />
            </div>
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: theme.textMuted, marginBottom: 7, textAlign: "right" }}>
            اسم المستخدم
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKey}
            placeholder="nasser / asmaa"
            autoComplete="username"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: theme.textMuted, marginBottom: 7, textAlign: "right" }}>
            كلمة المرور
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKey}
            placeholder="••••••"
            autoComplete="current-password"
            style={inputStyle}
          />
        </div>

        <button
          onClick={handleLogin}
          style={{
            background: "linear-gradient(135deg, #6D28D9 0%, #A78BFA 60%, #F0ABFC 130%)",
            color: theme.onAccent,
            fontWeight: 800,
            border: "none",
            borderRadius: 16,
            padding: 15,
            width: "100%",
            fontSize: 16,
            fontFamily: "inherit",
            cursor: "pointer",
            marginTop: 10,
            boxShadow: "0 8px 26px rgba(124,58,237,0.45), 0 1px 0 rgba(255,255,255,0.3) inset",
            transition: "transform 0.2s var(--ease-out, ease), box-shadow 0.2s ease",
            letterSpacing: 0.2,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
          onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.98)"; }}
          onMouseUp={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }}
        >
          دخول إلى الدفتر
        </button>
      </div>

      {showSetupPrompt && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 80,
            background: theme.overlayBg,
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            animation: "fadeIn 0.25s ease both",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 340,
              background: theme.sheetGradient,
              border: `1px solid ${theme.border}`,
              borderRadius: 24,
              padding: 28,
              textAlign: "center",
              animation: "popIn 0.4s var(--spring, cubic-bezier(0.34,1.56,0.64,1)) both",
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 12 }}>🔐</div>
            <h3 style={{ fontFamily: "Amiri, serif", fontSize: 18, color: theme.violetLight, marginBottom: 8 }}>
              تفعيل الدخول بالبصمة
            </h3>
            <p style={{ fontSize: 13, color: theme.textMuted, lineHeight: 1.7, marginBottom: 22 }}>
              تقدر تستخدم Face ID أو بصمة الإصبع للدخول من هذا الجهاز بدون كلمة مرور في المرات القادمة
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={handleSkipBiometric}
                disabled={setupBusy}
                style={{
                  flex: 1,
                  padding: 13,
                  borderRadius: 14,
                  border: `1px solid ${theme.border}`,
                  background: "transparent",
                  color: theme.textMuted,
                  fontFamily: "inherit",
                  fontSize: 13.5,
                  cursor: "pointer",
                }}
              >
                لاحقاً
              </button>
              <button
                onClick={handleEnableBiometric}
                disabled={setupBusy}
                style={{
                  flex: 1.4,
                  padding: 13,
                  borderRadius: 14,
                  border: "none",
                  background: "linear-gradient(135deg, #6D28D9, #A78BFA)",
                  color: theme.onAccent,
                  fontWeight: 700,
                  fontFamily: "inherit",
                  fontSize: 13.5,
                  cursor: setupBusy ? "default" : "pointer",
                  opacity: setupBusy ? 0.7 : 1,
                }}
              >
                {setupBusy ? "جارٍ التفعيل..." : "تفعيل الآن"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
