import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmoothScrollService } from '../../../core/services/smooth-scroll.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="royal-footer">
      <!-- Decorative Torn Edge Top Separator -->
      <div class="deckle-tear-top">
        <svg viewBox="0 0 1200 30" preserveAspectRatio="none" class="tear-svg">
          <path d="M0,0 L0,18 Q30,28 60,18 T120,18 T180,25 T240,15 T300,22 T360,14 T420,26 T480,16 T540,24 T600,15 T660,25 T720,16 T780,24 T840,15 T900,26 T960,16 T1020,24 T1080,15 T1140,22 T1200,18 L1200,0 Z" fill="#faf6f0"/>
        </svg>
      </div>

      <div class="footer-container container-royal">
        <!-- RSVP Invitation Banner (Matching Mockup Footer) -->
        <div class="rsvp-footer-banner">
          <span class="invite-banner-tag">KINDLY CONFIRM YOUR PRESENCE</span>
          <h3 class="invite-banner-heading">Your presence means the world to us!</h3>
          <p class="invite-banner-sub">Join us under the royal starlit skies of Jaipur to celebrate our sacred union.</p>

          <button type="button" class="footer-rsvp-btn" (click)="openRsvp.emit()">
            <span class="btn-heart">♥</span>
            <span>RSVP Now</span>
          </button>
        </div>

        <div class="footer-divider-ornate">
          <span class="ornate-line-gold"></span>
          <div class="footer-monogram-circle">
            <span>A ❦ V</span>
          </div>
          <span class="ornate-line-gold"></span>
        </div>

        <!-- Family Blessings & Acknowledgements -->
        <div class="footer-grid">
          <div class="footer-col">
            <h4 class="col-title">The Groom's Family</h4>
            <p class="col-family-name">Sharma Family</p>
            <p class="col-text">With the blessings of Late Shri Om Prakash & Late Smt. Kamla Sharma</p>
            <p class="col-sub">Shri Rajesh & Smt. Sunita Sharma</p>
          </div>

          <div class="footer-col center-col">
            <h2 class="couple-title-script">Anshul & Vidisha</h2>
            <p class="wedding-date-text">15TH FEBRUARY 2026</p>
            <p class="venue-loc">The Royal Greens · Tonk Road, Jaipur, Rajasthan</p>
            <div class="hashtag-badge">#AnshulWedsVidisha · #AnshulKiVidisha</div>
          </div>

          <div class="footer-col">
            <h4 class="col-title">The Bride's Family</h4>
            <p class="col-family-name">Gupta Family</p>
            <p class="col-text">With the blessings of Late Shri Ratan Lal & Smt. Shanti Gupta</p>
            <p class="col-sub">Shri Mahendra & Smt. Rekha Gupta</p>
          </div>
        </div>

        <!-- Copyright & Credits -->
        <div class="footer-bottom">
          <p class="copyright-text">
            © 2026 Anshul & Vidisha Royal Wedding Invitation. Crafted with infinite love & royal heritage elegance.
          </p>
          <div class="quick-scroll-top">
            <button type="button" (click)="scrollToTop()" class="scroll-top-btn" aria-label="Scroll back to top">
              <span>↑ Back to Top</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .royal-footer {
      position: relative;
      background: linear-gradient(180deg, #380810 0%, #1e0307 100%);
      color: #f7e7ce;
      padding-top: 60px;
      padding-bottom: 30px;
      overflow: hidden;
    }

    .deckle-tear-top {
      position: absolute;
      top: -1px;
      left: 0;
      width: 100%;
      height: 30px;
      overflow: hidden;
      z-index: 2;
    }

    .tear-svg {
      width: 100%;
      height: 100%;
      display: block;
    }

    /* RSVP Footer Banner */
    .rsvp-footer-banner {
      text-align: center;
      max-width: 680px;
      margin: 0 auto 50px;
      padding: 30px 24px;
      border: 1px solid rgba(212, 175, 55, 0.35);
      border-radius: var(--radius-lg);
      background: radial-gradient(circle at center, rgba(106, 22, 36, 0.5) 0%, rgba(30, 5, 10, 0.8) 100%);
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(212, 175, 55, 0.15);
    }

    .invite-banner-tag {
      font-family: var(--font-serif-royal);
      font-size: 0.85rem;
      letter-spacing: 0.25em;
      color: var(--gold-lightest);
      text-transform: uppercase;
      display: block;
      margin-bottom: 8px;
    }

    .invite-banner-heading {
      font-family: var(--font-serif-classic);
      font-size: 1.8rem;
      color: #fff;
      margin-bottom: 10px;
      font-weight: 500;
    }

    .invite-banner-sub {
      font-size: 0.95rem;
      color: #f3d8c7;
      margin-bottom: 24px;
      line-height: 1.6;
    }

    .footer-rsvp-btn {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 14px 38px;
      background: var(--gold-gradient);
      color: var(--royal-burgundy-darkest);
      font-family: var(--font-serif-royal);
      font-size: 0.95rem;
      font-weight: 700;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      border: none;
      border-radius: var(--radius-full);
      cursor: pointer;
      box-shadow: 0 8px 25px rgba(212, 175, 55, 0.4);
      transition: var(--transition-smooth);
    }

    .footer-rsvp-btn:hover {
      transform: translateY(-3px) scale(1.03);
      box-shadow: 0 12px 35px rgba(212, 175, 55, 0.6);
      filter: brightness(1.1);
    }

    .btn-heart {
      color: var(--royal-burgundy);
      font-size: 1.1rem;
    }

    /* Ornate Divider */
    .footer-divider-ornate {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;
      margin-bottom: 40px;
    }

    .ornate-line-gold {
      flex: 1;
      max-width: 280px;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.6), transparent);
    }

    .footer-monogram-circle {
      width: 54px;
      height: 54px;
      border-radius: 50%;
      border: 1.5px solid var(--gold-main);
      background: var(--royal-burgundy);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--gold-lightest);
      font-family: var(--font-serif-royal);
      font-weight: 700;
      font-size: 0.9rem;
      box-shadow: 0 0 15px rgba(212, 175, 55, 0.3);
    }

    /* Footer Grid */
    .footer-grid {
      display: grid;
      grid-template-columns: 1fr 1.3fr 1fr;
      gap: 30px;
      margin-bottom: 50px;
      text-align: center;
    }

    .col-title {
      font-family: var(--font-serif-royal);
      font-size: 0.85rem;
      letter-spacing: 0.15em;
      color: var(--gold-main);
      text-transform: uppercase;
      margin-bottom: 6px;
    }

    .col-family-name {
      font-family: var(--font-serif-royal);
      font-size: 1.15rem;
      color: var(--gold-lightest);
      font-weight: 600;
      margin-bottom: 6px;
    }

    .col-text {
      font-size: 0.85rem;
      color: #e0d0c3;
      line-height: 1.6;
    }

    .col-sub {
      font-size: 0.82rem;
      color: var(--gold-light);
      margin-top: 4px;
    }

    .couple-title-script {
      font-family: var(--font-script);
      font-size: 3.5rem;
      color: var(--gold-lightest);
      line-height: 1;
      margin-bottom: 8px;
      text-shadow: 0 0 20px rgba(212, 175, 55, 0.4);
    }

    .wedding-date-text {
      font-family: var(--font-serif-royal);
      font-size: 0.95rem;
      letter-spacing: 0.25em;
      color: var(--gold-main);
      font-weight: 700;
      margin-bottom: 6px;
    }

    .venue-loc {
      font-size: 0.88rem;
      color: #e8dcd0;
      margin-bottom: 12px;
    }

    .hashtag-badge {
      display: inline-block;
      padding: 4px 16px;
      border: 1px dashed rgba(212, 175, 55, 0.4);
      border-radius: var(--radius-full);
      font-size: 0.8rem;
      letter-spacing: 0.08em;
      color: var(--gold-light);
      background: rgba(0, 0, 0, 0.2);
    }

    /* Footer Bottom */
    .footer-bottom {
      padding-top: 24px;
      border-top: 1px solid rgba(212, 175, 55, 0.2);
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
    }

    .copyright-text {
      font-size: 0.82rem;
      color: #bfaea5;
    }

    .scroll-top-btn {
      background: transparent;
      border: 1px solid rgba(212, 175, 55, 0.4);
      color: var(--gold-main);
      font-family: var(--font-serif-royal);
      font-size: 0.78rem;
      letter-spacing: 0.08em;
      padding: 6px 16px;
      border-radius: var(--radius-full);
      cursor: pointer;
      transition: all 0.25s ease;
    }

    .scroll-top-btn:hover {
      background: rgba(212, 175, 55, 0.15);
      color: var(--gold-lightest);
    }

    @media (max-width: 860px) {
      .footer-grid {
        grid-template-columns: 1fr;
        gap: 30px;
      }
      .couple-title-script {
        font-size: 2.8rem;
      }
      .footer-bottom {
        flex-direction: column;
        text-align: center;
      }
    }
  `]
})
export class FooterComponent {
  @Output() openRsvp = new EventEmitter<void>();
  private smoothScroll = inject(SmoothScrollService);

  scrollToTop() {
    this.smoothScroll.scrollTo('#hero', 0);
  }
}
