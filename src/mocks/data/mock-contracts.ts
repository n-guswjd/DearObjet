import type {
  ContractDocument,
  ContractRequestType,
  ContractStatus,
} from '../../features/tenant-management/types/artist-tenant-types';

import { MOCK_ARTISTS } from './mock-artists';
import { MOCK_SHOPS } from './mock-shops';

export type DocumentStatus = 'SENT' | 'ARTIST_SUBMITTED' | 'COMPLETED';

export interface ShopParty {
  businessName: string;
  ownerName: string;
  businessNumber: string;
  address: string;
  contact: string;
  signatureBusinessName: string;
  signatureOwnerName: string;
}

export interface ArtistParty {
  artistName: string;
  businessNumber: string;
  address: string;
  contact: string;
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  signatureName: string;
}

export interface MockContract {
  contractId: number;
  shopId: number;
  artistId: number;
  contractStatus: ContractStatus;
  contractRequestType: ContractRequestType;
  documentStatus: DocumentStatus;
  contractStartDate: string;
  contractEndDate: string;
  commissionRate: number;
  settlementDay: number;
  paymentDay: number;
  contractDate: string;
  shop: ShopParty;
  artist: ArtistParty;
}

type ContractSeed = Pick<
  MockContract,
  | 'contractId'
  | 'shopId'
  | 'artistId'
  | 'contractStatus'
  | 'contractRequestType'
  | 'documentStatus'
  | 'contractStartDate'
  | 'contractEndDate'
>;

interface ShopDetail {
  ownerName: string;
  businessNumber: string;
}

interface ArtistDetail {
  businessNumber: string;
  contact: string;
  accountHolder: string;
  accountNumber: string;
}

const SHOP_DETAILS: Record<number, ShopDetail> = {
  1: { ownerName: '김데모', businessNumber: '123-45-67890' },
  2: { ownerName: '박모이', businessNumber: '345-67-89012' },
  3: { ownerName: '최봄날', businessNumber: '456-78-90123' },
};

const DEFAULT_SHOP_DETAIL: ShopDetail = {
  ownerName: '김대표',
  businessNumber: '789-01-23456',
};

const ARTIST_DETAILS: Record<number, ArtistDetail> = {
  2: {
    businessNumber: '234-56-78901',
    contact: '010-8765-4321',
    accountHolder: '이작가',
    accountNumber: '3333012345678',
  },
  5: {
    businessNumber: '345-12-34567',
    contact: '010-5555-0005',
    accountHolder: '박달빛',
    accountNumber: '1002123456789',
  },
  31: {
    businessNumber: '456-23-45678',
    contact: '010-5555-0031',
    accountHolder: '최유리',
    accountNumber: '3560123456789',
  },
  33: {
    businessNumber: '567-34-56789',
    contact: '010-5555-0033',
    accountHolder: '정한지',
    accountNumber: '1105123456789',
  },
};

const DEFAULT_ARTIST_DETAIL: ArtistDetail = {
  businessNumber: '678-45-67890',
  contact: '010-5555-0000',
  accountHolder: '김작가',
  accountNumber: '1234567890123',
};

const EMPTY_ARTIST: ArtistParty = {
  artistName: '',
  businessNumber: '',
  address: '',
  contact: '',
  bankName: '',
  accountHolder: '',
  accountNumber: '',
  signatureName: '',
};

export const getShop = (shopId: number) =>
  MOCK_SHOPS.find((shop) => shop.shopId === shopId) ?? MOCK_SHOPS[0];

export const getArtist = (artistId: number) =>
  MOCK_ARTISTS.find((artist) => artist.artistId === artistId);

export const getShopByUserId = (userId: number) =>
  MOCK_SHOPS.find((shop) => shop.userId === userId);

export const getArtistByUserId = (userId: number) =>
  MOCK_ARTISTS.find((artist) => artist.userId === userId);

export const buildShopParty = (shopId: number): ShopParty => {
  const shop = getShop(shopId);
  const detail = SHOP_DETAILS[shop.shopId] ?? DEFAULT_SHOP_DETAIL;

  return {
    businessName: shop.businessName,
    ownerName: detail.ownerName,
    businessNumber: detail.businessNumber,
    address: shop.businessAddress,
    contact: shop.phoneNumber ?? '',
    signatureBusinessName: shop.businessName,
    signatureOwnerName: detail.ownerName,
  };
};

