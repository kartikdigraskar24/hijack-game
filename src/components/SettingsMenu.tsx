// SettingsMenu.tsx - Audio, graphics, and controls configuration
import React from 'react';
import { Volume2, VolumeX, Eye, MousePointer, Monitor, X, Check } from 'lucide-react';
import { GameSettings } from '../game/GameState';
import { AudioManager } from '../systems/AudioManager';
import { InputManager } from '../game/InputManager';

interface SettingsMenuProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onClose: () => void;
}

export const SettingsMenu: React.FC<SettingsMenuProps> = ({
  settings,
  onUpdateSettings,
  onClose,
}) => {
  React.useEffect(() => {
    InputManager.exitPointerLock();
  }, []);

  const handleVolumeChange = (key: keyof GameSettings, value: number) => {
    const updated = { ...settings, [key]: value };
    onUpdateSettings(updated);
    AudioManager.updateVolumes(updated.masterVolume, updated.sfxVolume, updated.musicVolume);
  };

  const handleGraphicsChange = (quality: 'LOW' | 'MEDIUM' | 'HIGH') => {
    AudioManager.playUIClick();
    onUpdateSettings({ ...settings, graphicsQuality: quality });
  };

  return (
    <div className="settings-modal-overlay">
      <div className="settings-modal-card">
        <div className="settings-header">
          <h2 className="settings-title">SYSTEM SETTINGS</h2>
          <button className="settings-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="settings-body">
          {/* Audio Section */}
          <div className="settings-section">
            <div className="section-title">
              <Volume2 size={16} />
              <span>AUDIO CONTROLS</span>
            </div>

            {/* Master Volume */}
            <div className="setting-row">
              <div className="setting-label">Master Volume</div>
              <div className="setting-control">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.masterVolume}
                  onChange={(e) => handleVolumeChange('masterVolume', Number(e.target.value))}
                />
                <span className="setting-val-display">{settings.masterVolume}%</span>
              </div>
            </div>

            {/* SFX Volume */}
            <div className="setting-row">
              <div className="setting-label">Sound Effects (SFX)</div>
              <div className="setting-control">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.sfxVolume}
                  onChange={(e) => handleVolumeChange('sfxVolume', Number(e.target.value))}
                />
                <span className="setting-val-display">{settings.sfxVolume}%</span>
              </div>
            </div>

            {/* Music & Ambience Volume */}
            <div className="setting-row">
              <div className="setting-label">Aviation Ambience & Music</div>
              <div className="setting-control">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.musicVolume}
                  onChange={(e) => handleVolumeChange('musicVolume', Number(e.target.value))}
                />
                <span className="setting-val-display">{settings.musicVolume}%</span>
              </div>
            </div>
          </div>

          {/* Gameplay & Camera Section */}
          <div className="settings-section">
            <div className="section-title">
              <MousePointer size={16} />
              <span>CAMERA & CONTROLS</span>
            </div>

            {/* Mouse Sensitivity */}
            <div className="setting-row">
              <div className="setting-label">Mouse Sensitivity</div>
              <div className="setting-control">
                <input
                  type="range"
                  min="0.4"
                  max="2.5"
                  step="0.1"
                  value={settings.mouseSensitivity}
                  onChange={(e) =>
                    onUpdateSettings({ ...settings, mouseSensitivity: Number(e.target.value) })
                  }
                />
                <span className="setting-val-display">{settings.mouseSensitivity.toFixed(1)}x</span>
              </div>
            </div>

            {/* Field of View (FOV) */}
            <div className="setting-row">
              <div className="setting-label">Field of View (FOV)</div>
              <div className="setting-control">
                <input
                  type="range"
                  min="55"
                  max="85"
                  value={settings.fov}
                  onChange={(e) =>
                    onUpdateSettings({ ...settings, fov: Number(e.target.value) })
                  }
                />
                <span className="setting-val-display">{settings.fov}°</span>
              </div>
            </div>
          </div>

          {/* Graphics Quality */}
          <div className="settings-section">
            <div className="section-title">
              <Monitor size={16} />
              <span>GRAPHICS PRESET</span>
            </div>

            <div className="graphics-preset-row">
              {(['LOW', 'MEDIUM', 'HIGH'] as const).map((q) => (
                <button
                  key={q}
                  className={`preset-btn ${settings.graphicsQuality === q ? 'active' : ''}`}
                  onClick={() => handleGraphicsChange(q)}
                >
                  {settings.graphicsQuality === q && <Check size={14} />}
                  <span>{q} QUALITY</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="settings-footer">
          <button className="menu-button primary-button" onClick={onClose}>
            <span>APPLY & CLOSE</span>
          </button>
        </div>
      </div>
    </div>
  );
};
