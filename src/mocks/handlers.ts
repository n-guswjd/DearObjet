import type { RequestHandler } from 'msw';

import { authHandlers } from './features/auth-handlers';
import { noticeHandlers } from './features/notice-handlers';
import { postHandlers } from './features/post-handlers';

export const handlers: RequestHandler[] = [
  ...authHandlers,
  ...noticeHandlers,
  ...postHandlers,
];
