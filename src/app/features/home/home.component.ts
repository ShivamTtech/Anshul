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

interface RoseColorPalette {
  primary: string;      // Deep velvety base/body
  secondary: string;    // Rich radiant rose body
  rim: string;          // Delicate highlight on rim
  back: string;         // Matte underside tone when flipped in 3D
}

const ROSE_PALETTES: RoseColorPalette[] = [
  // Deep Royal Velvet Rose (Indian Gulab)
  {
    primary: '#781020',
    secondary: '#9E1C32',
    rim: '#DE6075',
    back: '#8A1E2E'
  },
  // Classic Bridal Crimson
  {
    primary: '#8C1526',
    secondary: '#B5253D',
    rim: '#E86E82',
    back: '#9A2335'
  },
  // Soft Romantic Rose
  {
    primary: '#962035',
    secondary: '#C23D57',
    rim: '#F08B9C',
    back: '#A83248'
  },
  // Heritage Burgundy Velvet
  {
    primary: '#600C19',
    secondary: '#821627',
    rim: '#C8445C',
    back: '#6E1322'
  }
];

class BotanicalParticle {
  x: number;
  y: number;
  z: number;
  size: number;
  aspectRatio: number;
  notchDepth: number;
  opacity: number;
  rotationZ: number;
  rotationY: number;
  flipSpeed: number;
  speedY: number;
  speedX: number;
  rotSpeed: number;
  swayFrequency: number;
  swayPhase: number;
  palette: RoseColorPalette;

  constructor(canvasWidth: number, canvasHeight: number, startAtTop: boolean = false) {
    this.z = Math.random() * 0.4 + 0.65; // depth scale 0.65 to 1.05
    this.x = Math.random() * canvasWidth;
    this.y = startAtTop ? -(Math.random() * 80 + 20) : Math.random() * (canvasHeight + 100) - 50;

    // Elegant realistic petal sizes: 11px to 17px scaled by depth
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const baseSize = isMobile ? (Math.random() * 4 + 10) : (Math.random() * 5 + 12);
    this.size = baseSize * this.z;
    this.aspectRatio = Math.random() * 0.22 + 0.88; // natural organic variety
    this.notchDepth = Math.random() * 0.08 + 0.08;

    // Soft translucent opacity (0.26 - 0.40) so website text and details remain 100% visible
    this.opacity = (Math.random() * 0.14 + 0.26) * this.z;

    this.palette = ROSE_PALETTES[Math.floor(Math.random() * ROSE_PALETTES.length)];

    // Serene, realistic drifting aerodynamics
    this.rotationZ = Math.random() * Math.PI * 2;
    this.rotationY = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 0.014;
    this.flipSpeed = Math.random() * 0.022 + 0.012;
    this.speedY = (Math.random() * 0.3 + 0.45) * this.z; // gentle slow drift
    this.speedX = (Math.random() - 0.5) * 0.32;
    this.swayFrequency = Math.random() * 0.01 + 0.006;
    this.swayPhase = Math.random() * Math.PI * 2;
  }

