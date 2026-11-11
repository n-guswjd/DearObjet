import { createPlaceholderImage } from '../utils/placeholder-image';

export interface MockArtist {
  artistId: number;
  artistName: string;
  artistImageUrl: string | null;
}

const ARTIST_SEEDS: Pick<MockArtist, 'artistId' | 'artistName'>[] = [
  { artistId: 2, artistName: '데모 작가' },
  { artistId: 5, artistName: '달빛 작가' },
  { artistId: 31, artistName: '유리 작가' },
  { artistId: 32, artistName: '포근 뜨개' },
  { artistId: 33, artistName: '한지 공방' },
];

export const MOCK_ARTISTS: MockArtist[] = ARTIST_SEEDS.map((seed) => ({
  ...seed,
  artistImageUrl: createPlaceholderImage(seed.artistId, seed.artistName),
}));

export const SHOP_ARTIST_IDS: Record<number, number[]> = {
  1: [2, 5, 31],
  2: [5, 32],
  3: [2, 33],
  4: [5, 31],
  5: [32, 33],
  6: [31],
  7: [2, 32],
  8: [33, 5],
};
