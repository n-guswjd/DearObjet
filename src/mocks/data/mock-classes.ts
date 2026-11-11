import type { ClassListItem } from '../../features/map/types/one-day-class-types';

import { createPlaceholderImage } from '../utils/placeholder-image';

export interface MockClass extends ClassListItem {
  shopId: number;
}

type ClassSeed = Omit<MockClass, 'classId' | 'firstImageUrl'>;

const CLASS_SEEDS: ClassSeed[] = [
  {
    shopId: 1,
    className: '도자기 컵 만들기 원데이 클래스',
    classDescription:
      '물레 없이 손으로 빚어 나만의 컵을 만들어 봅니다. 완성작은 구워서 2주 뒤에 받아 가실 수 있어요.',
    maxCapacity: 6,
    notes: '앞치마는 매장에서 준비해 드려요.',
  },
  {
    shopId: 1,
    className: '핸드메이드 엽서 일러스트 클래스',
    classDescription:
      '수채 물감으로 엽서 3장을 그려 보는 시간입니다. 초보자도 편하게 참여할 수 있어요.',
    maxCapacity: 8,
    notes: '재료비가 포함되어 있습니다.',
  },
  {
    shopId: 2,
    className: '소이 캔들 만들기 클래스',
    classDescription:
      '좋아하는 향을 골라 나만의 소이 캔들을 만들어 봅니다. 만든 캔들은 포장해 드려요.',
    maxCapacity: 6,
    notes: '모든 재료는 준비되어 있어요.',
  },
  {
    shopId: 3,
    className: '손뜨개 코스터 클래스',
    classDescription:
      '코바늘로 코스터를 뜨는 방법을 처음부터 알려 드립니다. 실 색상은 직접 고르세요.',
    maxCapacity: 5,
    notes: '실과 바늘은 제공됩니다.',
  },
  {
    shopId: 4,
    className: '문구 일러스트 스티커 클래스',
    classDescription:
      '직접 그린 그림으로 스티커를 만들어 다이어리를 꾸며 봅니다.',
    maxCapacity: 8,
    notes: null,
  },
  {
    shopId: 5,
    className: '드라이플라워 리스 만들기',
    classDescription:
      '계절 꽃을 말려 작은 리스를 만들어 봅니다. 집 현관에 걸어 두기 좋아요.',
    maxCapacity: 6,
    notes: '꽃 종류는 시기에 따라 달라질 수 있어요.',
  },
  {
    shopId: 6,
    className: '제주 감귤 비누 만들기',
    classDescription:
      '제주 감귤 향을 담은 천연 비누를 만들어 봅니다. 선물용으로도 인기가 많아요.',
    maxCapacity: 10,
    notes: '아이와 함께 참여할 수 있어요.',
  },
  {
    shopId: 7,
    className: '자수 파우치 만들기',
    classDescription:
      '기본 자수 스티치를 배워 작은 파우치에 나만의 무늬를 수놓습니다.',
    maxCapacity: 6,
    notes: null,
  },
  {
    shopId: 8,
    className: '나무 도마 만들기',
    classDescription:
      '원목을 직접 다듬고 오일을 발라 나만의 도마를 만들어 봅니다.',
    maxCapacity: 4,
    notes: '작업 중 먼지가 날 수 있어 편한 옷차림을 권해요.',
  },
];

export const MOCK_CLASSES: MockClass[] = CLASS_SEEDS.map((seed, index) => ({
  ...seed,
  classId: index + 1,
  firstImageUrl: createPlaceholderImage(index + 20, seed.className),
}));
