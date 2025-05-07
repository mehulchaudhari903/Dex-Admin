import React, { createContext, useState, useEffect, useContext } from 'react';

type NavColor = 'default' | 'vibrant' | 'green' | 'orange' | 'purple' | 'pink' | 'teal' | 'red';
type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeContextType {
  themeMode: ThemeMode;
  navColor: NavColor;
  sidebarColor: NavColor;
  buttonColor: NavColor;
  setThemeMode: (mode: ThemeMode) => void;
  setNavColor: (color: NavColor) => void;
  setSidebarColor: (color: NavColor) => void;
  setButtonColor: (color: NavColor) => void;
  resetTheme: () => void;
}

// Constants for localStorage keys
const STORAGE_KEYS = {
  THEME_MODE: 'dex-admin-theme-mode',
  NAV_COLOR: 'dex-admin-nav-color',
  SIDEBAR_COLOR: 'dex-admin-sidebar-color',
  BUTTON_COLOR: 'dex-admin-button-color'
};

// Default theme values
const DEFAULT_THEME = {
  themeMode: 'light' as ThemeMode,
  navColor: 'default' as NavColor,
  sidebarColor: 'default' as NavColor,
  buttonColor: 'default' as NavColor
};

export const ThemeContext = createContext<ThemeContextType>({
  themeMode: DEFAULT_THEME.themeMode,
  navColor: DEFAULT_THEME.navColor,
  sidebarColor: DEFAULT_THEME.sidebarColor,
  buttonColor: DEFAULT_THEME.buttonColor,
  setThemeMode: () => {},
  setNavColor: () => {},
  setSidebarColor: () => {},
  setButtonColor: () => {},
  resetTheme: () => {}
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state with localStorage values
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    const savedMode = localStorage.getItem(STORAGE_KEYS.THEME_MODE) as ThemeMode;
    return savedMode || DEFAULT_THEME.themeMode;
  });

  const [navColor, setNavColorState] = useState<NavColor>(() => {
    const savedColor = localStorage.getItem(STORAGE_KEYS.NAV_COLOR) as NavColor;
    return savedColor || DEFAULT_THEME.navColor;
  });

  const [sidebarColor, setSidebarColorState] = useState<NavColor>(() => {
    const savedColor = localStorage.getItem(STORAGE_KEYS.SIDEBAR_COLOR) as NavColor;
    return savedColor || DEFAULT_THEME.sidebarColor;
  });

  const [buttonColor, setButtonColorState] = useState<NavColor>(() => {
    const savedColor = localStorage.getItem(STORAGE_KEYS.BUTTON_COLOR) as NavColor;
    return savedColor || DEFAULT_THEME.buttonColor;
  });

  // Apply theme mode changes
  useEffect(() => {
    if (themeMode === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', prefersDark);
    } else {
      document.documentElement.classList.toggle('dark', themeMode === 'dark');
    }
  }, [themeMode]);

  // Listen for system theme changes
  useEffect(() => {
    if (themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e: MediaQueryListEvent) => {
        document.documentElement.classList.toggle('dark', e.matches);
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [themeMode]);

  // Load saved preferences from localStorage on mount
  useEffect(() => {
    const loadSavedPreferences = () => {
      const savedThemeMode = localStorage.getItem(STORAGE_KEYS.THEME_MODE) as ThemeMode;
      const savedNavColor = localStorage.getItem(STORAGE_KEYS.NAV_COLOR) as NavColor;
      const savedSidebarColor = localStorage.getItem(STORAGE_KEYS.SIDEBAR_COLOR) as NavColor;
      const savedButtonColor = localStorage.getItem(STORAGE_KEYS.BUTTON_COLOR) as NavColor;
      
      if (savedThemeMode && savedThemeMode !== themeMode) {
        setThemeModeState(savedThemeMode);
      }
      
      if (savedNavColor && savedNavColor !== navColor) {
        setNavColorState(savedNavColor);
      }
      
      if (savedSidebarColor && savedSidebarColor !== sidebarColor) {
        setSidebarColorState(savedSidebarColor);
      }
      
      if (savedButtonColor && savedButtonColor !== buttonColor) {
        setButtonColorState(savedButtonColor);
        // Force immediate update of button colors
        requestAnimationFrame(() => {
          document.documentElement.style.setProperty('--button-color-update', Date.now().toString());
        });
      }
    };

    loadSavedPreferences();
  }, []);

  const setThemeMode = (mode: ThemeMode) => {
    localStorage.setItem(STORAGE_KEYS.THEME_MODE, mode);
    setThemeModeState(mode);
  };

  const setNavColor = (color: NavColor) => {
    localStorage.setItem(STORAGE_KEYS.NAV_COLOR, color);
    setNavColorState(color);
  };

  const setSidebarColor = (color: NavColor) => {
    localStorage.setItem(STORAGE_KEYS.SIDEBAR_COLOR, color);
    setSidebarColorState(color);
  };

  const setButtonColor = (color: NavColor) => {
    // console.log('Setting button color to:', color);
    localStorage.setItem(STORAGE_KEYS.BUTTON_COLOR, color);
    setButtonColorState(color);
    // Force immediate update
    requestAnimationFrame(() => {
      document.documentElement.style.setProperty('--button-color-update', Date.now().toString());
    });
  };

  const resetTheme = () => {
    localStorage.removeItem(STORAGE_KEYS.THEME_MODE);
    localStorage.removeItem(STORAGE_KEYS.NAV_COLOR);
    localStorage.removeItem(STORAGE_KEYS.SIDEBAR_COLOR);
    localStorage.removeItem(STORAGE_KEYS.BUTTON_COLOR);
    
    setThemeModeState(DEFAULT_THEME.themeMode);
    setNavColorState(DEFAULT_THEME.navColor);
    setSidebarColorState(DEFAULT_THEME.sidebarColor);
    setButtonColorState(DEFAULT_THEME.buttonColor);
  };

  // Log button color changes
  useEffect(() => {
   
  }, [buttonColor]);

  return (
    <ThemeContext.Provider value={{
      themeMode,
      navColor,
      sidebarColor,
      buttonColor,
      setThemeMode,
      setNavColor,
      setSidebarColor,
      setButtonColor,
      resetTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;