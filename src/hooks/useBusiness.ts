import { useContext } from 'react';
import { BusinessContext } from '../contexts/BusinessContext';

export function useBusiness() {
  const ctx = useContext(BusinessContext);
  if (!ctx) throw new Error('useBusiness deve ser usado dentro de <BusinessProvider>.');
  return ctx;
}
