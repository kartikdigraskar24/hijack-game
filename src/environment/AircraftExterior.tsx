// AircraftExterior.tsx - 3D Passenger Airliner (Flight 407) Exterior Model
import React from 'react';
import * as THREE from 'three';

interface AircraftExteriorProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  showLandingGear?: boolean;
  navLightsOn?: boolean;
  landingLightsOn?: boolean;
  engineThrust?: number; // 0.0 to 1.0
}

export const AircraftExterior: React.FC<AircraftExteriorProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1.0,
  showLandingGear = true,
  navLightsOn = false,
  landingLightsOn = false,
  engineThrust = 0,
}) => {
  // PBR Materials
  const fuselageMat = new THREE.MeshStandardMaterial({
    color: '#F1F5F9', // Clean airline white
    roughness: 0.35,
    metalness: 0.15,
  });

  const liveryBlueMat = new THREE.MeshStandardMaterial({
    color: '#123B70', // Aviation deep navy blue stripe
    roughness: 0.4,
  });

  const wingMat = new THREE.MeshStandardMaterial({
    color: '#CBD5E1', // Dull aeronautical aluminum
    roughness: 0.5,
    metalness: 0.3,
  });

  const engineMat = new THREE.MeshStandardMaterial({
    color: '#334155', // Titanium / graphite engine casing
    roughness: 0.3,
    metalness: 0.6,
  });

  const windowMat = new THREE.MeshStandardMaterial({
    color: '#0F172A',
    roughness: 0.1,
    metalness: 0.9,
  });

  const gearStrutMat = new THREE.MeshStandardMaterial({
    color: '#94A3B8',
    metalness: 0.8,
    roughness: 0.2,
  });

  const tireMat = new THREE.MeshStandardMaterial({
    color: '#1E293B',
    roughness: 0.85,
  });

  const rimMat = new THREE.MeshStandardMaterial({
    color: '#CBD5E1',
    metalness: 0.9,
    roughness: 0.2,
  });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* --- FUSELAGE --- */}
      {/* Center passenger tube */}
      <mesh castShadow receiveShadow material={fuselageMat} position={[0, 2.7, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[2.2, 2.2, 34, 24]} />
      </mesh>

      {/* Blue livery belly stripe */}
      <mesh material={liveryBlueMat} position={[0, 1.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[2.22, 2.22, 26, 24, 1, false, 0, Math.PI]} />
      </mesh>

      {/* Aerodynamic Cockpit Nose Cone */}
      <mesh castShadow receiveShadow material={fuselageMat} position={[0, 2.7, -19]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[2.2, 5.0, 24]} />
      </mesh>

      {/* Cockpit Windshield Windows */}
      <mesh material={windowMat} position={[0, 3.4, -18.6]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[1.9, 0.65, 0.8]} />
      </mesh>

      {/* Tail Cone */}
      <mesh castShadow receiveShadow material={fuselageMat} position={[0, 2.7, 19]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[2.2, 5.5, 24]} />
      </mesh>

      {/* Passenger Cabin Windows (Left & Right) */}
      {[-8, -6, -4, -2, 0, 2, 4, 6, 8].map((z, idx) => (
        <React.Fragment key={idx}>
          {/* Left Windows */}
          <mesh material={windowMat} position={[-2.01, 2.8, z]}>
            <boxGeometry args={[0.05, 0.45, 0.35]} />
          </mesh>
          {/* Right Windows */}
          <mesh material={windowMat} position={[2.01, 2.8, z]}>
            <boxGeometry args={[0.05, 0.45, 0.35]} />
          </mesh>
        </React.Fragment>
      ))}

      {/* Forward Boarding Door (Left) */}
      <mesh material={liveryBlueMat} position={[-2.02, 2.4, -9]}>
        <boxGeometry args={[0.05, 1.8, 0.9]} />
      </mesh>

      {/* --- WINGS --- */}
      {/* Left Main Wing */}
      <group position={[-1.8, 2.0, 1]} rotation={[0.05, 0, -0.08]}>
        <mesh castShadow receiveShadow material={wingMat} position={[-8, 0, 0]} rotation={[0, 0.25, 0]}>
          <boxGeometry args={[16, 0.25, 4.5]} />
        </mesh>
        {/* Left Winglet */}
        <mesh material={liveryBlueMat} position={[-16, 1.0, 0]}>
          <boxGeometry args={[0.2, 2.0, 1.2]} />
        </mesh>
        {/* Left Turbofan Engine */}
        <group position={[-5.5, -1.2, 0]}>
          <mesh castShadow material={engineMat} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[1.05, 0.95, 4.0, 20]} />
          </mesh>
          {/* Spinner cone */}
          <mesh material={wingMat} position={[0, 0, -2.1]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.4, 0.8, 16]} />
          </mesh>
          {/* Engine Exhaust Core & Thrust Glow */}
          {engineThrust > 0 && (
            <group position={[0, 0, 2.05]}>
              <mesh>
                <cylinderGeometry args={[0.75, 0.65, 0.2, 16]} />
                <meshBasicMaterial color={engineThrust > 0.6 ? '#FFA23A' : '#4FA3FF'} />
              </mesh>
              <pointLight color="#FF9933" intensity={engineThrust * 3.5} distance={15} />
            </group>
          )}
        </group>
      </group>

      {/* Right Main Wing */}
      <group position={[1.8, 2.0, 1]} rotation={[0.05, 0, 0.08]}>
        <mesh castShadow receiveShadow material={wingMat} position={[8, 0, 0]} rotation={[0, -0.25, 0]}>
          <boxGeometry args={[16, 0.25, 4.5]} />
        </mesh>
        {/* Right Winglet */}
        <mesh material={liveryBlueMat} position={[16, 1.0, 0]}>
          <boxGeometry args={[0.2, 2.0, 1.2]} />
        </mesh>
        {/* Right Turbofan Engine */}
        <group position={[5.5, -1.2, 0]}>
          <mesh castShadow material={engineMat} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[1.05, 0.95, 4.0, 20]} />
          </mesh>
          {/* Spinner cone */}
          <mesh material={wingMat} position={[0, 0, -2.1]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.4, 0.8, 16]} />
          </mesh>
          {/* Engine Exhaust Core & Thrust Glow */}
          {engineThrust > 0 && (
            <group position={[0, 0, 2.05]}>
              <mesh>
                <cylinderGeometry args={[0.75, 0.65, 0.2, 16]} />
                <meshBasicMaterial color={engineThrust > 0.6 ? '#FFA23A' : '#4FA3FF'} />
              </mesh>
              <pointLight color="#FF9933" intensity={engineThrust * 3.5} distance={15} />
            </group>
          )}
        </group>
      </group>

      {/* --- EMPENNAGE / TAIL --- */}
      {/* Vertical Fin */}
      <group position={[0, 5.0, 13]} rotation={[-0.3, 0, 0]}>
        <mesh castShadow material={liveryBlueMat} position={[0, 2.5, 0]}>
          <boxGeometry args={[0.3, 5.2, 3.8]} />
        </mesh>
      </group>

      {/* Horizontal Stabilizers */}
      <mesh castShadow material={wingMat} position={[0, 3.5, 15]} rotation={[0, 0, 0]}>
        <boxGeometry args={[10, 0.18, 2.2]} />
      </mesh>

      {/* --- LANDING GEAR --- */}
      {showLandingGear && (
        <group>
          {/* Nose Gear (Z = -14) */}
          <group position={[0, 0, -14]}>
            <mesh castShadow material={gearStrutMat} position={[0, 1.1, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 1.8, 12]} />
            </mesh>
            {/* Axle */}
            <mesh material={gearStrutMat} position={[0, 0.35, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.05, 0.05, 0.55, 10]} />
            </mesh>
            {/* Dual nose wheels */}
            {[-0.22, 0.22].map((xOffset, idx) => (
              <group key={idx} position={[xOffset, 0.35, 0]} rotation={[0, 0, Math.PI / 2]}>
                <mesh castShadow material={tireMat}>
                  <cylinderGeometry args={[0.35, 0.35, 0.14, 16]} />
                </mesh>
                <mesh material={rimMat}>
                  <cylinderGeometry args={[0.2, 0.2, 0.15, 12]} />
                </mesh>
              </group>
            ))}
          </group>

          {/* Left Main Gear (X = -3.8, Z = 1.2) */}
          <group position={[-3.8, 0, 1.2]}>
            <mesh castShadow material={gearStrutMat} position={[0, 1.1, 0]}>
              <cylinderGeometry args={[0.12, 0.12, 1.8, 12]} />
            </mesh>
            {/* Dual main bogie wheels */}
            {[-0.24, 0.24].map((xOffset, idx) => (
              <group key={idx} position={[xOffset, 0.45, 0]} rotation={[0, 0, Math.PI / 2]}>
                <mesh castShadow material={tireMat}>
                  <cylinderGeometry args={[0.45, 0.45, 0.18, 18]} />
                </mesh>
                <mesh material={rimMat}>
                  <cylinderGeometry args={[0.24, 0.24, 0.19, 12]} />
                </mesh>
              </group>
            ))}
          </group>

          {/* Right Main Gear (X = 3.8, Z = 1.2) */}
          <group position={[3.8, 0, 1.2]}>
            <mesh castShadow material={gearStrutMat} position={[0, 1.1, 0]}>
              <cylinderGeometry args={[0.12, 0.12, 1.8, 12]} />
            </mesh>
            {/* Dual main bogie wheels */}
            {[-0.24, 0.24].map((xOffset, idx) => (
              <group key={idx} position={[xOffset, 0.45, 0]} rotation={[0, 0, Math.PI / 2]}>
                <mesh castShadow material={tireMat}>
                  <cylinderGeometry args={[0.45, 0.45, 0.18, 18]} />
                </mesh>
                <mesh material={rimMat}>
                  <cylinderGeometry args={[0.24, 0.24, 0.19, 12]} />
                </mesh>
              </group>
            ))}
          </group>
        </group>
      )}

      {/* --- AVIATION LIGHTING --- */}
      {navLightsOn && (
        <group>
          {/* Top Fuselage Red Anti-Collision Beacon */}
          <mesh position={[0, 4.95, 0]}>
            <sphereGeometry args={[0.12, 10, 10]} />
            <meshBasicMaterial color="#EF4444" />
          </mesh>
          <pointLight position={[0, 5.1, 0]} color="#EF4444" intensity={2.0} distance={12} />

          {/* Belly Red Anti-Collision Beacon */}
          <mesh position={[0, 0.48, 0]}>
            <sphereGeometry args={[0.12, 10, 10]} />
            <meshBasicMaterial color="#EF4444" />
          </mesh>
          <pointLight position={[0, 0.35, 0]} color="#EF4444" intensity={2.0} distance={10} />

          {/* Left Wingtip Red Nav Light */}
          <mesh position={[-17.8, 2.0, 1.0]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshBasicMaterial color="#DC2626" />
          </mesh>
          <pointLight position={[-17.8, 2.0, 1.0]} color="#DC2626" intensity={1.8} distance={8} />

          {/* Right Wingtip Green Nav Light */}
          <mesh position={[17.8, 2.0, 1.0]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshBasicMaterial color="#16A34A" />
          </mesh>
          <pointLight position={[17.8, 2.0, 1.0]} color="#16A34A" intensity={1.8} distance={8} />

          {/* Tail Cone White Strobe Nav Light */}
          <mesh position={[0, 3.4, 24.5]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
          <pointLight position={[0, 3.4, 24.5]} color="#FFFFFF" intensity={2.5} distance={10} />
        </group>
      )}

      {/* --- FORWARD RUNWAY LANDING LIGHTS --- */}
      {landingLightsOn && (
        <group>
          {/* Nose gear taxi & landing twin light beams */}
          <mesh position={[-0.2, 1.2, -14.2]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshBasicMaterial color="#FFFBEB" />
          </mesh>
          <mesh position={[0.2, 1.2, -14.2]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshBasicMaterial color="#FFFBEB" />
          </mesh>
          <spotLight
            position={[0, 1.2, -14.2]}
            target-position={[0, 0, -100]}
            color="#FFFBEB"
            intensity={4.5}
            distance={160}
            angle={Math.PI / 7}
            penumbra={0.4}
            castShadow
          />
        </group>
      )}
    </group>
  );
};
