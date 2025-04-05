import { useState } from 'react';
import { useNavigate } from 'react-router';

export default function UpdatePasskey() {
  const [status, setStatus] = useState<
    'idle' | 'updating' | 'success' | 'error'
  >('idle');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const updatePasskey = async () => {
    try {
      setStatus('updating');
      setError('');

      // Generate a random challenge
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      // Create the credential options
      const credentialOptions: CredentialCreationOptions = {
        publicKey: {
          rp: {
            name: 'Recoverable Wallet',
            id: window.location.hostname,
          },
          user: {
            id: new Uint8Array(16),
            name: 'User',
            displayName: 'User',
          },
          pubKeyCredParams: [
            {
              type: 'public-key',
              alg: -7, // ES256
            },
          ],
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            userVerification: 'required',
          },
          challenge,
          timeout: 60000,
        },
      };

      // Create the credential
      const credential = await navigator.credentials.create(credentialOptions);

      if (!credential || !(credential instanceof PublicKeyCredential)) {
        throw new Error('Failed to create credential');
      }

      // Here you would typically send the credential to your backend
      // to verify and store the new passkey
      console.log('New credential created:', credential);

      setStatus('success');

      // Navigate back to home after successful update
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      console.error('Error updating passkey:', err);
      setError(err instanceof Error ? err.message : 'Failed to update passkey');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Update Your Passkey
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Set up a new passkey for your account using your device's biometric
            authentication.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          {status === 'idle' && (
            <button
              type="button"
              onClick={updatePasskey}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Update Passkey
            </button>
          )}

          {status === 'updating' && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto" />
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Setting up your new passkey...
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center">
              <svg
                className="mx-auto h-8 w-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                role="img"
                aria-label="Success checkmark"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Passkey updated successfully! Redirecting...
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center">
              <svg
                className="mx-auto h-8 w-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                role="img"
                aria-label="Error icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
              <button
                type="button"
                onClick={updatePasskey}
                className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
