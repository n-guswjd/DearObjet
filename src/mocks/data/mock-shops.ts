import { createPlaceholderImage } from '../utils/placeholder-image';

export interface MockShop {
  shopId: number;
  userId: number;
  shopName: string;
  businessName: string;
  businessAddress: string;
  latitude: number;
  longitude: number;
  phoneNumber: string | null;
  instagramId: string | null;
  profileUrl: string | null;
}

type ShopSeed = Omit<MockShop, 'profileUrl'>;

const SHOP_SEEDS: ShopSeed[] = [
  {
    shopId: 1,
    userId: 1,
    shopName: '데모 소품샵',
    businessName: '데모 소품샵',
    businessAddress: '서울 마포구 연남로 12',
    latitude: 37.5622,
    longitude: 126.9253,
    phoneNumber: '02-123-4567',
    instagramId: 'demo_shop',
  },
  {
    shopId: 2,
    userId: 4,
    shopName: '모이 소품샵',
    businessName: '모이 소품샵',
    businessAddress: '서울 성동구 성수이로 34',
    latitude: 37.5446,
    longitude: 127.056,
    phoneNumber: '02-234-5678',
    instagramId: 'moi_objet',
  },
  {
    shopId: 3,
    userId: 3,
    shopName: '봄날 공방',
    businessName: '봄날 공방',
    businessAddress: '서울 종로구 자하문로 56',
    latitude: 37.58,
    longitude: 126.9694,
    phoneNumber: '02-345-6789',
    instagramId: 'bomnal_craft',
  },
  {
    shopId: 4,
    userId: 21,
    shopName: '달빛 문구점',
    businessName: '달빛 문구점',
    businessAddress: '서울 마포구 망원로 78',
    latitude: 37.556,
    longitude: 126.9014,
    phoneNumber: '02-456-7890',
    instagramId: 'dalbit_stationery',
  },
  {
    shopId: 5,
    userId: 22,
    shopName: '오브제 하우스',
    businessName: '오브제 하우스',
    businessAddress: '서울 용산구 한남대로 90',
    latitude: 37.534,
    longitude: 127.0,
    phoneNumber: null,
    instagramId: 'objet_house',
  },
  {
    shopId: 6,
    userId: 23,
    shopName: '작은 정원',
    businessName: '작은 정원',
    businessAddress: '제주 제주시 한림읍 협재로 21',
    latitude: 33.414,
    longitude: 126.267,
    phoneNumber: '064-123-4567',
    instagramId: 'small_garden_jeju',
  },
  {
    shopId: 7,
    userId: 24,
    shopName: '햇살 소품',
    businessName: '햇살 소품',
    businessAddress: '서울 강남구 압구정로 43',
    latitude: 37.52,
    longitude: 127.023,
    phoneNumber: '02-567-8901',
    instagramId: null,
  },
  {
    shopId: 8,
    userId: 25,
    shopName: '나무결 공방',
    businessName: '나무결 공방',
    businessAddress: '서울 서대문구 연희로 65',
    latitude: 37.566,
    longitude: 126.933,
    phoneNumber: '02-678-9012',
    instagramId: 'namugyeol',
  },
];

export const MOCK_SHOPS: MockShop[] = SHOP_SEEDS.map((shop, index) => ({
  ...shop,
  profileUrl: createPlaceholderImage(index, shop.shopName),
}));
