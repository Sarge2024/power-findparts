import React, { useState } from 'react';
import { Part, Vehicle, TechGroup, TechSubgroup, ActivityLog, VehicleLink } from '../types';
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
  Info,
  Layers
} from 'lucide-react';

interface CatalogProps {
  parts: Part[];
  vehicles: Vehicle[];
  links: VehicleLink[];
  techGroups: TechGroup[];
  techSubgroups: TechSubgroup[];
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
  techSubgroups,
  recentLogs,
  onSelectPartForLinking,
  onNavigateToTab,
  currentVehicle,
  onSelectVehicle
}: CatalogProps) {
  const [selectedGroup, setSelectedGroup] = useState<string>("Elétrica");
  const [selectedSubgroup, setSelectedSubgroup] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [obdVoltage, setObdVoltage] = useState<number>(13.8);
  const [voltageAlert, setVoltageAlert] = useState<string>("Normal (Estável)");

  // Filters
  const filteredParts = parts.filter(part => {
    const matchesGroup = part.group === selectedGroup;
    const matchesSubgroup = selectedSubgroup ? part.subgroup === selectedSubgroup : true;
    const matchesSearch = part.number.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          part.manufacturer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGroup && matchesSubgroup && matchesSearch;
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
      {/* Vehicle Filter (Vertical) */}
      <section id="vehicle-filter" className="bg-white p-4 sm:p-6 rounded-md border border-outline-variant/15 shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2 border-b border-outline-variant/10 pb-3">
          <Wrench className="w-4 h-4 text-tertiary-fixed" /> Seleção de Frota
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-outline uppercase tracking-wider">Marca</label>
            <select 
              value={currentVehicle.brand}
              onChange={(e) => {
                const matched = vehicles.find(v => v.brand === e.target.value);
                if (matched) onSelectVehicle(matched);
              }}
              className="bg-surface-container-low text-primary text-xs sm:text-sm font-bold p-3 rounded border border-outline-variant/20 focus:ring-1 focus:ring-primary focus:outline-none"
            >
              <option value="Volkswagen">VW (Volkswagen)</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-outline uppercase tracking-wider">Modelo</label>
            <select 
              value={currentVehicle.id}
              onChange={(e) => {
                const matched = vehicles.find(v => v.id === e.target.value);
                if (matched) onSelectVehicle(matched);
              }}
              className="bg-surface-container-low text-primary text-xs sm:text-sm font-bold p-3 rounded border border-outline-variant/20 focus:ring-1 focus:ring-primary focus:outline-none"
            >
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>{v.model} ({v.modification})</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-outline uppercase tracking-wider">Ano</label>
            <select disabled className="bg-surface-container-low text-primary text-xs sm:text-sm font-bold p-3 rounded border border-outline-variant/20 opacity-80 cursor-not-allowed">
              <option>{currentVehicle.year}</option>
            </select>
          </div>
        </div>
      </section>

      {/* Category Grid (Bento Style in 2 cols) */}
      <section id="bento-categories" className="grid grid-cols-2 gap-3 sm:gap-4">
        {techGroups.map((group) => {
          const isActive = group.name === selectedGroup;
          return (
            <div
              id={`group-card-${group.id}`}
              key={group.id}
              onClick={() => {
                setSelectedGroup(group.name);
                setSelectedSubgroup(null); // Reset subgroup when changing group
              }}
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

      {/* Subgroups Selection */}
      {selectedGroup && (
        <section id="subgroups-selection" className="space-y-3">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" /> Subgrupos de {selectedGroup}
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {techSubgroups.filter(sg => {
               const g = techGroups.find(tg => tg.name === selectedGroup);
               return g && sg.groupId === g.id;
            }).map(sg => {
              const isActive = sg.name === selectedSubgroup;
              return (
                <button
                  key={sg.id}
                  onClick={() => setSelectedSubgroup(sg.name)}
                  className={`p-3 text-left rounded-md transition-all border text-xs font-bold shadow-sm flex items-center justify-between group ${
                    isActive 
                      ? "bg-primary text-on-primary border-primary" 
                      : "bg-white text-primary border-outline-variant/20 hover:border-primary/50"
                  }`}
                >
                  <span className="truncate pr-2">{sg.name}</span>
                  <ChevronRight className={`w-3 h-3 flex-shrink-0 transition-transform ${isActive ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0 group-hover:opacity-100'}`} />
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Parts Table Section - Only visible if a subgroup is selected */}
      {selectedSubgroup && (
        <section id="parts-inventory" className="space-y-4 pt-2">
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
                  <th className="px-2 py-2 md:px-5 md:py-3.5 text-[9px] font-extrabold uppercase tracking-widest text-outline">Ref</th>
                  <th className="px-2 py-2 md:px-5 md:py-3.5 text-[9px] font-extrabold uppercase tracking-widest text-outline">Marca / Tipo</th>
                  <th className="px-2 py-2 md:px-5 md:py-3.5 text-[9px] font-extrabold uppercase tracking-widest text-outline">Número da Peça</th>
                  <th className="px-2 py-2 md:px-5 md:py-3.5 text-[9px] font-extrabold uppercase tracking-widest text-outline">Descrição</th>
                  <th className="px-2 py-2 md:px-5 md:py-3.5 text-[9px] font-extrabold uppercase tracking-widest text-outline text-right">Est. Preço</th>
                  <th className="px-2 py-2 md:px-5 md:py-3.5 text-[9px] font-extrabold uppercase tracking-widest text-outline text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {filteredParts.length > 0 ? (
                  filteredParts.map((part, index) => (
                    <tr key={part.number} className="hover:bg-surface-container-low/50 transition-colors group">
                      <td className="px-2 py-3 md:px-5 md:py-4 font-headline font-bold text-primary text-[10px] md:text-xs">
                        {String(index + 1).padStart(3, '0')}
                      </td>
                      <td className="px-2 py-3 md:px-5 md:py-4">
                        <span className="text-[8px] md:text-[9px] bg-secondary-container text-on-secondary-fixed-variant px-1.5 md:px-2.5 py-0.5 md:py-1 rounded-full font-bold tracking-tight block md:inline w-max">
                          {part.extraInfo}
                        </span>
                      </td>
                      <td className="px-2 py-3 md:px-5 md:py-4 font-mono text-[9px] md:text-xs font-bold text-surface-tint tracking-tight">
                        {part.number}
                      </td>
                      <td className="px-2 py-3 md:px-5 md:py-4 min-w-[120px]">
                        <p className="text-[10px] md:text-xs font-bold text-primary line-clamp-2 md:line-clamp-none">{part.name}</p>
                        <p className="text-[8px] md:text-[10px] text-outline truncate">{part.manufacturer}</p>
                      </td>
                      <td className="px-2 py-3 md:px-5 md:py-4 text-right font-headline font-extrabold text-[10px] md:text-xs text-primary">
                        {part.priceEst}
                      </td>
                      <td className="px-2 py-3 md:px-5 md:py-4 text-center">
                        <button
                          onClick={() => onSelectPartForLinking(part)}
                          className="inline-flex items-center gap-1 bg-primary text-on-primary hover:bg-primary-container px-2 py-1.5 md:px-3.5 md:py-1.5 rounded-sm text-[9px] md:text-[10px] font-bold uppercase tracking-tight transition-all active:scale-95 duration-100 shadow-sm"
                        >
                          <span className="material-symbols-outlined text-[14px]">barcode_scanner</span>
                          <span className="hidden md:inline">Vincular Físico</span>
                          <span className="md:hidden">Vincular</span>
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
      )}

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
