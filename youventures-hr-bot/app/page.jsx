'use client';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  return (
    <div style={s.page}>
      <div style={s.container}>
        <div style={s.logoBlock}>
          <div style={s.logoText}>YOU</div>
          <div style={s.logoSub}>VENTURES</div>
          <div style={s.logoLine} />
        </div>
        <h1 style={s.title}>مساعد HR الذكي</h1>
        <p style={s.desc}>اسأل عن أي إجراء، سياسة، أو مهمة في شركتك</p>
        <button style={s.mainBtn} onClick={() => router.push('/chat')}>
          💬 ابدأ المحادثة
        </button>
        <button style={s.secBtn} onClick={() => router.push('/admin')}>
          🔐 لوحة الإدارة
        </button>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' },
  container: { textAlign:'center', padding:'40px 32px', maxWidth:380, width:'100%' },
  logoBlock: { marginBottom:32 },
  logoText: { fontSize:56, fontWeight:900, color:'#F5C100', letterSpacing:8, lineHeight:1 },
  logoSub: { fontSize:13, color:'#666', letterSpacing:6, marginTop:4 },
  logoLine: { width:60, height:2, background:'#F5C100', margin:'16px auto 0' },
  title: { fontSize:26, fontWeight:700, color:'#FFF', margin:'0 0 12px' },
  desc: { fontSize:15, color:'#888', marginBottom:40, lineHeight:1.6 },
  mainBtn: { display:'flex', alignItems:'center', justifyContent:'center', gap:10, width:'100%', padding:'16px 24px', background:'#F5C100', color:'#000', border:'none', borderRadius:12, fontSize:16, fontWeight:700, cursor:'pointer', marginBottom:12 },
  secBtn: { display:'flex', alignItems:'center', justifyContent:'center', gap:10, width:'100%', padding:'16px 24px', background:'transparent', color:'#888', border:'1px solid #333', borderRadius:12, fontSize:15, fontWeight:600, cursor:'pointer' },
};
