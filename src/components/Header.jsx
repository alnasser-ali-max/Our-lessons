import { useState, useRef } from "react";
import { useTheme } from "../ThemeContext";

const LONG_PRESS_MS = 5000;

export default function Header({ currentUser, onLogout, stats, onOpenReview, onOpenExport }) {
  const { theme, mode, toggleTheme } = useTheme();
  const isNasser = currentUser === "nasser";
  const [pressProgress, setPressProgress] = useState(0);
  const pressTimer = useRef(null);
  const pressStart = useRef(null);
  const rafId = useRef(null);

  function startPress() {
    pressStart.current = Date.now();
    const tick = () => {
      const elapsed = Date.now() - pressStart.current;
      const pct = Math.min(elapsed / LONG_PRESS_MS, 1);
      setPressProgress(pct);
      if (pct >= 1) {
        onOpenExport && onOpenExport();
        cancelPress();
        return;
      }
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);
  }

  function cancelPress() {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = null;
    pressStart.current = null;
    setPressProgress(0);
  }

  const pillBtn = {
    background: theme.surface,
    border: `1px solid ${theme.border}`,
    color: theme.textSecondary,
    fontFamily: "inherit",
    fontSize: 12.5,
    fontWeight: 600,
    padding: "8px 14px",
    borderRadius: 20,
    cursor: "pointer",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
  };

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        background: theme.headerBg,
        backdropFilter: "blur(22px) saturate(160%)",
        WebkitBackdropFilter: "blur(22px) saturate(160%)",
        borderBottom: `1px solid ${theme.borderSoft}`,
        animation: "fadeSlideDown 0.5s var(--spring) both",
        transition: "background 0.4s ease, border-color 0.4s ease",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "16px 18px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", direction: "rtl" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              onMouseDown={startPress}
              onMouseUp={cancelPress}
              onMouseLeave={cancelPress}
              onTouchStart={startPress}
              onTouchEnd={cancelPress}
              onTouchCancel={cancelPress}
              onContextMenu={(e) => e.preventDefault()}
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background: "linear-gradient(150deg, #6D28D9, #A78BFA 60%, #F0ABFC 130%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                boxShadow: "0 6px 18px rgba(124,58,237,0.4)",
                flexShrink: 0,
                position: "relative",
                userSelect: "none",
                WebkitUserSelect: "none",
                touchAction: "none",
              }}
            >
              📖
              {pressProgress > 0 && (
                <svg
                  width="50"
                  height="50"
                  style={{
                    position: "absolute",
                    top: -3,
                    left: -3,
                    transform: "rotate(-90deg)",
                    pointerEvents: "none",
                  }}
                >
                  <circle
                    cx="25"
                    cy="25"
                    r="22"
                    fill="none"
                    stroke="#F0ABFC"
                    strokeWidth="3"
                    strokeDasharray={2 * Math.PI * 22}
                    strokeDashoffset={2 * Math.PI * 22 * (1 - pressProgress)}
                    strokeLinecap="round"
                    style={{ filter: "drop-shadow(0 0 4px #F0ABFC)" }}
                  />
                </svg>
              )}
            </div>
            <div>
              <div style={{ fontFamily: "Amiri, serif", fontSize: 18, fontWeight: 700, color: theme.violetLight }}>
                دفترنا
              </div>
              <div style={{ fontSize: 11.5, color: theme.textMuted }}>
                {isNasser ? "أهلاً ناصر" : "أهلاً أسماء"} ✦
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={toggleTheme} style={{ ...pillBtn, padding: "8px 11px", fontSize: 15 }} title="تبديل المظهر">
              {mode === "dark" ? "☀️" : "🌙"}
            </button>
            <button onClick={onOpenReview} style={pillBtn}>
              📊 المراجعة
            </button>
            <button onClick={onLogout} style={{ ...pillBtn, color: theme.red }}>
              خروج
            </button>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 14, direction: "rtl" }}>
          <StatChip label="الدروس" value={stats.total} color={theme.violetLight} theme={theme} />
          <StatChip label="هذا الشهر" value={stats.thisMonth} color={theme.pink} theme={theme} />
          <StatChip label="التعليقات" value={stats.comments} color={theme.gold} theme={theme} />
        </div>
      </div>
    </div>
  );
}

function StatChip({ label, value, color, theme }) {
  return (
    <div
      style={{
        flex: 1,
        background: theme.surface,
        border: `1px solid ${theme.borderSoft}`,
        borderRadius: 14,
        padding: "9px 8px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 19, fontWeight: 800, color, lineHeight: 1.2 }}>{value}</div>
      <div style={{ fontSize: 10.5, color: theme.textMuted, marginTop: 1 }}>{label}</div>
    </div>
  );
}
