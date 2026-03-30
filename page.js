"use client";
import { useState, useEffect, useRef } from "react";
import "./globals.css";

const AGENTS = [
  { id:"master",icon:"👁️",name:"Command & Monitor",label:"MASTER AGENT",desc:"Oversees all agents. Monitors website health, tracks visitor engagement, manages lead pipeline.",master:true,mk:"visitorsTracked",ml:"Visitors",mk2:"leadsCaptured",ml2:"Leads" },
  { id:"brand",icon:"📣",name:"Brand & PR Agent",label:"BRAND",desc:"Creates social media content, press releases, author bios, and brand messaging.",mk:"postsCreated",ml:"Posts created" },
  { id:"sales",icon:"🎯",name:"Sales & Marketing",label:"SALES",desc:"Identifies leads, qualifies prospects, creates outreach for schools, libraries, bookstores.",mk:"leadsFound",ml:"Leads found" },
  { id:"lead",icon:"📧",name:"Lead Capture Agent",label:"LEADS",desc:"Captures every inquiry and contact form submission. Responds within 60 seconds.",mk:"leadsCaptured",ml:"Captured" },
  { id:"social",icon:"📱",name:"Social Media Agent",label:"SOCIAL",desc:"Manages Instagram, LinkedIn, YouTube, and X/Twitter content strategy.",mk:"postsCreated",ml:"Drafts" },
  { id:"innovation",icon:"💡",name:"Innovation Agent",label:"INNOVATE",desc:"Suggests new partnerships, audiences, campaigns to expand reach.",mk:"ideasGenerated",ml:"Ideas" },
  { id:"chatbot",icon:"💬",name:"Visitor Chatbot",label:"CHAT",desc:"The green button in the corner. Answers visitor questions about books and the author — 24/7.",mk:"conversationsHandled",ml:"Conversations" },
];

