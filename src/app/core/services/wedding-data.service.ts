import { Injectable, signal } from '@angular/core';
import { WeddingEvent, MomentPhoto, GuestWish, RsvpSubmission, CoupleProfile } from '../models/wedding.models';

@Injectable({
  providedIn: 'root'
})
export class WeddingDataService {
  // Wedding Date & Target for Countdown: 15 Feb 2026, 19:00 IST
  readonly weddingDate = new Date('2026-02-15T19:00:00+05:30');

  // Couple Data
  readonly dulha: CoupleProfile = {
    name: 'Anshul',
    role: 'Dulha',
    englishRole: 'The Groom',
    title: 'Son of Smt. Sunita & Shri Rajesh Sharma',
    bio: 'An architect with an eye for timeless aesthetics and an adventurous soul at heart. From sketching dreams into blueprints to finding his forever foundation in Vidisha, he brings warmth, laughter, and calm strength to their beautiful journey.',
    quote: '"With Vidisha, every ordinary moment transforms into poetry. She is the harmony my life was waiting for."',
    parents: 'Grandson of Late Smt. Kamla & Late Shri Om Prakash Sharma',
    image: 'assets/images/couple-hero.jpg'
  };

  readonly dulhan: CoupleProfile = {
    name: 'Vidisha',
    role: 'Dulhan',
    englishRole: 'The Bride',
    title: 'Daughter of Smt. Rekha & Shri Mahendra Gupta',
    bio: 'An artist of emotions, culinary enthusiast, and compassionate soul with a smile that brightens any room. In Anshul, she found not just a partner, but her confidant, her biggest cheerleader, and her true home.',
    quote: '"In his eyes, I found my sanctuary. In his laughter, I discovered forever. Excited to embark on our greatest adventure together."',
    parents: 'Granddaughter of Smt. Shanti & Late Shri Ratan Lal Gupta',
    image: 'assets/images/couple-story.jpg'
  };

