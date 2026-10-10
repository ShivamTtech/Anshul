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
        
        <!-- Sacred Ornament -->
        <div class="footer-ornament">✦ ✦ ✦</div>

        <!-- Couple Names -->
        <h3 class="footer-names font-calligraphy text-crimson">
          Anshul &amp; Vidisha
        </h3>

        <!-- Family Gratitude Blessing -->
        <p class="footer-blessing">
          With eternal gratitude and blessings from the Verma &amp; Singh Families.
        </p>

        <!-- Quick Links -->
        <div class="footer-links">
          <a href="#hero" (click)="scrollTo('#hero', $event)">Home</a>
          <span class="sep">✦</span>
          <a href="#couple" (click)="scrollTo('#couple', $event)">The Couple</a>
          <span class="sep">✦</span>
          <a href="#ceremonies" (click)="scrollTo('#ceremonies', $event)">Ceremonies</a>
          <span class="sep">✦</span>
          <a href="#itinerary" (click)="scrollTo('#itinerary', $event)">Itinerary</a>
          <span class="sep">✦</span>
          <a href="#blessings" (click)="scrollTo('#blessings', $event)">Blessings</a>
        </div>

        <!-- Scroll to Top Button -->
        <button type="button" class="btn-scroll-top" (click)="scrollTo('#hero', $event)" aria-label="Back to top">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="m18 15-6-6-6 6"></path>
          </svg>
        </button>

        <p class="footer-credit">
          Sacred Nuptials · Lucknow &amp; Prayagraj · November 2026
        </p>
      </div>
    </footer>
  `,
  styles: [`
    .royal-footer {
      background: var(--bg-cream);
      border-top: 1px solid var(--border-gold);
      padding: clamp(50px, 7vw, 80px) 0 36px;
      text-align: center;
      position: relative;
      z-index: 20;
    }

    .footer-inner {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .footer-ornament {
      font-size: 0.7rem;
      color: var(--gold-warm);
      letter-spacing: 0.8em;
      margin-bottom: 16px;
    }

    .footer-names {
      font-size: clamp(2rem, 4vw, 2.8rem);
      font-weight: 400;
      margin-bottom: 12px;
    }

    .footer-blessing {
      font-family: var(--font-editorial);
      font-size: clamp(0.9rem, 1.6vw, 1.1rem);
      font-style: italic;
      color: var(--text-secondary);
      max-width: 480px;
      margin: 0 auto 24px;
      padding: 0 16px;
      line-height: 1.6;
    }

    .footer-links {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 10px 14px;
      padding: 0 16px;
      font-family: var(--font-display);
      font-size: 0.62rem;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--text-muted);
      margin-bottom: 28px;
    }

    .footer-links a {
      color: inherit;
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .footer-links a:hover {
      color: var(--crimson-wine);
    }

    .sep {
      font-size: 0.45rem;
      color: var(--gold-warm);
    }

    .btn-scroll-top {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      border: 1px solid var(--border-gold);
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-bottom: 20px;
      color: var(--crimson-wine);
    }

    .btn-scroll-top:hover {
      background: rgba(197, 160, 89, 0.1);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(197, 160, 89, 0.2);
    }

    .btn-scroll-top svg {
      width: 16px;
      height: 16px;
    }

    .footer-credit {
      font-family: var(--font-sans);
      font-size: 0.65rem;
      letter-spacing: 0.15em;
      color: var(--text-light);
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
