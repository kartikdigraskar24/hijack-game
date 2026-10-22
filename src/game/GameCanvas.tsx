// GameCanvas.tsx - R3F 3D Canvas Rendering System for HIJACK
import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { FirstPersonCamera } from '../player/FirstPersonCamera';
import { PlayerController } from '../player/PlayerController';
import { AirportLevel } from '../levels/AirportLevel';
import { AircraftLevel } from '../levels/AircraftLevel';
import { FinalLevel } from '../levels/FinalLevel';
import { GameSettings } from './GameState';
import { InputManager } from './InputManager';

interface GameCanvasProps {
  currentLevel: 1 | 2 | 3;
  playerPos: [number, number, number];
  onPositionChange: (pos: [number, number, number]) => void;
  isSeated: boolean;
  canStandUp: boolean;
  onToggleSeat: () => void;
  onInteractNPC: (npcId: string) => void;
  onInspectBoard: () => void;
  onBoardAircraft: () => void;
  onCollectClue: (clueId: string) => void;
  onOpenDecision: () => void;
  collectedItemIds: string[];
  activeNpcId: string | null;
  boardingUnlocked: boolean;
  flightPhase: string;
  decisionMade: boolean;
  settings: GameSettings;
  isPaused: boolean;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  currentLevel,
  playerPos,
  onPositionChange,
  isSeated,
  canStandUp,
  onToggleSeat,
  onInteractNPC,
  onInspectBoard,
  onBoardAircraft,
  onCollectClue,
  onOpenDecision,
  collectedItemIds,
  activeNpcId,
  boardingUnlocked,
  flightPhase,
  decisionMade,
  settings,
  isPaused,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleCanvasClick = () => {
    if (!isPaused && containerRef.current) {
      InputManager.requestPointerLock(containerRef.current);
    }
  };

  return (
    <div
      ref={containerRef}
      className="game-canvas-container"
      onClick={handleCanvasClick}
    >
      <Canvas
        shadows={settings.graphicsQuality !== 'LOW'}
        camera={{ position: [0, 2, 4], fov: settings.fov }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        {/* Responsive First-Person Camera with zero lag and anti-clipping */}
        <FirstPersonCamera
          targetPosition={playerPos}
          isSeated={isSeated}
          sensitivity={settings.mouseSensitivity}
          fov={settings.fov}
          level={currentLevel}
          isFirstPerson={true}
        />

        {/* Playable Protagonist (Arjun Mehra) */}
        <PlayerController
          position={playerPos}
          onPositionChange={onPositionChange}
          isSeated={isSeated}
          level={currentLevel}
          isPaused={isPaused}
        />

        {/* Level Rendering Switcher */}
        {currentLevel === 1 && (
          <AirportLevel
            playerPos={playerPos}
            onInteractNPC={onInteractNPC}
            onInspectBoard={onInspectBoard}
            onBoardAircraft={onBoardAircraft}
            activeNpcId={activeNpcId}
            boardingUnlocked={boardingUnlocked}
          />
        )}

        {currentLevel === 2 && (
          <AircraftLevel
            playerPos={playerPos}
            isSeated={isSeated}
            canStandUp={canStandUp}
            onToggleSeat={onToggleSeat}
            onInteractNPC={onInteractNPC}
            onCollectClue={onCollectClue}
            collectedItemIds={collectedItemIds}
            activeNpcId={activeNpcId}
            flightPhase={flightPhase}
          />
        )}

        {currentLevel === 3 && (
          <FinalLevel
            playerPos={playerPos}
            onInteractNPC={onInteractNPC}
            onOpenDecision={onOpenDecision}
            activeNpcId={activeNpcId}
            decisionMade={decisionMade}
          />
        )}
      </Canvas>
    </div>
  );
};
