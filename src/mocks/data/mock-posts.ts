import type { PostDetail } from '../../features/post/types/post-type';

import { createPlaceholderImage } from '../utils/placeholder-image';

const AUTHORS = [
  { userId: 1, userName: '데모 소품샵' },
  { userId: 2, userName: '데모 작가' },
  { userId: 3, userName: '봄날 공방' },
  { userId: 4, userName: '모이 소품샵' },
  { userId: 5, userName: '달빛 작가' },
  { userId: 10, userName: '데모 회원' },
];

const CONTENTS = [
  '새로 입고된 도자기 컵을 소개합니다. 손으로 빚은 질감이 매력적이에요.',
  '이번 주말 원데이 클래스 자리가 아직 남아 있습니다. 함께 만들어 봐요.',
  '가을 분위기에 어울리는 캔들과 소품을 준비했어요.',
  '작업실 한쪽에서 찍은 오늘의 작업 모습입니다.',
  '손뜨개 코스터 세트가 새로 나왔습니다. 선물용으로도 좋아요.',
  '핸드메이드 마켓에서 만나요. 부스 위치는 곧 공유드릴게요.',
  '작은 엽서 시리즈를 제작했습니다. 일상의 장면을 담았어요.',
  '수업에서 완성된 수강생분들의 작품입니다. 모두 정말 멋져요.',
  '새 작업을 시작했어요. 완성되면 가장 먼저 보여드릴게요.',
  '오늘도 방문해 주셔서 감사합니다. 따뜻한 하루 보내세요.',
];

const POST_COUNT = 30;

export const MOCK_POSTS: PostDetail[] = Array.from(
  { length: POST_COUNT },
  (_, index) => {
    const author = AUTHORS[index % AUTHORS.length];
    const imageCount = (index % 3) + 1;

    return {
      postId: POST_COUNT - index,
      userId: author.userId,
      userName: author.userName,
      profileUrl: null,
      content: CONTENTS[index % CONTENTS.length],
      imageUrls: Array.from({ length: imageCount }, (_, imageIndex) =>
        createPlaceholderImage(index * 3 + imageIndex, author.userName)
      ),
      isPublic: true,
      createdAt: new Date(Date.UTC(2026, 9, 31 - index, 10, 0, 0))
        .toISOString()
        .slice(0, 19),
    };
  }
);
