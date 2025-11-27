import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Line, Sphere, Trail } from '@react-three/drei';
import { FungiGame, gameInstance } from '../game/FungiGame';

interface FungiSceneProps {
  onUpdate: (resources: any, currentWant: string) => void;
}

export function FungiScene({ onUpdate }: FungiSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  // Use state to trigger re-renders when topology changes
  const [nodes, setNodes] = useState(gameInstance.nodes);
  const [links, setLinks] = useState(gameInstance.links);

  useFrame((state, delta) => {
    gameInstance.update(delta);
    
    // Sync game state to React state periodically or on change
    // For performance, we might only want to do this when nodes count changes
    if (gameInstance.nodes.length !== nodes.length) {
      setNodes([...gameInstance.nodes]);
      setLinks([...gameInstance.links]);
    }

    // Send stats back to UI
    onUpdate({ ...gameInstance.resources }, gameInstance.currentWant);
  });

  const nodeMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color("#4ade80"), // Green-400
    emissive: new THREE.Color("#22c55e"),
    emissiveIntensity: 2,
    toneMapped: false
  }), []);

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
      <pointLight position={[-10, -5, -10]} intensity={0.5} color="#a855f7" />

      {/* Render Links */}
      {links.map(link => (
        <Line
          key={link.id}
          points={[link.source, link.target]}
          color="white"
          opacity={0.3}
          transparent
          lineWidth={1}
        />
      ))}

      {/* Render Nodes */}
      {nodes.map(node => (
        <mesh key={node.id} position={node.position}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial 
            color={node.parentId === null ? "#facc15" : "#4ade80"} 
            emissive={node.parentId === null ? "#eab308" : "#22c55e"}
            emissiveIntensity={1.5}
          />
        </mesh>
      ))}
      
      {/* Ground Plane for reference */}
      <gridHelper args={[20, 20, 0x333333, 0x111111]} position={[0, -2, 0]} />
    </group>
  );
}
