import React from 'react';
import { Droplets, Sprout, Moon, AlertCircle } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { gameInstance } from '@/game/FungiGame';

interface UIOverlayProps {
  resources: {
    water: number;
    nutrients: number;
    darkness: number;
  };
  currentWant: string;
}

export function UIOverlay({ resources, currentWant }: UIOverlayProps) {
  
  const handleAction = (type: 'water' | 'nutrients' | 'darkness') => {
    gameInstance.addResource(type, 20);
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
      
      {/* Header / Status */}
      <header className="flex justify-between items-start">
        <div className="bg-black/60 backdrop-blur-md border border-white/10 p-4 rounded-lg max-w-md w-full pointer-events-auto">
          <h1 className="text-xl font-bold font-mono text-white mb-4 flex items-center gap-2">
            <Sprout className="w-5 h-5 text-primary" />
            MYCELIAL_SYMBIONT_V1
          </h1>

          <div className="space-y-4">
            <ResourceBar 
              label="WATER_LEVEL" 
              value={resources.water} 
              color="bg-cyan-500" 
              icon={<Droplets className="w-4 h-4 text-cyan-400" />} 
            />
            <ResourceBar 
              label="NUTRIENT_DENSITY" 
              value={resources.nutrients} 
              color="bg-green-500" 
              icon={<Sprout className="w-4 h-4 text-green-400" />} 
            />
            <ResourceBar 
              label="AMBIENT_DARKNESS" 
              value={resources.darkness} 
              color="bg-purple-500" 
              icon={<Moon className="w-4 h-4 text-purple-400" />} 
            />
          </div>
        </div>

        <div className="bg-black/60 backdrop-blur-md border border-white/10 p-4 rounded-lg pointer-events-auto">
          <div className="text-xs text-muted-foreground font-mono mb-1">ORGANISM_STATE</div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-green-400 font-mono">GROWING</span>
          </div>
        </div>
      </header>

      {/* Bottom Controls */}
      <footer className="flex flex-col items-center gap-6 pb-8">
        
        {/* Current Demand */}
        <div className="bg-black/80 backdrop-blur-xl border border-yellow-500/30 px-6 py-3 rounded-full flex items-center gap-3 animate-pulse">
          <AlertCircle className="w-5 h-5 text-yellow-500" />
          <span className="text-yellow-500 font-mono font-bold tracking-widest">
            ORGANISM REQUIRES: {currentWant.toUpperCase()}
          </span>
        </div>

        {/* Action Bar */}
        <div className="flex gap-4 pointer-events-auto">
          <ActionButton 
            label="MIST" 
            sub="Add Water" 
            onClick={() => handleAction('water')} 
            icon={<Droplets className="w-6 h-6" />}
            color="hover:bg-cyan-950 hover:border-cyan-500/50 text-cyan-400"
          />
          <ActionButton 
            label="FEED" 
            sub="Add Nutrients" 
            onClick={() => handleAction('nutrients')} 
            icon={<Sprout className="w-6 h-6" />}
            color="hover:bg-green-950 hover:border-green-500/50 text-green-400"
          />
          <ActionButton 
            label="SHADE" 
            sub="Increase Darkness" 
            onClick={() => handleAction('darkness')} 
            icon={<Moon className="w-6 h-6" />}
            color="hover:bg-purple-950 hover:border-purple-500/50 text-purple-400"
          />
        </div>
      </footer>
    </div>
  );
}

function ResourceBar({ label, value, color, icon }: { label: string, value: number, color: string, icon: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs font-mono text-muted-foreground">
        <span className="flex items-center gap-2">{icon} {label}</span>
        <span>{Math.round(value)}%</span>
      </div>
      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-500 ease-out`} 
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function ActionButton({ label, sub, onClick, icon, color }: any) {
  return (
    <button 
      onClick={onClick}
      className={`
        group flex flex-col items-center justify-center w-24 h-24 
        bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl
        transition-all duration-200 active:scale-95
        ${color}
      `}
    >
      <div className="mb-2 group-hover:scale-110 transition-transform">{icon}</div>
      <span className="text-xs font-bold font-mono">{label}</span>
      <span className="text-[10px] text-white/40 font-mono mt-0.5">{sub}</span>
    </button>
  );
}
