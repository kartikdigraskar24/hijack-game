// AirportPassengers.tsx - Populates airport waiting lounge with 15+ diverse background passengers
import React, { useMemo } from 'react';
import { CharacterModel } from '../characters/CharacterModel';

interface AirportPassengerConfig {
  id: string;
  x: number;
  z: number;
  clothingColor: string;
  pantsColor: string;
  skinTone: string;
  hairColor: string;
  rotationY: number;
  animState: 'SIT' | 'IDLE';
  hasJacket?: boolean;
}

export const AirportPassengers: React.FC = () => {
  const passengers: AirportPassengerConfig[] = useMemo(() => [
    // Seated in lounge row X = -6
    { id: 'ap1', x: -6.0, z: -2.0, clothingColor: '#1E3A8A', pantsColor: '#1E293B', skinTone: '#D6A584', hairColor: '#1A1A1A', rotationY: Math.PI / 2, animState: 'SIT' },
    { id: 'ap2', x: -6.0, z: -1.2, clothingColor: '#4B5563', pantsColor: '#111827', skinTone: '#CFA07C', hairColor: '#3F3F46', rotationY: Math.PI / 2, animState: 'SIT', hasJacket: true },
    { id: 'ap3', x: -6.0, z: 1.2, clothingColor: '#047857', pantsColor: '#1F2937', skinTone: '#D1A380', hairColor: '#262626', rotationY: Math.PI / 2, animState: 'SIT' },
    { id: 'ap4', x: -6.0, z: 2.8, clothingColor: '#7C2D12', pantsColor: '#0F172A', skinTone: '#E5B895', hairColor: '#1C1917', rotationY: Math.PI / 2, animState: 'SIT' },

    // Seated in lounge row X = 2
    { id: 'ap5', x: 2.0, z: -2.0, clothingColor: '#6D28D9', pantsColor: '#1E293B', skinTone: '#B58563', hairColor: '#18181B', rotationY: -Math.PI / 2, animState: 'SIT' },
    { id: 'ap6', x: 2.0, z: -0.4, clothingColor: '#0369A1', pantsColor: '#111827', skinTone: '#D6A584', hairColor: '#27272A', rotationY: -Math.PI / 2, animState: 'SIT' },
    { id: 'ap7', x: 2.0, z: 2.0, clothingColor: '#9F1239', pantsColor: '#1F2937', skinTone: '#C99E7B', hairColor: '#171717', rotationY: -Math.PI / 2, animState: 'SIT' },
    { id: 'ap8', x: 2.0, z: 3.6, clothingColor: '#374151', pantsColor: '#09090B', skinTone: '#E2B18E', hairColor: '#44403C', rotationY: -Math.PI / 2, animState: 'SIT', hasJacket: true },

    // Seated in extra lounge row X = -11
    { id: 'ap9', x: -11.0, z: 0.0, clothingColor: '#155E75', pantsColor: '#1E293B', skinTone: '#D6A584', hairColor: '#18181B', rotationY: Math.PI / 2, animState: 'SIT' },
    { id: 'ap10', x: -11.0, z: 2.0, clothingColor: '#92400E', pantsColor: '#111827', skinTone: '#CFA07C', hairColor: '#3B2F2F', rotationY: Math.PI / 2, animState: 'SIT' },

    // Standing / waiting near Gate 7 area (positioned safely to sides of central walking route)
    { id: 'ap11', x: 5.5, z: 9.8, clothingColor: '#334155', pantsColor: '#0F172A', skinTone: '#D1A380', hairColor: '#262626', rotationY: 0.8, animState: 'IDLE' },
    { id: 'ap12', x: 13.2, z: 10.2, clothingColor: '#831843', pantsColor: '#1F2937', skinTone: '#E5B895', hairColor: '#171717', rotationY: -1.2, animState: 'IDLE' },
    { id: 'ap13', x: 5.8, z: 12.0, clothingColor: '#1E3A8A', pantsColor: '#1E293B', skinTone: '#B58563', hairColor: '#1C1917', rotationY: 1.5, animState: 'IDLE', hasJacket: true },

    // Standing near Observation Windows
    { id: 'ap14', x: 14.5, z: 0.5, clothingColor: '#065F46', pantsColor: '#0F172A', skinTone: '#D6A584', hairColor: '#27272A', rotationY: -Math.PI / 2, animState: 'IDLE' },
    { id: 'ap15', x: 14.5, z: -3.0, clothingColor: '#701A75', pantsColor: '#111827', skinTone: '#C99E7B', hairColor: '#18181B', rotationY: -Math.PI / 2, animState: 'IDLE' },
  ], []);

  return (
    <group>
      {passengers.map((p) => (
        <group key={p.id} position={[p.x, 0, p.z]}>
          <CharacterModel
            clothingColor={p.clothingColor}
            pantsColor={p.pantsColor}
            skinTone={p.skinTone}
            hairColor={p.hairColor}
            animState={p.animState}
            hasJacket={p.hasJacket}
            rotationY={p.rotationY}
            isNpc={true}
          />
        </group>
      ))}
    </group>
  );
};
