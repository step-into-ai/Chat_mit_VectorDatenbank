import React, { createContext, useContext, useMemo, useState } from 'react';

export type ColorMode = 'light' | 'dark';

interface ColorModeContextValue {
  theme: ColorMode;
  toggleColorMode: () => void;
}

const STORAGE_KEY = 'vectorchat:color-mode';

const ColorModeContext = createContext<ColorModeContextValue | undefined>(undefined);

interface ColorModeProviderProps {
  children: (value: ColorModeContextValue) => React.ReactNode;
}

export const ColorModeProvider: React.FC<ColorModeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<ColorMode>(() => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem(STORAGE_KEY) as ColorMode | null;
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  });

  const contextValue = useMemo<ColorModeContextValue>(
    () => ({
      theme: mode,
      toggleColorMode: () =>
        setMode((prev) => {
          const next = prev === 'light' ? 'dark' : 'light';
          window.localStorage.setItem(STORAGE_KEY, next);
          return next;
        })
    }),
    [mode]
  );

  return <ColorModeContext.Provider value={contextValue}>{children(contextValue)}</ColorModeContext.Provider>;
};

export const useColorMode = (): ColorModeContextValue => {
  const context = useContext(ColorModeContext);
  if (!context) {
    throw new Error('useColorMode muss innerhalb des ColorModeProvider verwendet werden.');
  }
  return context;
};
