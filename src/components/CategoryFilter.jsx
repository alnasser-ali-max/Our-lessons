import { CATS } from "../data";
import { useTheme } from "../ThemeContext";

export default function CategoryFilter({ active, onChange, counts }) {
  const { theme } = useTheme();
  const all = [{ key: "all", label: "الكل", emoji: "✦", color: "#A78BFA" }, ...Object.entries(CATS).map(([key, c]) => ({ key, ...c }))];

  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        overflowX: "auto",
        padding: "4px 18px 14px",
        direction: "rtl",
      }}
    >
      {all.map((c, i) => {
        const isActive = active === c.key;
        const count = c.key === "all" ? counts.all : counts[c.key] || 0;
        return (
          <button
            key={c.key}
            onClick={() => onChange(c.key)}
            style={{
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 14px",
              borderRadius: 22,
              border: isActive ? `1.5px solid ${c.color}88` : `1.5px solid ${theme.borderSoft}`,
              background: isActive
                ? `linear-gradient(135deg, ${c.color}30, ${c.color}10)`
                : theme.surface,
              color: isActive ? c.color : theme.textMuted,
              fontFamily: "inherit",
              fontSize: 13,
              fontWeight: isActive ? 700 : 500,
              cursor: "pointer",
              transition: "all 0.3s var(--spring)",
              transform: isActive ? "translateY(-1px) scale(1.02)" : "none",
              boxShadow: isActive ? `0 4px 14px ${c.color}33` : "none",
              animation: `fadeSlideUp 0.4s ${i * 0.04}s var(--spring) both`,
              whiteSpace: "nowrap",
            }}
          >
            <span>{c.emoji}</span>
            <span>{c.label}</span>
            {count > 0 && (
              <span
                style={{
                  fontSize: 10.5,
                  background: isActive ? `${c.color}33` : theme.surfaceHover,
                  padding: "1px 6px",
                  borderRadius: 10,
                  fontWeight: 700,
                }}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
