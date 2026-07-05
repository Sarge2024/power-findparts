import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  Smartphone, 
  Database, 
  CloudLightning, 
  RefreshCw, 
  ShieldAlert,
  HardDrive,
  Grid,
  CheckCircle,
  HelpCircle,
  Wrench
} from 'lucide-react';

interface ProfileProps {
  userEmail: string;
  onResetDatabase: () => void;
  onShowToast: (message: string) => void;
  partsCount: number;
  linksCount: number;
}

export default function Profile({
  userEmail,
  onResetDatabase,
  onShowToast,
  partsCount,
  linksCount
}: ProfileProps) {
  const [offlineSimulation, setOfflineSimulation] = useState<boolean>(false);
  const [cacheSize, setCacheSize] = useState<string>("3.2 MB");

  const handleToggleOffline = () => {
    setOfflineSimulation(!offlineSimulation);
    onShowToast(!offlineSimulation ? "AMBIENTE OFFLINE SIMULADO" : "AMBIENTE ONLINE REESTABELECIDO");
  };

  const handleClearCache = () => {
    setCacheSize("0 KB");
    onShowToast("Cache do catálogo limpo com sucesso!");
  };

  const handleInstallPWA = () => {
    onShowToast("Este aplicativo já está instalado no seu dispositivo!");
  };

  return (
    <div id="profile-section" className="space-y-6 max-w-2xl mx-auto">
      {/* Profile Header */}
      <div className="bg-primary text-on-primary p-6 rounded-md shadow-md relative overflow-hidden">
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 bg-tertiary-fixed rounded-full flex items-center justify-center text-primary border-2 border-white/20 shadow-inner">
            <User className="w-7 h-7" />
          </div>
          <div>
            <h2 className="font-display text-lg font-black tracking-tight">Sagacitas Consulting</h2>
            <p className="text-xs text-tertiary-fixed font-semibold uppercase tracking-wider">{userEmail}</p>
            <p className="text-[10px] text-white/60 font-medium">Nível: Administrador de Sistemas</p>
          </div>
        </div>
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
          <Settings className="w-32 h-32 rotate-12" />
        </div>
      </div>

      {/* Main Grid options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PWA Settings */}
        <div className="bg-white p-5 rounded-md border border-outline-variant/10 shadow-sm space-y-4">
          <h3 className="font-headline text-xs font-black text-primary uppercase tracking-wider flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-surface-tint" /> Configurações do PWA Mobile
          </h3>

          <div className="space-y-3.5 pt-2">
            <div className="flex items-center justify-between p-3 bg-surface-container-low rounded">
              <div>
                <p className="text-xs font-bold text-primary">Simular Modo Offline</p>
                <p className="text-[10px] text-outline">Simula corte de rede para testar offline-first.</p>
              </div>
              <button 
                onClick={handleToggleOffline}
                className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 outline-none ${
                  offlineSimulation ? 'bg-[#4CAF50]' : 'bg-outline/30'
                }`}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-200 ${
                  offlineSimulation ? 'translate-x-5' : 'translate-x-0'
                }`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-surface-container-low rounded">
              <div>
                <p className="text-xs font-bold text-primary">Status de Instalação</p>
                <p className="text-[10px] text-outline">PWA configurado na área de trabalho.</p>
              </div>
              <span className="text-[9px] font-black uppercase text-[#24703c] bg-[#e2f1e6] px-2.5 py-1 rounded flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Instalado
              </span>
            </div>

            <button 
              onClick={handleInstallPWA}
              className="w-full bg-primary text-on-primary hover:bg-primary-container text-xs font-black uppercase tracking-widest py-3 rounded-sm active:scale-95 transition-all"
            >
              Forçar Reinstalação PWA
            </button>
          </div>
        </div>

        {/* Database & Storage */}
        <div className="bg-white p-5 rounded-md border border-outline-variant/10 shadow-sm space-y-4">
          <h3 className="font-headline text-xs font-black text-primary uppercase tracking-wider flex items-center gap-1.5">
            <Database className="w-4 h-4 text-surface-tint" /> Armazenamento Local & Cache
          </h3>

          <div className="space-y-3.5 pt-2">
            <div className="flex items-center justify-between p-3 bg-surface-container-low rounded">
              <div>
                <p className="text-xs font-bold text-primary">Dados em Cache Local</p>
                <p className="text-[10px] text-outline">{partsCount} peças e {linksCount} vínculos salvos.</p>
              </div>
              <span className="font-mono text-xs font-black text-primary">{cacheSize}</span>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={handleClearCache}
                className="flex-1 border border-outline-variant/30 hover:bg-surface-container-low text-primary text-[10px] font-black uppercase tracking-wider py-3 rounded-sm active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <HardDrive className="w-3.5 h-3.5" /> Limpar Cache
              </button>
              
              <button 
                onClick={() => {
                  onResetDatabase();
                  onShowToast("Banco de dados redefinido com sucesso.");
                }}
                className="flex-1 border border-error/30 hover:bg-error/5 text-error text-[10px] font-black uppercase tracking-wider py-3 rounded-sm active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Redefinir Banco
              </button>
            </div>

            <div className="p-3 bg-error-container/40 border border-error-container text-error rounded flex gap-2">
              <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <p className="text-[10px] leading-relaxed font-semibold">
                <strong>Nota:</strong> Como um aplicativo PWA offline-first, todos os seus dados permanecem sincronizados localmente no seu navegador através do localStorage até uma nova sincronização com o banco central.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Industrial Documentation Credits */}
      <div className="bg-surface-container-low p-5 rounded-md border border-outline-variant/10 text-center space-y-2">
        <Wrench className="w-6 h-6 mx-auto text-primary/40" />
        <p className="text-xs font-bold text-primary uppercase tracking-wider">Projeto Power Find Parts v4.2</p>
        <p className="text-[11px] text-on-surface-variant max-w-md mx-auto">
          Desenvolvido por Sagacitas Consulting. Engenharia de alta confiabilidade para sistemas industriais automotivos e diagnósticos de frota Volkswagen.
        </p>
      </div>
    </div>
  );
}
