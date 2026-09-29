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
import { FormsModule } from '@angular/forms';
import { 
  WeddingDataService, 
  RoyalEvent, 
  RoyalGalleryItem, 
  RoyalRsvpSubmission 
} from '../../core/services/wedding-data.service';
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

class EmberParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  gravity: number;
  color: string;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 12 + 4;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.size = Math.random() * 5 + 2;
    this.opacity = 1;
    this.gravity = 0.22;
    const colors = ['#ffffff', '#f6d56d', '#d4af37', '#e11d48', '#fff3c4'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.opacity -= 0.016;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = Math.max(this.opacity, 0);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
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
  weddingData = inject(WeddingDataService);
  audioService = inject(AudioService);
  uiState = inject(UiStateService);
  private smoothScroll = inject(SmoothScrollService);
  private platformId = inject(PLATFORM_ID);
  private el = inject(ElementRef);

  @ViewChild('threeContainer') threeContainerRef!: ElementRef<HTMLDivElement>;
  @ViewChild('fxCanvas') fxCanvasRef!: ElementRef<HTMLCanvasElement>;

  // Story Chapters Architecture (500 Years Experience Storybook Scroll)
  readonly storyChapters: StoryChapter[] = [
    { id: 'ceremony', num: '01', roman: 'I', title: 'The Sacred Inception', subtitle: 'Auspicious Muhurat & Invocation' },
    { id: 'itinerary', num: '02', roman: 'II', title: 'Four Days of Joy', subtitle: 'Festivities & Royal Celebrations' },
    { id: 'couple', num: '03', roman: 'III', title: 'Written in the Stars', subtitle: 'Eternal Love & Ancestral Legacy' },
    { id: 'moments', num: '04', roman: 'IV', title: 'Captured Splendor', subtitle: 'Memories of Royal Grace' },
    { id: 'venue', num: '05', roman: 'V', title: 'The Palace Realm', subtitle: 'Historic Heritage & Twilight' },
    { id: 'rsvp', num: '06', roman: 'VI', title: 'Seal of Attendance', subtitle: 'Confirm Royal Presence' }
  ];

  readonly activeChapterIndex = signal<number>(0);
  readonly currentChapter = computed(() => this.storyChapters[this.activeChapterIndex()]);
  readonly scrollProgressPercent = signal<number>(0);

  // Envelope Ceremony State
  readonly isEnvelopeModalOpen = computed(() => this.uiState.isEnvelopeOpen());
  readonly isEnvelopeOpened = signal<boolean>(false);
  readonly isEnvelopeClosing = signal<boolean>(false);
  readonly isEnvelopeFading = signal<boolean>(false);

  // Itinerary Active Tab
  readonly activeEventIndex = signal<number>(0);
  readonly currentEvent = computed<RoyalEvent>(() => this.weddingData.events[this.activeEventIndex()]);
  readonly activeEvent = computed<RoyalEvent>(() => this.currentEvent());

  // Venue Atmosphere
  readonly venueMode = signal<'day' | 'dusk' | 'night'>('dusk');
  readonly currentVenueImage = computed(() => this.weddingData.venue.modes[this.venueMode()].image);
  readonly currentVenueFilter = computed(() => this.weddingData.venue.modes[this.venueMode()].filter);

  // Gallery Lightbox
  readonly activeLightboxItem = signal<RoyalGalleryItem | null>(null);

  // RSVP Form State
  rsvpName = '';
  rsvpPhone = '';
  rsvpEmail = '';
  rsvpAttendance: 'attending' | 'declined' = 'attending';
  rsvpGuestCount = 2;
  rsvpCuisine = 'royal-veg';
  rsvpWishes = '';
  readonly lastSubmittedRsvp = signal<RoyalRsvpSubmission | null>(null);
  readonly isConfirmationModalOpen = signal<boolean>(false);

  // Countdown State
  readonly countdown = signal<CountdownState>({ days: '00', hours: '00', minutes: '00', seconds: '00' });
  private countdownTimer: any = null;

  // WebGL & Canvas State
  private threeScene: any = null;
  private threeCamera: any = null;
  private threeRenderer: any = null;
  private morphParticles: any = null;
  private petalMeshGroup: any = null;
  private animFrameId: number | null = null;
  private clock: any = null;
  private readonly particleTotal = 450;
  private readonly petalTotal = 45;
  private shapeTargets: { mandala: number[]; yantra: number[]; morpankh: number[] } = {
    mandala: [],
    yantra: [],
    morpankh: []
  };

  // FX Canvas State
  private fxCtx: CanvasRenderingContext2D | null = null;
  private emberParticles: EmberParticle[] = [];
  private fxRunning = false;
  private scrollTriggers: any[] = [];
  private observer: IntersectionObserver | null = null;

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) return;

      this.startCountdown();
      this.initFxCanvas();
      this.initThreeWebGL();
      this.initScrollReveals();

      // Listen to geometry morph from UiState
      effect(() => {
        const shapeIdx = this.uiState.geometryShapeIndex();
        // Trigger subtle chime on geometry morph
        if (shapeIdx > 0) {
          this.audioService.playSacredChime(329.63, 1.4, 0.08);
        }
      });
    });
  }

  ngOnDestroy() {
    if (this.countdownTimer) clearInterval(this.countdownTimer);
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    this.scrollTriggers.forEach(st => st.kill?.());
    if (this.observer) this.observer.disconnect();
    if (this.threeRenderer) {
      try {
        this.threeRenderer.dispose();
      } catch {}
    }
  }

  // =========================================================================
  // 1. ROYAL ENVELOPE OPENING CEREMONY
  // =========================================================================
  breakRoyalSeal(event: MouseEvent) {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Play Song #3 Hollywood Grand Symphony
    this.audioService.play();

    // Trigger golden ember shockwave
    this.triggerEmberExplosion(centerX, centerY);

    // Unfold & smoothly transition immediately (Zero Lag)
    this.isEnvelopeOpened.set(true);
    this.isEnvelopeClosing.set(true);

    setTimeout(() => {
      this.isEnvelopeFading.set(true);
      this.uiState.closeEnvelope();
    }, 380);
  }

  dismissEnvelope() {
    this.audioService.play();
    this.isEnvelopeClosing.set(true);
    this.isEnvelopeFading.set(true);
    this.uiState.closeEnvelope();
  }

  // =========================================================================
  // 2. LIVE COUNTDOWN TIMER (Auspicious Phere Muhurat)
  // =========================================================================
  private startCountdown() {
    const weddingDate = new Date("December 13, 2026 18:30:00").getTime();

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
  // 3. THREE.JS 3D WEBGL PARTICLE UNIVERSE & ROSE PETALS
  // =========================================================================
  private initThreeWebGL() {
    if (typeof THREE === 'undefined' || !this.threeContainerRef) return;

    try {
      const container = this.threeContainerRef.nativeElement;
      this.threeScene = new THREE.Scene();
      this.threeCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
      this.threeCamera.position.z = 280;

      this.threeRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      this.threeRenderer.setSize(window.innerWidth, window.innerHeight);
      this.threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(this.threeRenderer.domElement);

      // Pre-compute Morph Targets
      for (let i = 0; i < this.particleTotal; i++) {
        // 1. Sacred Lotus Mandala
        const angle = (i / this.particleTotal) * Math.PI * 2 * 6;
        const radius = 60 + Math.sin(angle * 4) * 35 + (i % 50) * 1.5;
        this.shapeTargets.mandala.push(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius,
          (Math.sin(angle * 2) * 30) - 20
        );

        // 2. Sri Yantra Diamond Polyhedra
        const t = (i / this.particleTotal);
        const yCoord = (t - 0.5) * 260;
        const width = (1 - Math.abs(t - 0.5) * 2) * 130;
        const sideAngle = (i % 6) * (Math.PI / 3);
        this.shapeTargets.yantra.push(
          Math.cos(sideAngle) * width,
          yCoord,
          Math.sin(sideAngle) * width
        );

        // 3. Morpankh Peacock Fan Curve
        const u = (i / this.particleTotal) * Math.PI;
        const fanRadius = 150 * Math.sin(u);
        this.shapeTargets.morpankh.push(
          Math.cos(u * 2) * fanRadius,
          Math.sin(u) * 120 - 40,
          Math.cos(u) * 40
        );
      }

      // Golden Particle Texture
      const pCanvas = document.createElement('canvas');
      pCanvas.width = 32;
      pCanvas.height = 32;
      const pCtx = pCanvas.getContext('2d');
      if (pCtx) {
        const grad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.3, '#f6d56d');
        grad.addColorStop(0.8, '#d4af37');
        grad.addColorStop(1, 'rgba(212, 175, 55, 0)');
        pCtx.fillStyle = grad;
        pCtx.fillRect(0, 0, 32, 32);
      }

      const particleGeo = new THREE.BufferGeometry();
      const posArray = new Float32Array(this.particleTotal * 3);
      for (let i = 0; i < this.particleTotal * 3; i++) {
        posArray[i] = this.shapeTargets.mandala[i];
      }
      particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

      const particleMat = new THREE.PointsMaterial({
        size: 5.5,
        map: new THREE.CanvasTexture(pCanvas),
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      this.morphParticles = new THREE.Points(particleGeo, particleMat);
      this.threeScene.add(this.morphParticles);

      // Tumbling 3D Rose Petals
      this.petalMeshGroup = new THREE.Group();
      const petalCanvas = document.createElement('canvas');
      petalCanvas.width = 32;
      petalCanvas.height = 32;
      const petCtx = petalCanvas.getContext('2d');
      if (petCtx) {
        petCtx.fillStyle = '#8f0e1f';
        petCtx.beginPath();
        petCtx.ellipse(16, 16, 13, 8, Math.PI / 4, 0, Math.PI * 2);
        petCtx.fill();
      }

      const petalTexture = new THREE.CanvasTexture(petalCanvas);
      const petalMat = new THREE.MeshBasicMaterial({
        map: petalTexture,
        transparent: true,
        side: THREE.DoubleSide
      });
      const petalPlane = new THREE.PlaneGeometry(8, 12);

      for (let i = 0; i < this.petalTotal; i++) {
        const mesh = new THREE.Mesh(petalPlane, petalMat);
        mesh.position.set(
          (Math.random() - 0.5) * 450,
          Math.random() * 400 - 200,
          (Math.random() - 0.5) * 200
        );
        mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        mesh.userData = {
          speedY: 0.4 + Math.random() * 0.6,
          swaySpeed: 0.015 + Math.random() * 0.02,
          rotSpeed: 0.01 + Math.random() * 0.02
        };
        this.petalMeshGroup.add(mesh);
      }
      this.threeScene.add(this.petalMeshGroup);

      this.clock = new THREE.Clock();

      const animateWebGL = () => {
        this.animFrameId = requestAnimationFrame(animateWebGL);
        const time = this.clock.getElapsedTime();

        // Continuous Geometry Morphing
        if (this.morphParticles) {
          const positions = this.morphParticles.geometry.attributes.position.array;
          const currentShape = this.uiState.geometryShapeIndex();
          let targetArray = this.shapeTargets.mandala;
          if (currentShape === 1) targetArray = this.shapeTargets.yantra;
          if (currentShape === 2) targetArray = this.shapeTargets.morpankh;

          for (let i = 0; i < positions.length; i++) {
            positions[i] += (targetArray[i] - positions[i]) * 0.04;
          }
          this.morphParticles.geometry.attributes.position.needsUpdate = true;
          this.morphParticles.rotation.y = time * 0.05;
          this.morphParticles.rotation.z = Math.sin(time * 0.1) * 0.08;
        }

        // Tumbling Rose Petals
        if (this.petalMeshGroup) {
          this.petalMeshGroup.children.forEach((petal: any) => {
            petal.position.y -= petal.userData.speedY;
            petal.position.x += Math.sin(time + petal.position.y * 0.02) * 0.3;
            petal.rotation.x += petal.userData.rotSpeed;
            petal.rotation.y += petal.userData.rotSpeed;

            if (petal.position.y < -220) {
              petal.position.y = 220;
              petal.position.x = (Math.random() - 0.5) * 450;
            }
          });
        }

        this.threeRenderer.render(this.threeScene, this.threeCamera);
      };

      animateWebGL();

      window.addEventListener('resize', () => {
        if (!this.threeCamera || !this.threeRenderer) return;
        this.threeCamera.aspect = window.innerWidth / window.innerHeight;
        this.threeCamera.updateProjectionMatrix();
        this.threeRenderer.setSize(window.innerWidth, window.innerHeight);
      });
    } catch (e) {
      console.warn('WebGL init error', e);
    }
  }

  // =========================================================================
  // 4. FULLSCREEN CANVAS EMBER SHOCKWAVE SYSTEM
  // =========================================================================
  private initFxCanvas() {
    if (!this.fxCanvasRef) return;
    const canvas = this.fxCanvasRef.nativeElement;
    this.fxCtx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }

  triggerEmberExplosion(x: number, y: number) {
    if (!this.fxCtx) return;
    this.emberParticles = [];
    this.fxRunning = true;
    for (let i = 0; i < 90; i++) {
      this.emberParticles.push(new EmberParticle(x, y));
    }
    this.renderEmbers();
  }

  private renderEmbers() {
    if (!this.fxRunning || !this.fxCtx) return;
    const canvas = this.fxCanvasRef.nativeElement;
    this.fxCtx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = this.emberParticles.length - 1; i >= 0; i--) {
      const p = this.emberParticles[i];
      p.update();
      p.draw(this.fxCtx);
      if (p.opacity <= 0) {
        this.emberParticles.splice(i, 1);
      }
    }

    if (this.emberParticles.length > 0) {
      requestAnimationFrame(() => this.renderEmbers());
    } else {
      this.fxRunning = false;
      this.fxCtx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  // =========================================================================
  // 5. ITINERARY & CALENDAR SYNC
  // =========================================================================
  selectEvent(idx: number) {
    this.activeEventIndex.set(idx);
    this.audioService.playSacredChime(392.00, 1.2, 0.08);
  }

  downloadCalendar() {
    this.weddingData.downloadCalendarIcs(this.currentEvent());
  }

  // =========================================================================
  // 6. 3D GYROSCOPE SPECULAR TILT CARD
  // =========================================================================
  onCardMouseMove(event: MouseEvent, card: HTMLElement) {
    const bounds = card.getBoundingClientRect();
    const mouseX = event.clientX - bounds.left;
    const mouseY = event.clientY - bounds.top;

    const centerX = bounds.width / 2;
    const centerY = bounds.height / 2;

    const rotateX = ((mouseY - centerY) / centerY) * -7;
    const rotateY = ((mouseX - centerX) / centerX) * 7;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
    card.style.setProperty('--mouse-x', `${mouseX}px`);
    card.style.setProperty('--mouse-y', `${mouseY}px`);
  }

  onCardMouseLeave(card: HTMLElement) {
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  }

  // =========================================================================
  // 7. VENUE ATMOSPHERE SELECTOR
  // =========================================================================
  setVenueMode(mode: 'day' | 'dusk' | 'night') {
    this.venueMode.set(mode);
    this.audioService.playSacredChime(440.00, 1.0, 0.06);
  }

  // =========================================================================
  // 8. UNIVERSAL RSVP WITH WAX STAMP SUBMISSION
  // =========================================================================
  executeWaxStampRSVP() {
    if (!this.rsvpName.trim() || !this.rsvpPhone.trim()) return;

    const submission: RoyalRsvpSubmission = {
      name: this.rsvpName.trim(),
      phone: this.rsvpPhone.trim(),
      email: this.rsvpEmail.trim() || undefined,
      attendance: this.rsvpAttendance,
      guestsCount: this.rsvpGuestCount,
      cuisine: this.rsvpCuisine,
      wishes: this.rsvpWishes.trim() || undefined,
      createdAt: new Date().toISOString()
    };

    this.weddingData.submitRsvp(submission);
    this.lastSubmittedRsvp.set(submission);

    // Sound & Ember Shockwave
    this.audioService.playChimeChord(440.00);
    this.triggerEmberExplosion(window.innerWidth / 2, window.innerHeight / 2);

    this.isConfirmationModalOpen.set(true);

    // Reset fields
    this.rsvpName = '';
    this.rsvpPhone = '';
    this.rsvpEmail = '';
    this.rsvpWishes = '';
  }

  closeConfirmationModal() {
    this.isConfirmationModalOpen.set(false);
  }

  // =========================================================================
  // 9. LIGHTBOX
  // =========================================================================
  openLightbox(item: RoyalGalleryItem) {
    this.activeLightboxItem.set(item);
    if (typeof document !== 'undefined') document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    this.activeLightboxItem.set(null);
    if (typeof document !== 'undefined') document.body.style.overflow = '';
  }

  // =========================================================================
  // 10. SCROLL REVEALS & STORY CHAPTERS OBSERVER
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

  nextChapter(event?: Event) {
    if (event) event.preventDefault();
    const nextIdx = Math.min(this.storyChapters.length - 1, this.activeChapterIndex() + 1);
    this.goToChapter(nextIdx);
  }

  prevChapter(event?: Event) {
    if (event) event.preventDefault();
    const prevIdx = Math.max(0, this.activeChapterIndex() - 1);
    this.goToChapter(prevIdx);
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
