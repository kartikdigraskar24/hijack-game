// SkyCloudEnvironment.tsx - Exterior sky atmosphere and moving cloud layers for Flight 407
import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface SkyCloudProps {
  isFlying?: boolean;
}

export const SkyCloudEnvironment: React.FC<SkyCloudProps> = ({ isFlying = false }) => {
  const cloudsRef = useRef<THREE.Group>(null);
  const cloudLayer2Ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const speed = isFlying ? 12.0 : 0.8;
    if (cloudsRef.current) {
      cloudsRef.current.position.z -= delta * speed;
      if (cloudsRef.current.position.z < -60) {
        cloudsRef.current.position.z = 60;
      }
    }
    if (cloudLayer2Ref.current) {
      cloudLayer2Ref.current.position.z -= delta * (speed * 0.7);
      if (cloudLayer2Ref.current.position.z < -70) {
        cloudLayer2Ref.current.position.z = 70;
      }
    }
  });

  return (
    <group>
      {/* Sky hemisphere */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[180, 24, 24]} />
        <meshBasicMaterial
          color={isFlying ? '#3A75C4' : '#6495ED'}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Sun glow */}
      <mesh position={[50, 40, -80]}>
        <sphereGeometry args={[8, 16, 16]} />
        <meshBasicMaterial color="#FFF9E6" />
      </mesh>

      {/* Cloud layer below / around windows */}
      <group ref={cloudsRef} position={[0, isFlying ? -6 : -2, 0]}>
        {[-40, -20, 0, 20, 40].map((x, i) => (
          <group key={i} position={[x, 0, (i % 3) * 15 - 10]}>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[16, 3, 22]} />
              <meshStandardMaterial
                color="#F8FAFC"
                roughness={0.9}
                transparent
                opacity={0.85}
              />
            </mesh>
            <mesh position={[3, 1, 2]}>
              <boxGeometry args={[12, 2.5, 16]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.9} transparent opacity={0.9} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Distant lower cloud layer */}
      <group ref={cloudLayer2Ref} position={[0, isFlying ? -14 : -6, 20]}>
        {[-30, 0, 30].map((x, i) => (
          <mesh key={i} position={[x, 0, (i % 2) * 20]}>
            <boxGeometry args={[25, 4, 30]} />
            <meshStandardMaterial color="#E2E8F0" roughness={0.95} transparent opacity={0.7} />
          </mesh>
        ))}
      </group>
    </group>
  );
};
