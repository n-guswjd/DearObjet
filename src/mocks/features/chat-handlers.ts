import { http, HttpResponse } from 'msw';

import type {
  ChatRoomResponse,
  MessageResponse,
  MessageSyncResponse,
  UserListItem,
} from '../../features/chat/types/chat-types';

import {
  CHAT_PEOPLE,
  MOCK_MESSAGES,
  MOCK_ROOMS,
  createMessage,
  getPerson,
} from '../data/mock-chat';
import type { MockMessage, MockRoom } from '../data/mock-chat';
import { getMockUser } from '../data/mock-users';
import { readAsDataUrl } from '../utils/read-as-data-url';
import { notFound, unauthorized } from '../utils/responses';

const REPLIES = [
  '네, 확인했습니다! 조금 더 자세히 안내드릴게요.',
  '좋아요. 일정 확인하고 다시 연락드릴게요.',
  '문의 감사합니다. 편하신 시간을 알려 주세요.',
  '말씀해 주셔서 감사해요. 곧 답변 드릴게요.',
];

const unreadCounts = new Map<string, number>();

const unreadKey = (roomId: string, userId: number) => `${roomId}:${userId}`;

MOCK_ROOMS.forEach((room) => {
  const messages = MOCK_MESSAGES[room.roomId] ?? [];
  const last = messages[messages.length - 1];

  room.participantIds.forEach((userId) => {
    unreadCounts.set(
      unreadKey(room.roomId, userId),
      last && last.senderId !== userId ? 1 : 0
    );
  });
});

const getPartnerId = (room: MockRoom, viewerId: number) =>
  room.participantIds.find((id) => id !== viewerId) ?? room.participantIds[0];

const findRoom = (roomId: string) =>
  MOCK_ROOMS.find((room) => room.roomId === roomId);

const buildRoom = (room: MockRoom, viewerId: number): ChatRoomResponse => {
  const partner = getPerson(getPartnerId(room, viewerId));
  const messages = MOCK_MESSAGES[room.roomId] ?? [];
  const last = messages[messages.length - 1];

  return {
    id: room.id,
    roomId: room.roomId,
    type: 'ONE_TO_ONE',
    lastMessage: last?.content ?? '',
    lastMessageAt: last?.createdAt ?? new Date().toISOString(),
    unreadCount: unreadCounts.get(unreadKey(room.roomId, viewerId)) ?? 0,
    participants: room.participantIds.map((userId) => {
      const person = getPerson(userId);

      return {
        userId,
        nickname: person.name,
        profileImageUrl: person.profileImageUrl,
        joinedAt: '2026-09-01T09:00:00.000Z',
        lastReadAt: null,
      };
    }),
    partnerName: partner.name,
    partnerProfileImage: partner.profileImageUrl,
  };
};

const toMessageResponse = (
  message: MockMessage,
  viewerId: number
): MessageResponse => ({
  ...message,
  isMyMessage: message.senderId === viewerId,
});

const toSyncResponse = (
  roomId: string,
  messages: MockMessage[],
  viewerId: number
): MessageSyncResponse => ({
  roomId,
  oldestMessageId: messages.length > 0 ? messages[0].id : null,
  latestMessageId:
    messages.length > 0 ? messages[messages.length - 1].id : null,
  messages: messages.map((message) => toMessageResponse(message, viewerId)),
});

