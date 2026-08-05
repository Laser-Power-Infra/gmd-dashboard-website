'use client';

import { useQuote } from './QuoteProvider';
import GetQuoteModal from './GetQuoteModal';

export default function QuoteModalHost() {
  const { isQuoteOpen, closeQuote } = useQuote();
  return <GetQuoteModal isOpen={isQuoteOpen} onClose={closeQuote} />;
}
