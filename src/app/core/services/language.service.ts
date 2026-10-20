import { Injectable, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type AppLanguage = 'en' | 'hi';

export interface TranslationDictionary {
  // Navigation & Actions
  navHome: string;
  navCouple: string;
  navCeremonies: string;
  navItinerary: string;
  navBlessings: string;
  navCard: string;
  navLanguage: string;
  navAudioPlay: string;
  navAudioMute: string;
  navMenuOpen: string;
  navMenuClose: string;
  langToggleLabel: string;
  langCurrentBadge: string;

  // Intro Envelope / Royal Folio
  shubhVivah: string;
  shreeGanesh: string;
  coupleNames: string;
  destinationTag: string;
  tapToOpenInvitation: string;
  enterSacredCelebration: string;
  folioInvitationText: string;

  // Chapter 01: Hero & Invocation
  chapter01Tag: string;
  chapter01Title: string;
  chapter01Subtitle: string;
  ganeshaShlokaTranslation: string;
  togetherWithFamilies: string;
  weddingRequestText: string;
  heroDatesAndPlaces: string;
  divineQuote: string;
  countdownBadge: string;
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  btnCeremonies: string;
  btnViewCard: string;
  btnRsvp: string;

  // Chapter 02: Couple
  chapter02Tag: string;
  chapter02Title: string;
  chapter02Subtitle: string;
  theGroom: string;
  theBride: string;
  groomRole: string;
  brideRole: string;
  tapToFlip: string;
  tapToReturn: string;
  groomBio: string;
  brideBio: string;
  ringCeremonyTitle: string;
  ringCeremonySubtitle: string;
  photoSwipeNotice: string;

  // Chapter 03: Ceremonies
  chapter03Tag: string;
  chapter03Title: string;
  chapter03Subtitle: string;
  btnGetDirections: string;
  btnAddToCalendar: string;
  btnDownloadAllIcs: string;

  // Chapter 04: Itinerary & Mandap
  chapter04Tag: string;
  chapter04Title: string;
  chapter04Subtitle: string;
  mandapRitualsTitle: string;
  mandapRitualsSubtitle: string;

  // Chapter 05: Blessings & RSVP
  chapter05Tag: string;
  chapter05Title: string;
  chapter05Subtitle: string;
  humbleRequestTitle: string;
  humbleRequestFrom: string;
  humbleRequestFamily: string;
  solicitationText: string;
  rsvpSectionTitle: string;
  rsvpSectionSubtitle: string;
  inputYourName: string;
  inputRelationCity: string;
  inputGuestCount: string;
  inputNote: string;
  optionAttendingAll: string;
  optionAttendingWedding: string;
  optionSendingBlessings: string;
  btnConfirmWhatsApp: string;
  wishesSectionTitle: string;
  wishesSectionSubtitle: string;
  btnSubmitBlessing: string;
  blessingPlaceholder: string;

  // Venue Logistics & Weather
  venueLogisticsTitle: string;
  venueLogisticsSubtitle: string;
  travelTipLabel: string;
  btnOpenMaps: string;
  weatherTitle: string;
  weatherAdviceLabel: string;

  // Footer & Common
  footerNames: string;
  footerDates: string;
  footerGratitude: string;
  btnBackToTop: string;
}

const EN_DICTIONARY: TranslationDictionary = {
  // Navigation & Actions
  navHome: 'Home',
  navCouple: 'Couple',
  navCeremonies: 'Ceremonies',
  navItinerary: 'Itinerary',
  navBlessings: 'Blessings',
  navCard: 'Card',
  navLanguage: 'Language',
  navAudioPlay: 'Play Wedding Symphony',
  navAudioMute: 'Mute Wedding Symphony',
  navMenuOpen: 'Open Menu',
  navMenuClose: 'Close Menu',
  langToggleLabel: 'हिन्दी',
  langCurrentBadge: 'ENG',

  // Intro Envelope / Royal Folio
  shubhVivah: '✦ SHUBH VIVAH ✦',
  shreeGanesh: '॥ श्री गणेशाय नमः ॥',
  coupleNames: 'Anshul & Vidisha',
  destinationTag: 'PRAYAGRAJ & LUCKNOW · 20TH NOVEMBER 2026',
  tapToOpenInvitation: 'TAP TO OPEN INVITATION',
  enterSacredCelebration: 'Enter Sacred Celebration ➔',
  folioInvitationText: 'Together with their families, request the pleasure of your company to celebrate their sacred wedding.',

  // Chapter 01: Hero & Invocation
  chapter01Tag: 'CHAPTER 01',
  chapter01Title: 'SACRED INVOCATION',
  chapter01Subtitle: 'Auspicious Blessings & Divine Grace',
  ganeshaShlokaTranslation: 'O Lord Ganesha, with curved trunk and immense brilliance, bless our sacred union and remove all impediments.',
  togetherWithFamilies: 'TOGETHER WITH THEIR FAMILIES',
  weddingRequestText: 'REQUEST THE PLEASURE OF YOUR COMPANY TO CELEBRATE THEIR WEDDING',
  heroDatesAndPlaces: '16th – 21st November 2026 · Lucknow & Prayagraj',
  divineQuote: '“With the divine grace of Almighty God and the cherished blessings of our ancestors, two lives, two hearts, and two families join together in holy matrimony.”',
  countdownBadge: 'COUNTDOWN TO SACRED WEDDING · 20 NOV 2026',
  days: 'DAYS',
  hours: 'HOURS',
  minutes: 'MINUTES',
  seconds: 'SECONDS',
  btnCeremonies: 'CEREMONIES',
  btnViewCard: 'CARD',
  btnRsvp: 'RSVP',

  // Chapter 02: Couple
  chapter02Tag: 'CHAPTER 02',
  chapter02Title: 'THE COUPLE',
  chapter02Subtitle: 'Two souls united by destiny, bound by eternal vows',
  theGroom: 'THE GROOM',
  theBride: 'THE BRIDE',
  groomRole: 'Groom',
  brideRole: 'Bride',
  tapToFlip: 'TAP TO READ PROFILE',
  tapToReturn: 'TAP TO RETURN',
  groomBio: 'Passionate, cultured, and devoted to family traditions. Embarking on this sacred journey of companionship with boundless warmth, honor, and joy.',
  brideBio: 'Graceful, affectionate, and deeply rooted in heritage. Stepping into this blessed new horizon with radiant smiles, gentle strength, and timeless grace.',
  ringCeremonyTitle: 'Sacred Ring Ceremony',
  ringCeremonySubtitle: 'An Auspicious Pledge of Eternal Companionship',
  photoSwipeNotice: 'Swipe or tap tabs to view couple portraits',

  // Chapter 03: Ceremonies
  chapter03Tag: 'CHAPTER 03',
  chapter03Title: 'AUSPICIOUS CEREMONIES',
  chapter03Subtitle: 'Join us across every sacred ritual of this celebratory journey',
  btnGetDirections: 'Directions',
  btnAddToCalendar: 'Add to Calendar',
  btnDownloadAllIcs: 'DOWNLOAD ALL CEREMONIES (.ICS)',

  // Chapter 04: Itinerary & Mandap
  chapter04Tag: 'CHAPTER 04',
  chapter04Title: 'WEDDING ITINERARY',
  chapter04Subtitle: 'The divine timeline of ceremonies and joyous celebrations',
  mandapRitualsTitle: 'SACRED MANDAP RITUALS',
  mandapRitualsSubtitle: 'Vedic significance behind the holy matrimonial rites',

  // Chapter 05: Blessings & RSVP
  chapter05Tag: 'CHAPTER 05',
  chapter05Title: 'BLESSINGS & INVITATION',
  chapter05Subtitle: 'Warm wishes, family solicitations, and sacred presence confirmation',
  humbleRequestTitle: 'Humble Request',
  humbleRequestFrom: 'Mr. Brijendra Verma',
  humbleRequestFamily: 'and Verma Family',
  solicitationText: 'With best compliments from all near and dear relatives & friends of Verma & Singh Families',
  rsvpSectionTitle: 'CONFIRM YOUR BLESSINGS (RSVP)',
  rsvpSectionSubtitle: 'Please let us know if you can join our celebration in Lucknow & Prayagraj',
  inputYourName: 'Your Full Name *',
  inputRelationCity: 'Relation / City',
  inputGuestCount: 'Number of Guests attending',
  inputNote: 'Warm message or dietary wishes (Optional)',
  optionAttendingAll: 'Attending All Ceremonies',
  optionAttendingWedding: 'Attending Wedding Ceremony Only (20 Nov)',
  optionSendingBlessings: 'Sending Blessings from Afar',
  btnConfirmWhatsApp: 'Confirm on WhatsApp ➔',
  wishesSectionTitle: 'LEAVE A BLESSING FOR ANSHUL & VIDISHA',
  wishesSectionSubtitle: 'Your warm prayers and heartfelt wishes crown this sacred union',
  btnSubmitBlessing: 'Send Sacred Blessing',
  blessingPlaceholder: 'Write your heartfelt congratulations and prayers...',

  // Venue Logistics & Weather
  venueLogisticsTitle: 'VENUE LOGISTICS & TRAVEL TIPS',
  venueLogisticsSubtitle: 'Essential directions for our family and cherished guests',
  travelTipLabel: 'Travel Guide:',
  btnOpenMaps: 'Open in Google Maps',
  weatherTitle: 'WEATHER & ATTIRE ADVICE',
  weatherAdviceLabel: 'Attire Suggestion:',

  // Footer & Common
  footerNames: 'ANSHUL & VIDISHA',
  footerDates: 'November 2026 · Lucknow & Prayagraj',
  footerGratitude: 'With love, deep respect, and gratitude from the Verma & Singh families',
  btnBackToTop: 'Back to Sacred Invocation ↑'
};

const HI_DICTIONARY: TranslationDictionary = {
  // Navigation & Actions
  navHome: 'मुख्य पृष्ठ',
  navCouple: 'वर-वधू',
  navCeremonies: 'कार्यक्रम',
  navItinerary: 'समय-सारणी',
  navBlessings: 'आशीर्वाद',
  navCard: 'मूल पत्रिका',
  navLanguage: 'भाषा',
  navAudioPlay: 'विवाह संगीत सुनें',
  navAudioMute: 'संगीत बंद करें',
  navMenuOpen: 'मेनू खोलें',
  navMenuClose: 'मेनू बंद करें',
  langToggleLabel: 'ENG',
  langCurrentBadge: 'हिन्दी',

  // Intro Envelope / Royal Folio
  shubhVivah: '✦ शुभ विवाह ✦',
  shreeGanesh: '॥ श्री गणेशाय नमः ॥',
  coupleNames: 'अंशुल एवं विदिशा',
  destinationTag: 'प्रयागराज एवं लखनऊ · 20 नवम्बर 2026',
  tapToOpenInvitation: 'निमंत्रण पत्र खोलें',
  enterSacredCelebration: 'विवाह उत्सव में प्रवेश करें ➔',
  folioInvitationText: 'सपरिवार आपके स्नेहपूर्ण उपस्थिति एवं शुभाशीर्वाद के आकांक्षी हैं।',

  // Chapter 01: Hero & Invocation
  chapter01Tag: 'अध्याय 01',
  chapter01Title: 'मांगलिक गणेश वंदना',
  chapter01Subtitle: 'विघ्नहर्ता का आशीर्वाद एवं ईश्वरीय कृपा',
  ganeshaShlokaTranslation: 'हे विशालकाय, वक्रतुण्ड, सूर्य के समान तेजस्वी भगवान श्री गणेश! हमारे इस पावन विवाह कार्य को सदा निर्विघ्न संपन्न करें।',
  togetherWithFamilies: 'सपरिवार सादर आमंत्रित',
  weddingRequestText: 'हमारे शुभ विवाह के पावन अवसर पर आपकी गरिमामयी उपस्थिति सादर प्रार्थनीय है',
  heroDatesAndPlaces: '16 – 21 नवम्बर 2026 · लखनऊ एवं प्रयागराज',
  divineQuote: '“परमपिता परमेश्वर की असीम अनुकम्पा एवं पूज्य पूर्वजों के शुभाशीर्वाद से, दो आत्माएं, दो हृदय और दो परिवार पावन वैवाहिक सूत्र में बंध रहे हैं।”',
  countdownBadge: 'शुभ विवाह लग्न की उलटी गिनती · 20 नवम्बर 2026',
  days: 'दिन',
  hours: 'घंटे',
  minutes: 'मिनट',
  seconds: 'सेकंड',
  btnCeremonies: 'कार्यक्रम',
  btnViewCard: 'मूल पत्रिका',
  btnRsvp: 'उपस्थिति दर्ज करें',

  // Chapter 02: Couple
  chapter02Tag: 'अध्याय 02',
  chapter02Title: 'वर एवं वधू',
  chapter02Subtitle: 'भाग्य से जुड़े दो मन, पवित्र सात फेरों से बंधते दो जीवन',
  theGroom: 'वर',
  theBride: 'वधू',
  groomRole: 'वर',
  brideRole: 'वधू',
  tapToFlip: 'परिचय देखने हेतु टैप करें',
  tapToReturn: 'वापस जाएँ',
  groomBio: 'पारिवारिक संस्कारों, सौम्य स्वभाव एवं भारतीय परंपराओं के प्रति समर्पित। जीवन की इस पावन यात्रा में प्रेम, निष्ठा व सम्मान के साथ अग्रसर।',
  brideBio: 'संस्कारवान, स्नेहमयी एवं सनातन संस्कृति में गहरी आस्था रखने वाली। मृदुभाषी एवं गरिमामयी व्यक्तित्व से नई गृहस्थी में प्रवेश करती हुई।',
  ringCeremonyTitle: 'शुभ वाग्दान (तिलक व सगाई)',
  ringCeremonySubtitle: 'जीवन भर साथ निभाने का पावन संकल्प',
  photoSwipeNotice: 'वर-वधू के चित्र देखने हेतु स्वाइप या टैब दबाएँ',

  // Chapter 03: Ceremonies
  chapter03Tag: 'अध्याय 03',
  chapter03Title: 'मांगलिक वैवाहिक कार्यक्रम',
  chapter03Subtitle: 'विवाह उत्सव के प्रत्येक मांगलिक अनुष्ठान में आपकी उपस्थिति प्रार्थनीय है',
  btnGetDirections: 'मार्ग देखें (Maps)',
  btnAddToCalendar: 'कैलेंडर में जोड़ें',
  btnDownloadAllIcs: 'सभी कार्यक्रम कैलेंडर में जोड़ें (.ics)',

  // Chapter 04: Itinerary & Mandap
  chapter04Tag: 'अध्याय 04',
  chapter04Title: 'विवाह दिवस समय-सारणी',
  chapter04Subtitle: 'विवाह के पावन अनुष्ठानों का समयबद्ध विवरण',
  mandapRitualsTitle: 'पवित्र मंडप संस्कार',
  mandapRitualsSubtitle: 'वैदिक वैवाहिक संस्कारों का आध्यात्मिक महत्व',

  // Chapter 05: Blessings & RSVP
  chapter05Tag: 'अध्याय 05',
  chapter05Title: 'आशीर्वाद एवं निमंत्रण',
  chapter05Subtitle: 'परिवार का स्नेह, बुजुर्गों का शुभाशीर्वाद एवं उपस्थिति पुष्टि',
  humbleRequestTitle: 'दर्शनाभिलाषी',
  humbleRequestFrom: 'श्री बृजेंद्र वर्मा',
  humbleRequestFamily: 'एवं समस्त वर्मा परिवार',
  solicitationText: 'समस्त स्वजन, मित्रगण एवं स्नेही सम्बन्धी (वर्मा एवं सिंह परिवार)',
  rsvpSectionTitle: 'उपस्थिति पुष्टि (RSVP)',
  rsvpSectionSubtitle: 'कृपया लखनऊ व प्रयागराज में अपनी उपस्थिति की सूचना साझा करें',
  inputYourName: 'आपका पूरा नाम *',
  inputRelationCity: 'रिश्ता / शहर',
  inputGuestCount: 'आने वाले स्वजनों की संख्या',
  inputNote: 'संदेश अथवा शुभकामना (वैकल्पिक)',
  optionAttendingAll: 'सभी कार्यक्रमों में उपस्थित रहेंगे',
  optionAttendingWedding: 'केवल विवाह समारोह में उपस्थित रहेंगे (20 नवम्बर)',
  optionSendingBlessings: 'सस्नेह मंगलकामनाएं प्रेषित करते हैं',
  btnConfirmWhatsApp: 'व्हाट्सएप पर पुष्टि करें ➔',
  wishesSectionTitle: 'वर-वधू को अपना शुभाशीर्वाद प्रेषित करें',
  wishesSectionSubtitle: 'आपकी आत्मीय प्रार्थनाएं एवं स्नेह इस पवित्र बंधन को परिपूर्ण बनाते हैं',
  btnSubmitBlessing: 'शुभाशीर्वाद भेजें',
  blessingPlaceholder: 'वर-वधू के लिए अपने मंगल वचन एवं आशीर्वाद यहाँ लिखें...',

  // Venue Logistics & Weather
  venueLogisticsTitle: 'विवाह स्थल मार्ग एवं आवश्यक जानकारी',
  venueLogisticsSubtitle: 'हमारे सभी आत्मीय अतिथियों हेतु सुगम यात्रा निर्देश',
  travelTipLabel: 'मार्गदर्शिका:',
  btnOpenMaps: 'गूगल मैप्स में देखें',
  weatherTitle: 'मौसम एवं पोशाक परामर्श',
  weatherAdviceLabel: 'पोशाक सुझाव:',

  // Footer & Common
  footerNames: 'अंशुल एवं विदिशा',
  footerDates: 'नवम्बर 2026 · लखनऊ एवं प्रयागराज',
  footerGratitude: 'वर्मा एवं सिंह परिवार की ओर से सप्रेम आभार एवं हार्दिक धन्यवाद',
  btnBackToTop: 'शीर्ष पर जाएँ ↑'
};

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private platformId = inject(PLATFORM_ID);

  // Reactive Language Signal
  readonly currentLang = signal<AppLanguage>('en');

  // Computed helper for Hindi check
  readonly isHindi = computed(() => this.currentLang() === 'hi');

  // Computed reactive dictionary
  readonly t = computed<TranslationDictionary>(() => {
    return this.currentLang() === 'hi' ? HI_DICTIONARY : EN_DICTIONARY;
  });

  constructor() {
    this.initLanguage();
  }

  private initLanguage() {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      // 1. Check user's saved preference
      const saved = localStorage.getItem('wedding_lang') as AppLanguage;
      if (saved === 'en' || saved === 'hi') {
        this.currentLang.set(saved);
        this.updateDocumentLang(saved);
        return;
      }

      // 2. Auto-detect browser/phone language preference
      const navLang = navigator?.language?.toLowerCase() || '';
      const navLanguages = navigator?.languages || [];
      const isHindiDevice = 
        navLang.startsWith('hi') || 
        navLanguages.some(l => l.toLowerCase().startsWith('hi'));

      const initialLang: AppLanguage = isHindiDevice ? 'hi' : 'en';
      this.currentLang.set(initialLang);
      this.updateDocumentLang(initialLang);
    } catch (e) {
      // Fallback safely to English
      this.currentLang.set('en');
    }
  }

  setLanguage(lang: AppLanguage) {
    if (this.currentLang() === lang) return;
    this.currentLang.set(lang);

    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem('wedding_lang', lang);
        this.updateDocumentLang(lang);
      } catch (e) {
        // Storage disabled or private browsing
      }
    }
  }

  toggleLanguage() {
    const next: AppLanguage = this.currentLang() === 'en' ? 'hi' : 'en';
    this.setLanguage(next);
  }

  private updateDocumentLang(lang: AppLanguage) {
    if (typeof document !== 'undefined' && document.documentElement) {
      document.documentElement.setAttribute('lang', lang);
    }
  }
}
