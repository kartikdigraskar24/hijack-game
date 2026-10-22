// Character definitions for HIJACK

export interface CharacterInfo {
  id: string;
  name: string;
  role: string;
  age: number;
  description: string;
  clothingColor: string; // Hex for clothing
  skinTone: string;
  hairColor: string;
  dialogueGreeting: string;
  isProtagonist?: boolean;
}

export const CHARACTERS: Record<string, CharacterInfo> = {
  arjun: {
    id: 'arjun',
    name: 'Arjun Mehra',
    role: 'Passenger / Protagonist',
    age: 30,
    description: 'Adult male in civilian clothing. Observant civil engineer on Flight 407.',
    clothingColor: '#2B3A4A', // Neutral slate navy jacket, dark trousers
    skinTone: '#D6A584',
    hairColor: '#1A1817',
    dialogueGreeting: "I need to understand what's happening on this aircraft.",
    isProtagonist: true,
  },
  maya: {
    id: 'maya',
    name: 'Maya Deshmukh',
    role: 'Senior Cabin Crew',
    age: 34,
    description: 'Experienced flight attendant in formal airline navy blazer and scarf.',
    clothingColor: '#102A45', // Airline uniform deep navy
    skinTone: '#CFA07C',
    hairColor: '#211C18',
    dialogueGreeting: 'Welcome aboard Flight 407. Please ensure your seatbelt is fastened.',
  },
  captain: {
    id: 'captain',
    name: 'Capt. Rahul Sharma',
    role: 'Flight 407 Commander',
    age: 48,
    description: 'Senior airline pilot with gold epaulet stripes.',
    clothingColor: '#0E1F34',
    skinTone: '#C99E7B',
    hairColor: '#303030',
    dialogueGreeting: 'This is the Captain speaking from the flight deck.',
  },
  vikram: {
    id: 'vikram',
    name: 'Vikram Malhotra',
    role: 'Suspicious Passenger (Seat 14B)',
    age: 36,
    description: 'Nervous passenger repeatedly glancing towards the cockpit and fiddling with luggage.',
    clothingColor: '#4A3B32', // Dark brownish leather jacket
    skinTone: '#BD8E6C',
    hairColor: '#1E1E1E',
    dialogueGreeting: 'Can I help you? I prefer to keep to myself during flights.',
  },
  aditya: {
    id: 'aditya',
    name: 'Aditya Verma',
    role: 'Passenger (Seat 12C)',
    age: 27,
    description: 'Tech worker seated across the aisle, observant and slightly anxious.',
    clothingColor: '#3A506B',
    skinTone: '#D1A380',
    hairColor: '#1A1A1A',
    dialogueGreeting: 'Did you notice that man in 14B? He went to the front lavatory three times before takeoff.',
  },
  ananya: {
    id: 'ananya',
    name: 'Ananya Roy',
    role: 'Passenger (Seat 11A)',
    age: 31,
    description: 'Travel writer seated near the window, noted unusual radio chatter in the terminal.',
    clothingColor: '#5C3D46',
    skinTone: '#DCAE8B',
    hairColor: '#241F1C',
    dialogueGreeting: 'I overheard airport security talking near Gate 7 before we boarded. Something seemed off.',
  },
  staff: {
    id: 'staff',
    name: 'Rohan (Ground Staff)',
    role: 'Aviation Gate Agent',
    age: 26,
    description: 'Terminal ground personnel verifying boarding passes at Gate 7.',
    clothingColor: '#1C3D5A',
    skinTone: '#CBA07D',
    hairColor: '#1C1C1C',
    dialogueGreeting: 'Gate 7 for Flight 407 is now boarding. Please have your boarding pass ready.',
  },
  security_officer: {
    id: 'security_officer',
    name: 'Officer Sunil',
    role: 'Aviation Security Inspector',
    age: 38,
    description: 'Senior airport security inspector operating the walk-through metal detector checkpoint.',
    clothingColor: '#0F172A',
    skinTone: '#C59A77',
    hairColor: '#202020',
    dialogueGreeting: 'Please empty all metallic belongings into the tray and step through the scanner portal.',
  },
  hijacker_lead: {
    id: 'hijacker_lead',
    name: 'Tariq (Lead Hijacker)',
    role: 'Hijack Commander',
    age: 38,
    description: 'Armed leader controlling the forward cabin, issuing demands and enforcing hostage compliance.',
    clothingColor: '#18181B', // Tactical black jacket
    skinTone: '#B48866',
    hairColor: '#09090B',
    dialogueGreeting: 'Nobody moves! Hands where I can see them! Anyone tries to be a hero, they get shot!',
  },
  hijacker_second: {
    id: 'hijacker_second',
    name: 'Farooq (Second Hijacker)',
    role: 'Enforcer',
    age: 33,
    description: 'Armed guard securing the aisle, watching passengers and blocking exits.',
    clothingColor: '#27272A', // Charcoal utility attire
    skinTone: '#C99E7B',
    hairColor: '#171717',
    dialogueGreeting: 'Move to the corner! Now! Heads down and stay quiet if you want to survive!',
  },
  hijacker_blade: {
    id: 'hijacker_blade',
    name: 'Zubair (Armed Enforcer)',
    role: 'Cabin Guard',
    age: 29,
    description: 'Enforcer brandishing a steel blade, herding passengers into the defensive hostage group.',
    clothingColor: '#3F3F46', // Dark combat shirt
    skinTone: '#A87A5B',
    hairColor: '#1E1E1E',
    dialogueGreeting: 'Back off! Into the huddle, all of you! Do not make me use this!',
  },
};

