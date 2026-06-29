import { createContext, useContext, useState, useEffect } from "react";

const THEMES = {
  dark: {
    name: "dark",
    bgDeep: "#0A0716",
    bgMid: "#120A24",
    bgCard: "#150D2A",
    bgCard2: "#1B1133",
    surface: "rgba(255,255,255,0.04)",
    surfaceHover: "rgba(255,255,255,0.07)",
    border: "rgba(167,139,250,0.16)",
    borderSoft: "rgba(167,139,250,0.09)",
    text: "#F3EEFF",
    textSecondary: "#C9BCE8",
    textMuted: "#7A6C9A",
    violet: "#A78BFA",
    violetLight: "#C4B5FD",
    violetDeep: "#7C3AED",
    pink: "#F0ABFC",
    gold: "#D4AF7A",
    red: "#FB7185",
    green: "#34D399",
    onAccent: "#1B0E33", // النص فوق الأزرار البنفسجية
    cardGradient: "linear-gradient(160deg, rgba(27,17,51,0.55), rgba(18,10,36,0.65))",
    sheetGradient: "linear-gradient(170deg, #1B1133 0%, #120A24 100%)",
    reviewGradient: "linear-gradient(165deg, #1B1133 0%, #120A24 60%, #0A0716 100%)",
    authGradient: "linear-gradient(165deg, rgba(27,17,51,0.92), rgba(18,10,36,0.95))",
    appBg:
      "radial-gradient(ellipse 70% 50% at 85% -5%, rgba(124,58,237,0.22) 0%, transparent 60%), radial-gradient(ellipse 55% 40% at 0% 100%, rgba(240,171,252,0.10) 0%, transparent 55%), radial-gradient(ellipse 60% 35% at 50% 50%, rgba(124,58,237,0.07) 0%, transparent 70%), linear-gradient(165deg, #0A0716 0%, #120A24 55%, #0A0716 100%)",
    starColor: "#ffffff",
    headerBg: "rgba(10,7,22,0.78)",
    overlayBg: "rgba(5,3,12,0.7)",
    inputBg: "rgba(255,255,255,0.05)",
    shadowCard: "0 2px 14px rgba(0,0,0,0.25)",
    shadowPanel: "0 30px 80px rgba(0,0,0,0.55), 0 0 60px rgba(124,58,237,0.12)",
  },
  light: {
    name: "light",
    bgDeep: "#F5F2FB",
    bgMid: "#EDE7F8",
    bgCard: "#FFFFFF",
    bgCard2: "#F7F3FC",
    surface: "rgba(124,58,237,0.05)",
    surfaceHover: "rgba(124,58,237,0.09)",
    border: "rgba(124,58,237,0.16)",
    borderSoft: "rgba(124,58,237,0.10)",
    text: "#2A1B4D",
    textSecondary: "#5B4A80",
    textMuted: "#8B7CAD",
    violet: "#7C3AED",
    violetLight: "#6D28D9",
    violetDeep: "#5B21B6",
    pink: "#C026D3",
    gold: "#B8860B",
    red: "#DC2626",
    green: "#16A34A",
    onAccent: "#FFFFFF",
    cardGradient: "linear-gradient(160deg, #FFFFFF 0%, #F7F3FC 100%)",
    sheetGradient: "linear-gradient(170deg, #FFFFFF 0%, #F7F3FC 100%)",
    reviewGradient: "linear-gradient(165deg, #FFFFFF 0%, #F7F3FC 60%, #EDE7F8 100%)",
    authGradient: "linear-gradient(165deg, rgba(255,255,255,0.95), rgba(247,243,252,0.97))",
    appBg:
      "radial-gradient(ellipse 70% 50% at 85% -5%, rgba(124,58,237,0.08) 0%, transparent 60%), radial-gradient(ellipse 55% 40% at 0% 100%, rgba(192,38,211,0.06) 0%, transparent 55%), radial-gradient(ellipse 60% 35% at 50% 50%, rgba(124,58,237,0.04) 0%, transparent 70%), linear-gradient(165deg, #F5F2FB 0%, #EDE7F8 55%, #F5F2FB 100%)",
    starColor: "#7C3AED",
    headerBg: "rgba(255,255,255,0.82)",
    overlayBg: "rgba(42,27,77,0.35)",
    inputBg: "rgba(124,58,237,0.04)",
    shadowCard: "0 2px 14px rgba(124,58,237,0.10)",
    shadowPanel: "0 30px 80px rgba(124,58,237,0.18), 0 0 60px rgba(124,58,237,0.08)",
  },
};

const ThemeContext = createContext(THEMES.dark);

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    try {
      return localStorage.getItem("daftar_theme") || "dark";
    } catch (e) {
      return "dark";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("daftar_theme", mode);
    } catch (e) {
      /* ignore */
    }
  }, [mode]);

  const theme = THEMES[mode] || THEMES.dark;
  const toggleTheme = () => setMode((m) => (m === "dark" ? "light" : "dark"));

  return <ThemeContext.Provider value={{ theme, mode, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
