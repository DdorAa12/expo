// contexts/ClipboardContext.tsx
import React, { createContext, useContext } from 'react';
import * as Clipboard from 'expo-clipboard';

type ClipboardContextType = {
  copy: (text: string) => Promise<void>;
  paste: () => Promise<string>;
};

const ClipboardContext = createContext<ClipboardContextType | undefined>(undefined);

export const ClipboardProvider = ({ children }: { children: React.ReactNode }) => {
  const copy = async (text: string) => {
    await Clipboard.setStringAsync(text);
  };

  const paste = async () => {
    const text = await Clipboard.getStringAsync();
    return text;
  };

  return (
    <ClipboardContext.Provider value={{ copy, paste }}>
      {children}
    </ClipboardContext.Provider>
  );
};

export const useClipboard = (): ClipboardContextType => {
  const context = useContext(ClipboardContext);
  if (!context) {
    throw new Error('useClipboard must be used within a ClipboardProvider');
  }
  return context;
};