export const chatHandlers = [
  http.get('*/api/chat/rooms', () => {
    const user = getMockUser();

    if (!user) {
      return unauthorized();
    }

    const rooms = MOCK_ROOMS.filter((room) =>
      room.participantIds.includes(user.userId)
    )
      .map((room) => buildRoom(room, user.userId))
      .sort((a, b) => b.lastMessageAt.localeCompare(a.lastMessageAt));

    return HttpResponse.json({ data: rooms });
  }),

  http.post('*/api/chat/rooms/direct/:partnerId', ({ params }) => {
    const user = getMockUser();

    if (!user) {
      return unauthorized();
    }

    const partnerId = Number(params.partnerId);

    if (!CHAT_PEOPLE.some((person) => person.userId === partnerId)) {
      return notFound('대화 상대를 찾을 수 없습니다.');
    }

    let room = MOCK_ROOMS.find(
      (item) =>
        item.participantIds.includes(user.userId) &&
        item.participantIds.includes(partnerId)
    );

    if (!room) {
      room = {
        id: MOCK_ROOMS.length + 1,
        roomId: `room-${user.userId}-${partnerId}`,
        participantIds: [user.userId, partnerId],
      };
      MOCK_ROOMS.push(room);
      MOCK_MESSAGES[room.roomId] = [];
      unreadCounts.set(unreadKey(room.roomId, user.userId), 0);
      unreadCounts.set(unreadKey(room.roomId, partnerId), 0);
    }

    return HttpResponse.json({ data: buildRoom(room, user.userId) });
  }),

  http.get('*/api/chat/rooms/:roomId', ({ params }) => {
    const user = getMockUser();

    if (!user) {
      return unauthorized();
    }

    const room = findRoom(String(params.roomId));

    if (!room) {
      return notFound('채팅방을 찾을 수 없습니다.');
    }

    return HttpResponse.json({ data: buildRoom(room, user.userId) });
  }),

  http.post('*/api/chat/rooms/:roomId/read', ({ params }) => {
    const user = getMockUser();

    if (!user) {
      return unauthorized();
    }

    unreadCounts.set(unreadKey(String(params.roomId), user.userId), 0);

    return HttpResponse.json({ data: null });
  }),

  http.get(
    '*/api/chat/rooms/:roomId/messages/latest',
    ({ params, request }) => {
      const user = getMockUser();

      if (!user) {
        return unauthorized();
      }

      const roomId = String(params.roomId);

      if (!findRoom(roomId)) {
        return notFound('채팅방을 찾을 수 없습니다.');
      }

      const limit = Number(
        new URL(request.url).searchParams.get('limit') ?? 50
      );
      const messages = (MOCK_MESSAGES[roomId] ?? []).slice(-limit);

      return HttpResponse.json({
        data: toSyncResponse(roomId, messages, user.userId),
      });
    }
  ),

  http.get(
    '*/api/chat/rooms/:roomId/messages/before',
    ({ params, request }) => {
      const user = getMockUser();

      if (!user) {
        return unauthorized();
      }

      const roomId = String(params.roomId);
      const url = new URL(request.url);
      const beforeId = Number(url.searchParams.get('beforeMessageId') ?? 0);
      const limit = Number(url.searchParams.get('limit') ?? 50);
      const messages = (MOCK_MESSAGES[roomId] ?? [])
        .filter((message) => message.id < beforeId)
        .slice(-limit);

      return HttpResponse.json({
        data: toSyncResponse(roomId, messages, user.userId),
      });
    }
  ),

  http.get('*/api/chat/rooms/:roomId/messages/sync', ({ params, request }) => {
    const user = getMockUser();

    if (!user) {
      return unauthorized();
    }

    const roomId = String(params.roomId);
    const url = new URL(request.url);
    const afterId = Number(url.searchParams.get('afterMessageId') ?? 0);
    const limit = Number(url.searchParams.get('limit') ?? 200);
    const messages = (MOCK_MESSAGES[roomId] ?? [])
      .filter((message) => message.id > afterId)
      .slice(0, limit);

    return HttpResponse.json({
      data: toSyncResponse(roomId, messages, user.userId),
    });
  }),

  http.post(
    '*/api/chat/rooms/:roomId/messages',
    async ({ params, request }) => {
      const user = getMockUser();

      if (!user) {
        return unauthorized();
      }

      const room = findRoom(String(params.roomId));

      if (!room) {
        return notFound('채팅방을 찾을 수 없습니다.');
      }

      const body = (await request.json()) as { content?: string };
      const content = String(body.content ?? '').trim();
      const message = createMessage(room.roomId, user.userId, content);
      const reply = createMessage(
        room.roomId,
        getPartnerId(room, user.userId),
        REPLIES[(MOCK_MESSAGES[room.roomId] ?? []).length % REPLIES.length],
        new Date(Date.now() + 1000)
      );

      return HttpResponse.json({
        data: {
          message: toMessageResponse(message, user.userId),
          reply: toMessageResponse(reply, user.userId),
        },
      });
    }
  ),

  http.get('*/api/chat/unread/total', () => {
    const user = getMockUser();

    if (!user) {
      return unauthorized();
    }

    const totalUnread = MOCK_ROOMS.filter((room) =>
      room.participantIds.includes(user.userId)
    ).reduce(
      (sum, room) =>
        sum + (unreadCounts.get(unreadKey(room.roomId, user.userId)) ?? 0),
      0
    );

    return HttpResponse.json({ data: { totalUnread } });
  }),

  http.post('*/api/chat/upload/image', async ({ request }) => {
    const formData = await request.formData();
    const file = Array.from(formData.values()).find(
      (value): value is File => value instanceof File
    );

    if (!file) {
      return HttpResponse.json(
        { message: '이미지가 없습니다.' },
        { status: 400 }
      );
    }

    return HttpResponse.json({ data: { url: await readAsDataUrl(file) } });
  }),

  http.get('*/api/chat/users/search', ({ request }) => {
    const user = getMockUser();

    if (!user) {
      return unauthorized();
    }

    const url = new URL(request.url);
    const keyword = (url.searchParams.get('keyword') ?? '').trim();
    const page = Number(url.searchParams.get('page') ?? 0);
    const size = Number(url.searchParams.get('size') ?? 20);

    const matched = CHAT_PEOPLE.filter(
      (person) => person.userId !== user.userId && person.name.includes(keyword)
    );
    const content: UserListItem[] = matched
      .slice(page * size, (page + 1) * size)
      .map((person) => ({
        userId: person.userId,
        accountName: person.name,
        role: person.role,
        profileImageUrl: person.profileImageUrl,
        specialty: person.specialty,
        statusLabel: person.statusLabel,
      }));
    const totalPages = Math.max(1, Math.ceil(matched.length / size));

    return HttpResponse.json({
      data: {
        content,
        totalElements: matched.length,
        totalPages,
        number: page,
        size,
        last: page + 1 >= totalPages,
      },
    });
  }),
];
