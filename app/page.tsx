"use client";

import React, { useState } from 'react';
import { 
  Send, Bot, LayoutDashboard, MessageSquare, Phone, Settings, Zap, 
  Users, Paperclip, Globe, Mail, ShoppingCart, CheckCircle2, ChevronRight, X, 
  Image as ImageIcon, Plus, ArrowRight, Activity, Database, Key
} from 'lucide-react';

// COMPONENTE PRINCIPAL
export default function AgencySaaS() {
  const [view, setView] = useState('clients'); 
  const [clients, setClients] = useState([
    { id: 1, name: 'Restaurante El Sol', status: 'Activo', modules: ['whatsapp'] },
    { id: 2, name: 'Clínica Dental Quito', status: 'Pendiente', modules: [] }
  ]);
  const [activeClient, setActiveClient] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  // Crear cliente nuevo
  const handleAddClient = () => {
    const name = prompt("Nombre de la nueva empresa:");
    if (name) {
      const newClient = { id: Date.now(), name, status: 'Nuevo', modules: [] };
      setClients([...clients, newClient]);
    }
  };

  // Entrar al espacio de trabajo de un cliente
  const enterWorkspace = (client) => {
    setActiveClient(client);
    setView('workspace');
    setMessages([{ role: 'ai', content: `Estás en el taller de ${client.name}. ¿Qué canal configuramos hoy?` }]);
  };

  return (
    <div className="flex h-screen bg-[#09090b] text-white font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-20 lg:w-64 bg-[#121214] border-r border-[#27272a] flex flex-col p-6">
        <div className="flex items-center gap-2 mb-10 px-2 cursor-pointer" onClick={() => setView('clients')}>
          <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
            <Zap size={14} className="text-black" />
          </div>
          <span className="font-bold tracking-tight text-lg hidden lg:block uppercase italic">Studio IA</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          <button onClick={() => setView('clients')} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${view === 'clients' ? 'bg-[#27272a] text-white' : 'text-[#a1a1aa] hover:bg-white/5'}`}>
            <Users size={18}/> <span className="text-xs font-bold uppercase hidden lg:block">Mis Clientes</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-[#a1a1aa] hover:bg-white/5 transition-all">
            <Activity size={18}/> <span className="text-xs font-bold uppercase hidden lg:block">Estadísticas</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-[#a1a1aa] hover:bg-white/5 transition-all">
            <Key size={18}/> <span className="text-xs font-bold uppercase hidden lg:block">Credenciales</span>
          </button>
        </nav>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col bg-[#09090b]">
        <header className="h-16 border-b border-[#27272a] flex items-center justify-between px-8 bg-[#09090b]/50 backdrop-blur-xl">
          <h2 className="text-sm font-bold tracking-widest uppercase text-gray-500">
            {view === 'clients' ? 'Directorio de Negocios' : `Escritorio / ${activeClient?.name}`}
          </h2>
          <button 
            onClick={handleAddClient}
            className="bg-white text-black px-4 py-2 rounded-lg text-xs font-bold uppercase hover:bg-gray-200 transition-all flex items-center gap-2"
          >
            <Plus size={14}/> Nuevo Negocio
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          
          {/* VISTA 1: DIRECTORIO DE CLIENTES */}
          {view === 'clients' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clients.map(client => (
                <div 
                  key={client.id} 
                  onClick={() => enterWorkspace(client)}
                  className="p-6 bg-[#121214] border border-[#27272a] rounded-[24px] hover:border-blue-500/50 transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center font-bold text-xl">{client.name[0]}</div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${client.status === 'Activo' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                      {client.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-4">{client.name}</h3>
                  <button className="flex items-center gap-2 text-[10px] font-bold text-blue-500 group-hover:gap-4 transition-all uppercase tracking-widest">
                    Entrar al Taller <ArrowRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* VISTA 2: TALLER DEL CLIENTE */}
          {view === 'workspace' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ModuleBox 
                  icon={<MessageSquare className="text-green-500"/>} 
                  title="WhatsApp AI" 
                  onClick={() => setIsChatOpen(true)}
                />
                <ModuleBox 
                  icon={<Phone className="text-orange-500"/>} 
                  title="Telefonía IA" 
                  onClick={() => setIsChatOpen(true)}
                />
                <ModuleBox 
                  icon={<Mail className="text-blue-500"/>} 
                  title="Gmail AI" 
                  onClick={() => setIsChatOpen(true)}
                />
              </div>

              {/* BASE DE CONOCIMIENTO */}
              <div className="p-8 bg-[#121214] border border-[#27272a] rounded-[32px]">
                <h3 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2"><Database size={16}/> Entrenamiento del Agente</h3>
                <div className="border-2 border-dashed border-[#27272a] rounded-2xl p-10 text-center hover:bg-white/[0.02] transition-all cursor-pointer">
                  <Paperclip size={32} className="mx-auto mb-4 text-gray-600"/>
                  <p className="text-xs text-gray-500 font-medium">Sube menús, PDFs o fotos aquí para que la IA de este negocio aprenda.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CHAT DE CONFIGURACIÓN */}
        {isChatOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#09090b] w-full max-w-xl h-[550px] rounded-[32px] border border-[#27272a] flex flex-col overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-[#27272a] flex justify-between items-center bg-[#121214]">
                <div className="flex items-center gap-3">
                  <Bot size={20} className="text-blue-500" />
                  <span className="font-bold text-sm uppercase tracking-wider">{activeClient?.name}</span>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-white/5 rounded-full"><X size={20}/></button>
              </div>
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-4 rounded-2xl text-xs max-w-[80%] ${m.role === 'user' ? 'bg-white text-black font-medium' : 'bg-[#18181b] border border-[#27272a] text-[#a1a1aa]'}`}>
                      {m.content}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-[#121214] border-t border-[#27272a] flex gap-2">
                <input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Instrucciones para la IA..."
                  className="flex-1 bg-[#09090b] border border-[#27272a] rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-white/20"
                />
                <button className="p-3 bg-white text-black rounded-xl hover:bg-gray-200 transition-all"><Send size={18} /></button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function ModuleBox({ icon, title, onClick }) {
  return (
    <div className="p-6 bg-[#121214] border border-[#27272a] rounded-2xl hover:border-white/20 transition-all">
      <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center mb-4">{icon}</div>
      <h3 className="text-sm font-bold mb-4">{title}</h3>
      <button onClick={onClick} className="w-full py-2 bg-white/5 border border-[#27272a] rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all">
        Configurar Canal
      </button>
    </div>
  );
}
