export default function Header({ currentUser, onLogout, stats, onOpenReview }) {
  const isNasser = currentUser === "nasser";

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        background: "rgba(10,7,22,0.78)",
        backdropFilter: "blur(22px) saturate(160%)",
        WebkitBackdropFilter: "blur(22px) saturate(160%)",
        borderBottom: "1px solid rgba(167,139,250,0.12)",
        animation: "fadeSlideDown 0.5s var(--spring) both",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "16px 18px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", direction: "rtl" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
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
              }}
            >
              📖
            </div>
            <div>
              <div style={{ fontFamily: "Amiri, serif", fontSize: 18, fontWeight: 700, color: "var(--violet-light)" }}>
                دفترنا
              </div>
              <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
                {isNasser ? "أهلاً ناصر" : "أهلاً أسماء"} ✦
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={onOpenReview} style={pillBtn}>
              📊 المراجعة
            </button>
            <button onClick={onLogout} style={{ ...pillBtn, color: "var(--red)" }}>
              خروج
            </button>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 14, direction: "rtl" }}>
          <StatChip label="الدروس" value={stats.total} color="var(--violet-light)" />
          <StatChip label="هذا الشهر" value={stats.thisMonth} color="var(--pink)" />
          <StatChip label="التعليقات" value={stats.comments} color="var(--gold)" />
        </div>
      </div>
    </div>
  );
}

function StatChip({ label, value, color }) {
  return (
    <div
      style={{
        flex: 1,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(167,139,250,0.10)",
        borderRadius: 14,
        padding: "9px 8px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 19, fontWeight: 800, color, lineHeight: 1.2 }}>{value}</div>
      <div style={{ fontSize: 10.5, color: "var(--text-muted)", marginTop: 1 }}>{label}</div>
    </div>
  );
}

const pillBtn = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(167,139,250,0.16)",
  color: "var(--text-secondary)",
  fontFamily: "inherit",
  fontSize: 12.5,
  fontWeight: 600,
  padding: "8px 14px",
  borderRadius: 20,
  cursor: "pointer",
  transition: "all 0.2s ease",
  whiteSpace: "nowrap",
};
