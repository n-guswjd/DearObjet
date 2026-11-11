import { MOCK_ARTISTS } from './mock-artists';
import { USER_ROLE } from '../../shared/constants';
import type { UserRole } from '../../shared/constants';
import type { MessageResponse } from '../../features/chat/types/chat-types';

import { createPlaceholderImage } from '../utils/placeholder-image';

export interface ChatPerson {
  userId: number;
  name: string;
  role: UserRole;
  specialty: string | null;
  statusLabel: string;
  profileImageUrl: string;
}

export interface MockRoom {
  id: number;
  roomId: string;
  participantIds: [number, number];
}

export type MockMessage = Omit<MessageResponse, 'isMyMessage'>;

const PEOPLE_SEEDS: Omit<ChatPerson, 'profileImageUrl'>[] = [
  {
    userId: 1,
    name: '데모 소품샵',
    role: USER_ROLE.SHOP,
    specialty: null,
    statusLabel: '입점 모집 중',
  },
  {
    userId: 2,
    name: '데모 작가',
    role: USER_ROLE.ARTIST,
    specialty: '도자기',
    statusLabel: '입점 가능',
  },
  {
    userId: 3,
    name: '봄날 공방',
    role: USER_ROLE.SHOP,
    specialty: null,
    statusLabel: '입점 모집 중',
  },
  {
    userId: 4,
    name: '모이 소품샵',
    role: USER_ROLE.SHOP,
    specialty: null,
    statusLabel: '입점 모집 중',
  },
  {
    userId: 5,
    name: '달빛 작가',
    role: USER_ROLE.ARTIST,
    specialty: '일러스트',
    statusLabel: '입점 가능',
  },
  {
    userId: 10,
    name: '데모 회원',
    role: USER_ROLE.CUSTOMER,
    specialty: null,
    statusLabel: '활동 중',
  },
];

const BASE_PEOPLE: ChatPerson[] = PEOPLE_SEEDS.map((seed) => ({
  ...seed,
  profileImageUrl: createPlaceholderImage(seed.userId, seed.name),
}));

const ARTIST_PEOPLE: ChatPerson[] = MOCK_ARTISTS.filter(
  (artist) => !BASE_PEOPLE.some((person) => person.userId === artist.userId)
).map((artist) => ({
  userId: artist.userId,
  name: artist.artistName,
  role: USER_ROLE.ARTIST,
  specialty: '공예',
  statusLabel: '입점 가능',
  profileImageUrl:
    artist.artistImageUrl ??
    createPlaceholderImage(artist.userId, artist.artistName),
}));

export const CHAT_PEOPLE: ChatPerson[] = [...BASE_PEOPLE, ...ARTIST_PEOPLE];

export const getPerson = (userId: number) =>
  CHAT_PEOPLE.find((person) => person.userId === userId) ?? CHAT_PEOPLE[0];

export const MOCK_ROOMS: MockRoom[] = [
  { id: 1, roomId: 'room-10-1', participantIds: [10, 1] },
  { id: 2, roomId: 'room-10-4', participantIds: [10, 4] },
  { id: 3, roomId: 'room-1-2', participantIds: [1, 2] },
  { id: 4, roomId: 'room-3-2', participantIds: [3, 2] },
  { id: 5, roomId: 'room-4-5', participantIds: [4, 5] },
];

export const MOCK_MESSAGES: Record<string, MockMessage[]> = {};

let nextMessageId = 1;

export const createMessage = (
  roomId: string,
  senderId: number,
  content: string,
  createdAt: Date = new Date()
): MockMessage => {
  const sender = getPerson(senderId);

  const message: MockMessage = {
    id: nextMessageId++,
    roomId,
    senderId,
    senderName: sender.name,
    senderProfileImage: sender.profileImageUrl,
    content,
    messageType: 'TEXT',
    createdAt: createdAt.toISOString(),
  };

  MOCK_MESSAGES[roomId] = [...(MOCK_MESSAGES[roomId] ?? []), message];

  return message;
};

interface SeedMessage {
  senderId: number;
  content: string;
  minutesAgo: number;
}

const SEED_CONVERSATIONS: Record<string, SeedMessage[]> = {
  'room-10-1': [
    {
      senderId: 10,
      content:
        '안녕하세요! 도자기 컵 만들기 클래스를 예약하려고 하는데 주말에도 진행하나요?',
      minutesAgo: 180,
    },
    {
      senderId: 1,
      content:
        '안녕하세요, 데모 소품샵입니다. 네, 토요일과 일요일 오후 2시에 진행해요.',
      minutesAgo: 170,
    },
    {
      senderId: 10,
      content: '그럼 이번 토요일 2시에 2명 예약 가능할까요?',
      minutesAgo: 160,
    },
    {
      senderId: 1,
      content: '네 가능합니다! 예약 페이지에서 신청해 주시면 확정해 드릴게요.',
      minutesAgo: 150,
    },
  ],
  'room-10-4': [
    {
      senderId: 10,
      content: '소이 캔들 클래스는 준비물이 따로 있을까요?',
      minutesAgo: 1500,
    },
    {
      senderId: 4,
      content: '모든 재료는 저희가 준비해 둬서 몸만 오시면 돼요.',
      minutesAgo: 1490,
    },
    {
      senderId: 10,
      content: '친절하게 알려 주셔서 감사합니다!',
      minutesAgo: 1480,
    },
  ],
  'room-1-2': [
    {
      senderId: 1,
      content:
        '안녕하세요, 작가님 도자기 작품을 인상 깊게 봤어요. 저희 매장에 입점해 주실 수 있을까요?',
      minutesAgo: 3000,
    },
    {
      senderId: 2,
      content: '관심 가져 주셔서 감사합니다. 입점 조건을 알려 주실 수 있나요?',
      minutesAgo: 2900,
    },
    {
      senderId: 1,
      content:
        '월 단위로 진열 공간을 제공하고, 판매 수수료는 계약서에 안내해 둘게요.',
      minutesAgo: 2800,
    },
    {
      senderId: 2,
      content: '계약서 확인하고 이번 주 안에 답변드릴게요.',
      minutesAgo: 2700,
    },
  ],
  'room-3-2': [
    {
      senderId: 2,
      content: '봄날 공방 입점 제안 확인했습니다. 일정 조율이 가능할까요?',
      minutesAgo: 5000,
    },
    {
      senderId: 3,
      content: '네, 다음 주 월요일 오전에 방문해 주시면 공간을 보여드릴게요.',
      minutesAgo: 4900,
    },
  ],
  'room-4-5': [
    {
      senderId: 4,
      content: '엽서 시리즈 입고 문의드립니다. 수량은 어느 정도 가능하세요?',
      minutesAgo: 8000,
    },
    {
      senderId: 5,
      content: '한 번에 50장까지 준비할 수 있어요.',
      minutesAgo: 7900,
    },
    {
      senderId: 4,
      content: '좋아요, 우선 30장으로 시작해 볼게요.',
      minutesAgo: 7800,
    },
  ],
};

Object.entries(SEED_CONVERSATIONS).forEach(([roomId, items]) => {
  MOCK_MESSAGES[roomId] = [];

  items.forEach((item) => {
    createMessage(
      roomId,
      item.senderId,
      item.content,
      new Date(Date.now() - item.minutesAgo * 60000)
    );
  });
});
