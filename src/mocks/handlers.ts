import type { RequestHandler } from 'msw';

import { authHandlers } from './features/auth-handlers';

export const handlers: RequestHandler[] = [...authHandlers];
