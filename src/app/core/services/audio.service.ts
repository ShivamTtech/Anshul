import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  readonly isPlaying = signal<boolean>(false);
  readonly isMuted = signal<boolean>(false);
  readonly volume = signal<number>(0.85);

  // Track No. 3: Royal Nuptials — Grand Hollywood Wedding Symphony (5.29 MB Studio Master)
  readonly soundtrackSrc = 'assets/audio/royal-nuptials.mp3';

  private htmlAudio: HTMLAudioElement | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initHtmlAudio();
    }
  }

  private initHtmlAudio() {
    if (typeof window === 'undefined') return;
    try {
      if (!this.htmlAudio) {
        this.htmlAudio = new Audio();
        this.htmlAudio.src = this.soundtrackSrc;
        this.htmlAudio.loop = true;
        this.htmlAudio.preload = 'auto';

        this.htmlAudio.addEventListener('playing', () => {
          this.isPlaying.set(true);
        });

        this.htmlAudio.addEventListener('pause', () => {
          this.isPlaying.set(false);
        });
      }
      this.htmlAudio.volume = this.isMuted() ? 0 : this.volume();
    } catch (e) {
      console.warn('HTMLAudio init error', e);
    }
  }

  setVolume(newVol: number) {
    const clamped = Math.max(0, Math.min(1, newVol));
    this.volume.set(clamped);
    if (this.htmlAudio) {
      this.htmlAudio.volume = this.isMuted() ? 0 : clamped;
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
    if (!this.htmlAudio) {
      this.initHtmlAudio();
    }

    if (this.htmlAudio) {
      this.htmlAudio.volume = this.isMuted() ? 0 : this.volume();
      const playPromise = this.htmlAudio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.isPlaying.set(true);
          })
          .catch((err) => {
            console.warn('Audio autoplay pending user touch:', err);
            this.isPlaying.set(false);
          });
      }
    }
  }

  pause() {
    if (this.htmlAudio) {
      this.htmlAudio.pause();
    }
    this.isPlaying.set(false);
  }

  toggleMute() {
    const muted = !this.isMuted();
    this.isMuted.set(muted);
    if (this.htmlAudio) {
      this.htmlAudio.muted = muted;
      this.htmlAudio.volume = muted ? 0 : this.volume();
    }
  }

  // Safe backward compatibility no-ops
  playSacredChime(_freq?: number, _duration?: number, _gainLevel?: number) {}
  playChimeChord(_baseFreq?: number) {}
}
