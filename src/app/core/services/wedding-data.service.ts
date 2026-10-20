import { Injectable, inject, signal, computed } from '@angular/core';
import { LanguageService } from './language.service';

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

export interface CoupleProfile {
  name: string;
  subtitle: string;
  parentage: string;
  role: string;
  city: string;
}

export interface VenueDetail {
  name: string;
  cityTag: string;
  address: string;
  landmark: string;
  events: string;
  travelTip: string;
  latitude: number;
  longitude: number;
  mapsUrl: string;
  directionsUrl: string;
  streetViewUrl?: string;
  placeUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class WeddingDataService {
  private lang = inject(LanguageService);

  // =========================================================================
  // 1. COUPLE PROFILES (ENGLISH & HINDI)
  // =========================================================================
  private readonly groomEn: CoupleProfile = {
    name: 'Anshul Verma',
    subtitle: 'GROOM',
    parentage: 'S/o Late Mr. Devendra Verma & Mrs. Savitri Verma',
    role: 'Groom',
    city: 'Lucknow'
  };

  private readonly groomHi: CoupleProfile = {
    name: 'अंशुल वर्मा',
    subtitle: 'वर (GROOM)',
    parentage: 'सुपुत्र: स्वर्गीय श्री देवेन्द्र वर्मा एवं श्रीमती सावित्री वर्मा',
    role: 'वर',
    city: 'लखनऊ'
  };

  private readonly brideEn: CoupleProfile = {
    name: 'Vidisha Singh',
    subtitle: 'BRIDE',
    parentage: 'D/o Mr. Vijay Prakash Singh & Mrs. Usha Singh',
    role: 'Bride',
    city: 'Prayagraj'
  };

  private readonly brideHi: CoupleProfile = {
    name: 'विदिशा सिंह',
    subtitle: 'वधू (BRIDE)',
    parentage: 'सुपुत्री: श्री विजय प्रकाश सिंह एवं श्रीमती उषा सिंह',
    role: 'वधू',
    city: 'प्रयागराज'
  };

  get groom(): CoupleProfile {
    return this.lang.currentLang() === 'hi' ? this.groomHi : this.groomEn;
  }

  get bride(): CoupleProfile {
    return this.lang.currentLang() === 'hi' ? this.brideHi : this.brideEn;
  }

  // =========================================================================
  // 2. SACRED VEDIC SHLOKAS
  // =========================================================================
  readonly shlokas = [
    {
      sanskrit: '॥ वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥',
      translationEn: 'O Lord Ganesha, with curved trunk and immense brilliance, bless our sacred union and remove all impediments.',
      translationHi: 'हे विघ्नहर्ता भगवान श्री गणेश, हमारे इस मांगलिक कार्य को निर्विघ्न संपन्न कर अपना आशीर्वाद प्रदान करें।',
      context: 'Invocation to Lord Ganesha'
    },
    {
      sanskrit: '॥ माङ्गल्यं तन्तुनानेन जगन्मङ्गलकारिणी। कण्ठे बध्नामि सुभगे सञ्जीव शरदः शतम् ॥',
      translationEn: 'This sacred bond bestows auspiciousness on all. Together we embark on a life of devotion and companionship for a hundred autumns.',
      translationHi: 'यह मंगलसूत्र जीवन में सौभाग्य व समृद्धि का प्रतीक है। हम सौ वर्षों तक प्रेम व सहधर्मिता संग जीवन व्यतीत करें।',
      context: 'Sacred Vivaha Blessing'
    }
  ];

  // =========================================================================
  // 3. SACRED CEREMONIES (ENGLISH & HINDI)
  // =========================================================================
  private readonly ceremoniesEn: WeddingCeremony[] = [
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

  private readonly ceremoniesHi: WeddingCeremony[] = [
    {
      id: 'tel-pooja',
      title: 'तेल पूजन',
      subtitle: 'पारंपरिक तेल पूजन अनुष्ठान',
      date: '16 नवम्बर 2026',
      dateShort: '16 नव',
      time: 'प्रातः 10:00 बजे से',
      venue: 'पारिवारिक निवास',
      venueAddress: 'B-42, हिम सिटी पार्ट 1, देवा रोड, लखनऊ',
      mapsUrl: 'https://www.google.com/maps?q=26.896637,81.0498644',
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=26.896637,81.0498644',
      icon: '🪔',
      dtStart: '20261116T100000',
      dtEnd: '20261116T140000',
      description: 'वर हेतु पावन तेल पूजन, उबटन एवं बुजुर्गों के मंगल आशीर्वाद का पावन अनुष्ठान।'
    },
    {
      id: 'haldi-mehendi',
      title: 'हल्दी एवं मेहंदी',
      subtitle: 'हल्दी लेपन, संगीत एवं मेहंदी उत्सव',
      date: '19 नवम्बर 2026',
      dateShort: '19 नव',
      time: 'प्रातः 11:00 बजे एवं संध्या संगीत',
      venue: 'पारिवारिक निवास',
      venueAddress: 'B-42, हिम सिटी पार्ट 1, देवा रोड, लखनऊ',
      mapsUrl: 'https://www.google.com/maps?q=26.896637,81.0498644',
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=26.896637,81.0498644',
      icon: '🌿',
      dtStart: '20261119T110000',
      dtEnd: '20261119T210000',
      description: 'उज्ज्वल हल्दी लेपन, पारंपरिक लोकगीत, मेहंदी रचाई एवं उल्लासपूर्ण पारिवारिक संगीत समारोह।'
    },
    {
      id: 'wedding',
      title: 'शुभ विवाह संस्कार',
      subtitle: 'पाणिग्रहण एवं सप्तपदी संस्कार',
      date: '20 नवम्बर 2026',
      dateShort: '20 नव',
      time: 'बारात: 11:00 AM · जयमाला: 7:30 PM · फेरे: 11:00 PM',
      venue: 'भोला गार्डन',
      venueAddress: 'कसेरुआ खुर्द, सद्दामपुर, सहसों, जौनपुर रोड, प्रयागराज',
      mapsUrl: 'https://www.google.com/maps/place/Bhola+Garden/@25.4818101,81.9742563,17z/data=!3m1!4b1!4m6!3m5!1s0x399ab325d7ca92dd:0xfb1cfad2936bc26d!8m2!3d25.4818101!4d81.9742563!16s%2Fg%2F11fszf8qj8',
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=25.4818101,81.9742563',
      icon: '💍',
      dtStart: '20261120T180000',
      dtEnd: '20261121T020000',
      description: 'बारात प्रस्थान B-42 हिम सिटी देवा रोड लखनऊ से। पावन विवाह समारोह भोला गार्डन सहसों प्रयागराज में।'
    },
    {
      id: 'vidai',
      title: 'विदाई वेला',
      subtitle: 'मंगल आशीर्वाद एवं भावभीनी विदाई',
      date: '21 नवम्बर 2026',
      dateShort: '21 नव',
      time: 'प्रातः काल शुभ विदाई मुहूर्त',
      venue: 'भोला गार्डन',
      venueAddress: 'कसेरुआ खुर्द, सद्दामपुर, सहसों, जौनपुर रोड, प्रयागराज',
      mapsUrl: 'https://www.google.com/maps/place/Bhola+Garden/@25.4818101,81.9742563,17z/data=!3m1!4b1!4m6!3m5!1s0x399ab325d7ca92dd:0xfb1cfad2936bc26d!8m2!3d25.4818101!4d81.9742563!16s%2Fg%2F11fszf8qj8',
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=25.4818101,81.9742563',
      icon: '🌸',
      dtStart: '20261121T080000',
      dtEnd: '20261121T120000',
      description: 'अक्षत वर्षा एवं मंगल कामनाओं के साथ वधू का वर्मा परिवार में गृह प्रवेश हेतु विदाई।'
    }
  ];

  get ceremonies(): WeddingCeremony[] {
    return this.lang.currentLang() === 'hi' ? this.ceremoniesHi : this.ceremoniesEn;
  }

  // =========================================================================
  // 4. WEDDING DAY TIMELINE (ENGLISH & HINDI)
  // =========================================================================
  private readonly weddingTimelineEn: ProgramStep[] = [
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

  private readonly weddingTimelineHi: ProgramStep[] = [
    {
      time: 'पूर्वाह्न 11:00 बजे',
      title: 'बारात प्रस्थान',
      subtitle: 'लखनऊ निवास से प्रयागराज हेतु',
      desc: 'परिवारजनों, ढोल-नगाड़ों एवं बुजुर्गों के आशीर्वाद संग बारात लखनऊ से प्रयागराज के लिए रवाना होगी।',
      icon: '🎺'
    },
    {
      time: 'सायं 7:30 बजे',
      title: 'द्वार पूजा एवं जयमाला',
      subtitle: 'भव्य स्वागत एवं वरमाला',
      desc: 'गुलाब जल व पुष्प वर्षा से बारातियों का भव्य सत्कार, तत्पश्चात शुभ वरमाला समारोह।',
      icon: '🌺'
    },
    {
      time: 'रात्रि 8:30 बजे',
      title: 'प्रीतिभोज',
      subtitle: 'शाही विवाह महाभोज',
      desc: 'अवधी एवं पूर्वांचली विशिष्ट व्यंजनों से सराबोर दोनों परिवारों का स्नेहपूर्ण महाभोज।',
      icon: '🍽️'
    },
    {
      time: 'भोर / ब्रह्म मुहूर्त',
      title: 'विदाई समारोह',
      subtitle: 'शुभ विदाई',
      desc: 'अक्षत वर्षा एवं मंगल कामनाओं के साथ वधू का वर्मा परिवार में गृह प्रवेश हेतु विदाई।',
      icon: '🕊️'
    }
  ];

  get weddingTimeline(): ProgramStep[] {
    return this.lang.currentLang() === 'hi' ? this.weddingTimelineHi : this.weddingTimelineEn;
  }

  // =========================================================================
  // 5. SACRED MANDAP RITUALS (ENGLISH & HINDI)
  // =========================================================================
  private readonly mandapRitualsEn: SacredRitual[] = [
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

  private readonly mandapRitualsHi: SacredRitual[] = [
    {
      name: 'हस्तमिलाप',
      desc: 'वर-वधू के हाथों का पावन मिलन, जो दो हृदयों और आत्माओं के एकाकार होने का प्रतीक है।',
      symbol: '🤝'
    },
    {
      name: 'गठबंधन',
      desc: 'वर के उत्तरीय एवं वधू के आँचल की पवित्र ग्रंथि, जो अटूट दांपत्य निष्ठा की परिचायक है।',
      symbol: '🪢'
    },
    {
      name: 'सप्तपदी (सात फेरे)',
      desc: 'अग्निदेव को साक्षी मानकर लिए गए सात पावन वचन—अन्न, बल, धन, सुख-दुःख में आजन्म सहधर्मिता का संकल्प।',
      symbol: '🔥'
    },
    {
      name: 'सिंदूर दान एवं मंगलसूत्र',
      desc: 'सुहाग के पावन प्रतीक सिंदूर व मंगलसूत्र से वर द्वारा वधू को दांपत्य गौरव प्रदान करना।',
      symbol: '✨'
    }
  ];

  get mandapRituals(): SacredRitual[] {
    return this.lang.currentLang() === 'hi' ? this.mandapRitualsHi : this.mandapRitualsEn;
  }

  // =========================================================================
  // 6. VENUE LOCATIONS & TRAVEL LOGISTICS
  // =========================================================================
  private readonly venuesEn = {
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

  private readonly venuesHi = {
    lucknow: {
      name: 'पारिवारिक निवास',
      cityTag: 'लखनऊ',
      address: 'B-42, हिम सिटी पार्ट 1, देवा रोड, लखनऊ',
      landmark: 'देवा रोड / मटियारी चौराहे के समीप',
      events: 'तेल पूजन · हल्दी एवं मेहंदी · बारात प्रस्थान',
      travelTip: 'लखनऊ चारबाग रेलवे स्टेशन से लगभग 25 मिनट की दूरी; रिंग रोड के माध्यम से सुगम मार्ग।',
      latitude: 26.896637,
      longitude: 81.0498644,
      mapsUrl: 'https://www.google.com/maps?q=26.896637,81.0498644',
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=26.896637,81.0498644',
      streetViewUrl: 'https://www.google.com/maps/@26.896637,81.0498644,141a,75y,307.45h,90t/data=!3m7!1e1!3m5!1sxD2NSGZ6dEHHQ5kPJzBbOg!2e0!6shttps:%2F%2Fstreetviewpixels-pa.clients6.google.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D0%26panoid%3DxD2NSGZ6dEHHQ5kPJzBbOg%26yaw%3D307.45!7i16384!8i8192?entry=ttu&g_ep=EgoyMDI2MTAxMS4wIKXMDSoASAFQAw%3D%3D'
    },
    prayagraj: {
      name: 'भोला गार्डन',
      cityTag: 'प्रयागराज',
      address: 'कसेरुआ खुर्द, सद्दामपुर, सहसों, जौनपुर रोड, प्रयागराज',
      landmark: 'जौनपुर रोड, सहसों बाईपास',
      events: 'विवाह समारोह · जयमाला · फेरे · विदाई',
      travelTip: 'सहसों के पास जौनपुर मार्ग पर स्थित। लखनऊ से NH30 हाईवे द्वारा लगभग 3.5 से 4 घंटे का सुगम सफर।',
      latitude: 25.4818101,
      longitude: 81.9742563,
      mapsUrl: 'https://www.google.com/maps/place/Bhola+Garden/@25.4818101,81.9742563,17z/data=!3m1!4b1!4m6!3m5!1s0x399ab325d7ca92dd:0xfb1cfad2936bc26d!8m2!3d25.4818101!4d81.9742563!16s%2Fg%2F11fszf8qj8',
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=25.4818101,81.9742563',
      placeUrl: 'https://www.google.com/maps/place/Bhola+Garden/@25.4818101,81.9742563,17z/data=!3m1!4b1!4m6!3m5!1s0x399ab325d7ca92dd:0xfb1cfad2936bc26d!8m2!3d25.4818101!4d81.9742563!16s%2Fg%2F11fszf8qj8!18m1!1e1?entry=ttu&g_ep=EgoyMDI2MTAxMS4wIKXMDSoASAFQAw%3D%3D'
    }
  };

  get venues() {
    return this.lang.currentLang() === 'hi' ? this.venuesHi : this.venuesEn;
  }

  // =========================================================================
  // 7. FAMILY BLESSINGS & SOLICITATIONS
  // =========================================================================
  private readonly familyBlessingEn = {
    title: 'Humble Request',
    from: 'Mr. Brijendra Verma',
    family: 'and Verma Family',
    solicitation: 'With best compliments from all near and dear relatives & friends of Verma & Singh Families'
  };

  private readonly familyBlessingHi = {
    title: 'दर्शनाभिलाषी',
    from: 'श्री बृजेंद्र वर्मा',
    family: 'एवं समस्त वर्मा परिवार',
    solicitation: 'समस्त स्वजन, मित्रगण एवं स्नेही सम्बन्धी (वर्मा एवं सिंह परिवार)'
  };

  get familyBlessing() {
    return this.lang.currentLang() === 'hi' ? this.familyBlessingHi : this.familyBlessingEn;
  }

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
      relation: relation.trim() || (this.lang.currentLang() === 'hi' ? 'शुभचिंतक' : 'Well Wisher'),
      message: message.trim(),
      date: this.lang.currentLang() === 'hi' ? 'अभी-अभी' : 'Just Now'
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
    const isHi = this.lang.currentLang() === 'hi';
    const text = isHi
      ? `नमस्ते! 🙏\n\n*अंशुल वर्मा एवं विदिशा सिंह के पावन विवाह समारोह* में हम अपनी उपस्थिति की सानंद पुष्टि करते हैं।\n\n👤 *अतिथि का नाम:* ${name || 'आत्मीय स्वजन'}\n✨ *कार्यक्रम:* ${attendance || 'सभी कार्यक्रम'}\n👥 *अतिथियों की संख्या:* ${count || '2'}${note ? `\n💬 *संदेश:* ${note}` : ''}\n\nवर्मा एवं सिंह परिवार संग इस उत्सव का आनंद लेने हेतु उत्सुक हैं! 🎉`
      : `Namaste! 🙏\n\nI am delighted to confirm our presence for *Anshul Verma & Vidisha Singh's Royal Wedding Celebrations*.\n\n👤 *Guest Name:* ${name || 'Family Guest'}\n✨ *Attending:* ${attendance || 'All Ceremonies'}\n👥 *Total Guests:* ${count || '2'}${note ? `\n💬 *Note:* ${note}` : ''}\n\nLooking forward to celebrating with the Verma & Singh families! 🎉`;
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  }

  generateWhatsAppShareUrl(): string {
    const isHi = this.lang.currentLang() === 'hi';
    const text = isHi
      ? `🌸 *शुभ विवाह निमंत्रण* 🌸\n\n*अंशुल वर्मा एवं विदिशा सिंह* के पावन विवाह समारोह में आप सपरिवार सादर आमंत्रित हैं।\n\n📅 16 – 21 नवम्बर 2026\n📍 लखनऊ एवं प्रयागराज\n\nडिजिटल विवाह निमंत्रण पत्रिका यहाँ देखें:\n${typeof window !== 'undefined' ? window.location.href : 'http://localhost:4200'}`
      : `🌸 *Wedding Invitation* 🌸\n\nYou are cordially invited to celebrate the sacred wedding of\n*Anshul Verma & Vidisha Singh*\n\n📅 16th – 21st November 2026\n📍 Lucknow & Prayagraj\n\nView the royal digital invitation card here:\n${typeof window !== 'undefined' ? window.location.href : 'http://localhost:4200'}`;
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  }

  private readonly weatherAndAttireEn = {
    season: 'Autumn / Early Winter in Awadh & Sangam',
    forecast: '18°C – 28°C (Pleasant days, crisp breezy evenings)',
    attireAdvice: 'Traditional festive Indian attire. A light festive shawl or coat is recommended for outdoor evening mandap ceremonies in Prayagraj.'
  };

  private readonly weatherAndAttireHi = {
    season: 'अवध एवं संगम में सुहावनी शरद ऋतु',
    forecast: '18°C – 28°C (सुखद धूप, शाम को हल्की ठंडी बयार)',
    attireAdvice: 'पारंपरिक भारतीय परिधान। प्रयागराज में खुले मंडप की संध्या कालीन रस्मों हेतु हल्की शॉल या जैकेट उपयुक्त रहेगी।'
  };

  get weatherAndAttire() {
    return this.lang.currentLang() === 'hi' ? this.weatherAndAttireHi : this.weatherAndAttireEn;
  }
}
