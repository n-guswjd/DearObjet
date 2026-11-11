import { http, HttpResponse } from 'msw';

import type {
  BusinessHours,
  ShopDetail,
} from '../../features/map/types/map-types';
import type {
  AvailableSlot,
  CreateReservationRequest,
} from '../../features/map/types/one-day-class-types';
import type { ShopReviewItem } from '../../features/map/types/review-types';

import { MOCK_ARTISTS, SHOP_ARTIST_IDS } from '../data/mock-artists';
import { MOCK_CLASSES } from '../data/mock-classes';
import { MOCK_RESERVATIONS } from '../data/mock-reservations';
import { MOCK_REVIEWS } from '../data/mock-reviews';
import type { MockReview } from '../data/mock-reviews';
import { MOCK_SHOPS } from '../data/mock-shops';
import { MOCK_STORIES } from '../data/mock-stories';
import { getMockUser } from '../data/mock-users';
import { paginate } from '../utils/paginate';
import { readAsDataUrl } from '../utils/read-as-data-url';
import { notFound, unauthorized } from '../utils/responses';

import { isFavoriteShop } from './favorite-handlers';

interface SessionInfo {
  classId: number;
  date: string;
  time: string;
}

const STORIES_PER_PAGE = 4;
const SLOT_TIMES = ['11:00', '14:00', '16:00'];
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const DAY_KEYS: (keyof BusinessHours)[] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

const BUSINESS_HOURS: BusinessHours = {
  monday: { openTime: null, closeTime: null },
  tuesday: { openTime: '11:00', closeTime: '19:00' },
  wednesday: { openTime: '11:00', closeTime: '19:00' },
  thursday: { openTime: '11:00', closeTime: '19:00' },
  friday: { openTime: '11:00', closeTime: '19:00' },
  saturday: { openTime: '11:00', closeTime: '19:00' },
  sunday: { openTime: '12:00', closeTime: '18:00' },
};

const sessionIds = new Map<string, number>();
const sessions = new Map<number, SessionInfo>();
const reservedGuests = new Map<number, number>();

let nextSessionId = 1;
let nextReservationNumber = 20261201;
let nextReviewId = 100000;

const getSessionId = (classId: number, date: string, time: string) => {
  const key = `${classId}|${date}|${time}`;
  const existing = sessionIds.get(key);

  if (existing !== undefined) {
    return existing;
  }

  const created = nextSessionId++;
  sessionIds.set(key, created);
  sessions.set(created, { classId, date, time });

  return created;
};

const getToday = () => new Date().toLocaleDateString('sv-SE');

const toReviewItem = (
  review: MockReview,
  viewerId?: number
): ShopReviewItem => ({
  reviewId: review.reviewId,
  userId: review.userId,
  authorName: review.authorName,
  authorProfileUrl: review.authorProfileUrl,
  title: review.title,
  content: review.content,
  imageUrl: review.imageUrl,
  owner: viewerId !== undefined && review.userId === viewerId,
  createdAt: review.createdAt,
  updatedAt: review.updatedAt,
});

const readReviewForm = async (request: Request) => {
  const formData = await request.formData();
  const part = formData.get('request');
  const json =
    part instanceof Blob
      ? (JSON.parse(await part.text()) as {
          title?: string;
          content?: string;
        })
      : {};
  const file = Array.from(formData.values()).find(
    (value): value is File =>
      value instanceof File && value.type.startsWith('image/')
  );

  return {
    title: String(json.title ?? formData.get('title') ?? ''),
    content: String(json.content ?? formData.get('content') ?? ''),
    imageUrl: file ? await readAsDataUrl(file) : null,
  };
};

const forbidden = () =>
  HttpResponse.json({ message: '권한이 없습니다.' }, { status: 403 });

