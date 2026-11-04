import {
  DEMO_ROLE_OPTIONS,
  DEMO_ROLE_STORAGE_KEY,
} from '../constants/demo-constants';

interface DemoLoginModalProps {
  onClose: () => void;
}

export const DemoLoginModal = ({ onClose }: DemoLoginModalProps) => {
  const handleSelectRole = (role: string) => {
    localStorage.setItem(DEMO_ROLE_STORAGE_KEY, role);
    window.location.reload();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      role="dialog"
      aria-modal="true"
      aria-label="데모 로그인"
      onClick={onClose}
    >
      <div
        className="w-[24rem] rounded-xl bg-white p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="mb-2 text-lg font-bold text-gray-900">데모 로그인</h2>
        <p className="mb-6 text-sm text-gray-500">
          체험할 회원 유형을 선택하세요.
        </p>

        <div className="flex flex-col gap-3">
          {DEMO_ROLE_OPTIONS.map(({ role, label, description }) => (
            <button
              key={role}
              type="button"
              className="flex flex-col items-start gap-1 rounded-lg border border-gray-300 bg-white px-5 py-4 text-left transition-colors hover:border-gray-900 focus:outline-none"
              onClick={() => handleSelectRole(role)}
            >
              <span className="text-base font-semibold text-gray-900">
                {label}
              </span>
              <span className="text-xs text-gray-500">{description}</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          className="mt-5 w-full rounded-none bg-white text-sm text-gray-500 hover:border-white focus:outline-none"
          onClick={onClose}
        >
          닫기
        </button>
      </div>
    </div>
  );
};
