# دفترنا — دروس الحياة

تطبيق React مرتبط بـ Firebase (مشروع: our-life-e3119)

## النشر على Vercel

1. ارفع هذا المجلد على مستودع GitHub (يمكنك استخدام GitHub Desktop أو رفعه مباشرة عبر واجهة GitHub)
2. اذهب إلى [vercel.com](https://vercel.com) → New Project → اختر المستودع
3. Vercel يتعرف تلقائياً على إعدادات React:
   - Build Command: `npm run build`
   - Output Directory: `build`
4. اضغط Deploy

## ⚠️ مهم: قواعد أمان Firestore

بياناتك الآن متصلة بقاعدة بيانات حقيقية. تأكد من ضبط قواعد الأمان في:
Firebase Console → Firestore Database → Rules

مثال لقاعدة بسيطة (تتطلب مصادقة لاحقاً، أو يمكن تركها مفتوحة بينك وبين أسماء فقط مؤقتاً):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // مؤقت فقط - افتح للجميع
    }
  }
}
```

**ملاحظة:** القاعدة أعلاه تسمح لأي شخص بالقراءة والكتابة في قاعدة بياناتك إذا عرف الرابط. بما أن تسجيل الدخول في التطبيق (nasser/asmaa) هو تحقق على مستوى الواجهة فقط (وليس Firebase Authentication حقيقي)، ننصح بأحد الحلول التالية مستقبلاً:
- تفعيل Firebase Authentication الحقيقي
- أو تقييد القراءة/الكتابة بمفاتيح أو IP معروفة إذا كان ذلك ممكناً

## هيكل المشروع

```
src/App.jsx              — المكوّن الرئيسي
src/firebase.js          — الاتصال بـ Firestore (مشروع our-life-e3119)
src/data.js              — التصنيفات، الاقتباسات، بيانات المستخدمين
src/components/
  AuthScreen.jsx          — شاشة الدخول
  Header.jsx              — الترويسة والإحصائيات
  CategoryFilter.jsx       — شريط التصنيفات
  LessonCard.jsx           — بطاقة الدرس
  NewLessonForm.jsx        — نموذج إضافة درس جديد
  LessonModal.jsx          — تفاصيل الدرس + التعليقات + بطاقة المشاركة
  MonthlyReview.jsx        — مراجعة الشهر
```

## بيانات تسجيل الدخول

- اسم المستخدم: `nasser` أو `asmaa`
- كلمة المرور: `1234` (مُعرَّفة في `src/data.js` تحت `USERS`)

لتغيير كلمات المرور، حرّر القيم في `src/data.js`.
