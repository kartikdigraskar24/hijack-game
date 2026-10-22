// MainMenu.tsx - Cinematic Aviation Main Menu for HIJACK
import React from 'react';
import { Play, RotateCcw, Sliders, LogOut, Shield, Compass, Film } from 'lucide-react';
import { AudioManager } from '../systems/AudioManager';
import { InputManager } from '../game/InputManager';

interface MainMenuProps {
  onStartGame: () => void;
  onContinue: () => void;
  onOpenSettings: () => void;
  onWatchCinematics?: () => void;
  hasSavedGame: boolean;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartGame,
  onContinue,
  onOpenSettings,
  onWatchCinematics,
  hasSavedGame,
}) => {
  React.useEffect(() => {
    InputManager.exitPointerLock();
  }, []);

  const handleButtonClick = (action: () => void) => {
    AudioManager.playUIClick();
    action();
  };

  const handleExit = () => {
    AudioManager.playUIClick();
    alert('Thank you for playing HIJACK. You can close this browser tab at any time.');
  };

  return (
    <div className="main-menu-wrapper">
      {/* Cinematic Aviation Video/Atmospheric Backdrop */}
      <div className="main-menu-backdrop" />
      <div className="main-menu-overlay" />

      {/* Subtle radar / compass ring aesthetic */}
      <div className="menu-radar-grid" />

      <div className="main-menu-content">
        {/* Top Airline Tag */}
        <div className="menu-flight-tag">
          <Compass size={14} className="tag-icon" />
          <span>FLIGHT 407 // STRATEGIC SIMULATION</span>
        </div>

        {/* Cinematic Title & Subtitle */}
        <h1 className="menu-main-title">HIJACK</h1>
        <h2 className="menu-subtitle">Every Decision Has a Consequence</h2>

        <p className="menu-description">
          You are Arjun Mehra, aboard Flight 407. Explore the airport, board the
          aircraft, investigate suspicious behavior, and make decisions that shape
          the outcome.
        </p>

        {/* Main Action Buttons */}
        <div className="menu-button-group">
          <button
            className="menu-button primary-button"
            onClick={() => handleButtonClick(onStartGame)}
          >
            <Play size={18} />
            <span>START GAME</span>
          </button>

          <button
            className={`menu-button ${hasSavedGame ? 'active-button' : 'disabled-button'}`}
            onClick={() => hasSavedGame && handleButtonClick(onContinue)}
            disabled={!hasSavedGame}
          >
            <RotateCcw size={18} />
            <span>CONTINUE</span>
            {hasSavedGame && <span className="save-badge">CHECKPOINT</span>}
          </button>

          {onWatchCinematics && (
            <button
              className="menu-button"
              onClick={() => handleButtonClick(onWatchCinematics)}
            >
              <Film size={18} />
              <span>CINEMATIC PROLOGUE</span>
            </button>
          )}

          <button
            className="menu-button"
            onClick={() => handleButtonClick(onOpenSettings)}
          >
            <Sliders size={18} />
            <span>SETTINGS</span>
          </button>

          <button className="menu-button exit-button" onClick={handleExit}>
            <LogOut size={18} />
            <span>EXIT</span>
          </button>
        </div>

        {/* Bottom Aviation Details */}
        <div className="menu-footer">
          <div className="footer-item">
            <Shield size={14} />
            <span>FLIGHT CREW COOPERATION & CRISIS MANAGEMENT SYSTEM</span>
          </div>
          <div className="footer-item">
            <span>VERSION 1.0 // THREE-PHASE STORYLINE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
