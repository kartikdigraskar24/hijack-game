// SaveManager.ts - LocalStorage persistence and checkpoint system for HIJACK

import { GameState, SaveData } from './GameState';

const SAVE_KEY = 'HIJACK_GAME_SAVE_V1';

export class SaveManager {
  public static hasSave(): boolean {
    try {
      const data = localStorage.getItem(SAVE_KEY);
      return data !== null;
    } catch {
      return false;
    }
  }

  public static saveGame(state: GameState, checkpointId: string): boolean {
    try {
      const saveData: SaveData = {
        version: 1,
        savedAt: new Date().toISOString(),
        level: state.currentLevel,
        checkpointId,
        passengerSafety: state.passengerSafety,
        trustLevel: state.trustLevel,
        investigationProgress: state.investigationProgress,
        crewCooperation: state.crewCooperation,
        inventory: state.inventory,
        clues: state.clues,
        completedObjectives: state.objectives.filter(o => o.completed).map(o => o.id),
        activeObjectiveId: state.activeObjectiveId,
        decisionsMade: state.decisionsMade,
        isSeated: state.isSeated,
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
      return true;
    } catch (e) {
      console.error('Failed to save game to localStorage:', e);
      return false;
    }
  }

  public static loadGame(): SaveData | null {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as SaveData;
      if (!parsed || parsed.version !== 1 || !parsed.level) {
        return null;
      }
      return parsed;
    } catch (e) {
      console.warn('Failed to parse save game from localStorage:', e);
      return null;
    }
  }

  public static clearSave(): void {
    try {
      localStorage.removeItem(SAVE_KEY);
    } catch (e) {
      console.error('Failed to clear save:', e);
    }
  }
}
