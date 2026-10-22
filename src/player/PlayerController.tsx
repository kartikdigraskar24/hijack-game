// PlayerController.tsx - Player avatar movement, physics, animations, and sound triggers
import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { CharacterModel, CharacterAnimState } from '../characters/CharacterModel';
import { InputManager } from '../game/InputManager';
import { AudioManager } from '../systems/AudioManager';

interface PlayerControllerProps {
  position: [number, number, number];
  onPositionChange: (pos: [number, number, number]) => void;
  isSeated: boolean;
  level: number;
  isPaused: boolean;
}

export const PlayerController: React.FC<PlayerControllerProps> = ({
  position,
  onPositionChange,
  isSeated,
  level,
  isPaused,
}) => {
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);

  // Velocity and physics state
  const velocity = useRef(new THREE.Vector3());
  const rotationY = useRef(0);
  const verticalVelocity = useRef(0);
  const isGrounded = useRef(true);
  const footstepTimer = useRef(0);

  const [animState, setAnimState] = useState<CharacterAnimState>('IDLE');

  // Movement constants
  const walkSpeed = 3.6;
  const runSpeed = 5.8;
  const crouchSpeed = 1.8;
  const jumpForce = 4.8;
  const gravity = 15.0;

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const dt = Math.min(delta, 0.05);

    // If seated, lock in seat pose and position
    if (isSeated) {
      if (animState !== 'SIT') setAnimState('SIT');
      groupRef.current.position.set(-1.45, 0, 3.1); // Row 12 Seat 12A coordinates
      groupRef.current.rotation.y = Math.PI; // Face towards front of aircraft
      onPositionChange([-1.45, 0, 3.1]);
      return;
    }

    if (isPaused) {
      if (animState !== 'IDLE') setAnimState('IDLE');
      return;
    }

    const input = InputManager.getState();
    const isCrouching = input.crouch;
    const isRunning = input.sprint && !isCrouching && (input.forward || input.backward || input.left || input.right);

    // Camera forward and right vectors projected onto XZ plane
    const camDirection = new THREE.Vector3();
    camera.getWorldDirection(camDirection);
    camDirection.y = 0;
    camDirection.normalize();

    const camRight = new THREE.Vector3();
    camRight.crossVectors(new THREE.Vector3(0, 1, 0), camDirection).normalize();

    // Calculate move vector
    const moveDir = new THREE.Vector3();
    if (input.forward) moveDir.add(camDirection);
    if (input.backward) moveDir.sub(camDirection);
    if (input.left) moveDir.add(camRight);
    if (input.right) moveDir.sub(camRight);

    const isMoving = moveDir.lengthSq() > 0.001;

    if (isMoving) {
      moveDir.normalize();

      // Smooth rotation toward movement vector
      const targetAngle = Math.atan2(moveDir.x, moveDir.z);
      let diff = (targetAngle - rotationY.current) % (Math.PI * 2);
      if (diff < -Math.PI) diff += Math.PI * 2;
      if (diff > Math.PI) diff -= Math.PI * 2;
      rotationY.current += diff * 12 * dt;

      // Accelerate according to locomotion stance (crouch / walk / run)
      const targetSpeed = isCrouching ? crouchSpeed : (isRunning ? runSpeed : walkSpeed);
      velocity.current.lerp(moveDir.clone().multiplyScalar(targetSpeed), 10 * dt);

      // Animation pose
      setAnimState(isCrouching ? 'CROUCH' : 'WALK');

      // Synchronized realistic footstep cadence:
      // Only trigger footsteps when the player is actively moving AND firmly grounded (not airborne/jumping)
      if (isGrounded.current) {
        footstepTimer.current += dt;
        // Natural cadence: running = 0.26s, walking = 0.40s, crouching = 0.58s
        const stepInterval = isCrouching ? 0.58 : (isRunning ? 0.26 : 0.40);
        if (footstepTimer.current >= stepInterval) {
          footstepTimer.current = 0;
          AudioManager.playFootstep(level > 1, isCrouching, isRunning);
        }
      } else {
        // Player is jumping or airborne - silence footsteps immediately
        footstepTimer.current = 0;
      }
    } else {
      // Damping and immediate footstep cessation when standing still
      velocity.current.lerp(new THREE.Vector3(0, 0, 0), 12 * dt);
      setAnimState(isCrouching ? 'CROUCH' : 'IDLE');
      footstepTimer.current = 0;
    }

    // Jump and Gravity
    if (input.jump && isGrounded.current && !isCrouching && level === 1) {
      verticalVelocity.current = jumpForce;
      isGrounded.current = false;
    }

    verticalVelocity.current -= gravity * dt;

    // Apply movement
    const newPos = groupRef.current.position.clone();
    newPos.x += velocity.current.x * dt;
    newPos.z += velocity.current.z * dt;
    newPos.y += verticalVelocity.current * dt;

    // Floor collision
    if (newPos.y <= 0) {
      newPos.y = 0;
      verticalVelocity.current = 0;
      isGrounded.current = true;
    }

    // Level-specific wall collision clamps
    if (level === 1) {
      // Gate 7 doorway opening is X: 8.0 to 12.0 at Front Wall Z = 12.0
      const inGateCorridor = newPos.x >= 8.1 && newPos.x <= 11.9;
      if (inGateCorridor && newPos.z >= 11.8) {
        // Inside jet bridge corridor beyond the Gate 7 threshold (Z: 11.8 to 23.5)
        newPos.x = Math.max(8.2, Math.min(11.8, newPos.x));
        newPos.z = Math.min(23.5, newPos.z);
      } else {
        // Main airport terminal concourse bounds
        newPos.x = Math.max(-15.0, Math.min(15.0, newPos.x));
        // Outside the Gate 7 opening, the front wall blocks at Z = 11.8; rear wall at Z = -13.5
        if (inGateCorridor) {
          newPos.z = Math.max(-13.5, newPos.z);
        } else {
          newPos.z = Math.max(-13.5, Math.min(11.8, newPos.z));
        }
      }
    } else {
      // Aircraft cabin interior bounds
      // Main aisle is between x: -0.45 and 0.45
      // Rows allow side access if near row z
      const nearRow12 = Math.abs(newPos.z - 3.1) < 0.8;
      const nearRow14 = Math.abs(newPos.z - 5.5) < 0.8;
      const nearGalley = newPos.z > 13.5 || newPos.z < -8.5;

      const maxX = (nearRow14 || nearGalley) ? 1.5 : 0.45;
      const minX = (nearRow12 || nearGalley) ? -1.5 : -0.45;

      newPos.x = Math.max(minX, Math.min(maxX, newPos.x));
      newPos.z = Math.max(-11.0, Math.min(15.5, newPos.z));
    }

    groupRef.current.position.copy(newPos);
    groupRef.current.rotation.y = rotationY.current;

    onPositionChange([newPos.x, newPos.y, newPos.z]);
  });

  return (
    <group ref={groupRef} position={position}>
      {/* 3D Model for Arjun Mehra (Neutral slate jacket, dark trousers) */}
      <CharacterModel
        clothingColor="#243447"
        pantsColor="#181F28"
        skinTone="#D6A584"
        hairColor="#151413"
        animState={animState}
        hasJacket={true}
        scale={1.0}
        hideHead={true}
      />
    </group>
  );
};
