import React, { useState } from 'react';
import { Part, Vehicle, VehicleLink, ActivityLog } from '../types';
import { 
  ClipboardList, 
  Trash2, 
  Search, 
  Calendar, 
  FileText, 
  Layers, 
  Info,
  Car,
  Truck,
  RotateCcw
} from 'lucide-react';

interface InventoryProps {
  parts: Part[];
  vehicles: Vehicle[];
  links: VehicleLink[];
  logs: ActivityLog[];
  onRemoveLink: (linkId: string) => void;
  onClearLogs: () => void;
  onShowToast: (message: string) => void;
}

export default function Inventory({
  parts,
  vehicles,
  links,
  logs,
  onRemoveLink,
  onClearLogs,
  onShowToast
}: InventoryProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLinks = links.filter(link => {
    const part = parts.find(p => p.number === link.partNumber);
    const vehicle = vehicles.find(v => v.id === link.vehicleId);
    
    const term = searchQuery.toLowerCase();
    return (
      (part?.name.toLowerCase().includes(term) || false) ||
      (part?.number.toLowerCase().includes(term) || false) ||
      (vehicle?.model.toLowerCase().includes(term) || false) ||
      (link.group.toLowerCase().includes(term) || false)
    );
  });

  return (
    <div id="inventory-section" className="space-y-6">
      {/* Header and Quick Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-black text-primary">Inventário Ativo & Vínculos</h2>
          <p className="text-xs text-on-surface-variant">Painel unificado de relações entre componentes físicos registrados e veículos da frota.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 border border-outline-variant/15 rounded shadow-sm text-center">
            <p className="text-[9px] font-black uppercase text-outline">Total Vínculos</p>
            <p className="text-lg font-headline font-black text-primary">{links.length}</p>
          </div>
          <div className="bg-white px-4 py-2 border border-outline-variant/15 rounded shadow-sm text-center">
            <p className="text-[9px] font-black uppercase text-outline">Peças Cadastradas</p>
            <p className="text-lg font-headline font-black text-primary">{parts.length}</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Left is Linked list, Right is Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left 2 cols: Linked list and search */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-3.5 sm:p-4 rounded-md border border-outline-variant/10 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="font-headline text-sm font-black text-primary uppercase tracking-tight flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-surface-tint" /> Relações Ativas
              </h3>

              <div className="relative w-full sm:w-60 bg-surface-container-low rounded border border-outline-variant/20 focus-within:border-primary transition-colors">
                <input 
                  className="bg-transparent border-none text-xs py-2 pl-8 pr-4 w-full outline-none text-on-surface" 
                  placeholder="Buscar relações..." 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="w-4 h-4 absolute left-2.5 top-2 text-outline" />
              </div>
            </div>

            {filteredLinks.length > 0 ? (
              <div className="divide-y divide-outline-variant/10">
                {filteredLinks.map((link) => {
                  const part = parts.find(p => p.number === link.partNumber);
                  const vehicle = vehicles.find(v => v.id === link.vehicleId);

                  return (
                    <div key={link.id} className="py-2.5 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 hover:bg-surface-container-low/30 px-2 rounded transition-colors group">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-black uppercase text-outline tracking-wider bg-surface-container px-2 py-0.5 rounded">
                            {part?.extraInfo || "OEM SPEC"}
                          </span>
                          <span className="text-xs font-mono font-black text-primary">
                            {link.partNumber}
                          </span>
                        </div>
                        <h4 className="text-xs font-black text-primary">{part?.name}</h4>
                        <p className="text-[10px] text-outline">Fabricante: {part?.manufacturer}</p>
                      </div>

                      <div className="flex items-center gap-2.5 sm:text-right">
                        <div className="w-7 h-7 rounded-full bg-primary-container/10 flex items-center justify-center flex-shrink-0">
                          {vehicle?.model.includes('Saveiro') ? (
                            <Truck className="w-3.5 h-3.5 text-primary" />
                          ) : (
                            <Car className="w-3.5 h-3.5 text-primary" />
                          )}
                        </div>
                        <div className="sm:text-right">
                          <p className="text-xs font-bold text-primary">{vehicle?.brand} {vehicle?.model}</p>
                          <p className="text-[10px] text-outline uppercase font-semibold">Grupo: {link.group} ({link.subgroup})</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-end sm:justify-start">
                        <button
                          onClick={() => {
                            onRemoveLink(link.id);
                            onShowToast("Relação removida com sucesso.");
                          }}
                          className="text-error hover:bg-error/10 p-2 rounded transition-all active:scale-90"
                          title="Excluir Relação"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center p-12 text-outline text-xs font-medium border border-dashed border-outline-variant/15 rounded">
                <Info className="w-6 h-6 mx-auto mb-2 text-outline/50" />
                Nenhum vínculo ativo encontrado.
              </div>
            )}
          </div>
        </div>

        {/* Right 1 col: Technical History logs */}
        <div className="space-y-4">
          <div className="bg-[#eceeef] p-4 sm:p-5 rounded-md border border-outline-variant/10 shadow-sm space-y-4 flex flex-col h-[320px] sm:h-[400px] lg:h-[500px]">
            <div className="flex justify-between items-center border-b border-outline-variant/20 pb-3">
              <h3 className="font-headline text-xs font-black text-primary uppercase tracking-wider flex items-center gap-1.5">
                <ClipboardList className="w-4 h-4 text-primary" /> Log de Atividades
              </h3>
              {logs.length > 0 && (
                <button
                  onClick={onClearLogs}
                  className="text-[9px] font-bold text-primary bg-white hover:bg-surface border border-outline-variant/20 px-2 py-1 rounded shadow-sm active:scale-95 transition-all flex items-center gap-1"
                >
                  <RotateCcw className="w-2.5 h-2.5" /> Limpar
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 pr-1">
              {logs.length > 0 ? (
                logs.map((log) => (
                  <div key={log.id} className="bg-white p-3 rounded shadow-sm border border-outline-variant/10 space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] text-outline font-semibold">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-2.5 h-2.5" /> Hoje, {log.timestamp}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                        log.action === 'linked' 
                          ? 'bg-tertiary-fixed text-on-tertiary-fixed' 
                          : log.action === 'unlinked'
                          ? 'bg-error-container text-on-error-container'
                          : 'bg-secondary-container text-on-secondary-fixed-variant'
                      }`}>
                        {log.action === 'linked' ? 'VINCULADO' : log.action === 'unlinked' ? 'REMOVIDO' : 'REGISTRADO'}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-primary leading-snug">
                      {log.partName} {log.action === 'linked' ? 'vinculado ao' : 'desvinculado do'} {log.vehicleName}
                    </p>
                    <p className="text-[9px] font-mono text-outline uppercase font-bold">Cód: {log.partNumber}</p>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-outline/60 text-xs py-12">
                  <FileText className="w-8 h-8 mb-2 text-outline/30" />
                  Nenhum log de atividade registrado.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
