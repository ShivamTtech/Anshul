import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeddingDataService } from '../../../core/services/wedding-data.service';
import { PetalsService } from '../../../core/services/petals.service';
import { RsvpSubmission } from '../../../core/models/wedding.models';

@Component({
  selector: 'app-rsvp-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-backdrop" (click)="onBackdropClick($event)">
      <div class="modal-card">
        <!-- Close Button -->
        <button type="button" class="close-btn" (click)="close.emit()" aria-label="Close modal">✕</button>

        <div class="modal-scroll-body">
          <!-- Royal Monogram Header -->
          <div class="modal-header">
            <div class="royal-crest-mini">
              <span>A ❦ V</span>
            </div>
            <h2 class="modal-title">RSVP</h2>
            <p class="modal-subtitle">Kindly confirm your presence for the wedding celebrations of Anshul & Vidisha</p>
            <div class="ornate-divider">
              <span class="ornate-line"></span>
              <span class="ornate-motif">❖</span>
              <span class="ornate-line"></span>
            </div>
          </div>

          <!-- Success State: Royal Digital Pass -->
          <div *ngIf="isSubmitted()" class="rsvp-success-card">
            <div class="stamp-seal">
              <span>CONFIRMED</span>
            </div>
            <div class="success-icon">💐</div>
            <h3 class="success-title">Dhanyawaad! Your RSVP is Confirmed</h3>
            <p class="success-msg">
              We are overjoyed to welcome you, <strong>{{ formData.name }}</strong>! Your presence will add warmth and immense joy to our special days.
            </p>
            <div class="pass-details">
              <div class="pass-row">
                <span>Guest Count:</span>
                <strong>{{ formData.guestsCount }} Person(s)</strong>
              </div>
              <div class="pass-row">
                <span>Events Attending:</span>
                <strong>{{ formData.attendingEvents.join(', ') }}</strong>
              </div>
              <div class="pass-row">
                <span>Venue:</span>
                <strong>The Royal Greens, Jaipur</strong>
              </div>
            </div>
            <p class="reminder-text">A confirmation note has been saved. See you in Jaipur!</p>
            <button type="button" class="btn-royal-primary" (click)="close.emit()">
              <span>Close & Return to Invitation</span>
            </button>
          </div>

          <!-- RSVP Form -->
          <form *ngIf="!isSubmitted()" (ngSubmit)="onSubmit()" class="rsvp-form">
            <!-- Full Name -->
            <div class="form-group">
              <label for="rsvpName">Your Full Name *</label>
              <input 
                id="rsvpName" 
                type="text" 
                [(ngModel)]="formData.name" 
                name="name" 
                placeholder="e.g. Ramesh Kumar Sharma" 
                required>
            </div>

            <!-- Phone & Email -->
            <div class="form-row-2">
              <div class="form-group">
                <label for="rsvpPhone">WhatsApp / Mobile *</label>
                <input 
                  id="rsvpPhone" 
                  type="tel" 
                  [(ngModel)]="formData.phone" 
                  name="phone" 
                  placeholder="+91 98765 43210" 
                  required>
              </div>
              <div class="form-group">
                <label for="rsvpEmail">Email Address</label>
                <input 
                  id="rsvpEmail" 
                  type="email" 
                  [(ngModel)]="formData.email" 
                  name="email" 
                  placeholder="ramesh@example.com">
              </div>
            </div>

            <!-- Guests Count & Food -->
            <div class="form-row-2">
              <div class="form-group">
                <label for="rsvpGuests">Number of Guests *</label>
                <select id="rsvpGuests" [(ngModel)]="formData.guestsCount" name="guestsCount">
                  <option [ngValue]="1">1 Person</option>
                  <option [ngValue]="2">2 Persons</option>
                  <option [ngValue]="3">3 Persons</option>
                  <option [ngValue]="4">4 Persons</option>
                  <option [ngValue]="5">5+ Family</option>
                </select>
              </div>

              <div class="form-group">
                <label for="rsvpFood">Dietary Preference</label>
                <select id="rsvpFood" [(ngModel)]="formData.foodPreference" name="foodPreference">
                  <option value="pure-veg">Pure Vegetarian</option>
                  <option value="jain-veg">Jain Vegetarian</option>
                  <option value="all">All Traditional Delicacies</option>
                </select>
              </div>
            </div>

            <!-- Attending Events Multi-Check -->
            <div class="form-group">
              <label class="section-label">Select Celebrations You Will Attend *</label>
              <div class="events-checkbox-grid">
                <label *ngFor="let ev of availableEvents" class="checkbox-card" [class.checked]="isEventSelected(ev.name)">
                  <input 
                    type="checkbox" 
                    [checked]="isEventSelected(ev.name)"
                    (change)="toggleEvent(ev.name)">
                  <div class="check-info">
                    <span class="ev-name">{{ ev.name }}</span>
                    <span class="ev-date">{{ ev.date }}</span>
                  </div>
                </label>
              </div>
            </div>

            <!-- Song Request for DJ -->
            <div class="form-group">
              <label for="rsvpSong">Song You Want to Dance to at Sangeet! 🎵</label>
              <input 
                id="rsvpSong" 
                type="text" 
                [(ngModel)]="formData.songRequest" 
                name="songRequest" 
                placeholder="e.g. Gallan Goodiyaan, Nachde Ne Saare...">
            </div>

            <!-- Heartfelt Note -->
            <div class="form-group">
              <label for="rsvpMessage">Special Note / Blessings for the Couple</label>
              <textarea 
                id="rsvpMessage" 
                [(ngModel)]="formData.message" 
                name="message" 
                rows="3" 
                placeholder="Write a sweet message for Anshul & Vidisha..."></textarea>
            </div>

            <div class="form-actions">
              <button 
                type="submit" 
                class="btn-royal-primary submit-btn" 
                [disabled]="!formData.name || !formData.phone || formData.attendingEvents.length === 0">
                <span>Confirm My Attendance (RSVP) 💌</span>
              </button>
            </div>
          </form>
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
      max-width: 620px;
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
      padding: 32px 28px;
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

    .modal-header {
      text-align: center;
      margin-bottom: 24px;
    }

    .royal-crest-mini {
      display: inline-block;
      padding: 4px 14px;
      border: 1px solid var(--gold-main);
      border-radius: 20px;
      background: rgba(74, 14, 23, 0.08);
      font-family: var(--font-serif-royal);
      color: var(--royal-burgundy);
      font-weight: 700;
      font-size: 0.85rem;
      margin-bottom: 8px;
    }

    .modal-title {
      font-family: var(--font-serif-royal);
      font-size: 2.2rem;
      color: var(--royal-burgundy);
      letter-spacing: 0.1em;
      margin-bottom: 4px;
    }

    .modal-subtitle {
      font-size: 0.92rem;
      color: var(--text-muted);
      max-width: 480px;
      margin: 0 auto;
    }

    .rsvp-form {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-group label, .section-label {
      font-size: 0.82rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--royal-burgundy);
    }

    .form-row-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    input[type="text"],
    input[type="tel"],
    input[type="email"],
    select,
    textarea {
      width: 100%;
      padding: 12px 16px;
      border: 1.5px solid var(--parchment-border);
      border-radius: var(--radius-sm);
      background: #fff;
      font-family: var(--font-body);
      font-size: 0.92rem;
      color: var(--text-dark);
      transition: all 0.25s ease;
      outline: none;
    }

    input:focus, select:focus, textarea:focus {
      border-color: var(--gold-main);
      box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.2);
    }

    /* Checkbox Cards */
    .events-checkbox-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    .checkbox-card {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      border: 1px solid var(--parchment-border);
      border-radius: var(--radius-sm);
      background: #faf6f0;
      cursor: pointer;
      transition: all 0.25s ease;
    }

    .checkbox-card.checked {
      background: #fdf5e6;
      border-color: var(--gold-main);
      box-shadow: 0 2px 8px rgba(212, 175, 55, 0.15);
    }

    .checkbox-card input[type="checkbox"] {
      accent-color: var(--royal-burgundy);
      width: 16px;
      height: 16px;
    }

    .check-info {
      display: flex;
      flex-direction: column;
    }

    .ev-name {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--royal-burgundy);
    }

    .ev-date {
      font-size: 0.74rem;
      color: var(--text-muted);
    }

    .submit-btn {
      width: 100%;
      padding: 16px;
      font-size: 0.95rem;
      margin-top: 10px;
    }

    .submit-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    /* Success State */
    .rsvp-success-card {
      text-align: center;
      padding: 24px 16px;
      position: relative;
    }

    .stamp-seal {
      display: inline-block;
      border: 2px dashed var(--gold-antique);
      color: var(--gold-antique);
      font-family: var(--font-serif-royal);
      font-size: 0.85rem;
      letter-spacing: 0.2em;
      padding: 4px 16px;
      border-radius: 4px;
      transform: rotate(-6deg);
      margin-bottom: 16px;
    }

    .success-icon {
      font-size: 3.5rem;
      margin-bottom: 12px;
      animation: pulseGlow 2s infinite alternate;
    }

    .success-title {
      font-family: var(--font-serif-royal);
      font-size: 1.5rem;
      color: var(--royal-burgundy);
      margin-bottom: 10px;
    }

    .success-msg {
      font-size: 0.95rem;
      color: var(--text-dark);
      margin-bottom: 20px;
      line-height: 1.7;
    }

    .pass-details {
      background: #fbf7ee;
      border: 1px solid var(--gold-main);
      border-radius: var(--radius-md);
      padding: 16px 20px;
      margin-bottom: 24px;
      text-align: left;
    }

    .pass-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      border-bottom: 1px dashed rgba(212, 175, 55, 0.4);
      font-size: 0.88rem;
    }

    .pass-row:last-child {
      border-bottom: none;
    }

    .pass-row span {
      color: var(--text-muted);
    }

    .pass-row strong {
      color: var(--royal-burgundy);
    }

    .reminder-text {
      font-size: 0.88rem;
      color: var(--gold-dark);
      font-weight: 600;
      margin-bottom: 20px;
    }

    @media (max-width: 600px) {
      .form-row-2, .events-checkbox-grid {
        grid-template-columns: 1fr;
      }
      .modal-scroll-body {
        padding: 24px 16px;
      }
    }
  `]
})
export class RsvpModalComponent {
  @Output() close = new EventEmitter<void>();

  private weddingData = inject(WeddingDataService);
  private petalsService = inject(PetalsService);

  readonly isSubmitted = signal<boolean>(false);

  availableEvents = [
    { name: 'Mehendi Ceremony', date: '13 Feb 2026, 4:00 PM' },
    { name: 'Sangeet Extravaganza', date: '14 Feb 2026, 6:00 PM' },
    { name: 'Wedding (Pheras)', date: '15 Feb 2026, 7:00 PM' },
    { name: 'Reception Gala', date: '16 Feb 2026, 7:00 PM' }
  ];

  formData: RsvpSubmission = {
    name: '',
    phone: '',
    email: '',
    guestsCount: 2,
    attendingEvents: ['Wedding (Pheras)', 'Reception Gala'],
    foodPreference: 'pure-veg',
    songRequest: '',
    message: '',
    createdAt: ''
  };

  isEventSelected(name: string): boolean {
    return this.formData.attendingEvents.includes(name);
  }

  toggleEvent(name: string) {
    const idx = this.formData.attendingEvents.indexOf(name);
    if (idx >= 0) {
      this.formData.attendingEvents.splice(idx, 1);
    } else {
      this.formData.attendingEvents.push(name);
    }
  }

  onSubmit() {
    if (!this.formData.name || !this.formData.phone) return;
    this.weddingData.submitRsvp(this.formData);
    this.petalsService.burst(80);
    this.isSubmitted.set(true);
  }

  onBackdropClick(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.close.emit();
    }
  }
}
