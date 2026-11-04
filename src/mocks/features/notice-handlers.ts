import { http, HttpResponse } from 'msw';

import { MOCK_NOTICES } from '../data/mock-notices';
import { paginate } from '../utils/paginate';

export const noticeHandlers = [
  http.get('*/api/v1/notices/:noticeId', ({ params }) => {
    const notice = MOCK_NOTICES.find(
      (item) => item.noticeId === Number(params.noticeId)
    );

    if (!notice) {
      return HttpResponse.json(
        { message: '공지사항을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return HttpResponse.json({ data: notice });
  }),

  http.get('*/api/v1/notices', ({ request }) => {
    const url = new URL(request.url);
    const target = url.searchParams.get('target');
    const category = url.searchParams.get('category');
    const page = Number(url.searchParams.get('page') ?? 1);
    const size = Number(url.searchParams.get('size') ?? 10);

    const filtered = MOCK_NOTICES.filter(
      (notice) =>
        (!target || notice.target === target) &&
        (!category || notice.category === category)
    );

    return HttpResponse.json({ data: paginate(filtered, page, size) });
  }),
];
