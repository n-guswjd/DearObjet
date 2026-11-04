import { http, HttpResponse } from 'msw';

import type {
  PostDetail,
  PostListItem,
} from '../../features/post/types/post-type';

import { MOCK_POSTS } from '../data/mock-posts';
import { getMockUser } from '../data/mock-users';
import { paginate } from '../utils/paginate';
import { createPlaceholderImage } from '../utils/placeholder-image';

const POSTS_PER_PAGE = 12;

let nextPostId = Math.max(...MOCK_POSTS.map((post) => post.postId)) + 1;

const toListItem = (post: PostDetail): PostListItem => ({
  postId: post.postId,
  thumbnailUrl: post.imageUrls[0] ?? null,
  authorName: post.userName,
  authorProfileUrl: post.profileUrl,
  createdAt: post.createdAt,
});

const readAsDataUrl = (file: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

const readPostForm = async (request: Request) => {
  const formData = await request.formData();
  const content = String(formData.get('content') ?? '');
  const files = Array.from(formData.values()).filter(
    (value): value is File =>
      value instanceof File && value.type.startsWith('image/')
  );
  const imageUrls = await Promise.all(files.map(readAsDataUrl));

  return { content, imageUrls };
};

export const postHandlers = [
  http.get('*/api/v1/posts/all', ({ request }) => {
    const page = Number(new URL(request.url).searchParams.get('page') ?? 1);
    const visible = MOCK_POSTS.filter((post) => post.isPublic);
    const result = paginate(visible, page, POSTS_PER_PAGE);

    return HttpResponse.json({
      data: { ...result, items: result.items.map(toListItem) },
    });
  }),

  http.get('*/api/v1/posts/:postId', ({ params }) => {
    const post = MOCK_POSTS.find(
      (item) => item.postId === Number(params.postId)
    );

    if (!post) {
      return HttpResponse.json(
        { message: '게시글을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return HttpResponse.json({ data: post });
  }),

  http.get('*/api/v1/posts', ({ request }) => {
    const url = new URL(request.url);
    const userId = Number(url.searchParams.get('userId'));
    const page = Number(url.searchParams.get('page') ?? 1);
    const viewer = getMockUser();

    const userPosts = MOCK_POSTS.filter(
      (post) =>
        post.userId === userId &&
        (post.isPublic || post.userId === viewer.userId)
    );
    const result = paginate(userPosts, page, POSTS_PER_PAGE);

    return HttpResponse.json({
      data: { ...result, items: result.items.map(toListItem) },
    });
  }),

  http.post('*/api/v1/posts', async ({ request }) => {
    const { content, imageUrls } = await readPostForm(request);
    const user = getMockUser();

    const post: PostDetail = {
      postId: nextPostId++,
      userId: user.userId,
      userName: user.name,
      profileUrl: user.profileUrl || null,
      content,
      imageUrls:
        imageUrls.length > 0
          ? imageUrls
          : [createPlaceholderImage(nextPostId, user.name)],
      isPublic: true,
      createdAt: new Date().toISOString().slice(0, 19),
    };

    MOCK_POSTS.unshift(post);

    return HttpResponse.json({ data: post }, { status: 201 });
  }),

  http.put('*/api/v1/posts/:postId', async ({ params, request }) => {
    const post = MOCK_POSTS.find(
      (item) => item.postId === Number(params.postId)
    );

    if (!post) {
      return HttpResponse.json(
        { message: '게시글을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const { content, imageUrls } = await readPostForm(request);

    post.content = content || post.content;
    post.imageUrls = imageUrls.length > 0 ? imageUrls : post.imageUrls;

    return HttpResponse.json({ data: post });
  }),

  http.delete('*/api/v1/posts/:postId', ({ params }) => {
    const index = MOCK_POSTS.findIndex(
      (item) => item.postId === Number(params.postId)
    );

    if (index !== -1) {
      MOCK_POSTS.splice(index, 1);
    }

    return HttpResponse.json({ data: null });
  }),
];
