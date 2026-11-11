import { http, HttpResponse } from 'msw';

import type {
  ArtistSearchItem,
  ArtistSubmissionRequest,
  CompletedContractItem,
  SendContractRequest,
} from '../../features/contract-management/types/contract-management-types';

import { MOCK_ARTISTS } from '../data/mock-artists';
import {
  MOCK_CONTRACTS,
  buildArtistParty,
  getArtist,
  getArtistByUserId,
  getShop,
  getShopByUserId,
  takeContractId,
  toContractDetail,
  toContractDocument,
} from '../data/mock-contracts';
import type { MockContract } from '../data/mock-contracts';
import { notFound } from '../utils/responses';

const CONTRACT_TITLE = '입점 계약서';

const getToday = () => new Date().toLocaleDateString('sv-SE');

const getUserId = (url: string) =>
  Number(new URL(url).searchParams.get('userId'));

const findContract = (rawId: string | readonly string[] | undefined) =>
  MOCK_CONTRACTS.find((contract) => contract.contractId === Number(rawId));

const getViewerType = (contract: MockContract, userId: number) => {
  if (getShopByUserId(userId)?.shopId === contract.shopId) {
    return 'SHOP';
  }

  if (getArtistByUserId(userId)?.artistId === contract.artistId) {
    return 'ARTIST';
  }

  return null;
};

const toCompletedItem = (contract: MockContract): CompletedContractItem => ({
  contractId: contract.contractId,
  title: CONTRACT_TITLE,
  contractDate: contract.contractDate,
  artistId: contract.artistId,
  artistName: contract.artist.artistName,
  artistBusinessNumber: contract.artist.businessNumber,
  artistContact: contract.artist.contact,
  contractStartDate: contract.contractStartDate,
  contractEndDate: contract.contractEndDate,
});

const respondDetail = (rawId: string | readonly string[] | undefined) => {
  if (Number.isNaN(Number(rawId))) {
    return undefined;
  }

  const contract = findContract(rawId);

  if (!contract) {
    return notFound('계약서를 찾을 수 없습니다.');
  }

  return HttpResponse.json({ data: toContractDetail(contract) });
};

export const contractHandlers = [
  http.get('*/api/v1/contracts/artists/search', ({ request }) => {
    const keyword = (
      new URL(request.url).searchParams.get('keyword') ?? ''
    ).trim();

    const items: ArtistSearchItem[] = MOCK_ARTISTS.filter((artist) =>
      artist.artistName.includes(keyword)
    ).map((artist) => ({
      artistId: artist.artistId,
      userId: artist.userId,
      userName: artist.artistName,
      artistName: artist.artistName,
      artistImageUrl: artist.artistImageUrl ?? '',
      specialty: '공예',
      instagramId: `artist_${artist.artistId}`,
      email: `artist${artist.artistId}@dearobjet.com`,
    }));

    return HttpResponse.json({ data: { items } });
  }),

  http.post(
    '*/api/v1/contracts/artists/:artistId/send',
    async ({ params, request }) => {
      const artistId = Number(params.artistId);

      if (!getArtist(artistId)) {
        return notFound('작가를 찾을 수 없습니다.');
      }

      const shop = getShopByUserId(getUserId(request.url)) ?? getShop(1);
      const body = (await request.json()) as SendContractRequest;

      const contract: MockContract = {
        contractId: takeContractId(),
        shopId: shop.shopId,
        artistId,
        contractStatus: 'PENDING',
        contractRequestType: 'NONE',
        documentStatus: 'SENT',
        contractStartDate: body.contractStartDate || getToday(),
        contractEndDate: body.contractEndDate || getToday(),
        commissionRate: body.commissionRate,
        settlementDay: body.settlementDay,
        paymentDay: body.paymentDay,
        contractDate: body.contractDate || getToday(),
        shop: {
          businessName: body.shopBusinessName,
          ownerName: body.shopOwnerName,
          businessNumber: body.shopBusinessNumber,
          address: body.shopAddress,
          contact: body.shopContact,
          signatureBusinessName: body.shopSignatureBusinessName,
          signatureOwnerName: body.shopSignatureOwnerName,
        },
        artist: buildArtistParty(artistId),
      };

      MOCK_CONTRACTS.push(contract);

      return HttpResponse.json(
        { data: toContractDocument(contract) },
        { status: 201 }
      );
    }
  ),

  http.patch(
    '*/api/v1/contracts/shops/:contractId/artist-submission',
    async ({ params, request }) => {
      const contract = findContract(params.contractId);

      if (!contract) {
        return notFound('계약서를 찾을 수 없습니다.');
      }

      const body = (await request.json()) as ArtistSubmissionRequest;

      contract.artist = {
        artistName: body.artistName,
        businessNumber: body.artistBusinessNumber,
        address: body.artistAddress,
        contact: body.artistContact,
        bankName: body.artistBankName,
        accountHolder: body.artistAccountHolder,
        accountNumber: body.artistAccountNumber,
        signatureName: body.artistSignatureName,
      };
      contract.documentStatus = 'ARTIST_SUBMITTED';

      return HttpResponse.json({ data: toContractDocument(contract) });
    }
  ),

  http.get('*/api/v1/contracts/documents/in-progress', ({ request }) => {
    const userId = getUserId(request.url);

    const items = MOCK_CONTRACTS.flatMap((contract) => {
      const viewerType = getViewerType(contract, userId);

      if (!viewerType || contract.contractStatus !== 'PENDING') {
        return [];
      }

      const isShop = viewerType === 'SHOP';

      return [
        {
          contractId: contract.contractId,
          title: CONTRACT_TITLE,
          viewerType,
          counterpartyId: isShop ? contract.artistId : contract.shopId,
          counterpartyName: isShop
            ? (getArtist(contract.artistId)?.artistName ?? '')
            : contract.shop.businessName,
          contractDate: contract.contractDate,
          contractStartDate: contract.contractStartDate,
          contractEndDate: contract.contractEndDate,
          contractDocumentStatus: contract.documentStatus,
          detailApiPath: isShop
            ? `/api/v1/contracts/artists/${contract.contractId}`
            : `/api/v1/contracts/shops/${contract.contractId}`,
        },
      ];
    });

    return HttpResponse.json({ data: { items } });
  }),

  http.get('*/api/v1/contracts/documents/completed', ({ request }) => {
    const userId = getUserId(request.url);

    const items = MOCK_CONTRACTS.filter(
      (contract) =>
        contract.contractStatus !== 'PENDING' &&
        getViewerType(contract, userId) !== null
    ).map(toCompletedItem);

    return HttpResponse.json({ data: { items } });
  }),

  http.get('*/api/v1/contracts/artists/:contractId', ({ params }) =>
    respondDetail(params.contractId)
  ),

  http.get('*/api/v1/contracts/shops/:contractId', ({ params }) =>
    respondDetail(params.contractId)
  ),
];
