import { http, HttpResponse } from 'msw';

import { getMockUser } from '../data/mock-users';

export const authHandlers = [
  http.post('*/auth/token/refresh', () =>
    HttpResponse.json({ data: { accessToken: 'mock-access-token' } })
  ),

  http.get('*/users/me', () => HttpResponse.json({ data: getMockUser() })),

  http.post('*/auth/logout', () => HttpResponse.json({ data: null })),
];
