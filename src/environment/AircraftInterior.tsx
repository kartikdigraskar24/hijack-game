// AircraftInterior.tsx - Expanded, spacious 3-3 commercial airliner cabin interior (16 rows, dual galleys)
import React, { useMemo } from 'react';
import * as THREE from 'three';

interface AircraftInteriorProps {
  flightPhase?: string;
}

export const CABIN_ROWS = [
  { rowNumber: 5, z: -5.3 },
  { rowNumber: 6, z: -4.1 },
  { rowNumber: 7, z: -2.9 },
  { rowNumber: 8, z: -1.7 },
  { rowNumber: 9, z: -0.5 },
  { rowNumber: 10, z: 0.7 },
  { rowNumber: 11, z: 1.9 }, // Ananya Roy in Seat 11A
  { rowNumber: 12, z: 3.1 }, // Arjun Mehra in Seat 12A (Window); Aditya Verma in Seat 12C
  { rowNumber: 13, z: 4.3 },
  { rowNumber: 14, z: 5.5 }, // Vikram Malhotra in Seat 14B
  { rowNumber: 15, z: 6.7 },
  { rowNumber: 16, z: 7.9 },
  { rowNumber: 17, z: 9.1 },
  { rowNumber: 18, z: 10.3 },
  { rowNumber: 19, z: 11.5 },
  { rowNumber: 20, z: 12.7 },
];

