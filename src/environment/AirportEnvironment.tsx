// AirportEnvironment.tsx - Explorable Airport Terminal with Populated Lounge & Security Checkpoint
import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { AircraftExterior } from './AircraftExterior';

interface AirportEnvironmentProps {
  playerPos?: [number, number, number];
  securityCleared?: boolean;
}

export const AirportEnvironment: React.FC<AirportEnvironmentProps> = ({
  playerPos = [0, 0, 0],
  securityCleared = false,
}) => {
  // PBR Materials (Memoized)
  const floorMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#DCE4EC',
    roughness: 0.25,
    metalness: 0.1,
  }), []);

  const wallMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#EDF2F7',
    roughness: 0.8,
  }), []);

  const glassMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#93C5FD',
    roughness: 0.1,
    transparent: true,
    opacity: 0.35,
  }), []);

  const tarmacMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#334155',
    roughness: 0.85,
  }), []);

  const metalMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1E3A5F',
    roughness: 0.4,
    metalness: 0.3,
  }), []);

  const seatMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1E293B',
    roughness: 0.6,
  }), []);

  const scannerMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#334155',
    metalness: 0.6,
    roughness: 0.3,
  }), []);

  const beltMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1E293B',
    roughness: 0.85,
  }), []);

  return (
    <group>
      {/* --- FLOORS --- */}
      {/* Main Terminal Interior Floor */}
      <mesh receiveShadow material={floorMat} position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[34, 30]} />
      </mesh>

      {/* Exterior Tarmac Apron (Beyond windows) */}
      <mesh receiveShadow material={tarmacMat} position={[32, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[40, 64]} />
      </mesh>

      {/* Yellow Taxiway Guide Lines */}
      <mesh position={[26, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.3, 50]} />
        <meshBasicMaterial color="#FBBF24" />
      </mesh>

      {/* --- WALLS & CEILING --- */}
      {/* Rear Terminal Entrance Wall (Z = -14) */}
      <mesh castShadow receiveShadow material={wallMat} position={[0, 4.5, -14]}>
        <boxGeometry args={[34, 9, 0.5]} />
      </mesh>

      {/* Left Terminal Wall: X = -16 */}
      <mesh castShadow receiveShadow material={wallMat} position={[-16, 4.5, 0]}>
        <boxGeometry args={[0.5, 9, 30]} />
      </mesh>

      {/* Front Wall (Z = 12.0) with Seamless Flush Doorway Opening for Boarding Gate 07 */}
      {/* Left Front Wall: spans X = -16 to X = 7.8 at Z = 12.0 */}
      <mesh castShadow receiveShadow material={wallMat} position={[-4.1, 4.5, 12.0]}>
        <boxGeometry args={[23.8, 9, 0.5]} />
      </mesh>
      {/* Right Front Wall: spans X = 12.2 to X = 16.0 at Z = 12.0 */}
      <mesh castShadow receiveShadow material={wallMat} position={[14.1, 4.5, 12.0]}>
        <boxGeometry args={[3.8, 9, 0.5]} />
      </mesh>
      {/* Overhead Transom Wall above Gate 07 Doorway: Y = 4.2 to 9.0 at Z = 12.0 */}
      <mesh castShadow receiveShadow material={wallMat} position={[10.0, 6.6, 12.0]}>
        <boxGeometry args={[4.4, 4.8, 0.5]} />
      </mesh>

      {/* Right Wall: Large Glass Curtain Windows overlooking Tarmac: X = 16 */}
      <mesh castShadow receiveShadow material={wallMat} position={[16, 0.8, 0]}>
        <boxGeometry args={[0.4, 1.6, 30]} />
      </mesh>
      <mesh material={glassMat} position={[16, 5.0, 0]}>
        <boxGeometry args={[0.1, 7.0, 30]} />
      </mesh>
      {[-12, -7, -2, 3, 8, 13].map((z, idx) => (
        <mesh key={idx} material={metalMat} position={[16, 5.0, z]}>
          <boxGeometry args={[0.3, 7.0, 0.2]} />
        </mesh>
      ))}

      {/* Terminal High Ceiling */}
      <mesh material={wallMat} position={[0, 9.0, 0]}>
        <boxGeometry args={[34, 0.4, 30]} />
      </mesh>

      {/* --- CHECK-IN DESKS (Entrance Area Z = -10) --- */}
      {[-8, -2, 4].map((x, idx) => (
        <group key={idx} position={[x, 0, -10]}>
          <mesh castShadow receiveShadow material={metalMat} position={[0, 0.6, 0]}>
            <boxGeometry args={[3.2, 1.2, 1.4]} />
          </mesh>
          <mesh material={floorMat} position={[0, 1.22, 0]}>
            <boxGeometry args={[3.3, 0.06, 1.5]} />
          </mesh>
          <mesh position={[0, 1.55, -0.3]}>
            <boxGeometry args={[0.7, 0.45, 0.08]} />
            <meshBasicMaterial color="#1E3A8A" />
          </mesh>
          <mesh position={[2.0, 0.15, 0]}>
            <boxGeometry args={[1.0, 0.3, 2.0]} />
            <meshStandardMaterial color="#475569" roughness={0.7} />
          </mesh>
        </group>
      ))}

      {/* --- CENTRAL FLIGHT INFORMATION DISPLAY BOARD (FIDS - DOUBLE-SIDED) --- */}
      <group position={[0, 5.5, -5]}>
        {/* Support Mast from Ceiling */}
        <mesh material={metalMat} position={[0, 2.0, 0]}>
          <boxGeometry args={[0.2, 4.0, 0.2]} />
        </mesh>
        {/* Housing Enclosure Box */}
        <mesh castShadow material={metalMat} position={[0, 0, 0]}>
          <boxGeometry args={[9.0, 3.2, 0.45]} />
        </mesh>

        {/* SIDE 1: FACING ENTRANCE / SOUTH (Towards player approaching from Z = -11) */}
        <mesh position={[0, 0, -0.23]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[8.6, 2.8]} />
          <meshBasicMaterial color="#0A1128" />
        </mesh>
        <Html position={[0, 0, -0.26]} rotation={[0, Math.PI, 0]} transform distanceFactor={6} scale={0.4}>
          <div className="fids-board-display">
            <div className="fids-header">
              <span className="fids-title">FLIGHT DEPARTURES // MAIN TERMINAL</span>
              <span className="fids-clock">08:15 LOCAL</span>
            </div>
            <div className="fids-table">
              <div className="fids-row header-row">
                <span>FLIGHT</span>
                <span>DESTINATION</span>
                <span>GATE</span>
                <span>TIME</span>
                <span>STATUS</span>
              </div>
              <div className="fids-row active-flight">
                <span className="flight-id">AI-407</span>
                <span>NEW DELHI</span>
                <span className="gate-highlight">GATE 7</span>
                <span>08:30</span>
                <span className="status-boarding">BOARDING NOW</span>
              </div>
              <div className="fids-row">
                <span>SG-202</span>
                <span>MUMBAI</span>
                <span>GATE 4</span>
                <span>08:50</span>
                <span>ON TIME</span>
              </div>
              <div className="fids-row">
                <span>6E-881</span>
                <span>BENGALURU</span>
                <span>GATE 9</span>
                <span>09:15</span>
                <span>SCHEDULED</span>
              </div>
            </div>
          </div>
        </Html>

        {/* SIDE 2: FACING CONCOURSE & LOUNGE / NORTH (Towards passengers walking back from lounge) */}
        <mesh position={[0, 0, 0.23]} rotation={[0, 0, 0]}>
          <planeGeometry args={[8.6, 2.8]} />
          <meshBasicMaterial color="#0A1128" />
        </mesh>
        <Html position={[0, 0, 0.26]} rotation={[0, 0, 0]} transform distanceFactor={6} scale={0.4}>
          <div className="fids-board-display">
            <div className="fids-header">
              <span className="fids-title">FLIGHT DEPARTURES // MAIN TERMINAL</span>
              <span className="fids-clock">08:15 LOCAL</span>
            </div>
            <div className="fids-table">
              <div className="fids-row header-row">
                <span>FLIGHT</span>
                <span>DESTINATION</span>
                <span>GATE</span>
                <span>TIME</span>
                <span>STATUS</span>
              </div>
              <div className="fids-row active-flight">
                <span className="flight-id">AI-407</span>
                <span>NEW DELHI</span>
                <span className="gate-highlight">GATE 7</span>
                <span>08:30</span>
                <span className="status-boarding">BOARDING NOW</span>
              </div>
              <div className="fids-row">
                <span>SG-202</span>
                <span>MUMBAI</span>
                <span>GATE 4</span>
                <span>08:50</span>
                <span>ON TIME</span>
              </div>
              <div className="fids-row">
                <span>6E-881</span>
                <span>BENGALURU</span>
                <span>GATE 9</span>
                <span>09:15</span>
                <span>SCHEDULED</span>
              </div>
            </div>
          </div>
        </Html>
      </group>

      {/* --- SECOND FLIGHT INFORMATION DISPLAY BOARD (ELEVATED WEST LOUNGE DISPLAY) --- */}
      <group position={[-8.5, 5.8, 1.0]} rotation={[0, Math.PI / 2, 0]}>
        {/* Support Mast from Ceiling */}
        <mesh material={metalMat} position={[0, 1.8, 0]}>
          <boxGeometry args={[0.15, 3.6, 0.15]} />
        </mesh>
        {/* Board Enclosure */}
        <mesh castShadow material={metalMat} position={[0, 0, 0]}>
          <boxGeometry args={[7.2, 2.8, 0.4]} />
        </mesh>

        {/* Face 1: Facing lounge passengers */}
        <mesh position={[0, 0, -0.21]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[6.8, 2.4]} />
          <meshBasicMaterial color="#0A1128" />
        </mesh>
        <Html position={[0, 0, -0.24]} rotation={[0, Math.PI, 0]} transform distanceFactor={6} scale={0.34}>
          <div className="fids-board-display">
            <div className="fids-header">
              <span className="fids-title">LOUNGE FLIGHT DEPARTURES</span>
              <span className="fids-clock">08:15 LOCAL</span>
            </div>
            <div className="fids-table">
              <div className="fids-row header-row">
                <span>FLIGHT</span>
                <span>DESTINATION</span>
                <span>GATE</span>
                <span>TIME</span>
                <span>STATUS</span>
              </div>
              <div className="fids-row active-flight">
                <span className="flight-id">AI-407</span>
                <span>NEW DELHI</span>
                <span className="gate-highlight">GATE 7</span>
                <span>08:30</span>
                <span className="status-boarding">BOARDING NOW</span>
              </div>
              <div className="fids-row">
                <span>SG-202</span>
                <span>MUMBAI</span>
                <span>GATE 4</span>
                <span>08:50</span>
                <span>ON TIME</span>
              </div>
              <div className="fids-row">
                <span>UK-955</span>
                <span>HYDERABAD</span>
                <span>GATE 2</span>
                <span>09:40</span>
                <span>BOARDING SOON</span>
              </div>
            </div>
          </div>
        </Html>

        {/* Face 2: Facing concourse */}
        <mesh position={[0, 0, 0.21]} rotation={[0, 0, 0]}>
          <planeGeometry args={[6.8, 2.4]} />
          <meshBasicMaterial color="#0A1128" />
        </mesh>
        <Html position={[0, 0, 0.24]} rotation={[0, 0, 0]} transform distanceFactor={6} scale={0.34}>
          <div className="fids-board-display">
            <div className="fids-header">
              <span className="fids-title">LOUNGE FLIGHT DEPARTURES</span>
              <span className="fids-clock">08:15 LOCAL</span>
            </div>
            <div className="fids-table">
              <div className="fids-row header-row">
                <span>FLIGHT</span>
                <span>DESTINATION</span>
                <span>GATE</span>
                <span>TIME</span>
                <span>STATUS</span>
              </div>
              <div className="fids-row active-flight">
                <span className="flight-id">AI-407</span>
                <span>NEW DELHI</span>
                <span className="gate-highlight">GATE 7</span>
                <span>08:30</span>
                <span className="status-boarding">BOARDING NOW</span>
              </div>
              <div className="fids-row">
                <span>SG-202</span>
                <span>MUMBAI</span>
                <span>GATE 4</span>
                <span>08:50</span>
                <span>ON TIME</span>
              </div>
              <div className="fids-row">
                <span>UK-955</span>
                <span>HYDERABAD</span>
                <span>GATE 2</span>
                <span>09:40</span>
                <span>BOARDING SOON</span>
              </div>
            </div>
          </div>
        </Html>
      </group>

      {/* --- AIRPORT SECURITY CHECKPOINT AREA (Between Lounge & Gate 7, Z = 6.0 to 8.5) --- */}
      <group position={[6.0, 0, 6.5]}>
        {/* Overhead Security Sign */}
        <mesh castShadow material={metalMat} position={[0, 3.8, 0]}>
          <boxGeometry args={[5.2, 0.8, 0.2]} />
        </mesh>
        <mesh position={[0, 3.8, 0.12]}>
          <planeGeometry args={[5.0, 0.7]} />
          <meshBasicMaterial color="#0F172A" />
        </mesh>

        {/* Walk-through Metal Detector Archway (Portal at X = 0) */}
        <group position={[0, 0, 0]}>
          {/* Left upright post */}
          <mesh castShadow material={scannerMat} position={[-0.55, 1.25, 0]}>
            <boxGeometry args={[0.15, 2.5, 0.4]} />
          </mesh>
          {/* Right upright post */}
          <mesh castShadow material={scannerMat} position={[0.55, 1.25, 0]}>
            <boxGeometry args={[0.15, 2.5, 0.4]} />
          </mesh>
          {/* Top arch beam */}
          <mesh castShadow material={scannerMat} position={[0, 2.45, 0]}>
            <boxGeometry args={[1.25, 0.25, 0.4]} />
          </mesh>
          {/* Arch status beacon lights */}
          <mesh position={[0, 2.58, 0.2]}>
            <boxGeometry args={[0.2, 0.08, 0.04]} />
            <meshBasicMaterial color={securityCleared ? '#10B981' : '#38BDF8'} />
          </mesh>
          {/* Ground sensor rubber pad */}
          <mesh position={[0, 0.02, 0]}>
            <boxGeometry args={[0.9, 0.02, 0.9]} />
            <meshStandardMaterial color="#1E293B" roughness={0.9} />
          </mesh>
        </group>

        {/* X-Ray Baggage Inspection Scanner & Conveyor Belt (Right side of arch: X = 1.8) */}
        <group position={[1.8, 0, 0]}>
          {/* Main X-Ray Tunnel Housing */}
          <mesh castShadow material={scannerMat} position={[0, 0.9, 0]}>
            <boxGeometry args={[1.2, 0.9, 1.4]} />
          </mesh>
          {/* Tunnel opening (lead curtains) */}
          <mesh position={[0, 0.9, -0.71]}>
            <boxGeometry args={[0.7, 0.6, 0.05]} />
            <meshBasicMaterial color="#0F172A" />
          </mesh>
          <mesh position={[0, 0.9, 0.71]}>
            <boxGeometry args={[0.7, 0.6, 0.05]} />
            <meshBasicMaterial color="#0F172A" />
          </mesh>
          {/* Roller Conveyor Tables (Entry & Exit) */}
          <mesh castShadow material={beltMat} position={[0, 0.5, -1.3]}>
            <boxGeometry args={[0.75, 0.1, 1.2]} />
          </mesh>
          <mesh castShadow material={beltMat} position={[0, 0.5, 1.3]}>
            <boxGeometry args={[0.75, 0.1, 1.2]} />
          </mesh>
          {/* Support Legs */}
          {[-0.3, 0.3].map((lx, idx) => (
            <mesh key={idx} material={metalMat} position={[lx, 0.25, 1.3]}>
              <boxGeometry args={[0.06, 0.5, 0.06]} />
            </mesh>
          ))}
          {/* Operator Monitor */}
          <mesh position={[0.7, 1.35, 0]}>
            <boxGeometry args={[0.08, 0.45, 0.6]} />
            <meshBasicMaterial color="#0284C7" />
          </mesh>
          {/* Plastic baggage inspection trays on belt */}
          <mesh position={[0, 0.6, -1.2]}>
            <boxGeometry args={[0.55, 0.1, 0.45]} />
            <meshStandardMaterial color="#CBD5E1" roughness={0.4} />
          </mesh>
        </group>

        {/* Queue Guide Stanchions */}
        {[-1.2, 3.0].map((sx, idx) => (
          <group key={idx} position={[sx, 0, -1.5]}>
            <mesh position={[0, 0.5, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 1.0, 12]} />
              <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.02, 0]}>
              <cylinderGeometry args={[0.2, 0.2, 0.04, 16]} />
              <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        ))}
      </group>

      {/* --- EXPANDED WAITING LOUNGE SEATS (Multiple rows: X = -11, -6, 2) --- */}
      {[-11, -6, 2].map((x, rowIdx) => (
        <group key={rowIdx} position={[x, 0, 1]}>
          {[-4, 0, 4].map((z, colIdx) => (
            <group key={colIdx} position={[0, 0, z]}>
              {/* Bench beam */}
              <mesh material={metalMat} position={[0, 0.35, 0]}>
                <boxGeometry args={[0.08, 0.08, 2.6]} />
              </mesh>
              {/* Legs */}
              <mesh material={metalMat} position={[0, 0.18, -1.1]}>
                <boxGeometry args={[0.4, 0.36, 0.06]} />
              </mesh>
              <mesh material={metalMat} position={[0, 0.18, 1.1]}>
                <boxGeometry args={[0.4, 0.36, 0.06]} />
              </mesh>
              {/* 3 seats */}
              {[-0.8, 0, 0.8].map((sz, seatIdx) => (
                <group key={seatIdx} position={[0, 0, sz]}>
                  <mesh castShadow material={seatMat} position={[0, 0.45, 0]}>
                    <boxGeometry args={[0.55, 0.08, 0.52]} />
                  </mesh>
                  <mesh castShadow material={seatMat} position={[-0.24, 0.72, 0]}>
                    <boxGeometry args={[0.08, 0.5, 0.5]} />
                  </mesh>
                </group>
              ))}
            </group>
          ))}
        </group>
      ))}

      {/* Luggage around terminal */}
      <mesh castShadow position={[-5.8, 0.25, -1.2]}>
        <boxGeometry args={[0.4, 0.5, 0.3]} />
        <meshStandardMaterial color="#1E293B" roughness={0.4} />
      </mesh>
      <mesh castShadow position={[2.4, 0.2, 4.8]}>
        <boxGeometry args={[0.35, 0.4, 0.25]} />
        <meshStandardMaterial color="#B91C1C" roughness={0.5} />
      </mesh>
      <mesh castShadow position={[-10.5, 0.25, 1.2]}>
        <boxGeometry args={[0.4, 0.45, 0.25]} />
        <meshStandardMaterial color="#065F46" roughness={0.5} />
      </mesh>

      {/* --- DIRECT LUMINOUS FLOOR ROUTE FROM SECURITY CHECKPOINT TO GATE 07 --- */}
      {[
        { x: 6.0, z: 7.2, rot: -0.67 }, // Right at security checkpoint exit
        { x: 7.0, z: 8.4, rot: -0.67 }, // Concourse guidance marker
        { x: 8.0, z: 9.6, rot: -0.67 }, // Concourse guidance marker
        { x: 9.0, z: 10.8, rot: -0.67 }, // Approach marker
        { x: 10.0, z: 11.8, rot: 0.0 },  // Entrance threshold marker
      ].map((arrow, idx) => (
        <group key={`arrow-${idx}`} position={[arrow.x, 0.02, arrow.z]} rotation={[-Math.PI / 2, 0, arrow.rot]}>
          {/* Luminous Blue Chevron */}
          <mesh>
            <planeGeometry args={[1.1, 0.4]} />
            <meshBasicMaterial color="#38BDF8" transparent opacity={0.85} />
          </mesh>
          {/* High-visibility Gold Accent Edge */}
          <mesh position={[0, -0.24, 0]}>
            <planeGeometry args={[0.9, 0.1]} />
            <meshBasicMaterial color="#FBBF24" />
          </mesh>
        </group>
      ))}

      {/* --- BOARDING GATE 07 CHECKPOINT & JET BRIDGE ENTRANCE (Z = 12 to 24) --- */}
      <group position={[10, 0, 12]}>
        {/* Overhead Heavy Portal Lintel Structure - Flush with Front Wall at Z = 12 */}
        <mesh castShadow material={metalMat} position={[0, 4.2, 0]}>
          <boxGeometry args={[4.4, 1.2, 0.45]} />
        </mesh>

        {/* --- GATE 7 SIGN: FACING APPROACHING PLAYER FROM TERMINAL CONCOURSE (SOUTH / -Z) --- */}
        <mesh position={[0, 4.2, -0.24]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[4.2, 1.15]} />
          <meshBasicMaterial color="#0B132B" />
        </mesh>
        {/* Neon Amber Border Runners */}
        <mesh position={[0, 4.78, -0.25]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[4.2, 0.06]} />
          <meshBasicMaterial color="#F59E0B" />
        </mesh>
        <mesh position={[0, 3.62, -0.25]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[4.2, 0.06]} />
          <meshBasicMaterial color="#F59E0B" />
        </mesh>
        {/* 3D High-Contrast Gate Sign Typography (Correctly Oriented facing -Z) */}
        <Html position={[0, 4.2, -0.26]} rotation={[0, Math.PI, 0]} center distanceFactor={10} transform scale={0.45}>
          <div className="gate-header-sign">
            <span className="gate-number">BOARDING GATE 07</span>
            <span className="gate-dest">FLIGHT AI-407 • NEW DELHI • ON TIME</span>
            <div className="gate-status-badge">● BOARDING NOW</div>
          </div>
        </Html>

        {/* GATE 7 REVERSE SIGN (For passengers viewing from jet bridge looking back towards terminal) */}
        <mesh position={[0, 4.2, 0.24]} rotation={[0, 0, 0]}>
          <planeGeometry args={[4.2, 1.15]} />
          <meshBasicMaterial color="#0B132B" />
        </mesh>
        <Html position={[0, 4.2, 0.26]} rotation={[0, 0, 0]} center distanceFactor={10} transform scale={0.45}>
          <div className="gate-header-sign">
            <span className="gate-number">GATE 07</span>
            <span className="gate-dest">FLIGHT AI-407 • NEW DELHI</span>
            <div className="gate-status-badge">PASSENGER BOARDING PASSAGE</div>
          </div>
        </Html>

        {/* Vertical Portal Pylons (Left & Right - Framing Clear Walkway) */}
        <mesh castShadow material={metalMat} position={[-2.1, 2.0, 0]}>
          <boxGeometry args={[0.3, 4.0, 0.35]} />
        </mesh>
        <mesh castShadow material={metalMat} position={[2.1, 2.0, 0]}>
          <boxGeometry args={[0.3, 4.0, 0.35]} />
        </mesh>

        {/* Illuminated Status Strip on Pylons */}
        <mesh position={[-1.92, 2.0, -0.19]}>
          <boxGeometry args={[0.05, 3.6, 0.02]} />
          <meshBasicMaterial color={securityCleared ? '#10B981' : '#F59E0B'} />
        </mesh>
        <mesh position={[1.92, 2.0, -0.19]}>
          <boxGeometry args={[0.05, 3.6, 0.02]} />
          <meshBasicMaterial color={securityCleared ? '#10B981' : '#F59E0B'} />
        </mesh>

        {/* Clear, Unobstructed Doorway - Automatic Glass Sliding Doors in Open/Retracted Position */}
        <group position={[0, 1.4, 0]}>
          {/* Left Door Leaf (Retracted into frame pocket, leaving central entrance fully open) */}
          <mesh material={glassMat} position={[-1.8, 0, 0]}>
            <boxGeometry args={[0.5, 2.8, 0.06]} />
          </mesh>
          <mesh position={[-1.8, 0, -0.04]}>
            <planeGeometry args={[0.5, 0.15]} />
            <meshBasicMaterial color="#E2E8F0" transparent opacity={0.6} />
          </mesh>

          {/* Right Door Leaf (Retracted into frame pocket) */}
          <mesh material={glassMat} position={[1.8, 0, 0]}>
            <boxGeometry args={[0.5, 2.8, 0.06]} />
          </mesh>
          <mesh position={[1.8, 0, -0.04]}>
            <planeGeometry args={[0.5, 0.15]} />
            <meshBasicMaterial color="#E2E8F0" transparent opacity={0.6} />
          </mesh>
        </group>

        {/* Electronic Boarding Gate Scanner Turnstile (Positioned to side) */}
        <group position={[-1.45, 0, 0.8]}>
          <mesh castShadow material={metalMat} position={[0, 0.55, 0]}>
            <boxGeometry args={[0.3, 1.1, 0.8]} />
          </mesh>
          {/* Scanner Screen */}
          <mesh position={[0, 1.05, 0.2]} rotation={[-0.4, 0, 0]}>
            <boxGeometry args={[0.22, 0.16, 0.02]} />
            <meshBasicMaterial color={securityCleared ? '#10B981' : '#EF4444'} />
          </mesh>
        </group>

        {/* Podium for Gate Agent Rohan (Positioned to side, leaving central aisle wide open) */}
        <mesh castShadow receiveShadow material={metalMat} position={[1.35, 0.6, 0.8]}>
          <boxGeometry args={[1.2, 1.2, 0.7]} />
        </mesh>
        <mesh position={[1.35, 1.35, 0.7]}>
          <boxGeometry args={[0.5, 0.35, 0.05]} />
          <meshBasicMaterial color="#1E3A8A" />
        </mesh>

        {/* Queue Guide Stanchions */}
        {[-1.8, 1.8].map((sx, idx) => (
          <mesh key={idx} position={[sx, 0.5, 0.6]}>
            <cylinderGeometry args={[0.04, 0.04, 1.0, 12]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
          </mesh>
        ))}

        {/* JET BRIDGE / BOARDING CORRIDOR - Seamlessly connected from portal to aircraft */}
        <group position={[0, 0, 6.0]}>
          {/* Floor spanning Z = 12 to 24 */}
          <mesh receiveShadow material={floorMat} position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[3.8, 12]} />
          </mesh>
          {/* Left interior corridor wall */}
          <mesh castShadow material={wallMat} position={[-1.9, 1.8, 0]}>
            <boxGeometry args={[0.2, 3.6, 12]} />
          </mesh>
          {/* Right glass wall overlooking tarmac & Flight 407 */}
          <mesh material={glassMat} position={[1.9, 1.8, 0]}>
            <boxGeometry args={[0.2, 3.6, 12]} />
          </mesh>
          {/* Ceiling */}
          <mesh material={wallMat} position={[0, 3.6, 0]}>
            <boxGeometry args={[4.0, 0.2, 12]} />
          </mesh>
          {/* Overhead corridor warm illumination lights */}
          {[-4.0, -1.2, 1.6, 4.4].map((z, idx) => (
            <mesh key={`jb-light-${idx}`} position={[0, 3.48, z]}>
              <boxGeometry args={[0.5, 0.04, 1.8]} />
              <meshBasicMaterial color="#FEF08A" />
            </mesh>
          ))}
          {/* Green Illuminated Threshold Guide at Gate Entrance */}
          <mesh position={[0, 0.02, -5.8]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[3.4, 0.25]} />
            <meshBasicMaterial color="#10B981" />
          </mesh>
        </group>
      </group>

      {/* --- FLIGHT 407 AIRCRAFT EXTERIOR ON TARMAC --- */}
      <AircraftExterior position={[28, 0, 12]} rotation={[0, -Math.PI / 2, 0]} scale={1.25} />
    </group>
  );
};
