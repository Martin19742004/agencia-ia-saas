"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Bot, LayoutDashboard, MessageSquare, Phone, Settings, Zap, 
  Users, Paperclip, Mail, ShoppingCart, X, Plus, Activity, Database, Lock, 
  Trash2, Instagram, Cpu, Globe, Key, BarChart3, FileText, CheckCircle,
  Clock, MapPin, link, Share2, Calendar, CreditCard, ChevronDown, Layers, Search
} from 'lucide-react';

export default function EnterpriseAIOS() {
  // --- NAVEGACIÓN GLOBAL ---
  const [activeTab, setActiveTab] = useState('dashboard'); // Secciones de la Agencia
  const [view, setView] = useState('clients'); // 'clients' | 'workspace'
  const [activeProject, setActiveProject] = useState(null);
  
  // --- SUB-SECCIONES DENTRO DE UN NEGOCIO ---
  const [wsTab, setWsTab] = useState('info'); 

  // --- DATOS Y PERSISTENCIA ---
  const [projects, setProjects] = useState([]);
  
  useEffect(() => {
    const saved = localStorage.getItem('agency_enterprise_v6');
    if (saved) setProjects(JSON.parse(saved));
    else setProjects([
      { 
        id: '1', 
        name: 'Clínica Dental Quito', 
        category: 'Salud',
        status: 'Activo',
        info: { tel: '099999999', address: 'Av. Amazonas, Quito', web: 'www.dentalquito.com' },
        agents: [
          { name: 'Recepcionista IA', role: 'Citas', status: 'Online' },
          { name: 'Ventas IA', role: 'Promociones', status: 'Online' }
        ],
        knowledge: { docs: 12, images: 45, links: 120, status: '98% Indexado' },
        channels: ['whatsapp', 'instagram', 'voice'],
        messages: []
      }
    ]);
  }, []);

  useEffect(() => {
    localStorage.setItem('agency_enterprise_v6', JSON.stringify(projects));
  }, [projects]);

  // --- LÓGICA DE NEGOCIO ---
  const createNewProject = () => {
    const name = prompt("Nombre de la Empresa:");
    if (!name) return;
    const newP = { 
      id: Date.now().toString(), 
      name, 
      category: 'Servicios',
      status: 'Incompleto',
      info: { tel: '', address: '', web: '' },
      agents: [],
      knowledge: { docs: 0, images: 0, links: 0, status: '0%' },
      channels: [],
      messages: []
    };
    setProjects([...projects, newP]);
    setActiveProject(newP);
    setView('workspace');
  };

  return (
    <div className="flex h-screen bg-[#020202] text-[#e5e7eb] font-sans selection:bg-blue-500/30">
      
      {/* SIDEBAR MAESTRA (9 SECCIONES) */}
      <aside className="w-64 bg-[#080808] border-r border-white/5 flex flex-col z-50">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
            <Cpu size={22} className="text-white" />
          </div>
          <span className="font-black text-xl tracking-tighter text-white uppercase italic">STUDIO.IA</span>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <NavBtn icon={<LayoutDashboard size={18}/>} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => {setActiveTab('dashboard'); setView('clients');}} />
          <NavBtn icon={<Users size={18}/>} label="Clientes" active={activeTab === 'clients'} onClick={() => {setActiveTab('clients'); setView('clients');}} />
          <NavBtn icon={<Zap size={18}/>} label="Automatizaciones" active={activeTab === 'flows'} onClick={() => setActiveTab('stats')} />
          <NavBtn icon={<Bot size={18}/>} label="Agentes IA" active={activeTab === 'agents'} onClick={() => setActiveTab('agents')} />
          <NavBtn icon={<Database size={18}/>} label="Conocimiento IA" active={activeTab === 'knowledge'} onClick={() => setActiveTab('knowledge')} />
          <NavBtn icon={<Globe size={18}/>} label="Integraciones" />
          <NavBtn icon={<BarChart3 size={18}/>} label="Estadísticas" active={activeTab === 'stats'} onClick={() => setActiveTab('stats')} />
          <div className="py-4 opacity-10"><hr border-white/10 /></div>
          <NavBtn icon={<CreditCard size={18} className="text-green-500"/>} label="Facturación" />
          <NavBtn icon={<Settings size={18}/>} label="Configuración" />
        </nav>

        <div className="p-6 mt-auto">
           <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <div className="flex items-center gap-2 text-[10px] font-black text-green-500 uppercase animate-pulse">
                ● SISTEMA NÚCLEO ACTIVO
              </div>
           </div>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL DINÁMICO */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* HEADER DE ACCIÓN */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-[#020202]/80 backdrop-blur-xl z-40">
          <div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">
              {view === 'clients' ? 'Infraestructura de Clientes' : `Gestión / ${activeProject?.name}`}
            </h2>
          </div>
          <div className="flex gap-4">
            <button onClick={createNewProject} className="bg-white text-black px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">
              + Registrar Negocio
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-12 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#0a0a0a] to-[#020202]">
          
          {/* VISTA 1: LISTA DE CLIENTES (GRID) */}
          {view === 'clients' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map(p => (
                <div key={p.id} onClick={() => { setActiveProject(p); setView('workspace'); }} className="group bg-[#080808] border border-white/5 p-8 rounded-[40px] hover:border-blue-600/50 transition-all cursor-pointer relative overflow-hidden">
                  <div className="flex justify-between items-start mb-10">
                    <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-xl shadow-blue-600/20">{p.name[0]}</div>
                    <span className="text-[9px] font-black bg-white/5 px-3 py-1 rounded-full uppercase text-blue-400 border border-blue-500/20">{p.status}</span>
                  </div>
                  <h3 className="text-xl font-bold tracking-tight mb-2">{p.name}</h3>
                  <div className="flex gap-2 mb-8 opacity-40">
                    <MessageSquare size={14}/> <Phone size={14}/> <Instagram size={14}/>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                     <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Abrir Ecosistema</span>
                     <ArrowRight size={16} className="text-blue-500 group-hover:translate-x-2 transition-transform"/>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* VISTA 2: WORKSPACE (EL CORAZÓN DEL NEGOCIO) */}
          {view === 'workspace' && activeProject && (
            <div className="max-w-6xl mx-auto space-y-12">
               {/* SUB-NAVEGACIÓN INTERNA */}
               <div className="flex gap-8 border-b border-white/5 pb-4">
                  <SubNavBtn label="Información" active={wsTab === 'info'} onClick={() => setWsTab('info')} />
                  <SubNavBtn label="Agentes IA" active={wsTab === 'agents'} onClick={() => setWsTab('agents')} />
                  <SubNavBtn label="Canales" active={wsTab === 'channels'} onClick={() => setWsTab('channels')} />
                  <SubNavBtn label="Entrenamiento" active={wsTab === 'training'} onClick={() => setWsTab('training')} />
                  <SubNavBtn label="Automatización" active={wsTab === 'automation'} onClick={() => setWsTab('automation')} />
               </div>

               {/* SECCIÓN 1: INFORMACIÓN */}
               {wsTab === 'info' && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
                    <div className="bg-[#080808] border border-white/5 p-10 rounded-[40px] space-y-6">
                       <h3 className="text-xs font-black uppercase tracking-widest text-blue-500 mb-6">Detalles de Empresa</h3>
                       <InfoField label="Nombre" value={activeProject.name} />
                       <InfoField label="Categoría" value={activeProject.category} />
                       <InfoField label="Horario" value="08:00 AM - 18:00 PM" />
                       <InfoField label="Dirección" value={activeProject.info.address} />
                       <InfoField label="WhatsApp" value={activeProject.info.tel} />
                    </div>
                    <div className="bg-[#080808] border border-white/5 p-10 rounded-[40px]">
                       <h3 className="text-xs font-black uppercase tracking-widest text-blue-500 mb-6">Ubicación Geo-espacial</h3>
                       <div className="aspect-video bg-white/5 rounded-3xl flex items-center justify-center border border-white/5">
                          <MapPin size={40} className="text-gray-700 animate-bounce" />
                       </div>
                    </div>
                 </div>
               )}

               {/* SECCIÓN 2: AGENTES IA (MULTIPLE) */}
               {wsTab === 'agents' && (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in zoom-in-95 duration-500">
                    {activeProject.agents.map((agent, i) => (
                      <div key={i} className="bg-[#0a0a0a] border border-white/5 p-8 rounded-[32px] hover:border-blue-500/30 transition-all">
                         <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 text-blue-500"><Bot size={24}/></div>
                         <h4 className="text-lg font-bold mb-1">{agent.name}</h4>
                         <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6">Función: {agent.role}</p>
                         <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-green-500 px-3 py-1 bg-green-500/10 rounded-full">{agent.status}</span>
                            <Settings size={16} className="text-gray-600 hover:text-white cursor-pointer" />
                         </div>
                      </div>
                    ))}
                    <div className="border-2 border-dashed border-white/5 p-8 rounded-[32px] flex flex-col items-center justify-center text-gray-600 hover:border-blue-500/50 hover:text-blue-500 transition-all cursor-pointer">
                       <Plus size={32} className="mb-4"/>
                       <span className="text-[10px] font-black uppercase tracking-widest">Crear Agente Nuevo</span>
                    </div>
                 </div>
               )}

               {/* SECCIÓN 4: ENTRENAMIENTO (CONOCIMIENTO IA) */}
               {wsTab === 'training' && (
                 <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
                    <div className="grid grid-cols-4 gap-4">
                       <KpiCard label="Documentos" value={activeProject.knowledge.docs} icon={<FileText className="text-blue-500"/>} />
                       <KpiCard label="Imágenes (OCR)" value={activeProject.knowledge.images} icon={<ImageIcon className="text-purple-500"/>} />
                       <KpiCard label="Links Web" value={activeProject.knowledge.links} icon={<Globe className="text-green-500"/>} />
                       <KpiCard label="Indexación" value={activeProject.knowledge.status} icon={<Zap className="text-yellow-500"/>} />
                    </div>
                    
                    <div className="bg-[#080808] border border-white/5 rounded-[40px] p-20 text-center relative overflow-hidden group">
                       <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                       <Paperclip size={48} className="mx-auto mb-6 text-gray-700 group-hover:text-blue-500 transition-colors" />
                       <h3 className="text-xl font-bold mb-2">Ingesta de Datos Maestro</h3>
                       <p className="text-sm text-gray-500 max-w-md mx-auto mb-10 tracking-tight">Sube PDF, Excel, Word, imágenes de menús o listas de precios. Nuestra IA extraerá cada dato mediante OCR y análisis semántico.</p>
                       <div className="flex gap-4 justify-center">
                          <button className="bg-white text-black px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">Subir Archivos</button>
                          <button className="bg-white/5 border border-white/10 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Pegar URL Web</button>
                       </div>
                    </div>
                 </div>
               )}

               {/* SECCIÓN 5: AUTOMATIZACIÓN (VISUAL) */}
               {wsTab === 'automation' && (
                 <div className="bg-[#080808] border border-white/5 rounded-[40px] p-12 animate-in fade-in duration-700">
                    <div className="flex justify-between items-center mb-12">
                       <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-3"><Zap size={18} className="text-yellow-500"/> Constructor de Flujos Visuales</h3>
                       <button className="text-[10px] font-black bg-blue-600 px-4 py-2 rounded-lg uppercase">+ Nodo</button>
                    </div>
                    <div className="flex flex-col items-center gap-6 py-10 opacity-60">
                       <FlowNode icon={<MessageSquare/>} label="CLIENTE ESCRIBE" />
                       <div className="w-0.5 h-10 bg-gradient-to-b from-blue-500 to-transparent"></div>
                       <FlowNode icon={<Bot/>} label="IA DETECTA INTENCIÓN" color="bg-blue-600" />
                       <div className="w-0.5 h-10 bg-gradient-to-b from-blue-500 to-transparent"></div>
                       <FlowNode icon={<Database/>} label="CONSULTA BASE DATOS" />
                       <div className="w-0.5 h-10 bg-gradient-to-b from-blue-500 to-transparent"></div>
                       <FlowNode icon={<CheckCircle/>} label="EJECUTA ACCIÓN" color="bg-green-600" />
                    </div>
                 </div>
               )}
            </div>
          )}
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #222; border-radius: 10px; }
      `}</style>
    </div>
  );
}

// --- SUB-COMPONENTES AUXILIARES ---
function NavBtn({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${active ? 'bg-white text-black shadow-xl shadow-white/10' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
      {icon} <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block">{label}</span>
    </button>
  );
}

function SubNavBtn({ label, active, onClick }) {
  return (
    <button onClick={onClick} className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${active ? 'text-white border-blue-500' : 'text-gray-600 border-transparent hover:text-gray-400'}`}>
      {label}
    </button>
  );
}

function InfoField({ label, value }) {
  return (
    <div>
      <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">{label}</p>
      <div className="p-4 bg-white/5 border border-white/5 rounded-2xl text-xs font-bold text-gray-300">{value || '---'}</div>
    </div>
  );
}

function KpiCard({ label, value, icon }) {
  return (
    <div className="bg-[#080808] border border-white/5 p-6 rounded-[28px]">
       <div className="mb-4">{icon}</div>
       <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">{label}</p>
       <h2 className="text-2xl font-black text-white tracking-tighter">{value}</h2>
    </div>
  );
}

function FlowNode({ icon, label, color = "bg-[#121212]" }) {
  return (
    <div className={`${color} border border-white/10 px-8 py-4 rounded-full flex items-center gap-4 shadow-2xl`}>
       {icon} <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </div>
  );
}

function ImageIcon({ size, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}
