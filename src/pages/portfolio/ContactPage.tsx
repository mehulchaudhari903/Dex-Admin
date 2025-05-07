import React, { useState, ReactElement, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Chip,
  useTheme,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  useMediaQuery,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  PaginationItem,
  ThemeProvider,
  createTheme,
  Skeleton,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import Button from '../../components/Button';
import { getFirebaseDatabase } from '../../firebase/firebaseConfig';
import { ref, onValue, update, remove } from 'firebase/database';

// Contact data structure
interface ContactData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
  status?: 'read' | 'unread' | null; // Status is optional and can be null
  createdAt: string;
}

const ContactPage: React.FC = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Create a custom theme for consistent dark mode styling
  const customTheme = React.useMemo(
    () =>
      createTheme({
        ...theme,
        components: {
          MuiInputLabel: {
            styleOverrides: {
              root: {
                color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'inherit',
                '&.Mui-focused': {
                  color: isDarkMode ? 'white' : 'inherit',
                },
              },
            },
          },
          MuiFormControl: {
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  color: isDarkMode ? 'white' : 'inherit',
                  backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'transparent',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: isDarkMode ? 'rgba(255,255,255,0.23)' : 'rgba(0,0,0,0.23)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.5)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: isDarkMode ? 'white' : theme.palette.primary.main,
                  },
                },
              },
            },
          },
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                color: isDarkMode ? 'white' : 'inherit',
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'transparent',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.23)' : 'rgba(0,0,0,0.23)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.5)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDarkMode ? 'white' : theme.palette.primary.main,
                },
              },
            },
          },
          MuiSelect: {
            styleOverrides: {
              select: {
                color: isDarkMode ? 'white' : 'inherit',
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'transparent',
              },
              icon: {
                color: isDarkMode ? 'white' : 'inherit',
              },
            },
          },
        },
      }),
    [theme, isDarkMode]
  );

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [data, setData] = useState<ContactData[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<ContactData | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<'read' | 'unread'>('unread');

  // Initialize Firebase database
  const db = getFirebaseDatabase();

  // Fetch contact messages from Firebase on component mount
  useEffect(() => {
    const contactsRef = ref(db, 'contact');
    onValue(
      contactsRef,
      (snapshot) => {
        const contactsData = snapshot.val();
        const contactsList: ContactData[] = [];
        if (contactsData) {
          Object.keys(contactsData).forEach((key) => {
            contactsList.push({
              id: key,
              ...contactsData[key],
              status: contactsData[key].status ?? 'unread', // Default to 'unread' if status is null or undefined
            });
          });
        }
        setData(contactsList);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching contacts:', error);
        setLoading(false);
      }
    );
  }, [db]);

  // Update selected status when selectedData changes
  useEffect(() => {
    if (selectedData) {
      setSelectedStatus(selectedData.status ?? 'unread');
    }
  }, [selectedData]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status: string | undefined | null) => {
    const normalizedStatus = status ?? 'unread'; // Default to 'unread' if status is undefined or null
    switch (normalizedStatus) {
      case 'read':
        return { bg: '#10B981', text: '#ffffff' };
      case 'unread':
        return { bg: '#EF4444', text: '#ffffff' };
      default:
        return { bg: '#E5E7EB', text: '#374151' };
    }
  };

  // View handlers
  const handleViewOpen = (row: ContactData) => {
    setSelectedData(row);
    setViewDialogOpen(true);
    // Always mark the message as read when viewed
    handleMarkAsRead(row.id);
  };

  const handleViewClose = () => {
    setViewDialogOpen(false);
    setSelectedData(null);
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await update(ref(db, `contact/${id}`), { status: 'read' });
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleStatusChange = async (newStatus: 'read' | 'unread') => {
    if (selectedData) {
      try {
        await update(ref(db, `contact/${selectedData.id}`), { status: newStatus });
        setSelectedStatus(newStatus);
      } catch (error) {
        console.error('Error updating status:', error);
      }
    }
  };

  // Delete handlers
  const handleDeleteOpen = (row: ContactData) => {
    setSelectedData(row);
    setDeleteDialogOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
    setSelectedData(null);
  };

  const handleDeleteConfirm = async () => {
    if (selectedData) {
      try {
        await remove(ref(db, `contact/${selectedData.id}`));
        handleDeleteClose();
      } catch (error) {
        console.error('Error deleting contact:', error);
      }
    }
  };

  const renderMobileCard = (row: ContactData): ReactElement => (
    <Card
      key={row.id}
      sx={{
        mb: 2,
        backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
        borderRadius: 2,
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {row.firstName} {row.lastName}
            </Typography>
            <Chip
              label={row.status ?? 'unread'}
              size="small"
              sx={{
                backgroundColor: getStatusColor(row.status).bg,
                color: getStatusColor(row.status).text,
                textTransform: 'capitalize',
              }}
            />
          </Box>
          <Box>
            <Typography variant="body1">{row.email}</Typography>
            <Typography variant="body2" sx={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' }}>
              {row.subject}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
            <Stack direction="row" spacing={1}>
              <IconButton
                size="small"
                onClick={() => handleViewOpen(row)}
                sx={{ color: isDarkMode ? 'white' : 'inherit' }}
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleDeleteOpen(row)}
                sx={{ color: isDarkMode ? 'white' : 'inherit' }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const renderMobileSkeleton = (): ReactElement => (
    <Box sx={{ px: 2, pb: 2 }}>
      {[...Array(rowsPerPage)].map((_, index) => (
        <Card
          key={index}
          sx={{
            mb: 2,
            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
            borderRadius: 2,
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Skeleton variant="text" width="60%" height={24} />
                <Skeleton variant="rounded" width={80} height={24} />
              </Box>
              <Box>
                <Skeleton variant="text" width="80%" height={20} />
                <Skeleton variant="text" width="70%" height={20} />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                <Stack direction="row" spacing={1}>
                  <Skeleton variant="circular" width={24} height={24} />
                  <Skeleton variant="circular" width={24} height={24} />
                </Stack>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  const renderDesktopTable = (): ReactElement => (
    <TableContainer
      sx={{
        p: 2,
      }}
    >
      <Table sx={{ minWidth: 650 }} aria-label="Contact table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'inherit' }}>First Name</TableCell>
            <TableCell sx={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'inherit' }}>Last Name</TableCell>
            <TableCell sx={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'inherit' }}>Email</TableCell>
            <TableCell sx={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'inherit', display: { xs: 'none', sm: 'table-cell' } }}>
              Subject
            </TableCell>
            <TableCell sx={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'inherit', display: { xs: 'none', md: 'table-cell' } }}>
              Message
            </TableCell>
            <TableCell sx={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'inherit' }}>Status</TableCell>
            <TableCell sx={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'inherit' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            // Skeleton loading animation for table rows
            [...Array(rowsPerPage)].map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton variant="text" width="80%" />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width="80%" />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width="90%" />
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                  <Skeleton variant="text" width="70%" />
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                  <Skeleton variant="text" width="60%" />
                </TableCell>
                <TableCell>
                  <Skeleton variant="rounded" width={80} height={24} />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Skeleton variant="circular" width={24} height={24} />
                    <Skeleton variant="circular" width={24} height={24} />
                  </Stack>
                </TableCell>
              </TableRow>
            ))
          ) : data.length === 0 ? (
            // Display "No Data Found" message if no data is available
            <TableRow>
              <TableCell colSpan={7} align="center">
                <Typography
                  variant="body1"
                  sx={{
                    color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                    py: 4,
                  }}
                >
                  No Data Found
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell sx={{ color: isDarkMode ? 'white' : 'inherit' }}>{row.firstName}</TableCell>
                <TableCell sx={{ color: isDarkMode ? 'white' : 'inherit' }}>{row.lastName}</TableCell>
                <TableCell sx={{ color: isDarkMode ? 'white' : 'inherit' }}>{row.email}</TableCell>
                <TableCell sx={{ color: isDarkMode ? 'white' : 'inherit', display: { xs: 'none', sm: 'table-cell' } }}>
                  {row.subject}
                </TableCell>
                <TableCell sx={{ color: isDarkMode ? 'white' : 'inherit', display: { xs: 'none', md: 'table-cell' } }}>
                  {row.message.length > 50 ? `${row.message.substring(0, 50)}...` : row.message}
                </TableCell>
                <TableCell>
                  <Chip
                    label={row.status ?? 'unread'}
                    size="small"
                    sx={{
                      backgroundColor: getStatusColor(row.status).bg,
                      color: getStatusColor(row.status).text,
                      textTransform: 'capitalize',
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="View">
                      <IconButton
                        size="small"
                        onClick={() => handleViewOpen(row)}
                        sx={{ color: isDarkMode ? 'white' : 'inherit' }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteOpen(row)}
                        sx={{ color: isDarkMode ? 'white' : 'inherit' }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const CustomPagination: React.FC = () => {
    const pageCount = Math.ceil(data.length / rowsPerPage);
    const currentPage = page + 1;

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
      handleChangePage(null, value - 1);
    };

    return (
      <Box
        sx={{
          p: { xs: 2, sm: 3 },
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: { xs: 2, sm: 3 },
          borderTop: 1,
          borderColor: 'divider',
          backgroundColor: isDarkMode ? '#1e1e2d' : 'transparent',
          color: isDarkMode ? 'white' : 'inherit',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, order: { xs: 2, sm: 1 } }}>
          <FormControl size={isMobile ? 'small' : 'medium'} variant="outlined">
            <InputLabel id="rows-per-page-label">Rows</InputLabel>
            <Select
              labelId="rows-per-page-label"
              value={rowsPerPage}
              label="Rows"
              onChange={(e) => handleChangeRowsPerPage(e as any)}
            >
              <MenuItem value={5}>5 per page</MenuItem>
              <MenuItem value={10}>10 per page</MenuItem>
              <MenuItem value={25}>25 per page</MenuItem>
            </Select>
          </FormControl>
          <Typography
            variant={isMobile ? 'body2' : 'body1'}
            sx={{ color: isDarkMode ? 'white' : 'rgba(0,0,0,0.6)', minWidth: 100 }}
          >
            {`${page * rowsPerPage + 1}-${Math.min((page + 1) * rowsPerPage, data.length)} of ${data.length}`}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', order: { xs: 1, sm: 2 }, flex: 1 }}>
          <Pagination
            count={pageCount}
            page={currentPage}
            onChange={handlePageChange}
            size={isMobile ? 'small' : 'medium'}
            siblingCount={isMobile ? 0 : 1}
            boundaryCount={isMobile ? 1 : 2}
            renderItem={(item) => (
              <PaginationItem
                {...item}
                sx={{
                  color: isDarkMode ? 'white' : 'inherit',
                  '&.Mui-selected': {
                    backgroundColor: isDarkMode ? 'white' : theme.palette.primary.main,
                    color: isDarkMode ? '#1e1e2d' : 'white',
                    '&:hover': {
                      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.9)' : theme.palette.primary.dark,
                    },
                  },
                  '&.MuiPaginationItem-ellipsis': {
                    color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'inherit',
                  },
                  '&.MuiPaginationItem-text': {
                    '&:hover': {
                      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)',
                    },
                  },
                  '&.Mui-disabled': {
                    color: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                  },
                }}
              />
            )}
          />
        </Box>
        <Box sx={{ width: { xs: '100%', sm: 'auto' }, flex: { sm: '0 0 182px' }, order: { xs: 3, sm: 3 } }} />
      </Box>
    );
  };

  // View Dialog Content
  const renderViewDialogContent = () => {
    if (!selectedData) return null;

    return (
      <Stack spacing={3}>
        <Typography>
          <strong>First Name:</strong> {selectedData.firstName}
        </Typography>
        <Typography>
          <strong>Last Name:</strong> {selectedData.lastName}
        </Typography>
        <Typography>
          <strong>Email:</strong> {selectedData.email}
        </Typography>
        <Typography>
          <strong>Subject:</strong> {selectedData.subject}
        </Typography>
        <Typography>
          <strong>Message:</strong> {selectedData.message}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography>
            <strong>Status:</strong>
          </Typography>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={selectedStatus}
              label="Status"
              onChange={(e) => handleStatusChange(e.target.value as 'read' | 'unread')}
            >
              <MenuItem value="read">Read</MenuItem>
              <MenuItem value="unread">Unread</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Typography>
          <strong>Received At:</strong> {new Date(selectedData.createdAt).toLocaleString()}
        </Typography>
      </Stack>
    );
  };

  // Render content based on loading and data state
  const renderContent = () => {
    return isMobile ? (
      loading ? (
        renderMobileSkeleton()
      ) : data.length === 0 ? (
        <Box sx={{ px: 2, pb: 2, textAlign: 'center' }}>
          <Typography
            variant="body1"
            sx={{
              color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
              py: 4,
            }}
          >
            No Data Found
          </Typography>
        </Box>
      ) : (
        <Box sx={{ px: 2, pb: 2 }}>
          {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(renderMobileCard)}
        </Box>
      )
    ) : (
      renderDesktopTable()
    );
  };

  return (
    <ThemeProvider theme={customTheme}>
      <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
        {/* Page Title */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: { xs: 2, sm: 3, md: 4 },
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography
            variant={isMobile ? 'h5' : 'h4'}
            sx={{ color: isDarkMode ? 'white' : 'inherit', fontWeight: 'bold' }}
          >
            Contact Messages
          </Typography>
        </Box>

        {/* Contact Table */}
        <Paper
          elevation={0}
          sx={{
            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <Box sx={{ p: { xs: 2, sm: 3 }, pb: 2 }}>
            <Typography
              variant={isMobile ? 'subtitle1' : 'h6'}
              sx={{ color: isDarkMode ? 'white' : 'inherit' }}
            >
              Contact Messages
            </Typography>
          </Box>

          {renderContent()}
          {data.length > 0 && <CustomPagination />}
        </Paper>

        {/* View Dialog */}
        <Dialog
          open={viewDialogOpen}
          onClose={handleViewClose}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              backgroundColor: isDarkMode ? '#1e1e2d' : 'white',
              color: isDarkMode ? 'white' : 'inherit',
              '& .MuiDialogTitle-root': {
                color: isDarkMode ? 'white' : 'inherit',
                borderBottom: 1,
                borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                padding: '16px 24px',
              },
              '& .MuiDialogContent-root': {
                color: isDarkMode ? 'white' : 'inherit',
                padding: '24px',
              },
              '& .MuiDialogActions-root': {
                borderTop: 1,
                borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                padding: '16px 24px',
              },
            },
          }}
        >
          <DialogTitle>View Message</DialogTitle>
          <DialogContent>{renderViewDialogContent()}</DialogContent>
          <DialogActions>
            <Button onClick={handleViewClose} variant="outlined" size="medium" color="info">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteClose}
          PaperProps={{
            sx: {
              backgroundColor: isDarkMode ? '#1e1e2d' : 'white',
              color: isDarkMode ? 'white' : 'inherit',
              '& .MuiDialogTitle-root': {
                color: isDarkMode ? 'white' : 'inherit',
                borderBottom: 1,
                borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                padding: '16px 24px',
              },
              '& .MuiDialogContent-root': {
                color: isDarkMode ? 'white' : 'inherit',
                padding: '24px',
              },
              '& .MuiDialogActions-root': {
                borderTop: 1,
                borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                padding: '16px 24px',
              },
            },
          }}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'inherit' }}>
              Are you sure you want to delete this message?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteClose} variant="outlined" size="medium" color="info">
              Cancel
            </Button>
            <Button onClick={handleDeleteConfirm} variant="contained" size="medium" color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default ContactPage;