import { 
  Component, 
  inject, 
  signal, 
  computed, 
  afterNextRender, 
  OnDestroy, 
  ElementRef, 
  ViewChild, 
  PLATFORM_ID,
  HostListener
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeddingDataService, WeddingCeremony, ProgramStep, SacredRitual, GuestWish } from '../../core/services/wedding-data.service';
import { AudioService } from '../../core/services/audio.service';
import { UiStateService } from '../../core/services/ui-state.service';
import { SmoothScrollService } from '../../core/services/smooth-scroll.service';

interface CountdownState {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

type BotanicalKind = 'rose-petal' | 'sage-leaf' | 'gold-flake';

class BotanicalParticle {
  kind: BotanicalKind;
  x: number;
  y: number;
  z: number;
  size: number;
  opacity: number;
  rotationZ: number;
  rotationY: number;
  flipSpeed: number;
  speedY: number;
  speedX: number;
  rotSpeed: number;
  swayFrequency: number;
  swayPhase: number;
  color: string;
  secondaryColor?: string;

  constructor(canvasWidth: number, canvasHeight: number, startAtTop: boolean = false) {
    const rand = Math.random();
    if (rand < 0.5) {
      this.kind = 'rose-petal';
    } else if (rand < 0.85) {
      this.kind = 'sage-leaf';
    } else {
      this.kind = 'gold-flake';
    }

    this.z = Math.random() * 0.7 + 0.6;
    this.x = Math.random() * canvasWidth;
    this.y = startAtTop ? (Math.random() * -120) : (Math.random() * (canvasHeight + 100) - 100);

    if (this.kind === 'rose-petal') {
      this.size = (Math.random() * 10 + 8) * this.z;
      this.opacity = (Math.random() * 0.35 + 0.28) * (this.z * 0.95);
      const roseColors = ['#E8A5AC', '#F2C2C6', '#DDA0A7', '#D4AF37', '#E5C068', '#C98A93', '#F9E2E5'];
      this.color = roseColors[Math.floor(Math.random() * roseColors.length)];
      this.speedY = (Math.random() * 0.7 + 0.45) * this.z;
    } else if (this.kind === 'sage-leaf') {
      this.size = (Math.random() * 12 + 9) * this.z;
      this.opacity = (Math.random() * 0.32 + 0.26) * (this.z * 0.95);
      const leafColors = ['#8FA489', '#7D9577', '#A3B89D', '#6D8568', '#B7C9B2'];
      this.color = leafColors[Math.floor(Math.random() * leafColors.length)];
      this.secondaryColor = '#556B50';
      this.speedY = (Math.random() * 0.8 + 0.5) * this.z;
    } else {
      this.size = (Math.random() * 3 + 1.8) * this.z;
      this.opacity = Math.random() * 0.5 + 0.35;
      this.color = '#F2D379';
      this.speedY = (Math.random() * 0.4 + 0.3) * this.z;
    }

    this.rotationZ = Math.random() * Math.PI * 2;
    this.rotationY = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 0.024;
    this.flipSpeed = Math.random() * 0.035 + 0.015;
    this.speedX = (Math.random() - 0.5) * 0.45;
    this.swayFrequency = Math.random() * 0.012 + 0.006;
    this.swayPhase = Math.random() * Math.PI * 2;
  }

