import { kv } from '@vercel/kv';
import { KNOWLEDGE_BASE } from '../../../lib/knowledge.js';

export async function POST(req) {
  try {
    const { messages } = await req.json();

    // Load admin-added docs from KV
    let adminDocs = [];
    try {
      adminDocs = (await kv.get('hr_knowledge')) || [];
    } catch (e) {}

    // Combine embedded knowledge + admin docs
    const allKnowledge = [...KNOWLEDGE_BASE, ...adminDocs];
    const knowledgeText = allKnowledge.map(k => `[${k.company} — ${k.title}]\n${k.content}`).join('\n\n---\n\n');

    const systemPrompt = `أنت مساعد HR ذكي داخلي لمجموعة You Ventures بقيادة المدير التنفيذي يوسف عطا الله.
مهمتك مساعدة الموظفين في الإجابة عن أسئلتهم المتعلقة بالعمل، السياسات، الإجراءات، والمهام اليومية.

الشركات التابعة للمجموعة:
- Nouvelage Aesthetic Clinics — عيادات تجميل (11 فرع، 45+ دكتور، 26 ممرضة)
- ZAT Aesthetic Clinics — عيادات تجميل
- MWG Advertising Agency — وكالة إعلانية (القاهرة، دبي، USA)
- YOU Real Estate Consultant — استشارات عقارية

قواعد الرد:
- تكلم بالعربية دائماً
- كن واضحاً ومباشراً ومهنياً
- إذا كان السؤال عن إجراء معين، اشرحه خطوة بخطوة
- استخدم المعلومات في قاعدة المعرفة أدناه للإجابة
- إذا لم تجد المعلومة، قل ذلك بوضوح واقترح التواصل مع HR أو المسؤول المباشر
- لا تخترع معلومات غير موجودة

=== قاعدة المعرفة الداخلية ===
${knowledgeText}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: systemPrompt,
        messages,
      }),
    });

    const data = await response.json();
    const reply = data.content?.[0]?.text || 'عذراً، حدث خطأ. حاول مرة أخرى.';
    return Response.json({ reply });
  } catch (err) {
    return Response.json({ reply: 'عذراً، حدث خطأ في الاتصال.' }, { status: 500 });
  }
}
