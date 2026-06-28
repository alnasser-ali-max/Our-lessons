import { useState, useMemo } from "react";
import { CATS, QUOTES } from "../data";
import { fbSaveReview } from "../firebase";

export default function MonthlyReview({ lessons, currentUser, onClose }) {
  const [closing, setClosing] = useState(false);
  const [saved, setSaved] = useState(false);

  const stats = useMemo(() => {
    const now = new Date();
    const thisMonth = lessons.filter((l) => {
      if (!l.timestamp) return false;
      const d = new Date(l.timestamp);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });

    const byCategory = {};
    thisMonth.forEach((l) => {
      byCategory[l.category] = (byCategory[l.category] || 0) + 1;
    });

    const topCat = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];
    const byAuthor = { nasser: 0, asmaa: 0 };
    thisMonth.forEach((l) => { if (byAuthor[l.author] !== undefined) byAuthor[l.author]++; });

    return {
      total: thisMonth.length,
      byCategory,
      topCat,
      byAuthor,
      quote: QUOTES[now.getMonth() % QUOTES.length],
      monthName: now.toLocaleDateString("ar-EG", { month: "long", year: "numeric" }),
    };
  }, [lessons]);

  function handleClose() {
    setClosing(true);
    setTimeout(onClose, 280);
  }

  async function handleSaveReview() {
    await fbSaveReview({
      month: stats.monthName,
      total: stats.total,
      topCategory: stats.topCat ? stats.topCat[0] : null,
      timestamp: Date.now(),
      author: currentUser,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const maxCount = Math.max(1, ...Object.values(stats.byCategory));

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        background: "rgba(5,3,12,0.75)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        animation: closing ? "fadeIn 0.28s ease reverse both" : "fadeIn 0.25s ease both",
      }}
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 540,
          maxHeight: "88vh",
          overflowY: "auto",
          background: "linear-gradient(165deg, #1B1133 0%, #120A24 60%, #0A0716 100%)",
          borderRadius: 28,
          border: "1px solid rgba(167,139,250,0.18)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.55), 0 0 60px rgba(124,58,237,0.12)",
          padding: "26px 24px",
          animation: closing ? "popIn 0.28s ease reverse both" : "popIn 0.45s var(--spring) both",
          position: "relative",
        }}
      >
        <button onClick={handleClose} style={{ position: "absolute", left: 20, top: 20, ...closeBtn }}>✕</button>

        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 34, marginBottom: 8, animation: "popIn 0.6s 0.1s var(--spring) both" }}>📊</div>
          <h2 style={{ fontFamily: "Amiri, serif", fontSize: 22, color: "var(--violet-light)" }}>مراجعة الشهر</h2>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>{stats.monthName}</p>
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 22 }}>
          <BigStat value={stats.total} label="درس هذا الشهر" color="var(--violet-light)" delay={0.05} />
          <BigStat value={stats.byAuthor.nasser} label="دروس ناصر" color="var(--pink)" delay={0.1} />
          <BigStat value={stats.byAuthor.asmaa} label="دروس أسماء" color="var(--gold)" delay={0.15} />
        </div>

        {stats.topCat && (
          <div
            style={{
              background: "rgba(167,139,250,0.08)",
              border: "1px solid rgba(167,139,250,0.16)",
              borderRadius: 16,
              padding: 16,
              marginBottom: 20,
              textAlign: "center",
              animation: "fadeSlideUp 0.5s 0.2s var(--spring) both",
            }}
          >
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>التصنيف الأكثر تكراراً: </span>
            <span style={{ fontSize: 14, fontWeight: 700, color: "var(--violet-light)" }}>
              {CATS[stats.topCat[0]]?.emoji} {CATS[stats.topCat[0]]?.label}
            </span>
          </div>
        )}

        <div style={{ marginBottom: 22 }}>
          {Object.entries(stats.byCategory).sort((a, b) => b[1] - a[1]).map(([key, count], i) => {
            const cat = CATS[key];
            if (!cat) return null;
            return (
              <div key={key} style={{ marginBottom: 10, animation: `fadeSlideUp 0.4s ${0.25 + i * 0.06}s var(--spring) both` }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 5, direction: "rtl" }}>
                  <span style={{ color: "var(--text-secondary)" }}>{cat.emoji} {cat.label}</span>
                  <span style={{ color: cat.color, fontWeight: 700 }}>{count}</span>
                </div>
                <div style={{ height: 7, background: "rgba(255,255,255,0.05)", borderRadius: 8, overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${(count / maxCount) * 100}%`,
                      background: `linear-gradient(90deg, ${cat.color}99, ${cat.color})`,
                      borderRadius: 8,
                      transition: "width 0.8s var(--spring)",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            background: "linear-gradient(135deg, rgba(109,40,217,0.25), rgba(240,171,252,0.12))",
            border: "1px solid rgba(167,139,250,0.2)",
            borderRadius: 18,
            padding: "18px 20px",
            textAlign: "center",
            marginBottom: 18,
          }}
        >
          <p style={{ fontFamily: "Amiri, serif", fontSize: 15.5, color: "var(--text)", lineHeight: 1.8, fontStyle: "italic" }}>
            "{stats.quote}"
          </p>
        </div>

        <button
          onClick={handleSaveReview}
          style={{
            width: "100%",
            background: saved ? "rgba(52,211,153,0.18)" : "linear-gradient(135deg, #6D28D9, #A78BFA)",
            border: saved ? "1.5px solid var(--green)" : "none",
            color: saved ? "var(--green)" : "#1B0E33",
            padding: 14,
            borderRadius: 16,
            fontSize: 14.5,
            fontWeight: 800,
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "all 0.3s ease",
          }}
        >
          {saved ? "✓ تم الحفظ" : "حفظ هذه المراجعة"}
        </button>
      </div>
    </div>
  );
}

function BigStat({ value, label, color, delay }) {
  return (
    <div
      style={{
        flex: 1,
        background: "rgba(255,255,255,0.04)",
        borderRadius: 16,
        padding: "14px 8px",
        textAlign: "center",
        animation: `popIn 0.5s ${delay}s var(--spring) both`,
      }}
    >
      <div style={{ fontSize: 24, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 10.5, color: "var(--text-muted)", marginTop: 2 }}>{label}</div>
    </div>
  );
}

const closeBtn = {
  width: 32,
  height: 32,
  borderRadius: "50%",
  border: "1px solid rgba(167,139,250,0.16)",
  background: "rgba(255,255,255,0.04)",
  color: "var(--text-secondary)",
  fontSize: 14,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 5,
};
