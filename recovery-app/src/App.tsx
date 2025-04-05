import { BrowserRouter, Route, Routes } from 'react-router';
import Create from './pages/create';
import Home from './pages/home';
import Recovery from './pages/recovery';
import Register from './pages/register';
import UpdatePasskey from './pages/update-passkey';

import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { celoAlfajores, sepolia, zircuitTestnet } from 'wagmi/chains';
import { SelfxyzAppProvider } from './hooks/useSelfxyz';

const config = getDefaultConfig({
  appName: '7702 Recoverable',
  projectId: '7702-recoverable',
  chains: [celoAlfajores, sepolia, zircuitTestnet],
});

function App() {
  const queryClient = new QueryClient();
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <SelfxyzAppProvider>
            {/* Your App */}
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/create" element={<Create />} />
                <Route path="/register" element={<Register />} />
                <Route path="/recovery" element={<Recovery />} />
                <Route path="/update-passkey" element={<UpdatePasskey />} />
              </Routes>
            </BrowserRouter>
            {/* App ends here */}
          </SelfxyzAppProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
