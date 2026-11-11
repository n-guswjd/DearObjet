import type { RequestHandler } from 'msw';

import { artistPageHandlers } from './features/artist-page-handlers';
import { authHandlers } from './features/auth-handlers';
import { businessProfileHandlers } from './features/business-profile-handlers';
import { chatHandlers } from './features/chat-handlers';
import { favoriteHandlers } from './features/favorite-handlers';
import { mapHandlers } from './features/map-handlers';
import { myPageHandlers } from './features/my-page-handlers';
import { noticeHandlers } from './features/notice-handlers';
import { postHandlers } from './features/post-handlers';

export const handlers: RequestHandler[] = [
  ...authHandlers,
  ...myPageHandlers,
  ...businessProfileHandlers,
  ...favoriteHandlers,
  ...mapHandlers,
  ...artistPageHandlers,
  ...chatHandlers,
  ...noticeHandlers,
  ...postHandlers,
];
