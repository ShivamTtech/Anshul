export interface WeddingEvent {
  id: string;
  title: string;
  hindiTitle?: string;
  date: string;
  day: string;
  time: string;
  venue: string;
  address: string;
  description: string;
  dressCode: string;
  themeNote: string;
  colorPalette: { name: string; hex: string }[];
  image: string;
  highlights: string[];
  calendarData: {
    title: string;
    startDate: string; // YYYYMMDDTHHMMSS
    endDate: string;
    description: string;
    location: string;
  };
}

export interface MomentPhoto {
  id: number;
  title: string;
  subtitle: string;
  category: 'all' | 'prewedding' | 'ceremony' | 'sangeet';
  imageUrl: string;
  aspect?: string;
  caption?: string;
}

export interface GuestWish {
  id: string;
  name: string;
  relation: string;
  message: string;
  emoji: string;
  date: string;
  likes: number;
  isLiked?: boolean;
}

export interface RsvpSubmission {
  id?: string;
  name: string;
  phone: string;
  email: string;
  guestsCount: number;
  attendingEvents: string[];
  foodPreference: 'pure-veg' | 'jain-veg' | 'all';
  songRequest?: string;
  message?: string;
  createdAt: string;
}

export interface CoupleProfile {
  name: string;
  role: 'Dulha' | 'Dulhan';
  englishRole: string;
  title: string;
  bio: string;
  quote: string;
  parents: string;
  image: string;
}
