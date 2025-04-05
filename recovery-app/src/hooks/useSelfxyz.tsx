import { type SelfApp, SelfAppBuilder } from '@selfxyz/core';
import { createContext, useContext, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { appConfig } from '../app-config';

interface SelfxyzAppContextType {
  selfApp: SelfApp; // You might want to type this properly based on Selfxyz's types
}

const SelfxyzAppContext = createContext<SelfxyzAppContextType | null>(null);

export function SelfxyzAppProvider({
  children,
}: { children: React.ReactNode }) {
  // Generate a unique user ID
  const userId = useMemo(() => uuidv4(), []);

  // Create a SelfApp instance using the builder pattern
  const selfApp = useMemo(() => {
    return new SelfAppBuilder({
      appName: appConfig.appName,
      scope: appConfig.scope,
      endpoint: appConfig.endpoint,
      endpointType: 'https',
      userId,
    }).build();
  }, [userId]);

  const value = useMemo(
    () => ({
      selfApp,
    }),
    [selfApp],
  );

  return (
    <SelfxyzAppContext.Provider value={value}>
      {children}
    </SelfxyzAppContext.Provider>
  );
}

export function useSelfxyz() {
  const context = useContext(SelfxyzAppContext);
  if (!context) {
    throw new Error('useSelfxyz must be used within a SelfxyzAppProvider');
  }
  return context;
}
