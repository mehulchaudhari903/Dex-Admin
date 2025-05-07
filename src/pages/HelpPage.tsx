import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  CardActionArea,
  useTheme,
  Stack
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon
} from '@mui/icons-material';

const faqs = [
  {
    question: "How do I change my account settings?",
    answer: "You can change your account settings by navigating to Settings > Profile. There you'll find options to update your personal information, password, and notification preferences."
  },
  {
    question: "How can I manage my notifications?",
    answer: "To manage your notifications, go to Settings > Notifications. You can customize which notifications you receive and how you receive them (email, in-app, or both)."
  },
  {
    question: "What should I do if I forgot my password?",
    answer: "If you forgot your password, click on the 'Forgot Password' link on the login page. You'll receive an email with instructions to reset your password."
  },
  {
    question: "How do I contact support?",
    answer: "You can contact support by filling out the contact form below, sending an email to support@example.com, or calling our support line at 1-800-123-4567."
  }
];

const resources = [
  {
    title: "Homepage",
    description: "Return to the main dashboard",
    icon: <HomeIcon sx={{ fontSize: 40 }} />,
    link: "/"
  },
  {
    title: "Email Support",
    description: "Get help from our support team",
    icon: <MailIcon sx={{ fontSize: 40 }} />,
    link: "mailto:mehulchaudhari5215@gmail.com"
  },
  {
    title: "Phone Support",
    description: "Talk to our support representatives",
    icon: <PhoneIcon sx={{ fontSize: 40 }} />,
    link: "tel:18001234567"
  }
];

const HelpPage: React.FC = () => {
  const theme = useTheme();

  return (
    <Box sx={{ p: 3, margin: '0 auto' }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        Help & Support
      </Typography>

      {/* Quick Help Resources */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
        Quick Help Resources
      </Typography>
      <Box sx={{ mb: 6 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={3}
          useFlexGap
          flexWrap="wrap"
        >
          {resources.map((resource, index) => (
            <Box key={index} sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 24px)', md: '1 1 calc(25% - 24px)' } }}>
              <Card 
                sx={{ 
                  height: '100%',
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'
                }}
              >
                <CardActionArea
                  component="a"
                  href={resource.link}
                  sx={{ 
                    height: '100%',
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center'
                  }}
                >
                  <Box sx={{ 
                    color: theme.palette.mode === 'dark' ? '#ffffff' : theme.palette.primary.main,
                    mb: 2
                  }}>
                    {resource.icon}
                  </Box>
                  <CardContent>
                    <Typography variant="h6" component="div" sx={{ mb: 1 }}>
                      {resource.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {resource.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Box>
          ))}
        </Stack>
      </Box>

      {/* FAQs Section */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
        Frequently Asked Questions
      </Typography>
      <Paper 
        elevation={0} 
        sx={{ 
          mb: 6,
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
          borderRadius: 2
        }}
      >
        {faqs.map((faq, index) => (
          <Accordion
            key={index}
            disableGutters
            elevation={0}
            sx={{
              backgroundColor: 'transparent',
              '&:before': { display: 'none' },
              '&:not(:last-child)': { borderBottom: 1, borderColor: 'divider' }
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ 
                '&:hover': { 
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? 'rgba(255,255,255,0.05)' 
                    : 'rgba(0,0,0,0.02)' 
                }
              }}
            >
              <Typography variant="subtitle1">{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary">
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Paper>
    </Box>
  );
};

export default HelpPage; 