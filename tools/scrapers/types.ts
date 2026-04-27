export interface SeasonStats {
  year: string;
  team: string;
  league: string;
  gamesPlayed: number;
  minutes: number;
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  fgPct: number;
  threePct: number;
  ftPct: number;
  minutesPerGame: number;
  ppg: number;
  rpg: number;
  apg: number;
  spg: number;
  bpg: number;
  highlights: string[];
  awards: string;
}

export interface RawSeasonStats {
  year: string;
  team: string;
  league?: string;
  gamesPlayed: number;
  minutes: number;
  points: number;
  twoFgMade: number;
  twoFgAttempted: number;
  threeFgMade: number;
  threeFgAttempted: number;
  ftMade: number;
  ftAttempted: number;
  offRebounds: number;
  defRebounds: number;
  totalRebounds: number;
  assists: number;
  personalFouls: number;
  blocks: number;
  steals: number;
  turnovers: number;
}

export interface PlayerData {
  // Basic Info
  fullName: string;
  position: string;
  heightFt: string;
  heightCm: string;
  weightLbs: string;
  weightKg: string;
  birthdate: string;
  birthCity: string;
  highSchool: string;
  highSchoolLocation: string;
  university: string;
  graduationYear: string;
  twitter: string;
  instagram: string;
  howAcquired: string;
  yearsPro: string;
  nationality: string;

  // Career
  professionalSeasons: SeasonStats[];
  collegiateSeasons: SeasonStats[];

  // Additional
  nationalTeam: string;
  personalDetails: string;
  canadianConnection: string;

  // Raw stats tables
  professionalRawStats: RawSeasonStats[];
  collegiateRawStats: RawSeasonStats[];

  // Press Release
  headline: string;
  announcementDate: string;
  dayOfWeek: string;
  keyDescriptors: string;
  careerContext: string;
  collegiateBackground: string;
  rosterContext: string;
  seasonOpener: string;
  isCanadian: boolean;
  isRookie: boolean;
  signingTier: 'marquee' | 'standard' | 'canadian' | 'rookie';
}

export const emptySeasonStats: SeasonStats = {
  year: '',
  team: '',
  league: '',
  gamesPlayed: 0,
  minutes: 0,
  points: 0,
  rebounds: 0,
  assists: 0,
  steals: 0,
  blocks: 0,
  fgPct: 0,
  threePct: 0,
  ftPct: 0,
  minutesPerGame: 0,
  ppg: 0,
  rpg: 0,
  apg: 0,
  spg: 0,
  bpg: 0,
  highlights: [''],
  awards: '',
};

export const emptyRawSeasonStats: RawSeasonStats = {
  year: '',
  team: '',
  league: '',
  gamesPlayed: 0,
  minutes: 0,
  points: 0,
  twoFgMade: 0,
  twoFgAttempted: 0,
  threeFgMade: 0,
  threeFgAttempted: 0,
  ftMade: 0,
  ftAttempted: 0,
  offRebounds: 0,
  defRebounds: 0,
  totalRebounds: 0,
  assists: 0,
  personalFouls: 0,
  blocks: 0,
  steals: 0,
  turnovers: 0,
};

export const emptyPlayerData: PlayerData = {
  fullName: '',
  position: '',
  heightFt: '',
  heightCm: '',
  weightLbs: '',
  weightKg: '',
  birthdate: '',
  birthCity: '',
  highSchool: '',
  highSchoolLocation: '',
  university: '',
  graduationYear: '',
  twitter: '',
  instagram: '',
  howAcquired: '',
  yearsPro: '',
  nationality: '',
  professionalSeasons: [],
  collegiateSeasons: [],
  nationalTeam: '',
  personalDetails: '',
  canadianConnection: '',
  professionalRawStats: [],
  collegiateRawStats: [],
  headline: '',
  announcementDate: '',
  dayOfWeek: '',
  keyDescriptors: '',
  careerContext: '',
  collegiateBackground: '',
  rosterContext: '',
  seasonOpener: '',
  isCanadian: false,
  isRookie: false,
  signingTier: 'standard',
};
