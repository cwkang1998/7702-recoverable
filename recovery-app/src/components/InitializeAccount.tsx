import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAccount } from 'wagmi';
import { celoAlfajores } from 'wagmi/chains';
import { client } from '../config';
import { Account } from '../modules/Account';

interface InitializeAccountProps {
  onSuccess?: (result: {
    hash: string;
    publicKey: { x: bigint; y: bigint };
  }) => void;
  onStart?: () => void;
}

export function InitializeAccount({
  onSuccess,
  onStart,
}: InitializeAccountProps) {
  const { data: result, ...createMutation } = Account.useCreate({
    client,
  });
  const { address } = useAccount();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    try {
      if (onStart) {
        onStart();
      }
      setIsCreating(true);
      setError(null);

      const result = await createMutation.mutateAsync();
      console.log(result);

      // Call onSuccess only after mutation completes successfully
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      console.error('Error creating credential:', error);
      setError('Failed to create passkey. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="flex flex-col gap-4">
        <button
          onClick={handleCreate}
          disabled={isCreating}
          className={`w-full px-4 py-2 text-white rounded-lg transition-colors ${
            isCreating
              ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-gray-800 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600'
          }`}
        >
          {isCreating ? 'Creating Passkey...' : 'Create Passkey'}
        </button>
      </div>

      {error && (
        <div className="mt-4 text-center text-red-500 dark:text-red-400">
          {error}
        </div>
      )}

      {address && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Account created!{' '}
            <a
              href={`${celoAlfajores.blockExplorers.default.url}/address/${address}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View on Explorer
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
