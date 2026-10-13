import { Injectable, signal } from '@angular/core';

export interface WeddingCeremony {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  dateShort: string;
  time: string;
  venue: string;
  venueAddress: string;
  mapsUrl: string;
  directionsUrl: string;
  icon: string;
  dtStart: string;
  dtEnd: string;
  description: string;
}

export interface ProgramStep {
  time: string;
  title: string;
  subtitle: string;
  desc: string;
  icon: string;
}

export interface SacredRitual {
  name: string;
  desc: string;
  symbol: string;
}

export interface GuestWish {
  id: string;
  sender: string;
  relation: string;
  message: string;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class WeddingDataService {
  // =========================================================================
  // 1. COUPLE PROFILE — Matching Physical Invitation Card
  // =========================================================================
  readonly groom = {
    name: 'Anshul Verma',
    subtitle: 'GROOM',
    parentage: 'S/o Late Mr. Devendra Verma & Mrs. Savitri Verma',
    role: 'Groom',
    city: 'Lucknow'
  };

  readonly bride = {
    name: 'Vidisha Singh',
    subtitle: 'BRIDE',
    parentage: 'D/o Mr. Vijay Prakash Singh & Mrs. Usha Singh',
    role: 'Bride',
    city: 'Prayagraj'
  };

  // =========================================================================
  // 2. SACRED VEDIC SHLOKAS
  // =========================================================================
  readonly shlokas = [
    {
      sanskrit: '॥ वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥',
      translation: 'O Lord Ganesha, with curved trunk and immense brilliance, bless our sacred union and remove all impediments.',
      context: 'Invocation to Lord Ganesha'
    },
    {
      sanskrit: '॥ माङ्गल्यं तन्तुनानेन जगन्मङ्गलकारिणी। कण्ठे बध्नामि सुभगे सञ्जीव शरदः शतम् ॥',
      translation: 'This sacred bond bestows auspiciousness on all. Together we embark on a life of devotion and companionship for a hundred autumns.',
      context: 'Sacred Vivaha Blessing'
    }
  ];

  // =========================================================================
  // 3. SACRED CEREMONIES — 4 Events Matching the Card Panels
  // =========================================================================
  readonly ceremonies: WeddingCeremony[] = [
    {
      id: 'tel-pooja',
      title: 'Tel Pooja',
      subtitle: 'Sacred Oil Anointing Ceremony',
      date: '16th November 2026',
      dateShort: '16 Nov',
      time: '10:00 AM Onwards',
      venue: 'Family Residence',
      venueAddress: 'B-42, Him City Part 1, Dewa Road, Lucknow',
      mapsUrl: 'https://www.google.com/maps?q=26.896637,81.0498644',
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=26.896637,81.0498644',
      icon: '🪔',
      dtStart: '20261116T100000',
      dtEnd: '20261116T140000',
      description: 'Auspicious Tel Pooja ceremony with fragrant herbal oils and divine blessings for the groom.'
    },
    {
      id: 'haldi-mehendi',
      title: 'Haldi & Mehendi',
      subtitle: 'Sacred Turmeric & Henna Celebrations',
      date: '19th November 2026',
      dateShort: '19 Nov',
      time: '11:00 AM & Evening Sangeet',
      venue: 'Family Residence',
      venueAddress: 'B-42, Him City Part 1, Dewa Road, Lucknow',
      mapsUrl: 'https://www.google.com/maps?q=26.896637,81.0498644',
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=26.896637,81.0498644',
      icon: '🌿',
      dtStart: '20261119T110000',
      dtEnd: '20261119T210000',
      description: 'Luminous golden turmeric rituals followed by celebratory mehndi art, folk music, and family festivities.'
    },
    {
      id: 'wedding',
      title: 'Wedding',
      subtitle: 'The Sacred Vivaha Sanskar',
      date: '20th November 2026',
      dateShort: '20 Nov',
      time: 'Baraat 11:00 AM · Varmala 7:30 PM · Pheras 11:00 PM',
      venue: 'Bhola Garden',
      venueAddress: 'Kaserua Khurd, Sadmapur, Sahson, Jaunpur Road, Prayagraj',
      mapsUrl: 'https://www.google.com/maps/place/Bhola+Garden/@25.4818101,81.9742563,17z/data=!3m1!4b1!4m6!3m5!1s0x399ab325d7ca92dd:0xfb1cfad2936bc26d!8m2!3d25.4818101!4d81.9742563!16s%2Fg%2F11fszf8qj8',
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=25.4818101,81.9742563',
      icon: '💍',
      dtStart: '20261120T180000',
      dtEnd: '20261121T020000',
      description: 'The Baraat departs from our home at B-42, Him City Part 1, Dewa Road, Lucknow. Sacred wedding ceremony at Bhola Garden, Prayagraj.'
    },
    {
      id: 'vidai',
      title: 'Vidai',
      subtitle: 'The Sacred Farewell & Eternal Blessings',
      date: '21st November 2026',
      dateShort: '21 Nov',
      time: 'Morning Auspicious Departure',
      venue: 'Bhola Garden',
      venueAddress: 'Kaserua Khurd, Sadmapur, Sahson, Jaunpur Road, Prayagraj',
      mapsUrl: 'https://www.google.com/maps/place/Bhola+Garden/@25.4818101,81.9742563,17z/data=!3m1!4b1!4m6!3m5!1s0x399ab325d7ca92dd:0xfb1cfad2936bc26d!8m2!3d25.4818101!4d81.9742563!16s%2Fg%2F11fszf8qj8',
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=25.4818101,81.9742563',
      icon: '🌸',
      dtStart: '20261121T080000',
      dtEnd: '20261121T120000',
      description: 'A deeply poignant, blessed moment as the bride steps into her new life with maternal tears, fatherly love, and sacred joy.'
    }
  ];

  // =========================================================================
  // 4. WEDDING DAY TIMELINE / PROGRAM HIGHLIGHTS
  // =========================================================================
  readonly weddingTimeline: ProgramStep[] = [
    {
      time: '11:00 AM',
      title: 'Baraat Prasthan',
      subtitle: 'Departure from Lucknow Residence',
      desc: 'The joyous procession of the groom accompanied by family, dhol, and elders departs Lucknow for Prayagraj.',
      icon: '🎺'
    },
    {
      time: '7:30 PM',
      title: 'Swagat & Jayamala',
      subtitle: 'Grand Welcome & Garland Exchange',
      desc: 'Traditional welcome of the Baraatis with rose water and flower shower, followed by the exchange of floral garlands.',
      icon: '🌺'
    },
    {
      time: '8:30 PM',
      title: 'Preeti Bhoj',
      subtitle: 'Royal Wedding Feast (Dinner)',
      desc: 'An exquisite culinary feast celebrating the union of both families with rich Awadhi & Purvanchal delicacies.',
      icon: '🍽️'
    },

    {
      time: 'Dawn',
      title: 'Vidai Ceremony',
      subtitle: 'Sacred Send-Off',
      desc: 'Showering the couple with rice and heartfelt prayers as Vidisha steps forward into the Verma family fold.',
      icon: '🕊️'
    }
  ];

  // =========================================================================
  // 5. SACRED MANDAP RITUALS & SIGNIFICANCE
  // =========================================================================
  readonly mandapRituals: SacredRitual[] = [
    {
      name: 'Hastamelap',
      desc: 'The sacred joining of hands, signifying emotional and spiritual synchronization of two destinies.',
      symbol: '🤝'
    },
    {
      name: 'Gathbandhan',
      desc: 'The ceremonial knot tying the groom’s scarf to the bride’s dupatta, symbolizing unshakeable commitment.',
      symbol: '🪢'
    },
    {
      name: 'Saptapadi (Seven Vows)',
      desc: 'Seven sacred steps taken around the Holy Fire for nourishment, strength, prosperity, and eternal companionship.',
      symbol: '🔥'
    },
    {
      name: 'Sindoor & Mangalsutra',
      desc: 'The groom adorns the bride with vermillion and the golden sacred necklace, crowning their union.',
      symbol: '✨'
    }
  ];

  // =========================================================================
  // 6. VENUE LOCATIONS & TRAVEL LOGISTICS
  // =========================================================================
  readonly venues = {
    lucknow: {
      name: 'Family Residence',
      cityTag: 'Lucknow',
      address: 'B-42, Him City Part 1, Dewa Road, Lucknow',
      landmark: 'Near Dewa Road / Matiyari Junction',
      events: 'Tel Pooja · Haldi & Mehendi · Baraat Departure',
      travelTip: 'Approx. 25 mins from Lucknow Charbagh Railway Station; easily accessible via Ring Road.',
      latitude: 26.896637,
      longitude: 81.0498644,
      mapsUrl: 'https://www.google.com/maps?q=26.896637,81.0498644',
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=26.896637,81.0498644',
      streetViewUrl: 'https://www.google.com/maps/@26.896637,81.0498644,141a,75y,307.45h,90t/data=!3m7!1e1!3m5!1sxD2NSGZ6dEHHQ5kPJzBbOg!2e0!6shttps:%2F%2Fstreetviewpixels-pa.clients6.google.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D0%26panoid%3DxD2NSGZ6dEHHQ5kPJzBbOg%26yaw%3D307.45!7i16384!8i8192?entry=ttu&g_ep=EgoyMDI2MTAxMS4wIKXMDSoASAFQAw%3D%3D'
    },
    prayagraj: {
      name: 'Bhola Garden',
      cityTag: 'Prayagraj',
      address: 'Kaserua Khurd, Sadmapur, Sahson, Jaunpur Road, Prayagraj',
      landmark: 'Jaunpur Road, Sahson Bypass',
      events: 'Wedding Ceremony · Jayamala · Pheras · Vidai',
      travelTip: 'Located on Jaunpur Road near Sahson. Approx. 3.5 to 4 hours smooth highway drive from Lucknow (NH30).',
      latitude: 25.4818101,
      longitude: 81.9742563,
      mapsUrl: 'https://www.google.com/maps/place/Bhola+Garden/@25.4818101,81.9742563,17z/data=!3m1!4b1!4m6!3m5!1s0x399ab325d7ca92dd:0xfb1cfad2936bc26d!8m2!3d25.4818101!4d81.9742563!16s%2Fg%2F11fszf8qj8',
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=25.4818101,81.9742563',
      placeUrl: 'https://www.google.com/maps/place/Bhola+Garden/@25.4818101,81.9742563,17z/data=!3m1!4b1!4m6!3m5!1s0x399ab325d7ca92dd:0xfb1cfad2936bc26d!8m2!3d25.4818101!4d81.9742563!16s%2Fg%2F11fszf8qj8!18m1!1e1?entry=ttu&g_ep=EgoyMDI2MTAxMS4wIKXMDSoASAFQAw%3D%3D'
    }
  };

  // =========================================================================
  // 7. FAMILY BLESSINGS & SOLICITATIONS
  // =========================================================================
  readonly familyBlessing = {
    title: 'Humble Request',
    from: 'Mr. Brijendra Verma',
    family: 'and Verma Family',
    solicitation: 'With best compliments from all near and dear relatives & friends of Verma & Singh Families'
  };

  // =========================================================================
  // 8. GUEST BLESSINGS / WARM WISHES STORE (Interactive)
  // =========================================================================
  readonly guestWishes = signal<GuestWish[]>([
    {
      id: 'w1',
      sender: 'Mr. & Mrs. R.K. Verma',
      relation: 'Family Elders',
      message: 'May Lord Ganesha always bless Anshul and Vidisha with eternal love, harmony, and prosperity. Looking forward to celebrating this beautiful union!',
      date: 'Recent Blessing'
    },
    {
      id: 'w2',
      sender: 'The Singh Pariwar',
      relation: 'Bride’s Relatives',
      message: 'Dearest Vidisha and Anshul, may your new chapter together be filled with boundless laughter and warmth. Our heartfelt prayers are with you both!',
      date: 'Recent Blessing'
    },
    {
      id: 'w3',
      sender: 'Dr. Anand Verma & Family',
      relation: 'Well Wishers',
      message: 'Heartiest congratulations to the Verma & Singh families on this auspicious match! May you create a beautiful lifetime together.',
      date: 'Recent Blessing'
    }
  ]);

  addGuestWish(sender: string, relation: string, message: string) {
    if (!sender.trim() || !message.trim()) return;
    const newWish: GuestWish = {
      id: 'w-' + Date.now(),
      sender: sender.trim(),
      relation: relation.trim() || 'Well Wisher',
      message: message.trim(),
      date: 'Just Now'
    };
    this.guestWishes.update(prev => [newWish, ...prev]);
  }

  // =========================================================================
  // 9. CALENDAR ICS DOWNLOAD
  // =========================================================================
  downloadCalendarIcs(ceremony: WeddingCeremony) {
    if (typeof window === 'undefined') return;
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Anshul Verma & Vidisha Singh Wedding//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `SUMMARY:Anshul & Vidisha — ${ceremony.title}`,
      `DESCRIPTION:${ceremony.description}`,
      `LOCATION:${ceremony.venueAddress}`,
      `DTSTART:${ceremony.dtStart}`,
      `DTEND:${ceremony.dtEnd}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${ceremony.title.replace(/[^a-zA-Z0-9]/g, '_')}_Invitation.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // =========================================================================
  // 10. DOWNLOAD ALL WEDDING EVENTS AT ONCE (.ics)
  // =========================================================================
  downloadAllCeremoniesIcs() {
    if (typeof window === 'undefined') return;
    const eventsIcs = this.ceremonies.map(c => [
      'BEGIN:VEVENT',
      `SUMMARY:Anshul & Vidisha — ${c.title}`,
      `DESCRIPTION:${c.description}`,
      `LOCATION:${c.venueAddress}`,
      `DTSTART:${c.dtStart}`,
      `DTEND:${c.dtEnd}`,
      'STATUS:CONFIRMED',
      'END:VEVENT'
    ].join('\r\n')).join('\r\n');

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Anshul Verma & Vidisha Singh Wedding//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      eventsIcs,
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Anshul_Vidisha_Wedding_Full_Schedule.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // =========================================================================
  // 11. WHATSAPP RSVP & SHARE HELPERS
  // =========================================================================
  generateWhatsAppRsvpUrl(name: string, attendance: string, count: string, note?: string): string {
    const text = `Namaste! 🙏\n\nI am delighted to confirm our presence for *Anshul Verma & Vidisha Singh's Royal Wedding Celebrations*.\n\n👤 *Guest Name:* ${name || 'Family Guest'}\n✨ *Attending:* ${attendance || 'All Ceremonies'}\n👥 *Total Guests:* ${count || '2'}${note ? `\n💬 *Note:* ${note}` : ''}\n\nLooking forward to celebrating with the Verma & Singh families! 🎉`;
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  }

  generateWhatsAppShareUrl(): string {
    const text = `🌸 *Wedding Invitation* 🌸\n\nYou are cordially invited to celebrate the sacred wedding of\n*Anshul Verma & Vidisha Singh*\n\n📅 16th – 21st November 2026\n📍 Lucknow & Prayagraj\n\nView the royal digital invitation card here:\n${typeof window !== 'undefined' ? window.location.href : 'http://localhost:4200'}`;
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  }

  readonly weatherAndAttire = {
    season: 'Autumn / Early Winter in Awadh & Sangam',
    forecast: '18°C – 28°C (Pleasant days, crisp breezy evenings)',
    attireAdvice: 'Traditional festive Indian attire. A light festive shawl or coat is recommended for outdoor evening mandap ceremonies in Prayagraj.'
  };
}
