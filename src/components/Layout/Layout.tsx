import React, { ReactNode } from 'react';
import { Box, CssBaseline, ThemeProvider as MuiThemeProvider, createTheme, Fab, Tooltip, useMediaQuery } from '@mui/material';
import { Toolbar } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ThemeCustomizer from '../ThemeCustomizer/ThemeCustomizer';
import Sidebar from '../Sidebar/Sidebar';
import Navbar from '../Navbar/Navbar';
import { NavColor } from '../../types/theme';
import { useTheme } from '../../contexts/ThemeContext';

// Create a default theme for useMediaQuery
const defaultTheme = createTheme();
const drawerWidth = 260;

interface LayoutProps {
  children?: ReactNode;
  menuItems: Array<{
    text: string;
    icon: React.ReactNode;
    active: boolean;
    hasSubmenu: boolean;
    isPro: boolean;
  }>;
}

function Layout({ children, menuItems }: LayoutProps) {
  const [isOpen, setIsOpen] = React.useState(true);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [showCustomize, setShowCustomize] = React.useState(false);
  const { 
    themeMode, 
    navColor, 
    sidebarColor, 
    buttonColor,
    setThemeMode, 
    setNavColor, 
    setSidebarColor, 
    setButtonColor,
    resetTheme 
  } = useTheme();
  const isMobile = useMediaQuery(defaultTheme.breakpoints.down('sm'));

  const theme = createTheme({
    palette: {
      mode: themeMode === 'system' ? 'light' : themeMode,
      primary: {
        main: '#1e1e2d',
        light: '#2a2a3c',
        dark: '#1a1a27'
      },
      secondary: {
        main: '#3699FF',
        light: '#5BB0FF',
        dark: '#1a7ff0'
      },
      success: {
        main: '#00D084',
        light: '#33D99C',
        dark: '#00b371'
      },
      warning: {
        main: '#FF6B00',
        light: '#FF8A33',
        dark: '#e05e00'
      },
      error: {
        main: '#FF3366',
        light: '#FF5C85',
        dark: '#e61a4d'
      },
      info: {
        main: '#00B4B4',
        light: '#33C2C2',
        dark: '#009999'
      },
      background: {
        default: themeMode === 'dark' ? '#151521' : '#f3f6f9',
        paper: themeMode === 'dark' ? '#1e1e2d' : '#ffffff',
      },
      text: {
        primary: themeMode === 'dark' ? '#ffffff' : '#181c32',
        secondary: themeMode === 'dark' ? '#9899ac' : '#5e6278'
      }
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    }
  });

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setIsOpen(!isOpen);
    }
  };

  const handleResetTheme = () => {
    setThemeMode('light');
    setNavColor('default');
    setSidebarColor('default');
    setButtonColor('default');
    localStorage.removeItem('theme-mode');
    localStorage.removeItem('nav-color');
    localStorage.removeItem('sidebar-color');
    localStorage.removeItem('button-color');
  };

  return (
    <MuiThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        
        <Navbar 
          isOpen={isOpen}
          drawerWidth={drawerWidth}
          onDrawerToggle={handleDrawerToggle}
          navColor={navColor}
        />

        <Sidebar
          isOpen={isOpen}
          isMobile={isMobile}
          mobileOpen={mobileOpen}
          drawerWidth={drawerWidth}
          menuItems={menuItems}
          onDrawerToggle={handleDrawerToggle}
          sidebarColor={sidebarColor}
        />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${isOpen ? drawerWidth : 70}px)` },
            transition: 'width 0.3s ease',
            backgroundColor: theme.palette.background.default,
            position: 'relative'
          }}
        >
          <Toolbar sx={{ minHeight: '70px' }} />
          
          {/* Main Content */}
          {children}

          {/* Customize Button */}
          {showCustomize ? (
            <ThemeCustomizer
              open={showCustomize}
              onClose={() => setShowCustomize(false)}
              themeMode={themeMode}
              navColor={navColor}
              sidebarColor={sidebarColor}
              buttonColor={buttonColor}
              onThemeModeChange={setThemeMode}
              onNavColorChange={setNavColor}
              onSidebarColorChange={setSidebarColor}
              onButtonColorChange={setButtonColor}
              onReset={handleResetTheme}
            />
          ) : (
            <Tooltip title="Customize Theme" placement="left">
              <Fab
                color="primary"
                size="medium"
                onClick={() => setShowCustomize(true)}
                sx={{
                  position: 'fixed',
                  bottom: 16,
                  right: 16,
                  backgroundColor: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  }
                }}
              >
                <EditIcon />
              </Fab>
            </Tooltip>
          )}
        </Box>
      </Box>
    </MuiThemeProvider>
  );
}

export default Layout;