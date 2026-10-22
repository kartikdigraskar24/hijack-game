// PauseMenu.tsx - In-game Pause Menu
import React from 'react';
import { Play, RotateCcw, Sliders, Home } from 'lucide-react';
import { AudioManager } from '../systems/AudioManager';
import { InputManager } from '../game/InputManager';

interface PauseMenuProps {
  onResume: () => void;
  onRestartCheckpoint: () => void;
  onOpenSettings: () => void;
  onExitToMenu: () => void;
}

export const PauseMenu: React.FC<PauseMenuProps> = ({
  onResume,
  onRestartCheckpoint,
  onOpenSettings,
  onExitToMenu,
}) => {
  React.useEffect(() => {
    InputManager.exitPointerLock();
  }, []);

  const handleClick = (action: () => void) => {
    AudioManager.playUIClick();
    action();
  };

  return (
    <div className="pause-menu-overlay">
      <div className="pause-menu-card">
        <h2 className="pause-title">GAME PAUSED</h2>
        <div className="pause-sub">FLIGHT 407 // SIMULATION SUSPENDED</div>

        <div className="pause-buttons-list">
          <button className="menu-button primary-button" onClick={() => handleClick(onResume)}>
            <Play size={18} />
            <span>RESUME GAME</span>
          </button>

          <button className="menu-button" onClick={() => handleClick(onRestartCheckpoint)}>
            <RotateCcw size={18} />
            <span>RESTART CHECKPOINT</span>
          </button>

          <button className="menu-button" onClick={() => handleClick(onOpenSettings)}>
            <Sliders size={18} />
            <span>SETTINGS</span>
          </button>

          <button className="menu-button exit-button" onClick={() => handleClick(onExitToMenu)}>
            <Home size={18} />
            <span>MAIN MENU</span>
          </button>
        </div>
      </div>
    </div>
  );
};
