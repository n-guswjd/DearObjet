import { CATEGORY_LABEL } from '../../features/notice/constants/notice-constants';
import type { NoticeApiItem } from '../../features/notice/types/notice-types';

type NoticeTemplate = Pick<NoticeApiItem, 'category' | 'title' | 'body'>;

const USER_TEMPLATES: NoticeTemplate[] = [
  {
    category: 'IMPORTANT',
    title: '디어오브제 서비스 오픈 안내',
    body: '작가와 소품샵을 연결하는 디어오브제가 문을 열었습니다. 다양한 작가의 작품과 클래스를 만나보세요.',
  },
  {
    category: 'EVENT',
    title: '가을맞이 클래스 예약 이벤트',
    body: '이번 달 클래스를 예약하시면 참여 작가의 미니 소품을 선물로 드립니다.',
  },
  {
    category: 'FESTIVAL',
    title: '제주 가을 공예 페스티벌 안내',
    body: '지역 공예 작가들이 참여하는 가을 페스티벌이 열립니다. 체험 부스와 마켓을 즐겨보세요.',
  },
  {
    category: 'CULTURE_PERFORMANCE',
    title: '소품샵 거리 버스킹 공연 일정',
    body: '매주 토요일 소품샵 거리에서 작은 버스킹 공연이 열립니다.',
  },
  {
    category: 'GENERAL',
    title: '개인정보 처리방침 개정 안내',
    body: '서비스 개선을 위해 개인정보 처리방침이 일부 개정되었습니다.',
  },
  {
    category: 'EVENT',
    title: '신규 회원 가입 혜택 안내',
    body: '신규 가입 회원께 클래스 할인 쿠폰을 드립니다.',
  },
  {
    category: 'IMPORTANT',
    title: '정기 점검으로 인한 서비스 일시 중단 안내',
    body: '더 나은 서비스를 위해 새벽 시간대에 정기 점검을 진행합니다.',
  },
  {
    category: 'FESTIVAL',
    title: '핸드메이드 마켓 참가 작가 모집',
    body: '이번 시즌 핸드메이드 마켓에 참여할 작가님을 모집합니다.',
  },
  {
    category: 'GENERAL',
    title: '예약 취소 및 환불 규정 안내',
    body: '클래스 예약 취소와 환불 기준이 안내되어 있습니다. 예약 전에 확인해 주세요.',
  },
  {
    category: 'CULTURE_PERFORMANCE',
    title: '작가와의 대화 토크 콘서트 안내',
    body: '작가들의 작업 이야기를 직접 들어볼 수 있는 토크 콘서트가 열립니다.',
  },
  {
    category: 'EVENT',
    title: '인스타그램 후기 이벤트',
    body: '클래스 후기를 인스타그램에 남기고 추첨을 통해 선물을 받아보세요.',
  },
  {
    category: 'GENERAL',
    title: '모바일 화면 개선 업데이트',
    body: '모바일에서 더 편하게 둘러볼 수 있도록 화면을 개선했습니다.',
  },
  {
    category: 'FESTIVAL',
    title: '겨울 공예 마켓 사전 안내',
    body: '겨울 시즌 공예 마켓의 일정과 참여 방법을 미리 알려드립니다.',
  },
  {
    category: 'GENERAL',
    title: '고객센터 운영 시간 안내',
    body: '평일 오전 10시부터 오후 6시까지 문의를 받고 있습니다.',
  },
];

const PARTNER_TEMPLATES: NoticeTemplate[] = [
  {
    category: 'IMPORTANT',
    title: '입점 계약서 작성 방법 안내',
    body: '입점 제안 후 계약서를 작성하고 PDF로 내려받는 방법을 안내합니다.',
  },
  {
    category: 'GENERAL',
    title: '클래스 등록 시 사진 가이드',
    body: '클래스 사진은 가로 사진을 권장하며 최대 5장까지 등록할 수 있습니다.',
  },
  {
    category: 'IMPORTANT',
    title: '정산 계좌 등록 안내',
    body: '정산을 받으시려면 개인정보 메뉴에서 정산 계좌를 등록해 주세요.',
  },
  {
    category: 'GENERAL',
    title: '사업자등록증 업로드 방법',
    body: '회원가입 시 사업자등록증 이미지를 업로드하면 승인 절차가 진행됩니다.',
  },
  {
    category: 'IMPORTANT',
    title: '입점 제안 기능 업데이트',
    body: '소품샵이 작가에게 입점을 제안하고 채팅으로 이어갈 수 있습니다.',
  },
  {
    category: 'GENERAL',
    title: '예약 확정 및 반려 처리 방법',
    body: '클래스 예약 관리에서 달력으로 날짜를 선택해 예약을 확정하거나 반려할 수 있습니다.',
  },
  {
    category: 'GENERAL',
    title: '파트너 전용 공지 알림 설정',
    body: '파트너 공지 알림을 이메일로 받아볼 수 있습니다.',
  },
  {
    category: 'IMPORTANT',
    title: '수수료 정책 변경 사전 안내',
    body: '다음 달부터 적용되는 수수료 정책 변경 내용을 미리 안내드립니다.',
  },
  {
    category: 'GENERAL',
    title: '인스타그램 연동 방법',
    body: '개인정보 메뉴에서 인스타그램 계정을 연동하면 작품 소개 화면에 노출됩니다.',
  },
  {
    category: 'GENERAL',
    title: '세금 정보 등록 안내',
    body: '정산을 위해 세금 정보를 등록해 주세요.',
  },
  {
    category: 'IMPORTANT',
    title: '파트너 이용약관 개정 안내',
    body: '파트너 이용약관이 일부 개정되었으니 확인해 주세요.',
  },
];

const buildNotices = (
  target: NoticeApiItem['target'],
  templates: NoticeTemplate[],
  startId: number
): NoticeApiItem[] =>
  templates.map((template, index) => ({
    noticeId: startId + index,
    target,
    category: template.category,
    badge: CATEGORY_LABEL[template.category],
    title: template.title,
    body: template.body,
    createdAt: new Date(Date.UTC(2026, 9, 30 - index * 2, 9, 0, 0))
      .toISOString()
      .slice(0, 19),
    new: index < 2,
  }));

export const MOCK_NOTICES: NoticeApiItem[] = [
  ...buildNotices('USER', USER_TEMPLATES, 1),
  ...buildNotices('ARTIST_SHOP', PARTNER_TEMPLATES, 101),
];
