import { useState } from "react";
import { CATS, arDate } from "../data";

export default function LessonCard({ lesson, index, currentUser, onOpen, onDelete }) {
  const [pressed, setPressed] = useState(false);
  const cat = CATS[lesson.category] || CATS.wisdom;
  const isMine = lesson.author === currentUser;
  const date = lesson.timestamp ? arDate(new Date(lesson.timestamp)) : "";

  return (
    <div
      onClick={() => onOpen(lesson)}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        background: "linear-gradient(160deg, rgba(27,17,51,0.55), rgba(18,10,36,0.65))",
        border: "1px solid rgba(167,139,250,0.12)",
        borderRadius: 20,
        padding: "18px 18px 16px",
        marginBottom: 12,
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        transform: pressed ? "scale(0.985)" : "scale(1)",
        transition: "transform 0.18s var(--ease-out), border-color 0.3s ease, box-shadow 0.3s ease",
        animation: `fadeSlideUp 0.45s ${Math.min(index * 0.05, 0.4)}s var(--spring) both`,
        boxShadow: "0 2px 14px rgba(0,0,0,0.25)",
      }}
      onMouseOver={(e) => { e.currentTarget.style.borderColor = `${cat.color}40`; e.currentTarget.style.boxShadow = `0 8px 26px ${cat.color}1a`; }}
      onMouseOut={(e) => { e.currentTarget.style.borderColor = "rgba(167,139,250,0.12)"; e.currentTarget.style.boxShadow = "0 2px 14px rgba(0,0,0,0.25)"; }}
    >
      <div
        style={{
          position: "absolute",
          insetInlineEnd: 0,
          top: 0,
          bottom: 0,
          width: 3,
          background: cat.color,
          opacity: 0.7,
        }}
      />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", direction: "rtl", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span
            style={{
              fontSize: 12,
              background: `${cat.color}22`,
              color: cat.color,
              padding: "4px 10px",
              borderRadius: 20,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            {cat.emoji} {cat.label}
          </span>
          {lesson.mood && <span style={{ fontSize: 15 }}>{lesson.mood}</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {isMine && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(lesson); }}
              style={{
                background: "none",
                border: "none",
                color: "var(--text-muted)",
                fontSize: 15,
                cursor: "pointer",
                padding: 4,
                opacity: 0.6,
                transition: "opacity 0.2s ease, color 0.2s ease",
              }}
              onMouseOver={(e) => { e.currentTarget.style.opacity = 1; e.currentTarget.style.color = "var(--red)"; }}
              onMouseOut={(e) => { e.currentTarget.style.opacity = 0.6; e.currentTarget.style.color = "var(--text-muted)"; }}
            >
              🗑
            </button>
          )}
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{date}</span>
        </div>
      </div>

      <p
        style={{
          fontFamily: "Amiri, serif",
          fontSize: 16,
          lineHeight: 1.85,
          color: "var(--text)",
          textAlign: "right",
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {lesson.text}
      </p>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, direction: "rtl" }}>
        <span
          style={{
            fontSize: 11.5,
            color: "var(--text-muted)",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          ✍️ {lesson.author === "nasser" ? "ناصر" : "أسماء"}
        </span>
        {lesson.commentCount > 0 && (
          <span style={{ fontSize: 11.5, color: cat.color, display: "flex", alignItems: "center", gap: 4 }}>
            💬 {lesson.commentCount}
          </span>
        )}
      </div>
    </div>
  );
}
