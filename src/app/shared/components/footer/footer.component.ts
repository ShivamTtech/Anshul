import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmoothScrollService } from '../../../core/services/smooth-scroll.service';
import { LanguageService } from '../../../core/services/language.service';

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
          {{ lang.isHindi() ? 'अंशुल एवं विदिशा' : 'Anshul & Vidisha' }}
        </h3>

        <!-- Family Gratitude Blessing -->
        <p class="footer-blessing">
          {{ lang.t().footerGratitude }}
        </p>

        <!-- Quick Links -->
        <div class="footer-links">
          <a href="#hero" (click)="scrollTo('#hero', $event)">{{ lang.t().navHome }}</a>
          <span class="sep">✦</span>
          <a href="#couple" (click)="scrollTo('#couple', $event)">{{ lang.t().navCouple }}</a>
          <span class="sep">✦</span>
          <a href="#ceremonies" (click)="scrollTo('#ceremonies', $event)">{{ lang.t().navCeremonies }}</a>
          <span class="sep">✦</span>
          <a href="#itinerary" (click)="scrollTo('#itinerary', $event)">{{ lang.t().navItinerary }}</a>
          <span class="sep">✦</span>
          <a href="#blessings" (click)="scrollTo('#blessings', $event)">{{ lang.t().navBlessings }}</a>
        </div>

        <!-- Scroll to Top Button -->
        <button type="button" class="btn-scroll-top" (click)="scrollTo('#hero', $event)" [attr.aria-label]="lang.t().btnBackToTop" [title]="lang.t().btnBackToTop">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="m18 15-6-6-6 6"></path>
          </svg>
        </button>

        <p class="footer-credit">
          {{ lang.t().footerDates }}
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
      letter-spacing: 0.15em;
      text-transform: uppercase;
      margin-bottom: 28px;
    }

    .footer-links a {
      color: var(--text-secondary);
      text-decoration: none;
      transition: color 0.2s;
    }

    .footer-links a:hover {
      color: var(--crimson-wine);
    }

    .footer-links .sep {
      color: var(--gold-warm);
      font-size: 0.5rem;
    }

    .btn-scroll-top {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 1px solid var(--border-gold);
      background: rgba(255, 255, 255, 0.7);
      color: var(--crimson-wine);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.25s ease;
      margin-bottom: 24px;
    }

    .btn-scroll-top:hover {
      background: var(--crimson-wine);
      color: white;
      border-color: var(--crimson-wine);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(122, 27, 40, 0.25);
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
  readonly lang = inject(LanguageService);
  private smoothScroll = inject(SmoothScrollService);

  scrollTo(target: string, event?: Event) {
    if (event) event.preventDefault();
    this.smoothScroll.scrollTo(target, -60);
  }
}
