// dialogue.ts - Branching dialogue trees for HIJACK

export interface DialogueNode {
  id: string;
  npcId: string;
  speakerName: string;
  speakerRole: string;
  text: string;
  responses: {
    label: string;
    nextNodeId?: string;
    action?: string; // action key to dispatch
  }[];
}

export const DIALOGUE_NODES: Record<string, DialogueNode> = {
  // --- LEVEL 1: SECURITY CHECKPOINT ---
  'security_officer_scan': {
    id: 'security_officer_scan',
    npcId: 'security_officer',
    speakerName: 'Officer Sunil',
    speakerRole: 'Security Inspector',
    text: 'Good morning, Mr. Mehra. Please step through the screening archway while your carry-on luggage passes through the X-ray scanner.',
    responses: [
      {
        label: 'Step through the metal detector archway.',
        nextNodeId: 'security_officer_cleared',
        action: 'CLEAR_SECURITY',
      },
      {
        label: 'Is everything in order here today, officer?',
        nextNodeId: 'security_officer_intel',
      },
    ],
  },
  'security_officer_intel': {
    id: 'security_officer_intel',
    npcId: 'security_officer',
    speakerName: 'Officer Sunil',
    speakerRole: 'Security Inspector',
    text: 'Standard high-vigilance protocols. We received an alert about an unaccounted ramp contractor ID earlier, so we are conducting thorough screening for all departures.',
    responses: [
      {
        label: 'Understood. Stepping through the scanner.',
        nextNodeId: 'security_officer_cleared',
        action: 'CLEAR_SECURITY',
      },
    ],
  },
  'security_officer_cleared': {
    id: 'security_officer_cleared',
    npcId: 'security_officer',
    speakerName: 'Officer Sunil',
    speakerRole: 'Security Inspector',
    text: 'Scanner clear. Zero prohibited items detected. You are cleared for the departure concourse, Mr. Mehra. Please proceed forward to Gate 7.',
    responses: [
      {
        label: 'Thank you Officer. Proceeding to Gate 7.',
        nextNodeId: undefined,
      },
    ],
  },
  'maya_seated_briefing': {
    id: 'maya_seated_briefing',
    npcId: 'maya',
    speakerName: 'Maya Deshmukh',
    speakerRole: 'Senior Cabin Crew',
    text: 'Please remain seated while the aircraft reaches cruising altitude. We will be offering cabin assistance shortly.',
    responses: [
      {
        label: 'Understood. Everything seems quiet.',
        nextNodeId: undefined,
      },
    ],
  },

  // --- LEVEL 1: AIRPORT TERMINAL ---
  'staff_gate_welcome': {
    id: 'staff_gate_welcome',
    npcId: 'staff',
    speakerName: 'Rohan (Ground Staff)',
    speakerRole: 'Gate Agent',
    text: 'Good morning! Flight 407 to New Delhi is currently boarding through Gate 7. Please ensure your boarding pass and national identification are in hand.',
    responses: [
      {
        label: 'Is the flight on schedule today?',
        nextNodeId: 'staff_gate_schedule',
      },
      {
        label: 'Thank you, I am heading to the gate now.',
        nextNodeId: undefined, // close dialogue
      },
    ],
  },
  'staff_gate_schedule': {
    id: 'staff_gate_schedule',
    npcId: 'staff',
    speakerName: 'Rohan (Ground Staff)',
    speakerRole: 'Gate Agent',
    text: 'Yes sir, on schedule for an 08:30 pushback. Please proceed down the corridor to Gate 7 when ready.',
    responses: [
      {
        label: 'Understood. Thank you.',
        nextNodeId: undefined,
      },
    ],
  },
  'aditya_lounge': {
    id: 'aditya_lounge',
    npcId: 'aditya',
    speakerName: 'Aditya Verma',
    speakerRole: 'Passenger - Flight 407',
    text: 'Hey there. Are you also on 407? I was watching the tarmac earlier... Did you see the extra security team inspecting the baggage carts on the ramp? Looked unusually tense.',
    responses: [
      {
        label: 'Really? Did you notice anyone specific?',
        nextNodeId: 'aditya_lounge_detail',
      },
      {
        label: 'Airports are always busy with routine checks.',
        nextNodeId: 'aditya_lounge_dismiss',
      },
    ],
  },
  'aditya_lounge_detail': {
    id: 'aditya_lounge_detail',
    npcId: 'aditya',
    speakerName: 'Aditya Verma',
    speakerRole: 'Passenger - Flight 407',
    text: 'A man in a brown leather jacket was arguing with the ramp supervisor right by the crew access door before slipping past into the lounge. Just gave me a bad gut feeling.',
    responses: [
      {
        label: 'Good to know. I’ll keep my eyes open.',
        nextNodeId: undefined,
      },
    ],
  },
  'aditya_lounge_dismiss': {
    id: 'aditya_lounge_dismiss',
    npcId: 'aditya',
    speakerName: 'Aditya Verma',
    speakerRole: 'Passenger - Flight 407',
    text: 'Yeah, maybe I just drank too much espresso before getting here. Have a good flight anyway!',
    responses: [
      {
        label: 'You too.',
        nextNodeId: undefined,
      },
    ],
  },
  'ananya_lounge': {
    id: 'ananya_lounge',
    npcId: 'ananya',
    speakerName: 'Ananya Roy',
    speakerRole: 'Passenger - Flight 407',
    text: 'Look at that Boeing twin-jet out there on Stand 4. Flying always feels poetic, doesn’t it? Though I overheard security talking about a misplaced contractor badge five minutes ago.',
    responses: [
      {
        label: 'A misplaced security badge?',
        nextNodeId: 'ananya_lounge_badge',
      },
      {
        label: 'She looks ready for a smooth flight.',
        nextNodeId: undefined,
      },
    ],
  },
  'ananya_lounge_badge': {
    id: 'ananya_lounge_badge',
    npcId: 'ananya',
    speakerName: 'Ananya Roy',
    speakerRole: 'Passenger - Flight 407',
    text: 'Yeah, apparently an engineering badge went missing from the tarmac locker room. Hopefully they flagged it at the gate scanners.',
    responses: [
      {
        label: 'Let’s hope so. See you on board.',
        nextNodeId: undefined,
      },
    ],
  },
  'maya_terminal': {
    id: 'maya_terminal',
    npcId: 'maya',
    speakerName: 'Maya Deshmukh',
    speakerRole: 'Senior Cabin Crew',
    text: 'Welcome to Flight 407, sir! I am Maya, the senior purser for today’s flight. Boarding is officially open at Gate 7. Your seat is 12A, on the left side of the aircraft.',
    responses: [
      {
        label: 'Thank you, Maya. Looking forward to a safe flight.',
        nextNodeId: 'maya_terminal_safe',
        action: 'UNLOCK_BOARDING',
      },
      {
        label: 'Is the aircraft fully prepped for departure?',
        nextNodeId: 'maya_terminal_prep',
        action: 'UNLOCK_BOARDING',
      },
    ],
  },
  'maya_terminal_safe': {
    id: 'maya_terminal_safe',
    npcId: 'maya',
    speakerName: 'Maya Deshmukh',
    speakerRole: 'Senior Cabin Crew',
    text: 'Passenger safety is always our highest priority. Please step through Gate 7 and follow the jet bridge straight into the forward aircraft entrance.',
    responses: [
      {
        label: 'Understood. Proceeding to board.',
        nextNodeId: undefined,
      },
    ],
  },
  'maya_terminal_prep': {
    id: 'maya_terminal_prep',
    npcId: 'maya',
    speakerName: 'Maya Deshmukh',
    speakerRole: 'Senior Cabin Crew',
    text: 'Cabin checks are complete, and Captain Sharma has completed the pre-flight checklist. Please board through Gate 7 now!',
    responses: [
      {
        label: 'Heading in.',
        nextNodeId: undefined,
      },
    ],
  },

  // --- LEVEL 2: AIRCRAFT INTERIOR ---
  'maya_cabin_initial': {
    id: 'maya_cabin_initial',
    npcId: 'maya',
    speakerName: 'Maya Deshmukh',
    speakerRole: 'Senior Cabin Crew',
    text: 'Welcome aboard! Seat 12A is just past row 10 on your left by the window. Please stow your larger luggage overhead and take your seat so we can prepare for pushback.',
    responses: [
      {
        label: 'Will do, thank you.',
        nextNodeId: undefined,
      },
    ],
  },
  'aditya_cabin': {
    id: 'aditya_cabin',
    npcId: 'aditya',
    speakerName: 'Aditya Verma',
    speakerRole: 'Seat 12C',
    text: 'Arjun, look right behind us in 14B. That man Vikram has been staring at his watch every thirty seconds. When the purser walked by, he shoved a paper down beside the service cart.',
    responses: [
      {
        label: 'Did you see what kind of paper?',
        nextNodeId: 'aditya_cabin_paper',
      },
      {
        label: 'I noticed he dropped something on the carpet too.',
        nextNodeId: 'aditya_cabin_badge',
      },
    ],
  },
  'aditya_cabin_paper': {
    id: 'aditya_cabin_paper',
    npcId: 'aditya',
    speakerName: 'Aditya Verma',
    speakerRole: 'Seat 12C',
    text: 'It looked like printed flight coordinates or a map. Check the aft galley near the carts—he tucked it there when pretending to use the restroom.',
    responses: [
      {
        label: 'I will inspect the rear galley carefully.',
        nextNodeId: undefined,
      },
    ],
  },
  'aditya_cabin_badge': {
    id: 'aditya_cabin_badge',
    npcId: 'aditya',
    speakerName: 'Aditya Verma',
    speakerRole: 'Seat 12C',
    text: 'Yes! When he stood up earlier, something plastic clattered under the seat frame of 14B. Take a look while he’s distracted.',
    responses: [
      {
        label: 'Good eye. Let me check the floor there.',
        nextNodeId: undefined,
      },
    ],
  },
  'vikram_cabin': {
    id: 'vikram_cabin',
    npcId: 'vikram',
    speakerName: 'Vikram Malhotra',
    speakerRole: 'Seat 14B',
    text: 'What do you want? Why are you staring at me? Go back to your seat and mind your own business!',
    responses: [
      {
        label: 'You seem quite anxious. Is everything alright with your flight?',
        nextNodeId: 'vikram_defensive',
      },
      {
        label: 'I believe you dropped something on the floor earlier.',
        nextNodeId: 'vikram_badge_mention',
      },
    ],
  },
  'vikram_defensive': {
    id: 'vikram_defensive',
    npcId: 'vikram',
    speakerName: 'Vikram Malhotra',
    speakerRole: 'Seat 14B',
    text: 'I just hate flying. Turbulence makes me sick. Now leave me alone before I call the flight attendants.',
    responses: [
      {
        label: 'Understood.',
        nextNodeId: undefined,
      },
    ],
  },
  'vikram_badge_mention': {
    id: 'vikram_badge_mention',
    npcId: 'vikram',
    speakerName: 'Vikram Malhotra',
    speakerRole: 'Seat 14B',
    text: 'I didn’t drop anything! Stop interrogating me! Sit down before the seatbelt sign comes back on!',
    responses: [
      {
        label: 'Take it easy.',
        nextNodeId: undefined,
      },
    ],
  },
  'ananya_cabin': {
    id: 'ananya_cabin',
    npcId: 'ananya',
    speakerName: 'Ananya Roy',
    speakerRole: 'Seat 11A',
    text: 'Arjun, while you were seated, I saw someone slip a phone into the seat pocket in 14C. It kept buzzing silently with coded text alerts.',
    responses: [
      {
        label: 'A burner phone? Did you get a look at the screen?',
        nextNodeId: 'ananya_phone_info',
      },
      {
        label: 'I should notify Maya about this immediately.',
        nextNodeId: undefined,
      },
    ],
  },
  'ananya_phone_info': {
    id: 'ananya_phone_info',
    npcId: 'ananya',
    speakerName: 'Ananya Roy',
    speakerRole: 'Seat 11A',
    text: 'I only caught words like "initiate at cruising altitude" and "avoid direct crew confrontation". It sounded calculated, not random.',
    responses: [
      {
        label: 'That is vital evidence. Thank you Ananya.',
        nextNodeId: undefined,
      },
    ],
  },
  'maya_report_findings': {
    id: 'maya_report_findings',
    npcId: 'maya',
    speakerName: 'Maya Deshmukh',
    speakerRole: 'Senior Cabin Crew',
    text: 'Arjun, you look concerned. What did you discover in the cabin? Please keep your voice steady so we don’t alarm the other passengers.',
    responses: [
      {
        label: 'Maya, I found a revoked airport security badge and a pre-planned route diversion note.',
        nextNodeId: 'maya_evaluate_evidence',
      },
      {
        label: 'Passenger Vikram in 14B has a burner phone with instructions to act at cruising altitude.',
        nextNodeId: 'maya_evaluate_phone',
      },
    ],
  },
  'maya_evaluate_evidence': {
    id: 'maya_evaluate_evidence',
    npcId: 'maya',
    speakerName: 'Maya Deshmukh',
    speakerRole: 'Senior Cabin Crew',
    text: 'Good heavens... A revoked badge means he bypassed standard security screening. And the route note implies he plans to divert the flight. I am immediately alerting Captain Sharma via the flight deck interphone.',
    responses: [
      {
        label: 'What is our protocol for handling this safely?',
        nextNodeId: 'maya_plan_crisis',
        action: 'TRIGGER_LEVEL_3',
      },
    ],
  },
  'maya_evaluate_phone': {
    id: 'maya_evaluate_phone',
    npcId: 'maya',
    speakerName: 'Maya Deshmukh',
    speakerRole: 'Senior Cabin Crew',
    text: 'Cruising altitude... that is right now. Captain Sharma must lock down the armored cockpit door and squawk emergency to air traffic control. We need to decide how to neutralize the threat in the cabin without causing panic.',
    responses: [
      {
        label: 'Let’s coordinate with the crew right now.',
        nextNodeId: 'maya_plan_crisis',
        action: 'TRIGGER_LEVEL_3',
      },
    ],
  },
  'maya_plan_crisis': {
    id: 'maya_plan_crisis',
    npcId: 'maya',
    speakerName: 'Maya Deshmukh',
    speakerRole: 'Senior Cabin Crew',
    text: 'Arjun, your investigation gave us the critical advantage of time. Captain Sharma is ready to execute a coordinated strategy, but we must decide our exact response.',
    responses: [
      {
        label: 'Proceed to Strategy Assessment.',
        nextNodeId: undefined,
        action: 'OPEN_CRITICAL_DECISION',
      },
    ],
  },

  // --- LEVEL 3: HIJACK EVENT & HOSTAGE CRISIS ---
  'hijacker_lead_confront': {
    id: 'hijacker_lead_confront',
    npcId: 'hijacker_lead',
    speakerName: 'Tariq (Lead Hijacker)',
    speakerRole: 'Hijack Commander',
    text: 'Nobody moves! Hands where I can see them! Stay where you are and follow instructions if you want to see tomorrow! You—get over to the corner with the others!',
    responses: [
      {
        label: 'Follow the hijacker’s instructions and keep hands visible.',
        nextNodeId: 'hijacker_lead_cooperate',
      },
      {
        label: 'Try to speak calmly: "We will cooperate. Don’t hurt anyone."',
        nextNodeId: 'hijacker_lead_calm',
      },
      {
        label: 'Stand firm: "What are your demands? The pilots have already alerted ground control."',
        nextNodeId: 'hijacker_lead_refuse',
      },
      {
        label: 'Evaluate the situation and coordinate with crew.',
        nextNodeId: undefined,
        action: 'OPEN_CRITICAL_DECISION',
      },
    ],
  },
  'hijacker_lead_cooperate': {
    id: 'hijacker_lead_cooperate',
    npcId: 'hijacker_lead',
    speakerName: 'Tariq (Lead Hijacker)',
    speakerRole: 'Hijack Commander',
    text: 'Smart move. Do exactly as you are told and nobody gets hurt. Farooq, keep your eyes on the passengers. Zubair, watch the aft aisle!',
    responses: [
      {
        label: 'Assess tactical options with Captain and Maya.',
        nextNodeId: undefined,
        action: 'OPEN_CRITICAL_DECISION',
      },
    ],
  },
  'hijacker_lead_calm': {
    id: 'hijacker_lead_calm',
    npcId: 'hijacker_lead',
    speakerName: 'Tariq (Lead Hijacker)',
    speakerRole: 'Hijack Commander',
    text: 'Save your speeches! We control this flight now. As long as every passenger stays seated and silent, everyone walks off alive. One wrong twitch and that changes.',
    responses: [
      {
        label: 'Coordinate crisis response with crew.',
        nextNodeId: undefined,
        action: 'OPEN_CRITICAL_DECISION',
      },
    ],
  },
  'hijacker_lead_refuse': {
    id: 'hijacker_lead_refuse',
    npcId: 'hijacker_lead',
    speakerName: 'Tariq (Lead Hijacker)',
    speakerRole: 'Hijack Commander',
    text: 'Shut up! You do not ask questions here! Farooq, make sure this hero stays right where he is! Anyone steps out of line, they get put down immediately!',
    responses: [
      {
        label: 'Assess tactical intervention matrix.',
        nextNodeId: undefined,
        action: 'OPEN_CRITICAL_DECISION',
      },
    ],
  },
  'hijacker_second_alert': {
    id: 'hijacker_second_alert',
    npcId: 'hijacker_second',
    speakerName: 'Farooq (Second Hijacker)',
    speakerRole: 'Enforcer',
    text: 'Move to the designated seats! Hands on your heads! Do not make me repeat myself!',
    responses: [
      {
        label: 'Keep hands visible and step back.',
        nextNodeId: undefined,
      },
    ],
  },
  'hijacker_blade_alert': {
    id: 'hijacker_blade_alert',
    npcId: 'hijacker_blade',
    speakerName: 'Zubair (Armed Enforcer)',
    speakerRole: 'Cabin Guard',
    text: 'Back off! Stay seated! Anyone moves from their row, they deal with me!',
    responses: [
      {
        label: 'Remain calm and observe weapon reach.',
        nextNodeId: undefined,
      },
    ],
  },
};
