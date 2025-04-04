import { useNavigate } from 'react-router'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Account Recovery System
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            A secure and user-friendly system for creating and recovering your
            accounts. Our platform ensures your digital assets are always
            accessible while maintaining the highest security standards.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={() => navigate('/create')}
            className="w-full px-4 py-2 text-white bg-gray-800 dark:bg-gray-700 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
          >
            Create New Account
          </button>
          <button
            type="button"
            onClick={() => navigate('/recovery')}
            className="w-full px-4 py-2 text-white bg-gray-800 dark:bg-gray-700 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
          >
            Recover Account
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            How It Works
          </h2>
          <div className="space-y-4 text-gray-600 dark:text-gray-400">
            <p>
              Our application provides a secure way to manage your digital
              accounts:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Create new accounts with enhanced security features</li>
              <li>Set up recovery mechanisms to prevent loss of access</li>
              <li>Recover your accounts securely when needed</li>
              <li>Maintain full control over your digital assets</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
