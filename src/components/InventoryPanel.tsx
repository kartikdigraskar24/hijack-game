// InventoryPanel.tsx - Collected items list & detailed inspector
import React, { useState } from 'react';
import { Ticket, ShieldAlert, Smartphone, FileText, ClipboardCheck, Package, MapPin, Clock } from 'lucide-react';
import { InventoryItem } from '../game/GameState';
import { AudioManager } from '../systems/AudioManager';

interface InventoryPanelProps {
  items: InventoryItem[];
}

export const InventoryPanel: React.FC<InventoryPanelProps> = ({ items }) => {
  const [selectedId, setSelectedId] = useState<string>(items[0]?.id || '');
  const activeItem = items.find((i) => i.id === selectedId) || items[0];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Ticket':
        return <Ticket size={20} />;
      case 'ShieldAlert':
        return <ShieldAlert size={20} />;
      case 'Smartphone':
        return <Smartphone size={20} />;
      case 'FileText':
        return <FileText size={20} />;
      case 'ClipboardCheck':
        return <ClipboardCheck size={20} />;
      default:
        return <Package size={20} />;
    }
  };

  const handleSelectItem = (id: string) => {
    AudioManager.playUIClick();
    setSelectedId(id);
  };

  return (
    <div className="inventory-view-container">
      {/* Items Grid / List (Left Column) */}
      <div className="inventory-list-col">
        <div className="col-header">
          <span>COLLECTED ARTIFACTS ({items.length})</span>
        </div>

        {items.length === 0 ? (
          <div className="inventory-empty-state">
            <Package size={32} />
            <p>No items collected yet.</p>
          </div>
        ) : (
          <div className="inventory-cards-grid">
            {items.map((item) => (
              <div
                key={item.id}
                className={`inventory-item-card ${item.id === activeItem?.id ? 'active' : ''}`}
                onClick={() => handleSelectItem(item.id)}
              >
                <div className="item-icon-wrapper">{getIcon(item.iconName)}</div>
                <div className="item-card-info">
                  <div className="item-card-name">{item.name}</div>
                  <div className="item-card-cat">{item.category}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Item Detail Inspector (Right Column) */}
      <div className="inventory-detail-col">
        {activeItem ? (
          <div className="item-inspector-card">
            <div className="inspector-header">
              <div className="inspector-icon-big">{getIcon(activeItem.iconName)}</div>
              <div>
                <span className="inspector-badge">{activeItem.category}</span>
                <h3 className="inspector-title">{activeItem.name}</h3>
              </div>
            </div>

            <div className="inspector-meta-row">
              <div className="meta-tag">
                <MapPin size={13} />
                <span>{activeItem.locationFound}</span>
              </div>
              <div className="meta-tag">
                <Clock size={13} />
                <span>{activeItem.timestamp}</span>
              </div>
            </div>

            <div className="inspector-body">
              <div className="section-label">OVERVIEW</div>
              <p className="inspector-desc">{activeItem.description}</p>

              <div className="section-label">FORENSIC / DETAILED OBSERVATION</div>
              <div className="inspector-detail-box">
                <p>{activeItem.detail}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="inspector-placeholder">
            <p>Select an item to inspect forensic details</p>
          </div>
        )}
      </div>
    </div>
  );
};
