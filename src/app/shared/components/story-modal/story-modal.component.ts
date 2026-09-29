import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeddingDataService } from '../../../core/services/wedding-data.service';

@Component({
  selector: 'app-story-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-backdrop" (click)="onBackdropClick($event)">
      <div class="modal-card">
        <!-- Close Button -->
        <button type="button" class="close-btn" (click)="close.emit()" aria-label="Close modal">✕</button>

        <div class="modal-scroll-body">
          <div class="story-header">
            <span class="story-tag">THE CHRONICLES OF LOVE</span>
            <h2 class="story-title">How Our Stars Aligned</h2>
            <p class="story-subtitle">The serendipitous journey of Anshul & Vidisha from two strangers to one soul</p>
            <div class="ornate-divider">
              <span class="ornate-line"></span>
              <span class="ornate-motif">❦</span>
              <span class="ornate-line"></span>
            </div>
          </div>

          <!-- Story Photo Banner -->
          <div class="story-img-banner">
            <img src="assets/images/couple-story.jpg" alt="Anshul and Vidisha Twilight in Jaipur" class="story-banner-pic">
            <div class="story-quote-card">
              <p>"In a city steeped in historic tales of kings and queens, we found our very own forever."</p>
            </div>
          </div>

          <!-- Timeline of Milestones -->
          <div class="timeline-container">
            <div *ngFor="let chapter of weddingData.storyChapters; let i = index" class="timeline-item">
              <div class="timeline-bullet">
                <span>0{{ i + 1 }}</span>
              </div>
              <div class="timeline-content">
                <div class="timeline-meta">
                  <span class="timeline-year">{{ chapter.year }}</span>
                  <span class="timeline-loc">📍 {{ chapter.location }}</span>
                </div>
                <h4 class="chapter-title">{{ chapter.title }}</h4>
                <p class="chapter-desc">{{ chapter.description }}</p>
              </div>
            </div>
          </div>

          <!-- Footer Blessing -->
          <div class="story-footer">
            <p class="footer-msg">
              "We thank the Almighty, our beloved parents, and all of you for being the sweetest part of our story. See you in Jaipur!"
            </p>
            <div class="signatures">
              <span class="sig-name">Anshul</span>
              <span class="sig-heart">♥</span>
              <span class="sig-name">Vidisha</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(30, 5, 10, 0.85);
      backdrop-filter: blur(10px);
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .modal-card {
      background: var(--parchment-lightest);
      width: 100%;
      max-width: 720px;
      max-height: 92vh;
      border-radius: var(--radius-lg);
      border: 1.5px solid var(--gold-main);
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5), var(--gold-glow);
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .modal-scroll-body {
      overflow-y: auto;
      padding: 36px 30px;
    }

    .close-btn {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(74, 14, 23, 0.15);
      border: 1px solid var(--gold-main);
      color: var(--royal-burgundy);
      font-size: 1.1rem;
      cursor: pointer;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.25s ease;
    }

    .close-btn:hover {
      background: var(--royal-burgundy);
      color: var(--gold-lightest);
    }

    .story-header {
      text-align: center;
      margin-bottom: 24px;
    }

    .story-tag {
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.2em;
      color: var(--gold-antique);
      text-transform: uppercase;
    }

    .story-title {
      font-family: var(--font-serif-royal);
      font-size: 2.2rem;
      color: var(--royal-burgundy);
      margin: 6px 0;
    }

    .story-subtitle {
      font-size: 0.95rem;
      color: var(--text-muted);
      max-width: 520px;
      margin: 0 auto;
    }

    .story-img-banner {
      position: relative;
      border-radius: var(--radius-md);
      overflow: hidden;
      margin-bottom: 30px;
      border: 1px solid var(--parchment-border);
    }

    .story-banner-pic {
      width: 100%;
      height: 260px;
      object-fit: cover;
      display: block;
    }

    .story-quote-card {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 16px 20px;
      background: linear-gradient(180deg, transparent 0%, rgba(30, 5, 10, 0.9) 100%);
      color: var(--gold-lightest);
      font-family: var(--font-serif-classic);
      font-style: italic;
      font-size: 0.95rem;
      text-align: center;
    }

    /* Timeline */
    .timeline-container {
      position: relative;
      padding-left: 36px;
      margin-bottom: 30px;
    }

    .timeline-container::before {
      content: '';
      position: absolute;
      top: 10px;
      bottom: 10px;
      left: 14px;
      width: 2px;
      background: linear-gradient(180deg, var(--gold-main) 0%, var(--parchment-border) 100%);
    }

    .timeline-item {
      position: relative;
      margin-bottom: 26px;
    }

    .timeline-item:last-child {
      margin-bottom: 0;
    }

    .timeline-bullet {
      position: absolute;
      left: -36px;
      top: 0;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: var(--royal-burgundy);
      border: 2px solid var(--gold-main);
      color: var(--gold-lightest);
      font-family: var(--font-serif-royal);
      font-size: 0.72rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 10px rgba(212, 175, 55, 0.3);
    }

    .timeline-meta {
      display: flex;
      gap: 12px;
      margin-bottom: 4px;
    }

    .timeline-year {
      font-size: 0.78rem;
      font-weight: 700;
      color: var(--gold-dark);
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .timeline-loc {
      font-size: 0.78rem;
      color: var(--text-muted);
    }

    .chapter-title {
      font-family: var(--font-serif-royal);
      font-size: 1.15rem;
      color: var(--royal-burgundy);
      margin-bottom: 6px;
    }

    .chapter-desc {
      font-size: 0.92rem;
      color: var(--text-dark);
      line-height: 1.7;
    }

    /* Story Footer */
    .story-footer {
      text-align: center;
      padding-top: 20px;
      border-top: 1px solid var(--parchment-border);
    }

    .footer-msg {
      font-family: var(--font-serif-classic);
      font-style: italic;
      font-size: 0.95rem;
      color: var(--text-muted);
      margin-bottom: 12px;
    }

    .signatures {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
    }

    .sig-name {
      font-family: var(--font-script);
      font-size: 2.2rem;
      color: var(--royal-burgundy);
    }

    .sig-heart {
      color: var(--gold-main);
      font-size: 1.2rem;
    }

    @media (max-width: 600px) {
      .modal-scroll-body {
        padding: 24px 16px;
      }
      .story-title {
        font-size: 1.7rem;
      }
      .story-banner-pic {
        height: 180px;
      }
    }
  `]
})
export class StoryModalComponent {
  @Output() close = new EventEmitter<void>();
  weddingData = inject(WeddingDataService);

  onBackdropClick(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.close.emit();
    }
  }
}
