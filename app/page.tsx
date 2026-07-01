"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Bot, LayoutDashboard, MessageSquare, Phone, Settings, Zap, 
  Users, Paperclip, Mail, ShoppingCart, X, Plus, Activity, Database, Lock, Trash2, Instagram, Cpu, Globe
} from 'lucide-react';

export default function AgencyEngine() {
  const [view, setView] = useState('projects'); 
  const [projects, setProjects] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // --- PERSISTENCIA REAL ---
  useEffect(() => {
    const saved = localStorage.getItem('agency_pro_v4');
    if (saved) setProjects(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('agency_pro_v4', JSON.stringify(projects));
  }, [projects]);

  const activeProject = projects.find(p => p.id === activeId);

  // --- CORRECCIÓN DEL BOTÓN DE ENVÍO ---
  const handleAction = async () => {
    if (!input.trim() || isTyping || !activeId) return;

    const userText = input;
    const userMsg = { role: 'user', content: userText, id: Date.now() };
    
    // Actualizar mensajes localmente
    setProjects(prev => prev.map(p => 
      p.id === activeId ? { ...p, messages: [...p.messages, userMsg] } : p
    ));
    setInput('');
    setIsTyping(true);

    // LLAMADA A IA REAL
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "meta-llama/llama-3-8b-instruct:free",
          "messages": [
            { "role": "system", "content": `Eres el Sistema Operativo de una Agencia de IA. Cliente: ${activeProject?.name}. Ayuda a automatizar WhatsApp, Voz o Email.` },
            { "role": "user", "content": userText }
          ]
        })
      });
      const data = await response.json();
      const aiMsg = { role: 'ai', content: data.choices[0].message.content, id: Date.now() + 1 };
      setProjects(prev => prev.map(p => p.id === activeId ? { ...p, messages: [...p.messages, aiMsg] } : p));
    } catch (e) {
      const errorMsg = { role: 'ai', content: "Error: Verifica tu API Key de OpenRouter en Vercel.", id: Date.now() + 1 };
      setProjects(prev => prev.map(p => p.id === activeId ? { ...p, messages: [...p.messages, errorMsg] } : p));
    } finally {
      setIsTyping(false);
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const createProject = () => {
    const name = prompt("Nombre del nuevo negocio:");
    if (!name) return;
    const newProj = { id: Date.now().toString(), name, messages: [], modules: {} };
    setProjects([...projects, newProj]);
    setActiveId(newProj.id);
    setView('workspace');
  };

  return (
    <div className="flex h-screen bg-[#000000] text-[#e0e0e0] font-sans selection:bg-blue-500/40">
      
      {/* SIDEBAR TIPO CONSOLA */}
      <aside className="w-20 lg:w-64 bg-[#080808] border-r border-white/5 flex flex-col z-50">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
            <Cpu size={22} className="text-white" />
          </div>
          <span className="font-black text-lg tracking-tighter hidden lg:block uppercase">Engine.IA</span>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <SideItem icon={<LayoutDashboard size={18}/>} label="Proyectos" active={view === 'projects'} onClick={() => setView('projects')} />
          <SideItem icon={<Activity size={18}/>} label="Nodos Activos" />
          <div className="py-4"><hr className="border-white/5" /></div>
          <SideItem icon={<Lock size={18} className="text-yellow-500"/>} label="Facturación" active={view === 'admin'} onClick={() => setView('admin')} />
        </nav>

        <div className="p-6 mt-auto">
          <div className="text-[9px] font-black text-gray-600 uppercase mb-4 tracking-[0.2em]">Partner Status</div>
          <div className="flex items-center gap-2 text-green-500 text-[10px] font-bold">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></div> CONECTADO
          </div>
        </div>
      </aside>

      {/* ÁREA DE TRABAJO */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* HEADER */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-[#000000]/50 backdrop-blur-xl z-40">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">
            {view === 'projects' ? 'Infraestructura' : `Consola / ${activeProject?.name}`}
          </h2>
          <button onClick={createProject} className="bg-white text-black px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">
            + Nuevo Negocio
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-12 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#0a0a0a] to-[#000000]">
          
          {/* VISTA: LISTA DE NEGOCIOS */}
          {view === 'projects' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {projects.length === 0 && (
                <div className="col-span-full py-40 text-center border border-dashed border-white/5 rounded-[40px]">
                  <Database size={40} className="mx-auto mb-4 text-gray-800" />
                  <p className="text-sm font-bold text-gray-600 uppercase tracking-widest">No hay negocios registrados. Empieza creando uno arriba.</p>
                </div>
              )}
              {projects.map(p => (
                <div key={p.id} onClick={() => { setActiveId(p.id); setView('workspace'); }} className="group bg-[#080808] border border-white/5 p-8 rounded-[32px] hover:border-blue-500/40 transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-10">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center font-black text-xl text-blue-500 uppercase">{p.name[0]}</div>
                    <button onClick={(e) => { e.stopPropagation(); setProjects(projects.filter(proj => proj.id !== p.id)); }} className="p-2 text-gray-800 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                  </div>
                  <h3 className="text-xl font-bold tracking-tight mb-8">{p.name}</h3>
                  <div className="flex items-center justify-between text-[9px] font-black uppercase text-blue-500 group-hover:gap-4 transition-all">
                    Ingresar al Sistema <Plus size={14}/>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* VISTA: WORKSPACE (NODOS) */}
          {view === 'workspace' && activeProject && (
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Node title="WhatsApp" icon={<MessageSquare className="text-green-500"/>} onOpen={() => setIsChatOpen(true)} />
                <Node title="Voz IA" icon={<Phone className="text-orange-500"/>} onOpen={() => setIsChatOpen(true)} />
                <Node title="Web Agent" icon={<Globe className="text-blue-500"/>} onOpen={() => setIsChatOpen(true)} />
              </div>
              <div className="bg-[#080808] border border-white/5 rounded-[40px] p-12 text-center">
                 <Paperclip size={32} className="mx-auto mb-4 text-gray-700" />
                 <h3 className="text-xs font-black uppercase tracking-widest text-gray-500">Base de Datos de Entrenamiento</h3>
                 <p className="text-[10px] text-gray-700 mt-2">Sube archivos aquí para que la IA los procese para este cliente.</p>
              </div>
            </div>
          )}
        </div>

        {/* CHAT LATERAL DE INGENIERÍA */}
        {isChatOpen && activeProject && (
          <div className="fixed inset-y-0 right-0 w-full lg:w-[500px] bg-[#050505] border-l border-white/10 shadow-2xl z-[100] flex flex-col">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-[#080808]">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Configurador IA</h3>
                <p className="text-xs font-bold mt-1 uppercase tracking-tighter">{activeProject.name}</p>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="p-3 hover:bg-white/5 rounded-full"><X size={20}/></button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {activeProject.messages.length === 0 && (
                <div className="text-center py-20 text-gray-700">
                  <Bot size={40} className="mx-auto mb-4 opacity-20" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Esperando instrucciones...</p>
                </div>
              )}
              {activeProject.messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-5 rounded-2xl text-xs max-w-[85%] leading-relaxed ${m.role === 'user' ? 'bg-blue-600 text-white font-medium' : 'bg-white/5 border border-white/5 text-gray-300'}`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {isTyping && <div className="text-[10px] font-black text-blue-500 animate-pulse tracking-widest">PROCESANDO...</div>}
              <div ref={chatEndRef} />
            </div>

            <div className="p-8 bg-[#080808] border-t border-white/5 flex gap-4">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAction()}
                placeholder="Escribe aquí..."
                className="flex-1 bg-[#000000] border border-white/10 rounded-xl px-6 py-4 text-xs focus:ring-1 focus:ring-blue-600 outline-none"
              />
              <button 
                onClick={handleAction}
                className="w-14 h-14 bg-white text-black rounded-xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-xl shadow-white/5"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function SideItem({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${active ? 'bg-white text-black shadow-lg shadow-white/10' : 'text-gray-600 hover:text-white hover:bg-white/5'}`}>
      {icon} <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block">{label}</span>
    </button>
  );
}

function Node({ title, icon, onOpen }) {
  return (
    <div onClick={onOpen} className="bg-[#080808] border border-white/5 p-8 rounded-3xl hover:border-white/20 cursor-pointer transition-all">
       <div className="mb-6">{icon}</div>
       <div className="text-xs font-black uppercase tracking-widest">{title}</div>
       <div className="mt-2 text-[9px] font-bold text-gray-600 uppercase">Estado: Pendiente</div>
    </div>
  );
}
