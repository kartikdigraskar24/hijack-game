// InvestigationPanel.tsx - Dossier of discovered clues, sources, and unlocked strategic options
import React from 'react';
import { Search, Key, ShieldCheck, AlertCircle, FileSearch, Sparkles } from 'lucide-react';
import { ClueItem } from '../game/GameState';

interface InvestigationPanelProps {
  clues: ClueItem[];
  progressPercent: number;
}

export const InvestigationPanel: React.FC<InvestigationPanelProps> = ({
  clues,
  progressPercent,
}) => {
  return (
    <div className="investigation-view-container">
      {/* Top Progress & Metrics Summary */}
      <div className="investigation-summary-header">
        <div className="summary-info">
          <div className="summary-title-row">
            <Search size={18} className="text-sky" />
            <span className="summary-title">INVESTIGATION DOSSIER</span>
          </div>
          <p className="summary-sub">
            Gathered evidence unlocks crucial tactical choices during crisis management briefings.
          </p>
        </div>

        <div className="summary-progress-box">
          <div className="progress-labels">
            <span>Dossier Completeness</span>
            <span className="progress-val">{progressPercent}%</span>
          </div>
          <div className="investigation-bar-bg">
            <div
              className="investigation-bar-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Clues List */}
      <div className="clues-dossier-list">
        {clues.length === 0 ? (
          <div className="clues-empty-state">
            <FileSearch size={36} />
            <p>No investigation clues discovered yet.</p>
            <span className="empty-sub">
              Explore the aircraft cabin, inspect empty seat pockets, rear service carts, and speak with passengers.
            </span>
          </div>
        ) : (
          clues.map((clue) => (
            <div key={clue.id} className="clue-dossier-card">
              <div className="clue-card-header">
                <div className="clue-importance-tag">
                  <span className={`importance-badge ${clue.importance.toLowerCase()}`}>
                    {clue.importance} EVIDENCE
                  </span>
                </div>
                <div className="clue-source-tag">Source: {clue.source}</div>
              </div>

              <h3 className="clue-card-title">{clue.title}</h3>
              <p className="clue-card-desc">{clue.description}</p>

              {clue.unlocksDecisionId && (
                <div className="clue-unlocks-banner">
                  <Key size={14} className="unlock-key" />
                  <span>
                    Unlocks: Tactical Option in Crisis Management Matrix
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
