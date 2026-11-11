import type { AuthUser } from '../../features/auth/types/auth-types';

import { createPlaceholderImage } from '../utils/placeholder-image';

import { MOCK_SHOPS } from './mock-shops';

export interface MockBusinessProfile {
  businessPhoneNumber: string;
  instagramId: string;
  businessName: string;
  businessNumber: string;
  ownerName: string;
  businessAddress: string;
  bankName: string;
  bankAccountNumber: string;
  accountHolder: string;
  bankbookImageUrl: string;
  isBankbookVerified: boolean;
  taxInvoiceEmail: string;
  hometaxApiKey: string;
}

const BANKBOOK_IMAGE = createPlaceholderImage(7, '통장사본');

const SEEDS: Record<number, MockBusinessProfile> = {
  1: {
    businessPhoneNumber: '0212345678',
    instagramId: 'demo_shop',
    businessName: '데모 소품샵',
    businessNumber: '123-45-67890',
    ownerName: '김데모',
    businessAddress: MOCK_SHOPS[0].businessAddress,
    bankName: 'kb',
    bankAccountNumber: '12345678901234',
    accountHolder: '김데모',
    bankbookImageUrl: BANKBOOK_IMAGE,
    isBankbookVerified: true,
    taxInvoiceEmail: 'tax@dearobjet.com',
    hometaxApiKey: '',
  },
  2: {
    businessPhoneNumber: '01087654321',
    instagramId: 'demo_artist',
    businessName: '데모 작가 공방',
    businessNumber: '234-56-78901',
    ownerName: '이작가',
    businessAddress: '서울 성동구 성수이로 88',
    bankName: 'kakao',
    bankAccountNumber: '3333012345678',
    accountHolder: '이작가',
    bankbookImageUrl: BANKBOOK_IMAGE,
    isBankbookVerified: true,
    taxInvoiceEmail: 'artist@dearobjet.com',
    hometaxApiKey: '',
  },
};

const states = new Map<number, MockBusinessProfile>();

export const getBusinessState = (user: AuthUser) => {
  const existing = states.get(user.userId);

  if (existing) {
    return existing;
  }

  const created = { ...(SEEDS[user.userId] ?? SEEDS[2]) };
  states.set(user.userId, created);

  return created;
};
