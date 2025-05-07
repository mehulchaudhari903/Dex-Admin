import React, { useState } from 'react';
import {
  Typography,
  useTheme,
  TextField,
  Alert,
} from '@mui/material';
import { Lock as LockIcon } from '@mui/icons-material';
import { useTheme as useCustomTheme } from '../contexts/ThemeContext';
import Button from '../components/Button';

const SecurityPage = () => {
  const theme = useTheme();
  const { buttonColor, themeMode } = useCustomTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [isEditing, setIsEditing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [updateKey, setUpdateKey] = useState(0);

  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
    setSuccess(null);
  };

  const handleClose = () => {
    setIsEditing(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError(null);
    setSuccess(null);
  };

  const handleSave = () => {
    // Reset messages
    setError(null);
    setSuccess(null);

    // Validate inputs
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    // Here you would typically make an API call to update the password
    console.log('Updating password...');
    
    // Simulate successful password update
    setSuccess('Password updated successfully');
    setTimeout(() => {
      handleClose();
    }, 2000);
  };

  return (
    <div className="sm:p-6 lg:p-8 space-y-4 sm:space-y-6 min-h-screen">
      {error && (
        <Alert severity="error" onClose={() => setError(null)} className="mb-4">
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" onClose={() => setSuccess(null)} className="mb-4">
          {success}
        </Alert>
      )}

      <Typography variant="h5" className={`font-medium mb-4 sm:mb-8 text-xl sm:text-2xl ${
        isDarkMode ? 'text-white' : 'text-[#0F172A]'
      }`}>
        Security Settings
      </Typography>

      {/* Password View Card */}
      {!isEditing && (
        <div className={`rounded-xl shadow-sm p-4 sm:p-6 lg:p-8 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className={`flex flex-row justify-between items-center w-full gap-4 sm:gap-0 mb-6 ${
            isDarkMode ? 'text-white' : 'text-[#0F172A]'
          }`}>
            <h2 className="text-lg font-medium">Password Update</h2>
            <Button
              key={`password-edit-${buttonColor}-${themeMode}-${updateKey}`}
              startIcon={<LockIcon />}
              onClick={handleEdit}
              size="small"
            >
              Edit
            </Button>
          </div>

          <div className={`p-3 sm:p-4 rounded-lg ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <p className={`text-sm mb-1 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-500'
            }`}>
              Last Updated
            </p>
            <p className={isDarkMode ? 'text-white' : 'text-[#0F172A]'}>
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      )}

      {/* Password Edit Card */}
      {isEditing && (
        <div className={`rounded-xl shadow-sm p-4 sm:p-6 lg:p-8 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className={`flex flex-row justify-between items-center w-full gap-4 sm:gap-0 mb-6 ${
            isDarkMode ? 'text-white' : 'text-[#0F172A]'
          }`}>
            <h2 className="text-lg font-medium">Password Update</h2>
            <Button
              key={`cancel-${buttonColor}-${themeMode}-${updateKey}`}
              onClick={handleClose}
              size="small"
              variant="outlined"
              className="min-w-[100px]"
            >
              Cancel
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-6 mb-6">
            <div className={`p-3 sm:p-4 rounded-lg ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <TextField
                fullWidth
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1E90FF',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                  },
                  '& .MuiInputBase-input': {
                    color: isDarkMode ? '#ffffff' : '#0F172A',
                  },
                }}
              />
            </div>
            <div className={`p-3 sm:p-4 rounded-lg ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <TextField
                fullWidth
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1E90FF',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                  },
                  '& .MuiInputBase-input': {
                    color: isDarkMode ? '#ffffff' : '#0F172A',
                  },
                }}
              />
            </div>
            <div className={`p-3 sm:p-4 rounded-lg ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <TextField
                fullWidth
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1E90FF',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                  },
                  '& .MuiInputBase-input': {
                    color: isDarkMode ? '#ffffff' : '#0F172A',
                  },
                }}
              />
            </div>
          </div>

          <div className="flex justify-end border-t  pt-6">
            <Button
              key={`save-${buttonColor}-${themeMode}-${updateKey}`}
              startIcon={<LockIcon />}
              onClick={handleSave}
              size="large"
              className="min-w-[150px]"
            >
              Update Password
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityPage; 