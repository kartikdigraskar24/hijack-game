// CinematicController.tsx - Master Cinematic Controller with 4-Phase Airport Intro for Lost Robot Rescue Agent
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { FastForward, Play, Radio, Shield, Navigation, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { CinematicIntroScene } from './CinematicIntroScene';
import { CinematicTakeoffScene } from './CinematicTakeoffScene';
import { AudioManager } from '../systems/AudioManager';
import { GameSettings } from '../game/GameState';
import '../styles/cinematics.css';

interface CinematicControllerProps {
  initialScene?: 'INTRO' | 'TAKEOFF';
  settings: GameSettings;
  onFinishCinematics: () => void;
}

export const CinematicController: React.FC<CinematicControllerProps> = ({
  initialScene = 'INTRO',
  settings,
  onFinishCinematics,
}) => {
  const [currentScene, setCurrentScene] = useState<'INTRO' | 'TAKEOFF'>(initialScene);
  const [fadeState, setFadeState] = useState<'IN' | 'OUT' | 'NONE'>('IN');
  const [introPhase, setIntroPhase] = useState<1 | 2 | 3 | 4>(1);
  const [takeoffTelemetry, setTakeoffTelemetry] = useState({
    airspeed: 0,
    altitude: 0,
    phase: 'PRE-FLIGHT CHECKS // RUNWAY 28R',
    progress: 0,
  });

  const hasTransitionedRef = useRef<boolean>(false);
  const hasChimedPhase2Ref = useRef<boolean>(false);

  // Initial smooth fade-in and audio trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeState('NONE');
    }, 1200);

    if (initialScene === 'INTRO') {
      AudioManager.startCinematicIntroAudio();
    }

    return () => {
      clearTimeout(timer);
      AudioManager.stopCinematicAudio(0.5);
    };
  }, [initialScene]);

  // Handle phase updates from the 3D intro camera choreography
  const handlePhaseUpdate = useCallback((phase: 1 | 2 | 3 | 4, _time: number) => {
    setIntroPhase(phase);

    // Play signature airport chime when entering Phase 2 (Mission Briefing)
    if (phase === 2 && !hasChimedPhase2Ref.current) {
      hasChimedPhase2Ref.current = true;
      AudioManager.playAirportChime();
    }
  }, []);

  // Complete cinematics and launch gameplay
  const handleCompleteToGameplay = useCallback(() => {
    if (hasTransitionedRef.current) return;
    hasTransitionedRef.current = true;

    setFadeState('OUT');
    AudioManager.stopCinematicAudio(0.8);

    setTimeout(() => {
      onFinishCinematics();
    }, 700);
  }, [onFinishCinematics]);

  // Skip directly to gameplay
  const handleSkip = useCallback(() => {
    AudioManager.playUIClick();
    handleCompleteToGameplay();
  }, [handleCompleteToGameplay]);

  // Global keydown handler for "Press Space/Enter to start" & "Escape to Skip"
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        e.preventDefault();
        handleSkip();
        return;
      }

      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        handleCompleteToGameplay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleSkip, handleCompleteToGameplay]);

  // Screen click handler
  const handleScreenClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;
    handleCompleteToGameplay();
  };

  return (
    <div className="cinematic-container" onClick={handleScreenClick}>
      {/* Black Fade Transition Overlay */}
      <div
        className={`cinematic-fade-overlay ${
          fadeState === 'IN' ? 'fade-in' : fadeState === 'OUT' ? 'fade-out' : ''
        }`}
      />

      {/* Atmospheric CRT & Vignette layers */}
      <div className="cinematic-vignette" />
      <div className="cinematic-scanlines" />

      {/* Widescreen 2.39:1 Cinematic Letterbox Bars */}
      <div className="cinematic-letterbox-top" />
      <div className="cinematic-letterbox-bottom" />

      {/* 3D R3F Canvas */}
      <div className="cinematic-canvas-wrapper">
        <Canvas
          shadows={settings.graphicsQuality !== 'LOW'}
          camera={{ position: [0, 6.8, -13.2], fov: settings.fov }}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        >
          {currentScene === 'INTRO' && (
            <CinematicIntroScene
              onIntroComplete={handleCompleteToGameplay}
              onPhaseUpdate={handlePhaseUpdate}
            />
          )}
          {currentScene === 'TAKEOFF' && (
            <CinematicTakeoffScene
              onTakeoffComplete={handleCompleteToGameplay}
              onTelemetryUpdate={setTakeoffTelemetry}
            />
          )}
        </Canvas>
      </div>

      {/* Cinematic UI Overlay */}
      <div className="cinematic-ui-layer">
        {/* Top Bar: Telemetry & Skip Button */}
        <div className="cinematic-top-bar">
          <div className="cinematic-telemetry-block">
            <div className="cinematic-telemetry-badge">
              <Radio size={14} />
              <span>
                {introPhase === 1 && 'ESTABLISHING // AIRPORT TERMINAL CONCOURSE 01'}
                {introPhase === 2 && 'MISSION INITIALIZED // PRIORITY SEARCH & RESCUE'}
                {introPhase === 3 && 'OBJECTIVE DIRECTIVE // BOARDING GATE 07'}
                {introPhase === 4 && 'AGENT DEPLOYMENT // FIRST-PERSON INTERFACE ACTIVE'}
              </span>
            </div>
            <div className="cinematic-telemetry-details">
              <span>INDIRA GANDHI INTL (VIDP) • FLIGHT AI-407 • GATE 07 STAND 407</span>
            </div>
          </div>

          {/* Skip directly to gameplay button */}
          <button
            className="cinematic-skip-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleSkip();
            }}
            title="Skip directly to gameplay"
          >
            <span>SKIP TO GAMEPLAY</span>
            <span className="cinematic-key-hint">ESC</span>
            <FastForward size={14} />
          </button>
        </div>

        {/* Center Content for Scene 1 (4-Phase Presentation) */}
        {currentScene === 'INTRO' && (
          <div className="cinematic-center-content">
            {/* --- PHASE 1 (0 - 4s): AIRPORT ESTABLISHING SHOT --- */}
            {introPhase === 1 && (
              <div style={{ animation: 'cinematicTitleFloat 1.2s ease-out forwards', textAlign: 'center' }}>
                <div className="cinematic-title-eyebrow">
                  AIRPORT SIMULATION & RESCUE OPERATION
                </div>
                <h1 className="cinematic-main-title" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.8rem)' }}>
                  TERMINAL CONCOURSE 01
                </h1>
                <div style={{
                  marginTop: '16px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 20px',
                  background: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid #38BDF8',
                  borderRadius: '20px',
                  color: '#93C5FD',
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.82rem',
                  letterSpacing: '0.12em'
                }}>
                  <Navigation size={14} />
                  <span>DEPARTURE HALL • FLIGHT INFORMATION BOARDS • BOARDING GATE 07</span>
                </div>
              </div>
            )}

            {/* --- PHASE 2 (4 - 9s): MISSION INTRODUCTION --- */}
            {introPhase === 2 && (
              <div style={{ animation: 'cinematicTitleFloat 1.4s ease-out forwards', textAlign: 'center' }}>
                <div className="cinematic-title-eyebrow">
                  SPECIAL AGENT DISPATCH PROTOCOL
                </div>
                <h1 className="cinematic-main-title">
                  LOST ROBOT RESCUE AGENT
                </h1>
                <h2 className="cinematic-subtitle">
                  Terminal Investigation & Concourse Rescue
                </h2>

                <div style={{
                  marginTop: '18px',
                  padding: '16px 28px',
                  background: 'rgba(15, 23, 42, 0.92)',
                  border: '1.5px solid #38BDF8',
                  borderRadius: '10px',
                  maxWidth: '680px',
                  boxShadow: '0 0 35px rgba(56, 189, 248, 0.35)',
                  textAlign: 'left'
                }}>
                  <div style={{
                    color: '#F59E0B',
                    fontFamily: 'var(--font-mono, monospace)',
                    fontWeight: 800,
                    fontSize: '0.84rem',
                    letterSpacing: '0.15em',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <AlertTriangle size={15} />
                    <span>MISSION BRIEFING // CRITICAL SECURITY INCIDENT</span>
                  </div>
                  <p style={{ color: '#E2E8F0', fontSize: '0.96rem', margin: 0, lineHeight: 1.6 }}>
                    A specialized search-and-rescue robot deployed for security diagnostics has lost signal within the airport terminal. You are tasked to navigate through the concourse, clear security screening, locate the lost robot unit, and secure the designated boarding rescue area.
                  </p>
                </div>
              </div>
            )}

            {/* --- PHASE 3 (9 - 14s): OBJECTIVE PREVIEW --- */}
            {introPhase === 3 && (
              <div style={{ animation: 'cinematicTitleFloat 1.4s ease-out forwards', textAlign: 'center' }}>
                <div className="cinematic-title-eyebrow">
                  PRIMARY RESCUE DIRECTIVE
                </div>
                <h1 className="cinematic-main-title" style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)' }}>
                  LOCATE ROBOT & REACH RESCUE AREA
                </h1>
                <h2 className="cinematic-subtitle">
                  Boarding Gate 07 & Jet Bridge Access Corridor
                </h2>

                <div style={{
                  marginTop: '16px',
                  padding: '16px 28px',
                  background: 'rgba(15, 23, 42, 0.92)',
                  border: '1.5px solid #10B981',
                  borderRadius: '10px',
                  maxWidth: '680px',
                  boxShadow: '0 0 35px rgba(16, 185, 129, 0.3)',
                  textAlign: 'left'
                }}>
                  <div style={{
                    color: '#10B981',
                    fontFamily: 'var(--font-mono, monospace)',
                    fontWeight: 800,
                    fontSize: '0.84rem',
                    letterSpacing: '0.14em',
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <CheckCircle2 size={16} />
                    <span>OPERATIONAL OBJECTIVES</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#E2E8F0', fontSize: '0.92rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#38BDF8', fontWeight: 800 }}>1.</span>
                      <span>Inspect Central & Concourse Flight Information Display Boards</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#38BDF8', fontWeight: 800 }}>2.</span>
                      <span>Complete Security Checkpoint Screening with Officer Sunil</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#FBBF24', fontWeight: 800 }}>3.</span>
                      <span>Proceed to Boarding Gate 07 and Enter the Jet Bridge Corridor</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- PHASE 4 (14 - 17.5s): TRANSITION TO GAMEPLAY --- */}
            {introPhase === 4 && (
              <div style={{ animation: 'cinematicTitleFloat 1.0s ease-out forwards', textAlign: 'center' }}>
                <div className="cinematic-title-eyebrow">
                  INITIALIZING AGENT CONTROLS
                </div>
                <h1 className="cinematic-main-title" style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.0rem)' }}>
                  SYSTEMS ONLINE
                </h1>
                <div style={{
                  marginTop: '16px',
                  padding: '12px 24px',
                  background: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid #38BDF8',
                  borderRadius: '24px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: '#F8FAFC',
                  fontSize: '0.92rem',
                  fontFamily: 'var(--font-mono, monospace)',
                  letterSpacing: '0.12em'
                }}>
                  <Shield size={16} color="#38BDF8" />
                  <span>ENTERING FIRST-PERSON TERMINAL VIEWPORT</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Center/Lower Takeoff Telemetry (Scene 2: Airplane Takeoff) */}
        {currentScene === 'TAKEOFF' && (
          <div className="cinematic-takeoff-hud">
            <div className="cinematic-takeoff-hud-row">
              <span className="cinematic-takeoff-hud-label">PHASE:</span>
              <span className={`cinematic-takeoff-hud-val ${takeoffTelemetry.altitude > 30 ? 'airborne' : 'alert'}`}>
                {takeoffTelemetry.phase}
              </span>
            </div>
            <div className="cinematic-takeoff-hud-row">
              <span className="cinematic-takeoff-hud-label">AIRSPEED:</span>
              <span className="cinematic-takeoff-hud-val">{takeoffTelemetry.airspeed} KTS</span>
            </div>
            <div className="cinematic-takeoff-hud-row">
              <span className="cinematic-takeoff-hud-label">ALTITUDE:</span>
              <span className="cinematic-takeoff-hud-val">{takeoffTelemetry.altitude} FT</span>
            </div>
          </div>
        )}

        {/* Bottom Bar: Interactive Prompt & Guidance */}
        <div className="cinematic-bottom-bar">
          <button
            className="cinematic-continue-prompt"
            onClick={(e) => {
              e.stopPropagation();
              handleCompleteToGameplay();
            }}
          >
            <Play size={16} fill="#F8FAFC" />
            <span>START MISSION (SPACE / CLICK)</span>
          </button>

          <div className="cinematic-footer-info">
            <span>LOST ROBOT RESCUE AGENT • AIRPORT TERMINAL SIMULATION ENGINE</span>
            <span>WASD TO MOVE • E TO INTERACT • TAB FOR DOSSIER • ESC TO PAUSE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
