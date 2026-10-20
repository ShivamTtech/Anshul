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
import { LanguageService } from '../../core/services/language.service';

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

let rosePetalSprites: HTMLCanvasElement[] = [];
let isPetalSpritesLoaded = false;

class BotanicalParticle {
  x: number;
  y: number;
  z: number;
  size: number;
  aspectRatio: number;
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
  spriteIndex: number;

  constructor(canvasWidth: number, canvasHeight: number, startAtTop: boolean = false) {
    this.z = Math.random() * 0.4 + 0.65; // depth scale 0.65 to 1.05
    this.x = Math.random() * canvasWidth;
    this.y = startAtTop ? -(Math.random() * 80 + 20) : Math.random() * (canvasHeight + 100) - 50;

    // Elegant realistic plucked rose petal sizes
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const baseSize = isMobile ? (Math.random() * 5 + 13) : (Math.random() * 6 + 16);
    this.size = baseSize * this.z;
    this.aspectRatio = Math.random() * 0.2 + 0.88; // natural organic variety

    // Soft translucent opacity (0.35 - 0.55) so real velvety texture shines through
    this.opacity = (Math.random() * 0.2 + 0.35) * this.z;

    this.palette = ROSE_PALETTES[Math.floor(Math.random() * ROSE_PALETTES.length)];
    this.spriteIndex = Math.floor(Math.random() * 4);

    // Serene, realistic drifting aerodynamics
    this.rotationZ = Math.random() * Math.PI * 2;
    this.rotationY = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 0.014;
    this.flipSpeed = Math.random() * 0.022 + 0.012;
    this.speedY = (Math.random() * 0.28 + 0.42) * this.z; // gentle slow drift
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.swayFrequency = Math.random() * 0.01 + 0.006;
    this.swayPhase = Math.random() * Math.PI * 2;
  }

