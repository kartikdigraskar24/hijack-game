// DialoguePanel.tsx - Interactive conversation dialogue interface
import React from 'react';
import { MessageSquare, User, ArrowRight, X } from 'lucide-react';
import { AudioManager } from '../systems/AudioManager';

import { InputManager } from '../game/InputManager';

interface DialoguePanelProps {
  dialogue: {
    npcId: string;
    npcName: string;
    npcRole: string;
    text: string;
    options?: {
      text: string;
      nextId?: string;
      action?: string;
    }[];
  };
  onSelectOption: (option: { text: string; nextId?: string; action?: string }) => void;
  onClose: () => void;
}

export const DialoguePanel: React.FC<DialoguePanelProps> = ({
  dialogue,
  onSelectOption,
  onClose,
}) => {
  // Release pointer lock when dialogue mounts
  React.useEffect(() => {
    InputManager.exitPointerLock();
  }, []);

  const handleOptionClick = (opt: { text: string; nextId?: string; action?: string }) => {
    AudioManager.playUIClick();
    onSelectOption(opt);
  };

  const handleClose = () => {
    AudioManager.playUIClick();
    onClose();
  };

  // Keyboard number selection 1-4, Escape to leave
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
        return;
      }

      let optionIndex = -1;
      if (e.key === '1' || e.code === 'Digit1' || e.code === 'Numpad1') optionIndex = 0;
      else if (e.key === '2' || e.code === 'Digit2' || e.code === 'Numpad2') optionIndex = 1;
      else if (e.key === '3' || e.code === 'Digit3' || e.code === 'Numpad3') optionIndex = 2;
      else if (e.key === '4' || e.code === 'Digit4' || e.code === 'Numpad4') optionIndex = 3;

      if (dialogue.options && dialogue.options.length > 0) {
        if (optionIndex >= 0 && optionIndex < dialogue.options.length) {
          e.preventDefault();
          e.stopPropagation();
          handleOptionClick(dialogue.options[optionIndex]);
        }
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [dialogue.options]);

  return (
    <div className="dialogue-overlay">
      <div className="dialogue-card">
        {/* Header with speaker badge */}
        <div className="dialogue-header">
          <div className="dialogue-speaker-info">
            <div className="speaker-avatar">
              <User size={18} />
            </div>
            <div>
              <div className="speaker-name">{dialogue.npcName}</div>
              <div className="speaker-role">{dialogue.npcRole}</div>
            </div>
          </div>
          <button className="dialogue-close-btn" onClick={handleClose} title="End Conversation">
            <X size={18} />
          </button>
        </div>

        {/* Spoken Text Body */}
        <div className="dialogue-body">
          <MessageSquare size={16} className="dialogue-quote-icon" />
          <p className="dialogue-text">"{dialogue.text}"</p>
        </div>

        {/* Player Response Choices */}
        <div className="dialogue-options">
          {dialogue.options && dialogue.options.length > 0 ? (
            dialogue.options.map((opt, idx) => (
              <button
                key={idx}
                className="dialogue-choice-btn"
                onClick={() => handleOptionClick(opt)}
              >
                <span className="choice-number">{idx + 1}</span>
                <span className="choice-text">{opt.text}</span>
                <ArrowRight size={15} className="choice-arrow" />
              </button>
            ))
          ) : (
            <button className="dialogue-choice-btn" onClick={handleClose}>
              <span className="choice-text">Leave conversation</span>
              <ArrowRight size={15} className="choice-arrow" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
