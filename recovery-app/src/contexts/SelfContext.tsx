import type { SelfAppBuilder } from '@selfxyz/core'
import { type ReactNode, createContext, useContext, useState } from 'react'

interface SelfContextType {
  self: SelfAppBuilder | null
  setSelf: (self: SelfAppBuilder | null) => void
}

const SelfContext = createContext<SelfContextType | null>(null)

export function SelfProvider({ children }: { children: ReactNode }) {
  const [self, setSelf] = useState<SelfAppBuilder | null>(null)

  return (
    <SelfContext.Provider value={{ self, setSelf }}>
      {children}
    </SelfContext.Provider>
  )
}

export function useSelf() {
  const context = useContext(SelfContext)
  if (!context) {
    throw new Error('useSelf must be used within a SelfProvider')
  }
  return context
}
