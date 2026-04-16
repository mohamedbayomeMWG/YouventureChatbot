'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  async function send() {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', content: input.trim() };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMsgs }),
      });
      const data = await res.json();
      setMessages([...newMsgs, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages([...newMsgs, { role: 'assistant', content: 'عذراً، حدث خطأ. حاول مرة أخرى.' }]);
    }
    setLoading(false);
  }

  const suggestions = ['إزاي أقدم طلب إجازة؟', 'ما هي سياسة الحضور والانصراف؟', 'إيه هي الـ KPIs بتاعتي؟', 'إزاي أتعامل مع شكوى عميل؟'];

  return (
    <div style={s.page}>
      <div style={s.wrapper}>
        {/* Header */}
        <div style={s.header}>
          <button style={s.back} onClick={() => router.push('/')}>→</button>
          <div style={s.headerCenter}>
            <div style={s.avatar}>YOU</div>
            <div>
              <div style={s.headerTitle}>مساعد HR الذكي</div>
              <div style={s.headerSub}>You Ventures Group</div>
            </div>
          </div>
          <div style={s.online} />
        </div>

        {/* Messages */}
        <div style={s.msgs}>
          {messages.length === 0 && (
            <div style={s.welcome}>
              <div style={s.wIcon}>👋</div>
              <div style={s.wTitle}>أهلاً بيك في مساعد HR</div>
              <div style={s.wText}>اسأل عن أي حاجة متعلقة بشغلك</div>
              <div style={s.suggs}>
                {suggestions.map(s2 => (
                  <button key={s2} style={s.suggBtn} onClick={() => setInput(s2)}>{s2}</button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} style={{ display:'flex', justifyContent: m.role==='user' ? 'flex-start' : 'flex-end', marginBottom:12, animation:'fadeIn 0.3s ease' }}>
              {m.role === 'assistant' && <div style={s.botAvatar}>HR</div>}
              <div style={m.role === 'user' ? s.userBubble : s.botBubble}>{m.content}</div>
              {m.role === 'user' && <div style={s.userAvatar}>أنت</div>}
            </div>
          ))}
          {loading && (
            <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:12 }}>
              <div style={s.botAvatar}>HR</div>
              <div style={{ ...s.botBubble, display:'flex', gap:4, alignItems:'center' }}>
                <span style={s.dot} /><span style={{ ...s.dot, animationDelay:'0.2s' }} /><span style={{ ...s.dot, animationDelay:'0.4s' }} />
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <div style={s.inputArea}>
          <button style={s.sendBtn} onClick={send} disabled={loading || !input.trim()}>↑</button>
          <input
            style={s.input}
            placeholder="اكتب سؤالك هنا..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            dir="rtl"
          />
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0A0A0A' },
  wrapper: { width:'100%', maxWidth:480, height:'100vh', display:'flex', flexDirection:'column', background:'#111' },
  header: { padding:'16px 20px', background:'#0A0A0A', borderBottom:'1px solid #222', display:'flex', alignItems:'center', gap:12 },
  back: { background:'none', border:'none', color:'#F5C100', fontSize:20, cursor:'pointer', padding:'4px 8px' },
  headerCenter: { flex:1, display:'flex', alignItems:'center', gap:12 },
  avatar: { width:40, height:40, background:'#F5C100', color:'#000', fontWeight:900, fontSize:13, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:10 },
  headerTitle: { color:'#FFF', fontWeight:700, fontSize:15 },
  headerSub: { color:'#666', fontSize:11, marginTop:2 },
  online: { width:8, height:8, borderRadius:'50%', background:'#4CAF50' },
  msgs: { flex:1, overflowY:'auto', padding:'20px 16px', display:'flex', flexDirection:'column' },
  welcome: { textAlign:'center', padding:'40px 20px' },
  wIcon: { fontSize:40, marginBottom:16 },
  wTitle: { color:'#FFF', fontSize:20, fontWeight:700, marginBottom:8 },
  wText: { color:'#666', fontSize:14, marginBottom:24 },
  suggs: { display:'flex', flexDirection:'column', gap:8 },
  suggBtn: { padding:'12px 16px', background:'#1A1A1A', border:'1px solid #2A2A2A', borderRadius:10, color:'#CCC', fontSize:13, cursor:'pointer', textAlign:'right', direction:'rtl' },
  userBubble: { maxWidth:'75%', padding:'12px 16px', background:'#1A1A1A', border:'1px solid #2A2A2A', borderRadius:'16px 16px 16px 4px', color:'#EEE', fontSize:14, lineHeight:1.6, direction:'rtl', textAlign:'right' },
  botBubble: { maxWidth:'75%', padding:'12px 16px', background:'#F5C100', borderRadius:'16px 16px 4px 16px', color:'#000', fontSize:14, lineHeight:1.7, direction:'rtl', textAlign:'right' },
  botAvatar: { width:32, height:32, borderRadius:8, background:'#F5C100', color:'#000', fontSize:9, fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center', marginLeft:8, flexShrink:0 },
  userAvatar: { width:32, height:32, borderRadius:8, background:'#2A2A2A', color:'#888', fontSize:10, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', marginRight:8, flexShrink:0 },
  dot: { display:'inline-block', width:6, height:6, borderRadius:'50%', background:'#000', animation:'bounce 1.2s infinite' },
  inputArea: { padding:'12px 16px', background:'#0A0A0A', borderTop:'1px solid #1A1A1A', display:'flex', gap:8, alignItems:'center' },
  input: { flex:1, padding:'14px 16px', background:'#1A1A1A', border:'1px solid #2A2A2A', borderRadius:12, color:'#FFF', fontSize:14, outline:'none', direction:'rtl' },
  sendBtn: { width:44, height:44, borderRadius:12, background:'#F5C100', color:'#000', border:'none', fontSize:20, fontWeight:900, cursor:'pointer', flexShrink:0 },
};
