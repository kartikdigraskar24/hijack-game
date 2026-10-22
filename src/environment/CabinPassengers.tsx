// CabinPassengers.tsx - Populates aircraft with 25+ diverse, visible passengers across rows
import React, { useMemo } from 'react';
import * as THREE from 'three';
import { CharacterModel } from '../characters/CharacterModel';

interface PassengerConfig {
  id: string;
  rowNumber: number;
  seatLetter: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  x: number;
  z: number;
  clothingColor: string;
  pantsColor: string;
  skinTone: string;
  hairColor: string;
  rotationY: number;
  hasJacket?: boolean;
}

// Seat offset mapping for 3-3 layout:
// A: -1.45, B: -1.05, C: -0.65 | Aisle | D: 0.65, E: 1.05, F: 1.45
const SEAT_X_OFFSETS = {
  A: -1.45,
  B: -1.05,
  C: -0.65,
  D: 0.65,
  E: 1.05,
  F: 1.45,
};

export const CabinPassengers: React.FC = () => {
  // Diverse color palettes for realistic civilian passenger clothing
  const passengers: PassengerConfig[] = useMemo(() => [
    // Row 5
    { id: 'p5A', rowNumber: 5, seatLetter: 'A', x: SEAT_X_OFFSETS.A, z: -5.3, clothingColor: '#475569', pantsColor: '#1E293B', skinTone: '#D6A584', hairColor: '#1E1E1E', rotationY: Math.PI },
    { id: 'p5B', rowNumber: 5, seatLetter: 'B', x: SEAT_X_OFFSETS.B, z: -5.3, clothingColor: '#991B1B', pantsColor: '#0F172A', skinTone: '#CFA07C', hairColor: '#3B2F2F', rotationY: Math.PI },
    { id: 'p5E', rowNumber: 5, seatLetter: 'E', x: SEAT_X_OFFSETS.E, z: -5.3, clothingColor: '#1E3A8A', pantsColor: '#334155', skinTone: '#D1A380', hairColor: '#18181B', rotationY: Math.PI },
    { id: 'p5F', rowNumber: 5, seatLetter: 'F', x: SEAT_X_OFFSETS.F, z: -5.3, clothingColor: '#065F46', pantsColor: '#1E293B', skinTone: '#E5B895', hairColor: '#4A3728', rotationY: Math.PI },

    // Row 6
    { id: 'p6C', rowNumber: 6, seatLetter: 'C', x: SEAT_X_OFFSETS.C, z: -4.1, clothingColor: '#6B21A8', pantsColor: '#111827', skinTone: '#B58563', hairColor: '#18181B', rotationY: Math.PI },
    { id: 'p6D', rowNumber: 6, seatLetter: 'D', x: SEAT_X_OFFSETS.D, z: -4.1, clothingColor: '#854D0E', pantsColor: '#1E293B', skinTone: '#D6A584', hairColor: '#27272A', rotationY: Math.PI },

    // Row 7
    { id: 'p7A', rowNumber: 7, seatLetter: 'A', x: SEAT_X_OFFSETS.A, z: -2.9, clothingColor: '#334155', pantsColor: '#0F172A', skinTone: '#E2B18E', hairColor: '#18181B', rotationY: Math.PI, hasJacket: true },
    { id: 'p7E', rowNumber: 7, seatLetter: 'E', x: SEAT_X_OFFSETS.E, z: -2.9, clothingColor: '#1E40AF', pantsColor: '#1E293B', skinTone: '#CBA07D', hairColor: '#3F3F46', rotationY: Math.PI },
    { id: 'p7F', rowNumber: 7, seatLetter: 'F', x: SEAT_X_OFFSETS.F, z: -2.9, clothingColor: '#831843', pantsColor: '#111827', skinTone: '#D6A584', hairColor: '#262626', rotationY: Math.PI },

    // Row 8
    { id: 'p8B', rowNumber: 8, seatLetter: 'B', x: SEAT_X_OFFSETS.B, z: -1.7, clothingColor: '#374151', pantsColor: '#1F2937', skinTone: '#C99E7B', hairColor: '#1C1917', rotationY: Math.PI },
    { id: 'p8D', rowNumber: 8, seatLetter: 'D', x: SEAT_X_OFFSETS.D, z: -1.7, clothingColor: '#155E75', pantsColor: '#0F172A', skinTone: '#E5B895', hairColor: '#292524', rotationY: Math.PI },

    // Row 9
    { id: 'p9A', rowNumber: 9, seatLetter: 'A', x: SEAT_X_OFFSETS.A, z: -0.5, clothingColor: '#581C87', pantsColor: '#18181B', skinTone: '#B58563', hairColor: '#18181B', rotationY: Math.PI },
    { id: 'p9E', rowNumber: 9, seatLetter: 'E', x: SEAT_X_OFFSETS.E, z: -0.5, clothingColor: '#166534', pantsColor: '#1E293B', skinTone: '#D6A584', hairColor: '#44403C', rotationY: Math.PI },

    // Row 10
    { id: 'p10B', rowNumber: 10, seatLetter: 'B', x: SEAT_X_OFFSETS.B, z: 0.7, clothingColor: '#9A3412', pantsColor: '#111827', skinTone: '#CFA07C', hairColor: '#1C1917', rotationY: Math.PI },
    { id: 'p10C', rowNumber: 10, seatLetter: 'C', x: SEAT_X_OFFSETS.C, z: 0.7, clothingColor: '#1E3A8A', pantsColor: '#1F2937', skinTone: '#D1A380', hairColor: '#262626', rotationY: Math.PI },
    { id: 'p10F', rowNumber: 10, seatLetter: 'F', x: SEAT_X_OFFSETS.F, z: 0.7, clothingColor: '#3F3F46', pantsColor: '#09090B', skinTone: '#E2B18E', hairColor: '#171717', rotationY: Math.PI },

    // Row 13
    { id: 'p13A', rowNumber: 13, seatLetter: 'A', x: SEAT_X_OFFSETS.A, z: 4.3, clothingColor: '#075985', pantsColor: '#1E293B', skinTone: '#D6A584', hairColor: '#18181B', rotationY: Math.PI },
    { id: 'p13D', rowNumber: 13, seatLetter: 'D', x: SEAT_X_OFFSETS.D, z: 4.3, clothingColor: '#701A75', pantsColor: '#111827', skinTone: '#C99E7B', hairColor: '#3B2F2F', rotationY: Math.PI },
    { id: 'p13F', rowNumber: 13, seatLetter: 'F', x: SEAT_X_OFFSETS.F, z: 4.3, clothingColor: '#1F2937', pantsColor: '#111827', skinTone: '#E5B895', hairColor: '#27272A', rotationY: Math.PI },

    // Row 15
    { id: 'p15B', rowNumber: 15, seatLetter: 'B', x: SEAT_X_OFFSETS.B, z: 6.7, clothingColor: '#1E40AF', pantsColor: '#0F172A', skinTone: '#D1A380', hairColor: '#18181B', rotationY: Math.PI },
    { id: 'p15E', rowNumber: 15, seatLetter: 'E', x: SEAT_X_OFFSETS.E, z: 6.7, clothingColor: '#854D0E', pantsColor: '#1E293B', skinTone: '#B58563', hairColor: '#171717', rotationY: Math.PI },

    // Row 16
    { id: 'p16A', rowNumber: 16, seatLetter: 'A', x: SEAT_X_OFFSETS.A, z: 7.9, clothingColor: '#065F46', pantsColor: '#18181B', skinTone: '#D6A584', hairColor: '#292524', rotationY: Math.PI },
    { id: 'p16D', rowNumber: 16, seatLetter: 'D', x: SEAT_X_OFFSETS.D, z: 7.9, clothingColor: '#475569', pantsColor: '#0F172A', skinTone: '#E2B18E', hairColor: '#1C1917', rotationY: Math.PI },

    // Row 17
    { id: 'p17C', rowNumber: 17, seatLetter: 'C', x: SEAT_X_OFFSETS.C, z: 9.1, clothingColor: '#991B1B', pantsColor: '#111827', skinTone: '#CFA07C', hairColor: '#3F3F46', rotationY: Math.PI },
    { id: 'p17F', rowNumber: 17, seatLetter: 'F', x: SEAT_X_OFFSETS.F, z: 9.1, clothingColor: '#1E3A8A', pantsColor: '#1E293B', skinTone: '#D1A380', hairColor: '#18181B', rotationY: Math.PI },

    // Row 18
    { id: 'p18B', rowNumber: 18, seatLetter: 'B', x: SEAT_X_OFFSETS.B, z: 10.3, clothingColor: '#374151', pantsColor: '#0F172A', skinTone: '#D6A584', hairColor: '#262626', rotationY: Math.PI },
    { id: 'p18E', rowNumber: 18, seatLetter: 'E', x: SEAT_X_OFFSETS.E, z: 10.3, clothingColor: '#166534', pantsColor: '#1F2937', skinTone: '#E5B895', hairColor: '#44403C', rotationY: Math.PI },

    // Row 19 & 20
    { id: 'p19A', rowNumber: 19, seatLetter: 'A', x: SEAT_X_OFFSETS.A, z: 11.5, clothingColor: '#1E40AF', pantsColor: '#18181B', skinTone: '#B58563', hairColor: '#171717', rotationY: Math.PI },
    { id: 'p20D', rowNumber: 20, seatLetter: 'D', x: SEAT_X_OFFSETS.D, z: 12.7, clothingColor: '#6B21A8', pantsColor: '#0F172A', skinTone: '#D6A584', hairColor: '#1C1917', rotationY: Math.PI },
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
            animState="SIT"
            hasJacket={p.hasJacket}
            rotationY={p.rotationY}
            isNpc={true}
          />
        </group>
      ))}
    </group>
  );
};
