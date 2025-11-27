import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { FungiScene } from "../components/FungiScene";
import { UIOverlay } from "../components/UIOverlay";
import { gameInstance } from "../game/FungiGame";

export default function Home() {
  const [resources, setResources] = useState({ ...gameInstance.resources });
  const [currentWant, setCurrentWant] = useState(gameInstance.currentWant);

  const handleUpdate = (newResources: any, newWant: string) => {
    setResources(newResources);
    setCurrentWant(newWant);
  };

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
      {/* 3D Layer */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [5, 5, 5], fov: 45 }}>
          <color attach="background" args={['#050505']} />
          <fog attach="fog" args={['#050505', 5, 30]} />
          
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          
          <FungiScene onUpdate={handleUpdate} />
          
          <OrbitControls 
            maxPolarAngle={Math.PI / 2} 
            minDistance={2}
            maxDistance={20}
            enablePan={false}
          />
        </Canvas>
      </div>

      {/* UI Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <UIOverlay resources={resources} currentWant={currentWant} />
      </div>
      
      {/* Vignette Effect */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />
    </div>
  );
}
