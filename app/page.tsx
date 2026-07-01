"use client";

import React, { useState, useEffect, useRef } from 'react';
import * as Icons from 'lucide-react';

export default function AgencyOS_Final() {
  // --- ESTADOS PRINCIPALES ---
  const [view, setView] = useState('dashboard'); 
  const [activeBizId, setActiveBizId] = useState(null);
  const [bizTab, setBizTab] = useState('info');
  const [businesses, setBusinesses] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // --- PERSISTENCIA ---
  useEffect(() => {
    const saved = localStorage.getItem('agency_v7_final');
    if (saved) setBusinesses(JSON.parse(saved));
    else {
      setBusinesses([{
        id: '1', name: 'Clínica Dental Quito', category: 'Salud',
        info: { tel: '099999999', address: 'Quito, Ecuador', web: 'www.dental.com' },
        agents: [{ name: 'Recepcionista', role: 'Citas', status: 'Online' }],
        knowledge: { docs: 5, images: 12, links: 20 },
        messages: [{ role: 'ai', content: 'Sistema operativo listo.' }]
      }]);
    }
  }, []);

  useEffect(() => {
    if (businesses.length > 0) localStorage.setItem('agency_v7_final', JSON.stringify(businesses));
  }, [businesses]);

  const activeBiz = businesses.find(b => b.id === activeBizId);

  // --- ACCIONES ---
  const createNewBiz = () => {
    const name = prompt("Nombre del Negocio:");
    if (!name) return;
    const newB = {
      id: Date.now().toString(), name, category: 'Servicios',
      info: { tel: '', address: '', web: '' },
      agents: [], knowledge: { docs: 0, images: 0, links: 0 },
      messages: [{ role: 'ai', content: `Configurando ${name}...` }]
    };
    setBusinesses([...businesses, newB]);
    setActiveBizId(newB.id);
    setView('biz_detail');
  };

  const handleChat = async () => {
    if (!input.trim() || isTyping) return;
    const userMsg = { role: 'user', content: input, id: Date.now() };
    setBusinesses(prev => prev.map(b => b.id === activeBizId ? { ...b, messages: [...(b.messages || []), userMsg] } : b));
    setInput('');
    setIsTyping(true);

    try {
      const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          "model": "meta-llama/llama-3-8b-instruct:free",
          "messages": [{ "role": "system", "content": "Eres un ingeniero de IA experto." }, { "role": "user", "content": input }]
        })
      });
      const data = await resp.json();
      const aiMsg = { role: 'ai', content: data.choices[0].message.content, id: Date.now() + 1 };
      setBusinesses(prev => prev.map(b => b.id === activeBizId ? { ...b, messages: [...(b.messages || []), aiMsg] } : b));
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex h-screen bg-[#050505] text-[#e5e7eb] font-sans">
      
      {/* 1. SIDEBAR (9 SECCIONES) */}
      <aside className="w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col p-6 z-50">
        <div className="flex items-center gap-3 mb-10 px-2 cursor-pointer" onClick={() => setView('dashboard')}>
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Icons.Zap size={20} className="text-white" />
          </div>
          <span className="font-black text-xl tracking-tighter text-white">ENGINE.IA</span>
        </div>

        <nav className="flex-1 space-y-1">
          <NavBtn icon={<Icons.LayoutDashboard size={18}/>} label="Dashboard" active={view === 'dashboard'} onClick={() => setView('dashboard')} />
          <NavBtn icon={<Icons.Users size={18}/>} label="Clientes" active={view === 'clients' || view === 'biz_detail'} onClick={() => setView('clients')} />
          <NavBtn icon={<Icons.Zap size={18}/>} label="Automatizaciones" />
          <NavBtn icon={<Icons.Bot size={18}/>} label="Agentes IA" />
          <NavBtn icon={<Icons.Database size={18}/>} label="Conocimiento" />
          <NavBtn icon={<Icons.Globe size={18}/>} label="Integraciones" />
          <NavBtn icon={<Icons.BarChart3 size={18}/>} label="Estadísticas" onClick={() => setView('stats')} active={view === 'stats'} />
          <div className="py-4 opacity-10"><hr className="border-white/10" /></div>
          <NavBtn icon={<Icons.CreditCard size={18} className="text-green-500"/>} label="Facturación" />
          <NavBtn icon={<Icons.Settings size={18}/>} label="Configuración" />
        </nav>
      </aside>

      {/* 2. CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#0c0c0c] to-[#050505]">
        
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 backdrop-blur-xl z-40">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
            {view === 'dashboard' ? 'Infraestructura Global' : `Gestionando / ${activeBiz?.name}`}
          </h2>
          <button onClick={createNewBiz} className="bg-white text-black px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">
            + Nuevo Negocio
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
          
          {/* VISTA: LISTA DE CLIENTES */}
          {(view === 'dashboard' || view === 'clients') && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {businesses.map(b => (
                <div key={b.id} onClick={() => { setActiveBizId(b.id); setView('biz_detail'); }} className="group bg-[#0a0a0a] border border-white/5 p-8 rounded-[40px] hover:border-blue-600/50 transition-all cursor-pointer relative">
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center font-black text-2xl text-blue-500 mb-8 uppercase">{b.name[0]}</div>
                  <h3 className="text-xl font-bold tracking-tight mb-2">{b.name}</h3>
                  <div className="flex items-center justify-between mt-10 text-[10px] font-black uppercase text-blue-500 group-hover:gap-2 transition-all">
                    Abrir Workspace <Icons.ChevronRight size={14}/>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* VISTA: DETALLE DEL NEGOCIO (EL WORKSPACE QUE PEDISTE) */}
          {view === 'biz_detail' && activeBiz && (
            <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-500">
              <div className="flex gap-8 border-b border-white/5 pb-4">
                <SubBtn label="Información" active={bizTab === 'info'} onClick={() => setBizTab('info')} />
                <SubBtn label="Agentes IA" active={bizTab === 'agents'} onClick={() => setBizTab('agents')} />
                <SubBtn label="Entrenamiento" active={bizTab === 'training'} onClick={() => setBizTab('training')} />
                <SubBtn label="Canales" active={bizTab === 'channels'} onClick={() => setBizTab('channels')} />
              </div>

              {bizTab === 'info' && (
                <div className="grid grid-cols-2 gap-8">
                  <div className="bg-[#0a0a0a] p-10 rounded-[40px] border border-white/5 space-y-6">
                    <Field label="WhatsApp" value={activeBiz.info.tel} />
                    <Field label="Dirección" value={activeBiz.info.address} />
                    <Field label="Web" value={activeBiz.info.web} />
                  </div>
                  <div className="bg-[#0a0a0a] rounded-[40px] flex items-center justify-center border border-white/5">
                    <Icons.MapPin size={40} className="text-blue-600 animate-bounce" />
                  </div>
                </div>
              )}

              {bizTab === 'agents' && (
                <div className="grid grid-cols-3 gap-6">
                  {activeBiz.agents.map((a, i) => (
                    <div key={i} className="bg-[#0f0f0f] border border-white/5 p-8 rounded-[32px]">
                      <Icons.Bot size={24} className="text-blue-500 mb-4" />
                      <h4 className="font-bold">{a.name}</h4>
                      <p className="text-[10px] text-gray-500 uppercase mt-1">{a.role}</p>
                    </div>
                  ))}
                  <button className="border-2 border-dashed border-white/5 p-8 rounded-[32px] text-gray-700 hover:text-blue-500 transition-all">+ Añadir Agente</button>
                </div>
              )}

              {bizTab === 'training' && (
                <div className="bg-[#0a0a0a] border-2 border-dashed border-white/10 p-20 rounded-[40px] text-center hover:bg-white/[0.01] transition-all">
                  <Icons.Paperclip size={48} className="mx-auto mb-6 text-gray-700" />
                  <h3 className="text-xl font-bold mb-4">Base de Conocimiento IA</h3>
                  <div className="flex gap-4 justify-center">
                    <button className="bg-white text-black px-6 py-2 rounded-lg text-[10px] font-black uppercase">Subir PDF/DOCX</button>
                    <button className="bg-white/5 border border-white/10 px-6 py-2 rounded-lg text-[10px] font-black uppercase">Pegar Web</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VISTA: ESTADÍSTICAS */}
          {view === 'stats' && (
            <div className="grid grid-cols-2 gap-8">
              <StatCard label="Llamadas" value="1.2k" icon={<Icons.Phone/>} />
              <StatCard label="Mensajes" value="45k" icon={<Icons.MessageSquare/>} />
              <StatCard label="Ventas" value="$4,500" icon={<Icons.ShoppingCart/>} />
              <StatCard label="Satisfacción" value="98%" icon={<Icons.CheckCircle/>} />
            </div>
          )}
        </div>

        {/* CHAT DE CONFIGURACIÓN LATERAL */}
        {activeBiz && (
          <div className="fixed bottom-10 right-10 w-[450px] h-[650px] bg-[#080808] border border-white/10 rounded-[40px] shadow-2xl z-[100] flex flex-col overflow-hidden">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center"><Icons.Bot size={22}/></div>
                <h3 className="text-xs font-black uppercase tracking-widest">{activeBiz.name}</h3>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
              {activeBiz.messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-5 rounded-[24px] text-xs max-w-[85%] ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white/5 border border-white/5 text-gray-300'}`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {isTyping && <div className="text-[10px] font-black text-blue-500 animate-pulse uppercase">IA procesando...</div>}
              <div ref={chatEndRef} />
            </div>
            <div className="p-8 bg-[#0a0a0a] border-t border-white/5 flex gap-3">
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleChat()} placeholder="Instrucción..." className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs outline-none" />
              <button onClick={handleChat} className="p-4 bg-white text-black rounded-2xl"><Icons.Send size={18}/></button>
            </div>
          </div>
        )}
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #222; border-radius: 10px; }
      `}</style>
    </div>
  );
}

// --- SUB-COMPONENTES ---
function NavBtn({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${active ? 'bg-white text-black shadow-xl' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
      {icon} <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block">{label}</span>
    </button>
  );
}

function SubBtn({ label, active, onClick }) {
  return (
    <button onClick={onClick} className={`pb-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${active ? 'text-white border-blue-500' : 'text-gray-600 border-transparent hover:text-gray-400'}`}>
      {label}
    </button>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-[9px] font-black text-gray-600 uppercase mb-1">{label}</p>
      <div className="p-4 bg-white/5 border border-white/5 rounded-2xl text-xs font-bold text-gray-300">{value || '---'}</div>
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-[40px]">
      <div className="mb-4 text-gray-600">{icon}</div>
      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{label}</p>
      <h2 className="text-3xl font-black text-white">{value}</h2>
    </div>
  );
}
