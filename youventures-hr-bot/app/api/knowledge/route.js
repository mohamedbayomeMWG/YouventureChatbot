import { kv } from '@vercel/kv';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'YouVentures2025';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const password = searchParams.get('password');
  if (password !== ADMIN_PASSWORD) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const docs = (await kv.get('hr_knowledge')) || [];
  return Response.json({ docs });
}

export async function POST(req) {
  const body = await req.json();
  const { action, password } = body;
  if (password !== ADMIN_PASSWORD) return Response.json({ ok: false, error: 'Unauthorized' }, { status: 401 });

  if (action === 'auth') return Response.json({ ok: true });

  if (action === 'add') {
    const docs = (await kv.get('hr_knowledge')) || [];
    docs.push(body.doc);
    await kv.set('hr_knowledge', docs);
    return Response.json({ ok: true });
  }

  if (action === 'delete') {
    const docs = ((await kv.get('hr_knowledge')) || []).filter(d => d.id !== body.id);
    await kv.set('hr_knowledge', docs);
    return Response.json({ ok: true });
  }

  return Response.json({ ok: false });
}
