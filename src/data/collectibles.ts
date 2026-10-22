// collectibles.ts - Collectible items and investigation clues for HIJACK

import { InventoryItem, ClueItem } from '../game/GameState';

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'boarding_pass',
    name: 'Flight 407 Boarding Pass',
    category: 'DOCUMENT',
    description: 'Economy Class, Seat 12A (Window). Flight 407 Departure 08:30.',
    detail: 'Passenger: Arjun Mehra. Departure Gate: 7. Status: Boarding Group B. Notes: Carry-on baggage verified.',
    iconName: 'Ticket',
    timestamp: '08:15 AM',
    locationFound: 'Airport Entrance',
  },
];

export const WORLD_COLLECTIBLES: (InventoryItem & { position: [number, number, number]; level: number; clueId?: string })[] = [
  {
    id: 'dropped_id_card',
    name: 'Security Contractor ID',
    category: 'KEYCARD',
    description: 'A laminated airport security pass dropped near Seat 14B.',
    detail: 'Holder: Vikram Malhotra. Clearance: Level 2 Ramp Access. Expiration: 10/2026. Note: Stamped "REVOKED PENDING INQUIRY".',
    iconName: 'ShieldAlert',
    timestamp: '09:05 AM',
    locationFound: 'Aircraft Floor - Row 14',
    position: [1.05, 0.25, 5.2], // Near seat 14B
    level: 2,
    clueId: 'CLUE_REVOKED_BADGE',
  },
  {
    id: 'mysterious_note',
    name: 'Encrypted Waypoint Note',
    category: 'DOCUMENT',
    description: 'A folded slip of paper found tucked beside the rear galley service cart.',
    detail: 'Handwritten notes listing transponder code 7500, emergency frequency 121.5 MHz, and an unscheduled waypoint divert vector.',
    iconName: 'FileText',
    timestamp: '09:12 AM',
    locationFound: 'Aft Galley Service Station',
    position: [-1.0, 0.75, 15.5], // Rear galley
    level: 2,
    clueId: 'CLUE_WAYPOINT_NOTE',
  },
  {
    id: 'discarded_phone',
    name: 'Burner Smartphone',
    category: 'ELECTRONIC',
    description: 'An unbranded cellular device wedged behind the seat pocket in 14C.',
    detail: 'Recent incoming SMS: "Stand by in seat 14. Once cruising at FL320, initiate the diversion sequence. Do not engage crew directly."',
    iconName: 'Smartphone',
    timestamp: '09:18 AM',
    locationFound: 'Seat Pocket Row 14C',
    position: [0.65, 0.65, 5.5],
    level: 2,
    clueId: 'CLUE_BURNER_SMS',
  },
  {
    id: 'maintenance_report',
    name: 'Cabin Service Log',
    category: 'DOCUMENT',
    description: 'Flight attendant daily service and cabin defect checklist on the forward clipboard.',
    detail: 'Entry: "08:10 AM - Ground handler reported unauthorized tampering near avionics bay access panel under row 2 carpet."',
    iconName: 'ClipboardCheck',
    timestamp: '08:45 AM',
    locationFound: 'Forward Galley Interphone Station',
    position: [-1.2, 0.85, -11.2],
    level: 2,
    clueId: 'CLUE_AVIONICS_TAMPERING',
  },
];

export const GAME_CLUES: Record<string, ClueItem> = {
  CLUE_REVOKED_BADGE: {
    id: 'CLUE_REVOKED_BADGE',
    title: 'Revoked Security Clearance',
    description: 'Vikram Malhotra holds an airport contractor badge that was revoked prior to departure, indicating illicit airport airside access.',
    source: 'Dropped ID Card near Seat 14B',
    timestamp: '09:05 AM',
    unlocksDecisionId: 'OPTION_CONFRONT_IDENTITY',
    importance: 'CRUCIAL',
  },
  CLUE_WAYPOINT_NOTE: {
    id: 'CLUE_WAYPOINT_NOTE',
    title: 'Pre-planned Diversion Route',
    description: 'The handwritten slip indicates a deliberate attempt to force Flight 407 off its radar corridor towards an isolated regional airstrip.',
    source: 'Aft Galley Service Cart',
    timestamp: '09:12 AM',
    unlocksDecisionId: 'OPTION_COORDINATE_COCKPIT',
    importance: 'CRUCIAL',
  },
  CLUE_BURNER_SMS: {
    id: 'CLUE_BURNER_SMS',
    title: 'Accomplice Communication',
    description: 'SMS messages confirm Vikram is not acting on emotional impulse but is guided by external instructions timed for cruising altitude.',
    source: 'Discarded Smartphone in Row 14C',
    timestamp: '09:18 AM',
    unlocksDecisionId: 'OPTION_DEESCALATE_BLUFF',
    importance: 'SIGNIFICANT',
  },
  CLUE_AVIONICS_TAMPERING: {
    id: 'CLUE_AVIONICS_TAMPERING',
    title: 'Avionics Hatch Tampering',
    description: 'Maintenance report notes tampering near the avionics bay under forward row 2, proving physical equipment compromise was attempted.',
    source: 'Forward Galley Service Clipboard',
    timestamp: '08:45 AM',
    unlocksDecisionId: 'OPTION_SECURE_AVIONICS',
    importance: 'SUPPORTING',
  },
};
