// SeatInteraction.tsx - 3D Visual indicator for Seat 12A (Assigned window seat)
import React from 'react';

interface SeatInteractionProps {
  seatPosition: [number, number, number];
  playerPos: [number, number, number];
  isSeated: boolean;
  canStandUp: boolean;
  onToggleSeat: () => void;
}

export const SeatInteraction: React.FC<SeatInteractionProps> = ({
  seatPosition,
  isSeated,
}) => {
  return (
    <group position={seatPosition}>
      {/* Subtle blue holographic marker ring on assigned seat 12A when not seated */}
      {!isSeated && (
        <group position={[0, 0.48, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.16, 0.22, 24]} />
            <meshBasicMaterial color="#38BDF8" transparent opacity={0.65} side={2} />
          </mesh>
          <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.14, 24]} />
            <meshBasicMaterial color="#0284C7" transparent opacity={0.3} side={2} />
          </mesh>
        </group>
      )}
    </group>
  );
};
