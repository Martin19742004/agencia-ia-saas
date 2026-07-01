"use client";
import React, { useState } from 'react';
import { 
  Send, Bot, LayoutDashboard, MessageSquare, Phone, Settings, Zap, 
  Users, Paperclip, Globe, Mail, ShoppingCart, CheckCircle2, ChevronRight, X, 
  Image as ImageIcon, Plus, ArrowRight, Activity, Database
} from 'lucide-react';

export default function AgencyPro_SaaS() {
  const [view, setView] = useState('clients'); // 'clients' | 'workspace' | 'admin'
  const [clients, setClients] = useState([
    { id: 1, name: 'Restaurante El Sol', status: 'Incompleto', modules: [] },
    { id: 2, name: 'Barbería Lux', status: 'Activo', modules: ['whatsapp'] }
  ]);
  const [activeClient, setActiveClient] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  // FUNCIÓN PARA CREAR CLIENTE NUEVO DESDE CERO
  const createNewClient = () => {
    const name = prompt("Nombre del nuevo negocio:");
    if (!name) return;
    const newClient = { id: Date.now(), name, status: 'Nuevo', modules: [] };
    setClients([...clients, newClient]);
    openWorkspace(newClient);
  };

  const openWorkspace = (client) => {
    setActiveClient(client);
    setView('workspace');
    setMessages([{ role: 'ai', content: `Hola. Estoy listo para automatizar "${client.name}". ¿Qué canal quieres configurar primero?` }]);
  };

  const startModule = (module) => {
    setActiveModule(module);
    setChatOpen(true);
    setMessages(prev => [...prev, { 
      role: 'ai', 
      content: `Iniciando configuración de ${module.toUpperCase()}. Por favor, sube los archivos necesarios (menús, precios, políticas) para que la IA aprenda.` 
    }]);
  };

  return (
    <div className="flex h-screen bg-[#050505] text-white font-sans overflow-hidden">
      
      {/* SIDEBAR MINIMALISTA */}
      <aside className="w-20 lg:w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col items-center lg:items-start p-6">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Zap size={18} className="text-white" />
          </div>
          <span className="font-black text-xl tracking-tighter hidden lg:block uppercase">Studio IA</span>
        </div>

        <nav className="flex-1 w-full space-y-2">
          <NavBtn icon={<Users size={20}/>} label="Clientes" active={view === 'clients'} onClick={() => setView('clients')} />
          <NavBtn icon={<Activity size={20}/>} label="Métricas" />
          <NavBtn icon={<Database size={20}/>} label="Base Datos" />
          <div className="pt-8 opacity-20"><hr border-white/10 /></div>
          <NavBtn icon={<Settings size={20}/>} label="Ajustes" />
        </nav>
      </aside>

      {/* ÁREA DE TRABAJO DINÁMICA */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* HEADER */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-[#050505]/50 backdrop-blur-xl">
          <div>
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">
              {view === 'clients' ? 'Directorio de Negocios' : `Workspace / ${activeClient?.name}`}
            </h2>
          </div>
          <button 
            onClick={createNewClient}
            className="bg-white text-black px-5 py-2 rounded-full text-xs font-black uppercase flex items-center gap-2 hover:bg-gray-200 transition-all"
          >
            <Plus size={16} /> Nuevo Cliente
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-10">
          
          {/* VISTA 1: LISTA DE CLIENTES (INTUITIVA) */}
          {view === 'clients' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {clients.map(client => (
                <div key={client.id} className="group bg-[#0f0f0f] border border-white/5 p-8 rounded-[32px] hover:border-blue-500/50 transition-all cursor-pointer" onClick={() => openWorkspace(client)}>
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center font-bold text-xl">{client.name[0]}</div>
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase ${client.status === 'Activo' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                      {client.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{client.name}</h3>
                  <div className="flex gap-2 mb-6">
                    {client.modules.length > 0 ? client.modules.map(m => <div className="p-1 bg-white/5 rounded-md text-blue-400"><MessageSquare size={12}/></div>) : <span className="text-xs text-gray-600 italic">Sin automatizaciones</span>}
                  </div>
                  <button className="flex items-center gap-2 text-xs font-bold text-blue-500 group-hover:gap-4 transition-all uppercase tracking-widest">
                    Entrar al Workspace <ArrowRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* VISTA 2: WORKSPACE DEL CLIENTE (TIPO n8n/DASHBOARD) */}
          {view === 'workspace' && (
            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ModuleCard 
                  title="WhatsApp Business" 
                  icon={<MessageSquare size={24} className="text-green-500"/>} 
                  desc="Automatiza chats, catálogos y ventas por WhatsApp."
                  onClick={() => startModule('whatsapp')}
                />
                <ModuleCard 
                  title="Telefonía IA (Voz)" 
                  icon={<Phone size={24} className="text-orange-500"/>} 
                  desc="Agentes que atienden llamadas como humanos."
                  onClick={() => startModule('voice')}
                />
                <ModuleCard 
                  title="Instagram / FB Messenger" 
                  icon={<Instagram size={24} className="text-pink-500"/>} 
                  desc="Respuestas automáticas en DMs y comentarios."
                  onClick={() => startModule('social')}
                />
              </div>

              <div className="bg-[#0f0f0f] border border-white/5 rounded-[40px] p-10">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><Database size={20} className="text-blue-500"/> Base de Conocimiento del Negocio</h3>
                <div className="border-2 border-dashed border-white/5 rounded-3xl p-12 text-center hover:bg-white/[0.02] cursor-pointer transition-all">
                   <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400"><Paperclip size={24}/></div>
                   <p className="text-sm font-bold text-gray-400">Suelta aquí menús, PDFs, fotos de productos o audios del dueño.</p>
                   <p className="text-[10px] text-gray-600 mt-2 uppercase tracking-widest">La IA aprenderá automáticamente de estos archivos.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CHAT DE AYUDA / CONFIGURACIÓN (SOLO CUANDO SE NECESITA) */}
        {chatOpen && (
          <div className="fixed bottom-10 right-10 w-[400px] h-[600px] bg-[#0f0f0f] border border-white/10 rounded-[40px] shadow-2xl flex flex-col overflow-hidden z-50">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"><Bot size={18}/></div>
                <span className="text-xs font-bold uppercase tracking-wider">IA Onboarding</span>
              </div>
              <button onClick={() => setChatOpen(false)} className="p-2 hover:bg-white/10 rounded-full"><X size={18}/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-4 rounded-2xl text-xs max-w-[85%] leading-relaxed ${m.role === 'user' ? 'bg-white text-black' : 'bg-[#1a1a1a] text-gray-400 border border-white/5'}`}>
                    {m.content}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 bg-[#0a0a0a] flex gap-2">
               <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe aquí..."
                className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs focus:outline-none"
               />
               <button className="p-3 bg-white text-black rounded-2xl hover:scale-105 transition-all"><Send size={18}/></button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

function NavBtn({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
      {icon}
      <span className="text-xs font-bold uppercase tracking-widest hidden lg:block">{label}</span>
    </button>
  );
}

function ModuleCard({ title, icon, desc, onClick }) {
  return (
    <div className="bg-[#0f0f0f] border border-white/5 p-8 rounded-[32px] hover:border-white/20 transition-all">
      <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6">{icon}</div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-xs text-gray-500 leading-relaxed mb-6">{desc}</p>
      <button onClick={onClick} className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white text-gray-400 hover:text-black transition-all">
        Configurar Canal
      </button>
    </div>
  );
}