  update(canvasWidth: number, canvasHeight: number, time: number) {
    this.y += this.speedY;
    this.x += this.speedX + Math.sin(time * 1.8 + this.swayPhase + this.y * this.swayFrequency) * (0.65 * this.z);
    this.rotationZ += this.rotSpeed;
    this.rotationY += this.flipSpeed;

    if (this.y > canvasHeight + 35) {
      this.y = -35;
      this.x = Math.random() * canvasWidth;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotationZ);

    const scaleX = Math.cos(this.rotationY);
    ctx.scale(scaleX, 1);

    if (this.kind === 'rose-petal') {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.moveTo(0, -this.size * 0.6);
      ctx.bezierCurveTo(this.size * 0.65, -this.size * 0.6, this.size * 0.7, this.size * 0.5, 0, this.size * 0.6);
      ctx.bezierCurveTo(-this.size * 0.7, this.size * 0.5, -this.size * 0.65, -this.size * 0.6, 0, -this.size * 0.6);
      ctx.fill();
    } else if (this.kind === 'sage-leaf') {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.moveTo(0, -this.size * 0.85);
      ctx.quadraticCurveTo(this.size * 0.45, 0, 0, this.size * 0.85);
      ctx.quadraticCurveTo(-this.size * 0.45, 0, 0, -this.size * 0.85);
      ctx.fill();

      if (this.secondaryColor) {
        ctx.strokeStyle = this.secondaryColor;
        ctx.globalAlpha = this.opacity * 0.5;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(0, -this.size * 0.7);
        ctx.lineTo(0, this.size * 0.7);
        ctx.stroke();
      }
    } else {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

export interface StoryChapter {
  id: string;
  num: string;
  roman: string;
  title: string;
  subtitle: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnDestroy {
  readonly weddingData = inject(WeddingDataService);
  readonly audioService = inject(AudioService);
  readonly uiState = inject(UiStateService);
  private smoothScroll = inject(SmoothScrollService);
  private platformId = inject(PLATFORM_ID);
  private el = inject(ElementRef);

  @ViewChild('petalCanvas') petalCanvasRef!: ElementRef<HTMLCanvasElement>;

  // Story Chapters Architecture
  readonly storyChapters: StoryChapter[] = [
    { id: 'hero', num: '01', roman: 'I', title: 'Sacred Invocation', subtitle: 'Auspicious Blessings' },
    { id: 'couple', num: '02', roman: 'II', title: 'The Couple', subtitle: 'Groom & Bride' },
    { id: 'ceremonies', num: '03', roman: 'III', title: 'Ceremonies', subtitle: 'Sacred Celebrations' },
    { id: 'itinerary', num: '04', roman: 'IV', title: 'Itinerary', subtitle: 'Vedic Rites' },
    { id: 'venues', num: '05', roman: 'V', title: 'Venues', subtitle: 'Sacred Destinations' },
    { id: 'blessings', num: '06', roman: 'VI', title: 'Blessings', subtitle: 'Heartfelt Wishes' }
  ];

  readonly activeChapterIndex = signal<number>(0);
  readonly scrollProgressPercent = signal<number>(0);

  // Envelope Ceremony State
  readonly isEnvelopeModalOpen = computed(() => this.uiState.isEnvelopeOpen());
  readonly isEnvelopeOpened = signal<boolean>(false);
  readonly isEnvelopeClosing = signal<boolean>(false);
  readonly isEnvelopeFading = signal<boolean>(false);

  // Physical Card Modal
  readonly isPhysicalCardOpen = computed(() => this.uiState.isPhysicalCardModalOpen());

  // Real Couple Photos & Lightbox
  readonly coupleMoments: Array<{ src: string; title: string; subtitle: string }> = [
    {
      src: 'assets/images/real-couple-portrait.jpg',
      title: 'Anshul & Vidisha',
      subtitle: 'The Royal Couple'
    },
    {
      src: 'assets/images/real-couple-ring.jpg',
      title: 'Sacred Ring Ceremony',
      subtitle: 'A Sacred Promise of Eternal Love'
    },
    {
      src: 'assets/images/real-bride-portrait.jpg',
      title: 'The Radiant Bride',
      subtitle: 'Vidisha Singh'
    },
    {
      src: 'assets/images/real-celebration-dance.jpg',
      title: 'Celebration & Sangeet',
      subtitle: 'Joyous Family Festivities'
    },
    {
      src: 'assets/images/real-celebration-joy.jpg',
      title: 'Candid Happiness',
      subtitle: 'Laughter, Harmony & Blessings'
    }
  ];
  readonly selectedPhoto = signal<{ src: string; title: string; subtitle: string } | null>(null);

  // Active Ambient Background Moment (Minimalist Editorial Story)
  readonly activeBgMomentIndex = signal<number>(0);
  readonly activeBgMoment = computed(() => this.coupleMoments[this.activeBgMomentIndex()]);

  setActiveBgMoment(idx: number) {
    this.activeBgMomentIndex.set(idx);
    this.audioService.playSacredChime(440, 0.7, 0.04);
  }

  openPhotoLightbox(photo: { src: string; title: string; subtitle: string }) {
    this.selectedPhoto.set(photo);
  }

  closePhotoLightbox() {
    this.selectedPhoto.set(null);
  }

  // Program Tab ('timeline' | 'rituals')
  readonly activeProgramTab = signal<'timeline' | 'rituals'>('timeline');

  readonly copiedToast = signal<string | null>(null);

  // Active Ceremony Tab
  readonly activeCeremonyIndex = signal<number>(2); // Default to Wedding
  readonly currentCeremony = computed<WeddingCeremony>(() => this.weddingData.ceremonies[this.activeCeremonyIndex()]);

  // Countdown State
  readonly countdown = signal<CountdownState>({ days: '00', hours: '00', minutes: '00', seconds: '00' });
  private countdownTimer: any = null;

  // Floating Botanical Canvas State (Petals, Leaves & Gold Dust)
  private petalCtx: CanvasRenderingContext2D | null = null;
  private botanicalParticles: BotanicalParticle[] = [];
  private petalAnimFrame: number | null = null;
  private lastFrameTime = 0;
  private petalTime = 0;

  // Observer
  private observer: IntersectionObserver | null = null;

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) return;

      this.startCountdown();
      this.initFloatingPetals();
      this.initScrollReveals();
    });
  }

