import React, { useState } from 'react';
import { Part, Vehicle, TechGroup, ActivityLog, VehicleLink } from '../types';
import { IMAGE_LINKS } from '../initialData';
import { 
  Wrench, 
  Search, 
  Bolt, 
  Activity, 
  Cpu, 
  ArrowRight, 
  RotateCcw, 
  Smartphone,
  CheckCircle2,
  Sliders,
  ChevronRight,
  Info
} from 'lucide-react';

interface CatalogProps {
  parts: Part[];
  vehicles: Vehicle[];
  links: VehicleLink[];
  techGroups: TechGroup[];
  recentLogs: ActivityLog[];
  onSelectPartForLinking: (part: Part) => void;
  onNavigateToTab: (tab: string) => void;
  currentVehicle: Vehicle;
  onSelectVehicle: (v: Vehicle) => void;
}

export default function Catalog({
  parts,
  vehicles,
  links,
  techGroups,
  recentLogs,
  onSelectPartForLinking,
  onNavigateToTab,
  currentVehicle,
  onSelectVehicle
}: CatalogProps) {
  const [selectedGroup, setSelectedGroup] = useState<string>("Elétrica");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [obdVoltage, setObdVoltage] = useState<number>(13.8);
  const [voltageAlert, setVoltageAlert] = useState<string>("Normal (Estável)");

  // Filters
  const filteredParts = parts.filter(part => {
    const matchesGroup = part.group === selectedGroup;
    const matchesSearch = part.number.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          part.manufacturer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  const handleSimulateObd = () => {
    // Simulate reading live vehicle OBD port voltage
    const baseVolt = 12.0 + Math.random() * 2.8;
    const formattedVolt = parseFloat(baseVolt.toFixed(1));
    setObdVoltage(formattedVolt);
    if (formattedVolt < 13.0) {
      setVoltageAlert("Alerta: Subtensão (Bateria Descarregando)");
    } else if (formattedVolt > 14.4) {
      setVoltageAlert("Alerta: Sobretensão (Risco ao Alternador)");
    } else {
      setVoltageAlert("Normal (Estável)");
    }
  };

  return (
    <div id="catalog-section" className="space-y-4 sm:space-y-6">
      {/* Dynamic Breadcrumbs (Industrial Precision Style) */}
      <nav id="breadcrumbs" className="bg-surface-container-low px-3 py-2 sm:px-4 sm:py-3 rounded-md flex flex-wrap items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar border border-outline-variant/10">
        <span className="text-on-surface-variant text-[9px] sm:text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
          <Wrench className="w-3 h-3 text-primary/60" /> Hierarquia
        </span>
        <div className="flex items-center gap-1 sm:gap-1.5 whitespace-nowrap">
          <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-outline" />
          <select 
            value={currentVehicle.brand}
            onChange={(e) => {
              const matched = vehicles.find(v => v.brand === e.target.value);
              if (matched) onSelectVehicle(matched);
            }}
            className="text-[11px] sm:text-xs font-headline font-extrabold text-primary bg-transparent border-none p-0 focus:ring-0 cursor-pointer hover:text-surface-tint uppercase"
          >
            <option value="Volkswagen">VW (Volkswagen)</option>
          </select>

          <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-outline" />
          <select 
            value={currentVehicle.id}
            onChange={(e) => {
              const matched = vehicles.find(v => v.id === e.target.value);
              if (matched) onSelectVehicle(matched);
            }}
            className="text-[11px] sm:text-xs font-headline font-extrabold text-primary bg-transparent border-none p-0 focus:ring-0 cursor-pointer hover:text-surface-tint uppercase"
          >
            {vehicles.map(v => (
              <option key={v.id} value={v.id}>{v.model}</option>
            ))}
          </select>

          <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-outline" />
          <span className="text-[11px] sm:text-xs font-headline font-bold text-primary">{currentVehicle.year}</span>
          
          <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-outline" />
          <span className="text-[10px] sm:text-xs font-headline font-bold text-tertiary-container bg-tertiary-fixed px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] font-black uppercase">
            {selectedGroup}
          </span>
        </div>
      </nav>

      {/* Hero Summary (Intentional Asymmetry) */}
      <section id="catalog-hero" className="relative grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-center bg-white p-4 sm:p-6 rounded-md border border-outline-variant/15 overflow-hidden shadow-sm">
        <div className="md:col-span-7 z-10 space-y-2 sm:space-y-3">
          <p className="text-[9px] sm:text-[10px] uppercase tracking-widest font-extrabold text-surface-tint">Base Técnica Sagacitas</p>
          <h2 className="font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-primary leading-tight">
            Precisão de Peças Vinculadas.
          </h2>
          <p className="text-xs text-on-surface-variant leading-relaxed max-w-xl">
            Navegue em grupos técnicos automotivos de alta densidade para o Volkswagen <span className="font-bold text-primary">{currentVehicle.model} ({currentVehicle.year})</span>. Selecione uma categoria e vincule componentes específicos da frota.
          </p>
        </div>
        <div className="hidden md:block md:col-span-5 relative h-28 sm:h-36 overflow-hidden bg-surface-container rounded-sm border-b-2 border-primary">
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <img 
              src={IMAGE_LINKS.engineBg} 
              alt="Engine Block Blueprint" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute bottom-4 right-4 text-right">
            <span className="block text-[9px] font-bold uppercase text-outline tracking-tighter">Módulo de Engenharia</span>
            <span className="text-xl font-headline font-black text-primary">VWB-SYS-903</span>
          </div>
        </div>
      </section>

      {/* Category Grid (Bento Style) */}
      <section id="bento-categories" className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
        {techGroups.map((group) => {
          const isActive = group.name === selectedGroup;
          return (
            <div
              id={`group-card-${group.id}`}
              key={group.id}
              onClick={() => setSelectedGroup(group.name)}
              className={`group relative p-3.5 sm:p-5 rounded-md transition-all cursor-pointer border hover:-translate-y-0.5 active:scale-95 duration-200 ${
                isActive 
                  ? "bg-primary text-on-primary border-primary shadow-md" 
                  : "bg-surface-container-low text-primary border-outline-variant/10 hover:bg-surface-container"
              }`}
            >
              <div className="flex justify-between items-start mb-3 sm:mb-6">
                <span className={`material-symbols-outlined text-xl sm:text-2xl ${isActive ? 'text-tertiary-fixed font-semibold' : 'text-outline'}`}>
                  {group.icon}
                </span>
                <span className={`text-[9px] font-bold uppercase tracking-widest ${isActive ? 'text-on-primary-container/80' : 'text-outline'}`}>
                  {group.groupCode}
                </span>
              </div>
              <h3 className={`font-headline font-bold text-sm sm:text-base ${isActive ? 'text-white' : 'text-primary'}`}>
                {group.name}
              </h3>
              <p className={`text-[9px] sm:text-[10px] mt-0.5 sm:mt-1 font-semibold uppercase tracking-tighter ${isActive ? 'text-tertiary-fixed' : 'text-on-surface-variant/80'}`}>
                {group.subgroupCount} Subgrupos
              </p>
              {isActive && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-tertiary-fixed rounded-b-md"></div>
              )}
            </div>
          );
        })}
      </section>

      {/* Parts Table Section */}
      <section id="parts-inventory" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h4 className="font-headline font-bold text-lg text-primary border-l-4 border-tertiary-fixed pl-3 flex items-center gap-2">
            Inventário de Peças Originais ({filteredParts.length})
          </h4>
          <div className="relative w-full sm:w-72 bg-white rounded-md border border-outline-variant/30 focus-within:border-primary transition-colors">
            <input 
              className="bg-transparent border-none text-xs py-2.5 pl-9 pr-4 w-full outline-none text-on-surface" 
              placeholder="Filtrar por Nº da Peça, Nome ou Marca..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-outline" />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")} 
                className="absolute right-3 top-2.5 text-xs text-outline hover:text-primary font-bold"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Mobile Touch-Optimized Card List */}
        <div className="block md:hidden space-y-3">
          {filteredParts.length > 0 ? (
            filteredParts.map((part, index) => (
              <div 
                key={part.number} 
                className="bg-white p-4 rounded-md border border-outline-variant/15 shadow-sm space-y-3.5"
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="text-[9px] bg-secondary-container text-on-secondary-fixed-variant px-2.5 py-1 rounded font-bold tracking-tight uppercase">
                      {part.extraInfo}
                    </span>
                    <h5 className="text-xs font-bold text-primary mt-2 font-display">
                      {part.name}
                    </h5>
                    <p className="text-[10px] text-outline">{part.manufacturer}</p>
                  </div>
                  <span className="font-headline font-extrabold text-xs text-primary bg-surface-container-low px-2 py-1 rounded whitespace-nowrap">
                    {part.priceEst}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-outline-variant/10">
                  <div className="space-y-0.5">
                    <span className="text-[8px] font-bold text-outline uppercase block tracking-wider">Código Técnico</span>
                    <span className="font-mono text-[11px] font-bold text-surface-tint tracking-tight">{part.number}</span>
                  </div>
                  <button
                    onClick={() => onSelectPartForLinking(part)}
                    className="inline-flex items-center gap-1.5 bg-primary text-on-primary hover:bg-primary-container px-4 py-2.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all active:scale-95 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[13px]">barcode_scanner</span>
                    Vincular
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-8 bg-white rounded border border-outline-variant/15 text-xs text-outline font-medium">
              <Info className="w-5 h-5 mx-auto mb-2 text-outline/60" />
              Nenhum componente encontrado na categoria "{selectedGroup}".
            </div>
          )}
        </div>

        {/* Desktop Precision Table */}
        <div className="hidden md:block overflow-hidden bg-white border border-outline-variant/15 rounded-md shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/10">
                  <th className="px-5 py-3.5 text-[9px] font-extrabold uppercase tracking-widest text-outline">Ref</th>
                  <th className="px-5 py-3.5 text-[9px] font-extrabold uppercase tracking-widest text-outline">Marca / Tipo</th>
                  <th className="px-5 py-3.5 text-[9px] font-extrabold uppercase tracking-widest text-outline">Número da Peça</th>
                  <th className="px-5 py-3.5 text-[9px] font-extrabold uppercase tracking-widest text-outline">Descrição</th>
                  <th className="px-5 py-3.5 text-[9px] font-extrabold uppercase tracking-widest text-outline text-right">Est. Preço</th>
                  <th className="px-5 py-3.5 text-[9px] font-extrabold uppercase tracking-widest text-outline text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {filteredParts.length > 0 ? (
                  filteredParts.map((part, index) => (
                    <tr key={part.number} className="hover:bg-surface-container-low/50 transition-colors group">
                      <td className="px-5 py-4 font-headline font-bold text-primary text-xs">
                        {String(index + 1).padStart(3, '0')}
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-[9px] bg-secondary-container text-on-secondary-fixed-variant px-2.5 py-1 rounded-full font-bold tracking-tight">
                          {part.extraInfo}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-mono text-xs font-bold text-surface-tint tracking-tight">
                        {part.number}
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-xs font-bold text-primary">{part.name}</p>
                        <p className="text-[10px] text-outline">{part.manufacturer}</p>
                      </td>
                      <td className="px-5 py-4 text-right font-headline font-extrabold text-xs text-primary">
                        {part.priceEst}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => onSelectPartForLinking(part)}
                          className="inline-flex items-center gap-1.5 bg-primary text-on-primary hover:bg-primary-container px-3.5 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-tight transition-all active:scale-95 duration-100 shadow-sm"
                        >
                          <span className="material-symbols-outlined text-[14px]">barcode_scanner</span>
                          Vincular Físico
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-xs text-outline font-medium">
                      <Info className="w-5 h-5 mx-auto mb-2 text-outline/60" />
                      Nenhum componente encontrado na categoria "{selectedGroup}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Diagnostic Panel & Recent Vehicles Stack */}
      <section id="diagnostics-summary" className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Tonal OBD-II Diagnostic Card */}
        <div className="lg:col-span-2 bg-[#f2f4f5] p-4 sm:p-6 rounded-md relative overflow-hidden border border-outline-variant/10">
          <div className="relative z-10 space-y-4">
            <div className="flex justify-between items-center">
              <h5 className="text-[10px] font-black uppercase tracking-widest text-primary/40">CONTEXTO DE DIAGNÓSTICO</h5>
              <button 
                onClick={handleSimulateObd}
                className="text-[9px] bg-white border border-outline-variant/20 hover:bg-surface-container px-2 py-1 rounded font-bold uppercase tracking-wider text-primary flex items-center gap-1 active:scale-95"
              >
                <RotateCcw className="w-2.5 h-2.5" /> Ler OBD-II
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2.5">
                <p className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-tighter">FAIXA DE VOLTAGEM ATUAL</p>
                <div className="flex items-end gap-1.5">
                  <span className="text-3xl sm:text-4xl font-headline font-black text-primary tracking-tight">{obdVoltage}V</span>
                  <span className="text-[11px] text-outline mb-0.5 font-medium">— 14.4V Nominal</span>
                </div>
                {/* Custom responsive voltage progress bar */}
                <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 rounded-full ${
                      obdVoltage < 13.0 ? "bg-error" : obdVoltage > 14.4 ? "bg-error" : "bg-tertiary-fixed"
                    }`}
                    style={{ width: `${Math.min(100, Math.max(10, ((obdVoltage - 10) / 5) * 100))}%` }}
                  ></div>
                </div>
                <p className={`text-[9px] sm:text-[10px] font-bold uppercase ${obdVoltage < 13.0 || obdVoltage > 14.4 ? 'text-error' : 'text-primary/60'}`}>
                  Status: {voltageAlert}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-extrabold text-on-surface-variant uppercase tracking-tighter">Sincronização</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-tertiary-fixed animate-pulse"></div>
                  <span className="text-[9px] sm:text-[10px] font-black text-primary uppercase tracking-tight">API CONECTADA - ATIVA</span>
                </div>
                <p className="text-xs text-on-surface-variant/80 italic leading-relaxed">
                  As atualizações do catálogo para a Região VWB (BR) estão sendo sincronizadas em tempo real.
                </p>
              </div>
            </div>
          </div>
          {/* Abstract background logo */}
          <div className="absolute -right-12 -bottom-12 opacity-[0.03] pointer-events-none transform rotate-12">
            <Cpu className="w-48 h-48" />
          </div>
        </div>

        {/* Recent Vehicle Associations Panel */}
        <div className="bg-[#eceeef] p-4 sm:p-6 rounded-md flex flex-col justify-between border border-outline-variant/10">
          <div>
            <h5 className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 mb-3 sm:mb-5">VÍNCULOS RECENTES</h5>
            <ul className="space-y-2">
              {recentLogs.slice(0, 3).map((log) => (
                <li 
                  key={log.id} 
                  onClick={() => onNavigateToTab('inventory')}
                  className="flex items-center justify-between group cursor-pointer hover:bg-white/40 p-2 rounded transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded bg-surface-container-highest flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-base text-primary">
                        {log.vehicleName.includes('Saveiro') ? 'local_shipping' : 'directions_car'}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-primary">{log.vehicleName}</p>
                      <p className="text-[9px] text-outline uppercase font-semibold">Cód: {log.partNumber.slice(0, 11)}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-outline group-hover:text-primary transition-colors transform group-hover:translate-x-0.5" />
                </li>
              ))}
            </ul>
          </div>
          <button 
            onClick={() => onNavigateToTab('inventory')}
            className="mt-4 border-2 border-primary text-primary px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all active:scale-95 rounded-sm"
          >
            VER LOG DE ATIVIDADE
          </button>
        </div>
      </section>
    </div>
  );
}
