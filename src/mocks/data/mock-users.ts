import type { AuthUser } from '../../features/auth/types/auth-types';

export const MOCK_USERS: AuthUser[] = [
  {
    userId: 1,
    email: 'shop@dearobjet.com',
    name: '데모 소품샵',
    role: 'SHOP',
    profileUrl: '',
    phoneNumber: '010-1234-5678',
    userStatus: 'ACTIVE',
  },
  {
    userId: 2,
    email: 'artist@dearobjet.com',
    name: '데모 작가',
    role: 'ARTIST',
    profileUrl: '',
    phoneNumber: '010-8765-4321',
    userStatus: 'ACTIVE',
  },
];

export const getMockUser = () => {
  const role = localStorage.getItem('mock-role');
  return MOCK_USERS.find((user) => user.role === role) ?? MOCK_USERS[0];
};
