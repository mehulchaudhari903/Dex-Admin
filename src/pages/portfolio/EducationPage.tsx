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
  Collapse,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  PaginationItem,
  SelectChangeEvent,
  ThemeProvider,
  createTheme,
  Skeleton,
  Fade,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '../../components/Button';
import { getFirebaseDatabase } from '../../firebase/firebaseConfig';
import { ref, onValue, set, push, update, remove } from 'firebase/database';

interface EducationData {
  id: string;
  createdAt: string;
  description: string;
  duration: string;
  institution: string;
  position: 'left' | 'right';
  status: 'active' | 'inactive';
  title: string;
  updatedAt: string;
}

const EducationPage: React.FC = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
        },
      }),
    [theme, isDarkMode]
  );

  const [data, setData] = useState<EducationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<EducationData | null>(null);
  const [editFormData, setEditFormData] = useState<EducationData | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const db = getFirebaseDatabase();

  useEffect(() => {
    console.log('Fetching education data...');
    const educationRef = ref(db, 'education');
    const unsubscribe = onValue(
      educationRef,
      (snapshot) => {
        const educationData = snapshot.val();
        const educationList: EducationData[] = [];
        if (educationData) {
          Object.keys(educationData).forEach((key) => {
            educationList.push({
              id: key,
              ...educationData[key],
            });
          });
        }
        setData(educationList);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching education:', error);
        toast.error('Failed to fetch education data.', { position: 'top-right' });
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [db]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: SelectChangeEvent<number>) => {
    setRowsPerPage(parseInt(event.target.value as string, 10));
    setPage(0);
  };

  const handleViewOpen = (row: EducationData) => {
    setSelectedData(row);
    setViewDialogOpen(true);
  };

  const handleViewClose = () => {
    setViewDialogOpen(false);
    setSelectedData(null);
  };

  const handleEditOpen = (row: EducationData) => {
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
    if (!editFormData.title.trim()) errors.title = 'Title is required';
    if (!editFormData.institution.trim()) errors.institution = 'Institution is required';
    if (!editFormData.duration.trim()) errors.duration = 'Duration is required';
    if (!editFormData.description.trim()) errors.description = 'Description is required';
    if (!editFormData.position) errors.position = 'Position is required';
    if (!editFormData.status) errors.status = 'Status is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEditSave = async () => {
    if (!validateForm()) {
      toast.error('Please fill in all required fields.', { position: 'top-right' });
      return;
    }
    if (editFormData) {
      const updatedEducation = {
        ...editFormData,
        updatedAt: new Date().toISOString(),
      };
      try {
        await update(ref(db, `education/${editFormData.id}`), updatedEducation);
        toast.success('Education updated successfully!', { position: 'top-right' });
        handleEditClose();
      } catch (error) {
        console.error('Error updating education:', error);
        toast.error('Failed to update education.', { position: 'top-right' });
      }
    }
  };

  const handleDeleteOpen = (row: EducationData) => {
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
        await remove(ref(db, `education/${selectedData.id}`));
        toast.success('Education deleted successfully!', { position: 'top-right' });
        handleDeleteClose();
      } catch (error) {
        console.error('Error deleting education:', error);
        toast.error('Failed to delete education.', { position: 'top-right' });
      }
    }
  };

  const handleAddOpen = () => {
    setEditFormData({
      id: '',
      title: '',
      institution: '',
      duration: '',
      description: '',
      position: 'left',
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
      toast.error('Please fill in all required fields.', { position: 'top-right' });
      return;
    }
    if (editFormData) {
      const newEducation = {
        title: editFormData.title,
        institution: editFormData.institution,
        duration: editFormData.duration,
        description: editFormData.description,
        position: editFormData.position,
        status: editFormData.status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      try {
        const newEducationRef = push(ref(db, 'education'));
        await set(newEducationRef, newEducation);
        toast.success('Education added successfully!', { position: 'top-right' });
        handleAddClose();
      } catch (error) {
        console.error('Error adding education:', error);
        toast.error('Failed to add education.', { position: 'top-right' });
      }
    }
  };

  const toggleRowExpand = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const renderMobileCard = (row: EducationData): ReactElement => (
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
              {row.title}
            </Typography>
            <Typography variant="caption" sx={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'inherit' }}>
              {row.status}
            </Typography>
          </Box>
          <Typography variant="body2">{row.description}</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
            <Stack direction="row" spacing={1}>
              <Tooltip title="View Details">
                <IconButton
                  size="small"
                  onClick={() => toggleRowExpand(row.id)}
                  sx={{ color: isDarkMode ? 'white' : 'inherit' }}
                >
                  {expandedRow === row.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Tooltip>
            </Stack>
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
        <Collapse in={expandedRow === row.id}>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Details:
            </Typography>
            <Typography variant="body2">
              <strong>Institution:</strong> {row.institution}
            </Typography>
            <Typography variant="body2">
              <strong>Duration:</strong> {row.duration}
            </Typography>
            <Typography variant="body2">
              <strong>Position:</strong> {row.position}
            </Typography>
            <Typography variant="body2">
              <strong>Status:</strong> {row.status}
            </Typography>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );

  const renderMobileSkeleton = (): ReactElement => (
    <Box sx={{ px: 2, pb: 2 }}>
      {[...Array(Math.min(data.length || rowsPerPage, rowsPerPage))].map((_, index) => (
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
                <Skeleton variant="text" width="60%" height={24} animation="wave" />
                <Skeleton variant="text" width="20%" height={20} animation="wave" />
              </Box>
              <Skeleton variant="text" width="90%" height={20} animation="wave" />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                <Stack direction="row" spacing={1}>
                  <Skeleton variant="circular" width={24} height={24} animation="wave" />
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Skeleton variant="circular" width={24} height={24} animation="wave" />
                  <Skeleton variant="circular" width={24} height={24} animation="wave" />
                  <Skeleton variant="circular" width={24} height={24} animation="wave" />
                </Stack>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  const renderDesktopTable = (): ReactElement => (
    <TableContainer>
      <Table sx={{ minWidth: 650 }} aria-label="Education table">
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Institution</TableCell>
            <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Duration</TableCell>
            <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Status</TableCell>
            <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Description</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            [...Array(rowsPerPage)].map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton variant="text" animation="wave" /></TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                  <Skeleton variant="text" animation="wave" />
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                  <Skeleton variant="text" animation="wave" />
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                  <Skeleton variant="text" animation="wave" />
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                  <Skeleton variant="text" animation="wave" />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Skeleton variant="circular" width={24} height={24} animation="wave" />
                    <Skeleton variant="circular" width={24} height={24} animation="wave" />
                    <Skeleton variant="circular" width={24} height={24} animation="wave" />
                  </Stack>
                </TableCell>
              </TableRow>
            ))
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                <Typography variant="body1" color="textSecondary">
                  No Data Found
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.title}</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{row.institution}</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{row.duration}</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{row.status}</TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                  {row.description.substring(0, 50)}...
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <IconButton size="small" onClick={() => handleViewOpen(row)}>
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleEditOpen(row)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDeleteOpen(row)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const CustomPagination = () => {
    const pageCount = Math.ceil(data.length / rowsPerPage);
    const currentPage = page + 1;

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
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, order: { xs: 2, sm: 1 } }}>
          <FormControl size={isMobile ? 'small' : 'medium'} variant="outlined">
            <InputLabel>Rows</InputLabel>
            <Select value={rowsPerPage} label="Rows" onChange={handleChangeRowsPerPage}>
              <MenuItem value={5}>5 per page</MenuItem>
              <MenuItem value={10}>10 per page</MenuItem>
              <MenuItem value={25}>25 per page</MenuItem>
            </Select>
          </FormControl>
          <Typography variant={isMobile ? 'body2' : 'body1'} color="textSecondary">
            {`${page * rowsPerPage + 1}-${Math.min((page + 1) * rowsPerPage, data.length)} of ${data.length}`}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', order: { xs: 1, sm: 2 }, flex: 1 }}>
          <Pagination
            count={pageCount}
            page={currentPage}
            onChange={(e, value) => handleChangePage(null, value - 1)}
            size={isMobile ? 'small' : 'medium'}
            siblingCount={isMobile ? 0 : 1}
            boundaryCount={isMobile ? 1 : 2}
          />
        </Box>
      </Box>
    );
  };

  const renderViewDialogContent = () => {
    if (!selectedData) return null;

    return (
      <Stack spacing={3}>
        <Typography><strong>Title:</strong> {selectedData.title}</Typography>
        <Typography><strong>Institution:</strong> {selectedData.institution}</Typography>
        <Typography><strong>Duration:</strong> {selectedData.duration}</Typography>
        <Typography><strong>Description:</strong> {selectedData.description}</Typography>
        <Typography><strong>Status:</strong> {selectedData.status}</Typography>
        <Typography><strong>Position:</strong> {selectedData.position}</Typography>
        <Typography><strong>Created At:</strong> {new Date(selectedData.createdAt).toLocaleString()}</Typography>
        <Typography><strong>Updated At:</strong> {new Date(selectedData.updatedAt).toLocaleString()}</Typography>
      </Stack>
    );
  };

  const renderEditDialogContent = () => {
    if (!editFormData) return null;

    return (
      <Stack spacing={2} sx={{ mt: 2 }}>
        <TextField
          label="Title"
          value={editFormData.title}
          onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
          fullWidth
          error={!!formErrors.title}
          helperText={formErrors.title}
        />
        <TextField
          label="Institution"
          value={editFormData.institution}
          onChange={(e) => setEditFormData({ ...editFormData, institution: e.target.value })}
          fullWidth
          error={!!formErrors.institution}
          helperText={formErrors.institution}
        />
        <TextField
          label="Duration"
          value={editFormData.duration}
          onChange={(e) => setEditFormData({ ...editFormData, duration: e.target.value })}
          fullWidth
          error={!!formErrors.duration}
          helperText={formErrors.duration}
        />
        <TextField
          label="Description"
          value={editFormData.description}
          onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
          fullWidth
          multiline
          rows={3}
          error={!!formErrors.description}
          helperText={formErrors.description}
        />
        <FormControl fullWidth error={!!formErrors.position}>
          <InputLabel>Position</InputLabel>
          <Select
            value={editFormData.position}
            label="Position"
            onChange={(e) => setEditFormData({ ...editFormData, position: e.target.value as 'left' | 'right' })}
          >
            <MenuItem value="left">Left</MenuItem>
            <MenuItem value="right">Right</MenuItem>
          </Select>
          {formErrors.position && <Typography variant="caption" color="error">{formErrors.position}</Typography>}
        </FormControl>
        <FormControl fullWidth error={!!formErrors.status}>
          <InputLabel>Status</InputLabel>
          <Select
            value={editFormData.status}
            label="Status"
            onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value as 'active' | 'inactive' })}
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
          {formErrors.status && <Typography variant="caption" color="error">{formErrors.status}</Typography>}
        </FormControl>
      </Stack>
    );
  };

  const renderAddDialogContent = () => renderEditDialogContent();

  // const renderContent = () => {
  //   if (loading) {
  //     return isMobile ? renderMobileSkeleton() : renderDesktopTable();
  //   }
  //   // if (data.length === 0) {
  //   //   return (
  //   //     <Box sx={{ p: { xs: 2, sm: 3 }, textAlign: 'center' }}>
  //   //       <Typography variant="body1" color="textSecondary">
  //   //         No Data Found
  //   //       </Typography>
  //   //     </Box>
  //   //   );
  //   // }
    
  //   return isMobile ? (
  //     <Box sx={{ px: 2, pb: 2 }}>
  //       {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(renderMobileCard)}
  //     </Box>
  //   ) : (
  //     renderDesktopTable()
  //   );
  // };

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
          <Typography variant={isMobile ? 'h5' : 'h4'} sx={{ fontWeight: 'bold' }}>
            Portfolio Education
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddOpen}
              size={isMobile ? 'small' : 'medium'}
            >
              Add Education
            </Button>
          </Box>
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
            <Typography variant={isMobile ? 'subtitle1' : 'h6'}>
              Education Table
            </Typography>
          </Box>
          {renderContent()}
          {data.length > 0 && !loading && <CustomPagination />}
        </Paper>
        
        {/* View Dialog */}
        <Dialog
          open={viewDialogOpen}
          onClose={handleViewClose}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Education Details</DialogTitle>
          <DialogContent>{renderViewDialogContent()}</DialogContent>
          <DialogActions>
            <Button onClick={handleViewClose} variant="outlined" color="info">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Edit Dialog */}
        <Dialog
          open={editDialogOpen}
          onClose={handleEditClose}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Edit Education</DialogTitle>
          <DialogContent>{renderEditDialogContent()}</DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose} variant="outlined" color="info">
              Cancel
            </Button>
            <Button onClick={handleEditSave} variant="contained" color="success">
              Update
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Delete Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteClose}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this education record?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteClose} variant="outlined" color="info">
              Cancel
            </Button>
            <Button onClick={handleDeleteConfirm} variant="contained" color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Add Dialog */}
        <Dialog
          open={addDialogOpen}
          onClose={handleAddClose}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Add Education</DialogTitle>
          <DialogContent>{renderAddDialogContent()}</DialogContent>
          <DialogActions>
            <Button onClick={handleAddClose} variant="outlined" color="info">
              Cancel
            </Button>
            <Button onClick={handleAddSave} variant="contained" color="success">
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default EducationPage;