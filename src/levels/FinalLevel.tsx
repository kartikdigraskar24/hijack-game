// FinalLevel.tsx - Level 3: FINAL DECISION (High-tension crisis resolution in expanded cabin)
import React from 'react';
import { AircraftInterior } from '../environment/AircraftInterior';
import { CabinPassengers } from '../environment/CabinPassengers';
import { SkyCloudEnvironment } from '../environment/SkyCloudEnvironment';
import { LightingSetup } from '../environment/LightingSetup';
import { NPCController } from '../characters/NPCController';

interface FinalLevelProps {
  playerPos: [number, number, number];
  onInteractNPC: (npcId: string) => void;
  onOpenDecision: () => void;
  activeNpcId: string | null;
  decisionMade: boolean;
}

export const FinalLevel: React.FC<FinalLevelProps> = ({
  playerPos,
  onInteractNPC,
  activeNpcId,
}) => {
  return (
    <group>
      {/* High-tension cabin lighting with emergency red accents */}
      <LightingSetup level={2} />
      <pointLight position={[0, 2.3, -4.5]} color="#EF4444" intensity={2.2} distance={8} />
      <pointLight position={[0, 2.3, 2.0]} color="#EF4444" intensity={2.2} distance={8} />
      <pointLight position={[0, 2.3, 7.5]} color="#EF4444" intensity={1.8} distance={8} />

      {/* Exterior flight sky */}
      <SkyCloudEnvironment isFlying={true} />

      {/* 3D Expanded Cabin Interior */}
      <AircraftInterior flightPhase="EMERGENCY" />

      {/* Background Passengers in Cabin */}
      <CabinPassengers />

      {/* --- ARMED HIJACKERS (Distinct roles, weapons & threatening poses) --- */}
      {/* 1. Lead Hijacker (Tariq) - Controlling forward cabin & cockpit entry */}
      <NPCController
        npcId="hijacker_lead"
        position={[0, 0, -4.5]}
        rotationY={0}
        initialAnimState="IDLE"
        expression="ANGRY"
        weapon="PISTOL"
        playerPos={playerPos}
        isTalking={activeNpcId === 'hijacker_lead'}
        isTargeted={activeNpcId === 'hijacker_lead'}
        onInteract={() => onInteractNPC('hijacker_lead')}
      />

      {/* 2. Second Hijacker (Farooq) - Armed enforcer securing mid-cabin aisle */}
      <NPCController
        npcId="hijacker_second"
        position={[0, 0, 1.2]}
        rotationY={0}
        initialAnimState="IDLE"
        expression="ANGRY"
        weapon="PISTOL"
        playerPos={playerPos}
        isTalking={activeNpcId === 'hijacker_second'}
        isTargeted={activeNpcId === 'hijacker_second'}
        onInteract={() => onInteractNPC('hijacker_second')}
      />

      {/* 3. Third Hijacker (Zubair) - Guard brandishing sword watching aft cabin */}
      <NPCController
        npcId="hijacker_blade"
        position={[0, 0, 7.5]}
        rotationY={0}
        initialAnimState="IDLE"
        expression="ANGRY"
        weapon="SWORD"
        playerPos={playerPos}
        isTalking={activeNpcId === 'hijacker_blade'}
        isTargeted={activeNpcId === 'hijacker_blade'}
        onInteract={() => onInteractNPC('hijacker_blade')}
      />

      {/* --- HOSTAGES & FLIGHT CREW --- */}
      {/* Maya Deshmukh huddled near forward galley with fear expression */}
      <NPCController
        npcId="maya"
        position={[-0.7, 0, -7.5]}
        rotationY={0.8}
        initialAnimState="IDLE"
        expression="FEAR"
        hasUniformAccents={true}
        playerPos={playerPos}
        isTalking={activeNpcId === 'maya'}
        isTargeted={activeNpcId === 'maya'}
        onInteract={() => onInteractNPC('maya')}
      />

      {/* Captain Rahul Sharma emerged at flight deck bulkhead door */}
      <NPCController
        npcId="captain"
        position={[0.7, 0, -8.0]}
        rotationY={-0.8}
        initialAnimState="IDLE"
        expression="SERIOUS"
        hasUniformAccents={true}
        playerPos={playerPos}
        isTalking={activeNpcId === 'captain'}
        isTargeted={activeNpcId === 'captain'}
        onInteract={() => onInteractNPC('captain')}
      />

      {/* Aditya Verma seated in Row 12, hands up in fear */}
      <NPCController
        npcId="aditya"
        position={[-0.65, 0, 3.1]}
        rotationY={Math.PI}
        initialAnimState="SIT"
        expression="FEAR"
        playerPos={playerPos}
        isTalking={activeNpcId === 'aditya'}
        isTargeted={activeNpcId === 'aditya'}
        onInteract={() => onInteractNPC('aditya')}
      />

      {/* Ananya Roy seated in Row 11 window seat, fearful */}
      <NPCController
        npcId="ananya"
        position={[-1.45, 0, 1.9]}
        rotationY={Math.PI}
        initialAnimState="SIT"
        expression="FEAR"
        playerPos={playerPos}
        isTalking={activeNpcId === 'ananya'}
        isTargeted={activeNpcId === 'ananya'}
        onInteract={() => onInteractNPC('ananya')}
      />

      {/* Vikram Malhotra in Row 14, terrified and nervous */}
      <NPCController
        npcId="vikram"
        position={[1.05, 0, 4.8]}
        rotationY={Math.PI / 2}
        initialAnimState="IDLE"
        expression="FEAR"
        hasJacket={true}
        playerPos={playerPos}
        isTalking={activeNpcId === 'vikram'}
        isTargeted={activeNpcId === 'vikram'}
        onInteract={() => onInteractNPC('vikram')}
      />
    </group>
  );
};
