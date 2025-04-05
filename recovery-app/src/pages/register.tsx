import { useNavigate } from 'react-router';
import { SelfQRcode } from '@selfxyz/qrcode';
import { useSelfxyz } from '../hooks/useSelfxyz';

export default function Register() {
  const navigate = useNavigate();
  const { selfApp } = useSelfxyz();

  // Log selfApp to check its state
  console.log('selfApp:', selfApp);

  const handleSuccess = async () => {
    console.log('Verification successful');
    try {
      const response = await fetch('http://localhost:3000/verify', {
        method: 'GET',
      });

      const data = await response.json();
      if (data.status === 'success' && data.credentialSubject) {
        console.log('Nullifier:', data.credentialSubject.nullifier);
      } else {
        console.error('Verification failed:', data.message);
      }
    } catch (error) {
      console.error('Error fetching verification result:', error);
    }
  };

  // Only render SelfQRcode if selfApp is properly initialized
  if (!selfApp) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Loading...
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Register Proof with Self.xyz
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Scan the QR code below with the Self.xyz app to register your proof.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg flex flex-col items-center">
          <SelfQRcode
            selfApp={selfApp}
            onSuccess={handleSuccess}
          />
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            {/* Place your captions here. */}
          </p>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Having trouble? Contact support at support@example.com
          </p>
        </div>
      </div>
    </div>
  );
} 