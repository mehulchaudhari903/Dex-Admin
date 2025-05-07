import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Box, 
  IconButton, 
  Typography, 
  InputBase,
  Menu,
  MenuItem,
  Divider,
  Avatar,
  Badge,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Search, 
  Notifications,
  Person as PersonIcon,
  Mail as MailIcon,
  HelpOutline as HelpIcon,
  Logout as LogoutIcon,
  Circle as CircleIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { NavColor } from '../../types/theme';
import { getBackgroundColor, getTextColor, getBorderColor } from '../../utils/colorUtils';

interface NavbarProps {
  isOpen: boolean;
  drawerWidth: number;
  onDrawerToggle: () => void;
  navColor: NavColor;
}

const Navbar: React.FC<NavbarProps> = ({ isOpen, drawerWidth, onDrawerToggle, navColor }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isDarkMode = theme.palette.mode === 'dark';
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);

  // Add user data
  const userData = {
    name: 'Mehul Chaudhari',
    role: 'Admin',
    image: 'https://img.freepik.com/premium-vector/man-avatar-profile-picture-isolated-background-avatar-profile-picture-man_1293239-4841.jpg?semt=ais_hybrid&w=740' // You can set this to null if no image
  };

  // Temporary notification data
  const notifications = [
    {
      id: 1,
      type: 'info',
      message: 'Welcome to DEX Admin Dashboard',
      time: '2 minutes ago',
      read: false
    },
    {
      id: 2,
      type: 'success',
      message: 'Profile settings updated successfully',
      time: '1 hour ago',
      read: false
    },
    {
      id: 3,
      type: 'warning',
      message: 'Your subscription will expire soon',
      time: '5 hours ago',
      read: true
    },
    {
      id: 4,
      type: 'error',
      message: 'Failed to sync data with server',
      time: '1 day ago',
      read: true
    }
  ];

  const unreadCount = notifications.filter(notification => !notification.read).length;

  // Function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  // Function to get avatar background color based on name
  const getAvatarColor = (name: string) => {
    const colors = [
      '#1E90FF', // Blue
      '#32CD32', // Green
      '#FF69B4', // Pink
      '#FFA500', // Orange
      '#9370DB', // Purple
      '#20B2AA', // Light Sea Green
    ];
    
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const backgroundColor = getBackgroundColor(navColor, theme);
  const textColor = getTextColor(navColor, theme);
  const borderColor = getBorderColor(navColor, theme);

  const getNavbarBackground = () => {
    switch (navColor) {
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

  const getNavbarTextColor = () => {  
    return navColor === 'default' ? theme.palette.text.primary : '#ffffff';
  };

  const getNavbarBorderColor = () => {
    return navColor === 'default'
      ? isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)'
      : 'rgba(255,255,255,0.1)';
  };

  const getHoverBackground = () => {
    switch (navColor) {
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

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'info':
        return theme.palette.info.main;
      case 'success':
        return theme.palette.success.main;
      case 'warning':
        return theme.palette.warning.main;
      case 'error':
        return theme.palette.error.main;
      default:
        return theme.palette.primary.main;
    }
  };

  const menuItems = [
    { icon: <PersonIcon fontSize="small" />, text: 'My Profile', divider: false, link: '/settings/profile' },
    { icon: <MailIcon fontSize="small" />, text: 'Inbox', divider: false, link: '/portfolio/contact' },
    { icon: <HelpIcon fontSize="small" />, text: 'Help & Support', divider: true, link: '/help' },
    { icon: <LogoutIcon fontSize="small" />, text: 'Log out', divider: false, link: '/logout' }
  ];

  const handleMenuItemClick = (link: string) => {
    handleClose();
    if (link === '/logout') {
      // Handle logout logic here
      return;
    }
    navigate(link);
  };

  return (
    <AppBar 
      position="fixed" 
      elevation={0}
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor,
        color: textColor,
        borderBottom: `1px solid ${borderColor}`,
        width: { xs: '100%', sm: `calc(100% - ${isOpen ? drawerWidth : 70}px)` },
        ml: { xs: 0, sm: isOpen ? `${drawerWidth}px` : '70px' },
        transition: 'all 0.3s ease',
        height: '70px'
      }}
    >
      <Toolbar 
        sx={{ 
          minHeight: '70px !important',
          height: '70px',
          px: { xs: 2, sm: 4 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
          <IconButton
            edge="start"
            onClick={onDrawerToggle}
            sx={{ 
              color: navColor === 'default' ? theme.palette.text.secondary : 'rgba(255,255,255,0.7)',
              '&:hover': { 
                color: navColor === 'default' ? theme.palette.text.primary : '#ffffff',
                backgroundColor: navColor === 'default'
                  ? isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)'
                  : 'rgba(255,255,255,0.1)'
              }
            }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ position: 'relative' }}>
            <Search sx={{ 
              position: 'absolute', 
              left: 12, 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: navColor === 'default' ? theme.palette.text.secondary : 'rgba(255,255,255,0.7)',
              fontSize: '1.25rem'
            }} />
            <InputBase
              placeholder="Search..."
              sx={{
                height: '42px',
                border: '1px solid',
                borderColor: navColor === 'default'
                  ? isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)'
                  : 'rgba(255,255,255,0.2)',
                borderRadius: '8px',
                pl: 5,
                pr: 2,
                width: { xs: '145px', sm: '240px' },
                color: getNavbarTextColor(),
                fontSize: '0.875rem',
                backgroundColor: navColor === 'default'
                  ? isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'
                  : 'rgba(255,255,255,0.1)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: navColor === 'default'
                    ? isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'
                    : 'rgba(255,255,255,0.15)',
                  borderColor: navColor === 'default'
                    ? isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.24)'
                    : 'rgba(255,255,255,0.3)',
                },
                '& input': {
                  '&::placeholder': {
                    color: navColor === 'default' ? theme.palette.text.secondary : 'rgba(255,255,255,0.7)',
                    opacity: 0.7
                  }
                },
              }}
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
          <IconButton 
            onClick={handleNotificationClick}
            sx={{ 
              color: navColor === 'default' ? theme.palette.text.secondary : 'rgba(255,255,255,0.7)',
              backgroundColor: navColor === 'default'
                ? isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'
                : 'rgba(255,255,255,0.1)',
              '&:hover': { 
                backgroundColor: navColor === 'default'
                  ? isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)'
                  : 'rgba(255,255,255,0.2)',
                color: navColor === 'default' ? theme.palette.text.primary : '#ffffff'
              }
            }}
          >
            <Badge badgeContent={unreadCount} color="error">
              <Notifications />
            </Badge>
          </IconButton>
          <IconButton 
            onClick={handleProfileClick}
          >
            <Avatar
              src={userData.image}
              sx={{
                height: 40,
                width: 40,
                bgcolor: userData.image ? 'transparent' : getAvatarColor(userData.name),
                color: '#fff',
                fontSize: '0.875rem',
                fontWeight: 500
              }}
            >
              {!userData.image && getInitials(userData.name)}
            </Avatar>
          </IconButton>
        </Box>

        <Menu
          anchorEl={notificationAnchorEl}
          open={Boolean(notificationAnchorEl)}
          onClose={handleNotificationClose}
          onClick={handleNotificationClose}
          PaperProps={{
            sx: {
              position: 'absolute',
              top: '75px !important',
              minWidth: 320,
              maxWidth: '90vw',
              borderRadius: '12px',
              boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
              backgroundColor: isDarkMode ? '#1e1e2d' : '#ffffff'
            }
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ p: 2, pb: 1.5 }}>
            <Typography variant="subtitle1" sx={{ color: isDarkMode ? '#ffffff' : '#0F172A', fontWeight: 500 }}>
              Notifications
            </Typography>
            <Typography variant="body2" sx={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' }}>
              You have {unreadCount} unread notifications
            </Typography>
          </Box>
          <Divider sx={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)' }} />
          {notifications.map((notification) => (
            <MenuItem
              key={notification.id}
              sx={{
                py: 1.5,
                px: 2,
                opacity: notification.read ? 0.7 : 1,
                '&:hover': {
                  backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                },
              }}
            >
              <ListItemIcon>
                <CircleIcon sx={{ fontSize: 8, color: getNotificationColor(notification.type) }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    variant="body2"
                    sx={{
                      color: isDarkMode ? '#ffffff' : '#0F172A',
                      fontWeight: notification.read ? 400 : 500
                    }}
                  >
                    {notification.message}
                  </Typography>
                }
                secondary={
                  <Typography
                    variant="caption"
                    sx={{
                      color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                      mt: 0.5
                    }}
                  >
                    {notification.time}
                  </Typography>
                }
              />
            </MenuItem>
          ))}
          <Divider sx={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)' }} />
          <MenuItem
            sx={{
              py: 1.5,
              px: 2,
              justifyContent: 'center',
              '&:hover': {
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
              },
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 500
              }}
            >
              View All Notifications
            </Typography>
          </MenuItem>
        </Menu>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            sx: {
              mt: 1.5,
              minWidth: 200,
              borderRadius: '12px',
              boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
              backgroundColor: isDarkMode ? '#1e1e2d' : '#ffffff',
              '.MuiMenuItem-root': {
                py: 1.5,
                px: 2.5,
                '&:hover': {
                  backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                },
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ p: 2, pb: 1.5 }}>
            <Typography variant="subtitle1" sx={{ color: isDarkMode ? '#ffffff' : '#0F172A', fontWeight: 500 }}>
              {userData.name}
            </Typography>
            <Typography variant="body2" sx={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' }}>
              {userData.role}
            </Typography>
          </Box>
          <Divider sx={{ my: 1, borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)' }} />
          {menuItems.map((item, index) => [
            <MenuItem key={index} onClick={() => handleMenuItemClick(item.link)}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                color: isDarkMode ? '#ffffff' : '#0F172A',
              }}>
                {item.icon}
                <Typography variant="body2">
                  {item.text}
                </Typography>
              </Box>
            </MenuItem>,
            item.divider && (
              <Divider 
                key={`divider-${index}`} 
                sx={{ 
                  my: 1, 
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)' 
                }} 
              />
            )
          ].filter(Boolean))}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 