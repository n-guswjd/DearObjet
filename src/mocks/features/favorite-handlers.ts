import { http, HttpResponse } from 'msw';

import type { FavoriteShopItem } from '../../features/map/types/favorite-types';

import { MOCK_SHOPS } from '../data/mock-shops';
import { getMockUser } from '../data/mock-users';
import { paginate } from '../utils/paginate';
import { notFound, unauthorized } from '../utils/responses';

interface FavoriteRecord {
  favoriteId: number;
  shopId: number;
  favoritedAt: string;
}

const favorites: FavoriteRecord[] = MOCK_SHOPS.slice(0, 6).map(
  (shop, index) => ({
    favoriteId: index + 1,
    shopId: shop.shopId,
    favoritedAt: new Date(Date.UTC(2026, 9, 28 - index * 3, 12, 0, 0))
      .toISOString()
      .slice(0, 19),
  })
);

let nextFavoriteId = favorites.length + 1;

const toFavoriteItems = (records: FavoriteRecord[]): FavoriteShopItem[] =>
  records.flatMap((record) => {
    const shop = MOCK_SHOPS.find((item) => item.shopId === record.shopId);

    if (!shop) {
      return [];
    }

    return [
      {
        favoriteId: record.favoriteId,
        shopId: shop.shopId,
        shopName: shop.shopName,
        profileUrl: shop.profileUrl,
        businessAddress: shop.businessAddress,
        phoneNumber: shop.phoneNumber,
        instagramId: shop.instagramId,
        latitude: shop.latitude,
        longitude: shop.longitude,
        favoritedAt: record.favoritedAt,
      },
    ];
  });

export const isFavoriteShop = (shopId: number) =>
  favorites.some((record) => record.shopId === shopId);

export const favoriteHandlers = [
  http.get('*/api/v1/favorites/shops', ({ request }) => {
    if (!getMockUser()) {
      return unauthorized();
    }

    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const size = Number(url.searchParams.get('size') ?? 12);
    const result = paginate(favorites, page, size);

    return HttpResponse.json({
      data: { ...result, items: toFavoriteItems(result.items) },
    });
  }),

  http.post('*/api/v1/favorites/shops/:shopId', ({ params }) => {
    if (!getMockUser()) {
      return unauthorized();
    }

    const shopId = Number(params.shopId);

    if (!MOCK_SHOPS.some((shop) => shop.shopId === shopId)) {
      return notFound('소품샵을 찾을 수 없습니다.');
    }

    let record = favorites.find((item) => item.shopId === shopId);

    if (!record) {
      record = {
        favoriteId: nextFavoriteId++,
        shopId,
        favoritedAt: new Date().toISOString().slice(0, 19),
      };
      favorites.unshift(record);
    }

    return HttpResponse.json({ data: toFavoriteItems([record])[0] });
  }),

  http.delete('*/api/v1/favorites/shops/:shopId', ({ params }) => {
    if (!getMockUser()) {
      return unauthorized();
    }

    const index = favorites.findIndex(
      (item) => item.shopId === Number(params.shopId)
    );

    if (index !== -1) {
      favorites.splice(index, 1);
    }

    return HttpResponse.json({ data: null });
  }),
];
