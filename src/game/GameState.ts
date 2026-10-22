// GameState.ts - Central State Definitions for HIJACK

export type GameLevel = 1 | 2 | 3;

export type EndingType = 'SUCCESS' | 'PARTIAL' | 'FAILED' | null;

export interface InventoryItem {
  id: string;
  name: string;
  category: 'DOCUMENT' | 'KEYCARD' | 'ELECTRONIC' | 'EVIDENCE' | 'PERSONAL';
  description: string;
  detail: string;
  iconName: string;
  timestamp: string;
  locationFound: string;
}

export interface ClueItem {
  id: string;
  title: string;
  description: string;
  source: string;
  timestamp: string;
  unlocksDecisionId?: string;
  importance: 'CRUCIAL' | 'SIGNIFICANT' | 'SUPPORTING';
}

export interface Objective {
  id: string;
  title: string;
  description: string;
  level: GameLevel;
  isOptional: boolean;
  completed: boolean;
  unlockedAtStep?: number;
}

export interface DecisionOption {
  id: string;
  text: string;
  subtext?: string;
  requiredClueId?: string;
  effects: {
    passengerSafetyChange: number;
    trustChange: number;
    crewCooperationChange: number;
    investigationChange: number;
    feedbackMessage: string;
    nextDecisionId?: string;
    determinesEnding?: EndingType;
  };
}

export interface CriticalDecision {
  id: string;
  title: string;
  speaker: string;
  prompt: string;
  context: string;
  options: DecisionOption[];
}

export interface GameSettings {
  masterVolume: number;
  sfxVolume: number;
  musicVolume: number;
  mouseSensitivity: number;
  graphicsQuality: 'LOW' | 'MEDIUM' | 'HIGH';
  showSubtitles: boolean;
  fov: number;
}

export interface SaveData {
  version: number;
  savedAt: string;
  level: GameLevel;
  checkpointId: string;
  passengerSafety: number;
  trustLevel: number;
  investigationProgress: number;
  crewCooperation: number;
  inventory: InventoryItem[];
  clues: ClueItem[];
  completedObjectives: string[];
  activeObjectiveId: string;
  decisionsMade: Record<string, string>;
  isSeated: boolean;
}

export interface GameState {
  // Navigation & Flow
  screen: 'CINEMATIC_INTRO' | 'CINEMATIC_TAKEOFF' | 'MENU' | 'PLAYING' | 'PAUSED' | 'SETTINGS' | 'ENDING';
  currentLevel: GameLevel;
  checkpointId: string;
  
  // Player Status
  isSeated: boolean;
  isCrouching: boolean;
  canStandUp: boolean;
  playerPosition: [number, number, number];
  
  // Core Metrics
  passengerSafety: number;     // 0 - 100
  trustLevel: number;          // 0 - 100
  investigationProgress: number;// 0 - 100
  crewCooperation: number;     // 0 - 100
  
  // Collections & Logs
  inventory: InventoryItem[];
  clues: ClueItem[];
  objectives: Objective[];
  activeObjectiveId: string;
  decisionsMade: Record<string, string>;
  
  // Current Active UI Overlays
  activeDialogue: {
    npcId: string;
    npcName: string;
    npcRole: string;
    text: string;
    options?: { text: string; nextId?: string; action?: string }[];
  } | null;
  
  activeDecision: CriticalDecision | null;
  activeTabModal: 'NONE' | 'MAP' | 'INVENTORY' | 'INVESTIGATION';
  
  // Cutscene / Sequence flags
  inCutscene: boolean;
  cutsceneText: string;
  flightPhase: 'BOARDING' | 'TAXI' | 'TAKEOFF' | 'CRUISING' | 'EMERGENCY';
  
  // Interaction prompt (single prioritized target)
  activeInteraction: {
    id: string;
    label: string;
    actionText: string;
    subtitle?: string;
  } | null;

  // Single clean top-right notification toast (fades after 3s)
  hudNotification: {
    id: string;
    type: 'CLUE' | 'OBJECTIVE' | 'INFO';
    title: string;
    message: string;
  } | null;

  // Cinematic Level 2 introduction sequence
  level2TitleCardVisible: boolean;
  securityCleared: boolean;
  
  // Final Ending
  ending: EndingType;
  endingReason: string;
  
  // Settings
  settings: GameSettings;
}

export const INITIAL_SETTINGS: GameSettings = {
  masterVolume: 80,
  sfxVolume: 85,
  musicVolume: 70,
  mouseSensitivity: 1.0,
  graphicsQuality: 'HIGH',
  showSubtitles: true,
  fov: 65,
};

export const INITIAL_STATE: GameState = {
  screen: 'CINEMATIC_INTRO',
  currentLevel: 1,
  checkpointId: 'AIRPORT_START',
  isSeated: false,
  isCrouching: false,
  canStandUp: true,
  playerPosition: [0, 0, 0],
  passengerSafety: 100,
  trustLevel: 50,
  investigationProgress: 0,
  crewCooperation: 50,
  inventory: [],
  clues: [],
  objectives: [],
  activeObjectiveId: 'OBJ_L1_SECURITY_CHECK',
  decisionsMade: {},
  activeDialogue: null,
  activeDecision: null,
  activeTabModal: 'NONE',
  inCutscene: false,
  cutsceneText: '',
  flightPhase: 'BOARDING',
  activeInteraction: null,
  hudNotification: null,
  level2TitleCardVisible: false,
  securityCleared: false,
  ending: null,
  endingReason: '',
  settings: INITIAL_SETTINGS,
};
