import React, { useState, useEffect } from 'react';
import {
  Typography,
  Tooltip,
  useTheme,
  TextField,
  Button as MuiButton,
  Alert,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { useTheme as useCustomTheme } from '../contexts/ThemeContext';
import Button from '../components/Button';

interface PersonalInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  userRole: string;
}

interface AddressInfo {
  country: string;
  city: string;
  postalCode: string;
}

const SettingsPage = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const theme = useTheme();
  const { buttonColor, themeMode } = useCustomTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [updateKey, setUpdateKey] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editSection, setEditSection] = useState<'personal' | 'address' | null>(null);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: 'Natashia',
    lastName: 'Khaleira',
    dateOfBirth: '12-10-1990',
    email: 'info@binary-fusion.com',
    phone: '(+62) 821 2554-5846',
    userRole: 'Admin'
  });
  const [addressInfo, setAddressInfo] = useState<AddressInfo>({
    country: 'United Kingdom',
    city: 'Leeds, East London',
    postalCode: 'ERT 1254'
  });

  // Single useEffect for button color changes
  useEffect(() => {
    const handleButtonColorUpdate = () => {
      setUpdateKey(prev => prev + 1);
    };

    // Listen for storage events
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'dex-admin-button-color') {
        handleButtonColorUpdate();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Initial check for saved button color
    const savedButtonColor = localStorage.getItem('dex-admin-button-color');
    if (savedButtonColor) {
      handleButtonColorUpdate();
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const handleEdit = (section: 'personal' | 'address') => {
    setEditSection(section);
  };

  const handleClose = () => {
    setEditSection(null);
  };

  const handleSave = () => {
    // Reset messages
    setError(null);
    setSuccess(null);

    // Here you would typically make an API call to save the changes
    console.log('Saving personal info:', personalInfo);
    console.log('Saving address info:', addressInfo);
    
    // Simulate successful update
    setSuccess('Information updated successfully');
    setTimeout(() => {
      setSuccess(null);
    }, 3000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, section: 'personal' | 'address') => {
    const { name, value } = e.target;
    if (section === 'personal') {
      setPersonalInfo(prev => ({ ...prev, [name]: value }));
    } else {
      setAddressInfo(prev => ({ ...prev, [name]: value }));
    }
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
        My Profile
      </Typography>

      {/* Profile Card */}
      <div className={`rounded-xl shadow-sm p-4 sm:p-6 lg:p-8 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
          <div className="relative">
            <Tooltip title="Click to upload new photo" arrow placement="top">
              <div 
                className="w-[120px] h-[120px] sm:w-[100px] sm:h-[100px] rounded-full bg-[#F59E0B] flex items-center justify-center relative overflow-hidden group cursor-pointer"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                {profileImage ? (
                  <>
                    <img
                      src={profileImage}
                      alt="Profile"
                      className={`w-full h-full object-cover transition-opacity duration-200 ${
                        isHovering ? 'opacity-50' : 'opacity-100'
                      }`}
                    />
                    {isHovering && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
                        <svg 
                          className="w-12 h-12 text-white" 
                          viewBox="0 0 24 24" 
                          fill="currentColor"
                        >
                          <circle cx="12" cy="12" r="3.2"/>
                          <path d="M9 2 7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5"/>
                        </svg>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <span className={`text-5xl sm:text-4xl font-medium text-white transition-opacity duration-200 ${
                      isHovering ? 'opacity-50' : 'opacity-100'
                    }`}>
                      NK
                    </span>
                    {isHovering && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
                        <svg 
                          className="w-12 h-12 text-white" 
                          viewBox="0 0 24 24" 
                          fill="currentColor"
                        >
                          <circle cx="12" cy="12" r="3.2"/>
                          <path d="M9 2 7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5"/>
                        </svg>
                      </div>
                    )}
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  aria-label="Upload profile photo"
                />
              </div>
            </Tooltip>
          </div>

          <div className="flex flex-col items-center sm:items-start pt-2 text-center sm:text-left">
            <h2 className={`text-xl sm:text-lg font-medium mb-0.5 ${
              isDarkMode ? 'text-white' : 'text-[#0F172A]'
            }`}>
              Natashia Khaleira
            </h2>
            <p className={`text-base sm:text-sm mb-0.5 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-500'
            }`}>
              Admin
            </p>
            <p className={`text-base sm:text-sm ${
              isDarkMode ? 'text-gray-300' : 'text-gray-500'
            }`}>
              Leeds, East London, United Kingdom
            </p>
          </div>
        </div>
      </div>


      {/* Personal Information Edit Card */}
      {editSection === 'personal' && (
        <div className={`rounded-xl shadow-sm p-4 sm:p-6 lg:p-8 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className={`flex flex-row justify-between items-center w-full gap-4 sm:gap-0 mb-6 ${
            isDarkMode ? 'text-white' : 'text-[#0F172A]'
          }`}>
            <h2 className="text-lg font-medium">Personal Information Edit</h2>
            <Button
              key={`cancel-${buttonColor}-${themeMode}-${updateKey}`}
              onClick={handleClose}
              size="small"
              variant="outlined"
              className="min-w-[100px]"
            >
              Back
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
            {[
              { label: 'First Name', value: personalInfo.firstName, name: 'firstName' },
              { label: 'Last Name', value: personalInfo.lastName, name: 'lastName' },
              { label: 'Date of Birth', value: personalInfo.dateOfBirth, name: 'dateOfBirth' },
              { label: 'Email Address', value: personalInfo.email, name: 'email' },
              { label: 'Phone Number', value: personalInfo.phone, name: 'phone' },
              { label: 'User Role', value: personalInfo.userRole, name: 'userRole', disabled: true },
            ].map((field, index) => (
              <div key={index} className={`p-3 sm:p-4 rounded-lg ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <TextField
                  fullWidth
                  label={field.label}
                  name={field.name}
                  value={field.value}
                  onChange={(e) => handleInputChange(e as React.ChangeEvent<HTMLInputElement>, 'personal')}
                  variant="outlined"
                  disabled={field.disabled}
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
            ))}
          </div>

          <div className="flex justify-end border-t  pt-6">
            <Button
              key={`save-${buttonColor}-${themeMode}-${updateKey}`}
              startIcon={<AutorenewIcon />}
              onClick={() => {
                handleSave();
                handleClose();
              }}
              size="large"
              className="min-w-[150px]"
            >
              Update
            </Button>
          </div>
        </div>
      )}

      

      {editSection === null && (
       <>
      {/* Personal Information Card */}
      <div className={`rounded-xl shadow-sm p-4 sm:p-6 lg:p-8 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className={`flex flex-row justify-between items-center w-full gap-4 sm:gap-0 mb-6 ${
          isDarkMode ? 'text-white' : 'text-[#0F172A]'
        }`}>
          <h2 className="text-lg font-medium">Personal Information</h2>
          <Button
            key={`personal-edit-${buttonColor}-${themeMode}-${updateKey}`}
            startIcon={<EditIcon />}
            onClick={() => handleEdit('personal')}
            size="small"
          >
            Edit
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[
            { label: 'First Name', value: personalInfo.firstName, name: 'firstName' },
            { label: 'Last Name', value: personalInfo.lastName, name: 'lastName' },
            { label: 'Date of Birth', value: personalInfo.dateOfBirth, name: 'dateOfBirth' },
            { label: 'Email Address', value: personalInfo.email, name: 'email' },
            { label: 'Phone Number', value: personalInfo.phone, name: 'phone' },
            { label: 'User Role', value: personalInfo.userRole, name: 'userRole' },
          ].map((field, index) => (
            <div key={index} className={`p-3 sm:p-4 rounded-lg ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <p className={`text-sm mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-500'
              }`}>
                {field.label}
              </p>
              <p className={isDarkMode ? 'text-white' : 'text-[#0F172A]'}>
                {field.value}
              </p>
            </div>
          ))}
        </div>
      </div>


        {/* Address Card */}
        <div className={`rounded-xl shadow-sm p-4 sm:p-6 lg:p-8 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className={`flex flex-row justify-between items-center w-full gap-4 sm:gap-0 mb-6 ${
              isDarkMode ? 'text-white' : 'text-[#0F172A]'
            }`}>
            <h2 className="text-lg font-medium">Address</h2>
            <Button
              key={`address-edit-${buttonColor}-${themeMode}-${updateKey}`}
              startIcon={<EditIcon />}
              onClick={() => handleEdit('address')}
              size="small"
            >
              Edit
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              { label: 'Country', value: addressInfo.country, name: 'country' },
              { label: 'City', value: addressInfo.city, name: 'city' },
              { label: 'Postal Code', value: addressInfo.postalCode, name: 'postalCode' },
            ].map((field, index) => (
              <div key={index} className={`p-3 sm:p-4 rounded-lg ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <p className={`text-sm mb-1 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  {field.label}
                </p>
                <p className={isDarkMode ? 'text-white' : 'text-[#0F172A]'}>
                  {field.value}
                </p>
              </div>
            ))}
          </div>
        </div>
       </>
      )}

      {/* Address Edit Card */}
      {editSection === 'address' && (
        <div className={`rounded-xl shadow-sm p-4 sm:p-6 lg:p-8 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className={`flex flex-row justify-between items-center w-full gap-4 sm:gap-0 mb-6 ${
              isDarkMode ? 'text-white' : 'text-[#0F172A]'
            }`}>
            <h2 className="text-lg font-medium">Address Edit</h2>
            <Button
              key={`address-cancel-${buttonColor}-${themeMode}-${updateKey}`}
              onClick={handleClose}
              size="small"
              variant="outlined"
              className="min-w-[100px]"
            >
              Back
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
            {[
              { label: 'Country', value: addressInfo.country, name: 'country' },
              { label: 'City', value: addressInfo.city, name: 'city' },
              { label: 'Postal Code', value: addressInfo.postalCode, name: 'postalCode' },
            ].map((field, index) => (
              <div key={index} className={`p-3 sm:p-4 rounded-lg ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <TextField
                  fullWidth
                  label={field.label}
                  name={field.name}
                  value={field.value}
                  onChange={(e) => handleInputChange(e as React.ChangeEvent<HTMLInputElement>, 'address')}
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
            ))}
          </div>

          <div className="flex justify-end border-t  pt-6">
            <Button
              key={`address-save-${buttonColor}-${themeMode}-${updateKey}`}
              startIcon={<AutorenewIcon />}
              onClick={() => {
                handleSave();
                handleClose();
              }}
              size="large"
              className="min-w-[150px]"
            >
              Update
            </Button>
          </div>
        </div>
      )}


    </div>
  );
};

export default SettingsPage;