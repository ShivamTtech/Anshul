import { Component, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioService } from '../../../core/services/audio.service';
import { PetalsService } from '../../../core/services/petals.service';
import { SmoothScrollService } from '../../../core/services/smooth-scroll.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="royal-header" [class.scrolled]="isScrolled()">
      <div class="header-inner container-royal">
        <!-- Royal Monogram Crest -->
        <a href="#hero" class="monogram-brand" (click)="scrollTo('#hero', $event)">
          <div class="crest-frame">
            <span class="crest-letter">A</span>
            <span class="crest-heart">❦</span>
            <span class="crest-letter">V</span>
          </div>
          <div class="monogram-text">
            <span class="couple-names">ANSHUL & VIDISHA</span>
            <span class="wedding-tag">15 · FEB · 2026</span>
          </div>
        </a>

        <!-- Desktop Navigation Links -->
        <nav class="nav-links">
          <a href="#hero" (click)="scrollTo('#hero', $event)">Home</a>
          <a href="#story" (click)="scrollTo('#story', $event)">Our Story</a>
          <a href="#celebrations" (click)="scrollTo('#celebrations', $event)">Events</a>
          <a href="#moments" (click)="scrollTo('#moments', $event)">Gallery</a>
          <a href="#venue" (click)="scrollTo('#venue', $event)">Venue</a>
          <a href="#wishes" (click)="scrollTo('#wishes', $event)">Wishes</a>
        </nav>

        <!-- Right Action Center -->
        <div class="nav-actions">
          <!-- Ambient Music Toggle Button -->
          <button 
            type="button"
            class="action-btn music-btn" 
            [class.playing]="audioService.isPlaying()"
            (click)="toggleMusic()"
            title="Toggle Royal Shehnai & Sitar Music">
            <div class="music-icon-wrap">
              <svg *ngIf="audioService.isPlaying()" class="music-bars" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="10" width="3" height="10" rx="1.5" class="bar bar-1"/>
                <rect x="9" y="5" width="3" height="15" rx="1.5" class="bar bar-2"/>
                <rect x="15" y="2" width="3" height="18" rx="1.5" class="bar bar-3"/>
                <rect x="21" y="8" width="3" height="12" rx="1.5" class="bar bar-4"/>
              </svg>
              <svg *ngIf="!audioService.isPlaying()" class="music-note" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
            </div>
            <span class="btn-caption">{{ audioService.isPlaying() ? 'Playing' : 'Music' }}</span>
          </button>

          <!-- Rose Petals Shower Toggle -->
          <button 
            type="button"
            class="action-btn petal-btn" 
            [class.active]="petalsService.isEnabled()"
            (click)="petalsService.togglePetals()"
            title="Toggle Rose Petal Shower">
            <span class="petal-emoji">🌸</span>
          </button>

          <!-- RSVP Pill Button -->
          <a href="#rsvp" class="rsvp-nav-btn" (click)="scrollTo('#rsvp', $event)">
            <span>RSVP</span>
            <span class="heart-icon">♡</span>
          </a>

          <!-- Mobile Hamburger Toggle -->
          <button 
            type="button" 
            class="mobile-menu-toggle" 
            [class.open]="mobileMenuOpen()"
            (click)="toggleMobileMenu()"
            aria-label="Toggle navigation menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      <!-- Mobile Sliding Drawer -->
      <div class="mobile-drawer" [class.open]="mobileMenuOpen()">
        <div class="drawer-header">
          <div class="drawer-monogram">
            <span>A & V</span>
          </div>
          <button class="drawer-close" (click)="closeMobileMenu()">✕</button>
        </div>
        <nav class="drawer-nav">
          <a href="#hero" (click)="scrollTo('#hero', $event)">Home</a>
          <a href="#story" (click)="scrollTo('#story', $event)">Our Story</a>
          <a href="#celebrations" (click)="scrollTo('#celebrations', $event)">Celebrations & Events</a>
          <a href="#moments" (click)="scrollTo('#moments', $event)">Moments Gallery</a>
          <a href="#venue" (click)="scrollTo('#venue', $event)">Venue & Map</a>
          <a href="#wishes" (click)="scrollTo('#wishes', $event)">Guest Wishes</a>
          <a href="#rsvp" class="drawer-rsvp-btn" (click)="scrollTo('#rsvp', $event)">
            Confirm Presence (RSVP ♡)
          </a>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    .royal-header {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 1000;
      padding: 18px 0;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      background: linear-gradient(180deg, rgba(30, 5, 10, 0.75) 0%, rgba(30, 5, 10, 0.3) 70%, transparent 100%);
    }

    .royal-header.scrolled {
      padding: 12px 0;
      background: rgba(30, 5, 10, 0.92);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
      border-bottom: 1px solid rgba(212, 175, 55, 0.25);
    }

    .header-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
    }

    /* Monogram Brand */
    .monogram-brand {
      display: flex;
      align-items: center;
      gap: 14px;
      text-decoration: none;
      color: inherit;
    }

    .crest-frame {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 3px;
      padding: 6px 12px;
      border: 1.5px solid var(--gold-main);
      border-radius: 30px;
      background: rgba(74, 14, 23, 0.7);
      box-shadow: 0 0 15px rgba(212, 175, 55, 0.2);
      transition: transform 0.3s ease;
    }

    .monogram-brand:hover .crest-frame {
      transform: scale(1.05);
      border-color: var(--gold-lightest);
    }

    .crest-letter {
      font-family: var(--font-serif-royal);
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--gold-lightest);
      letter-spacing: 0.05em;
    }

    .crest-heart {
      font-size: 0.85rem;
      color: var(--gold-main);
      animation: pulseGlow 2.5s infinite alternate;
    }

    .monogram-text {
      display: flex;
      flex-direction: column;
    }

    .couple-names {
      font-family: var(--font-serif-royal);
      font-size: 0.95rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      color: var(--gold-lightest);
    }

    .wedding-tag {
      font-family: var(--font-body);
      font-size: 0.68rem;
      letter-spacing: 0.18em;
      color: var(--gold-main);
      text-transform: uppercase;
    }

    /* Navigation Links */
    .nav-links {
      display: flex;
      align-items: center;
      gap: 28px;
    }

    .nav-links a {
      font-family: var(--font-serif-royal);
      font-size: 0.85rem;
      font-weight: 500;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      text-decoration: none;
      color: #f7e7ce;
      position: relative;
      padding: 6px 0;
      transition: color 0.3s ease;
    }

    .nav-links a::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      width: 0;
      height: 1.5px;
      background: var(--gold-main);
      transition: all 0.3s ease;
      transform: translateX(-50%);
    }

    .nav-links a:hover {
      color: var(--gold-lightest);
    }

    .nav-links a:hover::after {
      width: 100%;
    }

    /* Action Center */
    .nav-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      background: rgba(74, 14, 23, 0.65);
      border: 1px solid rgba(212, 175, 55, 0.4);
      border-radius: var(--radius-full);
      color: var(--gold-lightest);
      cursor: pointer;
      font-size: 0.78rem;
      font-family: var(--font-serif-royal);
      letter-spacing: 0.08em;
      transition: var(--transition-smooth);
    }

    .action-btn:hover {
      background: var(--royal-burgundy);
      border-color: var(--gold-main);
      transform: translateY(-1px);
    }

    .music-icon-wrap {
      width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .music-note, .music-bars {
      width: 16px;
      height: 16px;
      color: var(--gold-main);
    }

    .music-bars .bar {
      transform-origin: bottom;
      animation: equalizer 1.2s ease-in-out infinite alternate;
    }
    .bar-1 { animation-delay: 0.1s; }
    .bar-2 { animation-delay: 0.4s; }
    .bar-3 { animation-delay: 0.2s; }
    .bar-4 { animation-delay: 0.5s; }

    @keyframes equalizer {
      0% { transform: scaleY(0.3); }
      100% { transform: scaleY(1); }
    }

    .petal-btn {
      padding: 8px 10px;
    }

    .petal-emoji {
      font-size: 1rem;
      transition: transform 0.3s ease;
    }

    .petal-btn:hover .petal-emoji {
      transform: rotate(25deg) scale(1.15);
    }

    /* RSVP Pill Button */
    .rsvp-nav-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 22px;
      background: var(--gold-gradient);
      color: var(--royal-burgundy-darkest);
      border-radius: var(--radius-full);
      font-family: var(--font-serif-royal);
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-decoration: none;
      text-transform: uppercase;
      box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
      transition: var(--transition-smooth);
    }

    .rsvp-nav-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(212, 175, 55, 0.5);
      filter: brightness(1.08);
    }

    .heart-icon {
      font-size: 0.95rem;
    }

    /* Mobile Hamburger */
    .mobile-menu-toggle {
      display: none;
      flex-direction: column;
      justify-content: space-between;
      width: 28px;
      height: 20px;
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 0;
      z-index: 1002;
    }

    .mobile-menu-toggle span {
      display: block;
      width: 100%;
      height: 2px;
      background: var(--gold-lightest);
      border-radius: 2px;
      transition: all 0.3s ease;
    }

    .mobile-menu-toggle.open span:nth-child(1) {
      transform: translateY(9px) rotate(45deg);
    }
    .mobile-menu-toggle.open span:nth-child(2) {
      opacity: 0;
    }
    .mobile-menu-toggle.open span:nth-child(3) {
      transform: translateY(-9px) rotate(-45deg);
    }

    /* Mobile Drawer */
    .mobile-drawer {
      display: none;
    }

    @media (max-width: 992px) {
      .nav-links {
        display: none;
      }
      .mobile-menu-toggle {
        display: flex;
      }
      .btn-caption {
        display: none;
      }

      .mobile-drawer {
        display: flex;
        flex-direction: column;
        position: fixed;
        top: 0;
        right: -100%;
        width: 82%;
        max-width: 360px;
        height: 100vh;
        background: var(--royal-burgundy-dark);
        border-left: 1px solid var(--gold-main);
        padding: 30px 24px;
        z-index: 1001;
        transition: right 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        box-shadow: -10px 0 35px rgba(0, 0, 0, 0.6);
      }

      .mobile-drawer.open {
        right: 0;
      }

      .drawer-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 20px;
        border-bottom: 1px solid rgba(212, 175, 55, 0.3);
        margin-bottom: 24px;
      }

      .drawer-monogram span {
        font-family: var(--font-serif-royal);
        font-size: 1.4rem;
        color: var(--gold-lightest);
        letter-spacing: 0.1em;
      }

      .drawer-close {
        background: none;
        border: none;
        color: var(--gold-main);
        font-size: 1.3rem;
        cursor: pointer;
      }

      .drawer-nav {
        display: flex;
        flex-direction: column;
        gap: 18px;
      }

      .drawer-nav a {
        font-family: var(--font-serif-royal);
        font-size: 1rem;
        color: #f7e7ce;
        text-decoration: none;
        letter-spacing: 0.08em;
        padding: 10px 0;
        border-bottom: 1px solid rgba(212, 175, 55, 0.1);
      }

      .drawer-rsvp-btn {
        margin-top: 20px;
        text-align: center;
        background: var(--gold-gradient);
        color: var(--royal-burgundy-darkest) !important;
        font-weight: 700;
        border-radius: var(--radius-full);
        padding: 14px 20px !important;
      }
    }
  `]
})
export class NavbarComponent {
  audioService = inject(AudioService);
  petalsService = inject(PetalsService);
  private smoothScroll = inject(SmoothScrollService);

  readonly isScrolled = signal<boolean>(false);
  readonly mobileMenuOpen = signal<boolean>(false);

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrolled.set(window.pageYOffset > 50);
  }

  scrollTo(target: string, event: Event) {
    event.preventDefault();
    this.closeMobileMenu();
    this.smoothScroll.scrollTo(target, -80);
  }

  toggleMusic() {
    this.audioService.togglePlay();
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
  }
}
