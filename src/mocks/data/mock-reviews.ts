import type { ShopReviewItem } from '../../features/map/types/review-types';

import { createPlaceholderImage } from '../utils/placeholder-image';

import { MOCK_SHOPS } from './mock-shops';

export type MockReview = Omit<ShopReviewItem, 'owner'> & { shopId: number };

const REVIEW_AUTHORS = [
  { userId: 10, authorName: '데모 회원' },
  { userId: 11, authorName: '하늘' },
  { userId: 12, authorName: '민트' },
  { userId: 13, authorName: '소소' },
];

const REVIEW_TEMPLATES = [
  {
    title: '분위기가 정말 좋아요',
    content: '매장이 아담하고 따뜻해서 오래 구경했어요. 소품이 다 예뻐요.',
  },
  {
    title: '클래스 재밌었어요',
    content:
      '설명을 천천히 해 주셔서 처음인데도 잘 따라갔어요. 결과물도 마음에 들어요.',
  },
  {
    title: '선물 고르기 좋은 곳',
    content: '친구 선물을 여기서 샀는데 포장까지 예쁘게 해 주셨어요.',
  },
  {
    title: '다음에 또 방문할게요',
    content: '작가님들 작품이 다양해서 구경하는 재미가 있었어요.',
  },
  {
    title: '사장님이 친절하세요',
    content: '궁금한 점을 하나하나 알려 주셔서 편하게 둘러봤어요.',
  },
];

export const MOCK_REVIEWS: MockReview[] = MOCK_SHOPS.flatMap((shop) =>
  REVIEW_TEMPLATES.map((template, index) => {
    const author =
      REVIEW_AUTHORS[(shop.shopId + index) % REVIEW_AUTHORS.length];
    const createdAt = new Date(Date.UTC(2026, 9, 30 - index * 3, 14, 0, 0))
      .toISOString()
      .slice(0, 19);

    return {
      reviewId: shop.shopId * 100 + index + 1,
      shopId: shop.shopId,
      userId: author.userId,
      authorName: author.authorName,
      authorProfileUrl: null,
      title: template.title,
      content: template.content,
      imageUrl:
        index % 2 === 0
          ? createPlaceholderImage(shop.shopId + index, shop.shopName)
          : null,
      createdAt,
      updatedAt: createdAt,
    };
  })
);
