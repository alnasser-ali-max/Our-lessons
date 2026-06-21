// خدمة Firebase — نفس المشروع والبيانات الحالية (our-life-e3119)
// تستخدم Firebase compat SDK المُحمَّل عبر سكربت في index.html
// لضمان أعلى استقرار على Safari/iPhone (نفس الحل المعتمد في مشاريع ناصر السابقة)

const firebaseConfig = {
  apiKey: "AIzaSyDO3Frq2GtDLoAqz5qVVyRFVTloaLouorE",
  authDomain: "our-life-e3119.firebaseapp.com",
  projectId: "our-life-e3119",
  storageBucket: "our-life-e3119.firebasestorage.app",
  messagingSenderId: "125349964984",
  appId: "1:125349964984:web:7950290bed507b7a51984d",
  measurementId: "G-WQ2W1E9RGN",
};

let app = null;
let db = null;

function ensureInit() {
  if (db) return db;
  if (!window.firebase) {
    throw new Error("Firebase SDK لم يتم تحميله بعد");
  }
  app = window.firebase.apps?.length ? window.firebase.app() : window.firebase.initializeApp(firebaseConfig);
  window.firebase.firestore().settings({ experimentalForceLongPolling: true, merge: true });
  db = window.firebase.firestore();
  return db;
}

const lessonsCol = () => ensureInit().collection("lessons");
const commentsCol = () => ensureInit().collection("comments");
const reviewsCol = () => ensureInit().collection("reviews");

export async function fbSave(data) {
  try {
    await lessonsCol().add(data);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function fbDelete(id) {
  try {
    await ensureInit().collection("lessons").doc(id).delete();
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export function fbListen(callback) {
  return lessonsCol().onSnapshot(
    (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      data.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      callback(data);
    },
    (err) => {
      console.error("lessons error:", err);
      callback([]);
    }
  );
}

export async function fbSaveComment(data) {
  try {
    await commentsCol().add(data);
    const lessonRef = ensureInit().collection("lessons").doc(data.lessonId);
    const snap = await lessonRef.get();
    if (snap.exists) {
      await lessonRef.update({ commentCount: (snap.data().commentCount || 0) + 1 });
    }
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function fbDeleteComment(id, lessonId) {
  try {
    await ensureInit().collection("comments").doc(id).delete();
    if (lessonId) {
      const lessonRef = ensureInit().collection("lessons").doc(lessonId);
      const snap = await lessonRef.get();
      if (snap.exists) {
        await lessonRef.update({ commentCount: Math.max(0, (snap.data().commentCount || 0) - 1) });
      }
    }
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export function fbListenComments(lessonId, callback) {
  return commentsCol().onSnapshot(
    async (snapshot) => {
      const all = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      const filtered = all.filter((c) => c.lessonId === lessonId);
      filtered.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
      try {
        const lessonRef = ensureInit().collection("lessons").doc(lessonId);
        const snap = await lessonRef.get();
        if (snap.exists && snap.data().commentCount !== filtered.length) {
          await lessonRef.update({ commentCount: filtered.length });
        }
      } catch (e) {}
      callback(filtered);
    },
    (err) => {
      console.error("Comments error:", err);
      callback([]);
    }
  );
}

export async function fbSaveReview(data) {
  try {
    await reviewsCol().add(data);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export function fbListenReviews(callback) {
  return reviewsCol().onSnapshot(
    (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      data.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      callback(data);
    },
    (err) => {
      console.error("reviews error:", err);
      callback([]);
    }
  );
}
