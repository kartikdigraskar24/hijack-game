// AircraftLevel.tsx - Level 2: SIGNS OF DANGER with Expanded Cabin, 25+ Passengers, and Clues
import React from 'react';
import { AircraftInterior } from '../environment/AircraftInterior';
import { CabinPassengers } from '../environment/CabinPassengers';
import { SkyCloudEnvironment } from '../environment/SkyCloudEnvironment';
import { LightingSetup } from '../environment/LightingSetup';
import { NPCController } from '../characters/NPCController';
import { Collectible } from '../interactions/Collectible';
import { SeatInteraction } from '../interactions/SeatInteraction';
import { WORLD_COLLECTIBLES } from '../data/collectibles';

interface AircraftLevelProps {
  playerPos: [number, number, number];
  isSeated: boolean;
  canStandUp: boolean;
  onToggleSeat: () => void;
  onInteractNPC: (npcId: string) => void;
  onCollectClue: (clueId: string) => void;
  collectedItemIds: string[];
  activeNpcId: string | null;
  flightPhase: string;
}

export const AircraftLevel: React.FC<AircraftLevelProps> = ({
  playerPos,
  isSeated,
  canStandUp,
  onToggleSeat,
  onInteractNPC,
  onCollectClue,
  collectedItemIds,
  activeNpcId,
  flightPhase,
}) => {
  // Filter collectibles that are on level 2 and haven't been picked up yet
  const availableCollectibles = WORLD_COLLECTIBLES.filter(
    (c) => c.level === 2 && !collectedItemIds.includes(c.id)
  );

  return (
    <group>
      {/* PBR Aircraft Interior Lighting */}
      <LightingSetup level={2} />

      {/* Exterior Moving Sky & Cloud layers seen through windows */}
      <SkyCloudEnvironment isFlying={true} />

      {/* 3D Expanded Passenger Cabin Architecture */}
      <AircraftInterior flightPhase={flightPhase} />

      {/* 25+ Background Passengers across rows */}
      <CabinPassengers />

      {/* --- SEAT 12A (Arjun's assigned window seat at X = -1.45, Z = 3.1) --- */}
      <SeatInteraction
        seatPosition={[-1.45, 0, 3.1]}
        playerPos={playerPos}
        isSeated={isSeated}
        canStandUp={canStandUp}
        onToggleSeat={onToggleSeat}
      />

      {/* --- LEVEL 2 STORY NPCS --- */}
      {/* Maya Deshmukh in Forward Galley */}
      <NPCController
        npcId="maya"
        position={[0, 0, -9.5]}
        rotationY={0}
        initialAnimState="IDLE"
        playerPos={playerPos}
        isTalking={activeNpcId === 'maya'}
        isTargeted={activeNpcId === 'maya'}
        onInteract={() => onInteractNPC('maya')}
      />

      {/* Aditya Verma seated in Row 12C across the aisle */}
      <NPCController
        npcId="aditya"
        position={[-0.65, 0, 3.1]}
        rotationY={Math.PI}
        initialAnimState="SIT"
        playerPos={playerPos}
        isTalking={activeNpcId === 'aditya'}
        isTargeted={activeNpcId === 'aditya'}
        onInteract={() => onInteractNPC('aditya')}
      />

      {/* Ananya Roy seated in Row 11A window seat */}
      <NPCController
        npcId="ananya"
        position={[-1.45, 0, 1.9]}
        rotationY={Math.PI}
        initialAnimState="SIT"
        playerPos={playerPos}
        isTalking={activeNpcId === 'ananya'}
        isTargeted={activeNpcId === 'ananya'}
        onInteract={() => onInteractNPC('ananya')}
      />

      {/* Vikram Malhotra (Suspicious Passenger) seated in Row 14B */}
      <NPCController
        npcId="vikram"
        position={[1.05, 0, 5.5]}
        rotationY={Math.PI}
        initialAnimState="SIT"
        hasJacket={true}
        playerPos={playerPos}
        isTalking={activeNpcId === 'vikram'}
        isTargeted={activeNpcId === 'vikram'}
        onInteract={() => onInteractNPC('vikram')}
      />

      {/* --- 3D CLUES IN CABIN --- */}
      {availableCollectibles.map((item) => (
        <Collectible
          key={item.id}
          id={item.id}
          name={item.name}
          category={item.category}
          position={item.position}
          playerPos={playerPos}
          onCollect={onCollectClue}
        />
      ))}
    </group>
  );
};
