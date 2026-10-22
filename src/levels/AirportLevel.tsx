// AirportLevel.tsx - Level 1: THE DEPARTURE with Security Checkpoint & Populated Lounge
import React from 'react';
import { AirportEnvironment } from '../environment/AirportEnvironment';
import { AirportPassengers } from '../environment/AirportPassengers';
import { LightingSetup } from '../environment/LightingSetup';
import { NPCController } from '../characters/NPCController';

interface AirportLevelProps {
  playerPos: [number, number, number];
  onInteractNPC: (npcId: string) => void;
  activeNpcId: string | null;
  securityCleared?: boolean;
  onInspectBoard?: () => void;
  onBoardAircraft?: () => void;
  boardingUnlocked?: boolean;
}

export const AirportLevel: React.FC<AirportLevelProps> = ({
  playerPos,
  onInteractNPC,
  activeNpcId,
  securityCleared = false,
  onInspectBoard,
  onBoardAircraft,
  boardingUnlocked = false,
}) => {
  return (
    <group>
      {/* PBR Lighting */}
      <LightingSetup level={1} />

      {/* Terminal Architecture & Security Checkpoint */}
      <AirportEnvironment playerPos={playerPos} securityCleared={securityCleared} />

      {/* 15+ Background Passengers in Terminal Lounge */}
      <AirportPassengers />

      {/* --- LEVEL 1 KEY NPCS --- */}
      {/* Officer Sunil at the Security Checkpoint (X = 4.8, Z = 6.5) */}
      <NPCController
        npcId="security_officer"
        position={[4.8, 0, 6.5]}
        rotationY={0}
        initialAnimState="IDLE"
        hasUniformAccents={true}
        playerPos={playerPos}
        isTalking={activeNpcId === 'security_officer'}
        onInteract={() => onInteractNPC('security_officer')}
      />

      {/* Maya Deshmukh to the side of Gate 7 approach */}
      <NPCController
        npcId="maya"
        position={[7.8, 0, 10.6]}
        rotationY={-Math.PI / 4}
        initialAnimState="IDLE"
        playerPos={playerPos}
        isTalking={activeNpcId === 'maya'}
        onInteract={() => onInteractNPC('maya')}
      />

      {/* Rohan Ground Staff behind Gate 7 Podium */}
      <NPCController
        npcId="staff"
        position={[11.35, 0, 13.1]}
        rotationY={Math.PI}
        initialAnimState="IDLE"
        playerPos={playerPos}
        isTalking={activeNpcId === 'staff'}
        onInteract={() => onInteractNPC('staff')}
      />

      {/* Aditya Verma in Departure Lounge */}
      <NPCController
        npcId="aditya"
        position={[-5.5, 0, 2.0]}
        rotationY={Math.PI / 2}
        initialAnimState="TALK"
        playerPos={playerPos}
        isTalking={activeNpcId === 'aditya'}
        onInteract={() => onInteractNPC('aditya')}
      />

      {/* Ananya Roy standing by observation windows */}
      <NPCController
        npcId="ananya"
        position={[14.5, 0, 5.0]}
        rotationY={-Math.PI / 2}
        initialAnimState="IDLE"
        playerPos={playerPos}
        isTalking={activeNpcId === 'ananya'}
        onInteract={() => onInteractNPC('ananya')}
      />
    </group>
  );
};
