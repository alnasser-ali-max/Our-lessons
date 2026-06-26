export const USERS = { nasser: "1234", asmaa: "1234" };

export const CATS = {
  work: { label: "العمل", emoji: "💼", color: "#818CF8" },
  family: { label: "الأسرة", emoji: "👨‍👩‍👧", color: "#F0ABFC" },
  social: { label: "اجتماعي", emoji: "🤝", color: "#FB923C" },
  health: { label: "الصحة", emoji: "🌿", color: "#34D399" },
  finance: { label: "المال", emoji: "💰", color: "#38BDF8" },
  religion: { label: "الدين", emoji: "🕌", color: "#A78BFA" },
  self: { label: "تطوير", emoji: "🧠", color: "#E879F9" },
  wisdom: { label: "حكمة", emoji: "✨", color: "#D4AF7A" },
};

export const QUOTES = [
  "من تعلّم من تجارب الآخرين وفّر على نفسه كثيراً من الخسائر",
  "الحكمة لا تُورث، تُكتسب بالتجربة والتأمل",
  "أعظم درس تتعلمه هو أنك لا تعرف كل شيء",
  "كل يوم تمر دون أن تتعلم شيئاً هو يوم ضائع",
  "الفشل ليس السقوط، بل رفضك أن تقوم من جديد",
  "لا تكن خبيراً في كل شيء، كن فضولياً في كل شيء",
  "الصبر يُعلّمنا أن الوقت هو الدواء لأكثر من جرح",
];

export const SHARE_GRADIENTS = [
  "linear-gradient(135deg,#2E1065 0%,#7C3AED 55%,#F0ABFC 100%)",
  "linear-gradient(135deg,#0F0A24 0%,#4338CA 55%,#A78BFA 100%)",
  "linear-gradient(135deg,#1E1B4B 0%,#6D28D9 55%,#D4AF7A 100%)",
  "linear-gradient(135deg,#3B0764 0%,#A21CAF 55%,#F0ABFC 100%)",
  "linear-gradient(135deg,#172554 0%,#1D4ED8 55%,#818CF8 100%)",
  "linear-gradient(135deg,#052E26 0%,#0D9488 55%,#67E8F9 100%)",
];

export function escHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function arDate(d = new Date()) {
  return d.toLocaleDateString("ar-EG", { day: "numeric", month: "long", year: "numeric" });
}

export function arTime(d = new Date()) {
  return d.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" });
}
