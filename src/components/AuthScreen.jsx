import { useState, useRef } from "react";
import { USERS } from "../data";

const ORBS = [
  { size: 320, top: "-80px", right: "-60px", color: "rgba(124,58,237,0.45)", delay: "0s" },
  { size: 220, bottom: "40px", left: "-40px", color: "rgba(240,171,252,0.30)", delay: "-3s" },
  { size: 160, top: "38%", left: "16%", color: "rgba(167,139,250,0.25)", delay: "-5s" },
];

export default function AuthScreen({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [shake, setShake] = useState(false);
  const [opening, setOpening] = useState(false);
  const cardRef = useRef(null);

  function handleLogin() {
    const u = username.trim().toLowerCase();
    const p = password;
    if (USERS[u] === p) {
      setOpening(true);
      setTimeout(() => onLogin(u), 620);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }

  function handleKey(e) {
    if (e.key === "Enter") handleLogin();
  }

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
        background:
          "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(124,58,237,0.30) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 90% 90%, rgba(240,171,252,0.14) 0%, transparent 60%), linear-gradient(165deg, #0A0716 0%, #150D2A 55%, #0A0716 100%)",
      }}
    >
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
          background: "linear-gradient(165deg, rgba(27,17,51,0.92), rgba(18,10,36,0.95))",
          backdropFilter: "blur(28px) saturate(180%)",
          WebkitBackdropFilter: "blur(28px) saturate(180%)",
          border: "1px solid rgba(167,139,250,0.18)",
          borderRadius: 32,
          padding: "44px 34px",
          width: "100%",
          maxWidth: 380,
          boxShadow: "0 1px 0 rgba(255,255,255,0.06) inset, 0 24px 70px rgba(0,0,0,0.5), 0 0 60px rgba(124,58,237,0.12)",
          position: "relative",
          zIndex: 1,
          animation: opening
            ? "bookOpen 0.6s cubic-bezier(0.6,0,0.4,1) forwards"
            : "fadeSlideUp 0.7s var(--spring, cubic-bezier(0.34,1.56,0.64,1)) both",
          transform: shake ? undefined : "none",
          transformOrigin: "right center",
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
              color: "var(--violet-light)",
              fontWeight: 700,
              letterSpacing: 0.3,
            }}
          >
            دفترنا
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 6, letterSpacing: 0.2 }}>
            دروس الحياة — ناصر وأسماء
          </p>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 7, textAlign: "right" }}>
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
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 7, textAlign: "right" }}>
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
            color: "#1B0E33",
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
    </div>
  );
}

const inputStyle = {
  width: "100%",
  background: "rgba(255,255,255,0.05)",
  border: "1.5px solid rgba(167,139,250,0.18)",
  borderRadius: 13,
  padding: "13px 15px",
  fontFamily: "inherit",
  fontSize: 15,
  outline: "none",
  textAlign: "right",
  color: "var(--text)",
  transition: "all 0.25s ease",
  WebkitAppearance: "none",
};
