// DossierModal.tsx - Unified modal container for Map, Inventory, and Investigation tabs [Tab key]
import React from 'react';
import { Compass, BookOpen, Search, X } from 'lucide-react';
import { GameState } from '../game/GameState';
import { MapPanel } from './MapPanel';
import { InventoryPanel } from './InventoryPanel';
import { InvestigationPanel } from './InvestigationPanel';
import { AudioManager } from '../systems/AudioManager';
import { InputManager } from '../game/InputManager';

interface DossierModalProps {
  activeTab: 'MAP' | 'INVENTORY' | 'INVESTIGATION';
  onSwitchTab: (tab: 'MAP' | 'INVENTORY' | 'INVESTIGATION') => void;
  onClose: () => void;
  state: GameState;
}

export const DossierModal: React.FC<DossierModalProps> = ({
  activeTab,
  onSwitchTab,
  onClose,
  state,
}) => {
  React.useEffect(() => {
    InputManager.exitPointerLock();
  }, []);

  const handleTabClick = (tab: 'MAP' | 'INVENTORY' | 'INVESTIGATION') => {
    AudioManager.playUIClick();
    onSwitchTab(tab);
  };

  const handleClose = () => {
    AudioManager.playUIClick();
    onClose();
  };

  return (
    <div className="dossier-modal-overlay">
      <div className="dossier-modal-window">
        {/* Top Navigation Tabs Header */}
        <div className="dossier-header-bar">
          <div className="dossier-tabs-group">
            <button
              className={`dossier-tab-btn ${activeTab === 'MAP' ? 'active' : ''}`}
              onClick={() => handleTabClick('MAP')}
            >
              <Compass size={16} />
              <span>TACTICAL MAP</span>
            </button>

            <button
              className={`dossier-tab-btn ${activeTab === 'INVENTORY' ? 'active' : ''}`}
              onClick={() => handleTabClick('INVENTORY')}
            >
              <BookOpen size={16} />
              <span>INVENTORY ({state.inventory.length})</span>
            </button>

            <button
              className={`dossier-tab-btn ${activeTab === 'INVESTIGATION' ? 'active' : ''}`}
              onClick={() => handleTabClick('INVESTIGATION')}
            >
              <Search size={16} />
              <span>INVESTIGATION DOSSIER ({state.clues.length})</span>
            </button>
          </div>

          <button className="dossier-close-btn" onClick={handleClose} title="Close Dossier [Tab / Esc]">
            <X size={18} />
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="dossier-tab-body">
          {activeTab === 'MAP' && (
            <MapPanel
              level={state.currentLevel}
              playerPos={state.playerPosition}
              activeObjective={state.activeObjectiveId}
            />
          )}

          {activeTab === 'INVENTORY' && <InventoryPanel items={state.inventory} />}

          {activeTab === 'INVESTIGATION' && (
            <InvestigationPanel
              clues={state.clues}
              progressPercent={state.investigationProgress}
            />
          )}
        </div>

        {/* Footer with hint */}
        <div className="dossier-footer-bar">
          <span>Press [TAB] or [ESC] to resume exploration</span>
        </div>
      </div>
    </div>
  );
};
