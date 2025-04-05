import { useNavigate } from 'react-router';

export default function Create() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create Recoverable Account
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            We will guide you through the process of creating a new recoverable
            account.
          </p>
          <div className="mt-2 flex items-center justify-center gap-2">
            <p className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer">
              What is a recoverable account?
            </p>
            <div className="group relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400 cursor-help"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-sm text-gray-600 dark:text-gray-300">
                If you lose your passkey, you can use Self protocol to verify
                your passport and delegate your account to a new passkey. This
                ensures you never lose access to your account.
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="w-full px-4 py-2 text-white bg-gray-800 dark:bg-gray-700 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
          >
            Create Account
          </button>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
