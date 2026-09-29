import { Injectable, signal } from '@angular/core';

export interface RoyalEvent {
  id: string;
  badge: string;
  muhurat: string;
  title: string;
  subtitle: string;
  desc: string;
  date: string;
  time: string;
  dressCode: string;
  venue: string;
  image: string;
  dtStart: string;
  dtEnd: string;
}

export interface RoyalGalleryItem {
  id: number;
  title: string;
  category: string;
  image: string;
}

export interface RoyalRsvpSubmission {
  name: string;
  phone: string;
  email?: string;
  attendance: 'attending' | 'declined';
  guestsCount: number;
  cuisine: string;
  wishes?: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class WeddingDataService {
  // Couple Profile
  readonly groom = {
    name: 'Anshul Sharma',
    subtitle: 'The Groom',
    intro: 'Architect & visionary with a devotion to quiet luxury and timeless art.',
    image: 'assets/images/couple-hero.jpg'
  };

  readonly bride = {
    name: 'Vidisha Gupta',
    subtitle: 'The Bride',
    intro: 'Creative soul & designer whose warmth turns every fleeting moment into an eternal memory.',
    image: 'assets/images/couple-story.jpg'
  };

  // 5 Celebrations of Royal Festivities
  readonly events: RoyalEvent[] = [
    {
      id: 'mehendi',
      badge: 'Day 1 · Auspicious Twilight',
      muhurat: 'Gorodhuli Muhurat',
      title: 'MEHNDI & MAYUN',
      subtitle: 'Henna Alchemy & Folk Rhythms',
      desc: 'An afternoon bathed in the auspicious fragrance of crushed henna pastes, soulful Manganiyar desert folk harmonies, vibrant floral ornaments, and celebratory laughter.',
      date: 'Friday, 11 December 2026',
      time: '4:00 PM Onwards',
      dressCode: 'Mehendi Green & Sunshine Yellows',
      venue: 'Zanana Courtyard, The Royal Palace',
      image: 'assets/images/event-mehendi.jpg',
      dtStart: '20261211T160000',
      dtEnd: '20261211T230000'
    },
    {
      id: 'sangeet',
      badge: 'Day 2 · Starlit Radiance',
      muhurat: 'Evening Glamour',
      title: 'SANGEET & COCKTAIL',
      subtitle: 'A Celestial Symphony of Dance',
      desc: 'An electric evening of scintillating family performances, high-energy royal rhythms, signature champagne cocktails, and continuous celebration under celestial chandeliers.',
      date: 'Saturday, 12 December 2026',
      time: '7:30 PM Till Late',
      dressCode: 'Indo-Western Glitz & Evening Velvet',
      venue: 'The Grand Durbar Ballroom',
      image: 'assets/images/event-sangeet.jpg',
      dtStart: '20261212T193000',
      dtEnd: '20261213T013000'
    },
    {
      id: 'haldi',
      badge: 'Day 3 (Morning) · Sacred Sun',
      muhurat: 'Auspicious Morning Muhurat',
      title: 'HALDI & PHAGUN RASAM',
      subtitle: 'Sacred Turmeric & Marigold Showers',
      desc: 'Sacred blessings adorned with vibrant organic turmeric paste, fresh marigold petal showers, and playful water traditions to bless the bride and groom with eternal radiance.',
      date: 'Sunday, 13 December 2026',
      time: '10:30 AM Muhurat',
      dressCode: 'Shades of Haldi, Ochre & Floral White',
      venue: 'Lotus Pool Terrace',
      image: 'assets/images/event-wedding.jpg',
      dtStart: '20261213T103000',
      dtEnd: '20261213T140000'
    },
    {
      id: 'wedding',
      badge: 'Day 3 (Evening) · Sacred Phere',
      muhurat: 'The Sacred Agni Muhurat',
      title: 'THE ROYAL WEDDING',
      subtitle: 'Sacred Vows Under Heritage Arches',
      desc: 'The grand baraat procession with regal drums, majestic jaimala exchange beneath fireworks, and seven sacred circumambulations around the holy fire to unite two souls for eternity.',
      date: 'Sunday, 13 December 2026',
      time: '6:30 PM Baraat · 8:15 PM Phere',
      dressCode: 'Traditional Royal Splendor & Sherwanis',
      venue: 'The Royal Greens Amphitheatre',
      image: 'assets/images/couple-hero.jpg',
      dtStart: '20261213T183000',
      dtEnd: '20261214T010000'
    },
    {
      id: 'reception',
      badge: 'Day 4 · Heirloom Banquets',
      muhurat: 'Royal Reception',
      title: 'GRAND RECEPTION',
      subtitle: 'An Evening of Royal Feast & Toast',
      desc: 'A decadent culmination of the festivities featuring a grand culinary banquet spanning heirloom royal recipes, live sufi melodies, and heartfelt toasts to the newlyweds.',
      date: 'Monday, 14 December 2026',
      time: '8:00 PM Onwards',
      dressCode: 'Black Tie or Royal Heritage Silks',
      venue: 'The Lakefront Pavilions',
      image: 'assets/images/event-reception.jpg',
      dtStart: '20261214T200000',
      dtEnd: '20261215T010000'
    }
  ];

  // Gallery Moments
  readonly galleryItems: RoyalGalleryItem[] = [
    { id: 1, title: 'The Royal Nuptials Portrait', category: 'The Regalia', image: 'assets/images/couple-hero.jpg' },
    { id: 2, title: 'Sacred Bridal Henna', category: 'Tradition', image: 'assets/images/event-mehendi.jpg' },
    { id: 3, title: 'Sangeet Euphoria', category: 'Celebration', image: 'assets/images/event-sangeet.jpg' },
    { id: 4, title: 'Beneath the Heritage Arches', category: 'Courtyard', image: 'assets/images/venue-palace.jpg' },
    { id: 5, title: 'The Sacred Mandap', category: 'Holy Union', image: 'assets/images/event-wedding.jpg' },
    { id: 6, title: 'Twilight Reflections', category: 'Love', image: 'assets/images/couple-story.jpg' }
  ];

  // Venue Information
  readonly venue = {
    name: 'The Royal Greens & Palace',
    city: 'Jaipur / Udaipur, Rajasthan',
    address: 'The Heritage Palace Complex, Rajasthan - 302018',
    date: '11 – 14 December 2026',
    mapUrl: 'https://maps.google.com/?q=The+Royal+Palace+Rajasthan',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=The+Royal+Palace+Rajasthan',
    modes: {
      day: {
        image: 'assets/images/venue-palace.jpg',
        title: 'Golden Sun',
        filter: 'contrast(1.05) brightness(1.02)'
      },
      dusk: {
        image: 'assets/images/couple-hero.jpg',
        title: 'Palace Dusk',
        filter: 'contrast(1.15) brightness(0.9)'
      },
      night: {
        image: 'assets/images/event-sangeet.jpg',
        title: 'Starry Night & Diyas',
        filter: 'contrast(1.25) brightness(0.78)'
      }
    }
  };

  // RSVP Management
  readonly rsvpsSignal = signal<RoyalRsvpSubmission[]>(this.loadRsvps());

  private loadRsvps(): RoyalRsvpSubmission[] {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem('royal_wedding_rsvps');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return [];
  }

  submitRsvp(rsvp: RoyalRsvpSubmission) {
    const updated = [rsvp, ...this.rsvpsSignal()];
    this.rsvpsSignal.set(updated);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('royal_wedding_rsvps', JSON.stringify(updated));
    }
  }

  downloadCalendarIcs(event: RoyalEvent) {
    if (typeof window === 'undefined') return;
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Anshul & Vidisha Royal Wedding//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `SUMMARY:Anshul & Vidisha — ${event.title}`,
      `DESCRIPTION:${event.desc}\\nDress Code: ${event.dressCode}`,
      `LOCATION:${event.venue}, Rajasthan`,
      `DTSTART:${event.dtStart}`,
      `DTEnd:${event.dtEnd}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${event.title.replace(/[^a-zA-Z0-9]/g, '_')}_Invitation.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
