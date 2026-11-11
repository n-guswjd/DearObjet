import type { RequestHandler } from 'msw';

import { authHandlers } from './features/auth-handlers';
import { chatHandlers } from './features/chat-handlers';
import { favoriteHandlers } from './features/favorite-handlers';
import { myPageHandlers } from './features/my-page-handlers';
import { noticeHandlers } from './features/notice-handlers';
import { postHandlers } from './features/post-handlers';

export const handlers: RequestHandler[] = [
  ...authHandlers,
  ...myPageHandlers,
  ...favoriteHandlers,
  ...chatHandlers,
  ...noticeHandlers,
  ...postHandlers,
];
