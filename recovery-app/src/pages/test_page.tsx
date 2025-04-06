import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useNavigate } from 'react-router';

export default function TestPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            7702 Recovery
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Connect your wallet to get started
          </p>
        </div>

        <div className="flex justify-center">
          <ConnectButton />
        </div>

        <div className="flex flex-col gap-4 mt-8">
          <button
            type="button"
            onClick={() => navigate('/create7702')}
            className="w-full px-4 py-2 text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all"
          >
            Create 7702
          </button>

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
