import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="luxury-minimal-footer">
      <div class="container-minimal footer-content">
        <span class="footer-monogram">A · V</span>
        <h2 class="footer-names">Anshul &amp; Vidisha</h2>
        <div class="footer-details">
          <span>15 February 2026</span>
          <span class="footer-dot">·</span>
          <span>The Royal Greens, Jaipur</span>
        </div>
        <p class="footer-closing-note">
          With the blessings of our families, we look forward to celebrating together.
        </p>
      </div>
    </footer>
  `,
  styles: [`
    .luxury-minimal-footer {
      background-color: var(--bg-dark);
      color: #FFFFFF;
      padding: clamp(80px, 10vw, 120px) 0 clamp(50px, 6vw, 70px);
      text-align: center;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }

    .footer-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      max-width: 600px;
    }

    .footer-monogram {
      font-family: var(--font-serif-display);
      font-size: 0.95rem;
      letter-spacing: 0.35em;
      color: var(--gold-accent);
      margin-bottom: 20px;
      display: block;
    }

    .footer-names {
      font-family: var(--font-serif-display);
      font-size: clamp(2rem, 3.5vw, 2.8rem);
      font-weight: 400;
      letter-spacing: 0.12em;
      color: #FFFFFF;
      margin-bottom: 16px;
    }

    .footer-details {
      display: flex;
      align-items: center;
      gap: 12px;
      font-family: var(--font-sans);
      font-size: 0.82rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.65);
      margin-bottom: 28px;
    }

    .footer-dot {
      color: var(--gold-accent);
    }

    .footer-closing-note {
      font-family: var(--font-serif-editorial);
      font-style: italic;
      font-size: 1rem;
      color: rgba(255, 255, 255, 0.5);
      line-height: 1.8;
      max-width: 480px;
    }

    @media (max-width: 640px) {
      .footer-details {
        flex-direction: column;
        gap: 6px;
      }
      .footer-dot {
        display: none;
      }
    }
  `]
})
export class FooterComponent {}
