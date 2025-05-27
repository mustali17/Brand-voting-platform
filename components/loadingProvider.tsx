// components/LoadingProvider.tsx
'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { usePathname } from 'next/navigation';

const LoadingContext = createContext<{ loading: boolean }>({ loading: false });

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setLoading(true);

    // Fake small delay to show loader; remove or tweak as needed
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 300); // Change this if needed

    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <LoadingContext.Provider value={{ loading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useRouteLoading() {
  return useContext(LoadingContext);
}
