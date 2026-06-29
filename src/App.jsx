import { useState, useEffect, useMemo, useCallback } from "react";
import AuthScreen from "./components/AuthScreen";
import Header from "./components/Header";
import CategoryFilter from "./components/CategoryFilter";
import LessonCard from "./components/LessonCard";
import NewLessonForm from "./components/NewLessonForm";
import LessonModal from "./components/LessonModal";
import MonthlyReview from "./components/MonthlyReview";
import ExportPdfPanel from "./components/ExportPdfPanel";
import { fbSave, fbDelete, fbListen } from "./firebase";
import { normalizeCategory } from "./data";

const STAR_COUNT = 60;
function genStars() {
  return Array.from({ length: STAR_COUNT }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    delay: Math.random() * 6,
    duration: Math.random() * 4 + 3,
  }));
}
const STARS = genStars();

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try { return localStorage.getItem("daftar_user") || null; } catch (e) { return null; }
  });
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showReview, setShowReview] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [fbError, setFbError] = useState(false);
  const [fbErrorMsg, setFbErrorMsg] = useState("");

  useEffect(() => {
    if (!currentUser) return;
    setLoading(true);
    setFbError(false);
    let unsub;
    try {
      unsub = fbListen(
        (data) => {
          const normalized = data.map((l) => {
            const rawCat = l.category ?? l.cat; // التطبيق القديم كان يخزّن التصنيف باسم "cat"
            return { ...l, _rawCategory: rawCat, category: normalizeCategory(rawCat) };
          });
          setLessons(normalized);
          setLoading(false);
        },
        (err) => {
          setFbError(true);
          setFbErrorMsg(err?.message || String(err));
          setLoading(false);
        }
      );
    } catch (e) {
      setFbError(true);
      setFbErrorMsg(e?.message || String(e));
      setLoading(false);
    }
    return () => unsub && unsub();
  }, [currentUser]);

  function handleLogin(user) {
    setCurrentUser(user);
    try { localStorage.setItem("daftar_user", user); } catch (e) { /* ignore */ }
  }

  function handleLogout() {
    setCurrentUser(null);
    try { localStorage.removeItem("daftar_user"); } catch (e) { /* ignore */ }
  }

  const handleSaveLesson = useCallback(async ({ text, category, mood }) => {
    await fbSave({ text, category, mood, author: currentUser, timestamp: Date.now(), commentCount: 0 });
    setShowForm(false);
  }, [currentUser]);

  async function confirmDelete() {
    if (!deleteTarget) return;
    await fbDelete(deleteTarget.id);
    setDeleteTarget(null);
  }

  const filteredLessons = useMemo(() => {
    let list = lessons;
    if (filter !== "all") list = list.filter((l) => l.category === filter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((l) => l.text.toLowerCase().includes(q));
    }
    return list;
  }, [lessons, filter, search]);

  const counts = useMemo(() => {
    const c = { all: lessons.length };
    lessons.forEach((l) => { c[l.category] = (c[l.category] || 0) + 1; });
    return c;
  }, [lessons]);

  const stats = useMemo(() => {
    const now = new Date();
    const thisMonth = lessons.filter((l) => {
      if (!l.timestamp) return false;
      const d = new Date(l.timestamp);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
    const comments = lessons.reduce((sum, l) => sum + (l.commentCount || 0), 0);
    return { total: lessons.length, thisMonth, comments };
  }, [lessons]);

  if (!currentUser) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      <div className="app-bg" />
      <div className="star-field">
        {STARS.map((s) => (
          <div
            key={s.id}
            className="star"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.size,
              animationDuration: `${s.duration}s`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>

      <Header
        currentUser={currentUser}
        onLogout={handleLogout}
        stats={stats}
        onOpenReview={() => setShowReview(true)}
        onOpenExport={() => setShowExport(true)}
      />

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "4px 0 100px" }}>
        <CategoryFilter active={filter} onChange={setFilter} counts={counts} />

        <div style={{ padding: "0 18px 12px" }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 ابحث في دروسك..."
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(167,139,250,0.12)",
              borderRadius: 16,
              padding: "12px 16px",
              fontSize: 13.5,
              color: "var(--text)",
              outline: "none",
              textAlign: "right",
              fontFamily: "inherit",
            }}
          />
        </div>

        <div style={{ padding: "8px 18px" }}>
          {fbError && (
            <div style={{ textAlign: "center", padding: 30, color: "var(--red)", fontSize: 13 }}>
              <div style={{ marginBottom: 8 }}>تعذّر الاتصال بقاعدة البيانات.</div>
              {fbErrorMsg && (
                <div style={{ fontSize: 11, color: "var(--text-muted)", direction: "ltr", wordBreak: "break-word" }}>
                  {fbErrorMsg}
                </div>
              )}
            </div>
          )}

          {!fbError && loading && (
            <div style={{ textAlign: "center", padding: 50 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  border: "3px solid rgba(167,139,250,0.2)",
                  borderTopColor: "var(--violet-light)",
                  borderRadius: "50%",
                  margin: "0 auto",
                  animation: "spin 0.8s linear infinite",
                }}
              />
            </div>
          )}

          {!fbError && !loading && filteredLessons.length === 0 && (
            <div style={{ textAlign: "center", padding: "50px 20px", color: "var(--text-muted)" }}>
              <div style={{ fontSize: 34, marginBottom: 10 }}>📖</div>
              <p style={{ fontSize: 14 }}>
                {search || filter !== "all" ? "لا توجد دروس مطابقة" : "لم تُسجَّل دروس بعد — ابدأ بإضافة أول درس"}
              </p>
            </div>
          )}

          {!fbError && !loading && filteredLessons.map((lesson, i) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              index={i}
              currentUser={currentUser}
              onOpen={setSelectedLesson}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      </div>

      <button
        onClick={() => setShowForm(true)}
        style={{
          position: "fixed",
          insetInlineEnd: 22,
          bottom: 26,
          width: 60,
          height: 60,
          borderRadius: "50%",
          border: "none",
          background: "linear-gradient(150deg, #6D28D9 0%, #A78BFA 60%, #F0ABFC 130%)",
          color: "#1B0E33",
          fontSize: 26,
          cursor: "pointer",
          boxShadow: "0 12px 32px rgba(124,58,237,0.5), 0 0 0 1px rgba(255,255,255,0.1) inset",
          zIndex: 30,
          transition: "transform 0.25s var(--spring)",
          animation: "ringPulse 2.5s ease-in-out infinite",
        }}
        onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.88)"; }}
        onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
      >
        +
      </button>

      {showForm && <NewLessonForm onSave={handleSaveLesson} onClose={() => setShowForm(false)} />}

      {selectedLesson && (
        <LessonModal lesson={selectedLesson} currentUser={currentUser} onClose={() => setSelectedLesson(null)} />
      )}

      {showReview && <MonthlyReview lessons={lessons} currentUser={currentUser} onClose={() => setShowReview(false)} />}

      {showExport && <ExportPdfPanel lessons={lessons} onClose={() => setShowExport(false)} />}

      {deleteTarget && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 80,
            background: "rgba(5,3,12,0.7)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            animation: "fadeIn 0.2s ease both",
          }}
          onClick={() => setDeleteTarget(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 340,
              background: "linear-gradient(165deg, #1B1133, #120A24)",
              border: "1px solid rgba(251,113,133,0.25)",
              borderRadius: 22,
              padding: 26,
              textAlign: "center",
              animation: "popIn 0.35s var(--spring) both",
            }}
          >
            <div style={{ fontSize: 30, marginBottom: 10 }}>🗑</div>
            <p style={{ fontSize: 15, color: "var(--text)", marginBottom: 22 }}>هل تريد حذف هذا الدرس؟</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setDeleteTarget(null)}
                style={{ flex: 1, padding: 12, borderRadius: 14, border: "1px solid rgba(167,139,250,0.16)", background: "transparent", color: "var(--text-muted)", fontFamily: "inherit", cursor: "pointer" }}
              >
                إلغاء
              </button>
              <button
                onClick={confirmDelete}
                style={{ flex: 1, padding: 12, borderRadius: 14, border: "none", background: "var(--red)", color: "#fff", fontWeight: 700, fontFamily: "inherit", cursor: "pointer" }}
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
