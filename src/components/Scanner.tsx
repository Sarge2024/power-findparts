import React, { useState, useRef, useEffect } from 'react';
import { Part, Vehicle, VehicleLink } from '../types';
import { IMAGE_LINKS } from '../initialData';
import { 
  Camera, 
  Sparkles, 
  CheckCircle2, 
  Link, 
  Trash2, 
  Maximize2, 
  RefreshCw, 
  Car, 
  Truck,
  X,
  AlertCircle
} from 'lucide-react';

interface ScannerProps {
  parts: Part[];
  vehicles: Vehicle[];
  links: VehicleLink[];
  preSelectedPart: Part | null;
  onAddLink: (partNumber: string, vehicleId: string) => void;
  onRemoveLink: (linkId: string) => void;
  onFinalize: () => void;
  onShowToast: (message: string) => void;
}

export default function Scanner({
  parts,
  vehicles,
  links,
  preSelectedPart,
  onAddLink,
  onRemoveLink,
  onFinalize,
  onShowToast
}: ScannerProps) {
  // Active Scanned Part (defaults to pre-selected or the first part - Alternator)
  const [scannedPart, setScannedPart] = useState<Part>(preSelectedPart || parts[0]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("gol-2013");
  
  // Real Camera States
  const [useRealCamera, setUseRealCamera] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    if (preSelectedPart) {
      setScannedPart(preSelectedPart);
    }
  }, [preSelectedPart]);

  // Handle actual browser camera stream
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (useRealCamera) {
      navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      })
      .then((s) => {
        stream = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
        setCameraError(null);
      })
      .catch((err) => {
        console.error("Camera access failed:", err);
        setCameraError("Acesso à câmera negado ou indisponível. Usando simulador.");
        setUseRealCamera(false);
      });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [useRealCamera]);

  // Get active links for the currently scanned part
  const activeLinks = links.filter(l => l.partNumber === scannedPart.number);

  const handleSelectPart = (partNum: string) => {
    const found = parts.find(p => p.number === partNum);
    if (found) {
      setScannedPart(found);
    }
  };

  const handleConfirmLink = () => {
    if (!selectedVehicleId) return;
    
    // Check if already linked
    const exists = links.some(l => l.partNumber === scannedPart.number && l.vehicleId === selectedVehicleId);
    if (exists) {
      onShowToast("Esta peça já está vinculada a este veículo!");
      return;
    }

    onAddLink(scannedPart.number, selectedVehicleId);
    onShowToast("VEÍCULO VINCULADO COM SUCESSO");
  };

  // Get current selected vehicle details
  const currentVehicle = vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];

  return (
    <div id="scanner-section" className="space-y-6 max-w-lg mx-auto bg-white p-4 sm:p-5 rounded-md border border-outline-variant/10 shadow-sm">
      {/* Simulation Selector Bar */}
      <div id="simulation-bar" className="flex items-center justify-between bg-surface-container-low p-2 rounded-md border border-outline-variant/10">
        <span className="text-[9px] font-black uppercase text-outline">Simular Escaneamento</span>
        <select
          value={scannedPart.number}
          onChange={(e) => handleSelectPart(e.target.value)}
          className="text-xs bg-white text-primary border border-outline-variant/20 py-1 px-2 rounded focus:ring-0 cursor-pointer font-headline font-bold"
        >
          {parts.map(p => (
            <option key={p.number} value={p.number}>{p.name.slice(0, 30)}</option>
          ))}
        </select>
      </div>

      {/* Scanner Viewport Section */}
      <section id="scanner-viewport" className="relative h-64 sm:h-80 bg-black rounded-md overflow-hidden flex items-center justify-center shadow-inner">
        {useRealCamera ? (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-cover bg-center transition-all duration-700 opacity-85" style={{ backgroundImage: `url(${scannedPart.number.includes('025 B') ? IMAGE_LINKS.alternatorReal : IMAGE_LINKS.scannerFeed})` }}></div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-primary/30 pointer-events-none"></div>
        
        {/* Scanning laser line */}
        <div className="scanner-line"></div>

        {/* Framing Corner Brackets */}
        <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-white rounded-tl-md"></div>
        <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-white rounded-tr-md"></div>
        <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-white rounded-bl-md"></div>
        <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-white rounded-br-md"></div>

        {/* Viewport UI Overlays */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
          <div className="bg-black/60 backdrop-blur border border-white/10 px-3 py-1 rounded text-[10px] font-black text-white tracking-widest uppercase flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-error rounded-full animate-pulse"></span>
            SCANNER ATIVO
          </div>
          <button 
            onClick={() => setUseRealCamera(!useRealCamera)}
            className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-md border border-white/10 transition-colors active:scale-95"
            title="Alternar para câmera física"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-1 z-10">
          <div className="flex items-center gap-2 bg-black/55 backdrop-blur px-2.5 py-1.5 rounded w-fit border border-white/5">
            <span className="material-symbols-outlined text-xs text-tertiary-fixed font-bold">barcode_scanner</span>
            <span className="text-[10px] font-mono text-white tracking-widest uppercase">{scannedPart.number}</span>
          </div>
        </div>

        {cameraError && (
          <div className="absolute top-16 left-4 right-4 bg-error-container/95 border border-error p-2.5 rounded text-xs text-error flex items-center gap-2 z-20">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <p className="font-semibold text-[11px]">{cameraError}</p>
          </div>
        )}
      </section>

      {/* Recognized Status Ribbon */}
      <div id="status-ribbon" className="bg-[#e2f1e6] border-l-4 border-[#3ca25d] px-3.5 py-2 flex items-center justify-between rounded-r">
        <div className="flex items-center gap-2 text-[#24703c]">
          <CheckCircle2 className="w-4 h-4 fill-current" />
          <span className="font-headline text-xs font-black uppercase tracking-wider">PEÇA RECONHECIDA</span>
        </div>
        <span className="text-[9px] font-black text-[#24703c]/80 tracking-widest uppercase">OBD CONECTADO</span>
      </div>

      {/* Scanned Result Details Card */}
      <div id="scanned-card" className="bg-surface-container-low p-3.5 sm:p-4 rounded-md border border-outline-variant/15 shadow-inner">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-[9px] font-black text-outline uppercase tracking-widest">PEÇA ESCANEADA</p>
            <h2 className="font-display text-base font-extrabold text-primary leading-tight mt-1">{scannedPart.name}</h2>
          </div>
          <div className="bg-white px-2.5 py-1 rounded text-[10px] font-black text-primary border border-outline-variant/10 shadow-sm font-mono">
            {scannedPart.number}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-2.5 border-t border-outline-variant/10">
          <div>
            <span className="text-[9px] font-bold text-outline uppercase block">FABRICANTE:</span>
            <p className="text-xs font-bold text-primary mt-0.5">{scannedPart.manufacturer}</p>
          </div>
          <div>
            <span className="text-[9px] font-bold text-outline uppercase block">CÓDIGO DE INVENTÁRIO:</span>
            <p className="text-xs font-mono text-primary mt-0.5">{scannedPart.inventoryCode}</p>
          </div>
        </div>
      </div>

      {/* Linking Interface */}
      <div id="linking-panel" className="bg-primary p-4 sm:p-5 rounded-md text-on-primary space-y-3 sm:space-y-4 shadow-md relative overflow-hidden">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <Link className="w-4 h-4 text-tertiary-fixed" />
          <h3 className="font-headline text-xs font-black uppercase tracking-widest">
            VINCULAR AO VEÍCULO
          </h3>
        </div>

        <div className="space-y-3.5">
          <div className="relative">
            <select 
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              className="w-full bg-primary-container border-b-2 border-white/20 py-3 px-4 text-white font-headline font-bold text-xs rounded focus:ring-0 focus:border-tertiary-fixed transition-colors appearance-none cursor-pointer outline-none"
            >
              {vehicles.map(v => (
                <option key={v.id} value={v.id} className="text-primary bg-white">{v.brand} {v.model} ({v.year})</option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-4 top-3.5 pointer-events-none text-white/60">expand_more</span>
          </div>

          {/* Dynamic Metadata Tags */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-primary-container p-2.5 rounded border border-white/5">
              <span className="text-[8px] font-black text-tertiary-fixed/70 uppercase tracking-widest block">MARCA:</span>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <Car className="w-2.5 h-2.5 text-primary" />
                </div>
                <span className="text-[10px] font-black text-white uppercase">{currentVehicle.brand}</span>
              </div>
            </div>

            <div className="bg-primary-container p-2.5 rounded border border-white/5">
              <span className="text-[8px] font-black text-tertiary-fixed/70 uppercase tracking-widest block">ANO MODELO:</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-black text-white">{currentVehicle.year}</span>
              </div>
            </div>
          </div>

          <button 
            onClick={handleConfirmLink}
            className="w-full bg-tertiary-fixed text-on-tertiary-fixed font-headline font-black text-xs py-3.5 rounded-sm tracking-widest hover:brightness-105 active:scale-95 transition-all shadow-md uppercase"
          >
            CONFIRMAR VÍNCULO DO VEÍCULO
          </button>
        </div>
      </div>

      {/* List of Active Links of this scanned part */}
      <div id="active-links-list" className="space-y-3 pt-2">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-[10px] font-extrabold text-outline uppercase tracking-widest">VÍNCULOS ATIVOS PARA ESTA PEÇA ({activeLinks.length})</h4>
        </div>

        {activeLinks.length > 0 ? (
          <div className="space-y-2">
            {activeLinks.map((link) => {
              const linkedVehicle = vehicles.find(v => v.id === link.vehicleId);
              return (
                <div 
                  key={link.id} 
                  className="bg-surface-container-low p-2.5 sm:p-3 rounded-md flex items-center justify-between border border-outline-variant/10 hover:bg-surface-container transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center border border-outline-variant/10 shadow-sm flex-shrink-0">
                      {linkedVehicle?.model.includes('Saveiro') ? (
                        <Truck className="w-3.5 h-3.5 text-primary" />
                      ) : (
                        <Car className="w-3.5 h-3.5 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-primary">{linkedVehicle?.model} {linkedVehicle?.year} BR</p>
                      <p className="text-[9px] text-outline uppercase font-semibold">{link.group} ({link.subgroup})</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => onRemoveLink(link.id)}
                    className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 p-2 text-error hover:bg-error/10 rounded transition-all active:scale-90"
                    title="Remover Vínculo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center p-6 bg-surface-container-low rounded border border-dashed border-outline-variant/20 text-xs text-outline font-medium">
            Nenhum vínculo ativo registrado para esta peça.
          </div>
        )}
      </div>

      {/* FINALIZE REGISTRATION BUTTON */}
      <button 
        onClick={onFinalize}
        className="w-full bg-[#e6e8e9] border-2 border-dashed border-outline-variant/40 hover:border-primary/40 hover:bg-surface-container py-4 text-[10px] font-black text-on-surface-variant/70 tracking-widest hover:text-primary transition-all rounded-md uppercase"
      >
        FINALIZAR CADASTRO E VOLTAR
      </button>
    </div>
  );
}
