import { USER_ROLE } from '../../shared/constants';
import { DEMO_ROLE_STORAGE_KEY } from '../../features/auth/constants/demo-constants';
import type { AuthUser } from '../../features/auth/types/auth-types';

export const MOCK_USERS: AuthUser[] = [
  {
    userId: 10,
    email: 'customer@dearobjet.com',
    name: '데모 회원',
    role: USER_ROLE.CUSTOMER,
    profileUrl: '',
    phoneNumber: '010-1111-2222',
    userStatus: 'ACTIVE',
  },
  {
    userId: 1,
    email: 'shop@dearobjet.com',
    name: '데모 소품샵',
    role: USER_ROLE.SHOP,
    profileUrl: '',
    phoneNumber: '010-1234-5678',
    userStatus: 'ACTIVE',
  },
  {
    userId: 2,
    email: 'artist@dearobjet.com',
    name: '데모 작가',
    role: USER_ROLE.ARTIST,
    profileUrl: '',
    phoneNumber: '010-8765-4321',
    userStatus: 'ACTIVE',
  },
];

export const getMockUser = () => {
  const role = localStorage.getItem(DEMO_ROLE_STORAGE_KEY);

  return MOCK_USERS.find((user) => user.role === role) ?? null;
};
