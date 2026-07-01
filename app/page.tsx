"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Bot, LayoutDashboard, MessageSquare, Phone, Settings, Zap, 
  Users, Paperclip, Globe, Mail, ShoppingCart, CheckCircle2, ChevronRight, X, 
  Plus, ArrowRight, Activity, Database, Key, Lock, Trash2, Save, Layers
} from 'lucide-react';

export default function ProfessionalAgencyOS() {
  // --- ESTADO GLOBAL ---
  const [view, setView] = useState('projects'); // 'projects' | 'workspace' | 'admin'
  const [projects, setProjects] = useState([]);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [input, setInput] = useState('');

  // --- CARGAR / GUARDAR DATOS (Persistencia) ---
  useEffect(() => {
    const saved = localStorage.getItem('agency_projects');
    if (saved) setProjects(JSON.parse(saved));
    else setProjects([
      { id: '1', name: 'Demo: Restaurante El Sol', status: 'Inactivo', modules: {}, memory: [], files: [] }
    ]);
  }, []);

  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem('agency_projects', JSON.stringify(projects));
    }
  }, [projects]);

  const activeProject = projects.find(p => p.id === activeProjectId);

  // --- ACCIONES DE NEGOCIO ---
  const createProject = () => {
    const name = prompt("Nombre de la nueva Agencia/Negocio:");
    if (!name) return;
    const newProj = {
      id: Date.now().toString(),
      name,
      status: 'Configurando',
      modules: { whatsapp: false, voice: false, gmail: false, instagram: false },
      memory: [{ role: 'ai', content: `Bienvenido al entorno de automatización para ${name}. ¿Qué canal quieres activar hoy?` }],
      files: []
    };
    setProjects([...projects, newProj]);
    setActiveProjectId(newProj.id);
    setView('workspace');
  };

  const deleteProject = (id, e) => {
    e.stopPropagation();
    if (confirm("¿Seguro que quieres eliminar este negocio y todas sus automatizaciones?")) {
      setProjects(projects.filter(p => p.id !== id));
      if (activeProjectId === id) setView('projects');
    }
  };

  const updateModule = (moduleId) => {
    const updated = projects.map(p => {
      if (p.id === activeProjectId) {
        return { ...p, modules: { ...p.modules, [moduleId]: !p.modules[moduleId] } };
      }
      return p;
    });
    setProjects(updated);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    const updatedProjects = projects.map(p => {
      if (p.id === activeProjectId) {
        return { ...p, memory: [...p.memory, userMsg] };
      }
      return p;
    });
    setProjects(updatedProjects);
    setInput('');

    // Simulación de IA (Aquí iría tu llamada a OpenRouter)
    setTimeout(() => {
      const aiMsg = { role: 'ai', content: `Entendido. Estoy procesando la información para ${activeProject.name} sobre: "${input}". Esto optimizará tu flujo de WhatsApp.` };
      setProjects(prev => prev.map(p => p.id === activeProjectId ? { ...p, memory: [...p.memory, aiMsg] } : p));
    }, 1000);
  };

  return (
    <div className="flex h-screen bg-[#050505] text-[#e1e1e1] font-sans overflow-hidden">
      
      {/* SIDEBAR TÉCNICA */}
      <aside className="w-20 lg:w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col p-6 z-20">
        <div className="flex items-center gap-3 mb-12 px-2 cursor-pointer" onClick={() => setView('projects')}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/40">
            <Layers size={18} className="text-white" />
          </div>
          <span className="font-black text-lg tracking-tighter hidden lg:block">AGENCY.ENGINE</span>
        </div>

        <nav className="flex-1 space-y-2">
          <SideBtn icon={<LayoutDashboard size={20}/>} label="Negocios" active={view === 'projects'} onClick={() => setView('projects')} />
          <SideBtn icon={<Activity size={20}/>} label="Métricas Globales" />
          <SideBtn icon={<Key size={20}/>} label="API Keys" />
          <div className="py-6 opacity-20"><hr className="border-white/10" /></div>
          <SideBtn icon={<Lock size={20} className="text-yellow-500"/>} label="Admin / Pagos" active={view === 'admin'} onClick={() => setView('admin')} />
        </nav>

        <div className="mt-auto space-y-4">
          <div className="text-[10px] uppercase font-bold text-gray-600 tracking-widest px-2">Estatus Sistema</div>
          <div className="flex items-center gap-2 px-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-bold text-green-500">IA CORE ONLINE</span>
          </div>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* TOP BAR */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-10 bg-[#050505]/80 backdrop-blur-xl z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">
              {view === 'projects' ? 'Infraestructura de Clientes' : `Workspace / ${activeProject?.name}`}
            </h2>
          </div>
          <button 
            onClick={createProject}
            className="bg-white text-black px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-xl shadow-white/5"
          >
            + Registrar Negocio
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-10 bg-[#050505] custom-scrollbar">
          
          {/* VISTA 1: EXPLORADOR DE PROYECTOS (Negocios independientes) */}
          {view === 'projects' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map(p => (
                <div 
                  key={p.id} 
                  onClick={() => { setActiveProjectId(p.id); setView('workspace'); }}
                  className="group relative bg-[#0f0f0f] border border-white/5 p-8 rounded-[32px] hover:border-blue-500/50 hover:bg-[#121212] transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-10">
                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center font-black text-2xl group-hover:scale-110 transition-transform">
                      {p.name[0]}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={(e) => deleteProject(p.id, e)} className="p-2 text-gray-600 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2 tracking-tight">{p.name}</h3>
                  <div className="flex gap-2 mb-8">
                    {Object.entries(p.modules).map(([mod, active]) => (
                      active && <div key={mod} className="w-2 h-2 rounded-full bg-blue-500"></div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-blue-500 group-hover:gap-4 transition-all">
                    Abrir Workspace <ChevronRight size={14} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* VISTA 2: WORKSPACE (Configuración tipo n8n) */}
          {view === 'workspace' && activeProject && (
            <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Selector de Canales */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <ModuleToggle 
                  id="whatsapp" icon={<MessageSquare size={20}/>} title="WhatsApp Business" 
                  active={activeProject.modules.whatsapp} onToggle={() => updateModule('whatsapp')} 
                />
                <ModuleToggle 
                  id="voice" icon={<Phone size={20}/>} title="Voice AI (Vapi)" 
                  active={activeProject.modules.voice} onToggle={() => updateModule('voice')} 
                />
                <ModuleToggle 
                  id="gmail" icon={<Mail size={20}/>} title="Gmail Automation" 
                  active={activeProject.modules.gmail} onToggle={() => updateModule('gmail')} 
                />
                <ModuleToggle 
                  id="instagram" icon={<InstagramIcon size={20}/>} title="Instagram DMs" 
                  active={activeProject.modules.instagram} onToggle={() => updateModule('instagram')} 
                />
              </div>

              {/* Centro de Entrenamiento (Arquivos) */}
              <div className="bg-[#0f0f0f] border border-white/5 rounded-[40px] p-12">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-3">
                    <Database size={18} className="text-blue-500"/> Inteligencia de {activeProject.name}
                  </h3>
                  <span className="text-[10px] font-bold text-gray-600 italic">Los agentes solo aprenderán de lo que subas aquí.</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="border-2 border-dashed border-white/5 rounded-[32px] p-16 flex flex-col items-center justify-center hover:bg-white/[0.02] hover:border-blue-500/30 transition-all cursor-pointer">
                    <Paperclip size={32} className="text-gray-600 mb-4"/>
                    <p className="text-xs font-bold text-gray-500 text-center leading-relaxed uppercase tracking-widest">
                      Arrastra menús, catálogos en PDF,<br/>fotos o políticas de servicio.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="text-[10px] font-black uppercase text-gray-600 mb-4 tracking-widest">Archivos Aprendidos</div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-[11px] text-gray-400 italic">No hay archivos todavía. El agente usará su conocimiento base.</div>
                  </div>
                </div>
              </div>

              {/* Botón de Chat Integrado */}
              <div className="flex justify-center">
                <button 
                  onClick={() => setIsChatOpen(true)}
                  className="bg-[#121212] border border-white/10 px-10 py-4 rounded-full flex items-center gap-3 hover:bg-white hover:text-black transition-all group"
                >
                  <Bot size={20} className="group-hover:animate-bounce" />
                  <span className="text-xs font-black uppercase tracking-widest">Entrenar Agente con Instrucciones</span>
                </button>
              </div>
            </div>
          )}

          {/* VISTA 3: ADMIN PANEL (Ventas/Cobros) */}
          {view === 'admin' && (
            <div className="max-w-4xl mx-auto space-y-8 animate-in zoom-in-95 duration-300">
              <div className="bg-[#0f0f0f] border border-white/5 rounded-[40px] p-12 shadow-2xl">
                <h1 className="text-3xl font-black tracking-tighter mb-2 italic">ADMIN CENTER</h1>
                <p className="text-sm text-gray-500 mb-10">Control centralizado de suscripciones y acceso de clientes.</p>
                <div className="space-y-4">
                  {projects.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-6 bg-[#121212] rounded-3xl border border-white/5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-black text-xs">{p.name[0]}</div>
                        <div>
                          <div className="text-sm font-bold tracking-tight">{p.name}</div>
                          <div className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Estado: {p.status}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-10">
                        <div className="text-right">
                          <div className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Mensualidad</div>
                          <div className="text-sm font-black text-green-500 italic">$150.00</div>
                        </div>
                        <button className="bg-white text-black text-[10px] font-black px-4 py-2 rounded-full uppercase">Cortar Acceso</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CHAT MODAL (El "Cerebro") */}
        {isChatOpen && activeProject && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-6">
            <div className="bg-[#0a0a0a] w-full max-w-2xl h-[700px] rounded-[48px] border border-white/10 flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30">
                    <Bot size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.2em]">IA.ENGINE : {activeProject.name}</h3>
                    <p className="text-[10px] text-green-500 font-bold tracking-widest uppercase">Modo: Entrenamiento Profundo</p>
                  </div>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="p-3 hover:bg-white/10 rounded-full transition-colors"><X size={24}/></button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                {activeProject.memory.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-6 rounded-[32px] text-sm max-w-[85%] leading-relaxed ${
                      m.role === 'user' 
                      ? 'bg-white text-black font-medium' 
                      : 'bg-[#18181b] border border-white/5 text-gray-400'
                    }`}>
                      {m.content}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-8 bg-[#0a0a0a] border-t border-white/5 flex gap-4">
                <input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Instrucción maestra para automatizar..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-full px-8 py-5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-700"
                />
                <button onClick={sendMessage} className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #222; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #333; }
      `}</style>
    </div>
  );
}

// --- SUB-COMPONENTES AUXILIARES ---

function SideBtn({ icon, label, active = false, onClick }) {
  return (
    <button 
      onClick={onClick} 
      className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${
        active 
        ? 'bg-white text-black shadow-lg shadow-white/10' 
        : 'text-gray-500 hover:text-white hover:bg-white/5'
      }`}
    >
      {icon}
      <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block">{label}</span>
    </button>
  );
}

function ModuleToggle({ icon, title, active, onToggle }) {
  return (
    <div 
      onClick={onToggle}
      className={`p-6 rounded-[28px] border transition-all cursor-pointer select-none ${
        active 
        ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-600/20 text-white' 
        : 'bg-[#0f0f0f] border-white/5 text-gray-500 hover:border-white/20'
      }`}
    >
      <div className={`mb-4 ${active ? 'text-white' : 'text-gray-400'}`}>{icon}</div>
      <div className="text-[10px] font-black uppercase tracking-widest leading-tight">{title}</div>
      <div className="mt-2 text-[8px] font-bold uppercase tracking-tighter opacity-60">
        {active ? 'Conectado' : 'Desconectado'}
      </div>
    </div>
  );
}

function InstagramIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );
}
