import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  useTheme,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  ShoppingCart as ShoppingCartIcon,
  People as PeopleIcon,
  AttachMoney as AttachMoneyIcon
} from '@mui/icons-material';

// Summary cards data
const summaryCards = [
  {
    title: 'Total Revenue',
    value: '$12,450',
    icon: <AttachMoneyIcon />,
    trend: '+12.5%',
    color: '#10B981'
  },
  {
    title: 'Total Orders',
    value: '384',
    icon: <ShoppingCartIcon />,
    trend: '+8.2%',
    color: '#3B82F6'
  },
  {
    title: 'Total Customers',
    value: '1,482',
    icon: <PeopleIcon />,
    trend: '+5.7%',
    color: '#8B5CF6'
  },
  {
    title: 'Growth Rate',
    value: '15.2%',
    icon: <TrendingUpIcon />,
    trend: '+2.4%',
    color: '#F59E0B'
  }
];

const DashboardPage: React.FC = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Box sx={{ p: 3 }}>
      {/* Summary Cards */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={3}
        sx={{ mb: 4 }}
        useFlexGap
        flexWrap="wrap"
      >
        {summaryCards.map((card, index) => (
          <Paper
            key={index}
            elevation={0}
            sx={{
              p: 3,
              flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' },
              backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '12px',
                backgroundColor: `${card.color}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: card.color
              }}
            >
              {card.icon}
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                {card.title}
              </Typography>
              <Typography variant="h6" sx={{ mb: 0.5, color: isDarkMode ? 'white' : 'inherit' }}>
                {card.value}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: '#10B981',
                  backgroundColor: '#10B98110',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1
                }}
              >
                {card.trend}
              </Typography>
            </Box>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
};

export default DashboardPage; 