const SUGGESTIONS = ["Tell me about the books","What emotions do you cover?","How can I contact the author?","Who is V Ramanan?"];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [msgs, setMsgs] = useState([{role:"bot",content:"Hi! 🌿 I'm V Ramanan's assistant. Ask me about his books, his journey, or emotional wellness for children."}]);
  const [ci, setCi] = useState("");
  const [cLoading, setCLoading] = useState(false);
  const [showSug, setShowSug] = useState(true);
  const [fd, setFd] = useState({name:"",email:"",message:""});
  const [fs, setFs] = useState(null);
  const ceRef = useRef(null);

  useEffect(() => { const f=()=>setScrolled(window.scrollY>60); window.addEventListener("scroll",f); return()=>window.removeEventListener("scroll",f); }, []);
  useEffect(() => { fetch("/api/metrics").then(r=>r.json()).then(setMetrics).catch(()=>{}); fetch("/api/track",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({page:"/"})}).catch(()=>{}); const i=setInterval(()=>{fetch("/api/metrics").then(r=>r.json()).then(setMetrics).catch(()=>{})},30000); return()=>clearInterval(i); }, []);
  useEffect(() => { ceRef.current?.scrollIntoView({behavior:"smooth"}); }, [msgs,cLoading]);

  const sc = id => document.getElementById(id)?.scrollIntoView({behavior:"smooth",block:"start"});
  const gm = k => metrics?.[k] ?? 0;

  async function sendC(t) {
    const m = t||ci.trim(); if(!m||cLoading) return; setCi(""); setShowSug(false);
    setMsgs(p=>[...p,{role:"user",content:m}]); setCLoading(true);
    try {
      const h = [...msgs,{role:"user",content:m}].slice(-8).map(x=>({role:x.role==="bot"?"assistant":x.role,content:x.content}));
      const r = await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:h,sessionId:"w"+Date.now()})});
      if(!r.ok) throw new Error(); const d = await r.json();
      setMsgs(p=>[...p,{role:"bot",content:d.reply}]);
    } catch { setMsgs(p=>[...p,{role:"bot",content:"Please try again or email Champvenk88@gmail.com directly."}]); }
    setCLoading(false);
  }

  async function submitForm(e) {
    e.preventDefault(); if(!fd.name||!fd.email||!fd.message) return; setFs("sending");
    try { const r=await fetch("/api/contact",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(fd)}); if(!r.ok) throw new Error(); setFs("success"); setFd({name:"",email:"",message:""}); fetch("/api/metrics").then(r=>r.json()).then(setMetrics).catch(()=>{}); } catch { setFs("error"); }
    setTimeout(()=>setFs(null),5000);
  }

  return (<>
    <nav className={`nav ${scrolled?"scrolled":""}`}><div className="nav-in">
      <a className="nav-name" onClick={()=>sc("hero")} style={{cursor:"pointer"}}>V Ramanan</a>
      <div className="nav-links">
        {[["hero","Home"],["story","My Story"],["books","Books"],["agents","AI Agents"],["mission","Mission"],["connect","Connect"]].map(([id,l])=>(
          <a key={id} onClick={()=>sc(id)} style={{cursor:"pointer"}}>{l}</a>
        ))}
      </div>
      <a className="nav-cta" onClick={()=>sc("connect")} style={{cursor:"pointer"}}>Get in Touch →</a>
    </div></nav>

    <section className="hero" id="hero"><div className="hero-in">
      <div className="hero-text">
        <div className="hero-label af">Children&apos;s Book Author</div>
        <h1 className="af d1">Where <strong>Nature</strong> Meets<br/>a Child&apos;s <em>Heart</em></h1>
        <div className="hero-sub af d2">Author of Nature Rituals</div>
        <p className="hero-desc af d3">I write books that turn nature into a child&apos;s first emotional teacher — helping families heal, connect, and grow together through seasonal rituals and powerful metaphors.</p>
        <div className="hero-btns af d4">
          <a className="btn-leaf" onClick={()=>sc("books")} style={{cursor:"pointer"}}>Explore My Books</a>
          <a className="btn-earth" onClick={()=>sc("story")} style={{cursor:"pointer"}}>Read My Story</a>
        </div>
      </div>
      <div className="hero-books af d3">
        {[{e:"🌿",t:"Nature Rituals",s:"Emotional Recipes for Children",b:"New",bg:"linear-gradient(135deg,#2D5016,#1a3a0e,#0f2008)"},
          {e:"📖",t:"Nature Rituals",s:"Igniting Emotional Recipes & Nature",b:"Published",bg:"linear-gradient(145deg,#1a3a0e,#2D5016,#3D6B22)",bc:"var(--green-deep)"}
        ].map((bk,i)=>(
          <a key={i} className="hero-book" onClick={()=>sc("books")} style={{cursor:"pointer"}}>
            <div className="book-cover"><div className="book-ph" style={{background:bk.bg}}>
              <div style={{fontSize:40,marginBottom:12}}>{bk.e}</div><h3>{bk.t}</h3><p>{bk.s}</p>
            </div><div className="book-badge" style={bk.bc?{background:bk.bc}:{}}>{bk.b}</div></div>
          </a>
        ))}
      </div>
    </div></section>

    <div className="quote-sec">
      <p className="quote-text">We do not walk through nature. We walk with it. And when we do, healing becomes inevitable.</p>
      <p className="quote-attr">— V Ramanan</p>
    </div>

    <section className="sec" id="story">
      <div className="sec-label">The Journey</div>
      <div className="sec-title">A Father&apos;s Promise Became<br/><strong>Two Published Books</strong></div>
      <div className="sec-sub">From Stan Wadlow Park in Toronto — this is how nature taught me to write for children.</div>
      <div className="story-grid">
        <div className="story-content">
          <p>It started with a walk. My son and I in Stan Wadlow Park, Toronto — the birdsong overhead, the wind threading through our favorite tree. He asked me a question I couldn&apos;t answer with words. So I wrote him a book instead.</p>
          <p>That walk became two published books — a groundbreaking approach that turns the natural world into a living classroom for emotional growth and the sacred connection between parent and child.</p>
          <div className="story-hl"><p>What if nature could teach your child every emotion you struggle to explain?</p></div>
          <p>My books introduce emotional recipes, seasonal nature activities, earth breathing techniques, and powerful metaphors that help families turn eco-anxiety and worry into curiosity, calm, and confidence.</p>
          <p>Now, with two published books ready for launch, I&apos;m bringing nature-based emotional wellness to families everywhere — because every child deserves a book that understands them.</p>
        </div>
        <div className="story-side">
          <div className="author-photo-wrap"><img src="/venkat.jpg" alt="V Ramanan" className="author-photo"/><div className="author-photo-name">V Ramanan</div><div className="author-photo-loc">Toronto, Canada</div></div>
          <div className="story-stats">
            {[[2,"Published Books"],[15,"Emotions Mapped"],[10,"Target Languages"]].map(([n,l])=>(<div key={l} className="story-stat"><div className="stat-num">{n}</div><div className="stat-label">{l}</div></div>))}
          </div>
          <div className="story-values"><h4>Core Values</h4><div className="vals">{["Honesty","Kindness","Love","Spirituality","Creativity","Courage"].map(v=>(<span key={v} className="val">{v}</span>))}</div></div>
        </div>
      </div>
    </section>

    <div className="sec-dark" id="books"><div className="sec-in">
      <div className="sec-label">Published Works</div>
      <div className="sec-title" style={{color:"var(--text-light)"}}>Two Books. One <strong style={{color:"var(--gold)"}}>Mission</strong>.</div>
      <div className="sec-sub">Both books are published — bringing nature-based emotional wellness to children and families worldwide.</div>
      <div className="books-show">
        {[{e:"🌿",t:"Nature Rituals",tg:"Emotional Recipes for Children",d:"The world's first cookbook organized by a child's emotional state. Nature-based rituals for courage, anxiety, grief, anger, and love.",m:[["Audience","Parents with children 4–13"],["Format","Picture Book + Activity Guide"],["Category","Emotional Wellness / SEL"],["Author","Ramanan V"]],em:["Courage","Anxiety","Anger","Grief","Kindness","Gratitude","Love","Resilience","Empathy"],bg:"linear-gradient(145deg,#2D5016,#1a3a0e,#0f2008)"},
          {e:"📖",t:"Nature Rituals",tg:"Igniting the Paths where Emotional Recipes meet Nature",d:"A groundbreaking approach that turns the natural world into a living classroom for emotional growth, resilience, and family connection.",m:[["Audience","Parents & Families"],["Format","6×9 Paperback"],["Publisher","American Publishers Inc."],["Author","Ramanan V"]],em:["Emotional Growth","Resilience","Connection","Calm","Confidence","Curiosity"],bg:"linear-gradient(145deg,#1a3a0e,#2D5016,#3D6B22)"}
        ].map((b,i)=>(
          <div key={i} className="book-feat">
            <div className="book-feat-cover"><div className="book-feat-cover-in" style={{background:b.bg}}><div style={{fontSize:56,marginBottom:16}}>{b.e}</div><h3>{b.t}</h3><p style={{marginTop:4,fontSize:14}}>{b.tg}</p><p style={{marginTop:16,fontSize:11,opacity:.6}}>by Ramanan V</p></div></div>
            <div>
              <div className="book-status">Ready for Launch</div>
              <div className="book-feat-title">{b.t}</div>
              <div className="book-feat-tag">{b.tg}</div>
              <p className="book-feat-desc">{b.d}</p>
              <div className="book-meta">{b.m.map(([l,v])=>(<div key={l} className="book-meta-item"><div className="meta-label">{l}</div><div className="meta-val">{v}</div></div>))}</div>
              <div className="book-emo">{b.em.map(e=>(<span key={e} className="emo">{e}</span>))}</div>
            </div>
          </div>
        ))}
      </div>
    </div></div>

    <div className="sec-dark" id="agents" style={{background:"linear-gradient(180deg,#0f1a08,var(--bg-deep))"}}>
      <div className="sec-in">
        <div className="sec-label">Powered by Intelligence</div>
        <div className="sec-title" style={{color:"var(--text-light)"}}>Meet My <strong style={{color:"var(--gold)"}}>AI Agents</strong></div>
        <div className="sec-sub">7 specialized agents working 24/7 — real metrics from live data.</div>
        <div className="agent-grid">
          {AGENTS.map(a=>(<div key={a.id} className={`agent-card${a.master?" master":""}`}>
            <div className="agent-card-top"><div className="agent-card-left"><div className="agent-card-icon" style={a.master?{background:"rgba(196,154,43,.15)",fontSize:24}:{}}>{a.icon}</div><div><div className="agent-card-id">{a.label}</div><div className="agent-card-name">{a.name}</div></div></div><div className="agent-dot"/></div>
            <div className="agent-card-desc">{a.desc}</div>
            <div className="agent-card-stats">
              <div className="agent-stat"><strong>{gm(a.mk)}</strong>{a.ml}</div>
              {a.mk2&&<div className="agent-stat"><strong>{gm(a.mk2)}</strong>{a.ml2}</div>}
              {a.master&&<div className="agent-stat"><strong>7</strong>Agents online</div>}
              <div className="agent-stat"><strong>24/7</strong>Active</div>
            </div>
          </div>))}
        </div>
      </div>
    </div>

    <div className="sec-warm" id="mission"><div className="sec-in">
      <div className="sec-label">The Purpose</div>
      <div className="sec-title">Why I Write for <strong>Children</strong></div>
      <div className="sec-sub">Every book is a seed. Planted with love, watered with nature, grown in a child&apos;s heart.</div>
      <div className="mission-cards">
        {[{i:"🌱",t:"Nature as Teacher",d:"Children learn through the living world. A seed teaches patience. A storm teaches resilience."},{i:"💚",t:"Emotional Literacy",d:"My books give children 15 emotional vocabularies anchored in sensory experiences they can touch and feel."},{i:"👨‍👧‍👦",t:"Family Connection",d:"Every ritual is for parent and child together — amplifying the sacred bond between caregiver and child."},{i:"🕉️",t:"Rooted in Tradition",d:"Drawing from ancient traditions of harmony with nature and spiritual significance."},{i:"🌍",t:"For Every Child",d:"Emotions are universal. A child in Tamil Nadu feels as seen as a child in Toronto."},{i:"✨",t:"A Movement",d:"When families walk together with nature, healing becomes inevitable."}].map((c,i)=>(<div key={i} className="mission-card"><div className="mission-icon">{c.i}</div><h3>{c.t}</h3><p>{c.d}</p></div>))}
      </div>
    </div></div>

    <section className="sec" id="connect">
      <div className="sec-label">Get in Touch</div>
      <div className="sec-title">Let&apos;s <strong>Connect</strong></div>
      <div className="sec-sub">Whether you&apos;re a parent, publisher, educator, or author — I&apos;d love to hear from you.</div>
      <div className="connect-grid">
        <form className="connect-form" onSubmit={submitForm}>
          {fs==="success"&&<div className="form-success">✅ Thank you! V Ramanan will respond within 24 hours.</div>}
          {fs==="error"&&<div className="form-error">Something went wrong. Please email Champvenk88@gmail.com.</div>}
          <input className="vr-input" placeholder="Your name" value={fd.name} onChange={e=>setFd({...fd,name:e.target.value})} required/>
          <input className="vr-input" type="email" placeholder="Your email" value={fd.email} onChange={e=>setFd({...fd,email:e.target.value})} required/>
          <textarea className="vr-input" placeholder="Your message..." value={fd.message} onChange={e=>setFd({...fd,message:e.target.value})} required/>
          <button className="btn-leaf" type="submit" disabled={fs==="sending"} style={{alignSelf:"flex-start",border:"none",cursor:"pointer"}}>{fs==="sending"?"Sending...":"Send Message"}</button>
        </form>
        <div className="connect-info">
          <h3>V Ramanan</h3>
          <p>Toronto-based children&apos;s book author at the intersection of nature, emotional wellness, and family connection.</p>
          <div className="social-links">
            <a className="social-link" href="https://www.linkedin.com/in/venkata-ramanan-22419247/" target="_blank" rel="noopener noreferrer"><span className="social-icon">💼</span><span>LinkedIn — Venkata Ramanan</span></a>
            <a className="social-link" href="mailto:Champvenk88@gmail.com"><span className="social-icon">📧</span><span>Email — Champvenk88@gmail.com</span></a>
          </div>
        </div>
      </div>
    </section>

    <footer className="footer">
      <div className="footer-name">V Ramanan</div>
      <div className="footer-tag">Author | Nature & Emotional Wellness</div>
      <div className="footer-copy">© 2026 V Ramanan. All rights reserved. Toronto, Canada.</div>
    </footer>

    <button className={`chat-fab ${chatOpen?"open":""}`} onClick={()=>setChatOpen(!chatOpen)}>{chatOpen?"✕":"🌿"}</button>
    <div className={`chat-window ${chatOpen?"open":""}`}>
      <div className="chat-head"><div className="chat-head-icon">🌿</div><div><div className="chat-head-title">V Ramanan&apos;s Assistant</div><div className="chat-head-sub">Ask me anything</div></div><div className="chat-head-dot"/></div>
      <div className="chat-msgs">
        {msgs.map((m,i)=>(<div key={i} className={`chat-msg ${m.role==="user"?"user":"bot"}`}><div className="chat-msg-bubble">{m.content}</div></div>))}
        {cLoading&&<div className="chat-msg bot"><div className="chat-msg-bubble"><div className="chat-typing"><span/><span/><span/></div></div></div>}
        <div ref={ceRef}/>
      </div>
      {showSug&&<div className="chat-sug-wrap">{SUGGESTIONS.map((s,i)=>(<button key={i} className="chat-sug" onClick={()=>sendC(s)}>{s}</button>))}</div>}
      <div className="chat-input-area"><input className="chat-input" placeholder="Ask me anything..." value={ci} onChange={e=>setCi(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendC()}/><button className="chat-send" onClick={()=>sendC()}>➤</button></div>
    </div>
  </>);
}
