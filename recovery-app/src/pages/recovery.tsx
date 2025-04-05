import { SelfQRcode } from '@selfxyz/qrcode';
import { useNavigate } from 'react-router';
import { useSelfxyz } from '../hooks/useSelfxyz';

export default function Recovery() {
  const { selfApp } = useSelfxyz();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Account Recovery with Self.xyz
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Scan the QR code below with the Self.xyz app to recover your
            account.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg flex flex-col items-center">
          <SelfQRcode
            selfApp={selfApp}
            onSuccess={() => {
              console.log('Verification successful');
              navigate('/update-passkey');
            }}
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
