// App.tsx - Main Application Controller for HIJACK
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, INITIAL_STATE, GameLevel, DecisionOption, EndingType } from '../game/GameState';
import { GameCanvas } from '../game/GameCanvas';
import { MainMenu } from '../components/MainMenu';
import { HUD } from '../components/HUD';
import { DialoguePanel } from '../components/DialoguePanel';
import { DecisionPanel } from '../components/DecisionPanel';
import { DossierModal } from '../components/DossierModal';
import { PauseMenu } from '../components/PauseMenu';
import { SettingsMenu } from '../components/SettingsMenu';
import { MissionSummary } from '../components/MissionSummary';
import { CinematicController } from '../cinematics/CinematicController';
import { InputManager } from '../game/InputManager';
import { AudioManager } from '../systems/AudioManager';
import { SaveManager } from '../game/SaveManager';
import { MISSION_OBJECTIVES } from '../data/missions';
import { INITIAL_INVENTORY, WORLD_COLLECTIBLES, GAME_CLUES } from '../data/collectibles';
import { DIALOGUE_NODES } from '../data/dialogue';
import { LEVEL_3_DECISIONS } from '../data/decisions';

export const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    return {
      ...INITIAL_STATE,
      screen: 'CINEMATIC_INTRO',
      objectives: MISSION_OBJECTIVES.map((o) => ({ ...o })),
      inventory: [...INITIAL_INVENTORY],
      playerPosition: [0, 0, -11], // Starting entrance of airport
      activeObjectiveId: 'OBJ_L1_SECURITY_CHECK',
    };
  });

  const [hasSave, setHasSave] = useState<boolean>(() => SaveManager.hasSave());
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- AUDIO AMBIENCE MANAGEMENT ---
  useEffect(() => {
    if (gameState.screen === 'MENU' || gameState.screen === 'CINEMATIC_INTRO' || gameState.screen === 'CINEMATIC_TAKEOFF') {
      AudioManager.setAmbience('NONE');
    } else if (gameState.screen === 'PLAYING') {
      if (gameState.currentLevel === 1) {
        AudioManager.setAmbience('AIRPORT');
      } else if (gameState.currentLevel === 2) {
        AudioManager.setAmbience('CABIN_NORMAL');
      } else if (gameState.currentLevel === 3) {
        AudioManager.setAmbience('CABIN_CRISIS');
      }
    }
  }, [gameState.screen, gameState.currentLevel]);

  // --- TOAST NOTIFICATION HELPER ---
  const showToast = useCallback((type: 'CLUE' | 'OBJECTIVE' | 'INFO', title: string, message: string) => {
    const id = 'toast_' + Date.now();
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setGameState((prev) => ({
      ...prev,
      hudNotification: { id, type, title, message },
    }));

    toastTimerRef.current = setTimeout(() => {
      setGameState((prev) => {
        if (prev.hudNotification?.id === id) {
          return { ...prev, hudNotification: null };
        }
        return prev;
      });
    }, 3500);
  }, []);

  // --- COMPLETE OBJECTIVE HELPER ---
  const completeObjective = useCallback((objId: string, nextObjId?: string) => {
    setGameState((prev) => {
      const targetObj = prev.objectives.find((o) => o.id === objId);
      const updatedObjs = prev.objectives.map((o) =>
        o.id === objId ? { ...o, completed: true } : o
      );
      AudioManager.playObjectiveComplete();
      if (targetObj) {
        showToast('OBJECTIVE', 'OBJECTIVE COMPLETE', targetObj.title);
      }
      return {
        ...prev,
        objectives: updatedObjs,
        activeObjectiveId: nextObjId || prev.activeObjectiveId,
      };
    });
  }, [showToast]);

  // --- CINEMATICS COMPLETED / SKIPPED -> LAUNCH LEVEL 1 PLAYABLE ---
  const handleFinishCinematics = useCallback(() => {
    AudioManager.ensureContext();
    AudioManager.setAmbience('AIRPORT');
    AudioManager.playAirportChime();

    setGameState((prev) => {
      const nextState: GameState = {
        ...INITIAL_STATE,
        screen: 'PLAYING',
        currentLevel: 1,
        checkpointId: 'CHECKPOINT_AIRPORT',
        playerPosition: [0, 0, -11],
        objectives: MISSION_OBJECTIVES.map((o) => ({ ...o })),
        inventory: [...INITIAL_INVENTORY],
        activeObjectiveId: 'OBJ_L1_SECURITY_CHECK',
        securityCleared: false,
        settings: prev.settings,
      };
      SaveManager.saveGame(nextState, 'CHECKPOINT_AIRPORT');
      return nextState;
    });

    setHasSave(true);
  }, []);

  // --- START GAME (RUNS CINEMATICS SEQUENCE) ---
  const handleStartGame = useCallback(() => {
    AudioManager.ensureContext();
    setGameState((prev) => ({
      ...prev,
      screen: 'CINEMATIC_INTRO',
    }));
  }, []);

  // --- CONTINUE FROM CHECKPOINT ---
  const handleContinue = useCallback(() => {
    const saved = SaveManager.loadGame();
    if (!saved) return;

    AudioManager.ensureContext();
    setGameState((prev) => {
      const restoredObjectives = MISSION_OBJECTIVES.map((o) => ({
        ...o,
        completed: saved.completedObjectives.includes(o.id),
      }));

      const startPos: [number, number, number] =
        saved.level === 1 ? [0, 0, -11] : [0, 0, -10.0];

      return {
        ...prev,
        screen: 'PLAYING',
        currentLevel: saved.level,
        checkpointId: saved.checkpointId,
        passengerSafety: saved.passengerSafety,
        trustLevel: saved.trustLevel,
        investigationProgress: saved.investigationProgress,
        crewCooperation: saved.crewCooperation,
        inventory: saved.inventory,
        clues: saved.clues,
        objectives: restoredObjectives,
        activeObjectiveId: saved.activeObjectiveId,
        decisionsMade: saved.decisionsMade,
        playerPosition: startPos,
        isSeated: false,
        securityCleared: saved.level > 1,
      };
    });
  }, []);

  // --- LEVEL 1: INSPECT DEPARTURE BOARD ---
  const handleInspectBoard = useCallback(() => {
    completeObjective('OBJ_L1_INSPECT_BOARD');
    setGameState((prev) => ({
      ...prev,
      investigationProgress: Math.min(100, prev.investigationProgress + 10),
      activeDialogue: {
        npcId: 'system',
        npcName: 'Departure Board (FIDS)',
        npcRole: 'Terminal Information Display',
        text: 'Flight 407 to New Delhi is currently on final boarding status at Gate 7. All passengers in Group B should proceed immediately through the security checkpoint and onward to the gate.',
        options: [
          {
            text: 'Proceed towards the security checkpoint.',
            nextId: undefined,
          },
        ],
      },
    }));
  }, [completeObjective]);

  // --- LEVEL 1 -> LEVEL 2: BOARD AIRCRAFT ---
  const handleBoardAircraft = useCallback(() => {
    if (!gameState.securityCleared) {
      showToast('INFO', 'SECURITY REQUIRED', 'Please complete the security screening checkpoint first.');
      return;
    }

    AudioManager.playAirportChime();

    setGameState((prev) => ({
      ...prev,
      inCutscene: true,
      cutsceneText: 'Boarding Flight 407... Entering aircraft cabin.',
    }));

    setTimeout(() => {
      setGameState((prev) => {
        const nextState: GameState = {
          ...prev,
          currentLevel: 2,
          checkpointId: 'CHECKPOINT_AIRCRAFT_CABIN',
          playerPosition: [0, 0, -10.0], // Forward cabin entrance in expanded 29m cabin
          activeObjectiveId: 'OBJ_L2_FIND_SEAT',
          inCutscene: false,
          cutsceneText: '',
          flightPhase: 'BOARDING',
        };
        SaveManager.saveGame(nextState, 'CHECKPOINT_AIRCRAFT_CABIN');
        return nextState;
      });
      completeObjective('OBJ_L1_BOARD_AIRCRAFT', 'OBJ_L2_FIND_SEAT');
      showToast('OBJECTIVE', 'AIRCRAFT BOARDED', 'Locate Assigned Window Seat 12A down the aisle.');
    }, 1800);
  }, [completeObjective, gameState.securityCleared, showToast]);

  // --- DISMISS LEVEL 2 TITLE CARD ---
  const handleDismissLevel2TitleCard = useCallback(() => {
    setGameState((prev) => {
      if (!prev.level2TitleCardVisible) return prev;
      return {
        ...prev,
        level2TitleCardVisible: false,
      };
    });

    // Opening dialogue between Maya and Arjun
    setTimeout(() => {
      const node = DIALOGUE_NODES['maya_seated_briefing'];
      if (node) {
        setGameState((s) => ({
          ...s,
          activeDialogue: {
            npcId: node.npcId,
            npcName: node.speakerName,
            npcRole: node.speakerRole,
            text: node.text,
            options: node.responses.map((r) => ({
              text: r.label,
              nextId: r.nextNodeId,
              action: r.action,
            })),
          },
        }));
      }
    }, 350);
  }, []);

  // --- LEVEL 2: SEAT TOGGLE (SIT & TAKEOFF SEQUENCE) ---
  const handleToggleSeat = useCallback(() => {
    setGameState((prev) => {
      if (!prev.isSeated) {
        // Player sits down in 12A
        AudioManager.playSeatbeltDing();
        completeObjective('OBJ_L2_FIND_SEAT', 'OBJ_L2_SETTLE_IN');
        showToast('OBJECTIVE', 'SEAT 12A REACHED', 'Settle in and observe the passenger cabin.');

        // Fade into cinematic Level 2 title card
        setTimeout(() => {
          setGameState((s) => ({
            ...s,
            level2TitleCardVisible: true,
          }));
        }, 500);

        return {
          ...prev,
          isSeated: true,
          canStandUp: false,
        };
      } else {
        // Player stands up
        if (!prev.canStandUp) return prev;
        return {
          ...prev,
          isSeated: false,
        };
      }
    });
  }, [completeObjective, showToast]);

  // --- LEVEL 2: COLLECT CLUE ---
  const handleCollectClue = useCallback((itemId: string) => {
    const item = WORLD_COLLECTIBLES.find((c) => c.id === itemId);
    if (!item) return;

    AudioManager.playClueFound();

    setGameState((prev) => {
      const alreadyHave = prev.inventory.some((i) => i.id === itemId);
      if (alreadyHave) return prev;

      const newInventory = [...prev.inventory, item];
      let newClues = [...prev.clues];

      if (item.clueId && GAME_CLUES[item.clueId]) {
        newClues.push(GAME_CLUES[item.clueId]);
      }

      const newProgress = Math.min(100, prev.investigationProgress + 25);
      showToast('CLUE', 'EVIDENCE SECURED', item.name);

      return {
        ...prev,
        inventory: newInventory,
        clues: newClues,
        investigationProgress: newProgress,
      };
    });
  }, [showToast]);

  // --- NPC INTERACTION & DIALOGUE ---
  const handleInteractNPC = useCallback((npcId: string) => {
    AudioManager.playUIClick();

    let dialogueNodeId = 'staff_gate_welcome';
    if (npcId === 'security_officer') {
      dialogueNodeId = gameState.securityCleared ? 'security_officer_cleared' : 'security_officer_scan';
    } else if (npcId === 'staff') {
      dialogueNodeId = 'staff_gate_welcome';
    } else if (npcId === 'aditya') {
      dialogueNodeId = gameState.currentLevel === 1 ? 'aditya_lounge' : 'aditya_cabin';
    } else if (npcId === 'ananya') {
      dialogueNodeId = gameState.currentLevel === 1 ? 'ananya_lounge' : 'ananya_cabin';
    } else if (npcId === 'maya') {
      if (gameState.currentLevel === 1) {
        dialogueNodeId = 'maya_terminal';
      } else if (gameState.currentLevel === 2) {
        dialogueNodeId = gameState.clues.length >= 2 ? 'maya_report_findings' : 'maya_cabin_initial';
      } else {
        dialogueNodeId = 'maya_plan_crisis';
      }
    } else if (npcId === 'vikram') {
      dialogueNodeId = 'vikram_cabin';
    } else if (npcId === 'hijacker_lead') {
      dialogueNodeId = 'hijacker_lead_confront';
    } else if (npcId === 'hijacker_second') {
      dialogueNodeId = 'hijacker_second_alert';
    } else if (npcId === 'hijacker_blade') {
      dialogueNodeId = 'hijacker_blade_alert';
    } else if (npcId === 'captain') {
      setGameState((prev) => ({
        ...prev,
        activeDecision: LEVEL_3_DECISIONS['DECISION_MAIN_STRATEGY'],
      }));
      return;
    }

    const node = DIALOGUE_NODES[dialogueNodeId];
    if (node) {
      setGameState((prev) => ({
        ...prev,
        activeDialogue: {
          npcId: node.npcId,
          npcName: node.speakerName,
          npcRole: node.speakerRole,
          text: node.text,
          options: node.responses.map((r) => ({
            text: r.label,
            nextId: r.nextNodeId,
            action: r.action,
          })),
        },
      }));
    }
  }, [gameState.currentLevel, gameState.clues.length, gameState.securityCleared]);

  // --- DIALOGUE OPTION SELECTION ---
  const handleSelectDialogueOption = useCallback((option: { text: string; nextId?: string; action?: string }) => {
    if (option.action === 'CLEAR_SECURITY') {
      completeObjective('OBJ_L1_SECURITY_CHECK', 'OBJ_L1_PROCEED_GATE');
      setGameState((prev) => ({
        ...prev,
        securityCleared: true,
      }));
      showToast('INFO', 'SECURITY CLEARANCE VERIFIED', 'Cleared through checkpoint. Proceed to Gate 7.');
    }

    if (option.action === 'UNLOCK_BOARDING') {
      completeObjective('OBJ_L1_TALK_MAYA_TERMINAL', 'OBJ_L1_BOARD_AIRCRAFT');
    }

    if (option.action === 'TRIGGER_LEVEL_3') {
      completeObjective('OBJ_L2_REPORT_TO_MAYA', 'OBJ_L3_CONFRONT_CRISIS');
      setGameState((prev) => {
        const nextState: GameState = {
          ...prev,
          currentLevel: 3,
          checkpointId: 'CHECKPOINT_CRISIS_LEVEL_3',
          activeDialogue: null,
          activeObjectiveId: 'OBJ_L3_CONFRONT_CRISIS',
          flightPhase: 'EMERGENCY',
        };
        SaveManager.saveGame(nextState, 'CHECKPOINT_CRISIS_LEVEL_3');
        return nextState;
      });
      return;
    }

    if (option.action === 'OPEN_CRITICAL_DECISION') {
      setGameState((prev) => ({
        ...prev,
        activeDialogue: null,
        activeDecision: LEVEL_3_DECISIONS['DECISION_MAIN_STRATEGY'],
      }));
      return;
    }

    if (option.nextId && DIALOGUE_NODES[option.nextId]) {
      const nextNode = DIALOGUE_NODES[option.nextId];
      setGameState((prev) => ({
        ...prev,
        activeDialogue: {
          npcId: nextNode.npcId,
          npcName: nextNode.speakerName,
          npcRole: nextNode.speakerRole,
          text: nextNode.text,
          options: nextNode.responses.map((r) => ({
            text: r.label,
            nextId: r.nextNodeId,
            action: r.action,
          })),
        },
      }));
    } else {
      // Close dialogue
      setGameState((prev) => {
        // If finishing Maya seated briefing in Level 2:
        if (prev.currentLevel === 2 && prev.isSeated && !prev.canStandUp) {
          AudioManager.playSeatbeltDing();
          completeObjective('OBJ_L2_SETTLE_IN', 'OBJ_L2_INVESTIGATE_CABIN');
          showToast('INFO', 'CRUISING ALTITUDE REACHED', 'Seatbelt sign extinguished. Cabin inspection authorized.');
          return {
            ...prev,
            activeDialogue: null,
            canStandUp: true,
            flightPhase: 'CRUISING',
            activeObjectiveId: 'OBJ_L2_INVESTIGATE_CABIN',
          };
        }
        return { ...prev, activeDialogue: null };
      });
    }
  }, [completeObjective, showToast]);

  // --- CRITICAL DECISION SELECTION ---
  const handleSelectDecisionOption = useCallback((opt: DecisionOption) => {
    AudioManager.playDecisionWarning();

    setGameState((prev) => {
      const newSafety = Math.max(0, Math.min(100, prev.passengerSafety + opt.effects.passengerSafetyChange));
      const newTrust = Math.max(0, Math.min(100, prev.trustLevel + opt.effects.trustChange));
      const newCrew = Math.max(0, Math.min(100, prev.crewCooperation + opt.effects.crewCooperationChange));

      const updatedDecisions = {
        ...prev.decisionsMade,
        [prev.activeDecision?.id || 'main']: opt.id,
      };

      if (opt.effects.nextDecisionId && LEVEL_3_DECISIONS[opt.effects.nextDecisionId]) {
        return {
          ...prev,
          passengerSafety: newSafety,
          trustLevel: newTrust,
          crewCooperation: newCrew,
          decisionsMade: updatedDecisions,
          activeDecision: LEVEL_3_DECISIONS[opt.effects.nextDecisionId],
        };
      }

      const finalEnding: EndingType =
        opt.effects.determinesEnding || (newSafety > 70 ? 'SUCCESS' : newSafety > 40 ? 'PARTIAL' : 'FAILED');

      return {
        ...prev,
        passengerSafety: newSafety,
        trustLevel: newTrust,
        crewCooperation: newCrew,
        decisionsMade: updatedDecisions,
        activeDecision: null,
        screen: 'ENDING',
        ending: finalEnding,
        endingReason: opt.effects.feedbackMessage,
      };
    });
  }, []);

  // --- CONTINUOUS CENTRALIZED INTERACTION TARGET COMPUTATION ---
  useEffect(() => {
    if (gameState.screen !== 'PLAYING' || gameState.inCutscene) {
      if (gameState.activeInteraction) {
        setGameState((s) => ({ ...s, activeInteraction: null }));
      }
      return;
    }

    const [px, , pz] = gameState.playerPosition;
    interface Candidate {
      id: string;
      label: string;
      actionText: string;
      subtitle?: string;
      distance: number;
    }

    const candidates: Candidate[] = [];

    // LEVEL 1 TARGETS
    if (gameState.currentLevel === 1) {
      // Security Checkpoint & Officer Sunil
      const distSec = Math.sqrt(Math.pow(px - 6.4, 2) + Math.pow(pz - 6.5, 2));
      if (distSec < 3.2) {
        candidates.push({
          id: 'security',
          label: gameState.securityCleared ? 'TALK TO OFFICER SUNIL' : 'SECURITY SCREENING',
          actionText: 'Officer Sunil',
          subtitle: gameState.securityCleared ? 'Security Clearance Verified' : 'Step through metal detector',
          distance: distSec,
        });
      }

      // FIDS Departure Board
      const distFids = Math.sqrt(Math.pow(px - 0, 2) + Math.pow(pz - (-5.0), 2));
      if (distFids < 3.2) {
        candidates.push({
          id: 'fids',
          label: 'INSPECT FLIGHT STATUS',
          actionText: 'Departure Board (FIDS)',
          subtitle: 'Flight 407 to New Delhi',
          distance: distFids,
        });
      }

      // Gate 7 Jet Bridge Door
      const distGate = Math.sqrt(Math.pow(px - 10.0, 2) + Math.pow(pz - 12.8, 2));
      const distDoor = Math.sqrt(Math.pow(px - 10.0, 2) + Math.pow(pz - 19.5, 2));
      const minGateDist = Math.min(distGate, distDoor);
      if (minGateDist < 3.8) {
        candidates.push({
          id: gameState.securityCleared ? 'gate_board' : 'gate_locked',
          label: gameState.securityCleared ? 'PROCEED TO BOARDING GATE 07' : 'SECURITY SCREENING REQUIRED',
          actionText: gameState.securityCleared ? 'E — Proceed to Boarding Gate 07' : 'Security Clearance Needed',
          subtitle: gameState.securityCleared ? 'Board Flight AI-407 to New Delhi' : 'Report to Officer Sunil at Security Checkpoint',
          distance: minGateDist,
        });
      }

      // Terminal NPCs
      const terminalNpcs = [
        { id: 'npc_maya', pos: [7.8, 10.6], label: 'TALK TO MAYA', actionText: 'Maya Deshmukh', sub: 'Senior Cabin Crew' },
        { id: 'npc_aditya', pos: [-5.5, 2.0], label: 'TALK TO ADITYA', actionText: 'Aditya Roy', sub: 'Investigative Journalist' },
        { id: 'npc_ananya', pos: [14.5, 5.0], label: 'TALK TO ANANYA', actionText: 'Ananya Sharma', sub: 'Passenger' },
      ];

      for (const npc of terminalNpcs) {
        const d = Math.sqrt(Math.pow(px - npc.pos[0], 2) + Math.pow(pz - npc.pos[1], 2));
        if (d < 2.5) {
          candidates.push({
            id: npc.id,
            label: npc.label,
            actionText: npc.actionText,
            subtitle: npc.sub,
            distance: d,
          });
        }
      }
    }

    // LEVEL 2 TARGETS
    if (gameState.currentLevel === 2) {
      // Seat 12A
      const distSeat12A = Math.sqrt(Math.pow(px - (-1.45), 2) + Math.pow(pz - 3.1, 2));
      if (!gameState.isSeated && distSeat12A < 2.0) {
        candidates.push({
          id: 'seat_12a',
          label: 'SIT DOWN IN SEAT 12A',
          actionText: 'Assigned Window Seat',
          subtitle: 'Row 12',
          distance: distSeat12A,
        });
      } else if (gameState.isSeated && gameState.canStandUp) {
        candidates.push({
          id: 'stand_up',
          label: 'STAND UP',
          actionText: 'Seat 12A',
          subtitle: 'Return to aisle',
          distance: 0.1,
        });
      }

      // Collectibles
      const collectibles = [
        { id: 'col_col_phone', pos: [1.45, 6.3], label: 'COLLECT BURNER PHONE', actionText: 'Suspicious Device', sub: 'Row 15 floor' },
        { id: 'col_col_id_card', pos: [-1.45, 9.5], label: 'COLLECT SECURITY ID', actionText: 'Evidence Clue', sub: 'Row 18 seat pocket' },
        { id: 'col_col_waypoint_note', pos: [0, -11.0], label: 'INSPECT FLIGHT LOG', actionText: 'Galley Document', sub: 'Forward cockpit bulkhead' },
        { id: 'col_col_defect_log', pos: [0, 15.5], label: 'INSPECT DEFECT LOG', actionText: 'Aft Galley Form', sub: 'Maintenance defect record' },
      ];

      for (const col of collectibles) {
        const originalId = col.id.replace('col_', '');
        if (!gameState.inventory.some((i) => i.id === originalId)) {
          const d = Math.sqrt(Math.pow(px - col.pos[0], 2) + Math.pow(pz - col.pos[1], 2));
          if (d < 2.3) {
            candidates.push({
              id: col.id,
              label: col.label,
              actionText: col.actionText,
              subtitle: col.sub,
              distance: d,
            });
          }
        }
      }

      // Cabin NPCs
      const cabinNpcs = [
        { id: 'npc_maya', pos: [0, -9.5], label: 'TALK TO MAYA', actionText: 'Maya Deshmukh', sub: 'Senior Purser' },
        { id: 'npc_aditya', pos: [-0.65, 3.1], label: 'TALK TO ADITYA', actionText: 'Aditya Roy', sub: 'Passenger Seat 12B' },
        { id: 'npc_ananya', pos: [-1.45, 1.9], label: 'TALK TO ANANYA', actionText: 'Ananya Sharma', sub: 'Passenger Seat 11A' },
        { id: 'npc_vikram', pos: [1.05, 5.5], label: 'TALK TO VIKRAM', actionText: 'Vikram Rao', sub: 'Contractor Seat 14D' },
      ];

      for (const npc of cabinNpcs) {
        const d = Math.sqrt(Math.pow(px - npc.pos[0], 2) + Math.pow(pz - npc.pos[1], 2));
        if (d < 2.4) {
          candidates.push({
            id: npc.id,
            label: npc.label,
            actionText: npc.actionText,
            subtitle: npc.sub,
            distance: d,
          });
        }
      }
    }

    // LEVEL 3 TARGETS
    if (gameState.currentLevel === 3) {
      const distCockpit = Math.sqrt(Math.pow(px - 0, 2) + Math.pow(pz - (-11.0), 2));
      if (distCockpit < 3.0) {
        candidates.push({
          id: 'crisis_beacon',
          label: 'CONFRONT HIJACK CRISIS',
          actionText: 'Tactical Intervention',
          subtitle: 'Execute crisis response matrix',
          distance: distCockpit,
        });
      }

      const l3Npcs = [
        { id: 'npc_hijacker_lead', pos: [0, -4.5], label: 'CONFRONT LEAD HIJACKER', actionText: 'Tariq (Commander)', sub: 'Armed with firearm' },
        { id: 'npc_hijacker_second', pos: [0, 1.2], label: 'ENCOUNTER HIJACK ENFORCER', actionText: 'Farooq (Enforcer)', sub: 'Armed with firearm' },
        { id: 'npc_hijacker_blade', pos: [0, 7.5], label: 'ENCOUNTER AISLE GUARD', actionText: 'Zubair (Guard)', sub: 'Armed with blade' },
        { id: 'npc_maya', pos: [-0.7, -7.5], label: 'TALK TO MAYA', actionText: 'Maya Deshmukh', sub: 'Senior Purser' },
        { id: 'npc_captain', pos: [0.7, -8.0], label: 'COORDINATE WITH CAPTAIN', actionText: 'Capt. Rahul Sharma', sub: 'Flight Deck' },
        { id: 'npc_aditya', pos: [-1.0, 2.5], label: 'CHECK ON PASSENGER', actionText: 'Aditya Verma', sub: 'Hostage passenger' },
      ];

      for (const npc of l3Npcs) {
        const d = Math.sqrt(Math.pow(px - npc.pos[0], 2) + Math.pow(pz - npc.pos[1], 2));
        if (d < 2.5) {
          candidates.push({
            id: npc.id,
            label: npc.label,
            actionText: npc.actionText,
            subtitle: npc.sub,
            distance: d,
          });
        }
      }
    }

    // Pick closest prioritized candidate
    if (candidates.length > 0) {
      candidates.sort((a, b) => a.distance - b.distance);
      const best = candidates[0];
      setGameState((s) => {
        if (
          s.activeInteraction?.id === best.id &&
          s.activeInteraction?.label === best.label
        ) {
          return s;
        }
        return {
          ...s,
          activeInteraction: {
            id: best.id,
            label: best.label,
            actionText: best.actionText,
            subtitle: best.subtitle,
          },
        };
      });
    } else {
      setGameState((s) => {
        if (!s.activeInteraction) return s;
        return { ...s, activeInteraction: null };
      });
    }
  }, [
    gameState.playerPosition,
    gameState.currentLevel,
    gameState.isSeated,
    gameState.canStandUp,
    gameState.securityCleared,
    gameState.screen,
    gameState.inCutscene,
    gameState.inventory,
  ]);

  // --- KEYBOARD LISTENERS FOR INTERACT / TAB / ESC / SPACE ---
  useEffect(() => {
    const unbindInteract = InputManager.onInteract(() => {
      // If modal or dialog open, ignore
      if (
        gameState.screen !== 'PLAYING' ||
        gameState.activeDialogue !== null ||
        gameState.activeDecision !== null ||
        gameState.activeTabModal !== 'NONE'
      ) {
        return;
      }

      if (!gameState.activeInteraction) return;

      const act = gameState.activeInteraction;

      if (act.id === 'security') {
        handleInteractNPC('security_officer');
      } else if (act.id === 'fids') {
        handleInspectBoard();
      } else if (act.id === 'gate_board') {
        handleBoardAircraft();
      } else if (act.id === 'gate_locked') {
        showToast('INFO', 'SECURITY REQUIRED', 'Please complete the security screening checkpoint first.');
      } else if (act.id === 'seat_12a' || act.id === 'stand_up') {
        handleToggleSeat();
      } else if (act.id.startsWith('col_')) {
        const itemId = act.id.replace('col_', '');
        handleCollectClue(itemId);
      } else if (act.id.startsWith('npc_')) {
        const npcId = act.id.replace('npc_', '');
        handleInteractNPC(npcId);
      } else if (act.id === 'crisis_beacon') {
        setGameState((s) => ({
          ...s,
          activeDecision: LEVEL_3_DECISIONS['DECISION_MAIN_STRATEGY'],
        }));
      }
    });

    const unbindTab = InputManager.onTab(() => {
      if (gameState.screen !== 'PLAYING') return;
      AudioManager.playUIClick();
      setGameState((prev) => ({
        ...prev,
        activeTabModal: prev.activeTabModal === 'NONE' ? 'MAP' : 'NONE',
      }));
    });

    const unbindPause = InputManager.onPause(() => {
      if (gameState.screen !== 'PLAYING' && gameState.screen !== 'PAUSED') return;
      AudioManager.playUIClick();
      setGameState((prev) => {
        if (prev.activeTabModal !== 'NONE') {
          return { ...prev, activeTabModal: 'NONE' };
        }
        if (prev.activeDialogue !== null) {
          return { ...prev, activeDialogue: null };
        }
        if (prev.screen === 'PLAYING') {
          InputManager.exitPointerLock();
          return { ...prev, screen: 'PAUSED' };
        }
        if (prev.screen === 'PAUSED') {
          return { ...prev, screen: 'PLAYING' };
        }
        return prev;
      });
    });

    // Space key to dismiss Level 2 cinematic title card
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && gameState.level2TitleCardVisible) {
        e.preventDefault();
        handleDismissLevel2TitleCard();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      unbindInteract();
      unbindTab();
      unbindPause();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    gameState.screen,
    gameState.activeDialogue,
    gameState.activeDecision,
    gameState.activeTabModal,
    gameState.activeInteraction,
    gameState.level2TitleCardVisible,
    handleBoardAircraft,
    handleInspectBoard,
    handleToggleSeat,
    handleCollectClue,
    handleInteractNPC,
    handleDismissLevel2TitleCard,
    showToast,
  ]);

  return (
    <div className="hijack-app-root">
      {/* Master Cinematic Controller: Scene 1 (Game Intro) & Scene 2 (Airplane Takeoff) */}
      {(gameState.screen === 'CINEMATIC_INTRO' || gameState.screen === 'CINEMATIC_TAKEOFF') && (
        <CinematicController
          initialScene={gameState.screen === 'CINEMATIC_TAKEOFF' ? 'TAKEOFF' : 'INTRO'}
          settings={gameState.settings}
          onFinishCinematics={handleFinishCinematics}
        />
      )}

      {/* 3D Game World Canvas (Only rendered during playable levels, pause, or ending) */}
      {gameState.screen !== 'MENU' && gameState.screen !== 'CINEMATIC_INTRO' && gameState.screen !== 'CINEMATIC_TAKEOFF' && (
        <GameCanvas
          currentLevel={gameState.currentLevel}
          playerPos={gameState.playerPosition}
          onPositionChange={(pos) => setGameState((s) => ({ ...s, playerPosition: pos }))}
          isSeated={gameState.isSeated}
          canStandUp={gameState.canStandUp}
          onToggleSeat={handleToggleSeat}
          onInteractNPC={handleInteractNPC}
          onInspectBoard={handleInspectBoard}
          onBoardAircraft={handleBoardAircraft}
          onCollectClue={handleCollectClue}
          onOpenDecision={() =>
            setGameState((s) => ({
              ...s,
              activeDecision: LEVEL_3_DECISIONS['DECISION_MAIN_STRATEGY'],
            }))
          }
          collectedItemIds={gameState.inventory.map((i) => i.id)}
          activeNpcId={gameState.activeDialogue?.npcId || null}
          boardingUnlocked={gameState.securityCleared}
          flightPhase={gameState.flightPhase}
          decisionMade={gameState.ending !== null}
          settings={gameState.settings}
          isPaused={gameState.screen !== 'PLAYING' || gameState.activeTabModal !== 'NONE'}
        />
      )}

      {/* Main Menu Overlay */}
      {gameState.screen === 'MENU' && (
        <MainMenu
          onStartGame={handleStartGame}
          onContinue={handleContinue}
          onOpenSettings={() => setGameState((s) => ({ ...s, screen: 'SETTINGS' }))}
          onWatchCinematics={() => setGameState((s) => ({ ...s, screen: 'CINEMATIC_INTRO' }))}
          hasSavedGame={hasSave}
        />
      )}

      {/* In-Game HUD */}
      {gameState.screen === 'PLAYING' && (
        <HUD
          state={gameState}
          onOpenTab={(tab) => setGameState((s) => ({ ...s, activeTabModal: tab }))}
          onPause={() => {
            InputManager.exitPointerLock();
            setGameState((s) => ({ ...s, screen: 'PAUSED' }));
          }}
          onSkipTitleCard={handleDismissLevel2TitleCard}
        />
      )}

      {/* NPC Dialogue Overlay */}
      {gameState.activeDialogue && (
        <DialoguePanel
          dialogue={gameState.activeDialogue}
          onSelectOption={handleSelectDialogueOption}
          onClose={() => setGameState((s) => ({ ...s, activeDialogue: null }))}
        />
      )}

      {/* Critical Decision Matrix Overlay */}
      {gameState.activeDecision && (
        <DecisionPanel
          decision={gameState.activeDecision}
          unlockedClueIds={gameState.clues.map((c) => c.id)}
          onSelectOption={handleSelectDecisionOption}
          onCancel={() => setGameState((s) => ({ ...s, activeDecision: null }))}
        />
      )}

      {/* Tactical Map, Inventory & Investigation Dossier Modal */}
      {gameState.activeTabModal !== 'NONE' && (
        <DossierModal
          activeTab={gameState.activeTabModal}
          onSwitchTab={(tab) => setGameState((s) => ({ ...s, activeTabModal: tab }))}
          onClose={() => setGameState((s) => ({ ...s, activeTabModal: 'NONE' }))}
          state={gameState}
        />
      )}

      {/* Pause Menu */}
      {gameState.screen === 'PAUSED' && (
        <PauseMenu
          onResume={() => setGameState((s) => ({ ...s, screen: 'PLAYING' }))}
          onRestartCheckpoint={handleContinue}
          onOpenSettings={() => setGameState((s) => ({ ...s, screen: 'SETTINGS' }))}
          onExitToMenu={() => setGameState((s) => ({ ...s, screen: 'MENU' }))}
        />
      )}

      {/* System Settings Overlay */}
      {gameState.screen === 'SETTINGS' && (
        <SettingsMenu
          settings={gameState.settings}
          onUpdateSettings={(newSettings) => setGameState((s) => ({ ...s, settings: newSettings }))}
          onClose={() =>
            setGameState((s) => ({
              ...s,
              screen: prevScreenState(s),
            }))
          }
        />
      )}

      {/* Mission Summary / Ending Debrief */}
      {gameState.screen === 'ENDING' && (
        <MissionSummary
          state={gameState}
          onReplay={handleStartGame}
          onReturnToMenu={() => setGameState((s) => ({ ...s, screen: 'MENU' }))}
        />
      )}
    </div>
  );
};

function prevScreenState(state: GameState): 'MENU' | 'PLAYING' | 'PAUSED' {
  return state.checkpointId ? 'PAUSED' : 'MENU';
}