  update(canvasWidth: number, canvasHeight: number, time: number) {
    this.y += this.speedY;
    // Ambient gentle air sway
    this.x += this.speedX + Math.sin(time * 1.35 + this.swayPhase + this.y * this.swayFrequency) * (0.7 * this.z);
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
    const scaleX = Math.max(Math.abs(cosY), 0.08);
    ctx.scale(cosY >= 0 ? scaleX : -scaleX, 1);

    const w = this.size * this.aspectRatio * 1.7;
    const h = this.size * 1.7;

    if (isPetalSpritesLoaded && rosePetalSprites.length > 0) {
      // Draw genuine photographic plucked rose petal sprite
      const sprite = rosePetalSprites[this.spriteIndex % rosePetalSprites.length];
      if (sprite) {
        ctx.drawImage(sprite, -w / 2, -h / 2, w, h);
      }
    } else {
      // Authentic organic plucked rose petal curve (NO HEART SHAPE CLEFT):
      // Natural rounded convex apex, softly curled pedicel base
      ctx.beginPath();
      ctx.moveTo(0, h * 0.48);
      // Left contour: smooth natural petal curvature
      ctx.bezierCurveTo(-w * 0.65, h * 0.28, -w * 0.72, -h * 0.18, -w * 0.42, -h * 0.46);
      // Top apex: gentle convex rounded dome
      ctx.bezierCurveTo(-w * 0.22, -h * 0.56, w * 0.22, -h * 0.56, w * 0.42, -h * 0.46);
      // Right contour: smooth sweep back to base
      ctx.bezierCurveTo(w * 0.72, -h * 0.18, w * 0.65, h * 0.28, 0, h * 0.48);
      ctx.closePath();

      // Dimensional velvet gradient fill
      const grad = ctx.createRadialGradient(-w * 0.1, -h * 0.1, this.size * 0.1, 0, 0, this.size * 1.05);
      grad.addColorStop(0, this.palette.secondary);
      grad.addColorStop(0.7, this.palette.primary);
      grad.addColorStop(1, this.palette.rim);
      ctx.fillStyle = grad;
      ctx.fill();

      // Delicate organic petal margin highlight
      ctx.beginPath();
      ctx.moveTo(-w * 0.35, -h * 0.45);
      ctx.bezierCurveTo(-w * 0.15, -h * 0.54, w * 0.15, -h * 0.54, w * 0.35, -h * 0.45);
      ctx.strokeStyle = 'rgba(255, 230, 235, 0.3)';
      ctx.lineWidth = 0.75;
      ctx.stroke();
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
  readonly lang = inject(LanguageService);
  readonly weddingData = inject(WeddingDataService);
  readonly audioService = inject(AudioService);
  readonly uiState = inject(UiStateService);
  private smoothScroll = inject(SmoothScrollService);
  private platformId = inject(PLATFORM_ID);
  private el = inject(ElementRef);

  @ViewChild('petalCanvas') petalCanvasRef!: ElementRef<HTMLCanvasElement>;

  // Story Chapters Architecture (Bilingual)
  get storyChapters(): StoryChapter[] {
    const isHi = this.lang.isHindi();
    return [
      { id: 'hero', num: '01', roman: 'I', title: isHi ? 'मांगलिक गणेश वंदना' : 'Sacred Invocation', subtitle: isHi ? 'विघ्नहर्ता का आशीर्वाद' : 'Auspicious Blessings' },
      { id: 'couple', num: '02', roman: 'II', title: isHi ? 'वर एवं वधू' : 'The Couple', subtitle: isHi ? 'परिचय एवं दर्शन' : 'Groom & Bride' },
      { id: 'ceremonies', num: '03', roman: 'III', title: isHi ? 'मांगलिक कार्यक्रम' : 'Ceremonies', subtitle: isHi ? 'पावन उत्सव' : 'Sacred Celebrations' },
      { id: 'itinerary', num: '04', roman: 'IV', title: isHi ? 'समय-सारणी' : 'Itinerary', subtitle: isHi ? 'विवाह दिवस' : 'Wedding Day' },
      { id: 'blessings', num: '05', roman: 'V', title: isHi ? 'स्नेह व आशीर्वाद' : 'Blessings', subtitle: isHi ? 'शुभकामनाएं' : 'Heartfelt Wishes' }
    ];
  }

  readonly activeChapterIndex = signal<number>(0);
  readonly scrollProgressPercent = signal<number>(0);

  // Envelope Ceremony State
  readonly isEnvelopeModalOpen = computed(() => this.uiState.isEnvelopeOpen());
  readonly isEnvelopeOpened = signal<boolean>(false);
  readonly isEnvelopeClosing = signal<boolean>(false);
  readonly isEnvelopeFading = signal<boolean>(false);
  readonly isCardPulledOut = signal<boolean>(false);
  readonly cardDragDeltaY = signal<number>(0);

  // Physical Card Modal
  readonly isPhysicalCardOpen = computed(() => this.uiState.isPhysicalCardModalOpen());

  // Featured Illustrated Royal Portraits (Bilingual)
  get groomPortrait() {
    const isHi = this.lang.isHindi();
    return {
      src: 'assets/images/illustrated-groom-portrait.jpg',
      title: isHi ? 'अंशुल वर्मा' : 'Anshul Verma',
      subtitle: isHi ? 'वर · संस्कार, निष्ठा एवं सौम्यता' : 'The Royal Groom · Devotion & Honour'
    };
  }

  get bridePortrait() {
    const isHi = this.lang.isHindi();
    return {
      src: 'assets/images/illustrated-bride-portrait.jpg',
      title: isHi ? 'विदिशा सिंह' : 'Vidisha Singh',
      subtitle: isHi ? 'वधू · लालित्य, शालीनता एवं सनातन संस्कृति' : 'The Radiant Royal Bride · Grace & Tradition'
    };
  }

  get couplePortrait() {
    const isHi = this.lang.isHindi();
    return {
      src: 'assets/images/illustrated-couple-portrait.jpg',
      title: isHi ? 'अंशुल एवं विदिशा' : 'Anshul & Vidisha',
      subtitle: isHi ? 'वर-वधू · पवित्र परिणय सूत्र' : 'The Royal Couple · Sacred Nuptials'
    };
  }

  get ringCeremonyPhoto() {
    const isHi = this.lang.isHindi();
    return {
      src: 'assets/images/illustrated-ring-ceremony.jpg',
      title: isHi ? 'शुभ वाग्दान समारोह' : 'Sacred Ring Ceremony',
      subtitle: isHi ? 'जीवन भर साथ निभाने का पावन संकल्प' : 'An Auspicious Pledge of Eternal Companionship'
    };
  }

  readonly selectedPhoto = signal<{ src: string; title: string; subtitle: string } | null>(null);

  // 3D Flip Card States (Groom & Bride)
  readonly isGroomFlipped = signal<boolean>(false);
  readonly isBrideFlipped = signal<boolean>(false);

  // High-Performance Mobile Carousel (0 = Groom, 1 = Couple, 2 = Bride)
  readonly currentSlideIndex = signal<number>(1); // Default to The Couple
  readonly isCarouselPaused = signal<boolean>(false);
  readonly dragOffset = signal<number>(0);
  readonly isSwiping = signal<boolean>(false);
  private touchStartX = 0;
  private touchStartY = 0;
  private touchStartTime = 0;
  private touchIsHorizontal: boolean | null = null;
  private carouselAutoTimer: any = null;
  private pauseResumeTimeout: any = null;

  toggleGroomFlip(event?: Event) {
    if (event) event.stopPropagation();
    this.isGroomFlipped.update(v => !v);
    this.pauseCarouselTemporarily(7000);
  }

  toggleBrideFlip(event?: Event) {
    if (event) event.stopPropagation();
    this.isBrideFlipped.update(v => !v);
    this.pauseCarouselTemporarily(7000);
  }

  goToSlide(index: number, pause = true) {
    this.currentSlideIndex.set(index);
    this.dragOffset.set(0);
    if (pause) {
      this.pauseCarouselTemporarily(8000);
    }
  }

  nextSlide(pause = false) {
    this.currentSlideIndex.update(i => (i + 1) % 3);
    this.dragOffset.set(0);
    if (pause) {
      this.pauseCarouselTemporarily(8000);
    }
  }

  prevSlide(pause = true) {
    this.currentSlideIndex.update(i => (i - 1 + 3) % 3);
    this.dragOffset.set(0);
    if (pause) {
      this.pauseCarouselTemporarily(8000);
    }
  }

  getTrackTransform(): string {
    const basePercent = -this.currentSlideIndex() * 100;
    const offset = this.dragOffset();
    if (offset !== 0) {
      return `translate3d(calc(${basePercent}% + ${offset}px), 0, 0)`;
    }
    return `translate3d(${basePercent}%, 0, 0)`;
  }

  onTouchStart(e: TouchEvent) {
    if (e.touches.length !== 1) return;
    this.touchStartX = e.touches[0].clientX;
    this.touchStartY = e.touches[0].clientY;
    this.touchStartTime = Date.now();
    this.touchIsHorizontal = null;
    this.isSwiping.set(true);
    this.isCarouselPaused.set(true);
  }

  onTouchMove(e: TouchEvent) {
    if (!this.isSwiping() || e.touches.length !== 1) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - this.touchStartX;
    const deltaY = currentY - this.touchStartY;

    // Detect direction on initial movement
    if (this.touchIsHorizontal === null) {
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);
      if (absX > 6 || absY > 6) {
        this.touchIsHorizontal = absX > absY;
      }
    }

    // If vertical gesture, allow native page scroll
    if (this.touchIsHorizontal === false) {
      return;
    }

    // Horizontal swipe gesture: prevent vertical stutter & track finger smoothly
    if (e.cancelable) {
      e.preventDefault();
    }

    const currentIndex = this.currentSlideIndex();
    let effectiveOffset = deltaX;

    // Apply smooth rubber-band resistance at boundaries
    if ((currentIndex === 0 && deltaX > 0) || (currentIndex === 2 && deltaX < 0)) {
      effectiveOffset = deltaX * 0.35;
    }

    this.dragOffset.set(effectiveOffset);
  }

  onTouchEnd(e: TouchEvent) {
    if (!this.isSwiping()) return;
    this.isSwiping.set(false);

    const deltaX = this.dragOffset();
    const duration = Date.now() - this.touchStartTime;
    const velocity = Math.abs(deltaX) / Math.max(1, duration); // px per ms

    this.dragOffset.set(0);

    // Dynamic threshold: flick gesture or distance threshold
    const isFlick = velocity > 0.35 && Math.abs(deltaX) > 20;
    const isDragPassed = Math.abs(deltaX) > 42;

    if (isFlick || isDragPassed) {
      if (deltaX < 0) {
        this.nextSlide(true);
      } else {
        this.prevSlide(true);
      }
    }

    this.pauseCarouselTemporarily(7000);
  }

  pauseCarousel() {
    this.isCarouselPaused.set(true);
  }

  resumeCarousel() {
    this.isCarouselPaused.set(false);
  }

  private pauseCarouselTemporarily(ms: number) {
    this.isCarouselPaused.set(true);
    if (this.pauseResumeTimeout) clearTimeout(this.pauseResumeTimeout);
    this.pauseResumeTimeout = setTimeout(() => {
      this.isCarouselPaused.set(false);
    }, ms);
  }

  initCoupleCarousel() {
    if (!isPlatformBrowser(this.platformId)) return;
    // Auto-advance carousel smoothly every 4.5 seconds on mobile
    this.carouselAutoTimer = setInterval(() => {
      if (window.innerWidth <= 900 && !this.isCarouselPaused()) {
        this.nextSlide(false);
      }
    }, 4500);
  }

  openPhotoLightbox(photo: { src: string; title: string; subtitle: string }) {
    this.selectedPhoto.set(photo);
  }

  closePhotoLightbox() {
    this.selectedPhoto.set(null);
  }



  readonly copiedToast = signal<string | null>(null);

  // Active Ceremony Tab
  readonly activeCeremonyIndex = signal<number>(2); // Default to Wedding
  readonly currentCeremony = computed<WeddingCeremony>(() => this.weddingData.ceremonies[this.activeCeremonyIndex()]);

  // Countdown State
  readonly countdown = signal<CountdownState>({ days: '00', hours: '00', minutes: '00', seconds: '00' });
  readonly isWeddingDayOrPast = signal<boolean>(false);
  private countdownTimer: any = null;

  // Guest Helplines (Direct Tap-to-Call, Minimal 1-Row Layout)
  readonly guestHelplines = [
    { phone: '+91 85429 59229', telLink: 'tel:+918542959229' },
    { phone: '+91 99196 47849', telLink: 'tel:+919919647849' },
    { phone: '+91 94534 54548', telLink: 'tel:+919453454548' }
  ];

  // Floating Botanical Canvas State (Petals, Leaves & Gold Dust)
  private petalCtx: CanvasRenderingContext2D | null = null;
  private botanicalParticles: BotanicalParticle[] = [];
  private petalAnimFrame: number | null = null;
  private lastFrameTime = 0;
  private petalTime = 0;

  // Observer
  private observer: IntersectionObserver | null = null;

  constructor() {
    this.uiState.reopenEnvelope();
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) return;

      this.smoothScroll.scrollToTop(true);
      this.startCountdown();
      this.initFloatingPetals();
      this.initScrollReveals();
      this.initCoupleCarousel();
    });
  }

  ngOnDestroy() {
    if (this.countdownTimer) clearInterval(this.countdownTimer);
    if (this.petalAnimFrame) cancelAnimationFrame(this.petalAnimFrame);
    if (this.observer) this.observer.disconnect();
    if (this.carouselAutoTimer) clearInterval(this.carouselAutoTimer);
    if (this.pauseResumeTimeout) clearTimeout(this.pauseResumeTimeout);
    if (this.envelopeAutoDismissTimer) clearTimeout(this.envelopeAutoDismissTimer);
  }

  // =========================================================================
  // 1. ROYAL ENVELOPE OPENING CEREMONY (120 FPS FLUID MOTION)
  // =========================================================================
  private envelopeAutoDismissTimer: any = null;

  breakRoyalSeal(event: MouseEvent) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (this.isEnvelopeOpened()) return;
    this.audioService.playSacredChime(587.33, 1.4, 0.12);
    this.audioService.play();
    this.showerCelebratoryPetals();
    this.isCardPulledOut.set(false);
    this.isEnvelopeOpened.set(true);

    // Auto-advance after 4.0s if guest simply watches (or tap immediately)
    if (this.envelopeAutoDismissTimer) clearTimeout(this.envelopeAutoDismissTimer);
    this.envelopeAutoDismissTimer = setTimeout(() => {
      this.pullOutCard();
    }, 12000);
  }

  pullOutCard(event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (this.isCardPulledOut()) return;
    if (this.envelopeAutoDismissTimer) {
      clearTimeout(this.envelopeAutoDismissTimer);
      this.envelopeAutoDismissTimer = null;
    }
    this.isCardPulledOut.set(true);
    this.audioService.playSacredChime(659.25, 1.2, 0.15);
    this.audioService.play();
    this.showerCelebratoryPetals();

    setTimeout(() => {
      this.isEnvelopeClosing.set(true);
      setTimeout(() => {
        this.isEnvelopeFading.set(true);
        setTimeout(() => {
          this.dismissEnvelope();
        }, 380);
      }, 300);
    }, 550);
  }

  private cardTouchStartY = 0;

  onCardTouchStart(e: TouchEvent) {
    if (!this.isEnvelopeOpened() || this.isCardPulledOut()) return;
    if (e.touches.length !== 1) return;
    this.cardTouchStartY = e.touches[0].clientY;
  }

  onCardTouchMove(e: TouchEvent) {
    if (!this.isEnvelopeOpened() || this.isCardPulledOut()) return;
    if (e.touches.length !== 1) return;
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - this.cardTouchStartY;
    if (deltaY < 0) {
      this.cardDragDeltaY.set(Math.max(-120, deltaY));
    }
  }

  onCardTouchEnd(e: TouchEvent) {
    if (!this.isEnvelopeOpened() || this.isCardPulledOut()) return;
    const deltaY = this.cardDragDeltaY();
    this.cardDragDeltaY.set(0);
    if (deltaY < -35) {
      this.pullOutCard(e);
    }
  }

  getCardTransform(): string {
    if (this.isCardPulledOut()) {
      return 'translate3d(0, -128%, 0) scale(1.02)';
    }
    const dragY = this.cardDragDeltaY();
    if (this.isEnvelopeOpened()) {
      const isMobile = typeof window !== 'undefined' && window.innerWidth <= 640;
      const basePercent = isMobile ? -45 : -52;
      if (dragY !== 0) {
        return `translate3d(0, calc(${basePercent}% + ${dragY}px), 0)`;
      }
      return `translate3d(0, ${basePercent}%, 0)`;
    }
    return 'translate3d(0, 0, 0)';
  }

  dismissEnvelope() {
    if (this.envelopeAutoDismissTimer) {
      clearTimeout(this.envelopeAutoDismissTimer);
      this.envelopeAutoDismissTimer = null;
    }
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
        this.isWeddingDayOrPast.set(false);
        this.countdown.set({
          days: String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, '0'),
          hours: String(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0'),
          minutes: String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0'),
          seconds: String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0')
        });
      } else {
        // When countdown reaches zero: Auspicious celebration state activates
        this.isWeddingDayOrPast.set(true);
        this.countdown.set({ days: '00', hours: '00', minutes: '00', seconds: '00' });
        if (this.countdownTimer) {
          clearInterval(this.countdownTimer);
          this.countdownTimer = null;
        }
      }
    };

    update();
    this.countdownTimer = setInterval(update, 1000);
  }

  // =========================================================================
  // 3. MINIMAL FLOATING REAL ROSE PETALS (Sacred & Ambient, Non-Intrusive)
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

    // Spawn minimal, very sparse canopy of authentic plucked rose petals
    const w = window.innerWidth;
    const h = window.innerHeight;
    const isMobile = w < 768;
    const petalCount = isMobile ? 10 : 16;
    this.botanicalParticles = [];
    for (let i = 0; i < petalCount; i++) {
      this.botanicalParticles.push(new BotanicalParticle(w, h));
    }

    // Load and extract genuine photographic plucked rose petal sprites
    this.loadRealRosePetalSprites();

    window.addEventListener('resize', () => {
      updateSize();
    });

    this.lastFrameTime = performance.now();
    this.animatePetals();
  }

  private loadRealRosePetalSprites() {
    if (!isPlatformBrowser(this.platformId)) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = 'assets/images/real-rose-petals.jpg';
    img.onload = () => {
      // 4 distinct crops of genuine plucked rose petals
      const petalCrops = [
        { x: 235, y: 340, w: 250, h: 220 }, // Center-left petal
        { x: 505, y: 340, w: 255, h: 220 }, // Center-right petal
        { x: 240, y: 110, w: 240, h: 200 }, // Upper-left curved petal
        { x: 550, y: 145, w: 230, h: 190 }  // Upper-right soft petal
      ];

      rosePetalSprites = petalCrops.map(crop => {
        const offCanvas = document.createElement('canvas');
        const targetSize = 100;
        offCanvas.width = targetSize;
        offCanvas.height = targetSize;
        const ctx = offCanvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return offCanvas;

        ctx.drawImage(img, crop.x, crop.y, crop.w, crop.h, 0, 0, targetSize, targetSize);
        const imgData = ctx.getImageData(0, 0, targetSize, targetSize);
        const data = imgData.data;

        // Clean white studio background to transparent PNG sprite
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          if (r > 240 && g > 240 && b > 240) {
            data[i + 3] = 0;
          } else if (r > 218 && g > 218 && b > 218) {
            const brightness = Math.min(r, g, b);
            data[i + 3] = Math.max(0, Math.min(255, Math.round(255 * (1 - (brightness - 218) / 24))));
          }
        }
        ctx.putImageData(imgData, 0, 0);
        return offCanvas;
      });

      isPetalSpritesLoaded = true;

      // Distribute sprites across existing particles
      for (let i = 0; i < this.botanicalParticles.length; i++) {
        this.botanicalParticles[i].spriteIndex = i % rosePetalSprites.length;
      }
    };
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
