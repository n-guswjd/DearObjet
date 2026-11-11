import { http, HttpResponse } from 'msw';

import { MOCK_ARTISTS } from '../data/mock-artists';
import { seededShuffle } from '../utils/seeded-shuffle';

export const artistPageHandlers = [
  http.get('*/api/v1/artists', ({ request }) => {
    const url = new URL(request.url);
    const seed = Number(url.searchParams.get('seed') ?? 1);
    const cursor = Number(url.searchParams.get('cursor') ?? 0);
    const size = Number(url.searchParams.get('size') ?? 9);

    const shuffled = seededShuffle(MOCK_ARTISTS, seed);
    const nextCursor = cursor + size;
    const hasNext = nextCursor < shuffled.length;

    return HttpResponse.json({
      data: {
        artists: shuffled.slice(cursor, nextCursor).map((artist) => ({
          artistId: artist.artistId,
          userId: artist.userId,
          profileUrl: artist.artistImageUrl ?? '',
          name: artist.artistName,
        })),
        seed,
        nextCursor: hasNext ? nextCursor : 0,
        hasNext,
      },
    });
  }),
];
