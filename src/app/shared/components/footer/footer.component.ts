import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmoothScrollService } from '../../../core/services/smooth-scroll.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="royal-footer">
      <div class="container-royal footer-inner">
        
        <!-- Sacred Royal Crest -->
        <div class="footer-crest">
          <svg class="crest-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
            <path d="M12 2l3 5 5-2-2 7H6L4 5l5 2 3-5z" fill="rgba(212, 175, 55, 0.2)"></path>
            <circle cx="12" cy="18" r="2" fill="currentColor"></circle>
          </svg>
        </div>

        <!-- Couple Names with Liquid Gold Foil -->
        <h3 class="footer-names liquid-gold-foil">
          ANSHUL &amp; VIDISHA
        </h3>

        <!-- Family Gratitude Blessing -->
        <p class="footer-blessing">
          With eternal gratitude and blessings from the Sharma &amp; Singhania Families.
        </p>

        <!-- Quick Links -->
        <div class="footer-links">
          <a href="#ceremony" (click)="scrollTo('#ceremony', $event)">Sacred Union</a>
          <span class="sep">✦</span>
          <a href="#itinerary" (click)="scrollTo('#itinerary', $event)">Four Days of Joy</a>
          <span class="sep">✦</span>
          <a href="#couple" (click)="scrollTo('#couple', $event)">Our Story</a>
          <span class="sep">✦</span>
          <a href="#moments" (click)="scrollTo('#moments', $event)">Gallery</a>
          <span class="sep">✦</span>
          <a href="#venue" (click)="scrollTo('#venue', $event)">The Palace</a>
        </div>

        <!-- Scroll to Top Button -->
        <button type="button" class="btn-scroll-top" (click)="scrollTo('#ceremony', $event)" aria-label="Back to top">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="m18 15-6-6-6 6"></path>
          </svg>
        </button>

        <p class="footer-credit">
          Royal Nuptials · Rajasthan · December 2026
        </p>
      </div>
    </footer>
  `,
  styles: [`
    .royal-footer {
      background: var(--royal-void);
      border-top: 1px solid rgba(212, 175, 55, 0.25);
      padding: clamp(60px, 8vw, 90px) 0 40px;
      text-align: center;
      position: relative;
      z-index: 20;
    }

    .footer-inner {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .footer-crest {
      color: var(--gold-bright);
      margin-bottom: 16px;
    }

    .crest-svg {
      width: 32px;
      height: 32px;
    }

    .footer-names {
      font-family: var(--font-display-deco);
      font-size: clamp(1.8rem, 3.5vw, 2.6rem);
      font-weight: 700;
      letter-spacing: 0.22em;
      margin-bottom: 12px;
    }

    .footer-blessing {
      font-family: var(--font-editorial);
      font-size: clamp(1rem, 1.8vw, 1.25rem);
      font-style: italic;
      color: var(--royal-sandstone);
      max-width: 520px;
      margin: 0 auto 28px;
      line-height: 1.6;
    }

    .footer-links {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 16px;
      font-family: var(--font-display);
      font-size: 0.68rem;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 32px;
    }

    .footer-links a {
      color: inherit;
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .footer-links a:hover {
      color: var(--gold-bright);
    }

    .footer-links .sep {
      color: var(--gold-mid);
      font-size: 0.45rem;
      opacity: 0.6;
    }

    .btn-scroll-top {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(212, 175, 55, 0.35);
      color: var(--gold-bright);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-bottom: 24px;
    }

    .btn-scroll-top:hover {
      background: rgba(212, 175, 55, 0.2);
      border-color: var(--gold-bright);
      transform: translateY(-3px);
      box-shadow: 0 0 20px rgba(212, 175, 55, 0.4);
    }

    .w-4 { width: 16px; height: 16px; }

    .footer-credit {
      font-family: var(--font-sans);
      font-size: 0.62rem;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.35);
    }
  `]
})
export class FooterComponent {
  private smoothScroll = inject(SmoothScrollService);

  scrollTo(target: string, event?: Event) {
    if (event) event.preventDefault();
    this.smoothScroll.scrollTo(target, -60);
  }
}
