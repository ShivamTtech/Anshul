import { Component, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioService } from '../../../core/services/audio.service';
import { SmoothScrollService } from '../../../core/services/smooth-scroll.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="luxury-navbar" [class.scrolled]="isScrolled()">
      <div class="nav-inner container-minimal">
        <!-- Minimal Monogram -->
        <a href="#hero" class="brand-monogram" (click)="scrollTo('#hero', $event)">
          <span class="monogram-letters">A · V</span>
        </a>

        <!-- Desktop Minimal Links -->
        <nav class="nav-links">
          <a href="#celebrations" (click)="scrollTo('#celebrations', $event)">Events</a>
          <a href="#couple" (click)="scrollTo('#couple', $event)">The Couple</a>
          <a href="#story" (click)="scrollTo('#story', $event)">Story</a>
          <a href="#gallery" (click)="scrollTo('#gallery', $event)">Gallery</a>
          <a href="#venue" (click)="scrollTo('#venue', $event)">Venue</a>
          <a href="#rsvp" (click)="scrollTo('#rsvp', $event)">RSVP</a>
        </nav>

        <!-- Right Utilities (Subtle Audio & RSVP) -->
        <div class="nav-utilities">
          <!-- Subtle Audio Wave -->
          <button 
            type="button" 
            class="audio-toggle" 
            [class.playing]="audioService.isPlaying()"
            (click)="audioService.togglePlay()"
            aria-label="Toggle ambient sound">
            <span class="soundwave-bar bar-1"></span>
            <span class="soundwave-bar bar-2"></span>
            <span class="soundwave-bar bar-3"></span>
          </button>

          <!-- Understated RSVP Pill -->
          <a href="#rsvp" class="rsvp-pill" (click)="scrollTo('#rsvp', $event)">
            <span>Confirm Attendance</span>
          </a>

          <!-- Mobile Toggle -->
          <button 
            type="button" 
            class="mobile-toggle" 
            [class.active]="isMenuOpen()"
            (click)="toggleMenu()"
            aria-label="Menu">
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      <!-- Mobile Fullscreen Minimal Overlay -->
      <div class="mobile-overlay" [class.open]="isMenuOpen()">
        <nav class="mobile-nav">
          <a href="#hero" (click)="scrollTo('#hero', $event)">Home</a>
          <a href="#celebrations" (click)="scrollTo('#celebrations', $event)">Events</a>
          <a href="#couple" (click)="scrollTo('#couple', $event)">The Couple</a>
          <a href="#story" (click)="scrollTo('#story', $event)">Our Story</a>
          <a href="#gallery" (click)="scrollTo('#gallery', $event)">Moments</a>
          <a href="#venue" (click)="scrollTo('#venue', $event)">Venue</a>
          <a href="#rsvp" class="mobile-rsvp" (click)="scrollTo('#rsvp', $event)">Confirm Attendance</a>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    .luxury-navbar {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 1000;
      padding: 28px 0;
      transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      background: transparent;
    }

    .luxury-navbar.scrolled {
      padding: 16px 0;
      background: rgba(13, 9, 11, 0.82);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }

    .nav-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .brand-monogram {
      text-decoration: none;
      color: #fff;
      display: flex;
      align-items: center;
    }

    .monogram-letters {
      font-family: var(--font-serif-display);
      font-size: 1.15rem;
      letter-spacing: 0.25em;
      font-weight: 400;
      color: #FFFFFF;
      transition: opacity 0.3s ease;
    }

    .brand-monogram:hover .monogram-letters {
      opacity: 0.75;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 36px;
    }

    .nav-links a {
      font-family: var(--font-sans);
      font-size: 0.72rem;
      font-weight: 400;
      letter-spacing: 0.24em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.78);
      text-decoration: none;
      transition: color 0.3s ease;
      position: relative;
    }

    .nav-links a:hover {
      color: #FFFFFF;
    }

    .nav-utilities {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    /* Minimal Audio Soundwave */
    .audio-toggle {
      background: transparent;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: flex-end;
      gap: 3px;
      height: 14px;
      padding: 0 4px;
    }

    .soundwave-bar {
      width: 1.5px;
      background: rgba(255, 255, 255, 0.65);
      border-radius: 1px;
      height: 4px;
      transition: all 0.3s ease;
    }

    .audio-toggle.playing .bar-1 {
      animation: wave 1.1s ease-in-out infinite alternate;
      height: 12px;
    }
    .audio-toggle.playing .bar-2 {
      animation: wave 0.9s ease-in-out infinite alternate 0.2s;
      height: 8px;
    }
    .audio-toggle.playing .bar-3 {
      animation: wave 1.3s ease-in-out infinite alternate 0.4s;
      height: 14px;
    }

    @keyframes wave {
      0% { height: 3px; }
      100% { height: 14px; }
    }

    /* Understated RSVP Pill */
    .rsvp-pill {
      font-family: var(--font-sans);
      font-size: 0.7rem;
      font-weight: 500;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      text-decoration: none;
      color: #FFFFFF;
      padding: 9px 22px;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 9999px;
      transition: all 0.4s ease;
    }

    .rsvp-pill:hover {
      border-color: #FFFFFF;
      background: rgba(255, 255, 255, 0.1);
    }

    /* Mobile Menu Toggle */
    .mobile-toggle {
      display: none;
      flex-direction: column;
      justify-content: space-between;
      width: 22px;
      height: 10px;
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 0;
    }

    .mobile-toggle span {
      display: block;
      width: 100%;
      height: 1px;
      background: #FFFFFF;
      transition: all 0.3s ease;
    }

    .mobile-toggle.active span:nth-child(1) {
      transform: translateY(4.5px) rotate(45deg);
    }
    .mobile-toggle.active span:nth-child(2) {
      transform: translateY(-4.5px) rotate(-45deg);
    }

    .mobile-overlay {
      display: none;
    }

    @media (max-width: 900px) {
      .nav-links, .rsvp-pill {
        display: none;
      }
      .mobile-toggle {
        display: flex;
      }

      .mobile-overlay {
        display: flex;
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: #0D090B;
        align-items: center;
        justify-content: center;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.4s ease;
        z-index: -1;
      }

      .mobile-overlay.open {
        opacity: 1;
        pointer-events: auto;
      }

      .mobile-nav {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 28px;
      }

      .mobile-nav a {
        font-family: var(--font-serif-display);
        font-size: 1.4rem;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.8);
        text-decoration: none;
      }

      .mobile-rsvp {
        margin-top: 16px;
        font-family: var(--font-sans) !important;
        font-size: 0.8rem !important;
        letter-spacing: 0.25em !important;
        color: var(--gold-accent) !important;
      }
    }
  `]
})
export class NavbarComponent {
  audioService = inject(AudioService);
  private smoothScroll = inject(SmoothScrollService);

  readonly isScrolled = signal<boolean>(false);
  readonly isMenuOpen = signal<boolean>(false);

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled.set(window.pageYOffset > 50);
  }

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

  scrollTo(target: string, event: Event) {
    event.preventDefault();
    this.isMenuOpen.set(false);
    this.smoothScroll.scrollTo(target, -60);
  }
}
