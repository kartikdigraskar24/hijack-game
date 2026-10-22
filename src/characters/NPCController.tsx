// NPCController.tsx - Manages individual NPC placement, state machine, and dynamic orientation
import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { CharacterModel, CharacterAnimState, CharacterExpression } from './CharacterModel';
import { CHARACTERS } from '../data/characters';

interface NPCControllerProps {
  npcId: string;
  position: [number, number, number];
  rotationY?: number;
  initialAnimState?: CharacterAnimState;
  expression?: CharacterExpression;
  weapon?: 'PISTOL' | 'SWORD' | 'NONE';
  hasUniformAccents?: boolean;
  hasJacket?: boolean;
  playerPos: [number, number, number];
  isTalking?: boolean;
  onInteract?: (npcId: string) => void;
  isTargeted?: boolean;
}

export const NPCController: React.FC<NPCControllerProps> = ({
  npcId,
  position,
  rotationY = 0,
  initialAnimState = 'IDLE',
  expression,
  weapon = 'NONE',
  hasUniformAccents = false,
  hasJacket = false,
  playerPos,
  isTalking = false,
  isTargeted = false,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const characterData = CHARACTERS[npcId];

  // Dynamic animation state: seated NPCs remain seated even when talking!
  let currentAnim: CharacterAnimState = initialAnimState;
  if (isTalking && initialAnimState !== 'SIT') {
    currentAnim = 'TALK';
  }

  // Determine default expression if not explicitly provided
  const resolvedExpression: CharacterExpression = expression || (
    npcId === 'hijacker_lead' ? 'ANGRY' :
    npcId === 'hijacker_second' ? 'ANGRY' :
    npcId === 'hijacker_blade' ? 'ANGRY' :
    npcId === 'vikram' ? 'CONCERNED' :
    npcId === 'aditya' ? 'FRIENDLY' :
    npcId === 'security_officer' ? 'SERIOUS' :
    npcId === 'captain' ? 'SERIOUS' :
    'NEUTRAL'
  );

  const [px, py, pz] = playerPos;
  const dist = Math.sqrt(
    Math.pow(px - position[0], 2) +
    Math.pow(py - position[1], 2) +
    Math.pow(pz - position[2], 2)
  );

  const inProximity = dist < 2.5;

  useFrame(() => {
    if (!groupRef.current) return;

    // Seated NPCs stay aligned with chair! Only standing NPCs rotate toward player
    if (initialAnimState !== 'SIT' && (isTalking || inProximity)) {
      // Smoothly rotate toward player when talking or close standing
      const targetAngle = Math.atan2(px - position[0], pz - position[2]);
      const currentAngle = groupRef.current.rotation.y;
      
      let diff = (targetAngle - currentAngle) % (Math.PI * 2);
      if (diff < -Math.PI) diff += Math.PI * 2;
      if (diff > Math.PI) diff -= Math.PI * 2;
      groupRef.current.rotation.y += diff * 0.08;
    } else {
      let diff = (rotationY - groupRef.current.rotation.y) % (Math.PI * 2);
      if (diff < -Math.PI) diff += Math.PI * 2;
      if (diff > Math.PI) diff -= Math.PI * 2;
      groupRef.current.rotation.y += diff * 0.05;
    }
  });

  if (!characterData) return null;

  return (
    <group ref={groupRef} position={position} rotation={[0, rotationY, 0]}>
      {/* 3D Humanoid Body */}
      <CharacterModel
        clothingColor={characterData.clothingColor}
        skinTone={characterData.skinTone}
        hairColor={characterData.hairColor}
        animState={currentAnim}
        expression={resolvedExpression}
        weapon={weapon}
        hasUniformAccents={hasUniformAccents || npcId === 'maya' || npcId === 'captain' || npcId === 'staff' || npcId === 'security_officer'}
        hasJacket={hasJacket || npcId === 'vikram' || npcId === 'arjun'}
        isNpc={true}
      />

      {/* Subtle 3D subtle highlight dot above head when targeted */}
      {isTargeted && (
        <mesh position={[0, 1.95, 0]}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshBasicMaterial color="#38BDF8" />
        </mesh>
      )}
    </group>
  );
};
