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
  HostListener,
  effect
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { WeddingDataService, WeddingCeremony } from '../../core/services/wedding-data.service';
import { AudioService } from '../../core/services/audio.service';
import { UiStateService } from '../../core/services/ui-state.service';
import { SmoothScrollService } from '../../core/services/smooth-scroll.service';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

declare const THREE: any;

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

  constructor(canvasWidth: number, canvasHeight: number) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight - canvasHeight;
    this.size = Math.random() * 12 + 6;
    this.opacity = Math.random() * 0.4 + 0.15;
    this.rotation = Math.random() * Math.PI * 2;
    this.speedY = Math.random() * 0.6 + 0.2;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.rotSpeed = (Math.random() - 0.5) * 0.02;
    const colors = ['#E8B4B8', '#F2D1D4', '#F5DFE1', '#D4AF37', '#C5A059'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  update(canvasWidth: number, canvasHeight: number, time: number) {
    this.y += this.speedY;
    this.x += this.speedX + Math.sin(time * 0.5 + this.y * 0.01) * 0.3;
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
    // Petal shape
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
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnDestroy {
  weddingData = inject(WeddingDataService);
  audioService = inject(AudioService);
  uiState = inject(UiStateService);
  private smoothScroll = inject(SmoothScrollService);
  private platformId = inject(PLATFORM_ID);
  private el = inject(ElementRef);

  @ViewChild('petalCanvas') petalCanvasRef!: ElementRef<HTMLCanvasElement>;

  // Story Chapters Architecture
  readonly storyChapters: StoryChapter[] = [
    { id: 'hero', num: '01', roman: 'I', title: 'Sacred Invocation', subtitle: 'Auspicious Blessings' },
    { id: 'couple', num: '02', roman: 'II', title: 'The Couple', subtitle: 'Groom & Bride' },
    { id: 'ceremonies', num: '03', roman: 'III', title: 'Ceremonies', subtitle: 'Sacred Celebrations' },
    { id: 'venues', num: '04', roman: 'IV', title: 'Venues', subtitle: 'Sacred Locations' },
    { id: 'blessing', num: '05', roman: 'V', title: 'Blessings', subtitle: 'Family Honour' }
  ];

  readonly activeChapterIndex = signal<number>(0);
  readonly scrollProgressPercent = signal<number>(0);

  // Envelope Ceremony State
  readonly isEnvelopeModalOpen = computed(() => this.uiState.isEnvelopeOpen());
  readonly isEnvelopeOpened = signal<boolean>(false);
  readonly isEnvelopeClosing = signal<boolean>(false);
  readonly isEnvelopeFading = signal<boolean>(false);

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

  // Scroll & Observer
  private scrollTriggers: any[] = [];
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
    this.scrollTriggers.forEach(st => st.kill?.());
    if (this.observer) this.observer.disconnect();
  }

  // =========================================================================
  // 1. ROYAL ENVELOPE OPENING CEREMONY
  // =========================================================================
  breakRoyalSeal(event: MouseEvent) {
    // Play ambient wedding music
    this.audioService.play();

    // Unfold & smoothly transition
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
  // 3. FLOATING ROSE PETALS CANVAS
  // =========================================================================
  private initFloatingPetals() {
    if (!this.petalCanvasRef) return;
    const canvas = this.petalCanvasRef.nativeElement;
    this.petalCtx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create petals
    for (let i = 0; i < 25; i++) {
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

  // =========================================================================
  // 4. CEREMONY TAB SELECTOR & CALENDAR
  // =========================================================================
  selectCeremony(idx: number) {
    this.activeCeremonyIndex.set(idx);
    this.audioService.playSacredChime(392.00, 1.2, 0.08);
  }

  downloadCalendar(ceremony?: WeddingCeremony) {
    this.weddingData.downloadCalendarIcs(ceremony || this.currentCeremony());
  }

  // =========================================================================
  // 5. 3D GYROSCOPE SPECULAR TILT CARD
  // =========================================================================
  onCardMouseMove(event: MouseEvent, card: HTMLElement) {
    const bounds = card.getBoundingClientRect();
    const mouseX = event.clientX - bounds.left;
    const mouseY = event.clientY - bounds.top;

    const centerX = bounds.width / 2;
    const centerY = bounds.height / 2;

    const rotateX = ((mouseY - centerY) / centerY) * -5;
    const rotateY = ((mouseX - centerX) / centerX) * 5;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
  }

  onCardMouseLeave(card: HTMLElement) {
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  }

  // =========================================================================
  // 6. SCROLL REVEALS & STORY CHAPTERS OBSERVER
  // =========================================================================
  @HostListener('window:scroll')
  onWindowScroll() {
    if (typeof window === 'undefined') return;

    // 1. Calculate scroll progress %
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
    this.scrollProgressPercent.set(Math.min(100, Math.max(0, progress)));

    // 2. Detect active chapter based on section scroll positions
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
    }, { threshold: 0.12 });

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
