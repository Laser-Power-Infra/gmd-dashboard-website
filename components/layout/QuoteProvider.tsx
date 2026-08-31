'use client';

import { createContext, useCallback, useContext, useState } from 'react';

interface QuoteContextValue {
  isQuoteOpen: boolean;
  openQuote: () => void;
  closeQuote: () => void;
}

const QuoteContext = createContext<QuoteContextValue | null>(null);

export function QuoteProvider({ children }: { children: React.ReactNode }) {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  const openQuote = useCallback(() => setIsQuoteOpen(true), []);
  const closeQuote = useCallback(() => setIsQuoteOpen(false), []);

  return (
    <QuoteContext.Provider value={{ isQuoteOpen, openQuote, closeQuote }}>
      {children}
    </QuoteContext.Provider>
  );
}

export function useQuote() {
  const ctx = useContext(QuoteContext);
  if (!ctx) {
    throw new Error('useQuote must be used within a QuoteProvider');
  }
  return ctx;
}