  ngOnDestroy() {
    if (this.countdownTimer) clearInterval(this.countdownTimer);
    if (this.petalAnimFrame) cancelAnimationFrame(this.petalAnimFrame);
    if (this.observer) this.observer.disconnect();
  }

  // =========================================================================
  // 1. ROYAL ENVELOPE OPENING CEREMONY (120 FPS FLUID MOTION)
  // =========================================================================
  breakRoyalSeal(event: MouseEvent) {
    this.audioService.playSacredChime(587.33, 1.4, 0.12);
    this.showerCelebratoryPetals();
    this.isEnvelopeOpened.set(true);

    setTimeout(() => {
      this.isEnvelopeClosing.set(true);
      setTimeout(() => {
        this.isEnvelopeFading.set(true);
        setTimeout(() => {
          this.uiState.closeEnvelope();
        }, 300);
      }, 450);
    }, 1300);
  }

  dismissEnvelope() {
    this.audioService.play();
    this.isEnvelopeClosing.set(true);
    this.isEnvelopeFading.set(true);
    setTimeout(() => {
      this.uiState.closeEnvelope();
    }, 250);
  }

  // =========================================================================
  // 2. LIVE COUNTDOWN TIMER (Wedding Day — 20th November 2026)
  // =========================================================================
  private startCountdown() {
    const weddingDate = new Date("November 20, 2026 18:00:00").getTime();

    const update = () => {
      const now = new Date().getTime();
      const diff = weddingDate - now;

      if (diff > 0) {
        this.countdown.set({
          days: String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, '0'),
          hours: String(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0'),
          minutes: String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0'),
          seconds: String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0')
        });
      }
    };

    update();
    this.countdownTimer = setInterval(update, 1000);
  }

  // =========================================================================
  // 3. FLOATING PETALS & BOTANICAL LEAF RAIN ENGINE (120 FPS Simulation)
  // =========================================================================
  private initFloatingPetals() {
    if (!this.petalCanvasRef) return;
    const canvas = this.petalCanvasRef.nativeElement;
    this.petalCtx = canvas.getContext('2d', { alpha: true });
    
    const updateSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      if (this.petalCtx) {
        this.petalCtx.scale(dpr, dpr);
      }
    };

