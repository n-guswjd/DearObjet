import { createPlaceholderImage } from '../utils/placeholder-image';

export interface MockArtist {
  artistId: number;
  userId: number;
  artistName: string;
  artistImageUrl: string | null;
}

const ARTIST_SEEDS: Pick<MockArtist, 'artistId' | 'artistName'>[] = [
  { artistId: 2, artistName: '데모 작가' },
  { artistId: 5, artistName: '달빛 작가' },
  { artistId: 31, artistName: '유리 작가' },
  { artistId: 32, artistName: '포근 뜨개' },
  { artistId: 33, artistName: '한지 공방' },
  { artistId: 34, artistName: '모래 도예' },
  { artistId: 35, artistName: '여름 자수' },
  { artistId: 36, artistName: '봄빛 캘리' },
  { artistId: 37, artistName: '소나무 가구' },
  { artistId: 38, artistName: '구름 인형' },
  { artistId: 39, artistName: '바람 가죽공방' },
  { artistId: 40, artistName: '새벽 사진관' },
  { artistId: 41, artistName: '민들레 비누' },
  { artistId: 42, artistName: '파랑 판화' },
  { artistId: 43, artistName: '노을 염색' },
  { artistId: 44, artistName: '단풍 목공' },
  { artistId: 45, artistName: '들꽃 드라이' },
  { artistId: 46, artistName: '하루 실크스크린' },
  { artistId: 47, artistName: '별빛 유리' },
  { artistId: 48, artistName: '꽃담 도자' },
  { artistId: 49, artistName: '초록 식물' },
  { artistId: 50, artistName: '마루 금속공예' },
  { artistId: 51, artistName: '솜사탕 뜨개' },
  { artistId: 52, artistName: '오후 일러스트' },
];

export const MOCK_ARTISTS: MockArtist[] = ARTIST_SEEDS.map((seed) => ({
  ...seed,
  userId: seed.artistId,
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
