"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, LayoutDashboard, Users, Bot, Database, Globe, BarChart3, 
  CreditCard, Settings, Plus, ArrowRight, Phone, MessageSquare, 
  Instagram, Mail, MapPin, FileText, Paperclip, Send, X, CheckCircle 
} from 'lucide-react';

export default function AgencyOS() {
  const [view, setView] = useState('dashboard');
  const [activeBizId, setActiveBizId] = useState<string | null>(null);
  const [bizTab, setBizTab] = useState('info');
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('agency_v8_enterprise');
    if (saved) {
      setBusinesses(JSON.parse(saved));
    } else {
      const demo = {
        id: '1',
        name: 'Clínica Dental Quito',
        category: 'Salud',
        address: 'Quito, Ecuador',
        status: 'Activo',
        agents: [{ name: 'Recepcionista', role: 'Citas', status: 'Online' }],
        knowledge: { docs: 5, images: 10, links: 15 },
        messages: [{ role: 'ai', content: 'Sistema cargado. Selecciona un negocio para configurar.' }]
      };
      setBusinesses([demo]);
    }
  }, []);

  useEffect(() => {
    if (businesses.length > 0) {
      localStorage.setItem('agency_v8_enterprise', JSON.stringify(businesses));
    }
  }, [businesses]);

  const activeBiz = businesses.find(b => b.id === activeBizId);

  const createNewBiz = () => {
    const name = prompt("Nombre de la Empresa:");
    if (!name) return;
    const newB = {
      id: Date.now().toString(),
      name,
      category: 'Servicios',
      address: '',
      status: 'Trial',
      agents: [],
      knowledge: { docs: 0, images: 0, links: 0 },
      messages: [{ role: 'ai', content: `Configurando ${name}. ¿Qué automatización necesitas?` }]
    };
    setBusinesses([...businesses, newB]);
    setActiveBizId(newB.id);
    setView('biz_detail');
  };

  const handleChat = async () => {
    if (!input.trim() || isTyping || !activeBizId) return;
    const userMsg = { role: 'user', content: input, id: Date.now() };
    setBusinesses(prev => prev.map(b => b.id === activeBizId ? { ...b, messages: [...b.messages, userMsg] } : b));
    setInput('');
    setIsTyping(true);

    try {
      const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_KEY}`, 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({
          "model": "meta-llama/llama-3-8b-instruct:free",
          "messages": [{ role: "user", content: input }]
        })
      });
      const data = await resp.json();
      const aiMsg = { role: 'ai', content: data.choices[0].message.content, id: Date.now() + 1 };
      setBusinesses(prev => prev.map(b => b.id === activeBizId ? { ...b, messages: [...b.messages, aiMsg] } : b));
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex h-screen bg-[#020202] text-white font-sans">
      <aside className="w-64 bg-[#080808] border-r border-white/5 flex flex-col p-6 z-50">
        <div className="flex items-center gap-3 mb-10 px-2 cursor-pointer" onClick={() => setView('dashboard')}>
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center"><Zap size={20} /></div>
          <span className="font-bold text-xl tracking-tighter">STUDIO.IA</span>
        </div>
        <nav className="flex-1 space-y-1">
          <NavBtn icon={<LayoutDashboard size={18}/>} label="Dashboard" active={view === 'dashboard'} onClick={() => setView('dashboard')} />
          <NavBtn icon={<Users size={18}/>} label="Clientes" active={view === 'clients' || view === 'biz_detail'} onClick={() => setView('clients')} />
          <NavBtn icon={<Zap size={18}/>} label="Automatizaciones" />
          <NavBtn icon={<Bot size={18}/>} label="Agentes IA" />
          <NavBtn icon={<Database size={18}/>} label="Conocimiento" />
          <NavBtn icon={<BarChart3 size={18}/>} label="Estadísticas" onClick={() => setView('stats')} active={view === 'stats'} />
          <div className="py-4 opacity-10"><hr border-white/10 /></div>
          <NavBtn icon={<CreditCard size={18} className="text-green-500"/>} label="Facturación" />
          <NavBtn icon={<Settings size={18}/>} label="Ajustes" />
        </nav>
      </aside>

      <main className="flex-1 flex flex-col relative overflow-hidden bg-[#050505]">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 backdrop-blur-xl">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
            {view === 'dashboard' ? 'Infraestructura' : `Negocio / ${activeBiz?.name}`}
          </h2>
          <button onClick={createNewBiz} className="bg-white text-black px-6 py-2.5 rounded-lg text-[10px] font-black uppercase hover:bg-blue-600 hover:text-white transition-all">
            + Nuevo Negocio
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          {(view === 'dashboard' || view === 'clients') && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {businesses.map(b => (
                <div key={b.id} onClick={() => { setActiveBizId(b.id); setView('biz_detail'); }} className="bg-[#0a0a0a] border border-white/5 p-8 rounded-[40px] hover:border-blue-500 transition-all cursor-pointer">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-bold text-xl mb-6">{b.name[0]}</div>
                  <h3 className="text-xl font-bold mb-10">{b.name}</h3>
                  <div className="flex items-center justify-between text-[10px] font-bold text-blue-500 uppercase tracking-widest">
                    Workspace <ArrowRight size={14}/>
                  </div>
                </div>
              ))}
            </div>
          )}

          {view === 'biz_detail' && activeBiz && (
            <div className="max-w-4xl mx-auto space-y-10">
              <div className="flex gap-6 border-b border-white/5 pb-4">
                <SubBtn label="Info" active={bizTab === 'info'} onClick={() => setBizTab('info')} />
                <SubBtn label="Agentes" active={bizTab === 'agents'} onClick={() => setBizTab('agents')} />
                <SubBtn label="Entrenamiento" active={bizTab === 'training'} onClick={() => setBizTab('training')} />
              </div>

              {bizTab === 'info' && (
                <div className="bg-[#0a0a0a] p-10 rounded-[32px] border border-white/5 space-y-4">
                  <div className="text-sm font-bold opacity-50 uppercase tracking-widest text-[10px]">Ubicación</div>
                  <div className="text-lg font-bold">{activeBiz.address || 'Ecuador'}</div>
                </div>
              )}

              {bizTab === 'training' && (
                <div className="bg-[#0a0a0a] border-2 border-dashed border-white/10 p-20 rounded-[40px] text-center">
                  <Paperclip size={40} className="mx-auto mb-4 opacity-20" />
                  <h3 className="font-bold mb-4">Base de Conocimiento IA</h3>
                  <div className="flex gap-4 justify-center">
                    <button className="bg-white text-black px-6 py-2 rounded-lg text-[10px] font-bold uppercase">Subir PDF</button>
                    <button className="bg-white/5 border border-white/10 px-6 py-2 rounded-lg text-[10px] font-bold uppercase">Pegar Web</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {view === 'stats' && (
            <div className="grid grid-cols-2 gap-8">
              <StatBox label="Mensajes" value="45.2k" />
              <StatBox label="Llamadas" value="1.2k" />
            </div>
          )}
        </div>

        {activeBiz && (
          <div className="fixed bottom-10 right-10 w-[450px] h-[600px] bg-[#0a0a0a] border border-white/10 rounded-[32px] shadow-2xl flex flex-col">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-3"><Bot size={20}/><span className="text-xs font-bold uppercase">{activeBiz.name}</span></div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {activeBiz.messages.map((m: any, i: number) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-4 rounded-2xl text-xs max-w-[80%] ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white/5 border border-white/5'}`}>
                    {m.content}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <div className="p-6 bg-[#080808] border-t border-white/5 flex gap-2">
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleChat()} className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-3 text-xs outline-none" placeholder="Instrucción..." />
              <button onClick={handleChat} className="p-4 bg-white text-black rounded-xl"><Send size={18}/></button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function NavBtn({ icon, label, active, onClick }: any) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${active ? 'bg-white text-black font-bold' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
      {icon} <span className="text-[10px] uppercase tracking-widest hidden lg:block">{label}</span>
    </button>
  );
}

function SubBtn({ label, active, onClick }: any) {
  return (
    <button onClick={onClick} className={`pb-2 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${active ? 'text-white border-blue-500' : 'text-gray-600 border-transparent hover:text-gray-300'}`}>{label}</button>
  );
}

function StatBox({ label, value }: any) {
  return (
    <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-[32px]">
      <div className="text-[10px] font-black uppercase text-gray-500 mb-2">{label}</div>
      <div className="text-3xl font-black">{value}</div>
    </div>
  );
}