    updateSize();

    // Spawn rich canopy of 52 multi-layer petals and eucalyptus leaves
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.botanicalParticles = [];
    for (let i = 0; i < 52; i++) {
      this.botanicalParticles.push(new BotanicalParticle(w, h));
    }

    window.addEventListener('resize', () => {
      updateSize();
    });

    this.lastFrameTime = performance.now();
    this.animatePetals();
  }

  private animatePetals() {
    if (!this.petalCtx || !this.petalCanvasRef) return;
    const canvas = this.petalCanvasRef.nativeElement;
    const now = performance.now();
    const dt = Math.min((now - this.lastFrameTime) / 16.67, 2.5); // normalize for 60/120Hz
    this.lastFrameTime = now;

    const w = window.innerWidth;
    const h = window.innerHeight;

    this.petalCtx.clearRect(0, 0, w, h);
    this.petalTime += 0.016 * dt;

    for (const particle of this.botanicalParticles) {
      particle.update(w, h, this.petalTime);
      particle.draw(this.petalCtx);
    }

    this.petalAnimFrame = requestAnimationFrame(() => this.animatePetals());
  }

  showerCelebratoryPetals() {
    if (!this.petalCanvasRef) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    for (let i = 0; i < 30; i++) {
      this.botanicalParticles.push(new BotanicalParticle(w, h, true));
    }
    if (this.botanicalParticles.length > 80) {
      this.botanicalParticles.splice(0, 25);
    }
  }

  // =========================================================================
  // 4. CEREMONIES & CALENDAR
  // =========================================================================
  selectCeremony(idx: number) {
    this.activeCeremonyIndex.set(idx);
    this.audioService.playSacredChime(392.00, 1.2, 0.08);
  }

  downloadCalendar(ceremony?: WeddingCeremony) {
    this.weddingData.downloadCalendarIcs(ceremony || this.currentCeremony());
  }

  // =========================================================================
  // 5. PHYSICAL CARD MODAL CONTROLS
  // =========================================================================
  openPhysicalCardModal() {
    this.uiState.openPhysicalCardModal();
  }

  closePhysicalCardModal() {
    this.uiState.closePhysicalCardModal();
  }

  // =========================================================================
  // 6. COPY ADDRESS HELPER
  // =========================================================================
  copyAddress(text: string, label: string) {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      this.copiedToast.set(`${label} copied to clipboard! ✓`);
      setTimeout(() => this.copiedToast.set(null), 2800);
    }
  }

  downloadFullCalendar() {
    this.weddingData.downloadAllCeremoniesIcs();
  }

  // =========================================================================
  // 8. SCROLL & CHAPTER NAVIGATION
  // =========================================================================
  @HostListener('window:scroll')
  onWindowScroll() {
    if (typeof window === 'undefined') return;

    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
    this.scrollProgressPercent.set(Math.min(100, Math.max(0, progress)));

    const scrollPos = window.scrollY + window.innerHeight * 0.35;
    for (let i = this.storyChapters.length - 1; i >= 0; i--) {
      const section = document.getElementById(this.storyChapters[i].id);
      if (section && section.offsetTop <= scrollPos) {
        if (this.activeChapterIndex() !== i) {
          this.activeChapterIndex.set(i);
        }
        break;
      }
    }
  }

  goToChapter(index: number, event?: Event) {
    if (event) event.preventDefault();
    const target = this.storyChapters[index];
    if (target) {
      this.activeChapterIndex.set(index);
      this.smoothScroll.scrollTo('#' + target.id, -60);
    }
  }

  private initScrollReveals() {
    if (typeof IntersectionObserver === 'undefined') return;

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          this.observer?.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    const root = this.el.nativeElement;
    root.querySelectorAll('.reveal-elem').forEach((el: Element) => {
      this.observer?.observe(el);
    });
  }

  scrollTo(target: string, event?: Event) {
    if (event) event.preventDefault();
    this.smoothScroll.scrollTo(target, -60);
  }
}
