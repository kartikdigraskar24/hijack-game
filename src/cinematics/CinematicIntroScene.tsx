// CinematicIntroScene.tsx - 4-Phase Cinematic Airport Terminal Introduction for Lost Robot Rescue Agent
import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { AirportEnvironment } from '../environment/AirportEnvironment';
import { AirportPassengers } from '../environment/AirportPassengers';
import { LightingSetup } from '../environment/LightingSetup';

interface CinematicIntroSceneProps {
  onIntroComplete?: () => void;
  onPhaseUpdate?: (phase: 1 | 2 | 3 | 4, time: number) => void;
}

// Smooth cubic easing function for cinematic transitions
function smoothEase(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export const CinematicIntroScene: React.FC<CinematicIntroSceneProps> = ({
  onIntroComplete,
  onPhaseUpdate,
}) => {
  const cameraTargetRef = useRef(new THREE.Vector3(0, 3.2, 0));
  const timeRef = useRef<number>(0);
  const completedRef = useRef<boolean>(false);
  const lastPhaseRef = useRef<1 | 2 | 3 | 4>(1);

  useFrame((state, delta) => {
    if (completedRef.current) return;

    // Cap delta to prevent discontinuous jumps on background tabs
    const dt = Math.min(delta, 0.05);
    timeRef.current += dt;
    const t = timeRef.current;

    // Phase identification based on the target 12-18 second schedule (total 17.5s):
    // Phase 1 (0.0s - 4.0s): Airport Establishing Shot
    // Phase 2 (4.0s - 9.0s): Mission Introduction (LOST ROBOT RESCUE AGENT)
    // Phase 3 (9.0s - 14.0s): Objective Preview (Gate 7, Landmarks, Rescue Area)
    // Phase 4 (14.0s - 17.5s): Smooth Transition to Player Start Position
    let currentPhase: 1 | 2 | 3 | 4 = 1;
    if (t >= 14.0) {
      currentPhase = 4;
    } else if (t >= 9.0) {
      currentPhase = 3;
    } else if (t >= 4.0) {
      currentPhase = 2;
    }

    if (currentPhase !== lastPhaseRef.current) {
      lastPhaseRef.current = currentPhase;
      onPhaseUpdate?.(currentPhase, t);
    }

    // Camera trajectories & target look-at points
    const camPos = new THREE.Vector3();
    const targetPos = new THREE.Vector3();

    if (t < 4.0) {
      // --- PHASE 1: AIRPORT ESTABLISHING SHOT (0 - 4s) ---
      // High-angle sweeping shot from entrance looking deep across the entire terminal
      const progress = smoothEase(Math.min(1.0, t / 4.0));
      camPos.set(
        THREE.MathUtils.lerp(0.0, 0.0, progress),
        THREE.MathUtils.lerp(6.8, 5.0, progress),
        THREE.MathUtils.lerp(-13.2, -8.8, progress)
      );
      targetPos.set(
        THREE.MathUtils.lerp(0.0, 1.5, progress),
        THREE.MathUtils.lerp(3.2, 3.5, progress),
        THREE.MathUtils.lerp(2.0, 6.0, progress)
      );
    } else if (t < 9.0) {
      // --- PHASE 2: MISSION INTRODUCTION (4 - 9s) ---
      // Eye-level tracking shot gliding past Central FIDS board into lounge towards security
      const progress = smoothEase(Math.min(1.0, (t - 4.0) / 5.0));
      camPos.set(
        THREE.MathUtils.lerp(0.0, 3.4, progress),
        THREE.MathUtils.lerp(5.0, 2.8, progress),
        THREE.MathUtils.lerp(-8.8, 0.5, progress)
      );
      targetPos.set(
        THREE.MathUtils.lerp(1.5, 5.5, progress),
        THREE.MathUtils.lerp(3.5, 2.0, progress),
        THREE.MathUtils.lerp(6.0, 7.5, progress)
      );
    } else if (t < 14.0) {
      // --- PHASE 3: OBJECTIVE PREVIEW (9 - 14s) ---
      // Focus on Gate 07 portal, gate sign, podium, and open jet bridge corridor
      const progress = smoothEase(Math.min(1.0, (t - 9.0) / 5.0));
      camPos.set(
        THREE.MathUtils.lerp(3.4, 7.8, progress),
        THREE.MathUtils.lerp(2.8, 2.3, progress),
        THREE.MathUtils.lerp(0.5, 9.2, progress)
      );
      targetPos.set(
        THREE.MathUtils.lerp(5.5, 10.0, progress),
        THREE.MathUtils.lerp(2.0, 2.2, progress),
        THREE.MathUtils.lerp(7.5, 12.5, progress)
      );
    } else if (t < 17.5) {
      // --- PHASE 4: TRANSITION TO GAMEPLAY (14 - 17.5s) ---
      // Smooth camera blend down to player start position: [0, 1.62, -11] looking forward
      const progress = smoothEase(Math.min(1.0, (t - 14.0) / 3.5));
      camPos.set(
        THREE.MathUtils.lerp(7.8, 0.0, progress),
        THREE.MathUtils.lerp(2.3, 1.62, progress),
        THREE.MathUtils.lerp(9.2, -11.0, progress)
      );
      targetPos.set(
        THREE.MathUtils.lerp(10.0, 0.0, progress),
        THREE.MathUtils.lerp(2.2, 1.62, progress),
        THREE.MathUtils.lerp(12.5, 12.0, progress)
      );
    } else {
      // Transition complete -> Hand off to gameplay
      completedRef.current = true;
      camPos.set(0.0, 1.62, -11.0);
      targetPos.set(0.0, 1.62, 12.0);
      state.camera.position.copy(camPos);
      state.camera.lookAt(targetPos);
      onIntroComplete?.();
      return;
    }

    state.camera.position.copy(camPos);
    cameraTargetRef.current.copy(targetPos);
    state.camera.lookAt(cameraTargetRef.current);
  });

  return (
    <group>
      {/* Lighting setup for Airport Level */}
      <LightingSetup level={1} />

      {/* Terminal Concourse, Security Checkpoint, Gate 7, and Jet Bridge */}
      <AirportEnvironment playerPos={[0, 0, -11]} securityCleared={false} />

      {/* Populated Terminal Lounge Passengers */}
      <AirportPassengers />
    </group>
  );
};
