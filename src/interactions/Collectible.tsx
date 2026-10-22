// Collectible.tsx - 3D Clue & Item in the game world with glowing aura and rotation
import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface CollectibleProps {
  id: string;
  name: string;
  category: string;
  position: [number, number, number];
  playerPos: [number, number, number];
  onCollect: (id: string) => void;
}

export const Collectible: React.FC<CollectibleProps> = ({
  category,
  position,
}) => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.y = t * 1.5;
    meshRef.current.position.y = position[1] + Math.sin(t * 3.0) * 0.04;
  });

  return (
    <group position={position}>
      <group ref={meshRef}>
        {/* Physical 3D Object based on item category */}
        {category === 'KEYCARD' ? (
          <mesh castShadow>
            <boxGeometry args={[0.2, 0.02, 0.3]} />
            <meshStandardMaterial color="#38BDF8" roughness={0.3} metalness={0.2} />
          </mesh>
        ) : category === 'DOCUMENT' ? (
          <mesh castShadow>
            <boxGeometry args={[0.25, 0.015, 0.35]} />
            <meshStandardMaterial color="#E2E8F0" roughness={0.7} />
          </mesh>
        ) : category === 'ELECTRONIC' ? (
          <mesh castShadow>
            <boxGeometry args={[0.15, 0.02, 0.28]} />
            <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.2} />
          </mesh>
        ) : (
          <mesh castShadow>
            <boxGeometry args={[0.2, 0.2, 0.2]} />
            <meshStandardMaterial color="#60A5FA" metalness={0.5} roughness={0.3} />
          </mesh>
        )}

        {/* Subtle luminous halo */}
        <mesh>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshBasicMaterial color="#60A5FA" transparent opacity={0.25} wireframe />
        </mesh>
      </group>
    </group>
  );
};
