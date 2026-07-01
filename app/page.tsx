
      "use client";
import React, { useState } from 'react';
import { 
  Send, Bot, LayoutDashboard, MessageSquare, Phone, Settings, Zap, 
  Users, Paperclip, Globe, Mail, ShoppingCart, CheckCircle2, ChevronRight, X, 
  Image as ImageIcon, Calendar, Facebook, Instagram, ShieldCheck, BarChart3, Lock
} from 'lucide-react';

export default function AI_Agency_SaaS() {
  const [view, setView] = useState('dashboard');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState({ id: 1, nombre: 'Restaurante El Sol', plan: 'Gratis' });
  const [messages, setMessages] = useState([
    { role: 'ai', content: '¡Hola! Soy tu consultor de IA. ¿Qué negocio vamos a automatizar hoy?' }
  ]);
  const [input, setInput] = useState('');

  const modules = [
    { id: 'whatsapp', name: 'WhatsApp Business IA', icon: <MessageSquare size={20} className="text-green-500" />, desc: 'Respuestas automáticas, catálogos y cierre de ventas.' },
    { id: 'voice', name: 'Telefonía IA (Voz)', icon: <Phone size={20} className="text-orange-500" />, desc: 'Atención de llamadas 24/7 con voz humana.' },
    { id: 'gmail', name: 'Gmail/Outlook IA', icon: <Mail size={20} className="text-blue-500" />, desc: 'Gestión de correos, cotizaciones y seguimientos.' },
    { id: 'social', name: 'Social Media AI', icon: <Facebook size={20} className="text-pink-500" />, desc: 'Auto-reply en Instagram, FB, TikTok y X.' },
    { id: 'ecommerce', name: 'E-commerce Agent', icon: <ShoppingCart size={20} className="text-purple-500" />, desc: 'Recuperación de carritos y soporte en Shopify/Woo.' },
    { id: 'booking', name: 'Sistema de Reservas', icon: <Calendar size={20} className="text-red-500" />, desc: 'Sincronización con Google Calendar y citas.' },
  ];

  const startSetup = (moduleName) => {
    setIsChatOpen(true);
    setMessages([...messages, { role: 'ai', content: `Excelente elección. Vamos a configurar ${moduleName} para ${selectedClient.nombre}. Primero, sube fotos del catálogo o cuéntame qué servicios ofrece el cliente.` }]);
  };

  return (
    <div className="flex h-screen bg-[#09090b] text-white font-sans overflow-hidden">
      <aside className="w-64 bg-[#121214] border-r border-[#27272a] flex flex-col p-6">
        <div className="flex items-center gap-2 mb-10 px-2 cursor-pointer" onClick={() => setView('dashboard')}>
          <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
            <Zap size={14} className="text-black" />
          </div>
          <span className="font-bold tracking-tight text-lg italic">AI Studio OS</span>
        </div>
        <nav className="flex-1 space-y-1">
          <div onClick={() => setView('dashboard')} className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer ${view === 'dashboard' ? 'bg-[#27272a] text-white' : 'text-[#a1a1aa] hover:text-white'}`}>
            <LayoutDashboard size={18}/> <span className="text-[11px] font-bold uppercase tracking-wider">Dashboard</span>
          </div>
          <div onClick={() => setView('admin')} className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer ${view === 'admin' ? 'bg-[#27272a] text-white' : 'text-[#a1a1aa] hover:text-white'}`}>
            <Lock size={18} className="text-yellow-500"/> <span className="text-[11px] font-bold uppercase tracking-wider">Panel Admin</span>
          </div>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col bg-[#09090b] relative">
        <header className="h-16 border-b border-[#27272a] flex items-center justify-between px-8 bg-[#09090b]/50 backdrop-blur-xl">
          <h2 className="text-sm font-medium italic">{view === 'admin' ? 'Gestión de Ventas' : 'Centro de Comando IA'}</h2>
        </header>

        {view === 'dashboard' && (
          <div className="flex-1 overflow-y-auto p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((m) => (
                <div key={m.id} className="p-6 rounded-2xl bg-[#121214] border border-[#27272a] hover:border-white/20 transition-all">
                  <div className="p-3 bg-[#1c1c1f] rounded-xl w-fit mb-4">{m.icon}</div>
                  <h3 className="text-sm font-bold mb-2">{m.name}</h3>
                  <p className="text-xs text-[#71717a] leading-relaxed mb-4">{m.desc}</p>
                  <button 
                    onClick={() => startSetup(m.name)}
                    className="w-full bg-blue-600 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-blue-500 transition-colors"
                  >
                    Configurar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'admin' && (
          <div className="flex-1 p-12 max-w-5xl mx-auto w-full">
            <div className="bg-[#121214] border border-[#27272a] rounded-3xl p-8 shadow-2xl">
              <h1 className="text-2xl font-bold mb-4">Panel Maestro de Clientes</h1>
              <p className="text-sm text-[#71717a] mb-8">Administra tus clientes y sus pagos de forma centralizada.</p>
              <div className="space-y-4">
                <div className="p-4 bg-[#18181b] rounded-xl border border-[#27272a] flex justify-between items-center">
                  <span className="font-bold text-sm">Clínica Dental Quito</span>
                  <span className="text-[10px] bg-green-500/10 text-green-500 px-3 py-1 rounded-full border border-green-500/20 font-bold uppercase">Activo</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BOTÓN FLOTANTE DE CHAT */}
        <button 
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-white text-black rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-40"
        >
          <Bot size={24} />
        </button>

        {/* VENTANA DE CHAT */}
        {isChatOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#09090b] w-full max-w-2xl h-[600px] rounded-3xl border border-[#27272a] flex flex-col overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-[#27272a] flex justify-between items-center bg-[#121214]">
                <div className="flex items-center gap-3">
                  <Bot size={20} className="text-blue-500" />
                  <span className="font-bold text-sm">IA Core - {selectedClient.nombre}</span>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-white/5 rounded-lg text-[#52525b] hover:text-white"><X size={20}/></button>
              </div>
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-4 rounded-2xl text-sm max-w-[80%] ${m.role === 'user' ? 'bg-white text-black' : 'bg-[#18181b] border border-[#27272a] text-[#a1a1aa]'}`}>
                      {m.content}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-[#121214] border-t border-[#27272a] flex gap-3">
                <button className="p-3 bg-[#1c1c1f] border border-[#27272a] rounded-xl hover:bg-[#27272a]"><Paperclip size={20} className="text-[#a1a1aa]"/></button>
                <input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escribe instrucciones para la IA..."
                  className="flex-1 bg-[#1c1c1f] border border-[#27272a] rounded-xl px-4 py-3 text-sm focus:outline-none"
                />
                <button className="p-3 bg-white text-black rounded-xl hover:bg-gray-200 transition-all"><Send size={20} /></button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
