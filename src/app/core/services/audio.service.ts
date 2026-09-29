import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  readonly isPlaying = signal<boolean>(false);
  readonly isMuted = signal<boolean>(false);
  readonly volume = signal<number>(0.6);

  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private lfo: OscillatorNode | null = null;
  private isSynthesizing = false;
  private htmlAudio: HTMLAudioElement | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      // Try loading custom wedding audio if available
      this.htmlAudio = new Audio('assets/audio/wedding-melody.mp3');
      this.htmlAudio.loop = true;
      this.htmlAudio.volume = this.volume();
    }
  }

  togglePlay(): boolean {
    if (this.isPlaying()) {
      this.pause();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  play() {
    if (this.isPlaying()) return;

    if (this.htmlAudio) {
      this.htmlAudio.play().then(() => {
        this.isPlaying.set(true);
      }).catch(() => {
        // If file not found or browser blocks audio file, start soothing royal harmonic synthesizer!
        this.startHarmonicSynthesizer();
        this.isPlaying.set(true);
      });
    } else {
      this.startHarmonicSynthesizer();
      this.isPlaying.set(true);
    }
  }

  pause() {
    if (this.htmlAudio) {
      this.htmlAudio.pause();
    }
    this.stopHarmonicSynthesizer();
    this.isPlaying.set(false);
  }

  toggleMute() {
    const muted = !this.isMuted();
    this.isMuted.set(muted);
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : this.volume() * 0.15, this.audioCtx?.currentTime || 0);
    }
    if (this.htmlAudio) {
      this.htmlAudio.muted = muted;
    }
  }

  /**
   * Synthesize a serene, meditative Indian royal Tanpura & Sitar drone (Raga Yaman / Bhairavi tonic in C# / Sa-Pa)
   * Sa = 138.59 Hz, Pa = 207.65 Hz, higher Sa = 277.18 Hz with rich warm harmonics and gentle tremolo.
   */
  private startHarmonicSynthesizer() {
    if (this.isSynthesizing || typeof window === 'undefined') return;

    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
      
      this.masterGain = this.audioCtx.createGain();
      const vol = this.isMuted() ? 0 : this.volume() * 0.12;
      this.masterGain.gain.setValueAtTime(vol, this.audioCtx.currentTime);
      this.masterGain.connect(this.audioCtx.destination);

      // Low pass filter for warm royal acoustic resonance
      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(480, this.audioCtx.currentTime);
      filter.Q.setValueAtTime(2.5, this.audioCtx.currentTime);
      filter.connect(this.masterGain);

      // Notes: C# (Sa: 138.6 Hz), G# (Pa: 207.7 Hz), C# octave (277.2 Hz), F (Shuddha Gandhar: 174.6 Hz)
      const droneFrequencies = [138.59, 207.65, 277.18, 349.23, 415.30];

      droneFrequencies.forEach((freq, idx) => {
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const oscGain = this.audioCtx.createGain();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

        // Subtle detune for organic acoustic Tanpura chorus shimmer
        const detuneValue = (idx - 2) * 4.5;
        osc.detune.setValueAtTime(detuneValue, this.audioCtx.currentTime);

        // Individual gain balance
        const individualGain = 0.22 / (idx + 1);
        oscGain.gain.setValueAtTime(individualGain, this.audioCtx.currentTime);

        osc.connect(oscGain);
        oscGain.connect(filter);
        osc.start();
        this.oscillators.push(osc);
      });

      // LFO for slow meditative breath wave
      this.lfo = this.audioCtx.createOscillator();
      const lfoGain = this.audioCtx.createGain();
      this.lfo.frequency.setValueAtTime(0.18, this.audioCtx.currentTime); // 0.18 Hz slow cycle
      lfoGain.gain.setValueAtTime(120, this.audioCtx.currentTime);
      this.lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      this.lfo.start();

      this.isSynthesizing = true;
    } catch (e) {
      console.warn('AudioContext not allowed or supported', e);
    }
  }

  private stopHarmonicSynthesizer() {
    if (!this.isSynthesizing) return;
    this.oscillators.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {}
    });
    this.oscillators = [];
    if (this.lfo) {
      try {
        this.lfo.stop();
        this.lfo.disconnect();
      } catch {}
      this.lfo = null;
    }
    if (this.audioCtx) {
      try {
        this.audioCtx.close();
      } catch {}
      this.audioCtx = null;
    }
    this.isSynthesizing = false;
  }
}
