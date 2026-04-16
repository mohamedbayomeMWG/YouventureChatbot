# You Ventures — HR Assistant Bot
## دليل التشغيل للديفلوبر

---

## المتطلبات
- Node.js 18+
- حساب على Vercel (مجاني)
- Anthropic API Key

---

## خطوات الـ Deploy (30 دقيقة بس)

### الخطوة 1 — رفع الكود على GitHub
1. افتح github.com واعمل repo جديد اسمه `youventures-hr-bot`
2. ارفع كل ملفات المشروع عليه

### الخطوة 2 — اعمل حساب على Vercel
1. روح vercel.com واعمل حساب مجاني
2. اضغط **"Add New Project"**
3. اختار الـ repo اللي رفعته على GitHub
4. اضغط **Deploy** — هيشتغل لوحده

### الخطوة 3 — أضف Vercel KV (لتخزين الملفات)
1. في Vercel Dashboard، روح **Storage**
2. اضغط **Create Database** → اختار **KV**
3. اسمه `hr-knowledge` واضغط Create
4. اضغط **Connect to Project** — هيضيف الـ environment variables أوتوماتيك

### الخطوة 4 — أضف الـ Environment Variables
في Vercel Dashboard → Settings → Environment Variables، أضف:

| Variable | Value |
|----------|-------|
| `ANTHROPIC_API_KEY` | `sk-ant-...` (من console.anthropic.com) |
| `ADMIN_PASSWORD` | كلمة مرور من اختيارك |

### الخطوة 5 — Redeploy
1. في Vercel Dashboard اضغط **Redeploy**
2. خلاص! الموقع شغال 🎉

---

## الروابط بعد الـ Deploy
- **الشات للموظفين:** `https://your-project.vercel.app/chat`
- **لوحة الإدارة:** `https://your-project.vercel.app/admin`

---

## إضافة Domain مخصوص (اختياري)
في Vercel → Settings → Domains، أضف الـ domain بتاعك.
مثال: `hr.youventures.com`

---

## الـ Tech Stack
- **Frontend:** Next.js 14 (React)
- **AI:** Anthropic Claude API
- **Storage:** Vercel KV (Redis)
- **Hosting:** Vercel (Free tier)

---

## للمساعدة
أي مشكلة في الـ deploy، راجع: vercel.com/docs
