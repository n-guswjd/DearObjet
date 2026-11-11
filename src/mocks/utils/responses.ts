import { HttpResponse } from 'msw';

export const unauthorized = () =>
  HttpResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 });

export const notFound = (message: string) =>
  HttpResponse.json({ message }, { status: 404 });
