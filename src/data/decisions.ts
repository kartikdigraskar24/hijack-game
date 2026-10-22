// decisions.ts - Crisis Decision Matrix and Branching for HIJACK Level 3

import { CriticalDecision, EndingType } from '../game/GameState';

export const LEVEL_3_DECISIONS: Record<string, CriticalDecision> = {
  DECISION_MAIN_STRATEGY: {
    id: 'DECISION_MAIN_STRATEGY',
    title: 'CRISIS MANAGEMENT PROTOCOL',
    speaker: 'Maya Deshmukh (Senior Purser)',
    context: 'Vikram Malhotra is preparing to initiate an unauthorized flight diversion. Captain Sharma has secured the armored cockpit bulkhead. We must select the operational strategy to protect 180 passengers.',
    prompt: 'How shall we manage this crisis aboard Flight 407?',
    options: [
      {
        id: 'OPT_COORDINATE_CREW',
        text: 'Option A: Discreetly coordinate with crew and passengers to restrain the suspect.',
        subtext: 'Requires high trust & evidence. The cabin crew uses zip-ties while passengers provide backup without causing cabin-wide panic.',
        requiredClueId: 'CLUE_REVOKED_BADGE',
        effects: {
          passengerSafetyChange: 25,
          trustChange: 30,
          crewCooperationChange: 35,
          investigationChange: 20,
          feedbackMessage: 'Coordinated crew response initiated. Vikram is calmly surrounded before he can reach the cockpit door or access avionics.',
          nextDecisionId: 'DECISION_CONFRONT_SUSPECT',
        },
      },
      {
        id: 'OPT_ATC_EMERGENCY',
        text: 'Option B: Transmit full evidence via ACARS & initiate emergency diversion to nearest secured airport.',
        subtext: 'Captain squawks 7500 on radar transponder, informs air traffic control, and initiates a steep descent to Jaipur airfield with security awaiting.',
        requiredClueId: 'CLUE_WAYPOINT_NOTE',
        effects: {
          passengerSafetyChange: 15,
          trustChange: 15,
          crewCooperationChange: 20,
          investigationChange: 25,
          feedbackMessage: 'Air Traffic Control acknowledged emergency transponder squawk. Runway cleared at Jaipur Military Base.',
          nextDecisionId: 'DECISION_AIRPORT_DIVERT',
        },
      },
      {
        id: 'OPT_DIRECT_SOLO_CONFRONTATION',
        text: 'Option C: Immediately shout and tackle the suspect in aisle 14 alone.',
        subtext: 'High risk of panic and accidental injury without prior crew briefing or passenger coordination.',
        effects: {
          passengerSafetyChange: -40,
          trustChange: -20,
          crewCooperationChange: -30,
          investigationChange: 0,
          feedbackMessage: 'Shouting in the aisle sparks immediate hysteria among passengers. Vikram draws an improvised weapon in panic.',
          determinesEnding: 'FAILED',
        },
      },
    ],
  },

  DECISION_CONFRONT_SUSPECT: {
    id: 'DECISION_CONFRONT_SUSPECT',
    title: 'SUSPECT CONTAINMENT & EVIDENCE PRESENTATION',
    speaker: 'Arjun Mehra & Maya Deshmukh',
    context: 'The crew has surrounded row 14. Vikram reaches for his jacket pocket, claiming he is being wrongfully targeted.',
    prompt: 'Present your gathered evidence to break his resolve and prevent physical escalation.',
    options: [
      {
        id: 'OPT_PRESENT_ALL_PROOF',
        text: 'Present the revoked security badge, SMS logs, and waypoint diagram simultaneously.',
        subtext: 'Complete evidence dismantles his plan. Vikram realizes ground response is already aware and surrenders peacefully.',
        requiredClueId: 'CLUE_BURNER_SMS',
        effects: {
          passengerSafetyChange: 20,
          trustChange: 25,
          crewCooperationChange: 20,
          investigationChange: 25,
          feedbackMessage: 'Overwhelmed by incontrovertible evidence, Vikram surrenders his device and submits to crew restraint.',
          determinesEnding: 'SUCCESS',
        },
      },
      {
        id: 'OPT_NEGOTIATE_COMPROMISE',
        text: 'De-escalate verbally by assuring him of fair legal proceedings upon landing.',
        subtext: 'Vikram hesitates and steps back into his seat, but remains agitated until touchdown.',
        effects: {
          passengerSafetyChange: 5,
          trustChange: 10,
          crewCooperationChange: 10,
          investigationChange: 10,
          feedbackMessage: 'Verbal de-escalation stabilizes the cabin, though passenger anxiety remains elevated throughout the flight.',
          determinesEnding: 'PARTIAL',
        },
      },
    ],
  },

  DECISION_AIRPORT_DIVERT: {
    id: 'DECISION_AIRPORT_DIVERT',
    title: 'RAPID FLIGHT DESCENT PROTOCOL',
    speaker: 'Captain Rahul Sharma (PA)',
    context: 'Flight 407 begins a rapid tactical descent towards the diversion airfield. The seatbelt signs chime as cabin angle steepens.',
    prompt: 'Instruct passengers and secure cabin integrity during emergency descent.',
    options: [
      {
        id: 'OPT_REASSURE_PASSENGERS',
        text: 'Help cabin crew ensure all passengers adopt brace position and remain seated calmly.',
        subtext: 'High discipline prevents injuries during rapid descent. Police board immediately upon rollout.',
        effects: {
          passengerSafetyChange: 20,
          trustChange: 20,
          crewCooperationChange: 20,
          investigationChange: 15,
          feedbackMessage: 'Passengers remain calm. Aircraft lands smoothly at diversion base with armed CISF security awaiting on the apron.',
          determinesEnding: 'SUCCESS',
        },
      },
      {
        id: 'OPT_HURRIED_CABIN_CHECK',
        text: 'Focus exclusively on watching Vikram while ignoring passenger seating.',
        subtext: 'Turbulence during descent causes minor bumps and bruises in rear cabin.',
        effects: {
          passengerSafetyChange: -10,
          trustChange: -5,
          crewCooperationChange: 5,
          investigationChange: 10,
          feedbackMessage: 'Vikram is secured upon landing, but cabin turbulence caused disarray due to lack of passenger reassurance.',
          determinesEnding: 'PARTIAL',
        },
      },
    ],
  },
};

