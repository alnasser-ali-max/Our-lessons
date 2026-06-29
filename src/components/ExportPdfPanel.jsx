import { useState, useRef } from "react";
import { CATS, arDate } from "../data";
import { useTheme } from "../ThemeContext";

// تحميل المكتبات من CDN عند الحاجة فقط (نفس أسلوب html2canvas في بطاقة المشاركة)
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

async function ensureLibs() {
  if (!window.html2canvas) {
    await loadScript("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js");
  }
  if (!window.jspdf) {
    await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
  }
}

const COVER_GRADIENT = "linear-gradient(150deg, #2E1065 0%, #6D28D9 45%, #A78BFA 75%, #F0ABFC 130%)";

export default function ExportPdfPanel({ lessons, onClose }) {
  const { theme } = useTheme();
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const renderRoot = useRef(null);

  const primaryBtn = {
    flex: 1,
    padding: 13,
    borderRadius: 14,
    border: "none",
    background: "linear-gradient(135deg, #6D28D9, #A78BFA)",
    color: theme.onAccent,
    fontWeight: 700,
    fontFamily: "inherit",
    fontSize: 14,
    cursor: "pointer",
  };

  const secondaryBtn = {
    flex: 1,
    padding: 13,
    borderRadius: 14,
    border: `1px solid ${theme.border}`,
    background: "transparent",
    color: theme.textMuted,
    fontFamily: "inherit",
    fontSize: 14,
    cursor: "pointer",
  };

  const sortedLessons = [...lessons].sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

  async function handleGenerate() {
    setGenerating(true);
    setError("");
    setProgress(0);
    setDone(false);
    try {
      await ensureLibs();
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({ unit: "pt", format: "a4" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();

      // صفحة الغلاف
      const coverEl = renderRoot.current.querySelector("[data-page='cover']");
      await renderPageToPdf(pdf, coverEl, pageW, pageH, false);
      setProgress(1 / (sortedLessons.length + 1));

      // صفحة لكل درس
      for (let i = 0; i < sortedLessons.length; i++) {
        const el = renderRoot.current.querySelector(`[data-page='lesson-${i}']`);
        await renderPageToPdf(pdf, el, pageW, pageH, true);
        setProgress((i + 2) / (sortedLessons.length + 1));
      }

      pdf.save("دفترنا - دروس الحياة.pdf");
      setDone(true);
    } catch (e) {
      console.error(e);
      setError("حدث خطأ أثناء إنشاء الملف. حاول مرة أخرى.");
    } finally {
      setGenerating(false);
    }
  }

  async function renderPageToPdf(pdf, el, pageW, pageH, addPage) {
    if (!el) return;
    const canvas = await window.html2canvas(el, { scale: 2, backgroundColor: "#0A0716" });
    const imgData = canvas.toDataURL("image/jpeg", 0.92);
    if (addPage) pdf.addPage();
    pdf.addImage(imgData, "JPEG", 0, 0, pageW, pageH);
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 90,
        background: "rgba(5,3,12,0.85)",
        backdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        animation: "fadeIn 0.25s ease both",
      }}
      onClick={(e) => e.target === e.currentTarget && !generating && onClose()}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: theme.sheetGradient,
          border: `1px solid ${theme.border}`,
          borderRadius: 26,
          padding: 30,
          textAlign: "center",
          animation: "popIn 0.4s var(--spring) both",
        }}
      >
        <div style={{ fontSize: 36, marginBottom: 12 }}>📕</div>
        <h2 style={{ fontFamily: "Amiri, serif", fontSize: 19, color: theme.violetLight, marginBottom: 8 }}>
          تصدير دفترنا كاملاً
        </h2>
        <p style={{ fontSize: 13, color: theme.textMuted, lineHeight: 1.7, marginBottom: 6 }}>
          تحويل كل الدروس ({sortedLessons.length}) إلى ملف PDF واحد منسّق وملوّن بترتيب التاريخ
        </p>

        {!generating && !done && (
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <button onClick={onClose} style={secondaryBtn}>
              إغلاق
            </button>
            <button onClick={handleGenerate} style={primaryBtn} disabled={sortedLessons.length === 0}>
              إنشاء الملف
            </button>
          </div>
        )}

        {generating && (
          <div style={{ marginTop: 24 }}>
            <div style={{ height: 8, background: theme.surfaceHover, borderRadius: 8, overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  width: `${progress * 100}%`,
                  background: "linear-gradient(90deg, #6D28D9, #A78BFA, #F0ABFC)",
                  borderRadius: 8,
                  transition: "width 0.3s ease",
                }}
              />
            </div>
            <p style={{ fontSize: 12.5, color: theme.textMuted, marginTop: 10 }}>
              جارٍ التحضير... {Math.round(progress * 100)}%
            </p>
          </div>
        )}

        {done && (
          <div style={{ marginTop: 22 }}>
            <p style={{ fontSize: 14, color: theme.green, marginBottom: 16 }}>✓ تم إنشاء الملف وتحميله</p>
            <button onClick={onClose} style={primaryBtn}>
              تم
            </button>
          </div>
        )}

        {error && <p style={{ fontSize: 12.5, color: theme.red, marginTop: 14 }}>{error}</p>}
      </div>

      {/* جذر الصفحات المخفي — يُستخدم فقط للرسم على Canvas، غير مرئي للمستخدم */}
      <div
        ref={renderRoot}
        style={{ position: "fixed", top: 0, left: -99999, width: 595, pointerEvents: "none" }}
        aria-hidden="true"
      >
        <CoverPage count={sortedLessons.length} />
        {sortedLessons.map((lesson, i) => (
          <LessonPage key={lesson.id || i} lesson={lesson} index={i} total={sortedLessons.length} />
        ))}
      </div>
    </div>
  );
}

