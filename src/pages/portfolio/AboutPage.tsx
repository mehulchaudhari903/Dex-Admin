import React, { useState, useEffect, ReactElement } from 'react';
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
  Collapse,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  PaginationItem,
  Autocomplete,
  InputAdornment,
  Skeleton,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '../../components/Button';
import { getFirebaseDatabase } from '../../firebase/firebaseConfig';
import { ref, onValue, set, push, remove, update } from 'firebase/database';

interface PortfolioData {
  id: string;
  name: string;
  profession: string;
  description: string;
  status: string;
  image?: string;
  socialMediaLinks: string[];
}

const AboutPage: React.FC = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [data, setData] = useState<PortfolioData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<PortfolioData | null>(null);
  const [editFormData, setEditFormData] = useState<PortfolioData | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Initialize Firebase database reference
  const db = getFirebaseDatabase();
  const portfolioRef = ref(db, 'portfolios');

  // Fetch data from Firebase and ensure single active item
  useEffect(() => {
    setLoading(true);
    const unsubscribe = onValue(
      portfolioRef,
      (snapshot) => {
        const data = snapshot.val();
        let portfolioList: PortfolioData[] = [];
        if (data) {
          portfolioList = Object.entries(data).map(([id, value]: [string, any]) => ({
            id,
            name: value.name || '',
            profession: value.profession || '',
            description: value.description || '',
            status: value.status || 'unActive',
            image: value.image || '',
            socialMediaLinks: value.socialMediaLinks || [],
          }));
        }

        // Ensure only one item is active
        const activeCount = portfolioList.filter((item) => item.status === 'active').length;
        if (activeCount > 1) {
          let foundActive = false;
          portfolioList = portfolioList.map((item) => {
            if (item.status === 'active' && !foundActive) {
              foundActive = true;
              return item;
            }
            return { ...item, status: 'unActive' };
          });
          // Update Firebase to reflect single active item
          const updates: { [key: string]: any } = {};
          portfolioList.forEach((item) => {
            updates[`portfolios/${item.id}/status`] = item.status;
          });
          update(ref(db), updates).catch((error) => {
            toast.error('Failed to normalize active status: ' + error.message, { position: 'top-right' });
          });
        }

        setData(portfolioList);
        setLoading(false);
      },
      (error) => {
        toast.error('Failed to fetch data: ' + error.message, { position: 'top-right' });
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Social Media Links Input Component (unchanged)
  const SocialMediaInputComponent = ({
    socialMediaLinks = [],
    onChange,
    error,
    helperText,
  }: {
    socialMediaLinks: string[];
    onChange: (newLinks: string[]) => void;
    error?: boolean;
    helperText?: string;
  }) => {
    const [inputValue, setInputValue] = useState('');

    const handleDelete = (linkToDelete: string) => {
      onChange(socialMediaLinks.filter((link) => link !== linkToDelete));
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' && inputValue) {
        event.preventDefault();
        if (!socialMediaLinks.includes(inputValue) && isValidUrl(inputValue)) {
          onChange([...socialMediaLinks, inputValue]);
          setInputValue('');
        } else {
          toast.error('Please enter a valid URL.', { position: 'top-right' });
        }
      }
    };

    const isValidUrl = (url: string) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    };

    return (
      <Autocomplete
        multiple
        id="social-media-links"
        options={[]}
        value={socialMediaLinks}
        inputValue={inputValue}
        onInputChange={(_, newValue) => setInputValue(newValue)}
        onChange={(_, newValue) => onChange(newValue)}
        freeSolo
        renderTags={(value, getTagProps) =>
          value.map((option, index) => {
            const tagProps = getTagProps({ index });
            const { key, ...otherProps } = tagProps;

            return (
              <Chip
                key={key}
                {...otherProps}
                label={option}
                sx={{
                  backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  color: isDarkMode ? 'white' : 'inherit',
                  '& .MuiChip-deleteIcon': {
                    color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                    '&:hover': {
                      color: isDarkMode ? 'white' : 'rgba(0,0,0,0.9)',
                    },
                  },
                }}
              />
            );
          })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Social Media Links"
            placeholder="Add social media URL"
            onKeyDown={handleKeyDown}
            fullWidth
            error={error}
            helperText={helperText}
            sx={{
              '& .MuiInputLabel-root': {
                color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'inherit',
                '&.Mui-focused': {
                  color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'inherit',
                },
              },
              '& .MuiOutlinedInput-root': {
                color: isDarkMode ? 'white' : 'inherit',
                '& fieldset': {
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.23)',
                },
                '&:hover fieldset': {
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: isDarkMode ? 'white' : theme.palette.primary.main,
                },
              },
            }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {inputValue && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => {
                          if (!socialMediaLinks.includes(inputValue) && isValidUrl(inputValue)) {
                            onChange([...socialMediaLinks, inputValue]);
                            setInputValue('');
                          } else {
                            toast.error('Please enter a valid URL.', { position: 'top-right' });
                          }
                        }}
                        sx={{
                          color: isDarkMode ? 'white' : 'primary.main',
                          mr: 1,
                        }}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  )}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
      />
    );
  };

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
      case 'unActive':
        return { bg: '#EF4444', text: '#ffffff' };
      default:
        return { bg: '#E5E7EB', text: '#374151' };
    }
  };

  const handleViewOpen = (row: PortfolioData) => {
    setSelectedData(row);
    setViewDialogOpen(true);
  };

  const handleViewClose = () => {
    setViewDialogOpen(false);
    setSelectedData(null);
  };

  const handleEditOpen = (row: PortfolioData) => {
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
    if (!editFormData.profession.trim()) errors.profession = 'Profession is required';
    if (!editFormData.description.trim()) errors.description = 'Description is required';
    if (!editFormData.status) errors.status = 'Status is required';
    if (editFormData.image && !isValidUrl(editFormData.image)) errors.image = 'Invalid image URL';
    if (editFormData.socialMediaLinks.some((link) => !isValidUrl(link)))
      errors.socialMediaLinks = 'One or more social media URLs are invalid';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleEditSave = async () => {
    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly.', { position: 'top-right' });
      return;
    }
    if (editFormData) {
      try {
        const updates: { [key: string]: any } = {};
        // Update the edited item
        updates[`portfolios/${editFormData.id}`] = editFormData;
        // If the edited item is active, set all others to unActive
        if (editFormData.status === 'active') {
          data.forEach((item) => {
            if (item.id !== editFormData.id && item.status === 'active') {
              updates[`portfolios/${item.id}/status`] = 'unActive';
            }
          });
        }
        await update(ref(db), updates);
        toast.success('Portfolio updated successfully!', { position: 'top-right' });
        handleEditClose();
      } catch (error: any) {
        toast.error('Failed to update portfolio: ' + error.message, { position: 'top-right' });
      }
    }
  };

  const handleDeleteOpen = (row: PortfolioData) => {
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
        await remove(ref(db, `portfolios/${selectedData.id}`));
        toast.success('Portfolio deleted successfully!', { position: 'top-right' });
        handleDeleteClose();
      } catch (error: any) {
        toast.error('Failed to delete portfolio: ' + error.message, { position: 'top-right' });
      }
    }
  };

  const handleAddOpen = () => {
    setEditFormData({
      id: '', // Will be set by Firebase push
      name: '',
      profession: '',
      description: '',
      status: 'active',
      image: '',
      socialMediaLinks: [],
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
      try {
        const newPortfolioRef = push(portfolioRef);
        const newPortfolio = { ...editFormData, id: newPortfolioRef.key };
        const updates: { [key: string]: any } = {};
        updates[`portfolios/${newPortfolioRef.key}`] = newPortfolio;
        // If the new item is active, set all existing items to unActive
        if (newPortfolio.status === 'active') {
          data.forEach((item) => {
            if (item.status === 'active') {
              updates[`portfolios/${item.id}/status`] = 'unActive';
            }
          });
        }
        await update(ref(db), updates);
        toast.success('Portfolio added successfully!', { position: 'top-right' });
        handleAddClose();
      } catch (error: any) {
        toast.error('Failed to add portfolio: ' + error.message, { position: 'top-right' });
      }
    }
  };

  const toggleRowExpand = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  // Loading skeleton for mobile cards (unchanged)
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

  // Loading skeleton for desktop table rows (unchanged)
  const renderDesktopLoadingSkeleton = () => (
    <TableRow>
      <TableCell><Skeleton variant="text" /></TableCell>
      <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}><Skeleton variant="text" /></TableCell>
      <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}><Skeleton variant="text" /></TableCell>
      <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}><Skeleton variant="circular" width={24} height={24} /></TableCell>
      <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}><Skeleton variant="text" width={100} /></TableCell>
      <TableCell><Skeleton variant="rounded" width={60} height={24} /></TableCell>
      <TableCell>
        <Stack direction="row" spacing={1}>
          <Skeleton variant="circular" width={24} height={24} />
          <Skeleton variant="circular" width={24} height={24} />
          <Skeleton variant="circular" width={24} height={24} />
        </Stack>
      </TableCell>
    </TableRow>
  );

  const renderMobileCard = (row: PortfolioData): ReactElement => (
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
          <Box>
            <Typography variant="body1">{row.profession}</Typography>
            <Typography variant="body2" color="text.secondary">
              {row.description}
            </Typography>
          </Box>
          <Box>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {row.socialMediaLinks.map((link, index) => (
                <Chip
                  key={index}
                  label={new URL(link).hostname}
                  size="small"
                  sx={{
                    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    color: isDarkMode ? 'white' : 'inherit',
                    my: 0.5,
                  }}
                  onClick={() => window.open(link, '_blank')}
                />
              ))}
            </Stack>
          </Box>
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
              <Stack direction="row" spacing={1}>
                {row.image && (
                  <Tooltip title="View Image">
                    <IconButton
                      size="small"
                      onClick={() => toggleRowExpand(row.id)}
                      sx={{ color: isDarkMode ? 'white' : 'inherit' }}
                    >
                      <ImageIcon fontSize="small" />
                      {expandedRow === row.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </Tooltip>
                )}
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
        </Box>
        <Collapse in={expandedRow === row.id}>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Image:
            </Typography>
            {row.image ? (
              <Button
                variant="outlined"
                startIcon={<ImageIcon />}
                onClick={() => window.open(row.image, '_blank')}
                size="small"
              >
                View Image
              </Button>
            ) : (
              <Typography variant="body2" sx={{ color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>
                No image available
              </Typography>
            )}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );

  const renderDesktopTable = (): ReactElement => (
    <TableContainer>
      <Table sx={{ minWidth: 650 }} aria-label="About table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'inherit' }}>Name</TableCell>
            <TableCell sx={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'inherit', display: { xs: 'none', md: 'table-cell' } }}>
              Profession
            </TableCell>
            <TableCell sx={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'inherit', display: { xs: 'none', md: 'table-cell' } }}>
              Description
            </TableCell>
            <TableCell sx={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'inherit', display: { xs: 'none', md: 'table-cell' } }}>
              Image
            </TableCell>
            <TableCell sx={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'inherit', display: { xs: 'none', sm: 'table-cell' } }}>
              Social Media
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
              <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                <Typography variant="body1" color="textSecondary">
                  No Data Found
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ color: isDarkMode ? 'white' : 'inherit' }}>{row.name}</TableCell>
                  <TableCell sx={{ color: isDarkMode ? 'white' : 'inherit', display: { xs: 'none', md: 'table-cell' } }}>
                    {row.profession}
                  </TableCell>
                  <TableCell sx={{ color: isDarkMode ? 'white' : 'inherit', display: { xs: 'none', md: 'table-cell' } }}>
                    {row.description}
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                    {row.image ? (
                      <Tooltip title="View Image">
                        <IconButton
                          size="small"
                          onClick={() => window.open(row.image, '_blank')}
                          sx={{ color: isDarkMode ? 'white' : 'inherit' }}
                        >
                          <ImageIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {row.socialMediaLinks.map((link, index) => (
                        <Chip
                          key={index}
                          label={new URL(link).hostname}
                          size="small"
                          sx={{
                            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                            color: isDarkMode ? 'white' : 'inherit',
                            my: 0.5,
                          }}
                          onClick={() => window.open(link, '_blank')}
                        />
                      ))}
                    </Stack>
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
                        <IconButton size="small" onClick={() => handleViewOpen(row)} sx={{ color: isDarkMode ? 'white' : 'inherit' }}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => handleEditOpen(row)} sx={{ color: isDarkMode ? 'white' : 'inherit' }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => handleDeleteOpen(row)} sx={{ color: isDarkMode ? 'white' : 'inherit' }}>
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
            <InputLabel id="rows-per-page-label" sx={{ color: isDarkMode ? 'white' : 'inherit' }}>
              Rows
            </InputLabel>
            <Select
              labelId="rows-per-page-label"
              value={rowsPerPage}
              label="Rows"
              onChange={(e) => handleChangeRowsPerPage(e as any)}
              sx={{
                minWidth: 80,
                color: isDarkMode ? 'white' : 'inherit',
                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.main,
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.main,
                },
                '.MuiSelect-icon': {
                  color: isDarkMode ? 'white' : 'inherit',
                },
              }}
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
                      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : theme.palette.primary.dark,
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
          <strong>Profession:</strong> {selectedData.profession}
        </Typography>
        <Typography>
          <strong>Description:</strong> {selectedData.description}
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
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            <strong>Social Media Links:</strong>
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {selectedData.socialMediaLinks.length > 0 ? (
              selectedData.socialMediaLinks.map((link, index) => (
                <Chip
                  key={index}
                  label={new URL(link).hostname}
                  size="small"
                  sx={{
                    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    color: isDarkMode ? 'white' : 'inherit',
                    my: 0.5,
                  }}
                  onClick={() => window.open(link, '_blank')}
                />
              ))
            ) : (
              <Typography variant="body2" sx={{ color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>
                No links available
              </Typography>
            )}
          </Stack>
        </Box>
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            <strong>Image:</strong>
          </Typography>
          {selectedData.image ? (
            <Box
              sx={{
                width: 150,
                height: 150,
                border: '1px solid',
                borderColor: isDarkMode ? 'rgba(255,255,255,0.23)' : 'rgba(0,0,0,0.23)',
                borderRadius: 1,
                overflow: 'hidden',
                position: 'relative',
                cursor: 'pointer',
                backgroundImage: `url(${selectedData.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                '&:hover': {
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.3)',
                  },
                  '& .MuiSvgIcon-root': {
                    opacity: 1,
                  },
                },
              }}
              onClick={() => window.open(selectedData.image, '_blank')}
            >
              <VisibilityIcon
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: 'white',
                  opacity: 0,
                  fontSize: 32,
                  transition: 'opacity 0.2s ease-in-out',
                  filter: 'drop-shadow(0px 0px 2px rgba(0,0,0,0.5))',
                }}
              />
            </Box>
          ) : (
            <Typography variant="body2" sx={{ color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>
              No image available
            </Typography>
          )}
        </Box>
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
          sx={{
            '& .MuiInputLabel-root': {
              color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'inherit',
              '&.Mui-focused': {
                color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'inherit',
              },
            },
            '& .MuiOutlinedInput-root': {
              color: isDarkMode ? 'white' : 'inherit',
              '& fieldset': {
                borderColor: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.23)',
              },
              '&:hover fieldset': {
                borderColor: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.5)',
              },
              '&.Mui-focused fieldset': {
                borderColor: isDarkMode ? 'white' : theme.palette.primary.main,
              },
            },
          }}
        />
        <TextField
          label="Profession"
          value={editFormData.profession}
          onChange={(e) => setEditFormData({ ...editFormData, profession: e.target.value })}
          fullWidth
          error={!!formErrors.profession}
          helperText={formErrors.profession}
          sx={{
            '& .MuiInputLabel-root': {
              color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'inherit',
              '&.Mui-focused': {
                color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'inherit',
              },
            },
            '& .MuiOutlinedInput-root': {
              color: isDarkMode ? 'white' : 'inherit',
              '& fieldset': {
                borderColor: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.23)',
              },
              '&:hover fieldset': {
                borderColor: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.5)',
              },
              '&.Mui-focused fieldset': {
                borderColor: isDarkMode ? 'white' : theme.palette.primary.main,
              },
            },
          }}
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
          sx={{
            '& .MuiInputLabel-root': {
              color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'inherit',
              '&.Mui-focused': {
                color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'inherit',
              },
            },
            '& .MuiOutlinedInput-root': {
              color: isDarkMode ? 'white' : 'inherit',
              '& fieldset': {
                borderColor: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.23)',
              },
              '&:hover fieldset': {
                borderColor: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.5)',
              },
              '&.Mui-focused fieldset': {
                borderColor: isDarkMode ? 'white' : theme.palette.primary.main,
              },
            },
          }}
        />
        <SocialMediaInputComponent
          socialMediaLinks={editFormData.socialMediaLinks}
          onChange={(newLinks) => setEditFormData({ ...editFormData, socialMediaLinks: newLinks })}
          error={!!formErrors.socialMediaLinks}
          helperText={formErrors.socialMediaLinks}
        />
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle1"
            sx={{
              mb: 1.5,
              fontWeight: 500,
              color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.85)',
              fontSize: { xs: '0.9rem', sm: '1rem' },
            }}
          >
            Image
          </Typography>
          {editFormData.image ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 1, sm: 2 },
                p: 1,
                borderRadius: 1,
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.01)',
              }}
            >
              <Box
                sx={{
                  width: { xs: 100, sm: 120, md: 140 },
                  height: { xs: 100, sm: 120, md: 140 },
                  border: '1px solid',
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.23)' : 'rgba(0,0,0,0.23)',
                  borderRadius: 1,
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.2)' : '0 2px 6px rgba(0,0,0,0.05)',
                  transition: 'border-color 0.2s ease',
                  '&:hover': {
                    borderColor: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
                  },
                }}
              >
                <img
                  src={editFormData.image}
                  alt="Portfolio"
                  style={{
                    maxWidth: '96%',
                    maxHeight: '96%',
                    objectFit: 'contain',
                  }}
                  onError={() => setEditFormData({ ...editFormData, image: '' })}
                />
              </Box>
              <IconButton
                size="medium"
                onClick={() => {
                  if (editFormData.image?.startsWith('blob:')) {
                    URL.revokeObjectURL(editFormData.image);
                  }
                  setEditFormData({ ...editFormData, image: '' });
                }}
                sx={{
                  color: isDarkMode ? 'rgba(255,100,100,0.9)' : 'error.main',
                  backgroundColor: isDarkMode ? 'rgba(30,30,30,0.85)' : 'rgba(255,255,255,0.95)',
                  border: `1px solid ${isDarkMode ? 'rgba(255,100,100,0.3)' : 'rgba(211,47,47,0.2)'}`,
                  p: { xs: 1.5, sm: 1 },
                  '&:hover': {
                    backgroundColor: isDarkMode ? 'rgba(50,30,30,0.9)' : 'rgba(255,245,245,1)',
                    boxShadow: '0 2px 6px rgba(211,47,47,0.2)',
                  },
                  boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                  transition: 'all 0.2s ease',
                }}
              >
                <DeleteIcon fontSize="medium" />
              </IconButton>
            </Box>
          ) : (
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 1, sm: 2 }}
              sx={{
                mb: 2,
                alignItems: { xs: 'stretch', sm: 'center' },
              }}
            >
              <Button
                variant="outlined"
                component="label"
                sx={{
                  color: isDarkMode ? 'white' : 'inherit',
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                  borderStyle: 'dashed',
                  '&:hover': {
                    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                  },
                  width: { xs: '100%', sm: 120, md: 140 },
                  height: { xs: 100, sm: 120, md: 140 },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  borderRadius: 1,
                }}
              >
                <AddIcon sx={{ mb: 1, color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  }}
                >
                  Upload Image
                </Typography>
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && file.type.startsWith('image/')) {
                      const fileURL = URL.createObjectURL(file);
                      setEditFormData({ ...editFormData, image: fileURL });
                    }
                  }}
                />
              </Button>
              <Typography
                variant="subtitle1"
                sx={{
                  mb: { xs: 0.5, sm: 0 },
                  alignSelf: 'center',
                  color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)',
                  px: 1,
                  display: { xs: 'block', sm: 'inline' },
                  textAlign: { xs: 'center', sm: 'left' },
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                }}
              >
                OR
              </Typography>
              <TextField
                label="Image URL"
                placeholder="/images/empty_image.jpg"
                value=""
                onChange={(e) => {
                  const url = e.target.value.trim();
                  if (url) {
                    setEditFormData({ ...editFormData, image: url });
                    e.target.value = '';
                  }
                }}
                fullWidth
                size="small"
                error={!!formErrors.image}
                helperText={formErrors.image}
                sx={{
                  '& .MuiInputLabel-root': {
                    color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'inherit',
                    '&.Mui-focused': {
                      color: isDarkMode ? 'rgba(255,255,255,0.9)' : theme.palette.primary.main,
                    },
                    fontSize: { xs: '0.85rem', sm: '0.875rem' },
                  },
                  '& .MuiOutlinedInput-root': {
                    color: isDarkMode ? 'white' : 'inherit',
                    '& fieldset': {
                      borderColor: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: isDarkMode ? 'rgba(255,255,255,0.9)' : theme.palette.primary.main,
                    },
                  },
                  maxWidth: { xs: '100%', sm: '250px', md: '300px' },
                }}
              />
            </Stack>
          )}
        </Box>
        <Button
          variant="outlined"
          onClick={() =>
            setEditFormData({
              ...editFormData,
              status: editFormData.status === 'active' ? 'unActive' : 'active',
            })
          }
          sx={{
            color: isDarkMode ? 'white' : 'inherit',
            borderColor: isDarkMode ? 'rgba(255,255,255,0.23)' : 'rgba(0,0,0,0.23)',
            '&:hover': {
              borderColor: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
              backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)',
            },
          }}
        >
          Toggle Status: {editFormData.status}
        </Button>
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
          sx={{
            '& .MuiInputLabel-root': {
              color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'inherit',
              '&.Mui-focused': {
                color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'inherit',
              },
            },
            '& .MuiOutlinedInput-root': {
              color: isDarkMode ? 'white' : 'inherit',
              '& fieldset': {
                borderColor: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.23)',
              },
              '&:hover fieldset': {
                borderColor: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.5)',
              },
              '&.Mui-focused fieldset': {
                borderColor: isDarkMode ? 'white' : theme.palette.primary.main,
              },
            },
          }}
        />
        <TextField
          label="Profession"
          value={editFormData.profession}
          onChange={(e) => setEditFormData({ ...editFormData, profession: e.target.value })}
          fullWidth
          error={!!formErrors.profession}
          helperText={formErrors.profession}
          sx={{
            '& .MuiInputLabel-root': {
              color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'inherit',
              '&.Mui-focused': {
                color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'inherit',
              },
            },
            '& .MuiOutlinedInput-root': {
              color: isDarkMode ? 'white' : 'inherit',
              '& fieldset': {
                borderColor: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.23)',
              },
              '&:hover fieldset': {
                borderColor: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.5)',
              },
              '&.Mui-focused fieldset': {
                borderColor: isDarkMode ? 'white' : theme.palette.primary.main,
              },
            },
          }}
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
          sx={{
            '& .MuiInputLabel-root': {
              color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'inherit',
              '&.Mui-focused': {
                color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'inherit',
              },
            },
            '& .MuiOutlinedInput-root': {
              color: isDarkMode ? 'white' : 'inherit',
              '& fieldset': {
                borderColor: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.23)',
              },
              '&:hover fieldset': {
                borderColor: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.5)',
              },
              '&.Mui-focused fieldset': {
                borderColor: isDarkMode ? 'white' : theme.palette.primary.main,
              },
            },
          }}
        />
        <SocialMediaInputComponent
          socialMediaLinks={editFormData.socialMediaLinks}
          onChange={(newLinks) => setEditFormData({ ...editFormData, socialMediaLinks: newLinks })}
          error={!!formErrors.socialMediaLinks}
          helperText={formErrors.socialMediaLinks}
        />
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle1"
            sx={{
              mb: 1.5,
              fontWeight: 500,
              color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.85)',
              fontSize: { xs: '0.9rem', sm: '1rem' },
            }}
          >
            Image
          </Typography>
          {editFormData.image ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 1, sm: 2 },
                p: 1,
                borderRadius: 1,
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.01)',
              }}
            >
              <Box
                sx={{
                  width: { xs: 100, sm: 120, md: 140 },
                  height: { xs: 100, sm: 120, md: 140 },
                  border: '1px solid',
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.23)' : 'rgba(0,0,0,0.23)',
                  borderRadius: 1,
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.2)' : '0 2px 6px rgba(0,0,0,0.05)',
                  transition: 'border-color 0.2s ease',
                  '&:hover': {
                    borderColor: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
                  },
                }}
              >
                <img
                  src={editFormData.image}
                  alt="Portfolio"
                  style={{
                    maxWidth: '96%',
                    maxHeight: '96%',
                    objectFit: 'contain',
                  }}
                  onError={() => setEditFormData({ ...editFormData, image: '' })}
                />
              </Box>
              <IconButton
                size="medium"
                onClick={() => {
                  if (editFormData.image?.startsWith('blob:')) {
                    URL.revokeObjectURL(editFormData.image);
                  }
                  setEditFormData({ ...editFormData, image: '' });
                }}
                sx={{
                  color: isDarkMode ? 'rgba(255,100,100,0.9)' : 'error.main',
                  backgroundColor: isDarkMode ? 'rgba(30,30,30,0.85)' : 'rgba(255,255,255,0.95)',
                  border: `1px solid ${isDarkMode ? 'rgba(255,100,100,0.3)' : 'rgba(211,47,47,0.2)'}`,
                  p: { xs: 1.5, sm: 1 },
                  '&:hover': {
                    backgroundColor: isDarkMode ? 'rgba(50,30,30,0.9)' : 'rgba(255,245,245,1)',
                    boxShadow: '0 2px 6px rgba(211,47,47,0.2)',
                  },
                  boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                  transition: 'all 0.2s ease',
                }}
              >
                <DeleteIcon fontSize="medium" />
              </IconButton>
            </Box>
          ) : (
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 1, sm: 2 }}
              sx={{
                mb: 2,
                alignItems: { xs: 'stretch', sm: 'center' },
              }}
            >
              <Button
                variant="outlined"
                component="label"
                sx={{
                  color: isDarkMode ? 'white' : 'inherit',
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                  borderStyle: 'dashed',
                  '&:hover': {
                    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                  },
                  width: { xs: '100%', sm: 120, md: 140 },
                  height: { xs: 100, sm: 120, md: 140 },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  borderRadius: 1,
                }}
              >
                <AddIcon sx={{ mb: 1, color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  }}
                >
                  Upload Image
                </Typography>
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && file.type.startsWith('image/')) {
                      const fileURL = URL.createObjectURL(file);
                      setEditFormData({ ...editFormData, image: fileURL });
                    }
                  }}
                />
              </Button>
              <Typography
                variant="subtitle1"
                sx={{
                  mb: { xs: 0.5, sm: 0 },
                  alignSelf: 'center',
                  color: isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)',
                  px: 1,
                  display: { xs: 'block', sm: 'inline' },
                  textAlign: { xs: 'center', sm: 'left' },
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                }}
              >
                OR
              </Typography>
              <TextField
                label="Image URL"
                placeholder="/images/empty_image.jpg"
                value=""
                onChange={(e) => {
                  const url = e.target.value.trim();
                  if (url) {
                    setEditFormData({ ...editFormData, image: url });
                    e.target.value = '';
                  }
                }}
                fullWidth
                size="small"
                error={!!formErrors.image}
                helperText={formErrors.image}
                sx={{
                  '& .MuiInputLabel-root': {
                    color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'inherit',
                    '&.Mui-focused': {
                      color: isDarkMode ? 'rgba(Oak,255,255,0.9)' : theme.palette.primary.main,
                    },
                    fontSize: { xs: '0.85rem', sm: '0.875rem' },
                  },
                  '& .MuiOutlinedInput-root': {
                    color: isDarkMode ? 'white' : 'inherit',
                    '& fieldset': {
                      borderColor: isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: isDarkMode ? 'rgba(255,255,255,0.9)' : theme.palette.primary.main,
                    },
                  },
                  maxWidth: { xs: '100%', sm: '250px', md: '300px' },
                }}
              />
            </Stack>
          )}
        </Box>
        <Button
          variant="outlined"
          onClick={() =>
            setEditFormData({
              ...editFormData,
              status: editFormData.status === 'active' ? 'unActive' : 'active',
            })
          }
          sx={{
            color: isDarkMode ? 'white' : 'inherit',
            borderColor: isDarkMode ? 'rgba(255,255,255,0.23)' : 'rgba(0,0,0,0.23)',
            '&:hover': {
              borderColor: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
              backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)',
            },
          }}
        >
          Toggle Status: {editFormData.status}
        </Button>
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
          Portfolio About
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddOpen}
          size={isMobile ? 'small' : 'medium'}
        >
          Add Record
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
            About Table
          </Typography>
        </Box>
        {renderContent()}
        {data.length > 0 && <CustomPagination />}
      </Paper>
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
        <DialogTitle>View Details</DialogTitle>
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
        <DialogTitle>Edit Details</DialogTitle>
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
            Are you sure you want to delete this record?
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
        <DialogTitle>Add New Record</DialogTitle>
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
  );
};

export default AboutPage;