import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeddingDataService, MinimalGalleryItem, MinimalEvent } from '../../core/services/wedding-data.service';
import { SmoothScrollService } from '../../core/services/smooth-scroll.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  weddingData = inject(WeddingDataService);
  private smoothScroll = inject(SmoothScrollService);

  // Active event in timeline tab
  readonly activeEvent = signal<MinimalEvent>(this.weddingData.events[0]);

  // Gallery Lightbox State
  readonly activeLightboxItem = signal<MinimalGalleryItem | null>(null);

  // Luxury RSVP Form State
  rsvpName = '';
  rsvpGuests = '2 Guests';
  rsvpAttendance: 'attending' | 'declining' = 'attending';
  rsvpMessage = '';
  readonly isRsvpSubmitted = signal<boolean>(false);

  setActiveEvent(event: MinimalEvent) {
    this.activeEvent.set(event);
  }

  openLightbox(item: MinimalGalleryItem) {
    this.activeLightboxItem.set(item);
  }

  closeLightbox() {
    this.activeLightboxItem.set(null);
  }

  submitRsvp() {
    if (!this.rsvpName.trim()) return;

    this.weddingData.submitRsvp({
      name: this.rsvpName.trim(),
      guestsCount: this.rsvpGuests,
      attendance: this.rsvpAttendance,
      message: this.rsvpMessage.trim(),
      createdAt: new Date().toISOString()
    });

    this.isRsvpSubmitted.set(true);
  }

  scrollTo(target: string, event?: Event) {
    if (event) event.preventDefault();
    this.smoothScroll.scrollTo(target, -60);
  }
}
