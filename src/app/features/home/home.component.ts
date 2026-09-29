import { Component, OnInit, OnDestroy, inject, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeddingDataService } from '../../core/services/wedding-data.service';
import { PetalsService } from '../../core/services/petals.service';
import { SmoothScrollService } from '../../core/services/smooth-scroll.service';
import { WeddingEvent, MomentPhoto, GuestWish, RsvpSubmission } from '../../core/models/wedding.models';
import { EventModalComponent } from '../../shared/components/event-modal/event-modal.component';
import { RsvpModalComponent } from '../../shared/components/rsvp-modal/rsvp-modal.component';
import { StoryModalComponent } from '../../shared/components/story-modal/story-modal.component';

interface CountdownTime {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    EventModalComponent,
    RsvpModalComponent,
    StoryModalComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  weddingData = inject(WeddingDataService);
  petalsService = inject(PetalsService);
  private smoothScroll = inject(SmoothScrollService);

  // Countdown timer state
  readonly countdown = signal<CountdownTime>({
    days: '120',
    hours: '08',
    minutes: '24',
    seconds: '36'
  });
  private timerInterval: ReturnType<typeof setInterval> | null = null;

  // Selected event for modal
  readonly selectedEvent = signal<WeddingEvent | null>(null);

  // Modals state
  readonly isRsvpModalOpen = signal<boolean>(false);
  readonly isStoryModalOpen = signal<boolean>(false);
  readonly activeLightboxPhoto = signal<MomentPhoto | null>(null);

  // Gallery filter
  readonly selectedGalleryCategory = signal<string>('all');

  // Wishes Form state
  wishName = '';
  wishRelation = '';
  wishMessage = '';
  selectedEmoji = '🌸';
  readonly availableEmojis = ['🌸', '✨', '🪔', '💐', '💍', '🦚', '❤️'];

  // RSVP Inline Form State
  inlineRsvpData: RsvpSubmission = {
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
  readonly isInlineRsvpSubmitted = signal<boolean>(false);

  // Gallery slider ref
  @ViewChild('gallerySlider') gallerySliderRef?: ElementRef<HTMLDivElement>;

  ngOnInit() {
    this.updateCountdown();
    this.timerInterval = setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  private updateCountdown() {
    const target = this.weddingData.weddingDate.getTime();
    const now = new Date().getTime();
    const diff = target - now;

    if (diff > 0) {
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      this.countdown.set({
        days: days.toString().padStart(2, '0'),
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0')
      });
    } else {
      this.countdown.set({ days: '00', hours: '00', minutes: '00', seconds: '00' });
    }
  }

  openEventModal(event: WeddingEvent) {
    this.selectedEvent.set(event);
  }

  closeEventModal() {
    this.selectedEvent.set(null);
  }

  openRsvpModal() {
    this.isRsvpModalOpen.set(true);
  }

  closeRsvpModal() {
    this.isRsvpModalOpen.set(false);
  }

  openStoryModal() {
    this.isStoryModalOpen.set(true);
  }

  closeStoryModal() {
    this.isStoryModalOpen.set(false);
  }

  openLightbox(photo: MomentPhoto) {
    this.activeLightboxPhoto.set(photo);
  }

  closeLightbox() {
    this.activeLightboxPhoto.set(null);
  }

  filterGallery(cat: string) {
    this.selectedGalleryCategory.set(cat);
  }

  get filteredMoments(): MomentPhoto[] {
    const cat = this.selectedGalleryCategory();
    if (cat === 'all') return this.weddingData.moments;
    return this.weddingData.moments.filter(m => m.category === cat);
  }

  scrollGallery(direction: 'left' | 'right') {
    if (this.gallerySliderRef?.nativeElement) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      this.gallerySliderRef.nativeElement.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

  submitWish() {
    if (!this.wishName.trim() || !this.wishMessage.trim()) return;
    this.weddingData.addWish(this.wishName, this.wishRelation, this.wishMessage, this.selectedEmoji);
    this.petalsService.burst(70);
    this.wishName = '';
    this.wishRelation = '';
    this.wishMessage = '';
  }

  toggleWishLike(id: string) {
    this.weddingData.toggleLikeWish(id);
  }

  toggleInlineEvent(name: string) {
    const idx = this.inlineRsvpData.attendingEvents.indexOf(name);
    if (idx >= 0) {
      this.inlineRsvpData.attendingEvents.splice(idx, 1);
    } else {
      this.inlineRsvpData.attendingEvents.push(name);
    }
  }

  isInlineEventSelected(name: string): boolean {
    return this.inlineRsvpData.attendingEvents.includes(name);
  }

  submitInlineRsvp() {
    if (!this.inlineRsvpData.name || !this.inlineRsvpData.phone) return;
    this.weddingData.submitRsvp(this.inlineRsvpData);
    this.petalsService.burst(90);
    this.isInlineRsvpSubmitted.set(true);
  }

  scrollTo(target: string, event?: Event) {
    if (event) event.preventDefault();
    this.smoothScroll.scrollTo(target, -80);
  }
}
