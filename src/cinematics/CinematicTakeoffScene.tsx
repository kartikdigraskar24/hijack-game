// CinematicTakeoffScene.tsx - Scene 2: Airplane Runway Takeoff Sequence with Dynamic Camera Tracking & Audio Sync
import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { AircraftExterior } from '../environment/AircraftExterior';
import { AudioManager } from '../systems/AudioManager';

interface CinematicTakeoffSceneProps {
  onTakeoffComplete: () => void;
  onTelemetryUpdate?: (data: {
    airspeed: number;
    altitude: number;
    phase: string;
    progress: number;
  }) => void;
}

export const CinematicTakeoffScene: React.FC<CinematicTakeoffSceneProps> = ({
  onTakeoffComplete,
  onTelemetryUpdate,
}) => {
  const aircraftGroupRef = useRef<THREE.Group>(null);
  const timeRef = useRef<number>(0);
  const completedRef = useRef<boolean>(false);
  const lookAtTargetRef = useRef(new THREE.Vector3(0, 0, 0));

  // PBR Materials
  const runwayAsphaltMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1A202C',
    roughness: 0.85,
    metalness: 0.1,
  }), []);

  const groundGrassMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#0F172A',
    roughness: 0.95,
  }), []);

  const markingWhiteMat = useMemo(() => new THREE.MeshBasicMaterial({ color: '#F8FAFC' }), []);
  const edgeLightMat = useMemo(() => new THREE.MeshBasicMaterial({ color: '#FFFFFF' }), []);
  const thresholdGreenMat = useMemo(() => new THREE.MeshBasicMaterial({ color: '#22C55E' }), []);
  const centerlineLightMat = useMemo(() => new THREE.MeshBasicMaterial({ color: '#FEF08A' }), []);

  // Initialize takeoff audio engine
  useEffect(() => {
    AudioManager.startTakeoffEngineAudio();
    return () => {
      // Audio cleanup on unmount
    };
  }, []);

  useFrame((state, delta) => {
    if (completedRef.current) return;

    // Cap delta to prevent huge jumps on tab switch
    const dt = Math.min(delta, 0.1);
    timeRef.current += dt;
    const t = timeRef.current;

    // --- TAKEOFF TIMELINE PHYSICS & CHOREOGRAPHY ---
    let posX = 0;
    let posY = 0;
    let posZ = 100;
    let pitch = 0;
    let roll = 0;
    let yaw = 0;
    let speedNorm = 0;
    let altitudeNorm = 0;
    let airspeedKnots = 0;
    let phaseName = 'HOLDING SHORT RWY 28R';
    let engineThrust = 0.2;

    if (t < 3.0) {
      // Phase 1: Lineup & Engine Spool-up (0 - 3s)
      phaseName = 'SPOOLING UP // TOGA THRUST';
      engineThrust = 0.2 + (t / 3.0) * 0.8;
      speedNorm = (t / 3.0) * 0.15;
      airspeedKnots = Math.round(t * 12);
      posZ = 100;
    } else if (t < 7.5) {
      // Phase 2: Ground Roll Acceleration (3 - 7.5s)
      const rollTime = t - 3.0;
      const progress = rollTime / 4.5;
      speedNorm = 0.15 + progress * 0.85;
      engineThrust = 1.0;
      airspeedKnots = Math.round(35 + progress * 115); // Accelerates to 150 kts
      phaseName = airspeedKnots > 130 ? 'V1 REACHED // ROTATE' : `ROLLING ACCEL // ${airspeedKnots} KTS`;

      // Quadratic acceleration along runway centerline
      posZ = 100 - 0.5 * 24 * (rollTime * rollTime);
    } else if (t < 10.5) {
      // Phase 3: Rotation & Liftoff (7.5 - 10.5s)
      const rotateTime = t - 7.5;
      const progress = rotateTime / 3.0;
      speedNorm = 1.0;
      engineThrust = 1.0;
      airspeedKnots = Math.round(150 + progress * 25);
      phaseName = 'POSITIVE RATE // GEAR RETRACTING';

      // Pitch up smoothly to 11.5 degrees (0.20 rad)
      pitch = Math.sin((progress * Math.PI) / 2) * 0.20;

      // Uncompress and climb
      posY = Math.pow(progress, 1.8) * 22;
      altitudeNorm = posY / 120;

      // Continue forward speed
      const baseZAtRotate = 100 - 0.5 * 24 * (4.5 * 4.5);
      posZ = baseZAtRotate - (4.5 * 24) * rotateTime;
    } else if (t < 15.0) {
      // Phase 4: Sky Climb & Bank (10.5 - 15.0s)
      const climbTime = t - 10.5;
      const progress = climbTime / 4.5;
      speedNorm = 1.0;
      engineThrust = 0.92;
      airspeedKnots = Math.round(175 + progress * 45);
      phaseName = 'CLIMBING TO FL350 // CRUISING';

      // Altitude climbs steadily through cloud layers
      posY = 22 + climbTime * 24;
      altitudeNorm = Math.min(1.0, posY / 120);

      // Pitch stabilizes at 9 degrees climb angle
      pitch = 0.18 - progress * 0.04;

      // Gentle bank to the left
      roll = -Math.sin(progress * Math.PI) * 0.08;
      yaw = progress * 0.05;
      posX = -Math.pow(progress, 2) * 18;

      const baseZAtRotate = 100 - 0.5 * 24 * (4.5 * 4.5);
      const zAt10_5 = baseZAtRotate - (4.5 * 24) * 3.0;
      posZ = zAt10_5 - 115 * climbTime;
    } else {
      // Phase 5: Complete & Fade to Game (15.0s+)
      if (!completedRef.current) {
        completedRef.current = true;
        AudioManager.stopCinematicAudio(1.0);
        onTakeoffComplete();
      }
      return;
    }

    // Apply motion to aircraft group
    if (aircraftGroupRef.current) {
      aircraftGroupRef.current.position.set(posX, posY, posZ);
      aircraftGroupRef.current.rotation.set(pitch, yaw, roll);
    }

    // Synchronize engine sound with visual speed and altitude
    AudioManager.updateTakeoffEngineAudio(speedNorm, altitudeNorm);

    // Report telemetry to overlay
    if (onTelemetryUpdate) {
      onTelemetryUpdate({
        airspeed: airspeedKnots,
        altitude: Math.round(posY * 3.28), // converted to feet
        phase: phaseName,
        progress: Math.min(1.0, t / 15.0),
      });
    }

    // --- DYNAMIC CINEMATIC CAMERA SYSTEM ---
    if (t < 3.2) {
      // Camera Shot 1: Wide low runway edge shot framed against aircraft and threshold lights
      state.camera.position.set(16, 2.5, 95);
      lookAtTargetRef.current.set(posX, posY + 2.8, posZ - 6);
    } else if (t < 6.0) {
      // Camera Shot 2: High-speed ground gear tracking cam pacing right beside the main gear
      const camZ = posZ + 8;
      state.camera.position.set(posX - 7.5, posY + 1.2, camZ);
      lookAtTargetRef.current.set(posX, posY + 2.4, posZ - 10);
    } else if (t < 8.8) {
      // Camera Shot 3: High-speed chase angle behind the starboard wing as nose rotates
      const camZ = posZ + 24;
      state.camera.position.set(posX + 4.5, posY + 4.8, camZ);
      lookAtTargetRef.current.set(posX, posY + 2.8, posZ - 14);
    } else if (t < 11.5) {
      // Camera Shot 4: Dramatic ground flyover shot — camera looks up as aircraft flies directly overhead
      state.camera.position.set(0, 1.2, posZ - 40);
      lookAtTargetRef.current.set(posX, posY + 2.5, posZ);
    } else {
      // Camera Shot 5: Majestic panoramic exterior chase camera soaring alongside the climbing aircraft
      state.camera.position.set(posX + 18, posY + 5.5, posZ + 26);
      lookAtTargetRef.current.set(posX, posY + 2.0, posZ - 12);
    }

    state.camera.lookAt(lookAtTargetRef.current);
  });

  return (
    <group>
      {/* --- TWILIGHT SKY DOME & STARS --- */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[450, 24, 24]} />
        <meshBasicMaterial color="#050B18" side={THREE.BackSide} />
      </mesh>

      {/* Horizon glow */}
      <mesh position={[0, 20, -500]}>
        <planeGeometry args={[1200, 140]} />
        <meshBasicMaterial color="#312E81" transparent opacity={0.3} />
      </mesh>

      {/* Base Twilight Lighting */}
      <ambientLight intensity={0.35} color="#1E293B" />
      <directionalLight position={[40, 60, -40]} intensity={0.65} color="#93C5FD" />

      {/* --- RUNWAY SURFACES & SURROUNDING GROUND --- */}
      {/* Surrounding dark grassy terrain */}
      <mesh receiveShadow material={groundGrassMat} position={[0, -0.05, -500]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[800, 1500]} />
      </mesh>

      {/* Runway Asphalt Surface: Width 48m, Length 1400m */}
      <mesh receiveShadow material={runwayAsphaltMat} position={[0, 0, -500]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[48, 1400]} />
      </mesh>

      {/* Runway Threshold Green Light Bar at Z = 120 */}
      {Array.from({ length: 16 }).map((_, i) => {
        const xPos = -22 + (i / 15) * 44;
        return (
          <group key={i} position={[xPos, 0.15, 120]}>
            <mesh material={thresholdGreenMat}>
              <sphereGeometry args={[0.18, 8, 8]} />
            </mesh>
            <pointLight color="#22C55E" intensity={1.8} distance={8} />
          </group>
        );
      })}

      {/* Runway Piano Keys (Threshold Markings at start) */}
      {Array.from({ length: 10 }).map((_, i) => {
        const xPos = -18 + (i / 9) * 36;
        return (
          <mesh key={i} position={[xPos, 0.02, 105]} rotation={[-Math.PI / 2, 0, 0]} material={markingWhiteMat}>
            <planeGeometry args={[2.0, 18]} />
          </mesh>
        );
      })}

      {/* Runway Number Marking: "28R" */}
      <mesh position={[0, 0.02, 75]} rotation={[-Math.PI / 2, 0, 0]} material={markingWhiteMat}>
        <planeGeometry args={[12, 16]} />
      </mesh>

      {/* Runway Centerline Stripes & Embedded Centerline Lights (Spaced every 20m from Z = 60 to Z = -1100) */}
      {Array.from({ length: 58 }).map((_, i) => {
        const zPos = 60 - i * 20;
        return (
          <React.Fragment key={i}>
            {/* Centerline white stripe */}
            <mesh position={[0, 0.02, zPos]} rotation={[-Math.PI / 2, 0, 0]} material={markingWhiteMat}>
              <planeGeometry args={[0.9, 12]} />
            </mesh>
            {/* Embedded centerline flush light */}
            <mesh position={[0, 0.05, zPos]} material={centerlineLightMat}>
              <sphereGeometry args={[0.12, 6, 6]} />
            </mesh>
          </React.Fragment>
        );
      })}

      {/* Runway Elevated White Edge Lights on both sides */}
      {Array.from({ length: 48 }).map((_, i) => {
        const zPos = 120 - i * 26;
        return (
          <React.Fragment key={i}>
            {/* Left Edge Light */}
            <group position={[-24.2, 0.3, zPos]}>
              <mesh position={[0, -0.15, 0]}>
                <cylinderGeometry args={[0.06, 0.06, 0.4, 6]} />
                <meshStandardMaterial color="#475569" />
              </mesh>
              <mesh material={edgeLightMat}>
                <sphereGeometry args={[0.15, 8, 8]} />
              </mesh>
              <pointLight color="#FFFFFF" intensity={1.8} distance={12} />
            </group>
            {/* Right Edge Light */}
            <group position={[24.2, 0.3, zPos]}>
              <mesh position={[0, -0.15, 0]}>
                <cylinderGeometry args={[0.06, 0.06, 0.4, 6]} />
                <meshStandardMaterial color="#475569" />
              </mesh>
              <mesh material={edgeLightMat}>
                <sphereGeometry args={[0.15, 8, 8]} />
              </mesh>
              <pointLight color="#FFFFFF" intensity={1.8} distance={12} />
            </group>
          </React.Fragment>
        );
      })}

      {/* --- LOW-LYING RUNWAY GROUND FOG / MIST --- */}
      {[-80, -260, -480, -700].map((fogZ, idx) => (
        <mesh key={idx} position={[0, 1.8, fogZ]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[140, 160]} />
          <meshBasicMaterial color="#38BDF8" transparent opacity={0.07} depthWrite={false} />
        </mesh>
      ))}

      {/* --- HIGH-ALTITUDE CLOUDS TO FLY THROUGH --- */}
      {[
        { x: -20, y: 55, z: -450 },
        { x: 30, y: 75, z: -620 },
        { x: -40, y: 95, z: -800 },
        { x: 10, y: 125, z: -980 },
      ].map((cloud, idx) => (
        <group key={idx} position={[cloud.x, cloud.y, cloud.z]}>
          <mesh>
            <boxGeometry args={[70, 14, 90]} />
            <meshStandardMaterial color="#1E293B" roughness={0.95} transparent opacity={0.55} depthWrite={false} />
          </mesh>
          <mesh position={[10, 2, 5]}>
            <boxGeometry args={[50, 10, 70]} />
            <meshStandardMaterial color="#334155" roughness={0.95} transparent opacity={0.4} depthWrite={false} />
          </mesh>
        </group>
      ))}

      {/* --- FLIGHT 407 DYNAMIC AIRLINER --- */}
      <group ref={aircraftGroupRef} position={[0, 0, 100]}>
        <AircraftExterior
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
          scale={1.2}
          showLandingGear={true}
          navLightsOn={true}
          landingLightsOn={true}
          engineThrust={1.0}
        />
      </group>
    </group>
  );
};
