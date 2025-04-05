import { SelfQRcode } from '@selfxyz/qrcode';
import { useAccount } from 'wagmi';
import { InitializeAccount } from '../components/InitializeAccount';
import { useState, useEffect } from 'react';
import { useSelfxyz } from '../hooks/useSelfxyz';
import { v4 as uuidv4 } from 'uuid';

export default function Register() {
  const { address } = useAccount();
  const { selfApp } = useSelfxyz();
  const [passkeyCreated, setPasskeyCreated] = useState(false);
  const [verificationId, setVerificationId] = useState<string | null>(null);

  const handleSuccess = async () => {
            // Log the userId from selfApp
        console.log('UserId:', selfApp.userId);
        // Generate a unique ID for this verification
        const id = uuidv4();
        setVerificationId(id);
  };

  const handlePasskeyCreated = () => {
    setPasskeyCreated(true);
  };

  // Poll for verification result
  useEffect(() => {
    if (!verificationId) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:3000/verify-result/${verificationId}`);
        if (response.ok) {
          const result = await response.json();
          console.log('Stored verification result:', result);
          clearInterval(interval);
        }
      } catch (error) {
        console.error('Error fetching verification result:', error);
      }
    }, 1000); // Poll every second

    return () => clearInterval(interval);
  }, [verificationId]);

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
              onSuccess={handleSuccess}
              className="w-full"
            />
          </>
        )}
      </div>
    </div>
  );
} 