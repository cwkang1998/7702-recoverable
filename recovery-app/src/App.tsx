import { BrowserRouter, Route, Routes } from 'react-router';
import Create from './pages/create';
import Home from './pages/home';
import Recovery from './pages/recovery';
import Register from './pages/register';
import UpdatePasskey from './pages/update-passkey';

import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { SelfxyzAppProvider } from './hooks/useSelfxyz';
import { queryClient, wagmiConfig } from './config';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
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
      </WagmiProvider>
    </QueryClientProvider>
  );
}

export default App;
