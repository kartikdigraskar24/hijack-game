// LightingSetup.tsx - Balanced realistic PBR lighting configuration without washed-out fog
import React from 'react';

interface LightingSetupProps {
  level: number;
}

export const LightingSetup: React.FC<LightingSetupProps> = ({ level }) => {
  if (level === 1) {
    // Airport Terminal: High ceiling ambient + warm spotlights + natural window light
    return (
      <group>
        {/* Soft base ambient */}
        <ambientLight intensity={0.55} color="#D8E2EC" />

        {/* Sunlight through large glass terminal facade */}
        <directionalLight
          position={[25, 30, -20]}
          intensity={1.1}
          color="#FFF8E7"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={0.5}
          shadow-camera-far={80}
          shadow-camera-left={-25}
          shadow-camera-right={25}
          shadow-camera-top={25}
          shadow-camera-bottom={-25}
          shadow-bias={-0.0005}
        />

        {/* Terminal Interior Ceiling Downlights */}
        <pointLight position={[0, 7.5, 0]} intensity={0.6} color="#FFFFFF" distance={25} />
        <pointLight position={[0, 7.5, -8]} intensity={0.5} color="#FFFFFF" distance={20} />
        <pointLight position={[0, 7.5, 8]} intensity={0.5} color="#FFFFFF" distance={20} />
        {/* Gate 07 Doorway & Portal Welcoming Illumination */}
        <pointLight position={[10, 4.5, 12.0]} intensity={1.2} color="#FEF3C7" distance={18} />
        <pointLight position={[10, 2.5, 13.5]} intensity={0.8} color="#E0F2FE" distance={10} />
      </group>
    );
  }

  // Aircraft Cabin (Levels 2 & 3): Soft indirect ceiling LED light strips & window daylight
  return (
    <group>
      {/* Gentle diffuse cabin ambient */}
      <ambientLight intensity={0.48} color="#D0DCE5" />

      {/* Exterior daylight filtering through fuselage windows */}
      <directionalLight
        position={[-12, 10, -5]}
        intensity={0.85}
        color="#F8FAFC"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={40}
        shadow-bias={-0.0003}
      />

      {/* Overhead central cabin LED ceiling runners */}
      <pointLight position={[0, 2.3, -5]} intensity={0.45} color="#EBF8FF" distance={8} />
      <pointLight position={[0, 2.3, -1]} intensity={0.45} color="#EBF8FF" distance={8} />
      <pointLight position={[0, 2.3, 3]} intensity={0.45} color="#EBF8FF" distance={8} />
      <pointLight position={[0, 2.3, 7]} intensity={0.45} color="#EBF8FF" distance={8} />

      {/* Galley task lights */}
      <pointLight position={[0, 2.2, -7.0]} intensity={0.55} color="#FFFFFF" distance={5} />
      <pointLight position={[0, 2.2, 9.8]} intensity={0.55} color="#FFFFFF" distance={5} />
    </group>
  );
};
