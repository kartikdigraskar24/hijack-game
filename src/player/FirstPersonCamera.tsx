// FirstPersonCamera.tsx - Smooth, responsive first-person camera system with zero lag and anti-clipping
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { InputManager } from '../game/InputManager';

interface FirstPersonCameraProps {
  targetPosition: [number, number, number];
  isSeated?: boolean;
  isCrouching?: boolean;
  sensitivity?: number;
  fov?: number;
  level?: number;
  isFirstPerson?: boolean;
}

export const FirstPersonCamera: React.FC<FirstPersonCameraProps> = ({
  targetPosition,
  isSeated = false,
  isCrouching = false,
  sensitivity = 1.0,
  fov = 70,
  level = 1,
  isFirstPerson = true,
}) => {
  const { camera } = useThree();
  const yawRef = useRef<number>(level > 1 ? Math.PI : 0); // Face forward in aircraft by default
  const pitchRef = useRef<number>(0);
  const currentEyeHeight = useRef<number>(1.62);

  // Configure camera properties on mount or fov change
  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = fov;
      camera.near = 0.05; // Prevent clipping through close walls and seats
      camera.updateProjectionMatrix();
    }
  }, [fov, camera]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);

    // Consume accumulated mouse delta
    const mouseDelta = InputManager.consumeMouseDelta();
    // High-precision smooth sensitivity
    const sensFactor = 0.0022 * sensitivity;

    yawRef.current -= mouseDelta.x * sensFactor;
    pitchRef.current -= mouseDelta.y * sensFactor;

    // Pitch limits: -80 to +80 degrees to prevent tumbling
    const maxPitch = isSeated ? 0.75 : 1.4;
    const minPitch = isSeated ? -0.65 : -1.4;
    pitchRef.current = Math.max(minPitch, Math.min(maxPitch, pitchRef.current));

    const [tx, ty, tz] = targetPosition;

    // Target eye height
    const targetEyeY = isSeated ? 1.15 : (isCrouching ? 1.05 : 1.62);
    // Smooth eye height transition on crouch/sit
    currentEyeHeight.current = THREE.MathUtils.lerp(
      currentEyeHeight.current,
      targetEyeY,
      Math.min(1.0, dt * 16)
    );

    if (isFirstPerson) {
      // --- FIRST-PERSON CAMERA ---
      // Direct 1:1 synchronization with player position - ZERO LAG
      camera.position.set(tx, ty + currentEyeHeight.current, tz);
      // Clean Euler rotation in 'YXZ' order (standard FPS camera math)
      camera.rotation.set(pitchRef.current, yawRef.current, 0, 'YXZ');
    } else {
      // --- THIRD-PERSON ORBITAL CAMERA (FALLBACK / TOGGLE) ---
      const cy = pitchRef.current;
      const cx = yawRef.current;
      const distance = level > 1 ? 1.4 : 2.5;

      const offsetX = Math.sin(cx) * Math.cos(cy) * distance;
      const offsetZ = Math.cos(cx) * Math.cos(cy) * distance;
      const offsetY = Math.sin(cy) * distance + currentEyeHeight.current;

      camera.position.set(tx + offsetX, ty + offsetY, tz + offsetZ);
      camera.lookAt(tx, ty + currentEyeHeight.current * 0.9, tz);
    }
  });

  return null;
};
