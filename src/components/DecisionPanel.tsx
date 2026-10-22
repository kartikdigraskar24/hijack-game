// DecisionPanel.tsx - High-stakes Critical Decision branching interface for Level 3
import React, { useEffect, useState, useRef } from 'react';
import { AlertOctagon, CheckCircle2, Lock, ArrowRight, ShieldCheck, Flame, Keyboard } from 'lucide-react';
import { CriticalDecision, DecisionOption } from '../game/GameState';
import { AudioManager } from '../systems/AudioManager';
import { InputManager } from '../game/InputManager';

interface DecisionPanelProps {
  decision: CriticalDecision;
  unlockedClueIds: string[];
  onSelectOption: (option: DecisionOption) => void;
  onCancel?: () => void;
}

export const DecisionPanel: React.FC<DecisionPanelProps> = ({
  decision,
  unlockedClueIds,
  onSelectOption,
  onCancel,
}) => {
  const [selectedOptId, setSelectedOptId] = useState<string | null>(null);
  const executedRef = useRef(false);

  // Release pointer lock immediately when decision window opens so mouse is available
  useEffect(() => {
    InputManager.exitPointerLock();
  }, []);

  const executeSelection = (opt: DecisionOption, isLocked: boolean) => {
    if (isLocked) {
      AudioManager.playUIClick(true);
      return;
    }
    if (executedRef.current) return;
    executedRef.current = true;

    setSelectedOptId(opt.id);
    AudioManager.playUIClick();

    // Subtle 140ms delay for visible feedback before advancing
    setTimeout(() => {
      onSelectOption(opt);
    }, 140);
  };

  // Keyboard number listener for keys 1 to 4 (top row and numpad)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (executedRef.current) return;

      let optionIndex = -1;
      if (e.key === '1' || e.code === 'Digit1' || e.code === 'Numpad1') optionIndex = 0;
      else if (e.key === '2' || e.code === 'Digit2' || e.code === 'Numpad2') optionIndex = 1;
      else if (e.key === '3' || e.code === 'Digit3' || e.code === 'Numpad3') optionIndex = 2;
      else if (e.key === '4' || e.code === 'Digit4' || e.code === 'Numpad4') optionIndex = 3;

      if (optionIndex >= 0 && optionIndex < decision.options.length) {
        e.preventDefault();
        e.stopPropagation();

        const opt = decision.options[optionIndex];
        const isLocked = !!opt.requiredClueId && !unlockedClueIds.includes(opt.requiredClueId);
        executeSelection(opt, isLocked);
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, [decision.options, unlockedClueIds]);

  return (
    <div className="decision-modal-overlay">
      <div className="decision-modal-card">
        {/* Urgent Alert Header */}
        <div className="decision-header">
          <div className="decision-alert-tag">
            <AlertOctagon size={18} />
            <span>CRITICAL DECISION MATRIX // FLIGHT 407</span>
          </div>
          <h2 className="decision-title">{decision.title}</h2>
          <div className="decision-speaker">
            <span className="speaker-lead">Speaker:</span> {decision.speaker}
          </div>
        </div>

        {/* Narrative Context Briefing */}
        <div className="decision-context-box">
          <p className="context-text">{decision.context}</p>
        </div>

        {/* The Core Question / Dilemma */}
        <div className="decision-prompt-banner">
          <Flame size={18} className="prompt-flame" />
          <span>{decision.prompt}</span>
        </div>

        {/* Keyboard Instruction Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', color: '#93C5FD', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
          <Keyboard size={15} />
          <span>PRESS NUMBER KEYS [ 1 ] - [ 4 ] OR CLICK TO CHOOSE:</span>
        </div>

        {/* Options List */}
        <div className="decision-options-list">
          {decision.options.map((opt, idx) => {
            const isLocked = !!opt.requiredClueId && !unlockedClueIds.includes(opt.requiredClueId);
            const isSelected = selectedOptId === opt.id;

            return (
              <div
                key={opt.id}
                className={`decision-option-card ${isLocked ? 'locked-option' : 'active-option'} ${isSelected ? 'selected-option' : ''}`}
                onClick={() => executeSelection(opt, isLocked)}
              >
                {/* Number Key Badge */}
                <div className="decision-key-badge">
                  {idx + 1}
                </div>

                <div className="option-status-icon">
                  {isLocked ? (
                    <Lock size={20} className="icon-locked" />
                  ) : (
                    <CheckCircle2 size={20} className="icon-unlocked" />
                  )}
                </div>

                <div className="option-content">
                  <div className="option-title-row">
                    <span className="option-title-text">{opt.text}</span>
                    {isLocked && <span className="locked-badge">REQUIRES INVESTIGATION CLUE</span>}
                  </div>

                  {opt.subtext && <p className="option-subtext">{opt.subtext}</p>}

                  {/* Impact preview */}
                  {!isLocked && (
                    <div className="option-impact-tags">
                      {opt.effects.passengerSafetyChange > 0 && (
                        <span className="impact-tag positive">
                          <ShieldCheck size={12} /> +{opt.effects.passengerSafetyChange}% Safety
                        </span>
                      )}
                      {opt.effects.passengerSafetyChange < 0 && (
                        <span className="impact-tag negative">
                          -{Math.abs(opt.effects.passengerSafetyChange)}% Safety Risk
                        </span>
                      )}
                      {opt.effects.crewCooperationChange > 0 && (
                        <span className="impact-tag neutral">
                          +{opt.effects.crewCooperationChange}% Crew Trust
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {!isLocked && <ArrowRight size={18} className="option-arrow" />}
              </div>
            );
          })}
        </div>

        {/* Informative Footer */}
        <div className="decision-footer">
          <p>
            * All decisions permanently influence passenger safety, crew trust, and the final ending.
          </p>
          {onCancel && (
            <button className="decision-back-btn" onClick={onCancel}>
              Review Investigation Dossier First
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
