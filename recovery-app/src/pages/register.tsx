import { SelfQRcode } from '@selfxyz/qrcode';
import { InitializeAccount } from '../components/InitializeAccount';
import { useState } from 'react';
import { useSelfxyz } from '../hooks/useSelfxyz';
import { appConfig } from '../app-config';

export default function Register() {
  const { selfApp } = useSelfxyz();
  const [passkeyCreated, setPasskeyCreated] = useState(false);
  const [nullifier, setNullifier] = useState<string | null>(null);

  const handleSelfVerificationSuccess = async () => {
        const verificationId = selfApp.userId;
        const response = await fetch(`${appConfig.endpoint}-result/${verificationId}`);
        if (response.ok) {
          const result = await response.json();
          console.log('Stored verification result:', result);
          setNullifier(result.nullifier);
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
            Initialize Your Account
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {passkeyCreated
              ? 'Scan the QR code with your Self.xyz app to register your passport with the passkey that controls your account.'
              : 'First, create a passkey to secure your account.'}
          </p>
        </div>

        {!passkeyCreated ? (
          <InitializeAccount onSuccess={handlePasskeyCreated} />
        ) : (
          <>
            <SelfQRcode
              selfApp={selfApp}
              onSuccess={handleSelfVerificationSuccess}
              className="w-full"
            />
          </>
        )}
      </div>
    </div>
  );
} 