export interface CountryFlags {
  png: string;
  svg: string;
  alt: string;
}

export interface CountryName {
  common: string;
  official: string;
}

export interface Country {
  name: CountryName;
  cca3: string; // Common Code ISO 3166-1 alpha-3
  flags: CountryFlags;
  region: string;
  population: number;
}

export enum ReactionType {
  LIKE = 'LIKE',
  DISLIKE = 'DISLIKE',
  NONE = 'NONE'
}

export interface FlagFactResponse {
  history: string;
  symbolism: string;
  funFact: string;
}
