// missions.ts - Mission and Objective definitions for HIJACK

import { Objective } from '../game/GameState';

export const MISSION_OBJECTIVES: Objective[] = [
  // --- LEVEL 1: BOARD THE FLIGHT ---
  {
    id: 'OBJ_L1_SECURITY_CHECK',
    title: 'Proceed to Security Checkpoint & Gate 07',
    description: 'Reach Boarding Gate 07, complete the required boarding interaction, and enter the airplane.',
    level: 1,
    isOptional: false,
    completed: false,
  },
  {
    id: 'OBJ_L1_PROCEED_GATE',
    title: 'Proceed to Boarding Gate 07',
    description: 'Reach Boarding Gate 07, complete the required boarding interaction, and enter the airplane.',
    level: 1,
    isOptional: false,
    completed: false,
  },
  {
    id: 'OBJ_L1_TALK_MAYA_TERMINAL',
    title: 'Speak to Maya Deshmukh',
    description: 'Consult with the senior purser standing by the Gate 7 boarding queue.',
    level: 1,
    isOptional: false,
    completed: false,
  },
  {
    id: 'OBJ_L1_BOARD_AIRCRAFT',
    title: 'Board Flight AI-407',
    description: 'Complete the boarding interaction at Gate 07 and enter the aircraft cabin.',
    level: 1,
    isOptional: false,
    completed: false,
  },
  {
    id: 'OBJ_L1_INSPECT_BOARD',
    title: 'Inspect Flight Information Display (FIDS)',
    description: 'Check the central departure board for Flight 407 status and gate updates.',
    level: 1,
    isOptional: true,
    completed: false,
  },
  {
    id: 'OBJ_L1_TALK_PASSENGERS',
    title: 'Speak with Waiting Passengers',
    description: 'Interact with Aditya or Ananya in the departure lounge.',
    level: 1,
    isOptional: true,
    completed: false,
  },

  // --- LEVEL 2: SETTLE IN ---
  {
    id: 'OBJ_L2_FIND_SEAT',
    title: 'Talk to Co-Passengers & Take Assigned Seat',
    description: 'Talk to your fellow passengers and take your assigned seat.',
    level: 2,
    isOptional: false,
    completed: false,
  },
  {
    id: 'OBJ_L2_SETTLE_IN',
    title: 'Take Your Assigned Seat 12A',
    description: 'Talk to your fellow passengers and take your assigned seat.',
    level: 2,
    isOptional: false,
    completed: false,
  },
  {
    id: 'OBJ_L2_INVESTIGATE_CABIN',
    title: 'Investigate Suspicious Activity',
    description: 'Seatbelt sign is off. Stand up and investigate unusual behavior observed in row 14.',
    level: 2,
    isOptional: false,
    completed: false,
  },
  {
    id: 'OBJ_L2_COLLECT_CLUES',
    title: 'Gather Evidence in the Cabin',
    description: 'Inspect the rear galley, check empty seat pockets, and collect physical clues.',
    level: 2,
    isOptional: false,
    completed: false,
  },
  {
    id: 'OBJ_L2_REPORT_TO_MAYA',
    title: 'Report Findings to Maya',
    description: 'Meet Maya in the forward galley and brief her on the evidence collected.',
    level: 2,
    isOptional: false,
    completed: false,
  },
  {
    id: 'OBJ_L2_OPT_SPEAK_MAYA',
    title: 'Speak with Maya',
    description: 'Consult the senior flight attendant for flight information.',
    level: 2,
    isOptional: true,
    completed: false,
  },
  {
    id: 'OBJ_L2_OPT_TALK_PASSENGER',
    title: 'Talk to a Nearby Passenger',
    description: 'Speak with Aditya in 12C or Ananya in 11A.',
    level: 2,
    isOptional: true,
    completed: false,
  },
  {
    id: 'OBJ_L2_OPT_OBSERVE_CABIN',
    title: 'Inspect Your Surroundings',
    description: 'Observe the passenger seating rows and emergency exit placements.',
    level: 2,
    isOptional: true,
    completed: false,
  },

  // --- LEVEL 3: HIJACK — NO WAY OUT ---
  {
    id: 'OBJ_L3_CONFRONT_CRISIS',
    title: 'Follow Situation & Make Critical Decisions',
    description: 'A sudden takeover changes everything. Follow the unfolding situation and make your decisions carefully.',
    level: 3,
    isOptional: false,
    completed: false,
  },
  {
    id: 'OBJ_L3_MAKE_DECISION',
    title: 'Execute Crisis Response Matrix',
    description: 'A sudden takeover changes everything. Follow the unfolding situation and make your decisions carefully.',
    level: 3,
    isOptional: false,
    completed: false,
  },
];
