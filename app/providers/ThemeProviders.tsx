import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';


type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: 'light' | 'dark';
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}


const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  mode: 'system',
  setMode: () => {},
});


interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('system');

  
  const colorScheme = Appearance.getColorScheme() as ColorSchemeName;


  const resolvedTheme = mode === 'system' ? colorScheme : mode;


  return (
    <ThemeContext.Provider
      value={{
        theme: (resolvedTheme as 'light' | 'dark') ?? 'light', 
        mode,
        setMode, 
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};


export const useTheme = () => useContext(ThemeContext);