  // Celebrations & Events
  readonly events: WeddingEvent[] = [
    {
      id: 'mehendi',
      title: 'MEHENDI',
      hindiTitle: 'मेहंदी उत्सव',
      date: '13 Feb 2026',
      day: 'Friday',
      time: '4:00 PM Onwards',
      venue: 'The Royal Greens, Jaipur',
      address: 'Tonk Road, Jaipur, Rajasthan - 302018',
      description: 'An afternoon infused with fragrant henna swirls, traditional Rajasthani folk rhythms, lively dholak beats, and laughter under sunny marigold canopies.',
      dressCode: 'Pastel & Floral Chic',
      themeNote: 'Embrace fresh shades of mint green, mustard yellow, and peach florals.',
      colorPalette: [
        { name: 'Sage Green', hex: '#87A96B' },
        { name: 'Mustard Gold', hex: '#E1AD01' },
        { name: 'Blush Peach', hex: '#FFDAB9' },
        { name: 'Olive Leaf', hex: '#556B2F' }
      ],
      image: 'assets/images/event-mehendi.jpg',
      highlights: [
        'Live Henna / Mehendi Artisans',
        'Rajasthani Folk Singers & Dholak Beats',
        'Chaat & Street Food Bazaar',
        'Traditional Bangle & Chunni Gifting Bar'
      ],
      calendarData: {
        title: 'Anshul & Vidisha - Mehendi Ceremony',
        startDate: '20260213T160000',
        endDate: '20260213T210000',
        description: 'Mehendi celebration for Anshul & Vidisha wedding.',
        location: 'The Royal Greens, Tonk Road, Jaipur'
      }
    },
    {
      id: 'sangeet',
      title: 'SANGEET',
      hindiTitle: 'संगीत संध्या',
      date: '14 Feb 2026',
      day: 'Saturday',
      time: '6:00 PM Onwards',
      venue: 'The Royal Greens, Jaipur',
      address: 'Tonk Road, Jaipur, Rajasthan - 302018',
      description: 'A starlit night of high-energy family dance performances, dazzling glamour, celebratory cocktails, and unforgettable live DJ beats that keep you dancing till dawn.',
      dressCode: 'Royal Glam & Shimmer',
      themeNote: 'Deep velvet tones, midnight sapphire, champagne gold, sequins, and Indo-Western glamour.',
      colorPalette: [
        { name: 'Midnight Navy', hex: '#0B1D51' },
        { name: 'Champagne Gold', hex: '#F7E7CE' },
        { name: 'Wine Velvet', hex: '#5B1E31' },
        { name: 'Emerald Sparkle', hex: '#097969' }
      ],
      image: 'assets/images/event-sangeet.jpg',
      highlights: [
        'Dulha vs Dulhan Family Dance Face-off',
        'Special Couple Performance by Anshul & Vidisha',
        'Live Bollywood Band & Celebrity DJ',
        'Gourmet World Cuisine & Signature Mocktails'
      ],
      calendarData: {
        title: 'Anshul & Vidisha - Sangeet & Musical Night',
        startDate: '20260214T180000',
        endDate: '20260215T010000',
        description: 'Sangeet musical extravaganza for Anshul & Vidisha.',
        location: 'The Royal Greens, Tonk Road, Jaipur'
      }
    },
    {
      id: 'wedding',
      title: 'WEDDING',
      hindiTitle: 'शुभ विवाह (फेरे)',
      date: '15 Feb 2026',
      day: 'Sunday',
      time: '7:00 PM Onwards',
      venue: 'The Royal Greens, Jaipur',
      address: 'Tonk Road, Jaipur, Rajasthan - 302018',
      description: 'The sacred union of two souls. Witness the majestic royal Baraat on elephants, the emotional Varmala exchange under floral showers, and the sacred seven Pheras around holy agni.',
      dressCode: 'Traditional Royal Splendor',
      themeNote: 'Opulent banarasi silks, royal heritage reds, maroons, ivory, and golden zardozi.',
      colorPalette: [
        { name: 'Royal Crimson', hex: '#8B0000' },
        { name: 'Heritage Gold', hex: '#D4AF37' },
        { name: 'Ivory Silk', hex: '#FFFFF0' },
        { name: 'Vermillion Sindoor', hex: '#E34234' }
      ],
      image: 'assets/images/event-wedding.jpg',
      highlights: [
        'Grand Royal Baraat Procession with Shehnai & Nagada',
        'Magnificent Varmala Stage with Fireworks & Rose Shower',
        'Vedic Pheras & Saptapadi at Heritage Mandap',
        'Royal Rajasthani Rajwada Feast'
      ],
      calendarData: {
        title: 'Anshul & Vidisha - The Royal Wedding (Pheras)',
        startDate: '20260215T190000',
        endDate: '20260216T020000',
        description: 'Wedding ceremony and sacred pheras of Anshul & Vidisha.',
        location: 'The Royal Greens, Tonk Road, Jaipur'
      }
    },
    {
      id: 'reception',
      title: 'RECEPTION',
      hindiTitle: 'स्वागत समारोह',
      date: '16 Feb 2026',
      day: 'Monday',
      time: '7:00 PM Onwards',
      venue: 'The Royal Greens, Jaipur',
      address: 'Tonk Road, Jaipur, Rajasthan - 302018',
      description: 'An elegant grand gala evening to celebrate the newlyweds. Heartfelt dinner toasts, royal photo moments, and blessing the couple as they step into their new beginning.',
      dressCode: 'Black Tie & Indo-Western Chic',
      themeNote: 'Classic black tuxedos, bandhgalas, elegant cocktail sarees, and gowns.',
      colorPalette: [
        { name: 'Classic Onyx', hex: '#0F0F10' },
        { name: 'Rose Gold', hex: '#B76E79' },
        { name: 'Sterling Silver', hex: '#C0C0C0' },
        { name: 'Burgundy Wine', hex: '#4A0E17' }
      ],
      image: 'assets/images/event-reception.jpg',
      highlights: [
        'Grand Red Carpet Entrance of the Newlyweds',
        'Blessings & Stage Photography Session',
        'Live Acoustic Sitar & Saxophone Ensemble',
        'Imperial Banquet Dinner'
      ],
      calendarData: {
        title: 'Anshul & Vidisha - Royal Wedding Reception',
        startDate: '20260216T190000',
        endDate: '20260216T233000',
        description: 'Reception celebration for Anshul & Vidisha.',
        location: 'The Royal Greens, Tonk Road, Jaipur'
      }
    }
  ];

