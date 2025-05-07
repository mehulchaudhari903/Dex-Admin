import React from 'react';
import { Box } from '@mui/material';
import { Menu as MenuIcon, Search, Notifications } from '@mui/icons-material';

interface NavPreviewProps {
  bgColor: string;
  textColor: string;
}

const NavPreview: React.FC<NavPreviewProps> = ({ bgColor, textColor }) => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        px: 2,
        gap: 2
      }}
    >
      <MenuIcon sx={{ fontSize: 20, color: textColor }} />
      <Box
        sx={{
          flex: 1,
          height: 28,
          border: '1px solid',
          borderColor: `${textColor}20`,
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          px: 1.5,
          gap: 1
        }}
      >
        <Search sx={{ fontSize: 18, color: textColor, opacity: 0.5 }} />
        <Box
          sx={{
            width: '60%',
            height: 4,
            backgroundColor: `${textColor}15`,
            borderRadius: 4
          }}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5
        }}
      >
        <Notifications sx={{ fontSize: 20, color: textColor }} />
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            border: '1px solid',
            borderColor: `${textColor}30`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              color: textColor,
              fontWeight: 500,
              opacity: 0.7
            }}
          >
            A
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default NavPreview; 