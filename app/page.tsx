"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Bot, LayoutDashboard, MessageSquare, Phone, Settings, Zap, 
  Users, Paperclip, Mail, ShoppingCart, X, Plus, Activity, Database, Lock, 
  Trash2, Instagram, Cpu, Globe, Key, BarChart3, FileText, CheckCircle,
  Clock, MapPin, Share2, Calendar, CreditCard, ChevronRight, Search, Laptop
} from 'lucide-react';

export default function AgencyMasterOS() {
  // --- NAVEGACIÓN ---
  const [view, setView] = useState('dashboard'); // Secciones globales
  const [activeBizId, setActiveBizId] = useState(null); // ID del negocio seleccionado
  const [bizTab, setBizTab] = useState('info'); // Pestañas dentro del negocio
  
  // --- DATOS ---
  const [businesses, setBusinesses] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // --- CARGA INICIAL Y MEMORIA ---
  useEffect(() => {
    const saved = localStorage.getItem('agency_v6_enterprise');
    if (saved) {
      setBusinesses(JSON.parse(saved));
    } else {
      const demo = {
        id: '1',
        name: 'Clínica Dental Quito',
        category: 'Salud',
        address: 'Av. de los Shyris, Quito',
        status: 'Premium',
        agents: [
          { id: 1, name: 'Recepcionista IA', role: 'Citas', model: 'GPT-4', status: 'Active' },
          { id: 2, name: 'Ventas IA', role: 'Cierre', model: 'Llama-3', status: 'Active' }
        ],
        knowledge: { docs: 15, images: 10, links: 5, totalItems: 30 },
        messages: [{ role: 'ai', content: 'Sistema listo. ¿Qué automatización activamos hoy?' }]
      };
      setBusinesses([demo]);
    }
  }, []);

  useEffect(() => {
    if (businesses.length > 0) {
      localStorage.setItem('agency_v6_enterprise', JSON.stringify(businesses));
    }
  }, [businesses]);

  const activeBiz = businesses.find(b => b.id === activeBizId);

  // --- FUNCIONES ---
  const createNewBiz = () => {
    const name = prompt("Nombre de la Empresa:");
    if (!name) return;
    const newBiz = {
      id: Date.now().toString(),
      name,
      category: 'Servicios',
      address: '',
      status: 'Trial',
      agents: [],
      knowledge: { docs: 0, images: 0, links: 0, totalItems: 0 },
      messages: [{ role: 'ai', content: `Bienvenido. Soy el asistente de configuración para ${name}.` }]
    };
    setBusinesses([...businesses, newBiz]);
    setActiveBizId(newBiz.id);
    setView('biz_detail');
  };

  const sendMessage = async () => {
    if (!input.trim() || !activeBizId) return;
    const userMsg = { role: 'user', content: input, id: Date.now() };
    
    setBusinesses(prev => prev.map(b => 
      b.id === activeBizId ? { ...b, messages: [...b.messages, userMsg] } : b
    ));
    setInput('');
    setIsTyping(true);

    // LLAMADA IA (OpenRouter)
    try {
      const response = await fetch("<https://openrouter.ai/api/v1/chat/completions>", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "meta-llama/llama-3-8b-instruct:free",
          "messages": [
            { "role": "system", "content": `Eres el Ingeniero de IA de ${activeBiz?.name}. Responde de forma profesional.` },
            { "role": "user", "content": input }
          ]
        })
      });
      const data = await response.json();
      const aiMsg = { role: 'ai', content: data.choices[0].message.content, id: Date.now() + 1 };
      setBusinesses(prev => prev.map(b => b.id === activeBizId ? { ...b, messages: [...b.messages, aiMsg] } : b));
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex h-screen bg-[#020202] text-[#e2e8f0] font-sans overflow-hidden">
      
      {/* SIDEBAR GLOBAL (9 SECCIONES) */}
      <aside className="w-64 bg-[#080808] border-r border-white/5 flex flex-col p-6 z-50">
        <div className="flex items-center gap-3 mb-10 px-2 cursor-pointer" onClick={() => setView('dashboard')}>
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Cpu size={22} className="text-white" />
          </div>
          <span className="font-black text-xl tracking-tighter text-white">STUDIO.IA</span>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar">
          <NavBtn icon={<LayoutDashboard size={18}/>} label="Dashboard" active={view === 'dashboard'} onClick={() => setView('dashboard')} />
          <NavBtn icon={<Users size={18}/>} label="Clientes" active={view === 'clients' || view === 'biz_detail'} onClick={() => setView('clients')} />
          <NavBtn icon={<Zap size={18}/>} label="Automatizaciones" />
          <NavBtn icon={<Bot size={18}/>} label="Agentes IA" />
          <NavBtn icon={<Database size={18}/>} label="Conocimiento IA" />
          <NavBtn icon={<Globe size={18}/>} label="Integraciones" />
          <NavBtn icon={<BarChart3 size={18}/>} label="Estadísticas" />
          <div className="py-4"><hr className="border-white/5" /></div>
          <NavBtn icon={<CreditCard size={18} className="text-green-500"/>} label="Facturación" />
          <NavBtn icon={<Settings size={18}/>} label="Configuración" />
        </nav>

        <div className="mt-auto p-4 bg-white/5 rounded-2xl border border-white/5">
          <div className="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-widest">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></div> Core Online
          </div>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#0c0c0c] to-[#020202]">
        
        {/* HEADER */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 backdrop-blur-xl z-40">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">
            {view === 'dashboard' ? 'Infraestructura Global' : `Gestión / ${activeBiz?.name || 'Seleccionar'}`}
          </h2>
          <button onClick={createNewBiz} className="bg-white text-black px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">
            + Nuevo Negocio
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
          
          {/* VISTA 1: DASHBOARD / CLIENTES */}
          {(view === 'dashboard' || view === 'clients') && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {businesses.map(b => (
                <div key={b.id} onClick={() => { setActiveBizId(b.id); setView('biz_detail'); }} className="group bg-[#080808] border border-white/5 p-8 rounded-[40px] hover:border-blue-600/50 transition-all cursor-pointer relative overflow-hidden">
                  <div className="flex justify-between items-start mb-10">
                    <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center font-black text-2xl text-white uppercase shadow-xl shadow-blue-600/20">{b.name[0]}</div>
                    <span className="text-[9px] font-black bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full border border-blue-500/20 uppercase tracking-widest">{b.status}</span>
                  </div>
                  <h3 className="text-xl font-bold tracking-tight mb-2">{b.name}</h3>
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{b.category}</p>
                  <div className="flex items-center justify-between mt-10 text-[10px] font-black uppercase text-blue-500 group-hover:gap-2 transition-all">
                    Abrir Workspace <ChevronRight size={14}/>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* VISTA 2: DETALLE DEL NEGOCIO (WORKSPACE) */}
          {view === 'biz_detail' && activeBiz && (
            <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-500">
              
              {/* TABS INTERNAS */}
              <div className="flex gap-8 border-b border-white/5 pb-4">
                <SubTab label="Información" active={bizTab === 'info'} onClick={() => setBizTab('info')} />
                <SubTab label="Agentes IA" active={bizTab === 'agents'} onClick={() => setBizTab('agents')} />
                <Sub
