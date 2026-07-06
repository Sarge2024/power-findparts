import React, { useState, useEffect } from 'react';
import { Part, Vehicle, VehicleLink, ActivityLog, TechGroup, CosmosPart } from './types';
import { 
  INITIAL_PARTS, 
  INITIAL_VEHICLES, 
  INITIAL_TECH_GROUPS, 
  INITIAL_TECH_SUBGROUPS,
  INITIAL_LINKS, 
  INITIAL_LOGS 
} from './initialData';

// Component Imports
import Catalog from './components/Catalog';
import Scanner from './components/Scanner';
import Inventory from './components/Inventory';
import Profile from './components/Profile';
import AiAssistant from './components/AiAssistant';

// Icons
import { 
  Menu, 
  Search, 
  Settings, 
  Bolt, 
  Layers, 
  Camera, 
  User, 
  Sparkles,
  Smartphone,
  Expand,
  CheckCircle2,
  Minimize2
} from 'lucide-react';

export default function App() {
  // Navigation
  const [currentTab, setCurrentTab] = useState<string>("catalog"); // "catalog" | "scanner" | "inventory" | "profile" | "ai_assistant"
  
  // App View Modes
  const [viewMode, setViewMode] = useState<"mobile" | "fullscreen">("mobile");

  // Real mobile viewport detection
  const [isMobileViewport, setIsMobileViewport] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileViewport(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Core Reactive Database State (Linked to localStorage)
  const [parts, setParts] = useState<Part[]>(() => {
    const saved = localStorage.getItem("pf_parts");
    return saved ? JSON.parse(saved) : INITIAL_PARTS;
  });

  const [links, setLinks] = useState<VehicleLink[]>(() => {
    const saved = localStorage.getItem("pf_links");
    return saved ? JSON.parse(saved) : INITIAL_LINKS;
  });

  const [logs, setLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem("pf_logs");
    return saved ? JSON.parse(saved) : INITIAL_LOGS;
  });

  const [cosmosParts, setCosmosParts] = useState<CosmosPart[]>(() => {
    const saved = localStorage.getItem("pf_cosmos_parts");
    return saved ? JSON.parse(saved) : [];
  });

  // Technical variables
  const [currentVehicle, setCurrentVehicle] = useState<Vehicle>(INITIAL_VEHICLES[1]); // Voyage 2011 is default target
  const [preSelectedPart, setPreSelectedPart] = useState<Part | null>(null);

  // Toast System
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<boolean>(false);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem("pf_parts", JSON.stringify(parts));
  }, [parts]);

  useEffect(() => {
    localStorage.setItem("pf_links", JSON.stringify(links));
  }, [links]);

  useEffect(() => {
    localStorage.setItem("pf_logs", JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem("pf_cosmos_parts", JSON.stringify(cosmosParts));
  }, [cosmosParts]);

  // Toast trigger
  const triggerToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // Add a new link relation
  const handleAddLink = (partNumber: string, vehicleId: string) => {
    const matchedPart = parts.find(p => p.number === partNumber);
    const matchedVehicle = INITIAL_VEHICLES.find(v => v.id === vehicleId);

    if (!matchedPart || !matchedVehicle) return;

    const newLink: VehicleLink = {
      id: `link-${Date.now()}`,
      partNumber,
      vehicleId,
      group: matchedPart.group,
      subgroup: "903-000", // technical default electrical group code
      timestamp: new Date().toISOString()
    };

    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' }),
      partNumber,
      partName: matchedPart.name,
      vehicleName: `${matchedVehicle.model} ${matchedVehicle.year} BR`,
      action: "linked"
    };

    setLinks(prev => [newLink, ...prev]);
    setLogs(prev => [newLog, ...prev]);
  };

  // Remove an active link relation
  const handleRemoveLink = (linkId: string) => {
    const linkToRemove = links.find(l => l.id === linkId);
    if (!linkToRemove) return;

    const matchedPart = parts.find(p => p.number === linkToRemove.partNumber);
    const matchedVehicle = INITIAL_VEHICLES.find(v => v.id === linkToRemove.vehicleId);

    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' }),
      partNumber: linkToRemove.partNumber,
      partName: matchedPart?.name || "Componente",
      vehicleName: matchedVehicle ? `${matchedVehicle.model} ${matchedVehicle.year} BR` : "Veículo",
      action: "unlinked"
    };

    setLinks(prev => prev.filter(l => l.id !== linkId));
    setLogs(prev => [newLog, ...prev]);
  };

  const handleAddCosmosPart = (part: Omit<CosmosPart, 'id' | 'timestamp'>) => {
    const newCosmosPart: CosmosPart = {
      ...part,
      id: `cosmos-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    setCosmosParts(prev => [newCosmosPart, ...prev]);
    triggerToast("PEÇA DO COSMOS SALVA COM SUCESSO");
  };

  const handleRemoveCosmosPart = (id: string) => {
    setCosmosParts(prev => prev.filter(p => p.id !== id));
    triggerToast("PEÇA DO COSMOS REMOVIDA");
  };

  // Resets Database cache
  const handleResetDatabase = () => {
    setParts(INITIAL_PARTS);
    setLinks(INITIAL_LINKS);
    setLogs(INITIAL_LOGS);
    setCosmosParts([]);
    setCurrentVehicle(INITIAL_VEHICLES[1]);
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  // Flow shortcut from catalog page to scanner
  const handleSelectPartForLinking = (part: Part) => {
    setPreSelectedPart(part);
    setCurrentTab("scanner");
    triggerToast(`PARTE SELECIONADA: ${part.name.toUpperCase()}`);
  };

  // Bottom Nav Labels & Tab titles mapping
  const tabTitles: { [key: string]: string } = {
    catalog: "NAVEGAÇÃO DO CATÁLOGO",
    scanner: "ADICIONAR PEÇA VINCULADA",
    inventory: "INVENTÁRIO ATIVO",
    profile: "PERFIL CONFIGURAÇÃO",
    ai_assistant: "ASSISTENTE TÉCNICO IA"
  };

  const currentTabTitle = tabTitles[currentTab] || "POWER FIND PARTS";

  // App Layout Frame wrapping
  const renderTabContent = () => {
    switch(currentTab) {
      case "catalog":
        return (
          <Catalog 
            parts={parts}
            vehicles={INITIAL_VEHICLES}
            links={links}
            techGroups={INITIAL_TECH_GROUPS}
            techSubgroups={INITIAL_TECH_SUBGROUPS}
            recentLogs={logs}
            onSelectPartForLinking={handleSelectPartForLinking}
            onNavigateToTab={setCurrentTab}
            currentVehicle={currentVehicle}
            onSelectVehicle={setCurrentVehicle}
          />
        );
      case "scanner":
        return (
          <Scanner 
            parts={parts}
            vehicles={INITIAL_VEHICLES}
            links={links}
            preSelectedPart={preSelectedPart}
            cosmosParts={cosmosParts}
            onAddCosmosPart={handleAddCosmosPart}
            onRemoveCosmosPart={handleRemoveCosmosPart}
            onAddLink={handleAddLink}
            onRemoveLink={handleRemoveLink}
            onFinalize={() => {
              setPreSelectedPart(null);
              setCurrentTab("catalog");
              triggerToast("CADASTRO ATUALIZADO COM SUCESSO");
            }}
            onShowToast={triggerToast}
          />
        );
      case "inventory":
        return (
          <Inventory 
            parts={parts}
            vehicles={INITIAL_VEHICLES}
            links={links}
            logs={logs}
            onRemoveLink={handleRemoveLink}
            onClearLogs={handleClearLogs}
            onShowToast={triggerToast}
          />
        );
      case "profile":
        return (
          <Profile 
            userEmail="sagacitas.sistemas@gmail.com"
            onResetDatabase={handleResetDatabase}
            onShowToast={triggerToast}
            partsCount={parts.length}
            linksCount={links.length}
          />
        );
      case "ai_assistant":
        return <AiAssistant />;
      default:
        return <div>Tab not found</div>;
    }
  };

  const mainAppHtml = (
    <div id="pwa-shell" className="flex flex-col h-full bg-[#f8fafb] text-[#191c1d] font-body select-none overflow-hidden relative">
      
      {/* Top Application Bar */}
      <header id="top-bar" className="sticky top-0 z-40 bg-[#002630] text-white flex justify-between items-center px-4 h-14 shadow-md shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setCurrentTab("profile")}
            className="hover:bg-primary-container p-2 rounded transition-colors active:scale-95"
            title="Menu do Perfil"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Power Find Parts Logo" className="w-6 h-6 object-contain" />
            <h1 className="font-headline text-xs font-black tracking-wider uppercase text-left">
              {currentTabTitle}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setCurrentTab("ai_assistant")}
            className={`p-2 rounded transition-colors active:scale-95 ${currentTab === "ai_assistant" ? "bg-primary-container text-tertiary-fixed" : "hover:bg-primary-container text-white"}`}
            title="Assistente Técnico de IA"
          >
            <Sparkles className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setCurrentTab("profile")}
            className="hover:bg-primary-container p-2 rounded transition-colors active:scale-95"
            title="Configurações"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 overflow-y-auto p-4 sm:p-6 pb-24 no-scrollbar">
        {renderTabContent()}
      </main>

      {/* Floating Action Button (Only shown on Catalog view to go directly to scan) */}
      {currentTab === "catalog" && (
        <div id="floating-action" className="absolute bottom-24 right-6 z-40">
          <button 
            onClick={() => setCurrentTab("scanner")}
            className="w-14 h-14 bg-[#002630] text-white hover:bg-primary-container rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-90 border-b-4 border-tertiary-fixed cursor-pointer"
            title="Abrir Scanner"
          >
            <Camera className="w-6 h-6 text-tertiary-fixed" />
          </button>
        </div>
      )}

      {/* Persistent Bottom Mobile Navigation Bar */}
      <nav id="bottom-bar" className="absolute bottom-0 left-0 w-full bg-white border-t border-outline-variant/15 flex justify-around items-center h-20 shadow-[0_-4px_12px_rgba(0,0,0,0.03)] z-40">
        
        {/* Tab 1: Catalog */}
        <button 
          onClick={() => {
            setPreSelectedPart(null);
            setCurrentTab("catalog");
          }}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all ${
            currentTab === "catalog" 
              ? "text-primary border-t-4 border-primary font-bold bg-surface-container-low/20" 
              : "text-on-surface-variant/60 hover:text-primary"
          }`}
        >
          <Search className="w-5 h-5" />
          <span className="text-[9px] font-black uppercase mt-1 tracking-tight">Buscar</span>
        </button>

        {/* Tab 2: My Parts / Active links */}
        <button 
          onClick={() => setCurrentTab("inventory")}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all ${
            currentTab === "inventory" 
              ? "text-primary border-t-4 border-primary font-bold bg-surface-container-low/20" 
              : "text-on-surface-variant/60 hover:text-primary"
          }`}
        >
          <Layers className="w-5 h-5" />
          <span className="text-[9px] font-black uppercase mt-1 tracking-tight">Minhas Peças</span>
        </button>

        {/* Tab 3: Scanner */}
        <button 
          onClick={() => {
            setPreSelectedPart(null);
            setCurrentTab("scanner");
          }}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all ${
            currentTab === "scanner" 
              ? "text-primary border-t-4 border-primary font-bold bg-surface-container-low/20 animate-pulse" 
              : "text-on-surface-variant/60 hover:text-primary"
          }`}
        >
          <Camera className="w-5 h-5" />
          <span className="text-[9px] font-black uppercase mt-1 tracking-tight">Escanear</span>
        </button>

        {/* Tab 4: AI Assistant */}
        <button 
          onClick={() => setCurrentTab("ai_assistant")}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all ${
            currentTab === "ai_assistant" 
              ? "text-primary border-t-4 border-primary font-bold bg-surface-container-low/20" 
              : "text-on-surface-variant/60 hover:text-primary"
          }`}
        >
          <Sparkles className="w-5 h-5 text-surface-tint" />
          <span className="text-[9px] font-black uppercase mt-1 tracking-tight">Suporte IA</span>
        </button>

        {/* Tab 5: Profile */}
        <button 
          onClick={() => setCurrentTab("profile")}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all ${
            currentTab === "profile" 
              ? "text-primary border-t-4 border-primary font-bold bg-surface-container-low/20" 
              : "text-on-surface-variant/60 hover:text-primary"
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[9px] font-black uppercase mt-1 tracking-tight">Perfil</span>
        </button>
      </nav>

      {/* Global Toast Notification */}
      <div 
        id="toast-notification"
        className={`absolute bottom-24 left-1/2 -translate-x-1/2 bg-[#2e3132] text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-3 transition-all duration-500 z-50 ${
          showToast ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-16 opacity-0 scale-90 pointer-events-none'
        }`}
      >
        <CheckCircle2 className="w-4 h-4 text-tertiary-fixed fill-current" />
        <span className="text-xs font-black tracking-tight uppercase">{toastMessage}</span>
      </div>

    </div>
  );

  if (isMobileViewport) {
    return (
      <div id="pwa-mobile-root" className="w-full h-screen bg-[#f8fafb]">
        {mainAppHtml}
      </div>
    );
  }

  return (
    <div id="app-root-shell" className="min-h-screen bg-slate-900 flex flex-col items-center p-0 md:p-6 justify-center">
      
      {/* Top View Mode Control Switch Panel */}
      <div id="view-controls" className="w-full max-w-lg mb-4 bg-slate-800 text-slate-300 p-2.5 rounded-lg flex items-center justify-between shadow-lg text-xs font-medium border border-slate-700/60">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-tertiary-fixed" />
          <span className="font-bold">Power Find Parts Shell</span>
        </div>
        <div className="flex bg-slate-950 p-1 rounded">
          <button 
            onClick={() => setViewMode("mobile")}
            className={`px-3 py-1.5 rounded transition-all flex items-center gap-1 ${
              viewMode === "mobile" 
                ? "bg-slate-800 text-white font-extrabold shadow-sm" 
                : "hover:text-white"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" /> Celular
          </button>
          <button 
            onClick={() => setViewMode("fullscreen")}
            className={`px-3 py-1.5 rounded transition-all flex items-center gap-1 ${
              viewMode === "fullscreen" 
                ? "bg-slate-800 text-white font-extrabold shadow-sm" 
                : "hover:text-white"
            }`}
          >
            <Expand className="w-3.5 h-3.5" /> Tela Cheia
          </button>
        </div>
      </div>

      {/* Render Frame based on Active selection */}
      {viewMode === "mobile" ? (
        <div id="device-frame" className="relative w-[375px] h-[812px] bg-black rounded-[50px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] p-3 border-4 border-slate-700 overflow-hidden ring-12 ring-slate-800 ring-offset-4 ring-offset-slate-900">
          
          {/* Speaker, Notch, Screen sensor and camera */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-2xl z-50 flex items-center justify-center gap-1.5">
            <div className="w-12 h-1 bg-slate-800 rounded"></div>
            <div className="w-2.5 h-2.5 bg-slate-900 rounded-full border border-slate-800"></div>
          </div>

          {/* Volume rocker buttons simulated */}
          <div className="absolute left-0 top-32 w-1 h-12 bg-slate-800 rounded-r-sm -translate-x-0.5"></div>
          <div className="absolute left-0 top-48 w-1 h-12 bg-slate-800 rounded-r-sm -translate-x-0.5"></div>

          {/* Core application body */}
          <div className="w-full h-full rounded-[38px] overflow-hidden bg-white">
            {mainAppHtml}
          </div>

          {/* Safe area home bar */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-700 rounded-full z-50"></div>
        </div>
      ) : (
        <div id="fullscreen-app" className="w-full max-w-6xl h-[800px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-800/20 ring-1 ring-slate-800/10">
          {mainAppHtml}
        </div>
      )}

      {/* Subtle bottom note */}
      <p id="system-note" className="text-[10px] text-slate-500 font-medium text-center mt-4 uppercase tracking-widest leading-relaxed">
        Modo PWA Offline Ativo • Registro Seguro V4.2 • Sagacitas Consulting
      </p>

    </div>
  );
}
