// HUD.tsx - In-game Heads Up Display for metrics, objectives, prompts, and controls
import React from 'react';
import { Shield, Search, HeartHandshake, Compass, BookOpen, AlertTriangle, CheckCircle2, Sparkles } from 'lucide-react';
import { GameState } from '../game/GameState';

interface HUDProps {
  state: GameState;
  onOpenTab: (tab: 'MAP' | 'INVENTORY' | 'INVESTIGATION') => void;
  onPause: () => void;
  onSkipTitleCard?: () => void;
}

export const HUD: React.FC<HUDProps> = ({ state, onOpenTab, onPause, onSkipTitleCard }) => {
  const currentObj = state.objectives.find((o) => o.id === state.activeObjectiveId);
  const optionalObjs = state.objectives.filter(
    (o) => o.level === state.currentLevel && o.isOptional && !o.completed
  );

  const levelTitles: Record<number, { num: string; title: string }> = {
    1: { num: 'LEVEL 1', title: 'BOARD THE FLIGHT' },
    2: { num: 'LEVEL 2', title: 'SETTLE IN' },
    3: { num: 'LEVEL 3', title: 'HIJACK — NO WAY OUT' },
  };

  const levelInfo = levelTitles[state.currentLevel] || { num: 'LEVEL 1', title: 'BOARD THE FLIGHT' };

  // Calculate safety color
  const safetyColor =
    state.passengerSafety >= 75
      ? '#10B981'
      : state.passengerSafety >= 45
      ? '#F59E0B'
      : '#EF4444';

  return (
    <div className="game-hud-overlay">
      {/* Top Left: Level & Active Objective Card */}
      <div className="hud-top-left">
        <div className="hud-level-badge">
          <span className="badge-level">{levelInfo.num}</span>
          <span className="badge-sep">—</span>
          <span className="badge-name">{levelInfo.title}</span>
        </div>

        {currentObj && (
          <div className="hud-objective-card">
            <div className="objective-header">
              <Compass size={14} className="obj-icon" />
              <span>MAIN OBJECTIVE</span>
            </div>
            <div className="objective-title">{currentObj.title}</div>
            <div className="objective-desc">{currentObj.description}</div>

            {optionalObjs.length > 0 && (
              <div className="hud-optional-list">
                <div className="optional-header">OPTIONAL OBJECTIVES:</div>
                {optionalObjs.map((opt) => (
                  <div key={opt.id} className="optional-item">
                    <span className="bullet">○</span>
                    <span>{opt.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Top Right: Crisis Management Telemetry & Dossier Button */}
      <div className="hud-top-right">
        <div className="hud-telemetry-panel">
          {/* Passenger Safety */}
          <div className="telemetry-row">
            <div className="telemetry-label">
              <Shield size={13} style={{ color: safetyColor }} />
              <span>Passenger Safety</span>
            </div>
            <div className="telemetry-bar-container">
              <div
                className="telemetry-bar-fill"
                style={{ width: `${state.passengerSafety}%`, backgroundColor: safetyColor }}
              />
            </div>
            <span className="telemetry-value" style={{ color: safetyColor }}>
              {state.passengerSafety}%
            </span>
          </div>

          {/* Investigation Progress */}
          <div className="telemetry-row">
            <div className="telemetry-label">
              <Search size={13} className="text-sky" />
              <span>Investigation</span>
            </div>
            <div className="telemetry-bar-container">
              <div
                className="telemetry-bar-fill bg-sky"
                style={{ width: `${state.investigationProgress}%` }}
              />
            </div>
            <span className="telemetry-value text-sky">{state.investigationProgress}%</span>
          </div>

          {/* Crew Cooperation */}
          <div className="telemetry-row">
            <div className="telemetry-label">
              <HeartHandshake size={13} className="text-indigo" />
              <span>Crew Trust</span>
            </div>
            <div className="telemetry-bar-container">
              <div
                className="telemetry-bar-fill bg-indigo"
                style={{ width: `${state.crewCooperation}%` }}
              />
            </div>
            <span className="telemetry-value text-indigo">{state.crewCooperation}%</span>
          </div>
        </div>

        {/* Quick Dossier Open Buttons */}
        <div className="hud-dossier-actions">
          <button
            className="hud-action-pill"
            onClick={() => onOpenTab('MAP')}
            title="Open Map [Tab]"
          >
            <Compass size={14} />
            <span>Map</span>
          </button>
          <button
            className="hud-action-pill"
            onClick={() => onOpenTab('INVENTORY')}
            title="Open Inventory [Tab]"
          >
            <BookOpen size={14} />
            <span>Items ({state.inventory.length})</span>
          </button>
          <button
            className="hud-action-pill highlight-pill"
            onClick={() => onOpenTab('INVESTIGATION')}
            title="Open Investigation Dossier [Tab]"
          >
            <Search size={14} />
            <span>Clues ({state.clues.length})</span>
          </button>
        </div>

        {/* Top-Right Temporary Notification Toast (Evidence, Objectives, Clearances) */}
        {state.hudNotification && (
          <div className={`hud-toast-notification toast-${state.hudNotification.type.toLowerCase()}`}>
            <div className="toast-header">
              {state.hudNotification.type === 'CLUE' && <Sparkles size={14} className="toast-icon-sparkle" />}
              {state.hudNotification.type === 'OBJECTIVE' && <CheckCircle2 size={14} className="toast-icon-check" />}
              {state.hudNotification.type === 'INFO' && <AlertTriangle size={14} className="toast-icon-info" />}
              <span className="toast-title">{state.hudNotification.title}</span>
            </div>
            <div className="toast-message">{state.hudNotification.message}</div>
          </div>
        )}
      </div>

      {/* Center Cinematic Banner (e.g. During Takeoff or Boarding Cutscene) */}
      {state.inCutscene && (
        <div className="hud-cutscene-overlay">
          <div className="cutscene-card">
            <AlertTriangle size={24} className="cutscene-icon" />
            <div className="cutscene-text">{state.cutsceneText}</div>
          </div>
        </div>
      )}

      {/* Seated Indicator Banner */}
      {state.isSeated && (
        <div className="hud-seated-banner">
          <span className="seated-pulse">●</span>
          <span>
            SEATED IN ROW 12A // {state.canStandUp ? 'PRESS [E] TO STAND UP' : 'REMAIN SEATED DURING ASCENT'}
          </span>
        </div>
      )}

      {/* Bottom Center: Single Prioritized Contextual Interaction Prompt */}
      {state.activeInteraction && !state.activeDialogue && !state.activeDecision && (
        <div className="hud-interaction-container">
          <div className="hud-interaction-pill">
            <span className="hud-interaction-key">E</span>
            <div className="hud-interaction-text">
              <span className="hud-interaction-label">{state.activeInteraction.label}</span>
              {state.activeInteraction.subtitle && (
                <span className="hud-interaction-sub">{state.activeInteraction.subtitle}</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Cinematic Title Card for Level 2 */}
      {state.level2TitleCardVisible && (
        <div className="cinematic-title-card-overlay" onClick={onSkipTitleCard}>
          <div className="cinematic-card-content">
            <div className="cinematic-level-tag">LEVEL 2</div>
            <h1 className="cinematic-main-title">SIGNS OF DANGER</h1>
            <div className="cinematic-flight-tag">FLIGHT 407 — CRUISING ALTITUDE</div>
            <div className="cinematic-divider" />
            <p className="cinematic-quote">“Everything appears normal. For now.”</p>
            <div className="cinematic-skip-hint">PRESS [SPACE] OR CLICK TO CONTINUE</div>
          </div>
        </div>
      )}

      {/* Bottom Bar: Controls Guide */}
      <div className="hud-bottom-bar">
        <div className="controls-badge">
          <span className="ctrl-key">W A S D</span>
          <span className="ctrl-name">Move</span>
        </div>
        <div className="controls-badge">
          <span className="ctrl-key">MOUSE</span>
          <span className="ctrl-name">Look</span>
        </div>
        <div className="controls-badge">
          <span className="ctrl-key">E</span>
          <span className="ctrl-name">Interact</span>
        </div>
        <div className="controls-badge">
          <span className="ctrl-key">SHIFT</span>
          <span className="ctrl-name">Crouch</span>
        </div>
        <div className="controls-badge">
          <span className="ctrl-key">TAB</span>
          <span className="ctrl-name">Dossier / Map</span>
        </div>
        <div className="controls-badge">
          <span className="ctrl-key">ESC</span>
          <span className="ctrl-name">Pause</span>
        </div>
      </div>
    </div>
  );
};
