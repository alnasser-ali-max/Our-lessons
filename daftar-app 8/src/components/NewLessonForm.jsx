import { useState } from "react";
import { CATS } from "../data";

const MOODS = ["😊", "😌", "😔", "😤", "🤔", "😍", "😢", "💪"];

export default function NewLessonForm({ onSave, onClose }) {
  const [text, setText] = useState("");
  const [category, setCategory] = useState("wisdom");
  const [mood, setMood] = useState(null);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!text.trim() || saving) return;
    setSaving(true);
    await onSave({ text: text.trim(), category, mood });
    setSaving(false);
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        background: "rgba(5,3,12,0.65)",
        backdropFilter: "blur(6px)",
        animation: "fadeIn 0.25s ease both",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 560,
          background: "linear-gradient(170deg, #1B1133 0%, #120A24 100%)",
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          border: "1px solid rgba(167,139,250,0.18)",
          borderBottom: "none",
          padding: "10px 22px 28px",
          boxShadow: "0 -20px 60px rgba(0,0,0,0.5)",
          animation: "sheetUp 0.4s var(--spring) both",
          maxHeight: "85vh",
          overflowY: "auto",
        }}
      >
        <style>{`
          @keyframes sheetUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        `}</style>

        <div style={{ width: 40, height: 4, borderRadius: 4, background: "rgba(167,139,250,0.3)", margin: "8px auto 18px" }} />

        <h2 style={{ fontFamily: "Amiri, serif", fontSize: 20, color: "var(--violet-light)", textAlign: "right", marginBottom: 18 }}>
          درس جديد ✦
        </h2>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="ما الدرس الذي تعلمته اليوم؟"
          rows={5}
          autoFocus
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.05)",
            border: "1.5px solid rgba(167,139,250,0.18)",
            borderRadius: 16,
            padding: 14,
            fontFamily: "Amiri, serif",
            fontSize: 16,
            color: "var(--text)",
            outline: "none",
            resize: "none",
            textAlign: "right",
            lineHeight: 1.8,
            direction: "rtl",
          }}
        />

        <div style={{ marginTop: 18 }}>
          <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginBottom: 9, textAlign: "right" }}>التصنيف</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7, direction: "rtl" }}>
            {Object.entries(CATS).map(([key, c]) => {
              const isActive = category === key;
              return (
                <button
                  key={key}
                  onClick={() => setCategory(key)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "7px 12px",
                    borderRadius: 18,
                    border: isActive ? `1.5px solid ${c.color}` : "1.5px solid rgba(167,139,250,0.1)",
                    background: isActive ? `${c.color}28` : "rgba(255,255,255,0.03)",
                    color: isActive ? c.color : "var(--text-muted)",
                    fontSize: 12.5,
                    fontWeight: isActive ? 700 : 500,
                    cursor: "pointer",
                    transition: "all 0.25s var(--spring)",
                    transform: isActive ? "scale(1.04)" : "scale(1)",
                  }}
                >
                  {c.emoji} {c.label}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ marginTop: 18 }}>
          <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginBottom: 9, textAlign: "right" }}>كيف تشعر؟ (اختياري)</div>
          <div style={{ display: "flex", gap: 6, direction: "rtl" }}>
            {MOODS.map((m) => (
              <button
                key={m}
                onClick={() => setMood(mood === m ? null : m)}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  border: mood === m ? "1.5px solid var(--violet-light)" : "1.5px solid rgba(167,139,250,0.1)",
                  background: mood === m ? "rgba(167,139,250,0.18)" : "rgba(255,255,255,0.03)",
                  fontSize: 18,
                  cursor: "pointer",
                  transition: "all 0.25s var(--spring)",
                  transform: mood === m ? "scale(1.12)" : "scale(1)",
                }}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: 14,
              borderRadius: 16,
              border: "1.5px solid rgba(167,139,250,0.16)",
              background: "transparent",
              color: "var(--text-muted)",
              fontFamily: "inherit",
              fontSize: 14.5,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            إلغاء
          </button>
          <button
            onClick={handleSave}
            disabled={!text.trim() || saving}
            style={{
              flex: 2,
              padding: 14,
              borderRadius: 16,
              border: "none",
              background: text.trim()
                ? "linear-gradient(135deg, #6D28D9, #A78BFA 60%, #F0ABFC 130%)"
                : "rgba(167,139,250,0.15)",
              color: text.trim() ? "#1B0E33" : "var(--text-muted)",
              fontFamily: "inherit",
              fontSize: 15,
              fontWeight: 800,
              cursor: text.trim() ? "pointer" : "default",
              boxShadow: text.trim() ? "0 8px 22px rgba(124,58,237,0.4)" : "none",
              transition: "all 0.25s ease",
            }}
          >
            {saving ? "جارٍ الحفظ..." : "حفظ الدرس"}
          </button>
        </div>
      </div>
    </div>
  );
}
