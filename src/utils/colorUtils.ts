import { Theme } from '@mui/material/styles';
import { NavColor } from '../types/theme';

/**
 * Get background color based on color theme and mode
 */
export const getBackgroundColor = (color: NavColor, theme: Theme): string => {
  const isDarkMode = theme.palette.mode === 'dark';
  
  switch (color) {
    case 'vibrant':
      return theme.palette.secondary.main;
    case 'green':
      return theme.palette.success.main;
    case 'orange':
      return theme.palette.warning.main;
    case 'purple':
      return '#7F3DFF';
    case 'pink':
      return '#FF4B91';
    case 'teal':
      return theme.palette.info.main;
    case 'red':
      return theme.palette.error.main;
    default:
      return isDarkMode ? theme.palette.primary.main : '#ffffff';
  }
};

/**
 * Get text color based on color theme and mode
 */
export const getTextColor = (color: NavColor, theme: Theme): string => {
  const isDarkMode = theme.palette.mode === 'dark';
  
  if (color === 'default') {
    return isDarkMode ? '#ffffff' : '#1e1e2d';
  }
  
  return '#ffffff';
};

/**
 * Get icon color based on color theme and mode
 */
export const getIconColor = (color: NavColor, theme: Theme): string => {
  const isDarkMode = theme.palette.mode === 'dark';
  
  if (color === 'default') {
    return isDarkMode ? '#ffffff' : '#1e1e2d';
  }
  
  return '#ffffff';
};

/**
 * Get border color based on color theme and mode
 */
export const getBorderColor = (color: NavColor, theme: Theme): string => {
  const isDarkMode = theme.palette.mode === 'dark';
  
  if (color === 'default') {
    return isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)';
  }
  
  return 'rgba(255,255,255,0.1)';
};

/**
 * Get hover background color based on color theme and mode
 */
export const getHoverBackgroundColor = (color: NavColor, theme: Theme): string => {
  const isDarkMode = theme.palette.mode === 'dark';
  
  switch (color) {
    case 'vibrant':
      return theme.palette.secondary.dark;
    case 'green':
      return theme.palette.success.dark;
    case 'orange':
      return theme.palette.warning.dark;
    default:
      return isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)';
  }
};

/**
 * Get active background color based on color theme and mode
 */
export const getActiveBackgroundColor = (color: NavColor, theme: Theme): string => {
  const isDarkMode = theme.palette.mode === 'dark';
  
  if (color === 'default') {
    return isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  }
  
  return 'rgba(255,255,255,0.2)';
};

/**
 * Get color options for theme customizer
 */
export const getColorOptions = (themeMode: 'light' | 'dark' | 'system'): Array<{
  label: string;
  value: NavColor;
  bgColor: string;
  textColor: string;
  hoverColor: string;
}> => {
  return [
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
}; 