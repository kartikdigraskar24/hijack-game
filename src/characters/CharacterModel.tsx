// CharacterModel.tsx - Articulated procedural 3D Humanoid with realistic proportions, facial features & expressions
import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export type CharacterAnimState = 'IDLE' | 'WALK' | 'SIT' | 'TALK' | 'CROUCH';
export type CharacterExpression = 'NEUTRAL' | 'FRIENDLY' | 'CONCERNED' | 'FEAR' | 'ANGRY' | 'SERIOUS';

interface CharacterModelProps {
  clothingColor?: string;
  pantsColor?: string;
  skinTone?: string;
  hairColor?: string;
  animState?: CharacterAnimState;
  expression?: CharacterExpression;
  hasUniformAccents?: boolean; // Epaulets, tie/scarf for flight crew
  hasJacket?: boolean;
  scale?: number;
  rotationY?: number;
  isNpc?: boolean;
  hideHead?: boolean;
  weapon?: 'PISTOL' | 'SWORD' | 'NONE';
}

export const CharacterModel: React.FC<CharacterModelProps> = ({
  clothingColor = '#2B3A4A',
  pantsColor = '#1C242F',
  skinTone = '#D6A584',
  hairColor = '#1A1817',
  animState = 'IDLE',
  expression = 'NEUTRAL',
  hasUniformAccents = false,
  hasJacket = false,
  scale = 1.0,
  rotationY = 0,
  isNpc = false,
  hideHead = false,
  weapon = 'NONE',
}) => {
  const rootGroupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const torsoRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftShinRef = useRef<THREE.Group>(null);
  const rightShinRef = useRef<THREE.Group>(null);

  // Materials memoized for performance
  const skinMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: skinTone,
    roughness: 0.6,
  }), [skinTone]);

  const clothesMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: clothingColor,
    roughness: 0.7,
  }), [clothingColor]);

  const pantsMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: pantsColor,
    roughness: 0.8,
  }), [pantsColor]);

  const hairMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: hairColor,
    roughness: 0.9,
  }), [hairColor]);

  const shoeMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#111317',
    roughness: 0.4,
  }), []);

  const goldAccentMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#D4AF37',
    metalness: 0.8,
    roughness: 0.3,
  }), []);

  // Facial feature materials
  const eyeWhiteMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#FFFFFF',
    roughness: 0.2,
  }), []);

  const pupilMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#0F172A',
    roughness: 0.1,
  }), []);

  const mouthNeutralMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#9F4949',
    roughness: 0.5,
  }), []);

  const mouthOpenMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#3B0707',
    roughness: 0.4,
  }), []);

  const teethMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#F8FAFC',
    roughness: 0.2,
  }), []);

  const weaponMetalMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1E293B',
    metalness: 0.85,
    roughness: 0.25,
  }), []);

  const weaponSteelMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#E2E8F0',
    metalness: 0.92,
    roughness: 0.18,
  }), []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (animState === 'WALK') {
      const walkSpeed = 8.5;
      const swingAngle = Math.sin(time * walkSpeed) * 0.55;
      const bounce = Math.abs(Math.sin(time * walkSpeed)) * 0.05;

      // Legs swing in opposite phases
      if (leftLegRef.current) leftLegRef.current.rotation.x = swingAngle;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -swingAngle;

      // Knee bend when leg moves back
      if (leftShinRef.current) {
        leftShinRef.current.rotation.x = swingAngle < 0 ? -swingAngle * 0.8 : 0.05;
      }
      if (rightShinRef.current) {
        rightShinRef.current.rotation.x = -swingAngle < 0 ? swingAngle * 0.8 : 0.05;
      }

      // Opposite arm swings
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = -swingAngle * 0.65;
        leftArmRef.current.rotation.z = 0.08;
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = swingAngle * 0.65;
        rightArmRef.current.rotation.z = -0.08;
      }

      // Subtle torso bounce and sway
      if (torsoRef.current) {
        torsoRef.current.position.y = 0.9 + bounce;
        torsoRef.current.rotation.y = Math.sin(time * walkSpeed) * 0.04;
      }
      if (headRef.current) {
        headRef.current.rotation.y = -Math.sin(time * walkSpeed) * 0.03;
      }

    } else if (animState === 'SIT') {
      // Seated pose: thighs bent 90 degrees forward, shins bent 90 degrees down
      if (torsoRef.current) torsoRef.current.position.y = 0.55;
      if (leftLegRef.current) {
        leftLegRef.current.rotation.x = -Math.PI / 2;
        leftLegRef.current.rotation.y = 0.05;
        leftLegRef.current.position.y = 0.45;
      }
      if (rightLegRef.current) {
        rightLegRef.current.rotation.x = -Math.PI / 2;
        rightLegRef.current.rotation.y = -0.05;
        rightLegRef.current.position.y = 0.45;
      }
      if (leftShinRef.current) leftShinRef.current.rotation.x = Math.PI / 2;
      if (rightShinRef.current) rightShinRef.current.rotation.x = Math.PI / 2;

      // Relaxed arms on lap
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = -0.4;
        leftArmRef.current.rotation.z = 0.15;
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -0.4;
        rightArmRef.current.rotation.z = -0.15;
      }
      // Gentle idle head look
      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(time * 0.6) * 0.15;
        headRef.current.rotation.x = Math.sin(time * 0.4) * 0.05;
      }

    } else if (animState === 'TALK') {
      // Standing and talking
      const breath = Math.sin(time * 2.0) * 0.02;
      if (torsoRef.current) torsoRef.current.position.y = 0.9 + breath;
      if (leftLegRef.current) {
        leftLegRef.current.rotation.x = 0;
        leftLegRef.current.position.y = 0.85;
      }
      if (rightLegRef.current) {
        rightLegRef.current.rotation.x = 0;
        rightLegRef.current.position.y = 0.85;
      }
      if (leftShinRef.current) leftShinRef.current.rotation.x = 0;
      if (rightShinRef.current) rightShinRef.current.rotation.x = 0;

      // Gesturing right hand
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -0.6 + Math.sin(time * 3.5) * 0.25;
        rightArmRef.current.rotation.z = -0.3 + Math.cos(time * 2.5) * 0.1;
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = -0.1;
        leftArmRef.current.rotation.z = 0.1;
      }
      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(time * 1.5) * 0.12;
        headRef.current.rotation.x = Math.sin(time * 3.0) * 0.06;
      }

    } else if (animState === 'CROUCH') {
      // Hunched crouch
      if (torsoRef.current) {
        torsoRef.current.position.y = 0.65;
        torsoRef.current.rotation.x = 0.35;
      }
      if (leftLegRef.current) {
        leftLegRef.current.rotation.x = -0.7;
        leftLegRef.current.position.y = 0.6;
      }
      if (rightLegRef.current) {
        rightLegRef.current.rotation.x = -0.7;
        rightLegRef.current.position.y = 0.6;
      }
      if (leftShinRef.current) leftShinRef.current.rotation.x = 1.1;
      if (rightShinRef.current) rightShinRef.current.rotation.x = 1.1;
      if (leftArmRef.current) leftArmRef.current.rotation.x = -0.5;
      if (rightArmRef.current) rightArmRef.current.rotation.x = -0.5;

    } else {
      // IDLE breathing
      const breath = Math.sin(time * 1.8) * 0.015;
      if (torsoRef.current) {
        torsoRef.current.position.y = 0.9 + breath;
        torsoRef.current.rotation.x = 0;
        torsoRef.current.rotation.y = 0;
      }
      if (leftLegRef.current) {
        leftLegRef.current.rotation.x = 0;
        leftLegRef.current.position.y = 0.85;
      }
      if (rightLegRef.current) {
        rightLegRef.current.rotation.x = 0;
        rightLegRef.current.position.y = 0.85;
      }
      if (leftShinRef.current) leftShinRef.current.rotation.x = 0;
      if (rightShinRef.current) rightShinRef.current.rotation.x = 0;
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = Math.sin(time * 1.2) * 0.03;
        leftArmRef.current.rotation.z = 0.07;
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -Math.sin(time * 1.2) * 0.03;
        rightArmRef.current.rotation.z = -0.07;
      }
      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(time * 0.5) * 0.08;
      }
    }

    // Weapon brandishing poses (overrides arm motion)
    if (weapon === 'PISTOL' && rightArmRef.current) {
      rightArmRef.current.rotation.x = -Math.PI / 2 + Math.sin(time * 2.0) * 0.03;
      rightArmRef.current.rotation.y = -0.12;
      rightArmRef.current.rotation.z = 0;
    } else if (weapon === 'SWORD' && rightArmRef.current) {
      rightArmRef.current.rotation.x = -Math.PI / 2.6 + Math.sin(time * 1.5) * 0.06;
      rightArmRef.current.rotation.y = 0.22;
      rightArmRef.current.rotation.z = -0.28;
    }

    // Hostage fear trembling & defensive hands up pose
    if (expression === 'FEAR' && animState !== 'SIT') {
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = -1.25 + Math.sin(time * 8.0) * 0.02;
        leftArmRef.current.rotation.z = 0.38;
      }
      if (rightArmRef.current && weapon === 'NONE') {
        rightArmRef.current.rotation.x = -1.25 + Math.cos(time * 8.0) * 0.02;
        rightArmRef.current.rotation.z = -0.38;
      }
      if (torsoRef.current) {
        torsoRef.current.position.y += Math.sin(time * 10.0) * 0.004;
      }
    }
  });

  return (
    <group ref={rootGroupRef} scale={scale} rotation={[0, rotationY, 0]}>
      {/* Root offset to ground level */}
      <group position={[0, 0, 0]}>
        
        {/* --- TORSO & CHEST --- */}
        <group ref={torsoRef} position={[0, 0.9, 0]}>
          {/* Main torso mesh */}
          <mesh castShadow receiveShadow material={clothesMaterial} position={[0, 0.28, 0]}>
            <boxGeometry args={[0.42, 0.55, 0.24]} />
          </mesh>

          {/* Jacket collar / shirt lapel */}
          {hasJacket && (
            <mesh castShadow material={clothesMaterial} position={[0, 0.45, 0.08]}>
              <boxGeometry args={[0.34, 0.16, 0.12]} />
            </mesh>
          )}

          {/* Flight crew uniform epaulets / tie / scarf */}
          {hasUniformAccents && (
            <>
              {/* Gold shoulder stripes */}
              <mesh material={goldAccentMaterial} position={[-0.2, 0.52, 0]}>
                <boxGeometry args={[0.08, 0.02, 0.16]} />
              </mesh>
              <mesh material={goldAccentMaterial} position={[0.2, 0.52, 0]}>
                <boxGeometry args={[0.08, 0.02, 0.16]} />
              </mesh>
              {/* Airline badge / pin */}
              <mesh material={goldAccentMaterial} position={[-0.12, 0.42, 0.13]}>
                <boxGeometry args={[0.06, 0.03, 0.02]} />
              </mesh>
            </>
          )}

          {/* Belt / Waist */}
          <mesh material={shoeMaterial} position={[0, 0.02, 0]}>
            <boxGeometry args={[0.4, 0.07, 0.23]} />
          </mesh>

          {/* --- NECK & HEAD --- */}
          {!hideHead && (
            <group ref={headRef} position={[0, 0.6, 0]}>
              {/* Neck */}
              <mesh material={skinMaterial} position={[0, 0, 0]}>
                <cylinderGeometry args={[0.065, 0.075, 0.1, 12]} />
              </mesh>
              {/* Head Base */}
              <mesh castShadow material={skinMaterial} position={[0, 0.15, 0]}>
                <boxGeometry args={[0.22, 0.25, 0.22]} />
              </mesh>
              {/* Hair */}
              <mesh material={hairMaterial} position={[0, 0.24, -0.02]}>
                <boxGeometry args={[0.24, 0.14, 0.24]} />
              </mesh>
              {/* Hair Bangs/Sides */}
              <mesh material={hairMaterial} position={[0, 0.28, 0.06]}>
                <boxGeometry args={[0.23, 0.07, 0.1]} />
              </mesh>

              {/* === FACIAL FEATURES === */}
              {/* Left Eye Sclera */}
              <mesh position={[-0.055, 0.165, 0.112]} material={eyeWhiteMat}>
                <boxGeometry args={[0.042, 0.026, 0.008]} />
              </mesh>
              {/* Left Pupil */}
              <mesh position={[-0.055, 0.165, 0.116]} material={pupilMat}>
                <boxGeometry args={[0.022, 0.022, 0.006]} />
              </mesh>

              {/* Right Eye Sclera */}
              <mesh position={[0.055, 0.165, 0.112]} material={eyeWhiteMat}>
                <boxGeometry args={[0.042, 0.026, 0.008]} />
              </mesh>
              {/* Right Pupil */}
              <mesh position={[0.055, 0.165, 0.116]} material={pupilMat}>
                <boxGeometry args={[0.022, 0.022, 0.006]} />
              </mesh>

              {/* Eyebrows with Expression Slant */}
              <group position={[-0.055, expression === 'FEAR' ? 0.205 : expression === 'ANGRY' ? 0.19 : 0.195, 0.116]}
                     rotation={[0, 0, expression === 'ANGRY' ? 0.28 : expression === 'FEAR' ? -0.25 : expression === 'CONCERNED' ? -0.15 : 0]}>
                <mesh material={hairMaterial}>
                  <boxGeometry args={[0.046, 0.012, 0.006]} />
                </mesh>
              </group>
              <group position={[0.055, expression === 'FEAR' ? 0.205 : expression === 'ANGRY' ? 0.19 : 0.195, 0.116]}
                     rotation={[0, 0, expression === 'ANGRY' ? -0.28 : expression === 'FEAR' ? 0.25 : expression === 'CONCERNED' ? 0.15 : 0]}>
                <mesh material={hairMaterial}>
                  <boxGeometry args={[0.046, 0.012, 0.006]} />
                </mesh>
              </group>

              {/* 3D Nose (Bridge & Tip) */}
              <mesh position={[0, 0.14, 0.122]} material={skinMaterial}>
                <boxGeometry args={[0.025, 0.042, 0.025]} />
              </mesh>
              <mesh position={[0, 0.125, 0.128]} material={skinMaterial}>
                <boxGeometry args={[0.032, 0.018, 0.02]} />
              </mesh>

              {/* Mouth with Expression */}
              {expression === 'FEAR' ? (
                // Open gasping mouth with teeth
                <group position={[0, 0.078, 0.114]}>
                  <mesh material={mouthOpenMat}>
                    <boxGeometry args={[0.06, 0.038, 0.008]} />
                  </mesh>
                  <mesh position={[0, 0.01, 0.003]} material={teethMat}>
                    <boxGeometry args={[0.045, 0.01, 0.004]} />
                  </mesh>
                </group>
              ) : expression === 'ANGRY' ? (
                // Grimacing wide mouth
                <group position={[0, 0.078, 0.114]}>
                  <mesh material={mouthOpenMat}>
                    <boxGeometry args={[0.07, 0.028, 0.008]} />
                  </mesh>
                  <mesh position={[0, 0.005, 0.003]} material={teethMat}>
                    <boxGeometry args={[0.055, 0.012, 0.004]} />
                  </mesh>
                </group>
              ) : expression === 'FRIENDLY' ? (
                // Gentle smile
                <mesh position={[0, 0.082, 0.114]} material={mouthNeutralMat} rotation={[0, 0, 0]}>
                  <boxGeometry args={[0.065, 0.016, 0.008]} />
                </mesh>
              ) : (
                // Neutral / Serious closed mouth
                <mesh position={[0, 0.08, 0.114]} material={mouthNeutralMat}>
                  <boxGeometry args={[0.05, 0.012, 0.008]} />
                </mesh>
              )}
            </group>
          )}

          {/* --- LEFT ARM (Pivot at shoulder) --- */}
          <group ref={leftArmRef} position={[-0.26, 0.48, 0]}>
            {/* Shoulder to elbow */}
            <mesh castShadow material={clothesMaterial} position={[0, -0.15, 0]}>
              <boxGeometry args={[0.1, 0.3, 0.11]} />
            </mesh>
            {/* Forearm */}
            <mesh castShadow material={clothesMaterial} position={[0, -0.38, 0.01]}>
              <boxGeometry args={[0.09, 0.22, 0.09]} />
            </mesh>
            {/* Hand */}
            <mesh material={skinMaterial} position={[0, -0.52, 0.01]}>
              <boxGeometry args={[0.07, 0.1, 0.07]} />
            </mesh>
          </group>

          {/* --- RIGHT ARM (Pivot at shoulder) --- */}
          <group ref={rightArmRef} position={[0.26, 0.48, 0]}>
            {/* Shoulder to elbow */}
            <mesh castShadow material={clothesMaterial} position={[0, -0.15, 0]}>
              <boxGeometry args={[0.1, 0.3, 0.11]} />
            </mesh>
            {/* Forearm */}
            <mesh castShadow material={clothesMaterial} position={[0, -0.38, 0.01]}>
              <boxGeometry args={[0.09, 0.22, 0.09]} />
            </mesh>
            {/* Hand */}
            <mesh material={skinMaterial} position={[0, -0.52, 0.01]}>
              <boxGeometry args={[0.07, 0.1, 0.07]} />
            </mesh>

            {/* --- WEAPON PROPS ATTACHED TO RIGHT HAND --- */}
            {weapon === 'PISTOL' && (
              <group position={[0, -0.55, 0.08]} rotation={[-Math.PI / 2, 0, 0]}>
                {/* Gun Grip */}
                <mesh material={weaponMetalMat} position={[0, -0.04, -0.02]} rotation={[0.2, 0, 0]}>
                  <boxGeometry args={[0.035, 0.09, 0.04]} />
                </mesh>
                {/* Gun Slide / Barrel */}
                <mesh material={weaponMetalMat} position={[0, 0.02, 0.06]}>
                  <boxGeometry args={[0.04, 0.045, 0.18]} />
                </mesh>
                {/* Barrel Tip */}
                <mesh material={weaponSteelMat} position={[0, 0.02, 0.155]}>
                  <cylinderGeometry args={[0.01, 0.01, 0.02, 8]} />
                </mesh>
              </group>
            )}

            {weapon === 'SWORD' && (
              <group position={[0, -0.55, 0.08]} rotation={[-Math.PI / 3, 0, 0]}>
                {/* Sword Hilt */}
                <mesh material={shoeMaterial} position={[0, -0.04, 0]}>
                  <cylinderGeometry args={[0.018, 0.018, 0.14, 8]} />
                </mesh>
                {/* Crossguard */}
                <mesh material={goldAccentMaterial} position={[0, 0.04, 0]}>
                  <boxGeometry args={[0.14, 0.02, 0.03]} />
                </mesh>
                {/* Blade */}
                <mesh material={weaponSteelMat} position={[0, 0.38, 0]}>
                  <boxGeometry args={[0.04, 0.65, 0.008]} />
                </mesh>
                {/* Blade Tip */}
                <mesh material={weaponSteelMat} position={[0, 0.73, 0]} rotation={[0, 0, Math.PI / 4]}>
                  <boxGeometry args={[0.028, 0.028, 0.008]} />
                </mesh>
              </group>
            )}
          </group>
        </group>

        {/* --- LEFT LEG (Pivot at hip) --- */}
        <group ref={leftLegRef} position={[-0.12, 0.85, 0]}>
          {/* Thigh */}
          <mesh castShadow material={pantsMaterial} position={[0, -0.22, 0]}>
            <boxGeometry args={[0.15, 0.44, 0.16]} />
          </mesh>
          {/* Shin & Foot (Pivot at knee) */}
          <group ref={leftShinRef} position={[0, -0.44, 0]}>
            <mesh castShadow material={pantsMaterial} position={[0, -0.18, 0]}>
              <boxGeometry args={[0.13, 0.38, 0.14]} />
            </mesh>
            {/* Shoe */}
            <mesh castShadow material={shoeMaterial} position={[0, -0.38, 0.04]}>
              <boxGeometry args={[0.14, 0.09, 0.22]} />
            </mesh>
          </group>
        </group>

        {/* --- RIGHT LEG (Pivot at hip) --- */}
        <group ref={rightLegRef} position={[0.12, 0.85, 0]}>
          {/* Thigh */}
          <mesh castShadow material={pantsMaterial} position={[0, -0.22, 0]}>
            <boxGeometry args={[0.15, 0.44, 0.16]} />
          </mesh>
          {/* Shin & Foot (Pivot at knee) */}
          <group ref={rightShinRef} position={[0, -0.44, 0]}>
            <mesh castShadow material={pantsMaterial} position={[0, -0.18, 0]}>
              <boxGeometry args={[0.13, 0.38, 0.14]} />
            </mesh>
            {/* Shoe */}
            <mesh castShadow material={shoeMaterial} position={[0, -0.38, 0.04]}>
              <boxGeometry args={[0.14, 0.09, 0.22]} />
            </mesh>
          </group>
        </group>

      </group>
    </group>
  );
};
