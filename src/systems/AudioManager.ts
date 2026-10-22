// AudioManager.ts - Procedural Web Audio Engine for HIJACK
// Synthesizes high-fidelity aviation soundscapes, chimes, engine rumble, tension music, and SFX
// 100% self-contained without external audio network dependencies.

class SoundManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private musicGain: GainNode | null = null;

  // Active ambient nodes
  private engineNoiseNode: AudioNode | null = null;
  private engineRumbleNode: OscillatorNode | null = null;
  private cabinVentNode: AudioNode | null = null;
  private tensionDroneNodes: OscillatorNode[] = [];

  // Master volumes (0 - 1)
  private masterVol = 0.8;
  private sfxVol = 0.85;
  private musicVol = 0.7;

  private isMuted = false;
  private currentAmbience: 'NONE' | 'AIRPORT' | 'CABIN_NORMAL' | 'CABIN_CRISIS' = 'NONE';

  constructor() {
    if (typeof window !== 'undefined') {
      const unlockAudio = () => {
        this.ensureContext();
        window.removeEventListener('pointerdown', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
        window.removeEventListener('touchstart', unlockAudio);
      };
      window.addEventListener('pointerdown', unlockAudio, { once: true, passive: true });
      window.addEventListener('keydown', unlockAudio, { once: true, passive: true });
      window.addEventListener('touchstart', unlockAudio, { once: true, passive: true });
    }
  }

  public init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.masterVol, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(this.sfxVol, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
      this.ambientGain.connect(this.masterGain);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(this.musicVol, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);
    } catch (e) {
      console.warn('Web Audio API not supported or blocked:', e);
    }
  }

  public ensureContext() {
    if (!this.ctx) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public updateVolumes(master: number, sfx: number, music: number) {
    this.masterVol = master / 100;
    this.sfxVol = sfx / 100;
    this.musicVol = music / 100;

    if (this.ctx && this.masterGain && this.sfxGain && this.musicGain) {
      const t = this.ctx.currentTime;
      this.masterGain.gain.setTargetAtTime(this.masterVol, t, 0.05);
      this.sfxGain.gain.setTargetAtTime(this.sfxVol, t, 0.05);
      this.musicGain.gain.setTargetAtTime(this.musicVol, t, 0.05);
    }
  }

  // --- SFX GENERATORS ---

  // UI Button Click / Hover
  public playUIClick(highPitch = false) {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const freq = highPitch ? 880 : 440;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.5, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.2 * this.sfxVol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  private lastFootstepTime = 0;

  // Realistic footstep audio system with surface dynamics (airport polished floor vs cabin carpet),
  // crouching attenuation, running pace, and rate-limiting cooldown against rapid glitching.
  public playFootstep(isCarpet = false, isCrouching = false, isRunning = false) {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    // Rate limiter: prevent overlapping audio clips, rapid glitching, or key-spam audio bursts
    const minCooldown = isRunning ? 0.16 : (isCrouching ? 0.35 : 0.22);
    if (now - this.lastFootstepTime < minCooldown) {
      return;
    }
    this.lastFootstepTime = now;

    // Subtle pitch and volume randomization for an authentic, human walking cadence
    const pitchRand = 0.94 + Math.random() * 0.12;
    const volRand = 0.92 + Math.random() * 0.16;

    if (isCarpet) {
      // --- CABIN CARPET FOOTSTEP ---
      // Soft, muffled low-frequency fabric impact
      const duration = isCrouching ? 0.05 : (isRunning ? 0.065 : 0.06);
      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime((isCrouching ? 160 : 260) * pitchRand, now);

      const gain = this.ctx.createGain();
      const baseVol = (isCrouching ? 0.04 : (isRunning ? 0.14 : 0.09)) * this.sfxVol * volRand;
      gain.gain.setValueAtTime(baseVol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      noise.start(now);
    } else {
      // --- REALISTIC AIRPORT POLISHED TILE / GRANITE FLOOR FOOTSTEP ---
      // Dual-component acoustic model:
      // Component 1: Heel strike body (soft low-frequency resonant thump giving weight and mass)
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sine';

      const heelDuration = isCrouching ? 0.04 : (isRunning ? 0.06 : 0.055);
      const startFreq = (isCrouching ? 65 : (isRunning ? 110 : 85)) * pitchRand;
      const endFreq = 40 * pitchRand;
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + heelDuration);

      const heelVol = (isCrouching ? 0.035 : (isRunning ? 0.13 : 0.085)) * this.sfxVol * volRand;
      oscGain.gain.setValueAtTime(heelVol, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + heelDuration);

      osc.connect(oscGain);
      oscGain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + heelDuration);

      // Component 2: Shoe sole contact / scuff (bandpass-filtered noise tap simulating rubber/leather sole)
      const soleDuration = isCrouching ? 0.035 : (isRunning ? 0.045 : 0.04);
      const bufferSize = Math.floor(this.ctx.sampleRate * soleDuration);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        // Natural exponential decay envelope
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = isCrouching ? 'lowpass' : 'bandpass';
      const centerFreq = (isCrouching ? 600 : (isRunning ? 1350 : 1050)) * pitchRand;
      filter.frequency.setValueAtTime(centerFreq, now);
      filter.Q.setValueAtTime(isCrouching ? 1.0 : 2.0, now);

      const noiseGain = this.ctx.createGain();
      const soleVol = (isCrouching ? 0.025 : (isRunning ? 0.10 : 0.065)) * this.sfxVol * volRand;
      noiseGain.gain.setValueAtTime(soleVol, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + soleDuration);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.sfxGain);

      noise.start(now);
    }
  }

  // Airport PA Chime (Ding-Dong)
  public playAirportChime() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    // Note 1: F5 (698.46 Hz)
    this.playTone(698.46, now, 0.45, 0.25);
    // Note 2: C5 (523.25 Hz)
    this.playTone(523.25, now + 0.35, 0.6, 0.25);
  }

  // Cabin "Fasten Seatbelt" Ding (High single chime)
  public playSeatbeltDing() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    this.playTone(830.61, now, 0.7, 0.3); // G#5
    this.playTone(1046.5, now + 0.02, 0.5, 0.15); // C6 subtle overtone
  }

  // Clue Collected / Evidence Discovered
  public playClueFound() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    // Mysterious major/minor 7th arpeggio
    const notes = [440, 554.37, 659.25, 830.61]; // A4, C#5, E5, G#5
    notes.forEach((freq, idx) => {
      this.playTone(freq, now + idx * 0.1, 0.5, 0.2);
    });
  }

  // Objective Completed Chime
  public playObjectiveComplete() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 triumphant
    notes.forEach((freq, idx) => {
      this.playTone(freq, now + idx * 0.08, 0.45, 0.25);
    });
  }

  // Critical Decision Warning
  public playDecisionWarning() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.linearRampToValueAtTime(140, now + 0.6);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, now);

    gain.gain.setValueAtTime(0.3 * this.sfxVol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(now + 0.7);
  }

  private playTone(freq: number, startTime: number, duration: number, volume: number) {
    if (!this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(volume * this.sfxVol, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  // --- CONTINUOUS AMBIENCE ---

  public setAmbience(type: 'NONE' | 'AIRPORT' | 'CABIN_NORMAL' | 'CABIN_CRISIS') {
    if (this.currentAmbience === type) return;
    this.stopAmbience();
    this.currentAmbience = type;

    if (type === 'NONE') return;
    this.ensureContext();
    if (!this.ctx || !this.ambientGain) return;

    if (type === 'AIRPORT') {
      this.startAirportAmbience();
    } else if (type === 'CABIN_NORMAL') {
      this.startCabinAmbience(false);
    } else if (type === 'CABIN_CRISIS') {
      this.startCabinAmbience(true);
    }
  }

  private stopAmbience() {
    if (this.engineRumbleNode) {
      try { this.engineRumbleNode.stop(); } catch {}
      this.engineRumbleNode.disconnect();
      this.engineRumbleNode = null;
    }
    if (this.engineNoiseNode) {
      try { (this.engineNoiseNode as AudioBufferSourceNode).stop(); } catch {}
      this.engineNoiseNode.disconnect();
      this.engineNoiseNode = null;
    }
    if (this.cabinVentNode) {
      try { (this.cabinVentNode as AudioBufferSourceNode).stop(); } catch {}
      this.cabinVentNode.disconnect();
      this.cabinVentNode = null;
    }
    this.tensionDroneNodes.forEach(node => {
      try { node.stop(); } catch {}
      node.disconnect();
    });
    this.tensionDroneNodes = [];
  }

  private startAirportAmbience() {
    if (!this.ctx || !this.ambientGain) return;

    // Soft terminal background rumble & ventilation
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ambientGain);

    noise.start();
    this.cabinVentNode = noise;
  }

  private startCabinAmbience(isCrisis: boolean) {
    if (!this.ctx || !this.ambientGain) return;

    // 1. Deep Twin-Turbofan Low Engine Drone (68 Hz + 136 Hz harmonic)
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(68, this.ctx.currentTime);

    const oscFilter = this.ctx.createBiquadFilter();
    oscFilter.type = 'lowpass';
    oscFilter.frequency.setValueAtTime(180, this.ctx.currentTime);

    const oscGain = this.ctx.createGain();
    oscGain.gain.setValueAtTime(0.12, this.ctx.currentTime);

    osc.connect(oscFilter);
    oscFilter.connect(oscGain);
    oscGain.connect(this.ambientGain);
    osc.start();
    this.engineRumbleNode = osc;

    // 2. High Altitude Airflow & Air Conditioning Hiss
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(600, this.ctx.currentTime);
    noiseFilter.Q.setValueAtTime(1.2, this.ctx.currentTime);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.07, this.ctx.currentTime);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.ambientGain);
    noise.start();
    this.cabinVentNode = noise;

    // 3. Tension music synthesizer drone if in crisis mode
    if (isCrisis && this.musicGain) {
      const droneFreqs = [55, 82.41, 110]; // A1, E2, A2 suspense chord
      droneFreqs.forEach(freq => {
        const droneOsc = this.ctx!.createOscillator();
        droneOsc.type = 'triangle';
        droneOsc.frequency.setValueAtTime(freq, this.ctx!.currentTime);

        const dFilter = this.ctx!.createBiquadFilter();
        dFilter.type = 'lowpass';
        dFilter.frequency.setValueAtTime(280, this.ctx!.currentTime);

        const dGain = this.ctx!.createGain();
        dGain.gain.setValueAtTime(0.15 * this.musicVol, this.ctx!.currentTime);

        droneOsc.connect(dFilter);
        dFilter.connect(dGain);
        dGain.connect(this.musicGain!);
        droneOsc.start();
        this.tensionDroneNodes.push(droneOsc);
      });
    }
  }

  // --- CINEMATIC AUDIO SYSTEM ---

  private cinematicNodes: (AudioNode)[] = [];
  private cinematicGain: GainNode | null = null;
  private takeoffTurbineOsc: OscillatorNode | null = null;
  private takeoffCombustionGain: GainNode | null = null;
  private takeoffAirGain: GainNode | null = null;
  private takeoffTurbineGain: GainNode | null = null;

  // Scene 1: Night Airport Ambience & Cinematic Suspense Chord
  public startCinematicIntroAudio() {
    this.ensureContext();
    if (!this.ctx || !this.masterGain) return;

    this.stopCinematicAudio(0.2);

    const now = this.ctx.currentTime;
    const cinGain = this.ctx.createGain();
    cinGain.gain.setValueAtTime(0.001, now);
    cinGain.gain.linearRampToValueAtTime(0.7 * this.masterVol, now + 1.5);
    cinGain.connect(this.masterGain);
    this.cinematicGain = cinGain;

    // 1. Deep Sub-Bass Drone (48 Hz + 96 Hz)
    [48, 96].forEach(freq => {
      const osc = this.ctx!.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      const gain = this.ctx!.createGain();
      gain.gain.setValueAtTime(0.25, now);

      osc.connect(gain);
      gain.connect(cinGain);
      osc.start(now);
      this.cinematicNodes.push(osc);
    });

    // 2. Cinematic Suspense Pad Chords (D-Minor: D2, A2, F3, A3)
    [73.42, 110.0, 174.61, 220.0].forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      osc.type = idx % 2 === 0 ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      // Detune slightly for lush wide stereo feel
      osc.detune.setValueAtTime((idx - 1.5) * 6, now);

      const filter = this.ctx!.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(260, now);
      filter.Q.setValueAtTime(2.0, now);

      const gain = this.ctx!.createGain();
      gain.gain.setValueAtTime(0.08, now);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(cinGain);
      osc.start(now);
      this.cinematicNodes.push(osc);
    });

    // 3. Distant Jet Turbine & Night Airport Wind
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const wind = this.ctx.createBufferSource();
    wind.buffer = buffer;
    wind.loop = true;

    const windFilter = this.ctx.createBiquadFilter();
    windFilter.type = 'lowpass';
    windFilter.frequency.setValueAtTime(280, now);

    const windGain = this.ctx.createGain();
    windGain.gain.setValueAtTime(0.12, now);

    wind.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(cinGain);
    wind.start(now);
    this.cinematicNodes.push(wind);
  }

  // Dramatic cinematic bass impact / sting when continuing
  public playCinematicSting() {
    this.ensureContext();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    // Sub-boom drop 85Hz down to 26Hz
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(85, now);
    osc.frequency.exponentialRampToValueAtTime(26, now + 1.2);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.45 * this.masterVol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 1.4);
  }

  // Scene 2: High-fidelity procedural jet engine acceleration & takeoff
  public startTakeoffEngineAudio() {
    this.ensureContext();
    if (!this.ctx || !this.masterGain) return;

    this.stopCinematicAudio(0.3);

    const now = this.ctx.currentTime;
    const cinGain = this.ctx.createGain();
    cinGain.gain.setValueAtTime(0.001, now);
    cinGain.gain.linearRampToValueAtTime(0.75 * this.masterVol, now + 1.0);
    cinGain.connect(this.masterGain);
    this.cinematicGain = cinGain;

    // 1. High-bypass turbofan spool whine (spools from 140Hz up to 1100Hz)
    const turbine = this.ctx.createOscillator();
    turbine.type = 'sawtooth';
    turbine.frequency.setValueAtTime(140, now);

    const turbFilter = this.ctx.createBiquadFilter();
    turbFilter.type = 'bandpass';
    turbFilter.frequency.setValueAtTime(450, now);
    turbFilter.Q.setValueAtTime(3.5, now);

    const turbGain = this.ctx.createGain();
    turbGain.gain.setValueAtTime(0.08, now);

    turbine.connect(turbFilter);
    turbFilter.connect(turbGain);
    turbGain.connect(cinGain);
    turbine.start(now);
    this.takeoffTurbineOsc = turbine;
    this.takeoffTurbineGain = turbGain;
    this.cinematicNodes.push(turbine);

    // 2. Twin turbofan low combustion roar (noise + lowpass)
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const roar = this.ctx.createBufferSource();
    roar.buffer = noiseBuffer;
    roar.loop = true;

    const roarFilter = this.ctx.createBiquadFilter();
    roarFilter.type = 'lowpass';
    roarFilter.frequency.setValueAtTime(240, now);

    const roarGain = this.ctx.createGain();
    roarGain.gain.setValueAtTime(0.12, now);

    roar.connect(roarFilter);
    roarFilter.connect(roarGain);
    roarGain.connect(cinGain);
    roar.start(now);
    this.takeoffCombustionGain = roarGain;
    this.cinematicNodes.push(roar);

    // 3. High-speed air rush & wake turbulence
    const air = this.ctx.createBufferSource();
    air.buffer = noiseBuffer;
    air.loop = true;

    const airFilter = this.ctx.createBiquadFilter();
    airFilter.type = 'bandpass';
    airFilter.frequency.setValueAtTime(700, now);
    airFilter.Q.setValueAtTime(1.0, now);

    const airGain = this.ctx.createGain();
    airGain.gain.setValueAtTime(0.03, now);

    air.connect(airFilter);
    airFilter.connect(airGain);
    airGain.connect(cinGain);
    air.start(now);
    this.takeoffAirGain = airGain;
    this.cinematicNodes.push(air);
  }

  // Synchronize engine pitch, volume, and air intensity with aircraft takeoff speed & altitude
  public updateTakeoffEngineAudio(speedNorm: number, altitudeNorm: number) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Ramps turbine frequency from 140Hz up to 1250Hz based on takeoff speed
    if (this.takeoffTurbineOsc) {
      const targetFreq = 140 + speedNorm * 1100 + altitudeNorm * 150;
      this.takeoffTurbineOsc.frequency.setTargetAtTime(targetFreq, now, 0.08);
    }

    // Increases combustion roar
    if (this.takeoffCombustionGain) {
      const targetRoar = 0.12 + speedNorm * 0.32;
      this.takeoffCombustionGain.gain.setTargetAtTime(targetRoar, now, 0.08);
    }

    // Increases air rush with speed, smooths out as altitude rises into cruise
    if (this.takeoffAirGain) {
      const targetAir = 0.03 + speedNorm * 0.28 + altitudeNorm * 0.15;
      this.takeoffAirGain.gain.setTargetAtTime(targetAir, now, 0.08);
    }
  }

  // Smoothly fade out and clean up cinematic audio
  public stopCinematicAudio(fadeDuration = 0.8) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    if (this.cinematicGain) {
      try {
        this.cinematicGain.gain.linearRampToValueAtTime(0.001, now + fadeDuration);
      } catch {}
    }

    const nodesToStop = [...this.cinematicNodes];
    this.cinematicNodes = [];
    this.takeoffTurbineOsc = null;
    this.takeoffCombustionGain = null;
    this.takeoffAirGain = null;
    this.takeoffTurbineGain = null;

    setTimeout(() => {
      nodesToStop.forEach(node => {
        try {
          if ('stop' in node) {
            (node as OscillatorNode | AudioBufferSourceNode).stop();
          }
          node.disconnect();
        } catch {}
      });
      if (this.cinematicGain) {
        try { this.cinematicGain.disconnect(); } catch {}
        this.cinematicGain = null;
      }
    }, (fadeDuration + 0.1) * 1000);
  }
}

export const AudioManager = new SoundManager();

