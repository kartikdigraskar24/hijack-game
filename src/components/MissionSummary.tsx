// MissionSummary.tsx - Post-Game Ending Evaluation & Debriefing Screen
import React from 'react';
import { Trophy, AlertTriangle, ShieldCheck, RotateCcw, Home, CheckCircle2, ChevronRight } from 'lucide-react';
import { GameState } from '../game/GameState';
import { ENDINGS_DATA } from '../data/decisions';
import { AudioManager } from '../systems/AudioManager';

interface MissionSummaryProps {
  state: GameState;
  onReplay: () => void;
  onReturnToMenu: () => void;
}

export const MissionSummary: React.FC<MissionSummaryProps> = ({
  state,
  onReplay,
  onReturnToMenu,
}) => {
  const endingType = state.ending || 'PARTIAL';
  const details = ENDINGS_DATA[endingType];

  const handleAction = (action: () => void) => {
    AudioManager.playUIClick();
    action();
  };

  return (
    <div className="ending-screen-wrapper">
      <div className="ending-card">
        {/* Top Outcome Badge */}
        <div className="ending-badge-banner" style={{ borderColor: details.badgeColor }}>
          {endingType === 'SUCCESS' ? (
            <Trophy size={28} style={{ color: details.badgeColor }} />
          ) : endingType === 'PARTIAL' ? (
            <CheckCircle2 size={28} style={{ color: details.badgeColor }} />
          ) : (
            <AlertTriangle size={28} style={{ color: details.badgeColor }} />
          )}
          <div>
            <h1 className="ending-title" style={{ color: details.badgeColor }}>
              {details.title}
            </h1>
            <div className="ending-subtitle">{details.subtitle}</div>
          </div>
        </div>

        {/* Narrative Debrief Text */}
        <div className="ending-narrative-box">
          <p className="narrative-text">{details.summary}</p>
        </div>

        {/* Core Final Metrics */}
        <div className="ending-metrics-grid">
          <div className="metric-box">
            <span className="metric-title">Passenger Safety</span>
            <span className="metric-value" style={{ color: details.badgeColor }}>
              {state.passengerSafety}%
            </span>
          </div>
          <div className="metric-box">
            <span className="metric-title">Crew Cooperation</span>
            <span className="metric-value">{state.crewCooperation}%</span>
          </div>
          <div className="metric-box">
            <span className="metric-title">Evidence Gathered</span>
            <span className="metric-value">{state.clues.length} / 4</span>
          </div>
        </div>

        {/* Storyline Outcome Key Points */}
        <div className="ending-outcomes-list">
          <div className="outcome-header">FLIGHT 407 INCIDENT REPORT:</div>
          {details.points.map((pt, idx) => (
            <div key={idx} className="outcome-row">
              <ChevronRight size={14} className="outcome-arrow" />
              <span>{pt}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="ending-actions-row">
          <button className="menu-button primary-button" onClick={() => handleAction(onReplay)}>
            <RotateCcw size={18} />
            <span>REPLAY MISSION</span>
          </button>
          <button className="menu-button" onClick={() => handleAction(onReturnToMenu)}>
            <Home size={18} />
            <span>MAIN MENU</span>
          </button>
        </div>
      </div>
    </div>
  );
};
