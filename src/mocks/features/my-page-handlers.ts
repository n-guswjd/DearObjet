import { http, HttpResponse } from 'msw';

import { DEMO_ROLE_STORAGE_KEY } from '../../features/auth/constants/demo-constants';
import type { AuthUser } from '../../features/auth/types/auth-types';

import { MOCK_RESERVATIONS } from '../data/mock-reservations';
import { getMockUser } from '../data/mock-users';
import { readAsDataUrl } from '../utils/read-as-data-url';
import { notFound, unauthorized } from '../utils/responses';

interface ProfileState {
  profileUrl: string;
  smsAgreement: boolean;
  marketingAgreement: boolean;
}

interface UpdateProfileBody {
  name?: string;
  phoneNumber?: string;
  smsAgreement?: boolean;
  marketingAgreement?: boolean;
}

const profileStates = new Map<number, ProfileState>();

export const getProfileState = (userId: number) => {
  const existing = profileStates.get(userId);

  if (existing) {
    return existing;
  }

  const created: ProfileState = {
    profileUrl: '',
    smsAgreement: true,
    marketingAgreement: false,
  };
  profileStates.set(userId, created);

  return created;
};

const buildProfile = (user: AuthUser) => {
  const state = getProfileState(user.userId);

  return {
    name: user.name.replace(/\s/g, ''),
    phoneNumber: user.phoneNumber ?? '',
    email: user.email,
    profileUrl: state.profileUrl,
    smsAgreement: state.smsAgreement,
    marketingAgreement: state.marketingAgreement,
  };
};

const readJsonPart = async (formData: FormData, key: string) => {
  const part = formData.get(key);

  if (!(part instanceof Blob)) {
    return {};
  }

  return JSON.parse(await part.text()) as UpdateProfileBody;
};

export const myPageHandlers = [
  http.get('*/users/me/profile', () => {
    const user = getMockUser();

    if (!user) {
      return unauthorized();
    }

    return HttpResponse.json({ data: buildProfile(user) });
  }),

  http.patch('*/users/me/profile', async ({ request }) => {
    const user = getMockUser();

    if (!user) {
      return unauthorized();
    }

    const formData = await request.formData();
    const body = await readJsonPart(formData, 'request');
    const image = formData.get('profileImage');
    const state = getProfileState(user.userId);

    if (body.name && body.name !== user.name.replace(/\s/g, '')) {
      user.name = body.name;
    }

    if (body.phoneNumber) {
      user.phoneNumber = body.phoneNumber;
    }

    if (typeof body.smsAgreement === 'boolean') {
      state.smsAgreement = body.smsAgreement;
    }

    if (typeof body.marketingAgreement === 'boolean') {
      state.marketingAgreement = body.marketingAgreement;
    }

    if (image instanceof File) {
      state.profileUrl = await readAsDataUrl(image);
      user.profileUrl = state.profileUrl;
    }

    return HttpResponse.json({ data: buildProfile(user) });
  }),

  http.post('*/auth/phone-verifications/send', () =>
    HttpResponse.json({ data: { message: '인증번호가 발송되었습니다.' } })
  ),

  http.post('*/auth/phone-verifications/verify', () =>
    HttpResponse.json({ data: { verified: true } })
  ),

  http.get('*/api/v1/class-reservations/me', () => {
    if (!getMockUser()) {
      return unauthorized();
    }

    return HttpResponse.json({ data: MOCK_RESERVATIONS });
  }),

  http.post(
    '*/api/v1/class-reservations/:reservationId/cancel',
    ({ params }) => {
      const index = MOCK_RESERVATIONS.currentReservations.findIndex(
        (item) => item.reservationNumber === Number(params.reservationId)
      );

      if (index === -1) {
        return notFound('예약을 찾을 수 없습니다.');
      }

      MOCK_RESERVATIONS.currentReservations.splice(index, 1);

      return HttpResponse.json({ data: null });
    }
  ),

  http.post('*/users/me/withdrawal', () => {
    localStorage.removeItem(DEMO_ROLE_STORAGE_KEY);

    return HttpResponse.json({ data: null });
  }),
];