export const buildArtistParty = (artistId: number): ArtistParty => {
  const artist = getArtist(artistId) ?? MOCK_ARTISTS[0];
  const detail = ARTIST_DETAILS[artist.artistId] ?? DEFAULT_ARTIST_DETAIL;

  return {
    artistName: artist.artistName,
    businessNumber: detail.businessNumber,
    address: '서울 성동구 성수이로 88',
    contact: detail.contact,
    bankName: '카카오뱅크',
    accountHolder: detail.accountHolder,
    accountNumber: detail.accountNumber,
    signatureName: artist.artistName,
  };
};

const SEEDS: ContractSeed[] = [
  {
    contractId: 1,
    shopId: 1,
    artistId: 2,
    contractStatus: 'APPROVED',
    contractRequestType: 'NONE',
    documentStatus: 'COMPLETED',
    contractStartDate: '2026-03-01',
    contractEndDate: '2027-02-28',
  },
  {
    contractId: 2,
    shopId: 1,
    artistId: 5,
    contractStatus: 'APPROVED',
    contractRequestType: 'NONE',
    documentStatus: 'COMPLETED',
    contractStartDate: '2026-06-01',
    contractEndDate: '2027-05-31',
  },
  {
    contractId: 3,
    shopId: 1,
    artistId: 31,
    contractStatus: 'PENDING',
    contractRequestType: 'NONE',
    documentStatus: 'SENT',
    contractStartDate: '2026-12-01',
    contractEndDate: '2027-11-30',
  },
  {
    contractId: 4,
    shopId: 2,
    artistId: 2,
    contractStatus: 'PENDING',
    contractRequestType: 'NONE',
    documentStatus: 'SENT',
    contractStartDate: '2026-12-01',
    contractEndDate: '2027-11-30',
  },
  {
    contractId: 5,
    shopId: 3,
    artistId: 2,
    contractStatus: 'APPROVED',
    contractRequestType: 'NONE',
    documentStatus: 'COMPLETED',
    contractStartDate: '2026-01-01',
    contractEndDate: '2026-12-31',
  },
  {
    contractId: 6,
    shopId: 1,
    artistId: 33,
    contractStatus: 'ENDED',
    contractRequestType: 'NONE',
    documentStatus: 'COMPLETED',
    contractStartDate: '2025-01-01',
    contractEndDate: '2025-12-31',
  },
];

export const MOCK_CONTRACTS: MockContract[] = SEEDS.map((seed) => ({
  ...seed,
  commissionRate: 30,
  settlementDay: 25,
  paymentDay: 5,
  contractDate: seed.contractStartDate,
  shop: buildShopParty(seed.shopId),
  artist: buildArtistParty(seed.artistId),
}));

let nextContractId = 100;

export const takeContractId = () => nextContractId++;

export const toContractDocument = (
  contract: MockContract
): ContractDocument => {
  const artist =
    contract.documentStatus === 'SENT' ? EMPTY_ARTIST : contract.artist;

  return {
    contractId: contract.contractId,
    contractStatus: contract.contractStatus,
    contractDocumentStatus: contract.documentStatus,
    shopBusinessName: contract.shop.businessName,
    shopOwnerName: contract.shop.ownerName,
    shopBusinessNumber: contract.shop.businessNumber,
    shopAddress: contract.shop.address,
    shopContact: contract.shop.contact,
    contractStartDate: contract.contractStartDate,
    contractEndDate: contract.contractEndDate,
    commissionRate: contract.commissionRate,
    settlementDay: contract.settlementDay,
    paymentDay: contract.paymentDay,
    contractDate: contract.contractDate,
    shopSignatureBusinessName: contract.shop.signatureBusinessName,
    shopSignatureOwnerName: contract.shop.signatureOwnerName,
    artistName: artist.artistName,
    artistBusinessNumber: artist.businessNumber,
    artistAddress: artist.address,
    artistContact: artist.contact,
    artistBankName: artist.bankName,
    artistAccountHolder: artist.accountHolder,
    artistAccountNumber: artist.accountNumber,
    artistSignatureName: artist.signatureName,
  };
};

export const toContractDetail = (contract: MockContract) => ({
  contractId: contract.contractId,
  shopId: contract.shopId,
  shopName: getShop(contract.shopId).shopName,
  artistId: contract.artistId,
  artistName: getArtist(contract.artistId)?.artistName ?? '',
  contractStartDate: contract.contractStartDate,
  contractEndDate: contract.contractEndDate,
  contractStatus: contract.contractStatus,
  contractRequestType: contract.contractRequestType,
  commissionType: 'RATE' as const,
  commissionValue: contract.commissionRate,
  memo: '',
  contractDocument: toContractDocument(contract),
});
