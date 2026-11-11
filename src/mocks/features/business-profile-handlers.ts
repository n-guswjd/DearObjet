import { http, HttpResponse } from 'msw';

import type { AuthUser } from '../../features/auth/types/auth-types';

import { getBusinessState } from '../data/mock-business';
import type { MockBusinessProfile } from '../data/mock-business';
import { getMockUser } from '../data/mock-users';
import { readAsDataUrl } from '../utils/read-as-data-url';
import { unauthorized } from '../utils/responses';

import { getProfileState } from './my-page-handlers';

const EDITABLE_KEYS = [
  'businessPhoneNumber',
  'instagramId',
  'bankName',
  'bankAccountNumber',
  'accountHolder',
  'taxInvoiceEmail',
] as const;

const buildBusinessProfile = (user: AuthUser) => ({
  profileUrl: getProfileState(user.userId).profileUrl,
  userName: user.name,
  phoneNumber: user.phoneNumber ?? '',
  email: user.email,
  ...getBusinessState(user),
});

export const businessProfileHandlers = [
  http.get('*/users/me/business-profile', () => {
    const user = getMockUser();

    if (!user) {
      return unauthorized();
    }

    return HttpResponse.json({ data: buildBusinessProfile(user) });
  }),

  http.patch('*/users/me/business-profile', async ({ request }) => {
    const user = getMockUser();

    if (!user) {
      return unauthorized();
    }

    const formData = await request.formData();
    const part = formData.get('request');
    const body =
      part instanceof Blob
        ? (JSON.parse(await part.text()) as Partial<MockBusinessProfile>)
        : {};
    const business = getBusinessState(user);

    EDITABLE_KEYS.forEach((key) => {
      const value = body[key];

      if (value !== undefined) {
        business[key] = value;
      }
    });

    const bankbook = formData.get('bankbookImage');
    const image = formData.get('profileImage');

    if (bankbook instanceof File) {
      business.bankbookImageUrl = await readAsDataUrl(bankbook);
    }

    if (image instanceof File) {
      const profileUrl = await readAsDataUrl(image);
      getProfileState(user.userId).profileUrl = profileUrl;
      user.profileUrl = profileUrl;
    }

    return HttpResponse.json({ data: buildBusinessProfile(user) });
  }),
];
