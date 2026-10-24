// Web Audio API procedural sound engine for ambient relaxation and interaction sounds
import type { MoodType } from '../types';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private currentTrackGain: GainNode | null = null;
  private activeGenerators: Array<{ stop: () => void }> = [];
  private isMuted: boolean = true;
  private volume: number = 0.6;
  private currentMood: MoodType | 'secret' | 'gate' | null = null;



  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getVolume(): number {
    return this.volume;
  }

  public getCurrentMood(): MoodType | 'secret' | 'gate' | null {
    return this.currentMood;
  }

  public setMuted(muted: boolean) {
    this.initContext();
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.linearRampToValueAtTime(muted ? 0 : this.volume, now + 0.4);
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public setVolume(newVolume: number) {
    this.volume = Math.max(0, Math.min(1, newVolume));
    if (!this.isMuted && this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.linearRampToValueAtTime(this.volume, now + 0.1);
    }
  }

  public stopAllTracks() {
    if (this.currentTrackGain && this.ctx) {
      try {
        this.currentTrackGain.gain.setValueAtTime(0, this.ctx.currentTime);
      } catch {
        // ignore
      }
      this.currentTrackGain = null;
    }
    if (this.activeGenerators.length > 0) {
      this.activeGenerators.forEach((gen) => {
        try {
          gen.stop();
        } catch {
          // Ignore already stopped
        }
      });
      this.activeGenerators = [];
    }
    this.currentMood = null;
  }


  // Play ambient track based on current mood
  public playMood(mood: MoodType | 'secret' | 'gate') {
    this.initContext();
    if (this.currentMood === mood) return;

    this.stopAllTracks();
    this.currentMood = mood;

    if (!this.ctx || !this.masterGain) return;

    const trackGain = this.ctx.createGain();
    trackGain.gain.setValueAtTime(0, this.ctx.currentTime);
    trackGain.gain.linearRampToValueAtTime(0.5, this.ctx.currentTime + 1.2);
    trackGain.connect(this.masterGain);
    this.currentTrackGain = trackGain;

    switch (mood) {
      case 'happy':
        this.createMeadowAmbience(trackGain);
        break;
      case 'sad':
        this.createRainAmbience(trackGain);
        break;
      case 'tired':
        this.createPianoAmbience(trackGain);
        break;
      case 'overthinking':
        this.createLavenderDroneAmbience(trackGain);
        break;
      case 'dont-know':
        this.createLakeAmbience(trackGain);
        break;
      case 'secret':
        this.createGardenAmbience(trackGain);
        break;
      case 'gate':
        this.createCelestialAmbience(trackGain);
        break;
    }
  }

  // --- AMBIENCE GENERATORS ---

  // 1. HAPPY: Gentle meadow breeze + soft pentatonic chimes
  private createMeadowAmbience(output: GainNode) {
    if (!this.ctx) return;
    const ctx = this.ctx;

    // Soft pink noise breeze
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const outputData = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      outputData[i] = (b0 + b1 + b2) * 0.05;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, ctx.currentTime);

    // Subtle wind swell LFO
    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.2, ctx.currentTime);
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(140, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const breezeGain = ctx.createGain();
    breezeGain.gain.setValueAtTime(0.25, ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(breezeGain);
    breezeGain.connect(output);

    whiteNoise.start();
    lfo.start();

    // Occasional gentle chime notes (pentatonic warmth: C5, E5, G5, A5, C6)
    const notes = [523.25, 659.25, 783.99, 880.0, 1046.5];
    let isRunning = true;

    const chimeTimer = setInterval(() => {
      if (!isRunning || !this.ctx) return;
      const noteFreq = notes[Math.floor(Math.random() * notes.length)];
      this.playPureTone(noteFreq, 0.08, 2.5, output);
    }, 3800);

    this.activeGenerators.push({
      stop: () => {
        isRunning = false;
        clearInterval(chimeTimer);
        try {
          whiteNoise.stop();
          lfo.stop();
        } catch {
          // ignore
        }
      },
    });
  }

  // 2. SAD: Cozy binaural rainfall + soft distant warmth
  private createRainAmbience(output: GainNode) {
    if (!this.ctx) return;
    const ctx = this.ctx;

    const bufferSize = ctx.sampleRate * 3;
    const noiseBuffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
    for (let channel = 0; channel < 2; channel++) {
      const data = noiseBuffer.getChannelData(channel);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 0.7; // soften
      }
    }

    const rainSource = ctx.createBufferSource();
    rainSource.buffer = noiseBuffer;
    rainSource.loop = true;

    const rainFilter = ctx.createBiquadFilter();
    rainFilter.type = 'lowpass';
    rainFilter.frequency.setValueAtTime(950, ctx.currentTime);

    const rainGain = ctx.createGain();
    rainGain.gain.setValueAtTime(0.4, ctx.currentTime);

    rainSource.connect(rainFilter);
    rainFilter.connect(rainGain);
    rainGain.connect(output);

    rainSource.start();

    // Random soft droplets pinging against the window
    let isRunning = true;
    const dropTimer = setInterval(() => {
      if (!isRunning || !this.ctx) return;
      const dropFreq = 1200 + Math.random() * 800;
      this.playDropletTone(dropFreq, 0.04, 0.25, output);
    }, 600 + Math.random() * 1200);

    this.activeGenerators.push({
      stop: () => {
        isRunning = false;
        clearInterval(dropTimer);
        try {
          rainSource.stop();
        } catch {
          // ignore
        }
      },
    });
  }

  // 3. TIRED: Warm felt piano arpeggios
  private createPianoAmbience(output: GainNode) {
    if (!this.ctx) return;
    const chords = [
      [130.81, 196.0, 246.94, 329.63], // Cmaj9: C3, G3, B3, E4
      [110.0, 164.81, 196.0, 261.63],  // Am7: A2, E3, G3, C4
      [87.31, 130.81, 164.81, 220.0],  // Fmaj7: F2, C3, E3, A3
      [98.0, 146.83, 196.0, 246.94],   // G6: G2, D3, G3, B3
    ];

    let chordIdx = 0;
    let noteIdx = 0;
    let isRunning = true;

    const playNextNote = () => {
      if (!isRunning || !this.ctx) return;
      const currentChord = chords[chordIdx];
      const freq = currentChord[noteIdx];
      this.playWarmPianoNote(freq, 0.12, 3.2, output);

      noteIdx++;
      if (noteIdx >= currentChord.length) {
        noteIdx = 0;
        chordIdx = (chordIdx + 1) % chords.length;
      }
    };

    playNextNote();
    const interval = setInterval(playNextNote, 1700);

    this.activeGenerators.push({
      stop: () => {
        isRunning = false;
        clearInterval(interval);
      },
    });
  }

  // 4. OVERTHINKING: Soft floating lavender drone
  private createLavenderDroneAmbience(output: GainNode) {
    if (!this.ctx) return;
    const ctx = this.ctx;

    // Detuned dual warm sine waves
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(146.83, ctx.currentTime); // D3

    const osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(220.0, ctx.currentTime); // A3 (pure 5th)

    const osc3 = ctx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(293.66, ctx.currentTime); // D4

    // Slow pulse LFO
    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.12, ctx.currentTime);
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(0.08, ctx.currentTime);

    const droneGain = ctx.createGain();
    droneGain.gain.setValueAtTime(0.18, ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(droneGain.gain);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, ctx.currentTime);

    osc1.connect(filter);
    osc2.connect(filter);
    osc3.connect(filter);
    filter.connect(droneGain);
    droneGain.connect(output);

    osc1.start();
    osc2.start();
    osc3.start();
    lfo.start();

    this.activeGenerators.push({
      stop: () => {
        try {
          osc1.stop();
          osc2.stop();
          osc3.stop();
          lfo.stop();
        } catch {
          // ignore
        }
      },
    });
  }

  // 5. I DON'T KNOW: Twilight lake water lap + singing bowl chime
  private createLakeAmbience(output: GainNode) {
    if (!this.ctx) return;
    const ctx = this.ctx;

    // Water swell
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(280, ctx.currentTime);
    filter.Q.setValueAtTime(3, ctx.currentTime);

    const swellLfo = ctx.createOscillator();
    swellLfo.frequency.setValueAtTime(0.18, ctx.currentTime);
    const swellGain = ctx.createGain();
    swellGain.gain.setValueAtTime(120, ctx.currentTime);
    swellLfo.connect(swellGain);
    swellGain.connect(filter.frequency);

    const waterGain = ctx.createGain();
    waterGain.gain.setValueAtTime(0.2, ctx.currentTime);

    noise.connect(filter);
    filter.connect(waterGain);
    waterGain.connect(output);

    noise.start();
    swellLfo.start();

    // Occasional resonant singing bowl tone
    let isRunning = true;
    const bowlFrequencies = [216, 324, 432];
    const bowlTimer = setInterval(() => {
      if (!isRunning || !this.ctx) return;
      const freq = bowlFrequencies[Math.floor(Math.random() * bowlFrequencies.length)];
      this.playSingingBowl(freq, 0.08, 4.5, output);
    }, 5500);

    this.activeGenerators.push({
      stop: () => {
        isRunning = false;
        clearInterval(bowlTimer);
        try {
          noise.stop();
          swellLfo.stop();
        } catch {
          // ignore
        }
      },
    });
  }

  // 6. SECRET GARDEN: Magical firefly night sparkles + gentle nocturnal pulse
  private createGardenAmbience(output: GainNode) {
    if (!this.ctx) return;
    const ctx = this.ctx;

    // Very quiet gentle midnight air
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(110, ctx.currentTime);

    const airGain = ctx.createGain();
    airGain.gain.setValueAtTime(0.04, ctx.currentTime);
    osc.connect(airGain);
    airGain.connect(output);
    osc.start();

    let isRunning = true;
    // Occasional star sparkle (pentatonic arpeggio)
    const sparkles = [659.25, 783.99, 987.77, 1174.66, 1318.51];
    const sparkleTimer = setInterval(() => {
      if (!isRunning || !this.ctx) return;
      const f = sparkles[Math.floor(Math.random() * sparkles.length)];
      this.playPureTone(f, 0.04, 1.8, output);
    }, 2400);

    this.activeGenerators.push({
      stop: () => {
        isRunning = false;
        clearInterval(sparkleTimer);
        try {
          osc.stop();
        } catch {
          // ignore
        }
      },
    });
  }

  // 7. OPENING GATE: Deep celestial stillness
  private createCelestialAmbience(output: GainNode) {
    if (!this.ctx) return;
    const ctx = this.ctx;

    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(110.0, ctx.currentTime); // A2

    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(164.81, ctx.currentTime); // E3

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.07, ctx.currentTime);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(output);

    osc1.start();
    osc2.start();

    this.activeGenerators.push({
      stop: () => {
        try {
          osc1.stop();
          osc2.stop();
        } catch {
          // ignore
        }
      },
    });
  }

  // --- SOUND SYNTHESIS HELPERS ---

  private playWarmPianoNote(freq: number, vol: number, duration: number, output: GainNode) {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    const noteFilter = ctx.createBiquadFilter();
    noteFilter.type = 'lowpass';
    noteFilter.frequency.setValueAtTime(500, ctx.currentTime);
    noteFilter.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + duration);

    const noteGain = ctx.createGain();
    const now = ctx.currentTime;
    noteGain.gain.setValueAtTime(0.001, now);
    noteGain.gain.linearRampToValueAtTime(vol, now + 0.08);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(noteFilter);
    noteFilter.connect(noteGain);
    noteGain.connect(output);

    osc.start(now);
    osc.stop(now + duration);
  }

  private playDropletTone(freq: number, vol: number, duration: number, output: GainNode) {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.4, ctx.currentTime + duration);

    const gain = ctx.createGain();
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(output);

    osc.start(now);
    osc.stop(now + duration);
  }

  private playPureTone(freq: number, vol: number, duration: number, output: GainNode) {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    const gain = ctx.createGain();
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(vol, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(output);

    osc.start(now);
    osc.stop(now + duration);
  }

  private playSingingBowl(freq: number, vol: number, duration: number, output: GainNode) {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    const sub = ctx.createOscillator();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(freq * 2.01, ctx.currentTime);

    const gain = ctx.createGain();
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(vol, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    sub.connect(gain);
    gain.connect(output);

    osc.start(now);
    sub.start(now);
    osc.stop(now + duration);
    sub.stop(now + duration);
  }

  // --- SHORT UI SOUND EFFECTS ---

  public playPaperRustle() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    const ctx = this.ctx;

    const bufferSize = ctx.sampleRate * 0.18;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.12;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2200, ctx.currentTime);
    filter.Q.setValueAtTime(1.5, ctx.currentTime);

    const gain = ctx.createGain();
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(now);
  }

  public playWaterRippleSound() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    const now = ctx.currentTime;
    const baseFreq = 420 + Math.random() * 180;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.6, now + 0.14);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.18);
  }

  public playBloomChime() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const freqs = [783.99, 987.77, 1318.51];
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      const now = ctx.currentTime + idx * 0.08;
      osc.frequency.setValueAtTime(freq, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.06, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(now);
      osc.stop(now + 1.2);
    });
  }

  public playSoftBell() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(880, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.8);
  }
}

export const soundEngine = new SoundEngine();
