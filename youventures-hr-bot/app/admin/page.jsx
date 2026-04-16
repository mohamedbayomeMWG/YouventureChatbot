'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const COMPANIES = ['You Ventures','Nouvelage Aesthetic Clinics','ZAT Aesthetic Clinics','MWG Advertising Agency','YOU Real Estate Consultant'];

export default function AdminPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState('');
  const [passError, setPassError] = useState('');
  const [docs, setDocs] = useState([]);
  const [newDoc, setNewDoc] = useState({ company: COMPANIES[0], title: '', content: '' });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  async function login() {
    const res = await fetch('/api/knowledge', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'auth', password: pass }) });
    const data = await res.json();
    if (data.ok) { setAuthed(true); loadDocs(); }
    else setPassError('كلمة المرور غلط، حاول تاني');
  }

  async function loadDocs() {
    const res = await fetch('/api/knowledge?action=list&password=' + pass);
    const data = await res.json();
    if (data.docs) setDocs(data.docs);
  }

  async function addDoc() {
    if (!newDoc.title || !newDoc.content) return;
    setSaving(true);
    await fetch('/api/knowledge', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'add', password: pass, doc: { ...newDoc, id: Date.now() } }) });
    setNewDoc({ company: COMPANIES[0], title: '', content: '' });
    setSaving(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
    loadDocs();
  }

  async function deleteDoc(id) {
    await fetch('/api/knowledge', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'delete', password: pass, id }) });
    loadDocs();
  }

  if (!authed) return (
    <div style={s.page}>
      <div style={s.loginBox}>
        <button style={s.backBtn} onClick={() => router.push('/')}>← رجوع</button>
        <div style={s.logoText}>YOU</div>
        <div style={s.logoSub}>ADMIN PANEL</div>
        <div style={s.logoLine} />
        <p style={s.label}>كلمة المرور</p>
        <input style={s.loginInput} type="password" placeholder="أدخل كلمة المرور" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} dir="ltr" />
        {passError && <p style={s.error}>{passError}</p>}
        <button style={s.mainBtn} onClick={login}>دخول</button>
      </div>
    </div>
  );

  return (
    <div style={s.page}>
      <div style={s.adminWrap}>
        <div style={s.adminHeader}>
          <button style={s.backBtnLight} onClick={() => router.push('/')}>← خروج</button>
          <div style={s.adminTitle}><span style={s.gold}>YOU</span> لوحة إدارة المعرفة</div>
          <div style={s.badge}>{docs.length} مستند</div>
        </div>

        <div style={s.addSection}>
          <h3 style={s.sectionTitle}>➕ إضافة مستند جديد</h3>
          <select style={s.select} value={newDoc.company} onChange={e => setNewDoc({ ...newDoc, company: e.target.value })}>
            {COMPANIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <input style={s.adminInput} placeholder="عنوان المستند (مثال: SOP استقبال المرضى)" value={newDoc.title} onChange={e => setNewDoc({ ...newDoc, title: e.target.value })} dir="rtl" />
          <textarea style={s.adminTA} placeholder="محتوى المستند — الـ SOP، السياسات، الإجراءات..." value={newDoc.content} onChange={e => setNewDoc({ ...newDoc, content: e.target.value })} dir="rtl" />
          <button style={{ ...s.mainBtn, opacity: (!newDoc.title || !newDoc.content) ? 0.5 : 1 }} onClick={addDoc} disabled={!newDoc.title || !newDoc.content || saving}>
            {success ? '✅ تم الحفظ!' : saving ? 'جاري الحفظ...' : 'حفظ المستند'}
          </button>
        </div>

        <div style={s.docsList}>
          <h3 style={s.sectionTitle}>📁 المستندات المحفوظة ({docs.length})</h3>
          {docs.length === 0 && <div style={s.empty}>لا يوجد مستندات — ابدأ بإضافة الـ SOPs والسياسات</div>}
          {docs.map(doc => (
            <div key={doc.id} style={s.docCard}>
              <div style={s.docCardTop}>
                <div>
                  <div style={s.docTitle}>{doc.title}</div>
                  <div style={s.docCo}>{doc.company}</div>
                </div>
                <button style={s.delBtn} onClick={() => deleteDoc(doc.id)}>🗑</button>
              </div>
              <div style={s.docPreview}>{doc.content.substring(0, 120)}...</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0A0A0A' },
  loginBox: { width:'100%', maxWidth:360, padding:'40px 32px', background:'#111', borderRadius:20, border:'1px solid #222', textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', gap:16 },
  backBtn: { alignSelf:'flex-start', background:'none', border:'none', color:'#666', cursor:'pointer', fontSize:13 },
  logoText: { fontSize:48, fontWeight:900, color:'#F5C100', letterSpacing:8 },
  logoSub: { fontSize:11, color:'#666', letterSpacing:4 },
  logoLine: { width:50, height:2, background:'#F5C100', margin:'8px auto 0' },
  label: { color:'#888', fontSize:13, margin:0, alignSelf:'flex-start' },
  loginInput: { width:'100%', padding:'14px 16px', background:'#1A1A1A', border:'1px solid #2A2A2A', borderRadius:10, color:'#FFF', fontSize:15, outline:'none', boxSizing:'border-box' },
  error: { color:'#E53935', fontSize:13, margin:0 },
  mainBtn: { display:'flex', alignItems:'center', justifyContent:'center', gap:10, width:'100%', padding:'16px 24px', background:'#F5C100', color:'#000', border:'none', borderRadius:12, fontSize:16, fontWeight:700, cursor:'pointer' },
  adminWrap: { width:'100%', maxWidth:600, minHeight:'100vh', background:'#111' },
  adminHeader: { padding:'20px 24px', background:'#0A0A0A', borderBottom:'1px solid #1A1A1A', display:'flex', alignItems:'center', justifyContent:'space-between' },
  backBtnLight: { background:'none', border:'none', color:'#666', cursor:'pointer', fontSize:13 },
  adminTitle: { color:'#FFF', fontWeight:700, fontSize:16 },
  gold: { color:'#F5C100', fontWeight:900 },
  badge: { background:'#F5C100', color:'#000', padding:'4px 10px', borderRadius:20, fontSize:12, fontWeight:700 },
  addSection: { padding:'24px', borderBottom:'1px solid #1A1A1A', display:'flex', flexDirection:'column', gap:12 },
  sectionTitle: { color:'#FFF', fontSize:15, fontWeight:700, margin:0 },
  select: { padding:'12px 14px', background:'#1A1A1A', border:'1px solid #2A2A2A', borderRadius:10, color:'#FFF', fontSize:14, outline:'none', direction:'rtl' },
  adminInput: { padding:'12px 14px', background:'#1A1A1A', border:'1px solid #2A2A2A', borderRadius:10, color:'#FFF', fontSize:14, outline:'none', direction:'rtl' },
  adminTA: { padding:'12px 14px', background:'#1A1A1A', border:'1px solid #2A2A2A', borderRadius:10, color:'#FFF', fontSize:13, outline:'none', direction:'rtl', minHeight:140, resize:'vertical', lineHeight:1.6 },
  docsList: { padding:'24px', display:'flex', flexDirection:'column', gap:12 },
  empty: { color:'#444', fontSize:13, textAlign:'center', padding:'32px 0', lineHeight:1.8 },
  docCard: { background:'#1A1A1A', border:'1px solid #2A2A2A', borderRadius:12, padding:'16px' },
  docCardTop: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 },
  docTitle: { color:'#FFF', fontWeight:700, fontSize:14 },
  docCo: { color:'#F5C100', fontSize:11, marginTop:4 },
  docPreview: { color:'#555', fontSize:12, lineHeight:1.6, direction:'rtl' },
  delBtn: { background:'none', border:'none', cursor:'pointer', fontSize:16, padding:4 },
};
