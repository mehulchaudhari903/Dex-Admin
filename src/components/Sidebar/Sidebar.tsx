import React, { useState } from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  ListItemButton, 
  Box, 
  useTheme,
  Typography,
  Collapse
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { NavColor } from '../../types/theme';
import { getBackgroundColor, getTextColor, getIconColor, getHoverBackgroundColor, getActiveBackgroundColor } from '../../utils/colorUtils';
import { useNavigate, useLocation } from 'react-router-dom';

interface MenuItem {
  text: string;
  icon: React.ReactNode;
  active?: boolean;
  hasSubmenu?: boolean;
  isPro?: boolean;
  path?: string;
  submenuItems?: MenuItem[];
}

interface SidebarProps {
  sidebarColor: NavColor;
  isOpen: boolean;
  isMobile: boolean;
  mobileOpen: boolean;
  drawerWidth: number;
  menuItems: MenuItem[];
  onDrawerToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  sidebarColor,
  isOpen,
  isMobile,
  mobileOpen,
  drawerWidth,
  menuItems,
  onDrawerToggle
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);

  const backgroundColor = getBackgroundColor(sidebarColor, theme);
  const textColor = getTextColor(sidebarColor, theme);
  const iconColor = getIconColor(sidebarColor, theme);
  const hoverBackgroundColor = getHoverBackgroundColor(sidebarColor, theme);
  const activeBackgroundColor = getActiveBackgroundColor(sidebarColor, theme);

  const handleSubmenuClick = (index: number) => {
    setOpenSubmenu(openSubmenu === index ? null : index);
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.hasSubmenu) {
      const index = menuItems.findIndex(i => i.text === item.text);
      handleSubmenuClick(index);
    } else if (item.path) {
      navigate(item.path);
      if (isMobile) {
        onDrawerToggle();
      }
    }
  };

  const isItemActive = (item: MenuItem): boolean => {
    if (item.path && location.pathname === item.path) {
      return true;
    }
    
    if (item.submenuItems && item.submenuItems.length > 0) {
      return item.submenuItems.some(subItem => 
        subItem.path && location.pathname === subItem.path
      );
    }
    
    return false;
  };

  const drawer = (
    <Box
      sx={{
        height: '100%',
        backgroundColor,
        color: textColor,
        transition: 'background-color 0.3s ease, color 0.3s ease',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box 
        sx={{ 
          height: '70px',
          p: '0 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          borderBottom: '1px solid',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          flexShrink: 0
        }}
      >
        <Box
          component="img"
          src="/logo.png"
          alt="Dex Admin Logo"
          sx={{
            width: 32,
            height: 32,
            objectFit: 'contain',
            filter: sidebarColor === 'default' 
              ? (theme.palette.mode === 'dark' ? 'brightness(0) invert(1)' : 'none')
              : 'brightness(0) invert(1)'
          }}
        />
        {isOpen && (
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 700,
              fontSize: '1.25rem',
              letterSpacing: '-0.025em',
              color: textColor,
              opacity: 0.9
            }}
          >
            Dex Admin
          </Typography>
        )}
      </Box>

      <List
        sx={{
          flex: 1,
          overflow: 'hidden',
          '&:hover': {
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              width: '4px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: 'rgba(255, 255, 255, 0.3)',
            },
          }
        }}
      >
        {menuItems.map((item: MenuItem, index: number) => (
          <React.Fragment key={index}>
            <ListItem
              disablePadding
              sx={{
                display: 'block',
                mb: 1
              }}
            >
              <ListItemButton
                onClick={() => handleItemClick(item)}
                selected={isItemActive(item)}
                sx={{
                  minHeight: 48,
                  justifyContent: isOpen ? 'initial' : 'center',
                  px: 2.5,
                  '&:hover': {
                    backgroundColor: hoverBackgroundColor,
                  },
                  '&.Mui-selected': {
                    backgroundColor: activeBackgroundColor,
                  },
                }}
              >
                <ListItemIcon sx={{ 
                  color: iconColor,
                  minWidth: '36px',
                  justifyContent: 'center',
                }}>
                  {item.icon}
                </ListItemIcon>
                {isOpen && (
                  <>
                    <ListItemText 
                      primary={item.text}
                      sx={{
                        opacity: 1,
                        '& .MuiTypography-root': {
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          color: textColor,
                          opacity: 0.9
                        }
                      }}
                    />
                    {item.hasSubmenu && (
                      <ExpandLess sx={{ 
                        color: iconColor,
                        opacity: 0.8,
                        transform: openSubmenu === index ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s ease'
                      }} />
                    )}
                    {item.isPro && (
                      <Box
                        sx={{
                          ml: 1,
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          fontSize: '0.75rem',
                          color: '#ffffff',
                          opacity: 0.9
                        }}
                      >
                        PRO
                      </Box>
                    )}
                  </>
                )}
              </ListItemButton>
            </ListItem>
            {item.hasSubmenu && item.submenuItems && (
              <Collapse in={openSubmenu === index} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.submenuItems.map((subItem: MenuItem, subIndex: number) => (
                    <ListItemButton
                      key={subIndex}
                      onClick={() => {
                        if (subItem.path) {
                          navigate(subItem.path);
                          if (isMobile) {
                            onDrawerToggle();
                          }
                        }
                      }}
                      selected={subItem.path === location.pathname}
                      sx={{ 
                        pl: isOpen ? 4 : 2,
                        color: textColor,
                        opacity: 0.8,
                        justifyContent: isOpen ? 'initial' : 'center',
                        '&:hover': {
                          backgroundColor: hoverBackgroundColor,
                        },
                        '&.Mui-selected': {
                          backgroundColor: activeBackgroundColor,
                        }
                      }}
                    >
                      {subItem.icon && (
                        <ListItemIcon sx={{ 
                          color: iconColor,
                          minWidth: '36px',
                          justifyContent: 'center',
                        }}>
                          {subItem.icon}
                        </ListItemIcon>
                      )}
                      {isOpen && <ListItemText primary={subItem.text} />}
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={isMobile ? mobileOpen : isOpen}
      onClose={onDrawerToggle}
      sx={{
        width: isOpen ? drawerWidth : 70,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: isOpen ? drawerWidth : 70,
          boxSizing: 'border-box',
          backgroundColor,
          color: textColor,
          borderRight: 'none',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          '& .MuiListItem-root': {
            color: textColor,
            '&:hover': {
              backgroundColor: hoverBackgroundColor,
            },
            '&.Mui-selected': {
              backgroundColor: activeBackgroundColor,
            },
          },
          '& .MuiListItemIcon-root': {
            color: iconColor,
          },
        },
      }}
    >
      {drawer}
    </Drawer>
  );
};

export default Sidebar; 