  // Moments Gallery
  readonly moments: MomentPhoto[] = [
    {
      id: 1,
      title: 'Eternal Vow',
      subtitle: 'Sacred Pheras & Rose Shower',
      category: 'ceremony',
      imageUrl: 'assets/images/moment-mandap.jpg',
      caption: 'Walking around the sacred fire, bound together by seven holy vows and showered in blessing petals.'
    },
    {
      id: 2,
      title: 'The Promise',
      subtitle: 'Ring Exchange & Bridal Henna',
      category: 'prewedding',
      imageUrl: 'assets/images/moment-ring.jpg',
      caption: 'Two hands intertwined, sealed with an eternal promise etched in diamond and henna.'
    },
    {
      id: 3,
      title: 'Pure Joy',
      subtitle: 'Sangeet Beats & Shared Laughter',
      category: 'sangeet',
      imageUrl: 'assets/images/moment-laughter.jpg',
      caption: 'The spontaneous joy of laughing at each other’s dance steps on sangeet evening.'
    },
    {
      id: 4,
      title: 'Palace Silhouette',
      subtitle: 'Jaipur Golden Hour Archway',
      category: 'prewedding',
      imageUrl: 'assets/images/moment-silhouette.jpg',
      caption: 'Framed inside timeless Rajasthani arches as the setting sun painted the Pink City in gold.'
    },
    {
      id: 5,
      title: 'Royal Majesty',
      subtitle: 'Anshul & Vidisha in Regal Attire',
      category: 'ceremony',
      imageUrl: 'assets/images/couple-hero.jpg',
      caption: 'A glimpse of royal opulence as our families joined together in grand celebration.'
    },
    {
      id: 6,
      title: 'Dusk Over Jaipur',
      subtitle: 'Twilight at The Palace Balcony',
      category: 'prewedding',
      imageUrl: 'assets/images/couple-story.jpg',
      caption: 'Looking ahead into our tomorrow with hearts filled with gratitude and endless love.'
    }
  ];

  // Love Story Milestones
  readonly storyChapters = [
    {
      year: 'Winter 2022',
      title: 'The Serendipitous Meeting',
      location: 'Jaipur Art Cafe',
      description: 'What was supposed to be a polite 20-minute coffee meeting stretched into 4 hours of uninterrupted laughter, debating old Rajasthani architecture and favorite travel memories. Time simply slipped away.',
      icon: 'sparkles'
    },
    {
      year: 'Autumn 2023',
      title: 'The Lake Pichola Confession',
      location: 'Udaipur, Rajasthan',
      description: 'On a quiet boat ride surrounded by shimmering ghats and palaces, Anshul asked the question that made Vidisha’s heart skip a beat. Surrounded by candlelit lotus flowers, she said YES with joyful tears.',
      icon: 'heart'
    },
    {
      year: 'Spring 2024',
      title: 'The Families Unite (Roka Ceremony)',
      location: 'Jaipur',
      description: 'With traditional tilak, exchange of sweets, and both families dancing together, our union was blessed by our elders. Two families officially became one loving household.',
      icon: 'hands'
    },
    {
      year: 'February 2026',
      title: 'The Royal Wedding & Forever',
      location: 'The Royal Greens, Jaipur',
      description: 'Now, we step into the most sacred chapter of our lives, surrounded by our dearest family and friends. We cannot wait to celebrate with you!',
      icon: 'ring'
    }
  ];