  update(canvasWidth: number, canvasHeight: number, time: number) {
    this.y += this.speedY;
    // Ambient gentle air sway
    this.x += this.speedX + Math.sin(time * 1.4 + this.swayPhase + this.y * this.swayFrequency) * (0.65 * this.z);
    this.rotationZ += this.rotSpeed;
    this.rotationY += this.flipSpeed;

    if (this.y > canvasHeight + 50) {
      this.y = -40;
      this.x = Math.random() * canvasWidth;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotationZ);

    // 3D flip illusion using cosine of Y rotation
    const cosY = Math.cos(this.rotationY);
    const isFront = cosY >= 0;
    const scaleX = Math.max(Math.abs(cosY), 0.06);
    ctx.scale(isFront ? scaleX : -scaleX, 1);

    const w = this.size * this.aspectRatio;
    const h = this.size * 1.25;

    // Realistic botanical rose petal curve:
    // Narrow pedicel base, voluptuous curved waist, delicate notched crown
    ctx.beginPath();
    ctx.moveTo(0, h * 0.52);
    // Left flank curve
    ctx.bezierCurveTo(-w * 0.72, h * 0.35, -w * 0.85, -h * 0.15, -w * 0.55, -h * 0.45);
    // Left crown lobe to center cleft
    ctx.bezierCurveTo(-w * 0.3, -h * 0.62, -w * 0.08, -h * (0.54 - this.notchDepth), 0, -h * (0.46 - this.notchDepth));
    // Right crown lobe from center cleft
    ctx.bezierCurveTo(w * 0.08, -h * (0.54 - this.notchDepth), w * 0.3, -h * 0.62, w * 0.55, -h * 0.45);
    // Right flank curve back to base
    ctx.bezierCurveTo(w * 0.85, -h * 0.15, w * 0.72, h * 0.35, 0, h * 0.52);
    ctx.closePath();

    // Dimensional velvet gradient fill
    const grad = ctx.createRadialGradient(-w * 0.15, -h * 0.1, this.size * 0.1, 0, 0, this.size * 1.05);
    if (isFront) {
      grad.addColorStop(0, this.palette.secondary);
      grad.addColorStop(0.65, this.palette.primary);
      grad.addColorStop(1, this.palette.rim);
    } else {
      // Underside: softer, matte tone
      grad.addColorStop(0, this.palette.back);
      grad.addColorStop(0.7, this.palette.primary);
      grad.addColorStop(1, this.palette.secondary);
    }
    ctx.fillStyle = grad;
    ctx.fill();

    // Subtle curled edge highlight along top rim
    ctx.beginPath();
    ctx.moveTo(-w * 0.45, -h * 0.45);
    ctx.bezierCurveTo(-w * 0.22, -h * 0.58, w * 0.22, -h * 0.58, w * 0.45, -h * 0.45);
    ctx.strokeStyle = `rgba(255, 235, 240, ${isFront ? 0.35 : 0.18})`;
    ctx.lineWidth = 0.75;
    ctx.stroke();

    // Delicate central crease line
    ctx.beginPath();
    ctx.moveTo(0, h * 0.48);
    ctx.quadraticCurveTo(w * 0.05, 0, 0, -h * (0.4 - this.notchDepth));
    ctx.strokeStyle = isFront ? 'rgba(60, 5, 15, 0.16)' : 'rgba(90, 15, 25, 0.12)';
    ctx.lineWidth = 0.6;
    ctx.stroke();

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
    { id: 'blessings', num: '05', roman: 'V', title: 'Blessings', subtitle: 'Heartfelt Wishes' }
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

  // Featured Authentic Royal Portraits (Minimal, Curated, High-Impact)
  readonly groomPortrait = {
    src: 'assets/images/real-groom-portrait.jpg',
    title: 'Anshul Verma',
    subtitle: 'The Royal Groom · Devotion & Honour'
  };

  readonly bridePortrait = {
    src: 'assets/images/real-bride-portrait.jpg',
    title: 'Vidisha Singh',
    subtitle: 'The Radiant Royal Bride · Grace & Tradition'
  };

  readonly couplePortrait = {
    src: 'assets/images/real-couple-portrait.jpg',
    title: 'Anshul & Vidisha',
    subtitle: 'The Royal Couple · Sacred Nuptials'
  };

  readonly ringCeremonyPhoto = {
    src: 'assets/images/real-couple-ring.jpg',
    title: 'Sacred Ring Ceremony',
    subtitle: 'An Auspicious Pledge of Eternal Companionship'
  };

  readonly selectedPhoto = signal<{ src: string; title: string; subtitle: string } | null>(null);

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

      this.smoothScroll.scrollToTop(true);
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
    this.audioService.play();
    this.showerCelebratoryPetals();
    this.isEnvelopeOpened.set(true);

    // Allow the 120 FPS unfolding card animation to be fully admired by the guest
    setTimeout(() => {
      this.isEnvelopeClosing.set(true);
      setTimeout(() => {
        this.isEnvelopeFading.set(true);
        setTimeout(() => {
          this.dismissEnvelope();
        }, 350);
      }, 250);
    }, 2200);
  }

  dismissEnvelope() {
    this.audioService.play();
    this.uiState.closeEnvelope();
    this.smoothScroll.scrollToTop(true);
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
  // 3. MINIMAL FLOATING ROSE PETALS (Sacred & Ambient, Non-Intrusive)
  // =========================================================================
  private initFloatingPetals() {
    if (!this.petalCanvasRef) return;
    const canvas = this.petalCanvasRef.nativeElement;
    this.petalCtx = canvas.getContext('2d', { alpha: true });
    
    const updateSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };

    updateSize();

    // Spawn minimal, very sparse canopy of authentic rose petals (never obscures text)
    const w = window.innerWidth;
    const h = window.innerHeight;
    const isMobile = w < 768;
    const petalCount = isMobile ? 10 : 16;
    this.botanicalParticles = [];
    for (let i = 0; i < petalCount; i++) {
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
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.petalCtx.save();
    this.petalCtx.scale(dpr, dpr);
    this.petalCtx.clearRect(0, 0, w, h);
    this.petalTime += 0.016 * dt;

    for (const particle of this.botanicalParticles) {
      particle.update(w, h, this.petalTime);
      particle.draw(this.petalCtx);
    }
    this.petalCtx.restore();

    this.petalAnimFrame = requestAnimationFrame(() => this.animatePetals());
  }

  showerCelebratoryPetals() {
    if (!this.petalCanvasRef) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const isMobile = w < 768;
    const extraPetals = isMobile ? 4 : 6;
    const maxPetals = isMobile ? 14 : 20;

    for (let i = 0; i < extraPetals; i++) {
      this.botanicalParticles.push(new BotanicalParticle(w, h, true));
    }
    if (this.botanicalParticles.length > maxPetals) {
      this.botanicalParticles.splice(0, this.botanicalParticles.length - maxPetals);
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
