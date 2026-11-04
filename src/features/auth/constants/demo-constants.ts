import { USER_ROLE } from '../../../shared/constants';

export const DEMO_ROLE_STORAGE_KEY = 'mock-role';

export const DEMO_ROLE_OPTIONS = [
  {
    role: USER_ROLE.CUSTOMER,
    label: '일반회원',
    description: '클래스 예약과 포스트 구경',
  },
  {
    role: USER_ROLE.SHOP,
    label: '소품샵',
    description: '클래스 등록·예약 관리, 입점 제안',
  },
  {
    role: USER_ROLE.ARTIST,
    label: '작가',
    description: '입점 제안 확인, 계약 관리',
  },
] as const;
