import React, { useState, useMemo, ReactElement, useEffect } from 'react';
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
  TextField,
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
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '../../components/Button';
import { getFirebaseDatabase } from '../../firebase/firebaseConfig';
import { ref, onValue, set, push, update, remove } from 'firebase/database';

// Skill data structure
interface SkillData {
  id: string;
  name: string;
  level: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

const SkillsPage: React.FC = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Create a custom theme for consistent dark mode styling
  const customTheme = useMemo(
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
          MuiSkeleton: {
            styleOverrides: {
              root: {
                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.11)' : 'rgba(0, 0, 0, 0.11)',
              },
            },
          },
        },
      }),
    [theme, isDarkMode]
  );

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [data, setData] = useState<SkillData[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<SkillData | null>(null);
  const [editFormData, setEditFormData] = useState<SkillData | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Initialize Firebase database
  const db = getFirebaseDatabase();

  // Fetch skills from Firebase on component mount
  useEffect(() => {
    const skillsRef = ref(db, 'skills');
    onValue(
      skillsRef,
      (snapshot) => {
        const skillsData = snapshot.val();
        const skillsList: SkillData[] = [];
        if (skillsData) {
          Object.keys(skillsData).forEach((key) => {
            skillsList.push({
              id: key,
              ...skillsData[key],
            });
          });
        }
        setData(skillsList);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching skills:', error);
        toast.error('Failed to fetch skills.', { position: 'top-right' });
        setLoading(false);
      }
    );
  }, [db]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return { bg: '#10B981', text: '#ffffff' };
      case 'inactive':
        return { bg: '#EF4444', text: '#ffffff' };
      default:
        return { bg: '#E5E7EB', text: '#374151' };
    }
  };

  const handleViewOpen = (row: SkillData) => {
    setSelectedData(row);
    setViewDialogOpen(true);
  };

  const handleViewClose = () => {
    setViewDialogOpen(false);
    setSelectedData(null);
  };

  const handleEditOpen = (row: SkillData) => {
    setEditFormData({ ...row });
    setEditDialogOpen(true);
    setFormErrors({});
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
    setEditFormData(null);
    setFormErrors({});
  };

  const validateForm = () => {
    if (!editFormData) return false;
    const errors: { [key: string]: string } = {};
    if (!editFormData.name.trim()) errors.name = 'Name is required';
    if (editFormData.level < 0 || editFormData.level > 100)
      errors.level = 'Level must be between 0 and 100';
    if (!editFormData.status) errors.status = 'Status is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEditSave = async () => {
    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly.', { position: 'top-right' });
      return;
    }
    if (editFormData) {
      const updatedSkill = {
        ...editFormData,
        level: Math.min(editFormData.level, 100),
        updatedAt: new Date().toISOString(),
      };
      try {
        await update(ref(db, `skills/${editFormData.id}`), updatedSkill);
        toast.success('Skill updated successfully!', { position: 'top-right' });
        handleEditClose();
      } catch (error) {
        console.error('Error updating skill:', error);
        toast.error('Failed to update skill.', { position: 'top-right' });
      }
    }
  };

  const handleDeleteOpen = (row: SkillData) => {
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
        await remove(ref(db, `skills/${selectedData.id}`));
        toast.success('Skill deleted successfully!', { position: 'top-right' });
        handleDeleteClose();
      } catch (error) {
        console.error('Error deleting skill:', error);
        toast.error('Failed to delete skill.', { position: 'top-right' });
      }
    }
  };

  const handleAddOpen = () => {
    setEditFormData({
      id: '',
      name: '',
      level: 0,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setAddDialogOpen(true);
    setFormErrors({});
  };

  const handleAddClose = () => {
    setAddDialogOpen(false);
    setEditFormData(null);
    setFormErrors({});
  };

  const handleAddSave = async () => {
    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly.', { position: 'top-right' });
      return;
    }
    if (editFormData) {
      const newSkill = {
        name: editFormData.name,
        level: Math.min(editFormData.level, 100),
        status: editFormData.status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      try {
        const newSkillRef = push(ref(db, 'skills'));
        await set(newSkillRef, newSkill);
        toast.success('Skill added successfully!', { position: 'top-right' });
        handleAddClose();
      } catch (error) {
        console.error('Error adding skill:', error);
        toast.error('Failed to add skill.', { position: 'top-right' });
      }
    }
  };

  // Loading skeleton for mobile cards
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
                  <Skeleton variant="circular" width={24} height={24} />
                </Stack>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  // Loading skeleton for desktop table rows
  const renderDesktopLoadingSkeleton = () => (
    <TableRow>
      <TableCell><Skeleton variant="text" /></TableCell>
      <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}><Skeleton variant="text" /></TableCell>
      <TableCell><Skeleton variant="rectangular" width={60} height={24} /></TableCell>
      <TableCell>
        <Stack direction="row" spacing={1}>
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton variant="circular" width={32} height={32} />
        </Stack>
      </TableCell>
    </TableRow>
  );

  const renderMobileCard = (row: SkillData): ReactElement => (
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
              {row.name}
            </Typography>
            <Chip
              label={row.status}
              size="small"
              sx={{
                backgroundColor: getStatusColor(row.status).bg,
                color: getStatusColor(row.status).text,
                textTransform: 'capitalize',
              }}
            />
          </Box>
          <Typography variant="body2">Level: {row.level}%</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 1 }}>
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
                onClick={() => handleEditOpen(row)}
                sx={{ color: isDarkMode ? 'white' : 'inherit' }}
              >
                <EditIcon fontSize="small" />
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

  const renderDesktopTable = (): ReactElement => (
    <TableContainer>
      <Table sx={{ minWidth: 650 }} aria-label="Skills table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'inherit' }}>Name</TableCell>
            <TableCell sx={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'inherit', display: { xs: 'none', md: 'table-cell' } }}>
              Level
            </TableCell>
            <TableCell sx={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'inherit' }}>Status</TableCell>
            <TableCell sx={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'inherit' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            Array.from(new Array(rowsPerPage)).map((_, index) => (
              <React.Fragment key={index}>{renderDesktopLoadingSkeleton()}</React.Fragment>
            ))
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                <Typography variant="body1" color="textSecondary">
                  No Data Found
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell sx={{ color: isDarkMode ? 'white' : 'inherit' }}>{row.name}</TableCell>
                <TableCell sx={{ color: isDarkMode ? 'white' : 'inherit', display: { xs: 'none', md: 'table-cell' } }}>
                  {row.level}%
                </TableCell>
                <TableCell>
                  <Chip
                    label={row.status}
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
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => handleEditOpen(row)}
                        sx={{ color: isDarkMode ? 'white' : 'inherit' }}
                      >
                        <EditIcon fontSize="small" />
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

  const renderViewDialogContent = () => {
    if (!selectedData) return null;

    return (
      <Stack spacing={3}>
        <Typography>
          <strong>Name:</strong> {selectedData.name}
        </Typography>
        <Typography>
          <strong>Level:</strong> {selectedData.level}%
        </Typography>
        <Typography component="div">
          <strong>Status:</strong>
          <Chip
            label={selectedData.status}
            size="small"
            sx={{
              ml: 1,
              backgroundColor: getStatusColor(selectedData.status).bg,
              color: getStatusColor(selectedData.status).text,
              textTransform: 'capitalize',
            }}
          />
        </Typography>
        <Typography>
          <strong>Created At:</strong> {new Date(selectedData.createdAt).toLocaleString()}
        </Typography>
        <Typography>
          <strong>Updated At:</strong> {new Date(selectedData.updatedAt).toLocaleString()}
        </Typography>
      </Stack>
    );
  };

  const renderEditDialogContent = () => {
    if (!editFormData) return null;

    return (
      <Stack spacing={2} sx={{ mt: 2 }}>
        <TextField
          label="Name"
          value={editFormData.name}
          onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
          fullWidth
          error={!!formErrors.name}
          helperText={formErrors.name}
        />
        <TextField
          label="Level"
          type="number"
          value={editFormData.level}
          onChange={(e) => {
            const value = parseInt(e.target.value) || 0;
            setEditFormData({ ...editFormData, level: Math.min(value, 100) });
          }}
          fullWidth
          inputProps={{ min: 0, max: 100 }}
          error={!!formErrors.level}
          helperText={formErrors.level || 'Enter a value between 0 and 100'}
        />
        <FormControl fullWidth error={!!formErrors.status}>
          <InputLabel>Status</InputLabel>
          <Select
            value={editFormData.status}
            label="Status"
            onChange={(e) =>
              setEditFormData({ ...editFormData, status: e.target.value as 'active' | 'inactive' })
            }
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
          {formErrors.status && <Typography variant="caption" color="error">{formErrors.status}</Typography>}
        </FormControl>
      </Stack>
    );
  };

  const renderAddDialogContent = () => {
    if (!editFormData) return null;

    return (
      <Stack spacing={2} sx={{ mt: 2 }}>
        <TextField
          label="Name"
          value={editFormData.name}
          onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
          fullWidth
          error={!!formErrors.name}
          helperText={formErrors.name}
        />
        <TextField
          label="Level"
          type="number"
          value={editFormData.level}
          onChange={(e) => {
            const value = parseInt(e.target.value) || 0;
            setEditFormData({ ...editFormData, level: Math.min(value, 100) });
          }}
          fullWidth
          inputProps={{ min: 0, max: 100 }}
          error={!!formErrors.level}
          helperText={formErrors.level || 'Enter a value between 0 and 100'}
        />
        <FormControl fullWidth error={!!formErrors.status}>
          <InputLabel>Status</InputLabel>
          <Select
            value={editFormData.status}
            label="Status"
            onChange={(e) =>
              setEditFormData({ ...editFormData, status: e.target.value as 'active' | 'inactive' })
            }
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
          {formErrors.status && <Typography variant="caption" color="error">{formErrors.status}</Typography>}
        </FormControl>
      </Stack>
    );
  };

  // Render content based on loading and data state
  const renderContent = () => {
    if (loading) {
      return isMobile ? renderMobileSkeleton() : renderDesktopTable();
    }

    if (data.length === 0) {
      return (
        <Box sx={{ p: { xs: 2, sm: 3 }, textAlign: 'center' }}>
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
      );
    }

    return isMobile ? (
      <Box sx={{ px: 2, pb: 2 }}>
        {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(renderMobileCard)}
      </Box>
    ) : (
      renderDesktopTable()
    );
  };

  return (
    <ThemeProvider theme={customTheme}>
      <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={isDarkMode ? 'dark' : 'light'}
        />
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
            Portfolio Skills
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddOpen}
            size={isMobile ? 'small' : 'medium'}
          >
            Add Skill
          </Button>
        </Box>
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
              Skills Table
            </Typography>
          </Box>
          {renderContent()}
          {data.length > 0 && <CustomPagination />}
        </Paper>
        <Dialog
          open={viewDialogOpen}
          onClose={handleViewClose}
          maxWidth="sm"
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
          <DialogTitle>Skill Details</DialogTitle>
          <DialogContent>{renderViewDialogContent()}</DialogContent>
          <DialogActions>
            <Button onClick={handleViewClose} variant="outlined" size="medium" color="info">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={editDialogOpen}
          onClose={handleEditClose}
          maxWidth="sm"
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
          <DialogTitle>Edit Skill</DialogTitle>
          <DialogContent>{renderEditDialogContent()}</DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose} variant="outlined" size="medium" color="info">
              Cancel
            </Button>
            <Button onClick={handleEditSave} variant="contained" size="medium" color="success">
              Update
            </Button>
          </DialogActions>
        </Dialog>
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
                color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'inherit',
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
              Are you sure you want to delete this skill record?
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
        <Dialog
          open={addDialogOpen}
          onClose={handleAddClose}
          maxWidth="sm"
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
          <DialogTitle>Add New Skill</DialogTitle>
          <DialogContent>{renderAddDialogContent()}</DialogContent>
          <DialogActions>
            <Button onClick={handleAddClose} variant="outlined" size="medium" color="info">
              Cancel
            </Button>
            <Button onClick={handleAddSave} variant="contained" size="medium" color="success">
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default SkillsPage;