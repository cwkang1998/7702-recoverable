import { SelfQRcode } from '@selfxyz/qrcode';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { appConfig } from '../app-config';
import { InitializeAccount } from '../components/InitializeAccount';
import { useSelfxyz } from '../hooks/useSelfxyz';

export default function Register() {
  const { selfApp } = useSelfxyz();
  const [isCreatingPasskey, setIsCreatingPasskey] = useState(false);
  const [passkeyCreated, setPasskeyCreated] = useState(false);
  const [nullifier, setNullifier] = useState<string | null>(null);
  const [keyIndex, setKeyIndex] = useState<bigint | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSelfVerificationSuccess = async () => {
    if (!keyIndex) {
      throw new Error('Key index not found');
    }

    const verificationId = selfApp.userId;
    const response = await fetch(
      `${appConfig.endpoint}-result/${verificationId}`,
    );
    if (response.ok) {
      const result = await response.json();
      console.log('Stored verification result:', result);
      setNullifier(result.nullifier);

      // Start submitting to backend
      setIsSubmitting(true);

      // Navigate to homepage after successful submission
      navigate('/');
      try {
        const submitResponse = await fetch(
          `${appConfig.baseUrl}/register-recovery`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              nullifier: result.nullifier,
              keyIndex: keyIndex,
            }),
          },
        );

        if (!submitResponse.ok) {
          throw new Error('Failed to submit nullifier');
        }
      } catch (error) {
        console.error('Error submitting nullifier:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handlePasskeyCreated = (result: {
    hash: string;
    publicKey: { x: bigint; y: bigint };
    keyIndex: bigint;
  }) => {
    console.log(result);
    setPasskeyCreated(true);
    setIsCreatingPasskey(false);
    setKeyIndex(result.keyIndex);
  };

  const handlePasskeyCreationStart = () => {
    setIsCreatingPasskey(true);
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
          <InitializeAccount
            onSuccess={handlePasskeyCreated}
            onStart={handlePasskeyCreationStart}
          />
        ) : !nullifier ? (
          <>
            <SelfQRcode
              selfApp={selfApp}
              onSuccess={handleSelfVerificationSuccess}
            />
            {isSubmitting && (
              <div className="mt-4 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Verification complete! Your account has been initialized.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
