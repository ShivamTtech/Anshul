import { Injectable, signal } from '@angular/core';

export interface MinimalEvent {
  id: string;
  name: string;
  dayDate: string;
  time: string;
  venue: string;
  dressCode: string;
  image: string;
}

export interface MinimalStoryPoint {
  index: string;
  title: string;
  caption: string;
  location: string;
}

export interface MinimalGalleryItem {
  id: number;
  title: string;
  image: string;
}

export interface MinimalRsvpSubmission {
  name: string;
  guestsCount: string;
  attendance: 'attending' | 'declining';
  message?: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class WeddingDataService {
  // Couple Profile: Name, One-line introduction, Short story (max 2-3 lines)
  readonly groom = {
    name: 'Anshul Sharma',
    subtitle: 'The Groom',
    intro: 'Architect & traveler with an appreciation for quiet beauty.',
    story: 'In Vidisha, he found a gentle soul that turned every fleeting instant into a timeless home.',
    image: 'assets/images/couple-hero.jpg'
  };

  readonly bride = {
    name: 'Vidisha Gupta',
    subtitle: 'The Bride',
    intro: 'Creative spirit and artist of heartfelt moments.',
    story: 'In Anshul, she discovered her deepest confidant and the calm anchor of her life.',
    image: 'assets/images/couple-story.jpg'
  };

  // Celebrations: Mehendi, Sangeet, Wedding, Reception (Minimal horizontal timeline)
  readonly events: MinimalEvent[] = [
    {
      id: 'mehendi',
      name: 'Mehendi',
      dayDate: 'Friday, 13 February 2026',
      time: '4:00 PM',
      venue: 'The Royal Greens, Jaipur',
      dressCode: 'Pastel & Floral Linen',
      image: 'assets/images/event-mehendi.jpg'
    },
    {
      id: 'sangeet',
      name: 'Sangeet',
      dayDate: 'Saturday, 14 February 2026',
      time: '6:30 PM',
      venue: 'The Royal Greens, Jaipur',
      dressCode: 'Evening Velvet & Black Tie',
      image: 'assets/images/event-sangeet.jpg'
    },
    {
      id: 'wedding',
      name: 'The Wedding Ceremony',
      dayDate: 'Sunday, 15 February 2026',
      time: '7:00 PM',
      venue: 'The Royal Greens, Jaipur',
      dressCode: 'Traditional Royal Attire',
      image: 'assets/images/event-wedding.jpg'
    },
    {
      id: 'reception',
      name: 'Reception Gala',
      dayDate: 'Monday, 16 February 2026',
      time: '7:30 PM',
      venue: 'The Royal Greens, Jaipur',
      dressCode: 'Indo-Western & Cocktail',
      image: 'assets/images/event-reception.jpg'
    }
  ];

  // Story: Max 3 key moments
  readonly storyPoints: MinimalStoryPoint[] = [
    {
      index: '01',
      title: 'The Meeting',
      location: 'Jaipur, 2022',
      caption: 'A quiet afternoon coffee that turned into an effortless conversation about life, dreams, and art.'
    },
    {
      index: '02',
      title: 'The Promise',
      location: 'Udaipur, 2023',
      caption: 'Under the starlit waters of Lake Pichola, a heartfelt question was asked and forever began.'
    },
    {
      index: '03',
      title: 'The Union',
      location: 'The Royal Greens, 2026',
      caption: 'Surrounded by the warmth of our loved ones, we step together into our new chapter.'
    }
  ];

  // Gallery Moments
  readonly galleryItems: MinimalGalleryItem[] = [
    { id: 1, title: 'Sacred Vows', image: 'assets/images/moment-mandap.jpg' },
    { id: 2, title: 'The Promise', image: 'assets/images/moment-ring.jpg' },
    { id: 3, title: 'Shared Laughter', image: 'assets/images/moment-laughter.jpg' },
    { id: 4, title: 'Palace Archway', image: 'assets/images/moment-silhouette.jpg' },
    { id: 5, title: 'Regal Splendor', image: 'assets/images/couple-hero.jpg' },
    { id: 6, title: 'Twilight Dusk', image: 'assets/images/couple-story.jpg' }
  ];

  // Venue Information
  readonly venue = {
    name: 'The Royal Greens',
    city: 'Jaipur, Rajasthan',
    address: 'Tonk Road, Jaipur, Rajasthan - 302018',
    date: '13 – 16 February 2026',
    mapUrl: 'https://maps.google.com/?q=The+Royal+Greens+Tonk+Road+Jaipur',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=The+Royal+Greens+Tonk+Road+Jaipur',
    image: 'assets/images/venue-palace.jpg'
  };

  // Minimal RSVP state
  readonly rsvpsSignal = signal<MinimalRsvpSubmission[]>(this.loadRsvps());

  private loadRsvps(): MinimalRsvpSubmission[] {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem('minimal_wedding_rsvps');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return [];
  }

  submitRsvp(rsvp: MinimalRsvpSubmission) {
    const updated = [rsvp, ...this.rsvpsSignal()];
    this.rsvpsSignal.set(updated);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('minimal_wedding_rsvps', JSON.stringify(updated));
    }
  }
}