export interface EndingDetails {
  type: EndingType;
  title: string;
  subtitle: string;
  badgeColor: string;
  summary: string;
  points: string[];
}

export const ENDINGS_DATA: Record<NonNullable<EndingType>, EndingDetails> = {
  SUCCESS: {
    type: 'SUCCESS',
    title: 'ENDING A: THE GUARDIAN RESOLUTION',
    subtitle: 'Flawless Crisis Management & Zero Casualties',
    badgeColor: '#10B981',
    summary: 'Through methodical observation, decisive clue gathering, and seamless cooperation with Maya and Captain Sharma, Flight 407 was saved from an organized hijacking attempt. Vikram Malhotra was detained without a single passenger being harmed.',
    points: [
      'All 180 passengers and crew landed safely at destination.',
      'Incontrovertible evidence handed over to aviation counter-terrorism authorities.',
      'Arjun Mehra and Maya Deshmukh commended for exemplary civic vigilance.',
      'Aviation security protocols tightened across regional terminals.',
    ],
  },
  PARTIAL: {
    type: 'PARTIAL',
    title: 'ENDING B: EMERGENCY CONTINGENCY DIVERT',
    subtitle: 'Crisis Averted with Moderate Disruption',
    badgeColor: '#3B82F6',
    summary: 'The threat aboard Flight 407 was neutralized following an unscheduled tactical diversion to Jaipur. While Vikram Malhotra was apprehended, the sudden maneuver and limited evidence presentation led to panic and minor cabin injuries.',
    points: [
      'Aircraft diverted safely; suspect taken into custody by tarmac police.',
      'Some passenger distress and minor luggage spillage in cabin.',
      'Investigation confirmed the suspect acted with external network coordination.',
      'Flight delayed by 8 hours before passengers were cleared to continue.',
    ],
  },
  FAILED: {
    type: 'FAILED',
    title: 'ENDING C: COMPROMISED RESOLUTION',
    subtitle: 'Escalation and Cabin Disorder',
    badgeColor: '#EF4444',
    summary: 'Acting precipitously without sufficient evidence or crew coordination caused widespread panic in the passenger cabin. Although the armored cockpit door held and pilots executed a heavy landing, the emergency evacuation resulted in significant distress.',
    points: [
      'Uncoordinated confrontation sparked panic in the passenger aisle.',
      'Emergency slides deployed on runway amidst confusion.',
      'Suspect managed to discard crucial cryptographic evidence before arrest.',
      'Safety review faulted lack of coordination with trained flight crew.',
    ],
  },
};
