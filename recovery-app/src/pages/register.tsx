import { SelfQRcode } from '@selfxyz/qrcode';
import { useAccount } from 'wagmi';
import { InitializeAccount } from '../components/InitializeAccount';
import { useState } from 'react';
import { useSelfxyz } from '../hooks/useSelfxyz';


export default function Register() {
  const { address } = useAccount();
  const { selfApp } = useSelfxyz();
  const [passkeyCreated, setPasskeyCreated] = useState(false);

  const handleSuccess = async (result: any) => {
    console.log('Verification result:', result);
    if (result.credentialSubject) {
      console.log('Credential subject:', result.credentialSubject);
      // Here you can handle the verification result, e.g., store it or make API calls
    }
  };

  const handlePasskeyCreated = () => {
    setPasskeyCreated(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Register Your Proof
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {passkeyCreated
              ? 'Scan the QR code with your Self.xyz app to register your proof.'
              : 'First, create a passkey to secure your account.'}
          </p>
        </div>

        {!passkeyCreated ? (
          <InitializeAccount onSuccess={handlePasskeyCreated} />
        ) : (
          <>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <SelfQRcode
                selfApp={selfApp}
                onSuccess={handleSuccess}
                address={address}
                className="w-full"
              />
            </div>

            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              <p>
                After scanning, your proof will be registered and linked to your account.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 