import { http, HttpResponse } from 'msw';

import { DEMO_ROLE_STORAGE_KEY } from '../../features/auth/constants/demo-constants';

import { getMockUser } from '../data/mock-users';

const unauthorized = () =>
  HttpResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 });

export const authHandlers = [
  http.post('*/auth/token/refresh', () => {
    if (!getMockUser()) {
      return unauthorized();
    }

    return HttpResponse.json({ data: { accessToken: 'mock-access-token' } });
  }),

  http.get('*/users/me', () => {
    const user = getMockUser();

    if (!user) {
      return unauthorized();
    }

    return HttpResponse.json({ data: user });
  }),

  http.post('*/auth/logout', () => {
    localStorage.removeItem(DEMO_ROLE_STORAGE_KEY);

    return HttpResponse.json({ data: null });
  }),
];