function CoverPage({ count }) {
  return (
    <div
      data-page="cover"
      style={{
        width: 595,
        height: 842,
        background: COVER_GRADIENT,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 60,
        boxSizing: "border-box",
        fontFamily: "Amiri, serif",
      }}
    >
      <div style={{ fontSize: 90, marginBottom: 24 }}>📖</div>
      <div style={{ fontSize: 46, color: "#fff", fontWeight: 700, marginBottom: 14, textAlign: "center" }}>
        دفترنا
      </div>
      <div style={{ fontSize: 22, color: "rgba(255,255,255,0.88)", marginBottom: 50, textAlign: "center" }}>
        دروس الحياة — ناصر وأسماء
      </div>
      <div
        style={{
          width: 80,
          height: 2,
          background: "rgba(255,255,255,0.5)",
          marginBottom: 50,
        }}
      />
      <div style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", fontFamily: "Tajawal, sans-serif" }}>
        {count} درساً محفوظاً
      </div>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", marginTop: 8, fontFamily: "Tajawal, sans-serif" }}>
        {arDate(new Date())}
      </div>
    </div>
  );
}

function LessonPage({ lesson, index, total }) {
  const cat = CATS[lesson.category] || CATS.wisdom;
  const date = lesson.timestamp ? arDate(new Date(lesson.timestamp)) : "";
  const textLength = (lesson.text || "").length;
  // تصغير الخط تلقائياً للدروس الطويلة لمنع تجاوز حدود الصفحة
  const fontSize = textLength > 600 ? 16 : textLength > 350 ? 19 : textLength > 180 ? 22 : 26;
  const lineHeight = textLength > 350 ? 1.7 : 2;

  return (
    <div
      data-page={`lesson-${index}`}
      style={{
        width: 595,
        height: 842,
        background: "linear-gradient(170deg, #150D2A 0%, #0A0716 100%)",
        padding: "70px 56px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        direction: "rtl",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
        <div
          style={{
            fontSize: 14,
            fontFamily: "Tajawal, sans-serif",
            color: cat.color,
            background: `${cat.color}22`,
            padding: "8px 18px",
            borderRadius: 24,
            fontWeight: 700,
          }}
        >
          {cat.emoji} {cat.label}
        </div>
        <div style={{ fontSize: 13, fontFamily: "Tajawal, sans-serif", color: "#7A6C9A" }}>{date}</div>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          maxHeight: 640,
        }}
      >
        <p
          style={{
            fontFamily: "Amiri, serif",
            fontSize,
            lineHeight,
            color: "#F3EEFF",
            textAlign: "center",
            margin: 0,
          }}
        >
          {lesson.text}
        </p>
      </div>

      <div
        style={{
          borderTop: `1px solid ${cat.color}33`,
          paddingTop: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: "Tajawal, sans-serif",
        }}
      >
        <div style={{ fontSize: 14, color: "#C9BCE8" }}>
          ✍️ {lesson.author === "nasser" ? "ناصر" : "أسماء"} {lesson.mood ? `· ${lesson.mood}` : ""}
        </div>
        <div style={{ fontSize: 12, color: "#7A6C9A" }}>
          {index + 1} / {total}
        </div>
      </div>
    </div>
  );
}