export const AircraftInterior: React.FC<AircraftInteriorProps> = ({ flightPhase = 'CRUISING' }) => {
  // PBR Materials (Memoized)
  const carpetMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#182230',
    roughness: 0.85,
  }), []);

  const cabinWallMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#E8ECF2',
    roughness: 0.55,
  }), []);

  const ceilingMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#F4F7FB',
    roughness: 0.5,
  }), []);

  const seatCushionMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#123B70', // Aviation navy blue
    roughness: 0.7,
  }), []);

  const seatFrameMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#2B3544',
    roughness: 0.45,
    metalness: 0.4,
  }), []);

  const headrestCoverMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#FFFFFF',
    roughness: 0.8,
  }), []);

  const overheadBinMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#D1D9E4',
    roughness: 0.4,
  }), []);

  const windowGlassMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#7DD3FC',
    roughness: 0.1,
    transparent: true,
    opacity: 0.45,
  }), []);

  const trolleyMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#94A3B8',
    metalness: 0.7,
    roughness: 0.3,
  }), []);

  const totalLength = 29.0;
  const centerZ = 2.0;

  return (
    <group>
      {/* --- CABIN FLOOR & CARPET --- */}
      {/* Center walking aisle (Width 0.9m) */}
      <mesh receiveShadow material={carpetMat} position={[0, -0.01, centerZ]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.0, totalLength]} />
      </mesh>
      {/* Left 3-seat bay floor */}
      <mesh receiveShadow material={carpetMat} position={[-1.15, -0.01, centerZ]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.4, totalLength]} />
      </mesh>
      {/* Right 3-seat bay floor */}
      <mesh receiveShadow material={carpetMat} position={[1.15, -0.01, centerZ]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.4, totalLength]} />
      </mesh>

      {/* --- CABIN CEILING & ARCHITECTURE --- */}
      {/* Center sculpted ceiling */}
      <mesh material={ceilingMat} position={[0, 2.45, centerZ]}>
        <boxGeometry args={[1.8, 0.08, totalLength]} />
      </mesh>
      {/* Continuous overhead LED light runner */}
      <mesh position={[0, 2.40, centerZ]}>
        <planeGeometry args={[0.35, totalLength - 0.4]} />
        <meshBasicMaterial color="#E0F2FE" />
      </mesh>

      {/* Overhead Luggage Compartments (Left & Right) */}
      <mesh castShadow material={overheadBinMat} position={[-1.4, 2.12, centerZ]}>
        <boxGeometry args={[0.75, 0.52, totalLength - 4]} />
      </mesh>
      <mesh castShadow material={overheadBinMat} position={[1.4, 2.12, centerZ]}>
        <boxGeometry args={[0.75, 0.52, totalLength - 4]} />
      </mesh>

      {/* --- SIDEWALLS & WINDOWS --- */}
      {/* Left Fuselage Wall: X = -1.85 */}
      <mesh castShadow receiveShadow material={cabinWallMat} position={[-1.85, 1.25, centerZ]}>
        <boxGeometry args={[0.1, 2.5, totalLength]} />
      </mesh>
      {/* Right Fuselage Wall: X = 1.85 */}
      <mesh castShadow receiveShadow material={cabinWallMat} position={[1.85, 1.25, centerZ]}>
        <boxGeometry args={[0.1, 2.5, totalLength]} />
      </mesh>

      {/* Windows aligned with rows */}
      {CABIN_ROWS.map(({ rowNumber, z }) => (
        <React.Fragment key={`win-${rowNumber}`}>
          {/* Left Window */}
          <group position={[-1.78, 1.3, z]}>
            <mesh material={windowGlassMat}>
              <boxGeometry args={[0.04, 0.46, 0.32]} />
            </mesh>
            {/* Row Number Placard (3D Mesh for performance) */}
            <mesh position={[0.05, 0.48, 0]}>
              <boxGeometry args={[0.02, 0.1, 0.22]} />
              <meshStandardMaterial color="#1E3A8A" />
            </mesh>
          </group>

          {/* Right Window */}
          <group position={[1.78, 1.3, z]}>
            <mesh material={windowGlassMat}>
              <boxGeometry args={[0.04, 0.46, 0.32]} />
            </mesh>
          </group>
        </React.Fragment>
      ))}

      {/* --- 16 SEAT ROWS (3–3 Commercial Layout: Seats A-B-C | Aisle | D-E-F) --- */}
      {CABIN_ROWS.map(({ rowNumber, z }) => (
        <group key={`row-${rowNumber}`} position={[0, 0, z]}>
          {/* LEFT 3-SEAT TRIPLET (Seats A, B, C) */}
          <group position={[-1.05, 0, 0]}>
            {/* Continuous aluminum base frame */}
            <mesh castShadow material={seatFrameMat} position={[0, 0.22, 0]}>
              <boxGeometry args={[1.2, 0.44, 0.36]} />
            </mesh>

            {/* Seats A (Window -0.4), B (Middle 0.0), C (Aisle +0.4) */}
            {[-0.4, 0.0, 0.4].map((offsetX, sIdx) => (
              <group key={sIdx} position={[offsetX, 0, 0]}>
                {/* Bottom Cushion under passenger thighs */}
                <mesh castShadow material={seatCushionMat} position={[0, 0.46, -0.04]}>
                  <boxGeometry args={[0.36, 0.1, 0.45]} />
                </mesh>
                {/* Backrest behind passenger back */}
                <mesh castShadow material={seatCushionMat} position={[0, 0.82, 0.16]}>
                  <boxGeometry args={[0.36, 0.68, 0.1]} />
                </mesh>
                {/* White Antimacassar Headrest */}
                <mesh material={headrestCoverMat} position={[0, 1.08, 0.155]}>
                  <boxGeometry args={[0.28, 0.18, 0.02]} />
                </mesh>
                {/* Tray Table folded on back of seat */}
                <mesh material={seatFrameMat} position={[0, 0.74, 0.22]}>
                  <boxGeometry args={[0.32, 0.26, 0.02]} />
                </mesh>
                {/* Seat Pocket on back */}
                <mesh material={seatCushionMat} position={[0, 0.44, 0.22]}>
                  <boxGeometry args={[0.32, 0.2, 0.03]} />
                </mesh>
              </group>
            ))}

            {/* Armrests dividing the seats */}
            {[-0.6, -0.2, 0.2, 0.6].map((ax, aIdx) => (
              <mesh key={aIdx} castShadow material={seatFrameMat} position={[ax, 0.62, -0.04]}>
                <boxGeometry args={[0.05, 0.08, 0.36]} />
              </mesh>
            ))}
          </group>

          {/* RIGHT 3-SEAT TRIPLET (Seats D, E, F) */}
          <group position={[1.05, 0, 0]}>
            {/* Continuous aluminum base frame */}
            <mesh castShadow material={seatFrameMat} position={[0, 0.22, 0]}>
              <boxGeometry args={[1.2, 0.44, 0.36]} />
            </mesh>

            {/* Seats D (Aisle -0.4), E (Middle 0.0), F (Window +0.4) */}
            {[-0.4, 0.0, 0.4].map((offsetX, sIdx) => (
              <group key={sIdx} position={[offsetX, 0, 0]}>
                {/* Bottom Cushion */}
                <mesh castShadow material={seatCushionMat} position={[0, 0.46, -0.04]}>
                  <boxGeometry args={[0.36, 0.1, 0.45]} />
                </mesh>
                {/* Backrest behind passenger */}
                <mesh castShadow material={seatCushionMat} position={[0, 0.82, 0.16]}>
                  <boxGeometry args={[0.36, 0.68, 0.1]} />
                </mesh>
                {/* White Antimacassar Headrest */}
                <mesh material={headrestCoverMat} position={[0, 1.08, 0.155]}>
                  <boxGeometry args={[0.28, 0.18, 0.02]} />
                </mesh>
                {/* Tray Table on back */}
                <mesh material={seatFrameMat} position={[0, 0.74, 0.22]}>
                  <boxGeometry args={[0.32, 0.26, 0.02]} />
                </mesh>
                {/* Seat Pocket */}
                <mesh material={seatCushionMat} position={[0, 0.44, 0.22]}>
                  <boxGeometry args={[0.32, 0.2, 0.03]} />
                </mesh>
              </group>
            ))}

            {/* Armrests */}
            {[-0.6, -0.2, 0.2, 0.6].map((ax, aIdx) => (
              <mesh key={aIdx} castShadow material={seatFrameMat} position={[ax, 0.62, -0.04]}>
                <boxGeometry args={[0.05, 0.08, 0.36]} />
              </mesh>
            ))}
          </group>
        </group>
      ))}

      {/* --- FORWARD GALLEY & ARMORED COCKPIT BULKHEAD (Z = -12.0) --- */}
      <group position={[0, 0, -12.0]}>
        {/* Forward Bulkhead Wall */}
        <mesh castShadow receiveShadow material={cabinWallMat} position={[0, 1.25, 0]}>
          <boxGeometry args={[3.8, 2.5, 0.2]} />
        </mesh>

        {/* Armored Cockpit Door */}
        <mesh castShadow material={seatFrameMat} position={[0, 1.15, 0.11]}>
          <boxGeometry args={[0.95, 2.1, 0.06]} />
        </mesh>
        {/* Security keypad and spyhole */}
        <mesh position={[0.38, 1.25, 0.15]}>
          <boxGeometry args={[0.12, 0.2, 0.02]} />
          <meshBasicMaterial color="#0F172A" />
        </mesh>
        <mesh position={[0, 1.62, 0.15]}>
          <cylinderGeometry args={[0.03, 0.03, 0.04, 16]} />
          <meshBasicMaterial color="#0284C7" />
        </mesh>

        {/* Galley Preparation Counter */}
        <mesh castShadow material={trolleyMat} position={[-1.25, 0.5, 0.8]}>
          <boxGeometry args={[0.95, 1.0, 1.2]} />
        </mesh>
        {/* Interphone Station */}
        <mesh position={[-0.85, 1.45, 0.15]}>
          <boxGeometry args={[0.12, 0.35, 0.08]} />
          <meshStandardMaterial color="#334155" />
        </mesh>

        {/* Exit & Cockpit Sign */}
        <mesh position={[0, 2.25, 0.12]}>
          <boxGeometry args={[0.65, 0.18, 0.04]} />
          <meshBasicMaterial color="#059669" />
        </mesh>
      </group>

      {/* --- AFT / REAR GALLEY & LAVATORIES (Z = 16.5) --- */}
      <group position={[0, 0, 16.5]}>
        {/* Rear Bulkhead Wall */}
        <mesh castShadow receiveShadow material={cabinWallMat} position={[0, 1.25, 0]}>
          <boxGeometry args={[3.8, 2.5, 0.2]} />
        </mesh>

        {/* Service Cart Trolleys parked in galley */}
        <mesh castShadow material={trolleyMat} position={[-1.1, 0.5, -0.6]}>
          <boxGeometry args={[0.45, 0.95, 0.9]} />
        </mesh>
        <mesh castShadow material={trolleyMat} position={[1.1, 0.5, -0.6]}>
          <boxGeometry args={[0.45, 0.95, 0.9]} />
        </mesh>

        {/* Lavatory Doors */}
        <mesh material={seatFrameMat} position={[-0.85, 1.15, -0.09]}>
          <boxGeometry args={[0.75, 2.05, 0.04]} />
        </mesh>
        <mesh material={seatFrameMat} position={[0.85, 1.15, -0.09]}>
          <boxGeometry args={[0.75, 2.05, 0.04]} />
        </mesh>

        {/* Aft Exit Sign */}
        <mesh position={[0, 2.25, -0.12]}>
          <boxGeometry args={[0.65, 0.18, 0.04]} />
          <meshBasicMaterial color="#059669" />
        </mesh>
      </group>
    </group>
  );
};
