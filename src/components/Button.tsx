import React, { useEffect, useState } from 'react';
import { Button as MuiButton, ButtonProps, useTheme } from '@mui/material';
import { useTheme as useCustomTheme } from '../contexts/ThemeContext';

type ButtonColor = 'default' | 'vibrant' | 'green' | 'orange' | 'purple' | 'pink' | 'teal' | 'red';

interface CustomButtonProps extends ButtonProps {
  variant?: 'text' | 'contained' | 'outlined';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

const Button: React.FC<CustomButtonProps> = ({
  variant = 'contained',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  onClick,
  children,
  ...props
}) => {
  const theme = useTheme();
  const { buttonColor, themeMode } = useCustomTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [currentColor, setCurrentColor] = useState<ButtonColor>(buttonColor as ButtonColor);
  // Update color when buttonColor changes
  useEffect(() => {
    setCurrentColor(buttonColor as ButtonColor);
  }, [buttonColor]);

  const getButtonBackground = () => {
    switch (currentColor) {
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
        return isDarkMode ? '#ffffff' : '#1e1e2d';
    }
  };

  const getButtonTextColor = () => {
    if (variant === 'contained') {
      return isDarkMode ? '#1e1e2d' : '#ffffff';
    }
    return getButtonBackground();
  };


  const getHoverBackground = () => {
    if (variant === 'contained') {
      return getButtonBackground();
    }
    return 'transparent';
  };

  const buttonStyle = {
    textTransform: 'none' as const,
    backgroundColor: variant === 'contained' ? getButtonBackground() : 'transparent',
    color: getButtonTextColor(),
    border: variant === 'outlined' ? `1px solid ${getButtonBackground()}` : 'none',
    '&:hover': {
      backgroundColor: getHoverBackground(),
      opacity: variant === 'contained' ? 0.9 : 1,
      border: variant === 'outlined' ? `1px solid ${getButtonBackground()}` : 'none',
    },
    '&.Mui-disabled': {
      backgroundColor: variant === 'contained' ? theme.palette.action.disabled : 'transparent',
      color: theme.palette.text.disabled,
      border: variant === 'outlined' ? `1px solid ${theme.palette.action.disabled}` : 'none',
    },
    transition: 'all 0.2s ease-in-out',
  };

  return (
    <MuiButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled}
      onClick={onClick}
      sx={buttonStyle}
      {...props}
    >
      {children}
    </MuiButton>
  );
};

export default Button; 