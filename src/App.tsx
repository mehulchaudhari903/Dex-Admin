import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import { ThemeProvider } from './contexts/ThemeContext';
import { 
  Dashboard, People, Settings, HelpOutline as HelpIcon,

} from '@mui/icons-material';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import SchoolIcon from '@mui/icons-material/School';
import PsychologyIcon from '@mui/icons-material/Psychology';
import WorkIcon from '@mui/icons-material/Work';
import ContactsIcon from '@mui/icons-material/Contacts';
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';
// Import pages
import Login from './pages/auth/Login';
import DashboardPage from './pages/DashboardPage';
import HomePage from './pages/portfolio/HomePage';
import AboutPage from './pages/portfolio/AboutPage';
import SkillsPage from './pages/portfolio/SkillsPage';
import ProjectsPage from './pages/portfolio/ProjectsPage';
import EducationPage from './pages/portfolio/EducationPage';
import ContactPage from './pages/portfolio/ContactPage';
import UsersPage from './pages/UsersPage';
import NotificationsPage from './pages/NotificationsPage';
import SettingsPage from './pages/SettingsPage';
import SecurityPage from './pages/SecurityPage';
import HelpPage from './pages/HelpPage';
const menuItems = [
  {
    text: 'Dashboard',
    icon: <Dashboard />,
    active: true,
    hasSubmenu: false,
    isPro: false,
    path: '/dashboard'
  },
  {
    text: 'Portfolio',
    icon: <BusinessCenterIcon />,
    active: false,
    hasSubmenu: true,
    isPro: false,
    path: '/portfolio',
    submenuItems: [
      {
        text: 'Home',
        icon: <HomeIcon />, // Add an icon here
        path: '/portfolio/home',
        active: false
      },
      {
        text: 'About',
        icon: <InfoIcon />, // Add an icon here
        path: '/portfolio/about',
        active: false
      },
      {
        text: 'Skills',
        icon: <PsychologyIcon />, // Add an icon here
        path: '/portfolio/skills',
        active: false
      },
      {
        text: 'Education',
        icon: <SchoolIcon />, // Add an icon here
        path: '/portfolio/education',
        active: false
      },
      {
        text: 'Projects',
        icon: <WorkIcon />, // Add an icon here
        path: '/portfolio/projects',
        active: false
      },
      {
        text: 'Contact',
        icon: <ContactsIcon />, // Add an icon here
        path: '/portfolio/contact',
        active: false
      }
    ]
  },
  {
    text: 'Users',
    icon: <People />,
    active: false,
    hasSubmenu: true,
    isPro: false,
    path: '/users',
    submenuItems: [
      {
        text: 'All Users',
        path: '/users',
        active: false
      },
      {
        text: 'Add User',
        path: '/users/add',
        active: false
      }
    ]
  },

  {
    text: 'Settings',
    icon: <Settings />,
    active: false,
    hasSubmenu: true,
    isPro: false,
    path: '/settings',
    submenuItems: [
      {
        text: 'Profile',
        icon: <PersonIcon />,
        path: '/settings/profile',
        active: false
      },
      {
        text: 'Security',
        icon: <SecurityIcon />,
        path: '/settings/security',
        active: false
      },
     
    ]
  },
  {
    text: 'Help',
    icon: <HelpIcon />,
    active: false,
    hasSubmenu: false,
    isPro: false,
    path: '/help'
  }
];

function App() {
  return (
    <ThemeProvider>
      <Router>
        
        <Layout menuItems={menuItems}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/portfolio/home" element={<HomePage />} />
            <Route path="/portfolio/about" element={<AboutPage />} />
            <Route path="/portfolio/skills" element={<SkillsPage />} />
            <Route path="/portfolio/education" element={<EducationPage />} />
            <Route path="/portfolio/projects" element={<ProjectsPage />} />
            <Route path="/portfolio/contact" element={<ContactPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/users/add" element={<UsersPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/notifications/settings" element={<NotificationsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/settings/profile" element={<SettingsPage />} />
            <Route path="/settings/security" element={<SecurityPage />} />
            <Route path="/settings/preferences" element={<SettingsPage />} />
            <Route path="/help" element={<HelpPage />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
