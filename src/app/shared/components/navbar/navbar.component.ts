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
      <div class="royal-hud-inner liquid-metal-border royal-glass">
        
        <!-- Left: Royal Monogram -->
        <a href="#ceremony" class="brand-monogram group" (click)="scrollTo('#ceremony', $event)">
          <div class="monogram-badge">
            <span>AV</span>
          </div>
          <div class="brand-text">
            <span class="brand-names">ANSHUL &amp; VIDISHA</span>
            <span class="brand-sub">The Royal Wedding · 2026</span>
          </div>
        </a>

        <!-- Center: Navigation Links -->
        <nav class="hud-nav-links">
          <a href="#ceremony" (click)="scrollTo('#ceremony', $event)">Sacred Union</a>
          <a href="#itinerary" (click)="scrollTo('#itinerary', $event)">Four Days of Joy</a>
          <a href="#couple" (click)="scrollTo('#couple', $event)">Our Story</a>
          <a href="#moments" (click)="scrollTo('#moments', $event)">Captured Moments</a>
          <a href="#venue" (click)="scrollTo('#venue', $event)">Palace &amp; Twilight</a>
        </nav>

        <!-- Right: Actions -->
        <div class="hud-actions">
          
          <!-- Ambient Soundscape Toggle -->
          <button
            type="button"
            class="hud-icon-btn"
            [class.active]="audioService.isPlaying()"
            (click)="toggleAudio()"
            title="Toggle Ambient Royal Soundscape"
            aria-label="Toggle sound">
            <!-- Fine Vector Speaker Icon -->
            <svg *ngIf="audioService.isPlaying()" class="w-4 h-4 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
            </svg>
            <svg *ngIf="!audioService.isPlaying()" class="w-4 h-4 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
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

          <!-- Reopen Royal Envelope Ceremony Button -->
          <button
            type="button"
            class="hud-icon-btn"
            (click)="uiState.reopenEnvelope()"
            title="View Royal Invitation Envelope"
            aria-label="Open invitation envelope">
            <svg class="w-4 h-4 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2"></rect>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
            </svg>
          </button>

          <!-- Sacred Geometry Morpher -->
          <button
            type="button"
            class="hud-icon-btn hidden-xs"
            (click)="uiState.morphNextGeometry()"
            title="Morph Sacred Yantra Geometry"
            aria-label="Morph geometry">
            <svg class="w-4 h-4 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
              <path d="M2 12h20"></path>
            </svg>
          </button>

          <!-- RSVP Pill -->
          <a href="#rsvp" class="btn-hud-rsvp" (click)="scrollTo('#rsvp', $event)">
            <span>RSVP Now</span>
          </a>

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

      <!-- Mobile Fullscreen Overlay -->
      <div class="mobile-overlay royal-glass" [class.open]="isMenuOpen()">
        <nav class="mobile-nav">
          <a href="#ceremony" (click)="closeMenuAndScroll('#ceremony', $event)">Sacred Union</a>
          <a href="#itinerary" (click)="closeMenuAndScroll('#itinerary', $event)">Four Days of Joy</a>
          <a href="#couple" (click)="closeMenuAndScroll('#couple', $event)">Our Story</a>
          <a href="#moments" (click)="closeMenuAndScroll('#moments', $event)">Captured Moments</a>
          <a href="#venue" (click)="closeMenuAndScroll('#venue', $event)">The Palace</a>
          <a href="#rsvp" class="mobile-rsvp-btn" (click)="closeMenuAndScroll('#rsvp', $event)">Confirm Attendance</a>
        </nav>
      </div>
    </header>
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
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7);
    }

    /* Brand Monogram */
    .brand-monogram {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
    }

    .monogram-badge {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: linear-gradient(135deg, #f6d56d, #d4af37, #8f671c);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #070103;
      font-family: var(--font-display);
      font-size: 0.75rem;
      font-weight: 700;
      box-shadow: 0 0 16px rgba(212, 175, 55, 0.4);
      transition: transform 0.3s ease;
    }

    .brand-monogram:hover .monogram-badge {
      transform: scale(1.08);
    }

    .brand-text {
      display: flex;
      flex-direction: column;
      text-align: left;
    }

    .brand-names {
      font-family: var(--font-display);
      font-size: 0.76rem;
      font-weight: 700;
      letter-spacing: 0.18em;
      color: #FFFFFF;
      line-height: 1.2;
    }

    .brand-sub {
      font-family: var(--font-editorial);
      font-size: 0.72rem;
      font-style: italic;
      color: var(--gold-bright);
      line-height: 1.1;
    }

    /* Desktop Navigation */
    .hud-nav-links {
      display: none;
      align-items: center;
      gap: 22px;
    }

    @media (min-width: 768px) {
      .hud-nav-links {
        display: flex;
      }
    }

    .hud-nav-links a {
      font-family: var(--font-display);
      font-size: 0.68rem;
      font-weight: 600;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.75);
      text-decoration: none;
      transition: all 0.3s ease;
      position: relative;
    }

    .hud-nav-links a:hover {
      color: var(--gold-bright);
    }

    .hud-nav-links a::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 0;
      height: 1px;
      background: var(--gold-bright);
      transition: width 0.3s ease;
    }

    .hud-nav-links a:hover::after {
      width: 100%;
    }

    /* HUD Actions */
    .hud-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .hud-icon-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 7px 12px;
      border-radius: 9999px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(212, 175, 55, 0.3);
      color: var(--gold-bright);
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .hud-icon-btn:hover {
      background: rgba(212, 175, 55, 0.15);
      border-color: var(--gold-bright);
      transform: translateY(-1px);
    }

    .w-4 { width: 15px; height: 15px; }
    .text-gold { color: var(--gold-bright); }

    /* Audio Equalizer Bars */
    .audio-spectrum {
      display: flex;
      align-items: flex-end;
      gap: 2px;
      height: 12px;
    }

    .audio-spectrum .bar {
      width: 2px;
      background: var(--gold-bright);
      border-radius: 1px;
      animation: barDance 0.8s ease-in-out infinite alternate;
    }

    .bar-1 { height: 4px; animation-delay: 0.1s; }
    .bar-2 { height: 10px; animation-delay: 0.3s; }
    .bar-3 { height: 6px; animation-delay: 0.2s; }
    .bar-4 { height: 12px; animation-delay: 0.4s; }

    @keyframes barDance {
      0% { height: 2px; }
      100% { height: 12px; }
    }

    .btn-hud-rsvp {
      display: inline-flex;
      align-items: center;
      padding: 8px 22px;
      border-radius: 9999px;
      background: linear-gradient(135deg, #fce588 0%, #d4af37 50%, #966f1e 100%);
      color: #070103 !important;
      font-family: var(--font-display);
      font-size: 0.68rem;
      font-weight: 700;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      text-decoration: none;
      border: 1px solid rgba(255, 246, 214, 0.85);
      box-shadow: 0 4px 20px rgba(212, 175, 55, 0.4);
      transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .btn-hud-rsvp:hover {
      filter: brightness(1.12);
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(252, 229, 136, 0.65);
    }

    /* Mobile Toggle */
    .mobile-toggle {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 5px;
      width: 32px;
      height: 32px;
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 4px;
    }

    @media (min-width: 768px) {
      .mobile-toggle { display: none; }
    }

    .mobile-toggle .line {
      width: 20px;
      height: 1.5px;
      background: var(--gold-bright);
      transition: all 0.3s ease;
    }

    .mobile-toggle.active .line-top {
      transform: rotate(45deg) translate(2px, 3px);
    }

    .mobile-toggle.active .line-bot {
      transform: rotate(-45deg) translate(2px, -3px);
    }

    @media (max-width: 640px) {
      .brand-text { display: none; }
      .hidden-xs { display: none; }
      .royal-hud-wrapper {
        width: 95%;
        top: 10px;
      }
      .royal-hud-inner {
        padding: 6px 12px;
      }
    }

    @media (max-width: 440px) {
      .btn-hud-rsvp {
        display: none;
      }
    }

    /* Mobile Fullscreen Overlay */
    .mobile-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.4s ease;
      z-index: -1;
      padding: 30px;
    }

    .mobile-overlay.open {
      opacity: 1;
      pointer-events: auto;
    }

    .mobile-nav {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 22px;
    }

    .mobile-nav a {
      font-family: var(--font-display);
      font-size: 1.1rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #FFFFFF;
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .mobile-nav a:hover {
      color: var(--gold-bright);
    }

    .mobile-rsvp-btn {
      margin-top: 15px;
      padding: 13px 36px;
      border-radius: 9999px;
      background: linear-gradient(135deg, #fce588 0%, #d4af37 50%, #966f1e 100%);
      color: #070103 !important;
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 0.82rem !important;
      letter-spacing: 0.20em;
      border: 1px solid rgba(255, 246, 214, 0.85);
      box-shadow: 0 6px 25px rgba(212, 175, 55, 0.45);
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
      this.isScrolled.set(window.scrollY > 40);
    }
  }

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

  toggleAudio() {
    this.audioService.togglePlay();
  }

  scrollTo(target: string, event?: Event) {
    if (event) event.preventDefault();
    this.smoothScroll.scrollTo(target, -60);
  }

  closeMenuAndScroll(target: string, event?: Event) {
    this.isMenuOpen.set(false);
    this.scrollTo(target, event);
  }
}
