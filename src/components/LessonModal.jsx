import { useState, useEffect, useRef } from "react";
import { CATS, SHARE_GRADIENTS, arDate, arTime } from "../data";
import { fbSaveComment, fbDeleteComment, fbListenComments } from "../firebase";
import { useTheme } from "../ThemeContext";

export default function LessonModal({ lesson, currentUser, onClose }) {
  const { theme } = useTheme();
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [sending, setSending] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [closing, setClosing] = useState(false);
  const shareRef = useRef(null);
  const cat = CATS[lesson.category] || CATS.wisdom;

  useEffect(() => {
    const unsub = fbListenComments(lesson.id, setComments);
    return () => unsub && unsub();
  }, [lesson.id]);

  function handleClose() {
    setClosing(true);
    setTimeout(onClose, 280);
  }

  async function handleSendComment() {
    if (!commentText.trim() || sending) return;
    setSending(true);
    await fbSaveComment({
      lessonId: lesson.id,
      text: commentText.trim(),
      author: currentUser,
      timestamp: Date.now(),
    });
    setCommentText("");
    setSending(false);
  }

  async function handleDeleteComment(c) {
    await fbDeleteComment(c.id, lesson.id);
  }

  async function handleDownloadShare() {
    if (!window.html2canvas) {
      await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      }).catch(() => { /* تجاهل فشل تحميل html2canvas، سيُتحقق منه أدناه */ });
    }
    if (!window.html2canvas || !shareRef.current) return;
    const canvas = await window.html2canvas(shareRef.current, { scale: 2, backgroundColor: null });
    const link = document.createElement("a");
    link.download = "درس-من-دفترنا.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  const gradient = SHARE_GRADIENTS[lesson.id ? lesson.id.charCodeAt(0) % SHARE_GRADIENTS.length : 0];

  const closeBtn = {
    width: 32,
    height: 32,
    borderRadius: "50%",
    border: `1px solid ${theme.border}`,
    background: theme.surface,
    color: theme.textSecondary,
    fontSize: 14,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const shareBtn = {
    width: "100%",
    background: theme.surface,
    border: `1.5px solid ${theme.border}`,
    color: theme.violetLight,
    padding: "12px",
    borderRadius: 16,
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "all 0.25s ease",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        background: theme.overlayBg,
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
          maxWidth: 560,
          maxHeight: "88vh",
          background: theme.sheetGradient,
          borderRadius: 26,
          border: `1px solid ${theme.border}`,
          boxShadow: theme.shadowPanel,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          animation: closing
            ? "popIn 0.28s ease reverse both"
            : "popIn 0.4s var(--spring) both",
        }}
      >
        <div style={{ padding: "20px 22px 14px", borderBottom: `1px solid ${theme.borderSoft}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", direction: "rtl" }}>
            <span
              style={{
                fontSize: 12.5,
                background: `${cat.color}22`,
                color: cat.color,
                padding: "5px 12px",
                borderRadius: 20,
                fontWeight: 700,
              }}
            >
              {cat.emoji} {cat.label}
            </span>
            <button onClick={handleClose} style={closeBtn}>✕</button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px 22px" }}>
          <p
            style={{
              fontFamily: "Amiri, serif",
              fontSize: 19,
              lineHeight: 2,
              color: theme.text,
              textAlign: "right",
              marginBottom: 14,
            }}
          >
            {lesson.text}
          </p>

          <div style={{ display: "flex", justifyContent: "space-between", direction: "rtl", marginBottom: 18 }}>
            <span style={{ fontSize: 12, color: theme.textMuted }}>
              ✍️ {lesson.author === "nasser" ? "ناصر" : "أسماء"} {lesson.mood ? `· ${lesson.mood}` : ""}
            </span>
            <span style={{ fontSize: 12, color: theme.textMuted }}>
              {lesson.timestamp ? `${arDate(new Date(lesson.timestamp))} · ${arTime(new Date(lesson.timestamp))}` : ""}
            </span>
          </div>

          <button onClick={() => setShowShare(true)} style={shareBtn}>
            🖼 إنشاء بطاقة مشاركة
          </button>

          <div style={{ height: 1, background: theme.borderSoft, margin: "20px 0" }} />

          <div style={{ fontSize: 13, color: theme.textMuted, textAlign: "right", marginBottom: 12 }}>
            التعليقات ({comments.length})
          </div>

          {comments.length === 0 && (
            <div style={{ textAlign: "center", padding: "20px 0", color: theme.textMuted, fontSize: 13 }}>
              لا توجد تعليقات بعد — كن أول من يعلّق ✦
            </div>
          )}

          {comments.map((c, i) => (
            <div
              key={c.id}
              style={{
                background: theme.surface,
                borderRadius: 14,
                padding: "11px 14px",
                marginBottom: 8,
                animation: `fadeSlideUp 0.35s ${Math.min(i * 0.05, 0.3)}s var(--spring) both`,
                direction: "rtl",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: theme.violetLight }}>
                  {c.author === "nasser" ? "ناصر" : "أسماء"}
                </span>
                {c.author === currentUser && (
                  <button
                    onClick={() => handleDeleteComment(c)}
                    style={{ background: "none", border: "none", color: theme.textMuted, cursor: "pointer", fontSize: 12, opacity: 0.7 }}
                  >
                    حذف
                  </button>
                )}
              </div>
              <p style={{ fontSize: 14, color: theme.textSecondary, lineHeight: 1.6, textAlign: "right" }}>{c.text}</p>
            </div>
          ))}
        </div>

        <div style={{ padding: "14px 18px", borderTop: `1px solid ${theme.borderSoft}`, display: "flex", gap: 8, direction: "rtl" }}>
          <input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendComment()}
            placeholder="أضف تعليقاً..."
            style={{
              flex: 1,
              background: theme.inputBg,
              border: `1.5px solid ${theme.border}`,
              borderRadius: 22,
              padding: "11px 16px",
              fontSize: 14,
              color: theme.text,
              outline: "none",
              textAlign: "right",
              fontFamily: "inherit",
            }}
          />
          <button
            onClick={handleSendComment}
            disabled={!commentText.trim() || sending}
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              border: "none",
              background: commentText.trim()
                ? "linear-gradient(135deg, #6D28D9, #A78BFA)"
                : theme.surfaceHover,
              color: "#fff",
              fontSize: 16,
              cursor: commentText.trim() ? "pointer" : "default",
              flexShrink: 0,
              transition: "transform 0.2s var(--spring)",
            }}
            onMouseDown={(e) => { if (commentText.trim()) e.currentTarget.style.transform = "scale(0.9)"; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
          >
            ↑
          </button>
        </div>
      </div>

      {showShare && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 70,
            background: "rgba(5,3,12,0.85)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            animation: "fadeIn 0.25s ease both",
          }}
          onClick={(e) => { e.stopPropagation(); setShowShare(false); }}
        >
          {/* بطاقة المشاركة تبقى بنفس التصميم الداكن الملوّن دائماً، بغض النظر عن المظهر المختار، لأنها مُصمَّمة للمشاركة الخارجية */}
          <div
            ref={shareRef}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 320,
              minHeight: 400,
              background: gradient,
              borderRadius: 28,
              padding: 32,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 30px 70px rgba(0,0,0,0.5)",
              animation: "popIn 0.4s var(--spring) both",
            }}
          >
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", fontWeight: 600, textAlign: "right" }}>
              📖 دفترنا — دروس الحياة
            </div>
            <p
              style={{
                fontFamily: "Amiri, serif",
                fontSize: 22,
                color: "#fff",
                lineHeight: 1.8,
                textAlign: "right",
                fontWeight: 700,
                textShadow: "0 2px 10px rgba(0,0,0,0.2)",
              }}
            >
              {lesson.text}
            </p>
            <div style={{ display: "flex", justifyContent: "space-between", direction: "rtl" }}>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}>
                {lesson.author === "nasser" ? "ناصر" : "أسماء"}
              </span>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
                {lesson.timestamp ? arDate(new Date(lesson.timestamp)) : ""}
              </span>
            </div>
          </div>

          <button
            onClick={handleDownloadShare}
            style={{
              marginTop: 22,
              background: "linear-gradient(135deg, #6D28D9, #A78BFA)",
              border: "none",
              color: "#fff",
              padding: "13px 28px",
              borderRadius: 20,
              fontFamily: "inherit",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 10px 26px rgba(124,58,237,0.45)",
            }}
          >
            ⬇ تحميل الصورة
          </button>
        </div>
      )}
    </div>
  );
}
