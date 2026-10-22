// MapPanel.tsx - Interactive Tactical 2D Schematic Map for Airport & Boeing 737 Aircraft
import React from 'react';
import { Compass, User, AlertCircle, MapPin } from 'lucide-react';
import { GameLevel } from '../game/GameState';

interface MapPanelProps {
  level: GameLevel;
  playerPos: [number, number, number];
  activeObjective: string;
}

export const MapPanel: React.FC<MapPanelProps> = ({ level, playerPos, activeObjective }) => {
  const [px, , pz] = playerPos;

  if (level === 1) {
    // Airport Terminal Map (X: -14 to 14, Z: -14 to 22)
    // Normalize coordinates to 0 - 100% SVG coordinates
    const normX = Math.max(5, Math.min(95, ((px + 14) / 28) * 80 + 10));
    const normY = Math.max(5, Math.min(95, ((pz + 14) / 36) * 80 + 10));

    return (
      <div className="map-view-container">
        <div className="map-header">
          <div className="map-title-badge">
            <Compass size={16} />
            <span>TERMINAL 2 — DEPARTURES CONCOURSE</span>
          </div>
          <div className="map-coords">
            PLAYER GPS: X {px.toFixed(1)} | Z {pz.toFixed(1)}
          </div>
        </div>

        {/* 2D Schematic Floorplan */}
        <div className="map-svg-frame">
          <svg viewBox="0 0 400 450" className="map-svg">
            {/* Background Terminal Shell */}
            <rect x="20" y="20" width="360" height="400" rx="8" className="map-room-bg" />

            {/* Entrance Zone */}
            <rect x="40" y="30" width="320" height="60" className="map-zone zone-entrance" />
            <text x="50" y="65" className="map-label">TERMINAL ENTRANCE & SECURITY</text>

            {/* Check-in Desks */}
            <rect x="50" y="110" width="90" height="40" className="map-desk" />
            <rect x="155" y="110" width="90" height="40" className="map-desk" />
            <rect x="260" y="110" width="80" height="40" className="map-desk" />
            <text x="140" y="135" className="map-sublabel">CHECK-IN COUNTERS</text>

            {/* Central FIDS Board */}
            <rect x="120" y="170" width="160" height="24" rx="4" className="map-fids-zone" />
            <text x="135" y="186" className="map-label fids-text">DEPARTURES BOARD (FIDS)</text>

            {/* Passenger Waiting Lounge */}
            <rect x="40" y="220" width="320" height="90" className="map-zone zone-lounge" />
            <text x="50" y="245" className="map-label">DEPARTURE LOUNGE & SEATING</text>

            {/* Observation Windows overlooking Tarmac */}
            <line x1="360" y1="30" x2="360" y2="400" className="map-window-line" />
            <text x="365" y="220" className="map-sublabel" transform="rotate(90, 365, 220)">TARMAC / RUNWAY APPASS</text>

            {/* Gate 7 Boarding Stanchion */}
            <rect x="240" y="330" width="120" height="50" className="map-gate-zone" />
            <text x="250" y="355" className="map-label gate-text">GATE 7</text>
            <text x="250" y="370" className="map-sublabel">FLIGHT 407 (NEW DELHI)</text>

            {/* Jet Bridge Corridor */}
            <path d="M 300 380 L 300 420" className="map-corridor-path" />
            <text x="240" y="415" className="map-sublabel">JET BRIDGE → AIRCRAFT</text>

            {/* Objective Marker at Gate 7 */}
            <circle cx="300" cy="355" r="9" className="map-objective-marker" />
            <circle cx="300" cy="355" r="14" className="map-objective-pulse" />

            {/* Player Live Marker Pin */}
            <g transform={`translate(${(normX / 100) * 360 + 20}, ${(normY / 100) * 400 + 20})`}>
              <circle cx="0" cy="0" r="8" className="map-player-pin" />
              <circle cx="0" cy="0" r="14" className="map-player-ring" />
              <text x="12" y="4" className="map-player-label">YOU (ARJUN)</text>
            </g>
          </svg>
        </div>

        <div className="map-legend">
          <div className="legend-item">
            <span className="dot player-dot" />
            <span>Arjun Mehra (Player)</span>
          </div>
          <div className="legend-item">
            <span className="dot objective-dot" />
            <span>Active Boarding Objective</span>
          </div>
          <div className="legend-item">
            <span className="dot npc-dot" />
            <span>Crew / Passenger NPCs</span>
          </div>
        </div>
      </div>
    );
  }

  // Aircraft Cabin Map (Levels 2 & 3)
  // X: -1.7 to 1.7, Z: -7.5 to 10.0
  const normX = Math.max(10, Math.min(90, ((px + 1.7) / 3.4) * 80 + 10));
  const normY = Math.max(5, Math.min(95, ((pz + 7.5) / 17.5) * 85 + 5));

  return (
    <div className="map-view-container">
      <div className="map-header">
        <div className="map-title-badge">
          <Compass size={16} />
          <span>BOEING 737 // CABIN SCHEMATIC (FLIGHT 407)</span>
        </div>
        <div className="map-coords">
          CABIN POSITION: ROW {Math.max(10, Math.min(16, Math.round((pz / 1.1) + 10)))}
        </div>
      </div>

      <div className="map-svg-frame">
        <svg viewBox="0 0 320 540" className="map-svg">
          {/* Aircraft Fuselage Outline */}
          <path
            d="M 120 20 C 140 10, 180 10, 200 20 L 260 90 L 260 480 C 260 520, 60 520, 60 480 L 60 90 Z"
            className="map-fuselage"
          />

          {/* Cockpit / Flight Deck Area */}
          <rect x="100" y="30" width="120" height="40" rx="6" className="map-cockpit" />
          <text x="115" y="55" className="map-sublabel">COCKPIT (LOCKED)</text>

          {/* Armored Bulkhead Door */}
          <line x1="80" y1="75" x2="240" y2="75" className="map-bulkhead-line" />

          {/* Forward Galley */}
          <rect x="80" y="80" width="160" height="45" className="map-zone zone-galley" />
          <text x="105" y="105" className="map-label">FORWARD GALLEY / MAYA</text>

          {/* Passenger Aisle */}
          <rect x="145" y="130" width="30" height="290" className="map-aisle" />
          <text x="152" y="270" className="map-sublabel" transform="rotate(90, 152, 270)">MAIN AISLE</text>

          {/* Seat Rows: Row 10 to Row 16 */}
          {[10, 11, 12, 13, 14, 15, 16].map((row, idx) => {
            const y = 140 + idx * 40;
            const isArjunRow = row === 12;
            const isVikramRow = row === 14;

            return (
              <g key={row}>
                {/* Left Seat Pair (A, B) */}
                <rect x="80" y={y} width="55" height="30" rx="4" className={`map-seat-pair ${isArjunRow ? 'seat-arjun' : ''}`} />
                <text x="90" y={y + 18} className="map-seat-label">
                  {row}A {row}B
                </text>

                {/* Right Seat Pair (C, D) */}
                <rect x="185" y={y} width="55" height="30" rx="4" className={`map-seat-pair ${isVikramRow ? 'seat-vikram' : ''}`} />
                <text x="195" y={y + 18} className="map-seat-label">
                  {row}C {row}D
                </text>
              </g>
            );
          })}

          {/* Rear Aft Galley & Lavatories */}
          <rect x="80" y="430" width="160" height="50" className="map-zone zone-galley" />
          <text x="100" y="460" className="map-label">AFT GALLEY / RESTROOMS</text>

          {/* Seat 12A Highlight Marker */}
          <circle cx="95" cy="235" r="5" className="map-assigned-marker" />
          <text x="40" y="238" className="map-sublabel">SEAT 12A</text>

          {/* Vikram 14B Highlight Marker */}
          <circle cx="225" cy="315" r="5" className="map-threat-marker" />
          <text x="245" y="318" className="map-sublabel threat-text">14B (VIKRAM)</text>

          {/* Player Pin */}
          <g transform={`translate(${(normX / 100) * 180 + 70}, ${(normY / 100) * 440 + 40})`}>
            <circle cx="0" cy="0" r="7" className="map-player-pin" />
            <circle cx="0" cy="0" r="12" className="map-player-ring" />
            <text x="10" y="4" className="map-player-label">YOU</text>
          </g>
        </svg>
      </div>

      <div className="map-legend">
        <div className="legend-item">
          <span className="dot player-dot" />
          <span>Arjun Mehra (Player)</span>
        </div>
        <div className="legend-item">
          <span className="dot assigned-dot" />
          <span>Assigned Seat (12A)</span>
        </div>
        <div className="legend-item">
          <span className="dot threat-dot" />
          <span>Suspicious Passenger (14B)</span>
        </div>
      </div>
    </div>
  );
};
