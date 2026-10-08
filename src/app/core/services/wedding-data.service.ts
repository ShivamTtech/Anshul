import { Injectable, signal } from '@angular/core';

export interface WeddingCeremony {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  dateShort: string;
  venue: string;
  venueAddress: string;
  mapsUrl: string;
  directionsUrl: string;
  icon: string;
  dtStart: string;
  dtEnd: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class WeddingDataService {
  // =========================================================================
  // COUPLE PROFILE — Matching Physical Invitation Card
  // =========================================================================
  readonly groom = {
    name: 'Anshul Verma',
    subtitle: 'GROOM',
    parentage: 'S/o Late Mr. Devendra Verma & Mrs. Savitri Verma'
  };

  readonly bride = {
    name: 'Vidisha Singh',
    subtitle: 'BRIDE',
    parentage: 'D/o Mr. Vijay Prakash Singh & Mrs. Usha Singh'
  };

  // =========================================================================
  // SACRED CEREMONIES — 4 Events from 16 to 21 November 2026
  // =========================================================================
  readonly ceremonies: WeddingCeremony[] = [
    {
      id: 'tel-pooja',
      title: 'Tel Pooja',
      subtitle: 'Sacred Oil Anointing Ceremony',
      date: '16th November 2026',
      dateShort: '16 Nov',
      venue: 'Family Residence',
      venueAddress: 'B-42, Him City Part 1, Dewa Road, Lucknow',
      mapsUrl: 'https://maps.google.com/?q=Him+City+Part+1+Dewa+Road+Lucknow',
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Him+City+Part+1+Dewa+Road+Lucknow',
      icon: '🪔',
      dtStart: '20261116T100000',
      dtEnd: '20261116T140000',
      description: 'Traditional Tel Pooja ceremony with sacred oil anointing and family blessings.'
    },
    {
      id: 'haldi-mehendi',
      title: 'Haldi & Mehendi',
      subtitle: 'Sacred Turmeric & Henna Ceremony',
      date: '19th November 2026',
      dateShort: '19 Nov',
      venue: 'Family Residence',
      venueAddress: 'B-42, Him City Part 1, Dewa Road, Lucknow',
      mapsUrl: 'https://maps.google.com/?q=Him+City+Part+1+Dewa+Road+Lucknow',
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Him+City+Part+1+Dewa+Road+Lucknow',
      icon: '🌿',
      dtStart: '20261119T100000',
      dtEnd: '20261119T180000',
      description: 'Sacred Haldi anointing with turmeric and vibrant Mehendi celebration.'
    },
    {
      id: 'wedding',
      title: 'Wedding',
      subtitle: 'The Sacred Wedding Ceremony',
      date: '20th November 2026',
      dateShort: '20 Nov',
      venue: 'Bhola Garden',
      venueAddress: 'Kaserua Khurd, Sadmapur, Sahson, Jaunpur Road, Prayagraj',
      mapsUrl: 'https://maps.google.com/?q=Bhola+Garden+Kaserua+Khurd+Sadmapur+Sahson+Jaunpur+Road+Prayagraj',
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Bhola+Garden+Kaserua+Khurd+Sadmapur+Sahson+Jaunpur+Road+Prayagraj',
      icon: '💍',
      dtStart: '20261120T180000',
      dtEnd: '20261121T020000',
      description: 'The Baraat will depart from our home at B-42, Him City Part 1, Dewa Road, Lucknow. Wedding ceremony at Bhola Garden, Prayagraj.'
    },
    {
      id: 'vidai',
      title: 'Vidai',
      subtitle: 'The Sacred Farewell',
      date: '21st November 2026',
      dateShort: '21 Nov',
      venue: 'Bhola Garden',
      venueAddress: 'Kaserua Khurd, Sadmapur, Sahson, Jaunpur Road, Prayagraj',
      mapsUrl: 'https://maps.google.com/?q=Bhola+Garden+Kaserua+Khurd+Sadmapur+Sahson+Jaunpur+Road+Prayagraj',
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Bhola+Garden+Kaserua+Khurd+Sadmapur+Sahson+Jaunpur+Road+Prayagraj',
      icon: '🙏',
      dtStart: '20261121T100000',
      dtEnd: '20261121T140000',
      description: 'The sacred Vidai ceremony — a heartfelt farewell as the bride departs with blessings.'
    }
  ];

  // =========================================================================
  // VENUE LOCATIONS
  // =========================================================================
  readonly venues = {
    lucknow: {
      name: 'Family Residence',
      address: 'B-42, Him City Part 1, Dewa Road, Lucknow',
      events: 'Tel Pooja · Haldi & Mehendi · Baraat Departure',
      mapsUrl: 'https://maps.google.com/?q=Him+City+Part+1+Dewa+Road+Lucknow',
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Him+City+Part+1+Dewa+Road+Lucknow'
    },
    prayagraj: {
      name: 'Bhola Garden',
      address: 'Kaserua Khurd, Sadmapur, Sahson, Jaunpur Road, Prayagraj',
      events: 'Wedding Ceremony · Vidai',
      mapsUrl: 'https://maps.google.com/?q=Bhola+Garden+Kaserua+Khurd+Sadmapur+Sahson+Jaunpur+Road+Prayagraj',
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Bhola+Garden+Kaserua+Khurd+Sadmapur+Sahson+Jaunpur+Road+Prayagraj'
    }
  };

  // =========================================================================
  // FAMILY BLESSING
  // =========================================================================
  readonly familyBlessing = {
    title: 'Humble Request',
    from: 'Mr. Brijendra Verma',
    family: 'Verma Family'
  };

  // =========================================================================
  // CALENDAR ICS DOWNLOAD
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
}
