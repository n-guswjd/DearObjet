import type { MapStoryItem } from '../../features/map/types/map-story-types';

import { createPlaceholderImage } from '../utils/placeholder-image';

import { MOCK_SHOPS } from './mock-shops';

export type MockStory = MapStoryItem & { shopId: number };

const STORY_TEMPLATES = [
  {
    title: '가을 신상 소품이 입고되었어요',
    content:
      '따뜻한 색감의 컵과 접시가 새로 들어왔어요. 직접 보시고 마음에 드는 걸 골라 가세요.',
  },
  {
    title: '이번 주 클래스 일정 안내',
    content:
      '이번 주말 원데이 클래스 자리가 조금 남아 있어요. 예약 탭에서 날짜를 확인해 주세요.',
  },
  {
    title: '작가님과 함께한 팝업 후기',
    content:
      '지난 주 팝업에 방문해 주신 모든 분들께 감사드려요. 사진을 몇 장 공유합니다.',
  },
  {
    title: '매장 휴무 안내',
    content: '다음 주 월요일은 재정비로 쉬어요. 화요일부터 정상 운영합니다.',
  },
  {
    title: '포장 서비스를 시작했어요',
    content: '선물용 소품은 포장을 해 드립니다. 계산할 때 말씀해 주세요.',
  },
  {
    title: '매장 분위기를 바꿨어요',
    content:
      '조명과 진열대를 새로 바꿨어요. 더 편하게 둘러볼 수 있게 되었답니다.',
  },
];

export const MOCK_STORIES: MockStory[] = MOCK_SHOPS.flatMap((shop) =>
  STORY_TEMPLATES.map((template, index) => ({
    storyId: shop.shopId * 100 + index + 1,
    shopId: shop.shopId,
    thumbnailImageUrl: createPlaceholderImage(
      shop.shopId + index,
      shop.shopName
    ),
    title: template.title,
    content: template.content,
    createdAt: new Date(Date.UTC(2026, 9, 29 - index * 4, 9, 0, 0))
      .toISOString()
      .slice(0, 19),
  }))
);
