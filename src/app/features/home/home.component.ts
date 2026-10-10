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

class FloatingPetal {
  x: number;
  y: number;
  size: number;
  opacity: number;
  rotation: number;
  speedY: number;
  speedX: number;
  rotSpeed: number;
  color: string;

  constructor(canvasWidth: number, canvasHeight: number, startAtTop: boolean = false) {
    this.x = Math.random() * canvasWidth;
    this.y = startAtTop ? (Math.random() * -100) : (Math.random() * canvasHeight - canvasHeight);
    this.size = Math.random() * 11 + 6;
    this.opacity = Math.random() * 0.35 + 0.15;
    this.rotation = Math.random() * Math.PI * 2;
    this.speedY = Math.random() * 0.55 + 0.25;
    this.speedX = (Math.random() - 0.5) * 0.35;
    this.rotSpeed = (Math.random() - 0.5) * 0.018;
    const colors = ['#E8B4B8', '#F2D1D4', '#F5DFE1', '#D4AF37', '#C5A059', '#E6C280'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  update(canvasWidth: number, canvasHeight: number, time: number) {
    this.y += this.speedY;
    this.x += this.speedX + Math.sin(time * 0.4 + this.y * 0.008) * 0.25;
    this.rotation += this.rotSpeed;

    if (this.y > canvasHeight + 20) {
      this.y = -20;
      this.x = Math.random() * canvasWidth;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(0, -this.size / 2);
    ctx.bezierCurveTo(this.size / 2, -this.size / 2, this.size / 2, this.size / 2, 0, this.size / 2);
    ctx.bezierCurveTo(-this.size / 2, this.size / 2, -this.size / 2, -this.size / 2, 0, -this.size / 2);
    ctx.fill();
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

  openPhotoLightbox(photo: { src: string; title: string; subtitle: string }) {
    this.selectedPhoto.set(photo);
  }

  closePhotoLightbox() {
    this.selectedPhoto.set(null);
  }

  // Program Tab ('timeline' | 'rituals')
  readonly activeProgramTab = signal<'timeline' | 'rituals'>('timeline');

  // Interactive Guest Blessing Form
  newWishName = '';
  newWishRelation = '';
  newWishMessage = '';
  readonly wishSubmitted = signal<boolean>(false);
  readonly copiedToast = signal<string | null>(null);

  // WhatsApp RSVP State
  rsvpName = '';
  rsvpAttendance = 'All Ceremonies (Lucknow & Prayagraj)';
  rsvpGuests = '2';
  rsvpNote = '';
  readonly rsvpConfirmed = signal<boolean>(false);

  // Active Ceremony Tab
  readonly activeCeremonyIndex = signal<number>(2); // Default to Wedding
  readonly currentCeremony = computed<WeddingCeremony>(() => this.weddingData.ceremonies[this.activeCeremonyIndex()]);

  // Countdown State
  readonly countdown = signal<CountdownState>({ days: '00', hours: '00', minutes: '00', seconds: '00' });
  private countdownTimer: any = null;

  // Floating Petals Canvas State
  private petalCtx: CanvasRenderingContext2D | null = null;
  private floatingPetals: FloatingPetal[] = [];
  private petalAnimFrame: number | null = null;
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
  // 1. ROYAL ENVELOPE OPENING CEREMONY
  // =========================================================================
  breakRoyalSeal(event: MouseEvent) {
    this.audioService.play();
    this.isEnvelopeOpened.set(true);

    setTimeout(() => {
      this.isEnvelopeClosing.set(true);
      setTimeout(() => {
        this.isEnvelopeFading.set(true);
        this.uiState.closeEnvelope();
      }, 450);
    }, 700);
  }

  dismissEnvelope() {
    this.audioService.play();
    this.isEnvelopeClosing.set(true);
    this.isEnvelopeFading.set(true);
    this.uiState.closeEnvelope();
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
  // 3. FLOATING ROSE PETALS CANVAS (Minimal, Smooth Ambient Rain)
  // =========================================================================
  private initFloatingPetals() {
    if (!this.petalCanvasRef) return;
    const canvas = this.petalCanvasRef.nativeElement;
    this.petalCtx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    for (let i = 0; i < 22; i++) {
      this.floatingPetals.push(new FloatingPetal(canvas.width, canvas.height));
    }

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    this.animatePetals();
  }

  private animatePetals() {
    if (!this.petalCtx || !this.petalCanvasRef) return;
    const canvas = this.petalCanvasRef.nativeElement;
    this.petalCtx.clearRect(0, 0, canvas.width, canvas.height);
    this.petalTime += 0.016;

    for (const petal of this.floatingPetals) {
      petal.update(canvas.width, canvas.height, this.petalTime);
      petal.draw(this.petalCtx);
    }

    this.petalAnimFrame = requestAnimationFrame(() => this.animatePetals());
  }

  showerCelebratoryPetals() {
    if (!this.petalCanvasRef) return;
    const canvas = this.petalCanvasRef.nativeElement;
    for (let i = 0; i < 24; i++) {
      this.floatingPetals.push(new FloatingPetal(canvas.width, canvas.height, true));
    }
    // Trim if too many
    if (this.floatingPetals.length > 55) {
      this.floatingPetals.splice(0, 20);
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
  // 6. GUEST BLESSING SUBMISSION
  // =========================================================================
  submitBlessing() {
    if (!this.newWishName.trim() || !this.newWishMessage.trim()) return;

    this.weddingData.addGuestWish(
      this.newWishName,
      this.newWishRelation || 'Well Wisher',
      this.newWishMessage
    );

    this.newWishName = '';
    this.newWishRelation = '';
    this.newWishMessage = '';
    this.wishSubmitted.set(true);

    // Play subtle chime & trigger petal shower
    this.audioService.playSacredChime(523.25, 1.5, 0.1);
    this.showerCelebratoryPetals();

    setTimeout(() => {
      this.wishSubmitted.set(false);
    }, 4500);
  }

  // =========================================================================
  // 7. COPY ADDRESS HELPER
  // =========================================================================
  copyAddress(text: string, label: string) {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      this.copiedToast.set(`${label} copied to clipboard! ✓`);
      setTimeout(() => this.copiedToast.set(null), 2800);
    }
  }

  // =========================================================================
  // 8. WHATSAPP RSVP & INVITATION SHARING
  // =========================================================================
  sendWhatsAppRsvp() {
    const url = this.weddingData.generateWhatsAppRsvpUrl(
      this.rsvpName,
      this.rsvpAttendance,
      this.rsvpGuests,
      this.rsvpNote
    );
    this.audioService.playSacredChime(523.25, 1.2, 0.1);
    this.showerCelebratoryPetals();
    this.rsvpConfirmed.set(true);
    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    }
  }

  shareOnWhatsApp() {
    const url = this.weddingData.generateWhatsAppShareUrl();
    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
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
