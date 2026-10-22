// ThirdPersonCamera.tsx - Anti-clipping orbital camera strictly constrained within aircraft & airport bounds
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { InputManager } from '../game/InputManager';

interface ThirdPersonCameraProps {
  targetPosition: [number, number, number];
  isSeated?: boolean;
  sensitivity?: number;
  fov?: number;
  level?: number;
}

export const ThirdPersonCamera: React.FC<ThirdPersonCameraProps> = ({
  targetPosition,
  isSeated = false,
  sensitivity = 1.0,
  fov = 65,
  level = 1,
}) => {
  const { camera } = useThree();
  const yawRef = useRef<number>(0);
  const pitchRef = useRef<number>(0.15);

  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
  }, [fov, camera]);

  useFrame(() => {
    // Read mouse delta from centralized InputManager
    const mouseDelta = InputManager.consumeMouseDelta();
    const sensFactor = 0.0022 * sensitivity;

    yawRef.current -= mouseDelta.x * sensFactor;
    pitchRef.current -= mouseDelta.y * sensFactor;

    const [tx, ty, tz] = targetPosition;

    if (level > 1) {
      // --- AIRCRAFT CABIN CAMERA CONSTRAINTS ---
      if (isSeated) {
        // Seated in Seat 12A: immersive seated eye perspective (cannot clip through seat/fuselage)
        // Clamp pitch so player cannot flip under seat or into ceiling
        pitchRef.current = Math.max(-0.45, Math.min(0.55, pitchRef.current));

        const cy = pitchRef.current;
        const cx = yawRef.current;
        const seatedDist = 0.45; // Tight first-person / close seated head orbit

        const eyeX = tx;
        const eyeY = ty + 1.1; // Head height of seated character
        const eyeZ = tz;

        let desiredX = eyeX + Math.sin(cx) * Math.cos(cy) * seatedDist;
        let desiredY = eyeY + Math.sin(cy) * seatedDist;
        let desiredZ = eyeZ + Math.cos(cx) * Math.cos(cy) * seatedDist;

        // Strict seated boundary clamping
        desiredX = Math.max(-1.75, Math.min(-0.55, desiredX));
        desiredY = Math.max(0.75, Math.min(1.85, desiredY));
        desiredZ = Math.max(tz - 0.6, Math.min(tz + 0.6, desiredZ));

        const desiredCamPos = new THREE.Vector3(desiredX, desiredY, desiredZ);
        camera.position.lerp(desiredCamPos, 0.2);

        // Look forward/around from seat
        const lookTarget = new THREE.Vector3(
          eyeX - Math.sin(cx) * Math.cos(cy) * 3.0,
          eyeY - Math.sin(cy) * 3.0,
          eyeZ - Math.cos(cx) * Math.cos(cy) * 3.0
        );
        camera.lookAt(lookTarget);
      } else {
        // Walking down aircraft aisle: tight follow camera
        // Clamp pitch to prevent looking through aircraft floor or ceiling
        pitchRef.current = Math.max(-0.4, Math.min(0.65, pitchRef.current));

        const cy = pitchRef.current;
        const cx = yawRef.current;

        // Base follow distance inside aircraft is kept close (1.6m) to prevent aisle clipping
        const baseDistance = 1.7;
        const camHeight = 1.45;

        let offsetX = Math.sin(cx) * Math.cos(cy) * baseDistance;
        let offsetZ = Math.cos(cx) * Math.cos(cy) * baseDistance;
        let offsetY = Math.sin(cy) * baseDistance + camHeight;

        let desiredX = tx + offsetX;
        let desiredY = ty + offsetY;
        let desiredZ = tz + offsetZ;

        // --- HARD CABIN INTERIOR BOUNDS ENFORCEMENT ---
        // Fuselage inner walls are at X = ±1.85. Camera must never cross ±1.52.
        const minCabinX = -1.52;
        const maxCabinX = 1.52;
        if (desiredX < minCabinX || desiredX > maxCabinX) {
          desiredX = Math.max(minCabinX, Math.min(maxCabinX, desiredX));
        }

        // Ceiling is at Y = 2.45. Floor is at Y = 0.0.
        desiredY = Math.max(0.65, Math.min(2.25, desiredY));

        // Forward bulkhead at Z = -11.5, Aft bulkhead at Z = 15.5
        desiredZ = Math.max(-11.5, Math.min(15.5, desiredZ));

        const desiredCamPos = new THREE.Vector3(desiredX, desiredY, desiredZ);
        camera.position.lerp(desiredCamPos, 0.2);

        // Look at character's head/shoulders
        const lookTarget = new THREE.Vector3(tx, ty + 1.25, tz);
        camera.lookAt(lookTarget);
      }
    } else {
      // --- AIRPORT TERMINAL CAMERA (LEVEL 1) ---
      pitchRef.current = Math.max(-0.65, Math.min(1.0, pitchRef.current));

      const cy = pitchRef.current;
      const cx = yawRef.current;
      const distance = 2.8;
      const height = 1.6;

      let desiredX = tx + Math.sin(cx) * Math.cos(cy) * distance;
      let desiredY = ty + Math.sin(cy) * distance + height;
      let desiredZ = tz + Math.cos(cx) * Math.cos(cy) * distance;

      // Airport terminal boundary clamping
      desiredX = Math.max(-13.2, Math.min(13.2, desiredX));
      desiredY = Math.max(0.5, Math.min(8.0, desiredY));
      if (desiredX > 7.5 && desiredZ > 6.0) {
        // Jet bridge corridor
        desiredX = Math.max(8.8, Math.min(11.2, desiredX));
        desiredZ = Math.min(23.5, desiredZ);
      } else {
        desiredZ = Math.max(-13.0, Math.min(13.0, desiredZ));
      }

      const desiredCamPos = new THREE.Vector3(desiredX, desiredY, desiredZ);
      camera.position.lerp(desiredCamPos, 0.15);

      const lookTarget = new THREE.Vector3(tx, ty + 1.3, tz);
      camera.lookAt(lookTarget);
    }
  });

  return null;
};