export const mapHandlers = [
  http.get('*/api/v1/shops/map', () =>
    HttpResponse.json({
      data: {
        shops: MOCK_SHOPS.map((shop) => ({
          shopId: shop.shopId,
          shopName: shop.shopName,
          businessName: shop.businessName,
          businessAddress: shop.businessAddress,
          latitude: shop.latitude,
          longitude: shop.longitude,
        })),
      },
    })
  ),

  http.get('*/api/v1/shops/:shopId/artists', ({ params }) => {
    const artistIds = SHOP_ARTIST_IDS[Number(params.shopId)] ?? [];
    const items = MOCK_ARTISTS.filter((artist) =>
      artistIds.includes(artist.artistId)
    );

    return HttpResponse.json({ data: { items } });
  }),

  http.get('*/api/v1/shops/:shopId/stories', ({ params, request }) => {
    const page = Number(new URL(request.url).searchParams.get('page') ?? 1);
    const stories = MOCK_STORIES.filter(
      (story) => story.shopId === Number(params.shopId)
    );
    const result = paginate(stories, page, STORIES_PER_PAGE);

    return HttpResponse.json({
      data: {
        ...result,
        items: result.items.map((story) => ({
          storyId: story.storyId,
          thumbnailImageUrl: story.thumbnailImageUrl,
          title: story.title,
          content: story.content,
          createdAt: story.createdAt,
        })),
      },
    });
  }),

  http.get('*/api/v1/shops/:shopId/classes', ({ params }) => {
    const classes = MOCK_CLASSES.filter(
      (item) => item.shopId === Number(params.shopId)
    );
    const result = paginate(classes, 1, 50);

    return HttpResponse.json({
      data: {
        ...result,
        items: result.items.map((item) => ({
          classId: item.classId,
          className: item.className,
          classDescription: item.classDescription,
          firstImageUrl: item.firstImageUrl,
          maxCapacity: item.maxCapacity,
          notes: item.notes,
        })),
      },
    });
  }),

  http.get('*/api/v1/shops/:shopId/reviews', ({ params, request }) => {
    const viewer = getMockUser();
    const url = new URL(request.url);
    const cursorParam = url.searchParams.get('cursorId');
    const cursorId = cursorParam === null ? null : Number(cursorParam);
    const size = Number(url.searchParams.get('size') ?? 10);

    const filtered = MOCK_REVIEWS.filter(
      (review) =>
        review.shopId === Number(params.shopId) &&
        (cursorId === null || review.reviewId < cursorId)
    ).sort((a, b) => b.reviewId - a.reviewId);

    const page = filtered.slice(0, size);
    const hasNext = filtered.length > size;

    return HttpResponse.json({
      data: {
        items: page.map((review) => toReviewItem(review, viewer?.userId)),
        nextCursorId: hasNext ? page[page.length - 1].reviewId : null,
        hasNext,
      },
    });
  }),

  http.post('*/api/v1/shops/:shopId/reviews', async ({ params, request }) => {
    const user = getMockUser();

    if (!user) {
      return unauthorized();
    }

    const { title, content, imageUrl } = await readReviewForm(request);
    const now = new Date().toISOString().slice(0, 19);

    const review: MockReview = {
      reviewId: nextReviewId++,
      shopId: Number(params.shopId),
      userId: user.userId,
      authorName: user.name,
      authorProfileUrl: user.profileUrl || null,
      title,
      content,
      imageUrl,
      createdAt: now,
      updatedAt: now,
    };

    MOCK_REVIEWS.push(review);

    return HttpResponse.json(
      { data: toReviewItem(review, user.userId) },
      { status: 201 }
    );
  }),

  http.put(
    '*/api/v1/shops/:shopId/reviews/:reviewId',
    async ({ params, request }) => {
      const user = getMockUser();

      if (!user) {
        return unauthorized();
      }

      const review = MOCK_REVIEWS.find(
        (item) => item.reviewId === Number(params.reviewId)
      );

      if (!review) {
        return notFound('리뷰를 찾을 수 없습니다.');
      }

      if (review.userId !== user.userId) {
        return forbidden();
      }

      const { title, content, imageUrl } = await readReviewForm(request);

      review.title = title || review.title;
      review.content = content || review.content;
      review.imageUrl = imageUrl ?? review.imageUrl;
      review.updatedAt = new Date().toISOString().slice(0, 19);

      return HttpResponse.json({ data: toReviewItem(review, user.userId) });
    }
  ),

  http.delete('*/api/v1/shops/:shopId/reviews/:reviewId', ({ params }) => {
    const user = getMockUser();

    if (!user) {
      return unauthorized();
    }

    const index = MOCK_REVIEWS.findIndex(
      (item) => item.reviewId === Number(params.reviewId)
    );

    if (index === -1) {
      return notFound('리뷰를 찾을 수 없습니다.');
    }

    if (MOCK_REVIEWS[index].userId !== user.userId) {
      return forbidden();
    }

    MOCK_REVIEWS.splice(index, 1);

    return HttpResponse.json({ data: null });
  }),

  http.get('*/api/v1/shops/:shopId', ({ params }) => {
    const shop = MOCK_SHOPS.find(
      (item) => item.shopId === Number(params.shopId)
    );

    if (!shop) {
      return notFound('소품샵을 찾을 수 없습니다.');
    }

    const detail: ShopDetail = {
      userId: shop.userId,
      shopName: shop.shopName,
      phoneNumber: shop.phoneNumber,
      businessAddress: shop.businessAddress,
      businessHours: BUSINESS_HOURS,
      isFavorite: getMockUser() ? isFavoriteShop(shop.shopId) : false,
    };

    return HttpResponse.json({ data: detail });
  }),

  http.get(
    '*/api/v1/classes/:classId/available-slots',
    ({ params, request }) => {
      const classItem = MOCK_CLASSES.find(
        (item) => item.classId === Number(params.classId)
      );

      if (!classItem) {
        return notFound('클래스를 찾을 수 없습니다.');
      }

      const date = new URL(request.url).searchParams.get('date') ?? '';

      if (!DATE_PATTERN.test(date)) {
        return HttpResponse.json(
          { message: '날짜 형식이 올바르지 않습니다.' },
          { status: 400 }
        );
      }

      const { openTime, closeTime } =
        BUSINESS_HOURS[DAY_KEYS[new Date(`${date}T00:00:00`).getDay()]];
      const isPast = date < getToday();

      const slots: AvailableSlot[] =
        openTime && closeTime
          ? SLOT_TIMES.filter(
              (time) => time >= openTime && time < closeTime
            ).map((time) => {
              const sessionId = getSessionId(classItem.classId, date, time);
              const remainingCapacity =
                classItem.maxCapacity === null
                  ? null
                  : Math.max(
                      classItem.maxCapacity -
                        (reservedGuests.get(sessionId) ?? 0),
                      0
                    );

              return {
                sessionId,
                time,
                remainingCapacity,
                available:
                  !isPast &&
                  (remainingCapacity === null || remainingCapacity > 0),
              };
            })
          : [];

      return HttpResponse.json({
        data: { date, openTime, closeTime, slots },
      });
    }
  ),

  http.post('*/api/v1/class-reservations', async ({ request }) => {
    const user = getMockUser();

    if (!user) {
      return unauthorized();
    }

    const body = (await request.json()) as CreateReservationRequest;
    const session = sessions.get(body.sessionId);
    const classItem = MOCK_CLASSES.find(
      (item) => item.classId === session?.classId
    );
    const shop = MOCK_SHOPS.find((item) => item.shopId === classItem?.shopId);

    if (!session || !classItem || !shop) {
      return notFound('예약 가능한 회차를 찾을 수 없습니다.');
    }

    const reserved = reservedGuests.get(body.sessionId) ?? 0;

    if (
      classItem.maxCapacity !== null &&
      reserved + body.guestCount > classItem.maxCapacity
    ) {
      return HttpResponse.json(
        { message: '잔여 인원이 부족합니다.' },
        { status: 409 }
      );
    }

    reservedGuests.set(body.sessionId, reserved + body.guestCount);

    const reservationNumber = nextReservationNumber++;

    MOCK_RESERVATIONS.currentReservations.push({
      reservationNumber,
      status: 'PENDING',
      reservationStore: shop.shopName,
      reservationTime: new Date(
        `${session.date}T${session.time}:00`
      ).toISOString(),
      className: classItem.className,
    });
    MOCK_RESERVATIONS.currentReservations.sort((a, b) =>
      a.reservationTime.localeCompare(b.reservationTime)
    );

    return HttpResponse.json(
      {
        data: {
          reservationId: reservationNumber,
          reservationStatus: 'PENDING',
        },
      },
      { status: 201 }
    );
  }),
];
