import { Component, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioService } from '../../../core/services/audio.service';
import { UiStateService } from '../../../core/services/ui-state.service';
import { SmoothScrollService } from '../../../core/services/smooth-scroll.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="royal-hud-wrapper" [class.scrolled]="isScrolled()">
      <div class="royal-hud-inner">
        
        <!-- Left: Royal Monogram -->
        <a href="#hero" class="brand-monogram group" (click)="scrollTo('#hero', $event)">
          <div class="monogram-badge">
            <span>AV</span>
          </div>
          <div class="brand-text">
            <span class="brand-names">ANSHUL &amp; VIDISHA</span>
            <span class="brand-sub">Wedding · November 2026</span>
          </div>
        </a>

        <!-- Center: Navigation Links -->
        <nav class="hud-nav-links">
          <a href="#hero" (click)="scrollTo('#hero', $event)">Home</a>
          <a href="#couple" (click)="scrollTo('#couple', $event)">Couple</a>
          <a href="#ceremonies" (click)="scrollTo('#ceremonies', $event)">Ceremonies</a>
          <a href="#itinerary" (click)="scrollTo('#itinerary', $event)">Itinerary</a>
          <a href="#venues" (click)="scrollTo('#venues', $event)">Venues</a>
          <a href="#blessings" (click)="scrollTo('#blessings', $event)">Blessings</a>
        </nav>

        <!-- Right: Actions -->
        <div class="hud-actions">
          
          <!-- View Original Card Modal -->
          <button
            type="button"
            class="hud-card-btn"
            (click)="uiState.openPhysicalCardModal()"
            title="View Original Printed Wedding Card"
            aria-label="View Original Wedding Card">
            <span class="btn-card-icon">📜</span>
            <span class="btn-card-text">Card</span>
          </button>

          <!-- Ambient Soundscape Toggle -->
          <button
            type="button"
            class="hud-icon-btn"
            [class.active]="audioService.isPlaying()"
            (click)="toggleAudio()"
            title="Toggle Wedding Music"
            aria-label="Toggle sound">
            <svg *ngIf="audioService.isPlaying()" class="w-4 h-4 text-crimson" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
            </svg>
            <svg *ngIf="!audioService.isPlaying()" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-muted);">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <line x1="23" y1="9" x2="17" y2="15"></line>
              <line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>

            <!-- Real-time Equalizer Wave -->
            <span *ngIf="audioService.isPlaying()" class="audio-spectrum">
              <span class="bar bar-1"></span>
              <span class="bar bar-2"></span>
              <span class="bar bar-3"></span>
              <span class="bar bar-4"></span>
            </span>
          </button>

          <!-- Reopen Envelope -->
          <button
            type="button"
            class="hud-icon-btn"
            (click)="uiState.reopenEnvelope()"
            title="View Invitation Envelope"
            aria-label="Open invitation envelope">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--gold-warm);">
              <rect x="2" y="4" width="20" height="16" rx="2"></rect>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
            </svg>
          </button>

          <!-- Mobile Menu Toggle -->
          <button
            type="button"
            class="mobile-toggle"
            [class.active]="isMenuOpen()"
            (click)="toggleMenu()"
            aria-label="Toggle menu">
            <span class="line line-top"></span>
            <span class="line line-bot"></span>
          </button>
        </div>

      </div>
    </header>

    <!-- Mobile Fullscreen Overlay (Sibling of header so position:fixed covers full viewport) -->
    <div class="mobile-overlay" [class.open]="isMenuOpen()">
      <nav class="mobile-nav">
        <a href="#hero" (click)="closeMenuAndScroll('#hero', $event)">Home</a>
        <a href="#couple" (click)="closeMenuAndScroll('#couple', $event)">The Couple</a>
        <a href="#ceremonies" (click)="closeMenuAndScroll('#ceremonies', $event)">Ceremonies</a>
        <a href="#itinerary" (click)="closeMenuAndScroll('#itinerary', $event)">Itinerary &amp; Rituals</a>
        <a href="#venues" (click)="closeMenuAndScroll('#venues', $event)">Venues</a>
        <a href="#blessings" (click)="closeMenuAndScroll('#blessings', $event)">Blessings</a>
        <button type="button" class="mobile-card-trigger" (click)="uiState.openPhysicalCardModal(); toggleMenu()">
          📜 View Original Printed Card
        </button>
      </nav>
    </div>
  `,
  styles: [`
    .royal-hud-wrapper {
      position: fixed;
      top: 18px;
      left: 50%;
      transform: translateX(-50%);
      width: 92%;
      max-width: 960px;
      z-index: 100;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .royal-hud-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 18px;
      border-radius: 9999px;
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--border-gold);
      box-shadow: 0 4px 24px rgba(58, 50, 45, 0.1);
    }

    /* Brand Monogram */
    .brand-monogram {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      cursor: pointer;
    }

    .monogram-badge {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--crimson-wine), var(--crimson-deep));
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-display-deco);
      font-size: 0.55rem;
      color: white;
      letter-spacing: 0.1em;
      font-weight: 700;
      flex-shrink: 0;
    }

    .brand-text {
      display: flex;
      flex-direction: column;
    }

    .brand-names {
      font-family: var(--font-display);
      font-size: 0.62rem;
      font-weight: 700;
      letter-spacing: 0.2em;
      color: var(--crimson-wine);
    }

    .brand-sub {
      font-family: var(--font-editorial);
      font-size: 0.58rem;
      color: var(--text-muted);
      font-style: italic;
    }

    /* Navigation */
    .hud-nav-links {
      display: flex;
      gap: clamp(12px, 2vw, 24px);
    }

    .hud-nav-links a {
      font-family: var(--font-display);
      font-size: 0.6rem;
      font-weight: 600;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--text-secondary);
      text-decoration: none;
      transition: color 0.3s ease;
      white-space: nowrap;
    }

    .hud-nav-links a:hover {
      color: var(--crimson-wine);
    }

    /* Actions */
    .hud-actions {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .hud-icon-btn {
      position: relative;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: transparent;
      border: 1px solid transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .hud-icon-btn:hover {
      background: rgba(197, 160, 89, 0.1);
      border-color: var(--border-gold);
    }

    .hud-icon-btn.active {
      background: rgba(197, 160, 89, 0.08);
    }

    .hud-icon-btn svg {
      width: 14px;
      height: 14px;
    }

    /* Audio Spectrum Bars */
    .audio-spectrum {
      position: absolute;
      bottom: -2px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 1.5px;
    }

    .audio-spectrum .bar {
      width: 2px;
      border-radius: 2px;
      background: var(--crimson-wine);
    }

    .bar-1 { animation: specBar 0.6s ease infinite alternate; height: 4px; }
    .bar-2 { animation: specBar 0.45s ease infinite alternate; height: 6px; }
    .bar-3 { animation: specBar 0.55s ease infinite alternate; height: 5px; }
    .bar-4 { animation: specBar 0.5s ease infinite alternate; height: 3px; }

    @keyframes specBar {
      from { height: 2px; }
      to { height: 7px; }
    }

    /* Mobile Toggle */
    .mobile-toggle {
      display: none;
      width: 28px;
      height: 20px;
      background: none;
      border: none;
      cursor: pointer;
      position: relative;
      flex-direction: column;
      justify-content: space-between;
    }

    .mobile-toggle .line {
      display: block;
      width: 100%;
      height: 2px;
      background: var(--crimson-wine);
      border-radius: 2px;
      transition: all 0.3s ease;
    }

    .mobile-toggle.active .line-top {
      transform: rotate(45deg) translate(6px, 6px);
    }

    .mobile-toggle.active .line-bot {
      transform: rotate(-45deg) translate(6px, -6px);
    }

    /* Mobile Overlay */
    .mobile-overlay {
      display: none;
      position: fixed;
      inset: 0;
      top: 0;
      width: 100vw;
      height: 100vh;
      height: 100dvh;
      background: radial-gradient(circle at top, rgba(250, 247, 242, 0.99) 0%, rgba(240, 232, 222, 0.99) 100%);
      backdrop-filter: blur(25px);
      -webkit-backdrop-filter: blur(25px);
      z-index: 90;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .mobile-overlay.open {
      opacity: 1;
      pointer-events: auto;
    }

    .mobile-nav {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100%;
      gap: clamp(16px, 3vh, 26px);
      padding: 96px 20px 40px;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }

    .mobile-nav a {
      font-family: var(--font-display);
      font-size: 1rem;
      font-weight: 600;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: var(--crimson-wine);
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .mobile-nav a:hover {
      color: var(--gold-warm);
    }

    .hud-card-btn {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 4px 12px;
      border-radius: 9999px;
      background: rgba(120, 29, 44, 0.08);
      border: 1px solid var(--border-gold);
      color: var(--crimson-wine);
      cursor: pointer;
      font-family: var(--font-display);
      font-size: 0.62rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      transition: all 0.3s ease;
    }

    .hud-card-btn:hover {
      background: var(--crimson-wine);
      color: white;
      border-color: var(--crimson-wine);
      transform: translateY(-1px);
    }

    .mobile-card-trigger {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      border-radius: 9999px;
      background: var(--crimson-wine);
      color: white;
      border: 1px solid var(--gold-warm);
      font-family: var(--font-display);
      font-size: 0.85rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      cursor: pointer;
      margin-top: 10px;
    }

    @media (max-width: 768px) {
      .hud-nav-links { display: none; }
      .mobile-toggle { display: flex; }
      .mobile-overlay { display: block; }
      .brand-text { display: none; }
      .hud-card-btn { display: none; }
    }
  `]
})
export class NavbarComponent {
  audioService = inject(AudioService);
  uiState = inject(UiStateService);
  private smoothScroll = inject(SmoothScrollService);

  readonly isScrolled = signal<boolean>(false);
  readonly isMenuOpen = signal<boolean>(false);

  @HostListener('window:scroll')
  onScroll() {
    if (typeof window !== 'undefined') {
      this.isScrolled.set(window.scrollY > 60);
    }
  }

  scrollTo(target: string, event?: Event) {
    if (event) event.preventDefault();
    this.smoothScroll.scrollTo(target, -60);
  }

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

  closeMenuAndScroll(target: string, event?: Event) {
    this.isMenuOpen.set(false);
    this.scrollTo(target, event);
  }

  toggleAudio() {
    this.audioService.togglePlay();
  }
}
