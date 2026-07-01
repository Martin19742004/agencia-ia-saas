"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Bot, LayoutDashboard, MessageSquare, Phone, Settings, Zap, 
  Users, Paperclip, Globe, Mail, ShoppingCart, CheckCircle2, ChevronRight, X, 
  Plus, ArrowRight, Activity, Database, Key, Lock, Trash2, RefreshCw, Layers, Instagram
} from 'lucide-react';

export default function AutomationConsole() {
  const [view, setView] = useState('projects'); 
  const [projects, setProjects] = useState([]);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  // --- PERSISTENCIA DE DATOS ---
  useEffect(() => {
    const saved = localStorage.getItem('agency_v3_data');
    if (saved) setProjects(JSON.parse(saved));
    else setProjects([{ id: '1', name: 'Mi Primer Negocio', status: 'Nuevo', modules: {}, memory: [], logs: [] }]);
  }, []);

  useEffect(() => {
    if (projects.length > 0) localStorage.setItem('agency_v3_data', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [isChatOpen, isTyping, projects]);

  const activeProject = projects.find(p => p.id === activeProjectId);

  // --- LÓGICA DE INTELIGENCIA REAL ---
  const callOpenRouter = async (text) => {
    const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_KEY;
    if (!apiKey) return "Error: No has configurado la API Key en Vercel.";

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "meta-llama/llama-3-8b-instruct:free",
          "messages": [
            { "role": "system", "content": `Eres el Ingeniero Jefe de una Agencia de Automatización. Cliente: ${activeProject?.name}. Ayuda al usuario a configurar WhatsApp, Instagram o Voz. Sé técnico pero directo.` },
            { "role": "user", "content": text }
          ]
        })
      });
      const data = await response.json();
      return data.choices[0].message.content;
    } catch (e) {
      return "Hubo un fallo en la conexión con el cerebro de IA.";
    }
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userText = input;
    const userMsg = { role: 'user', content: userText, time: new Date().toLocaleTimeString() };
    
    // Guardar mensaje del usuario
    const updated = projects.map(p => p.id === activeProjectId ? { ...p, memory: [...(p.memory || []), userMsg] } : p);
    setProjects(updated);
    setInput('');
    setIsTyping(true);

    // Llamada a la IA
    const aiResponse = await callOpenRouter(userText);
    const aiMsg = { role: 'ai', content: aiResponse, time: new Date().toLocaleTimeString() };
    
    setProjects(prev => prev.map(p => p.id === activeProjectId ? { ...p, memory: [...(p.memory || []), aiMsg] } : p));
    setIsTyping(false);
  };

  // --- GESTIÓN DE PROYECTOS ---
  const addNewProject = () => {
    const name = prompt("Nombre del Negocio:");
    if (!name) return;
    const newP = { id: Date.now().toString(), name, status: 'Activo', modules: {}, memory: [], logs: [] };
    setProjects([...projects, newP]);
    setActiveProjectId(newP.id);
    setView('workspace');
  };

  return (
    <div className="flex h-screen bg-[#020202] text-[#f0f0f0] font-sans selection:bg-blue-500/30">
      
      {/* SIDEBAR TIPO n8n */}
      <aside className="w-64 bg-[#080808] border-r border-white/5 flex flex-col z-50">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Zap size={20} className="text-white fill-white" />
          </div>
          <span className="font-black text-lg tracking-tighter italic">STUDIO.IA</span>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <NavTab icon={<Layers size={18}/>} label="Dashboard" active={view === 'projects'} onClick={() => setView('projects')} />
          <NavTab icon={<Activity size={18}/>} label="Flujos Activos" />
          <NavTab icon={<Database size={18}/>} label="Base de Datos" />
          <div className="py-4 opacity-10"><hr border-white/10 /></div>
          <NavTab icon={<Lock size={18} className="text-yellow-500"/>} label="Admin / Pagos" active={view === 'admin'} onClick={() => setView('admin')} />
        </nav>

        <div className="p-6 mt-auto">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
            <div className="text-[9px] font-bold text-gray-500 uppercase mb-2">Socio de Agencia</div>
            <div className="text-[11px] font-bold">Martin Network 🇪🇨</div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* HEADER PRO */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-[#020202]/80 backdrop-blur-2xl z-40">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
            {view === 'projects' ? 'Infraestructura Global' : `Configuración / ${activeProject?.name}`}
          </h2>
          <button onClick={addNewProject} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2">
            <Plus size={14}/> Nuevo Negocio
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
          
          {/* PROYECTOS */}
          {view === 'projects' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {projects.map(p => (
                <ProjectCard key={p.id} project={p} onOpen={() => { setActiveProjectId(p.id); setView('workspace'); }} onDelete={(e) => { e.stopPropagation(); setProjects(projects.filter(proj => proj.id !== p.id)); }} />
              ))}
            </div>
          )}

          {/* WORKSPACE DE INGENIERÍA */}
          {view === 'workspace' && activeProject && (
            <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatusNode title="WhatsApp API" status="Configurar" icon={<MessageSquare className="text-green-500"/>} onClick={() => setIsChatOpen(true)} />
                <StatusNode title="Voice Assistant" status="Configurar" icon={<Phone className="text-orange-500"/>} onClick={() => setIsChatOpen(true)} />
                <StatusNode title="Instagram DM" status="Configurar" icon={<Instagram className="text-pink-500"/>} onClick={() => setIsChatOpen(true)} />
              </div>

              <div className="bg-[#080808] border border-white/5 rounded-[40px] p-12 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Database size={120}/></div>
                <h3 className="text-sm font-black uppercase tracking-widest mb-8 flex items-center gap-3"><RefreshCw size={18} className="text-blue-500"/> Entrenamiento Local</h3>
                <div className="border-2 border-dashed border-white/10 rounded-[32px] p-20 flex flex-col items-center justify-center hover:border-blue-500/50 hover:bg-white/[0.01] transition-all cursor-pointer">
                  <Paperclip size={40} className="text-gray-700 mb-6"/>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Sube archivos PDF, JPG o Texto<br/>específicos para este negocio.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CHAT TIPO CURSOR / n8n (SUPER INTUITIVO) */}
        {isChatOpen && activeProject && (
          <div className="fixed inset-y-0 right-0 w-[500px] bg-[#080808] border-l border-white/10 shadow-2xl z-[100] flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-[#0a0a0a]">
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-blue-500">Agente de Configuración</h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter mt-1">Negocio: {activeProject.name}</p>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="p-3 hover:bg-white/5 rounded-full transition-colors text-gray-500"><X size={20}/></button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar" ref={scrollRef}>
              {activeProject.memory.length === 0 && (
                <div className="text-center py-20">
                  <Bot size={40} className="mx-auto mb-4 text-gray-800 opacity-50" />
                  <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Escribe algo para empezar a automatizar...</p>
                </div>
              )}
              {activeProject.memory.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-5 rounded-[24px] text-xs max-w-[90%] leading-relaxed ${m.role === 'user' ? 'bg-blue-600 text-white font-medium ml-12' : 'bg-white/5 border border-white/5 text-gray-300 mr-12'}`}>
                    {m.content}
                    <div className={`text-[8px] mt-2 opacity-40 font-bold ${m.role === 'user' ? 'text-right' : 'text-left'}`}>{m.time}</div>
                  </div>
                </div>
              ))}
              {isTyping && <div className="flex gap-2 p-4 bg-white/5 w-fit rounded-full ml-4 animate-pulse"><div className="w-1 h-1 bg-gray-500 rounded-full"></div><div className="w-1 h-1 bg-gray-500 rounded-full"></div><div className="w-1 h-1 bg-gray-500 rounded-full"></div></div>}
            </div>

            <form onSubmit={handleSendMessage} className="p-8 bg-[#0a0a0a] border-t border-white/5 flex items-center gap-4">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ej: Automatiza mis respuestas de WhatsApp..."
                className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all"
              />
              <button type="submit" className="w-12 h-12 bg-white text-black rounded-xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">
                <Send size={18} />
              </button>
            </form>
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

// --- COMPONENTES AUXILIARES ---
function NavTab({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${active ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
      {icon}
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}

function ProjectCard({ project, onOpen, onDelete }) {
  return (
    <div onClick={onOpen} className="group bg-[#080808] border border-white/5 p-8 rounded-[32px] hover:border-blue-600/50 transition-all cursor-pointer relative overflow-hidden">
       <div className="flex justify-between items-start mb-10">
          <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center font-black text-xl text-blue-500 group-hover:scale-110 transition-transform">{project.name[0]}</div>
          <button onClick={onDelete} className="p-2 text-gray-700 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
       </div>
       <h3 className="text-xl font-bold mb-2 tracking-tighter">{project.name}</h3>
       <p className="text-[9px] font-black uppercase tracking-widest text-gray-600">ID: {project.id}</p>
       <div className="mt-8 flex items-center justify-between">
          <div className="flex -space-x-2">
             <div className="w-6 h-6 rounded-full border border-[#020202] bg-green-500/20"></div>
             <div className="w-6 h-6 rounded-full border border-[#020202] bg-blue-500/20"></div>
          </div>
          <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest group-hover:mr-2 transition-all">Abrir Entorno →</span>
       </div>
    </div>
  );
}

function StatusNode({ title, status, icon, onClick }) {
  return (
    <div onClick={onClick} className="bg-[#080808] border border-white/5 p-6 rounded-3xl hover:bg-white/[0.02] cursor-pointer transition-all">
      <div className="mb-4">{icon}</div>
      <div className="text-[11px] font-black uppercase tracking-widest mb-1">{title}</div>
      <div className="text-[9px] font-bold text-blue-500 uppercase tracking-tighter">{status}</div>
    </div>
  );
}