  // Wishes List (Reactive Signal)
  private readonly defaultWishes: GuestWish[] = [
    {
      id: 'w-1',
      name: 'Dr. Vivek & Neha Sharma',
      relation: 'Groom’s Elder Brother & Bhabhi',
      message: 'Dearest Anshul & Vidisha, watching your bond grow has been our greatest joy. May your life together be blessed with endless laughter, adventurous travels, and eternal love! We cannot wait for Jaipur celebrations!',
      emoji: '🌸',
      date: 'Yesterday',
      likes: 18,
      isLiked: false
    },
    {
      id: 'w-2',
      name: 'Pooja Gupta & Family',
      relation: 'Bride’s Chacha-Chachi',
      message: 'Our darling princess Vidisha found her true prince charming in Anshul! Sending you both our warmest blessings and love from London. See you all at the Mehendi!',
      emoji: '✨',
      date: '2 days ago',
      likes: 24,
      isLiked: false
    },
    {
      id: 'w-3',
      name: 'Rohan & Sanya Kapoor',
      relation: 'College Best Friends',
      message: 'From college canteen banter to watching Anshul become the happiest groom on the planet! Vidisha, you have got the best guy, and Anshul, you have won life. Sangeet dance floor is going to be legendary!',
      emoji: '🪔',
      date: '3 days ago',
      likes: 31,
      isLiked: false
    }
  ];

  readonly wishesSignal = signal<GuestWish[]>(this.loadWishes());

  // RSVPs (Reactive Signal)
  readonly rsvpsSignal = signal<RsvpSubmission[]>(this.loadRsvps());

  private loadWishes(): GuestWish[] {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem('anshul_vidisha_wishes');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return this.defaultWishes;
  }

  private loadRsvps(): RsvpSubmission[] {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem('anshul_vidisha_rsvps');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return [];
  }

  addWish(name: string, relation: string, message: string, emoji: string): GuestWish {
    const newWish: GuestWish = {
      id: 'wish-' + Date.now(),
      name: name.trim(),
      relation: relation.trim() || 'Well Wisher',
      message: message.trim(),
      emoji: emoji || '🌸',
      date: 'Just now',
      likes: 1,
      isLiked: true
    };

    const updated = [newWish, ...this.wishesSignal()];
    this.wishesSignal.set(updated);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('anshul_vidisha_wishes', JSON.stringify(updated));
    }
    return newWish;
  }

  toggleLikeWish(id: string) {
    const current = this.wishesSignal();
    const updated = current.map(wish => {
      if (wish.id === id) {
        const isLiked = !wish.isLiked;
        return {
          ...wish,
          isLiked,
          likes: isLiked ? wish.likes + 1 : wish.likes - 1
        };
      }
      return wish;
    });
    this.wishesSignal.set(updated);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('anshul_vidisha_wishes', JSON.stringify(updated));
    }
  }

  submitRsvp(rsvp: RsvpSubmission): boolean {
    const newRsvp = {
      ...rsvp,
      id: 'rsvp-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    const updated = [newRsvp, ...this.rsvpsSignal()];
    this.rsvpsSignal.set(updated);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('anshul_vidisha_rsvps', JSON.stringify(updated));
    }
    return true;
  }

  downloadCalendarFile(event: WeddingEvent) {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Anshul Vidisha Wedding//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `SUMMARY:${event.calendarData.title}`,
      `DESCRIPTION:${event.calendarData.description}`,
      `LOCATION:${event.calendarData.location}`,
      `DTSTART:${event.calendarData.startDate}`,
      `DTEND:${event.calendarData.endDate}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${event.id}-anshul-vidisha.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  getGoogleCalendarUrl(event: WeddingEvent): string {
    const title = encodeURIComponent(event.calendarData.title);
    const details = encodeURIComponent(event.calendarData.description);
    const location = encodeURIComponent(event.calendarData.location);
    const dates = `${event.calendarData.startDate}/${event.calendarData.endDate}`;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  }
}
