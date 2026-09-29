import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeddingEvent } from '../../../core/models/wedding.models';
import { WeddingDataService } from '../../../core/services/wedding-data.service';

@Component({
  selector: 'app-event-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-backdrop" *ngIf="event" (click)="onBackdropClick($event)">
      <div class="modal-card">
        <!-- Close Button -->
        <button type="button" class="close-btn" (click)="close.emit()" aria-label="Close modal">✕</button>

        <div class="modal-scroll-body">
          <!-- Event Header Banner -->
          <div class="event-header-banner">
            <div class="banner-overlay"></div>
            <img [src]="event.image" [alt]="event.title" class="banner-img">
            <div class="banner-content">
              <span class="hindi-tag">{{ event.hindiTitle }}</span>
              <h2 class="event-main-title">{{ event.title }}</h2>
              <p class="event-day-time">{{ event.day }} · {{ event.date }} · {{ event.time }}</p>
            </div>
          </div>

          <div class="modal-content-area">
            <!-- Venue Info Badge -->
            <div class="venue-badge">
              <span class="venue-pin">📍</span>
              <div class="venue-details">
                <span class="venue-name">{{ event.venue }}</span>
                <span class="venue-address">{{ event.address }}</span>
              </div>
            </div>

            <!-- Description -->
            <p class="event-desc">{{ event.description }}</p>

            <!-- Highlights -->
            <div class="section-block">
              <h4 class="section-title">
                <span class="title-motif">❦</span>
                <span>Celebration Highlights</span>
              </h4>
              <ul class="highlights-list">
                <li *ngFor="let h of event.highlights">
                  <span class="check-bullet">✦</span>
                  <span>{{ h }}</span>
                </li>
              </ul>
            </div>

            <!-- Dress Code & Color Palette -->
            <div class="section-block">
              <h4 class="section-title">
                <span class="title-motif">❦</span>
                <span>Attire & Color Palette</span>
              </h4>
              <div class="attire-box">
                <span class="dress-label">Recommended Dress Code:</span>
                <span class="dress-value">{{ event.dressCode }}</span>
                <p class="theme-note">{{ event.themeNote }}</p>

                <!-- Color Swatches -->
                <div class="swatches-row">
                  <div *ngFor="let color of event.colorPalette" class="swatch-item">
                    <span class="color-circle" [style.background-color]="color.hex"></span>
                    <span class="color-name">{{ color.name }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="modal-actions">
              <button type="button" class="btn-royal-primary" (click)="weddingData.downloadCalendarFile(event)">
                <span>📥 Add to Calendar (.ics)</span>
              </button>
              <a 
                [href]="weddingData.getGoogleCalendarUrl(event)" 
                target="_blank" 
                rel="noopener" 
                class="btn-royal-secondary">
                <span>📅 Google Calendar</span>
              </a>
              <a 
                href="https://maps.google.com/?q=The+Royal+Greens+Tonk+Road+Jaipur" 
                target="_blank" 
                rel="noopener" 
                class="btn-royal-secondary">
                <span>🗺️ Navigate Venue</span>
              </a>
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
      animation: fadeIn 0.3s ease;
    }

    .modal-card {
      background: var(--parchment-lightest);
      width: 100%;
      max-width: 680px;
      max-height: 90vh;
      border-radius: var(--radius-lg);
      border: 1.5px solid var(--gold-main);
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5), var(--gold-glow);
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      animation: slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .modal-scroll-body {
      overflow-y: auto;
      max-height: 90vh;
    }

    .close-btn {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: rgba(30, 5, 10, 0.7);
      border: 1px solid var(--gold-main);
      color: var(--gold-lightest);
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
      transform: scale(1.1);
    }

    /* Event Header Banner */
    .event-header-banner {
      position: relative;
      height: 240px;
      overflow: hidden;
    }

    .banner-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .banner-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(180deg, rgba(30, 5, 10, 0.2) 0%, rgba(30, 5, 10, 0.88) 100%);
    }

    .banner-content {
      position: absolute;
      bottom: 20px;
      left: 24px;
      right: 24px;
    }

    .hindi-tag {
      font-size: 0.95rem;
      color: var(--gold-lightest);
      font-family: var(--font-serif-royal);
      letter-spacing: 0.1em;
      display: block;
      margin-bottom: 4px;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
    }

    .event-main-title {
      font-family: var(--font-serif-royal);
      font-size: 2.2rem;
      color: var(--gold-lightest);
      letter-spacing: 0.08em;
      margin-bottom: 6px;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.7);
    }

    .event-day-time {
      color: var(--gold-light);
      font-size: 0.95rem;
      font-weight: 500;
      letter-spacing: 0.06em;
    }

    /* Modal Content */
    .modal-content-area {
      padding: 28px;
    }

    .venue-badge {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      background: rgba(212, 175, 55, 0.1);
      border: 1px solid rgba(212, 175, 55, 0.35);
      border-radius: var(--radius-md);
      padding: 14px 18px;
      margin-bottom: 20px;
    }

    .venue-pin {
      font-size: 1.4rem;
    }

    .venue-details {
      display: flex;
      flex-direction: column;
    }

    .venue-name {
      font-family: var(--font-serif-royal);
      font-weight: 700;
      color: var(--royal-burgundy);
      font-size: 1rem;
    }

    .venue-address {
      font-size: 0.85rem;
      color: var(--text-muted);
    }

    .event-desc {
      font-size: 1rem;
      line-height: 1.8;
      color: var(--text-dark);
      margin-bottom: 24px;
    }

    .section-block {
      margin-bottom: 24px;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: var(--font-serif-royal);
      font-size: 1.1rem;
      color: var(--royal-burgundy);
      margin-bottom: 14px;
    }

    .title-motif {
      color: var(--gold-main);
    }

    .highlights-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .highlights-list li {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      font-size: 0.92rem;
      color: var(--text-dark);
    }

    .check-bullet {
      color: var(--gold-antique);
      font-size: 0.8rem;
      margin-top: 3px;
    }

    .attire-box {
      background: #fbf7ee;
      border: 1px solid var(--parchment-border);
      border-radius: var(--radius-md);
      padding: 16px 20px;
    }

    .dress-label {
      font-size: 0.85rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--royal-burgundy);
      margin-right: 8px;
    }

    .dress-value {
      font-family: var(--font-serif-royal);
      font-weight: 700;
      color: var(--royal-burgundy-light);
    }

    .theme-note {
      font-size: 0.88rem;
      color: var(--text-muted);
      margin: 8px 0 16px;
    }

    .swatches-row {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
    }

    .swatch-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .color-circle {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 2px solid #fff;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    }

    .color-name {
      font-size: 0.82rem;
      color: var(--text-dark);
      font-weight: 500;
    }

    .modal-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      padding-top: 14px;
      border-top: 1px solid var(--parchment-border);
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(30px) scale(0.97); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    @media (max-width: 600px) {
      .modal-card {
        max-height: 95vh;
      }
      .event-header-banner {
        height: 180px;
      }
      .event-main-title {
        font-size: 1.6rem;
      }
      .modal-content-area {
        padding: 20px 16px;
      }
      .modal-actions {
        flex-direction: column;
      }
      .modal-actions button, .modal-actions a {
        width: 100%;
        text-align: center;
      }
    }
  `]
})
export class EventModalComponent {
  @Input() event: WeddingEvent | null = null;
  @Output() close = new EventEmitter<void>();

  weddingData = inject(WeddingDataService);

  onBackdropClick(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.close.emit();
    }
  }
}
