import React, { useEffect } from 'react';
import {
  LightMode,
  DarkMode,
  SettingsSystemDaydreamRounded,
  Close as CloseIcon,
  RestartAlt as ResetIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import OptionGroup from './OptionGroup';
import Option from './Option';
import NavPreview from './NavPreview';

type NavColor = 'default' | 'vibrant' | 'green' | 'orange' | 'purple' | 'pink' | 'teal' | 'red';

interface ColorOption {
  label: string;
  value: NavColor;
  bgColor: string;
  textColor: string;
  hoverColor: string;
}

interface ThemeCustomizerProps {
  open: boolean;
  onClose: () => void;
  themeMode: 'light' | 'dark' | 'system';
  navColor: NavColor;
  sidebarColor: NavColor;
  buttonColor: NavColor;
  onThemeModeChange: (mode: 'light' | 'dark' | 'system') => void;
  onNavColorChange: (color: NavColor) => void;
  onSidebarColorChange: (color: NavColor) => void;
  onButtonColorChange: (color: NavColor) => void;
  onReset: () => void;
}

// Constants for localStorage keys
const STORAGE_KEYS = {
  THEME_MODE: 'dex-admin-theme-mode',
  NAV_COLOR: 'dex-admin-nav-color',
  SIDEBAR_COLOR: 'dex-admin-sidebar-color',
  BUTTON_COLOR: 'dex-admin-button-color'
};

const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({
  open,
  onClose,
  themeMode,
  navColor,
  sidebarColor,
  buttonColor,
  onThemeModeChange,
  onNavColorChange,
  onSidebarColorChange,
  onButtonColorChange,
  onReset
}) => {
  // Load saved preferences from localStorage on component mount
  useEffect(() => {
    const savedThemeMode = localStorage.getItem(STORAGE_KEYS.THEME_MODE) as 'light' | 'dark' | 'system' | null;
    const savedNavColor = localStorage.getItem(STORAGE_KEYS.NAV_COLOR) as NavColor | null;
    const savedSidebarColor = localStorage.getItem(STORAGE_KEYS.SIDEBAR_COLOR) as NavColor | null;
    const savedButtonColor = localStorage.getItem(STORAGE_KEYS.BUTTON_COLOR) as NavColor | null;
    
    if (savedThemeMode && savedThemeMode !== themeMode) {
      onThemeModeChange(savedThemeMode);
    }
    
    if (savedNavColor && savedNavColor !== navColor) {
      onNavColorChange(savedNavColor);
    }
    
    if (savedSidebarColor && savedSidebarColor !== sidebarColor) {
      onSidebarColorChange(savedSidebarColor);
    }
    
    if (savedButtonColor && savedButtonColor !== buttonColor) {
      onButtonColorChange(savedButtonColor);
    }
  }, []);
  
  // Wrapper functions to save preferences to localStorage when changed
  const handleThemeModeChange = (mode: 'light' | 'dark' | 'system') => {
    localStorage.setItem(STORAGE_KEYS.THEME_MODE, mode);
    onThemeModeChange(mode);
  };
  
  const handleNavColorChange = (color: NavColor) => {
    localStorage.setItem(STORAGE_KEYS.NAV_COLOR, color);
    onNavColorChange(color);
  };
  
  const handleSidebarColorChange = (color: NavColor) => {
    localStorage.setItem(STORAGE_KEYS.SIDEBAR_COLOR, color);
    onSidebarColorChange(color);
  };
  
  const handleButtonColorChange = (color: NavColor) => {
    localStorage.setItem(STORAGE_KEYS.BUTTON_COLOR, color);
    onButtonColorChange(color);
  };
  
  const handleReset = () => {
    // Clear localStorage values
    localStorage.removeItem(STORAGE_KEYS.THEME_MODE);
    localStorage.removeItem(STORAGE_KEYS.NAV_COLOR);
    localStorage.removeItem(STORAGE_KEYS.SIDEBAR_COLOR);
    localStorage.removeItem(STORAGE_KEYS.BUTTON_COLOR);
    onReset();
  };

  if (!open) return null;

  const colorOptions: ColorOption[] = [
    {
      label: 'Default',
      value: 'default',
      bgColor: themeMode === 'dark' ? '#1e1e2d' : '#ffffff',
      textColor: themeMode === 'dark' ? '#ffffff' : '#1e1e2d',
      hoverColor: themeMode === 'dark' ? '#2a2a3c' : '#f5f5f5'
    },
    {
      label: 'Vibrant',
      value: 'vibrant',
      bgColor: '#3699FF',
      textColor: '#ffffff',
      hoverColor: '#1a7ff0'
    },
    {
      label: 'Green',
      value: 'green',
      bgColor: '#00D084',
      textColor: '#ffffff',
      hoverColor: '#00b371'
    },
    {
      label: 'Orange',
      value: 'orange',
      bgColor: '#FF6B00',
      textColor: '#ffffff',
      hoverColor: '#e05e00'
    },
    {
      label: 'Purple',
      value: 'purple',
      bgColor: '#7F3DFF',
      textColor: '#ffffff',
      hoverColor: '#6a28e8'
    },
    {
      label: 'Pink',
      value: 'pink',
      bgColor: '#FF4B91',
      textColor: '#ffffff',
      hoverColor: '#e63677'
    },
    {
      label: 'Teal',
      value: 'teal',
      bgColor: '#00B4B4',
      textColor: '#ffffff',
      hoverColor: '#009999'
    },
    {
      label: 'Red',
      value: 'red',
      bgColor: '#FF3366',
      textColor: '#ffffff',
      hoverColor: '#e61a4d'
    }
  ];

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard'
    },
    {
      text: 'Settings',
      icon: <SettingsIcon />,
      hasSubmenu: true,
      submenuItems: [
        {
          text: 'Profile',
          path: '/settings/profile'
        },
        {
          text: 'Security',
          path: '/settings/security'
        }
      ]
    }
  ];

  return (
    <div className={`
      fixed right-0 top-0 h-screen w-80 z-50 shadow-xl flex flex-col
      transition-colors duration-300
      ${themeMode === 'light' 
        ? 'bg-white border-l border-gray-200' 
        : 'bg-gray-800 border-l border-gray-700'}
    `}>
      <div className={`
        p-4 flex items-center justify-between border-b
        ${themeMode === 'light' ? 'border-gray-200' : 'border-gray-700'}
      `}>
        <div className="flex items-center gap-2">
          <h2 className={`
            text-lg font-semibold
            ${themeMode === 'light' ? 'text-gray-900' : 'text-white'}
          `}>
            Customize
          </h2>
        </div>
        <button
          onClick={onClose}
          className={`
            inline-flex items-center justify-center
            p-1.5 rounded-lg
            ${themeMode === 'light' 
              ? 'text-gray-500 hover:text-gray-700 hover:bg-gray-100' 
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'}
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500/40
          `}
        >
          <CloseIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        <OptionGroup title="Theme Mode">
          <div className="grid grid-cols-3 gap-3">
            <Option
              icon={<LightMode className={`${themeMode === 'light' ? 'text-amber-500' : ''}`} />}
              label="Light"
              active={themeMode === 'light'}
              onClick={() => handleThemeModeChange('light')}
              className={`
                ${themeMode === 'light' 
                  ? 'bg-amber-50 border-amber-500 text-amber-700 dark:bg-amber-900/20 ' 
                  : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200'}
                ${themeMode === 'light'
                  ? 'hover:bg-amber-200 dark:hover:bg-amber-900/50 hover:shadow-md hover:text-amber-900 dark:hover:text-amber-200'
                  : 'hover:bg-amber-100 dark:hover:bg-amber-900/30 hover:border-amber-400 dark:hover:border-amber-600 hover:text-amber-900 dark:hover:text-amber-200 hover:shadow-sm'}
                transition-all duration-300 ease-in-out
                hover:-translate-y-[1px] hover:font-medium
              `}
            />
            <Option
              icon={<DarkMode className={`${themeMode === 'dark' ? 'text-indigo-500' : ''}`} />}
              label="Dark"
              active={themeMode === 'dark'}
              onClick={() => handleThemeModeChange('dark')}
              className={`
                ${themeMode === 'dark' 
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300' 
                  : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200'}
                ${themeMode === 'dark'
                  ? 'hover:bg-indigo-300 dark:hover:bg-indigo-800/70 hover:shadow-lg hover:border-indigo-600 hover:text-indigo-900 dark:hover:text-indigo-100'
                  : 'hover:bg-indigo-200 dark:hover:bg-indigo-900/50 hover:border-indigo-500 dark:hover:border-indigo-500 hover:text-indigo-900 dark:hover:text-indigo-100 hover:shadow-md'}
                transition-all duration-300 ease-in-out
                hover:-translate-y-[2px] hover:font-medium
              `}
            />
            <Option
              icon={<SettingsSystemDaydreamRounded className={`${themeMode === 'system' ? 'text-cyan-500' : ''}`} />}
              label="System"
              active={themeMode === 'system'}
              onClick={() => handleThemeModeChange('system')}
              className={`
                ${themeMode === 'system' 
                  ? 'bg-cyan-50 border-cyan-500 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-300' 
                  : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200'}
                ${themeMode === 'system'
                  ? 'hover:bg-cyan-200 dark:hover:bg-cyan-900/50 hover:shadow-md hover:text-cyan-900 dark:hover:text-cyan-100'
                  : 'hover:bg-cyan-100 dark:hover:bg-cyan-900/30 hover:border-cyan-400 dark:hover:border-cyan-600 hover:text-cyan-900 dark:hover:text-cyan-100 hover:shadow-sm'}
                transition-all duration-300 ease-in-out
                hover:-translate-y-[1px] hover:font-medium
              `}
            />
          </div>
          
        </OptionGroup>

        <OptionGroup title={`Nav Colors`} titleClassName={themeMode === 'light' ? 'text-gray-900' : 'text-white'}>
          <div className="grid grid-cols-4 gap-2 mb-2">
            {colorOptions.slice(0, 4).map((option) => (
              <div
                key={option.value}
                onClick={() => onNavColorChange(option.value)}
                className={`
                  cursor-pointer rounded-lg overflow-hidden border
                  ${navColor === option.value 
                    ? 'ring-2 ring-blue-500 ring-offset-2 ' + (themeMode === 'light' ? 'ring-offset-white' : 'ring-offset-gray-800')
                    : 'border-gray-200 ' + (themeMode === 'light' ? 'hover:border-gray-300' : 'border-gray-700 hover:border-gray-600')}
                  transition-all duration-200 ease-in-out
                  hover:-translate-y-0.5 hover:shadow-md
                  flex flex-col
                `}
                style={{
                  backgroundColor: option.value === 'default' 
                    ? (themeMode === 'light' ? '#ffffff' : '#1e1e2d')
                    : option.bgColor
                }}
              >
                <div className="h-12 flex items-center justify-center">
                  <span className="text-xs font-medium"
                    style={{
                      color: option.value === 'default' 
                        ? (themeMode === 'light' ? '#1e1e2d' : '#ffffff')
                        : option.textColor
                    }}
                  >
                    {option.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {colorOptions.slice(4).map((option) => (
              <div
                key={option.value}
                onClick={() => onNavColorChange(option.value)}
                className={`
                  cursor-pointer rounded-lg overflow-hidden border
                  ${navColor === option.value 
                    ? 'ring-2 ring-blue-500 ring-offset-2 ' + (themeMode === 'light' ? 'ring-offset-white' : 'ring-offset-gray-800')
                    : 'border-gray-200 ' + (themeMode === 'light' ? 'hover:border-gray-300' : 'border-gray-700 hover:border-gray-600')}
                  transition-all duration-200 ease-in-out
                  hover:-translate-y-0.5 hover:shadow-md
                  flex flex-col
                `}
                style={{
                  backgroundColor: option.value === 'default' 
                    ? (themeMode === 'light' ? '#ffffff' : '#1e1e2d')
                    : option.bgColor
                }}
              >
                <div className="h-12 flex items-center justify-center">
                  <span className="text-xs font-medium"
                    style={{
                      color: option.value === 'default' 
                        ? (themeMode === 'light' ? '#1e1e2d' : '#ffffff')
                        : option.textColor
                    }}
                  >
                    {option.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </OptionGroup>

        <OptionGroup title={`Sidebar Colors`} titleClassName={themeMode === 'light' ? 'text-gray-900' : 'text-white'}>
          <div className="grid grid-cols-4 gap-2 mb-2">
            {colorOptions.slice(0, 4).map((option) => (
              <div
                key={option.value}
                onClick={() => handleSidebarColorChange(option.value)}
                className={`
                  cursor-pointer rounded-lg overflow-hidden border
                  ${sidebarColor === option.value 
                    ? 'ring-2 ring-blue-500 ring-offset-2 ' + (themeMode === 'light' ? 'ring-offset-white' : 'ring-offset-gray-800')
                    : 'border-gray-200 ' + (themeMode === 'light' ? 'hover:border-gray-300' : 'border-gray-700 hover:border-gray-600')}
                  transition-all duration-200 ease-in-out
                  hover:-translate-y-0.5 hover:shadow-md
                  flex flex-col
                `}
                style={{
                  backgroundColor: option.value === 'default' 
                    ? (themeMode === 'light' ? '#ffffff' : '#1e1e2d')
                    : option.bgColor
                }}
              >
                <div className="h-12 flex items-center justify-center">
                  <span className="text-xs font-medium"
                    style={{
                      color: option.value === 'default' 
                        ? (themeMode === 'light' ? '#1e1e2d' : '#ffffff')
                        : option.textColor
                    }}
                  >
                    {option.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {colorOptions.slice(4).map((option) => (
              <div
                key={option.value}
                onClick={() => onSidebarColorChange(option.value)}
                className={`
                  cursor-pointer rounded-lg overflow-hidden border
                  ${sidebarColor === option.value 
                    ? 'ring-2 ring-blue-500 ring-offset-2 ' + (themeMode === 'light' ? 'ring-offset-white' : 'ring-offset-gray-800')
                    : 'border-gray-200 ' + (themeMode === 'light' ? 'hover:border-gray-300' : 'border-gray-700 hover:border-gray-600')}
                  transition-all duration-200 ease-in-out
                  hover:-translate-y-0.5 hover:shadow-md
                  flex flex-col
                `}
                style={{
                  backgroundColor: option.value === 'default' 
                    ? (themeMode === 'light' ? '#ffffff' : '#1e1e2d')
                    : option.bgColor
                }}
              >
                <div className="h-12 flex items-center justify-center">
                  <span className="text-xs font-medium"
                    style={{
                      color: option.value === 'default' 
                        ? (themeMode === 'light' ? '#1e1e2d' : '#ffffff')
                        : option.textColor
                    }}
                  >
                    {option.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </OptionGroup>

        <OptionGroup title="Button Colors" titleClassName={themeMode === 'light' ? 'text-gray-900' : 'text-white'}>
          <div className="grid grid-cols-4 gap-2 mb-2">
            {colorOptions.slice(0, 4).map((option) => (
              <div
                key={option.value}
                onClick={() => handleButtonColorChange(option.value)}
                className={`
                  cursor-pointer rounded-lg overflow-hidden border
                  ${buttonColor === option.value 
                    ? 'ring-2 ring-blue-500 ring-offset-2 ' + (themeMode === 'light' ? 'ring-offset-white' : 'ring-offset-gray-800')
                    : 'border-gray-200 ' + (themeMode === 'light' ? 'hover:border-gray-300' : 'border-gray-700 hover:border-gray-600')}
                  transition-all duration-200 ease-in-out
                  hover:-translate-y-0.5 hover:shadow-md
                  flex flex-col
                `}
                style={{
                  backgroundColor: option.value === 'default' 
                    ? (themeMode === 'light' ? '#ffffff' : '#1e1e2d')
                    : option.bgColor
                }}
              >
                <div className="h-12 flex items-center justify-center">
                  <span className="text-xs font-medium"
                    style={{
                      color: option.value === 'default' 
                        ? (themeMode === 'light' ? '#1e1e2d' : '#ffffff')
                        : option.textColor
                    }}
                  >
                    {option.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {colorOptions.slice(4).map((option) => (
              <div
                key={option.value}
                onClick={() => handleButtonColorChange(option.value)}
                className={`
                  cursor-pointer rounded-lg overflow-hidden border
                  ${buttonColor === option.value 
                    ? 'ring-2 ring-blue-500 ring-offset-2 ' + (themeMode === 'light' ? 'ring-offset-white' : 'ring-offset-gray-800')
                    : 'border-gray-200 ' + (themeMode === 'light' ? 'hover:border-gray-300' : 'border-gray-700 hover:border-gray-600')}
                  transition-all duration-200 ease-in-out
                  hover:-translate-y-0.5 hover:shadow-md
                  flex flex-col
                `}
                style={{
                  backgroundColor: option.value === 'default' 
                    ? (themeMode === 'light' ? '#ffffff' : '#1e1e2d')
                    : option.bgColor
                }}
              >
                <div className="h-12 flex items-center justify-center">
                  <span className="text-xs font-medium"
                    style={{
                      color: option.value === 'default' 
                        ? (themeMode === 'light' ? '#1e1e2d' : '#ffffff')
                        : option.textColor
                    }}
                  >
                    {option.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </OptionGroup>

      
      </div>

      <div className={`
        p-4 border-t space-y-3
        ${themeMode === 'light' ? 'border-gray-200' : 'border-gray-700'}
      `}>
        <button
          onClick={handleReset}
          className={`
            w-full inline-flex items-center justify-center gap-2
            px-4 py-2.5 rounded-lg
            border-2 
            ${themeMode === 'light' 
              ? 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100' 
              : 'border-gray-600 text-gray-300 bg-gray-800 hover:bg-gray-700 hover:border-gray-500 active:bg-gray-600'}
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-gray-500/40
            group
          `}
        >
          <ResetIcon className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity" />
          <span className="font-medium">Reset Customizer</span>
        </button>
        <button
          onClick={onClose}
          className={`
            w-full inline-flex items-center justify-center gap-2
            px-4 py-2.5 rounded-lg
            ${themeMode === 'light' 
              ? 'bg-gray-900 hover:bg-gray-800 active:bg-gray-950' 
              : 'bg-gray-700 hover:bg-gray-600 active:bg-gray-800'}
            text-white
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-gray-500/40
            group
          `}
        >
          <CloseIcon className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity" />
          <span className="font-medium">Close Customizer</span>
        </button>
      </div>
    </div>
  );
};

export default ThemeCustomizer;