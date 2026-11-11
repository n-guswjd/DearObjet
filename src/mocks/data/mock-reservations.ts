import { MOCK_SHOPS } from './mock-shops';

export interface MockReservation {
  reservationNumber: number;
  status: string;
  reservationStore: string;
  reservationTime: string;
  className: string;
}

const createTime = (daysFromNow: number, hour: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
};

const getShopName = (shopId: number) =>
  MOCK_SHOPS.find((shop) => shop.shopId === shopId)?.shopName ?? '';

export const MOCK_RESERVATIONS: {
  currentReservations: MockReservation[];
  pastReservations: MockReservation[];
} = {
  currentReservations: [
    {
      reservationNumber: 20261101,
      status: 'CONFIRMED',
      reservationStore: getShopName(1),
      reservationTime: createTime(3, 14),
      className: '도자기 컵 만들기 원데이 클래스',
    },
    {
      reservationNumber: 20261102,
      status: 'PENDING',
      reservationStore: getShopName(2),
      reservationTime: createTime(9, 11),
      className: '소이 캔들 만들기 클래스',
    },
  ],
  pastReservations: [
    {
      reservationNumber: 20260901,
      status: 'COMPLETED',
      reservationStore: getShopName(3),
      reservationTime: createTime(-20, 15),
      className: '손뜨개 코스터 클래스',
    },
    {
      reservationNumber: 20260802,
      status: 'COMPLETED',
      reservationStore: getShopName(4),
      reservationTime: createTime(-60, 13),
      className: '엽서 일러스트 클래스',
    },
  ],
};
