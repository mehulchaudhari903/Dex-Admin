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
  CircularProgress,
  Skeleton,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Link as LinkIcon,
  GitHub as GitHubIcon,
  Public as PublicIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import Button from '../../components/Button';
import { getFirebaseDatabase } from '../../firebase/firebaseConfig';
import { ref as dbRef, set, update, remove, push, onValue } from 'firebase/database';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Portfolio data interface
interface DialogData {
  id: string;
  title: string;
  description: string;
  github: string;
  images: string[];
  live: string;
  techStack: string[];
  views: number;
  status: 'active' | 'unActive';
  updatedAt: string;
}

// Skills Input Component
const SkillsInputComponent = ({
  skills = [],
  onChange,
}: {
  skills: string[];
  onChange: (newSkills: string[]) => void;
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [inputValue, setInputValue] = useState('');
  const skillOptions = [
    'JavaScript', 'React', 'TypeScript', 'Node.js', 'HTML', 'CSS',
    'Angular', 'Vue.js', 'Python', 'Django', 'Flask', 'Java',
    'Spring', 'PHP', 'Laravel', 'Ruby', 'Rails', 'C#', '.NET',
    'SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'GraphQL', 'REST API',
    'Docker', 'Kubernetes', 'AWS', 'Azure', 'Git', 'GitLab',
    'GitHub', 'Jira', 'Agile', 'Scrum',
  ].filter((option) => !skills.includes(option));

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && inputValue) {
      event.preventDefault();
      if (!skills.includes(inputValue)) {
        onChange([...skills, inputValue]);
        setInputValue('');
      }
    }
  };

  return (
    <Autocomplete
      multiple
      id="skills-tags"
      options={skillOptions}
      value={skills}
      inputValue={inputValue}
      onInputChange={(_, newValue) => setInputValue(newValue)}
      onChange={(_, newValue) => onChange(newValue)}
      freeSolo
      renderTags={(value, getTagProps) =>
        value.map((option, index) => {
          const { key, ...chipProps } = getTagProps({ index });
          return (
            <Chip
              key={key}
              label={option}
              {...chipProps}
              sx={{
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                color: isDarkMode ? 'white' : 'inherit',
              }}
            />
          );
        })
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label="Tech Stack"
          placeholder="Add technologies"
          onKeyDown={handleKeyDown}
          fullWidth
          sx={{
            '& .MuiInputLabel-root': {
              color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'inherit',
              '&.Mui-focused': {
                color: isDarkMode ? 'white' : theme.palette.primary.main,
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
              <>
                {inputValue && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => {
                        if (!skills.includes(inputValue)) {
                          onChange([...skills, inputValue]);
                          setInputValue('');
                        }
                      }}
                      sx={{ color: isDarkMode ? 'white' : 'primary.main', mr: 1 }}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                )}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

const ProjectsPage: React.FC = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [data, setData] = useState<DialogData[]>([]);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedData, setSelectedData] = useState<DialogData | null>(null);
  const [editFormData, setEditFormData] = useState<DialogData | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Initialize Firebase database
  const database = getFirebaseDatabase();

  // Fetch data from Firebase Realtime Database
  useEffect(() => {
    setLoading(true);
    const projectsRef = dbRef(database, 'projects');
    const unsubscribe = onValue(projectsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const projectsArray = Object.entries(data).map(([key, value]: [string, any]) => ({
          id: key,
          title: value.title || '',
          description: value.description || '',
          github: value.github || '',
          images: value.images || [],
          live: value.live || '',
          techStack: value.techStack || [],
          views: value.views || 0,
          status: value.status || 'active',
          updatedAt: value.updatedAt || new Date().toISOString(),
        }));
        setData(projectsArray);
      } else {
        setData([]);
      }
      setLoading(false);
    }, (error) => {
      console.error('Error fetching projects:', error);
      toast.error('Failed to fetch projects');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [database]);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // Reset image and preview when dialogs close
  useEffect(() => {
    if (!editDialogOpen && !addDialogOpen) {
      setImage(null);
      setPreview(null);
      setFormErrors({});
    }
  }, [editDialogOpen, addDialogOpen]);

  // Validate form fields
  const validateForm = (formData: DialogData) => {
    const errors: { [key: string]: string } = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (formData.techStack.length === 0) errors.techStack = 'At least one technology is required';
    return errors;
  };

  // Handle file input change with 5 MB size validation
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB in bytes
    if (file && editFormData) {
      if (file.size > MAX_IMAGE_SIZE) {
        toast.error('Image size exceeds 5 MB limit.');
        return;
      }
      setImage(file);
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);

      // Convert to base64 and update editFormData
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setEditFormData({
            ...editFormData,
            images: [...editFormData.images, reader.result],
          });
          localStorage.setItem('uploadedImage', reader.result);
        }
      };
      reader.onerror = () => {
        console.error('Error reading file');
        toast.error('Failed to read image');
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image preview
  const handleImagePreviewOpen = (image: string, index: number, images: string[]) => {
    setSelectedImage(image);
    setSelectedImageIndex(index);
    setSelectedImages(images);
    setImagePreviewOpen(true);
  };

  const handleImagePreviewClose = () => {
    setImagePreviewOpen(false);
    setSelectedImage(null);
    setSelectedImageIndex(0);
    setSelectedImages([]);
  };

  const handlePrevImage = () => {
    if (selectedImageIndex > 0) {
      setSelectedImage(selectedImages[selectedImageIndex - 1]);
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const handleNextImage = () => {
    if (selectedImageIndex < selectedImages.length - 1) {
      setSelectedImage(selectedImages[selectedImageIndex + 1]);
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status: string) => {
    return status === 'active'
      ? { bg: '#10B981', text: '#ffffff' }
      : { bg: '#EF4444', text: '#ffffff' };
  };

  const handleViewOpen = (row: DialogData) => {
    setSelectedData(row);
    setViewDialogOpen(true);
  };

  const handleViewClose = () => {
    setViewDialogOpen(false);
    setSelectedData(null);
  };

  const handleEditOpen = (row: DialogData) => {
    setEditFormData({ ...row });
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
    setEditFormData(null);
    setFormErrors({});
  };

  const handleEditSave = async () => {
    if (editFormData) {
      const errors = validateForm(editFormData);
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        toast.error('Please fill all required fields');
        return;
      }

      setLoading(true);
      try {
        const projectRef = dbRef(database, `projects/${editFormData.id}`);
        await update(projectRef, {
          title: editFormData.title,
          description: editFormData.description,
          github: editFormData.github,
          images: editFormData.images,
          live: editFormData.live,
          techStack: editFormData.techStack,
          views: editFormData.views,
          status: editFormData.status,
          updatedAt: new Date().toISOString(),
        });
        toast.success('Project updated successfully');
        handleEditClose();
      } catch (error) {
        console.error('Error updating project:', error);
        toast.error('Failed to update project');
        setLoading(false);
      }
    }
  };

  const handleDeleteOpen = (row: DialogData) => {
    setSelectedData(row);
    setDeleteDialogOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
    setSelectedData(null);
  };

  const handleDeleteConfirm = async () => {
    if (selectedData) {
      setLoading(true);
      try {
        const projectRef = dbRef(database, `projects/${selectedData.id}`);
        await remove(projectRef);
        toast.success('Project deleted successfully');
        handleDeleteClose();
      } catch (error) {
        console.error('Error deleting project:', error);
        toast.error('Failed to delete project');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddOpen = () => {
    setEditFormData({
      id: '',
      title: '',
      description: '',
      github: '',
      images: [],
      live: '',
      techStack: [],
      views: 0,
      status: 'active',
      updatedAt: new Date().toISOString(),
    });
    setAddDialogOpen(true);
  };

  const handleAddClose = () => {
    setAddDialogOpen(false);
    setEditFormData(null);
    setFormErrors({});
  };

  const handleAddSave = async () => {
    if (editFormData) {
      const errors = validateForm(editFormData);
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        toast.error('Please fill all required fields');
        return;
      }

      setLoading(true);
      try {
        const projectsRef = dbRef(database, 'projects');
        const newProjectRef = push(projectsRef);
        await set(newProjectRef, {
          title: editFormData.title,
          description: editFormData.description,
          github: editFormData.github,
          images: editFormData.images,
          live: editFormData.live,
          techStack: editFormData.techStack,
          views: editFormData.views,
          status: editFormData.status,
          updatedAt: new Date().toISOString(),
        });
        toast.success('Project added successfully');
        handleAddClose();
      } catch (error) {
        console.error('Error adding project:', error);
        toast.error('Failed to add project');
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleRowExpand = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  // Render skeleton card for loading state
  const renderSkeletonCard = (index: number): ReactElement => (
    <Card
      key={`skeleton-${index}`}
      sx={{
        mb: 2,
        backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
        boxShadow: 2,
        borderRadius: 2,
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Skeleton variant="text" width="60%" height={24} />
            <Skeleton variant="rounded" width={80} height={24} />
          </Box>
          <Skeleton variant="text" width="80%" height={40} />
          <Skeleton variant="text" width="40%" height={16} />
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Skeleton variant="rounded" width={60} height={24} />
            <Skeleton variant="rounded" width={60} height={24} />
            <Skeleton variant="rounded" width={60} height={24} />
          </Stack>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
            <Stack direction="row" spacing={1}>
              <Skeleton variant="circular" width={24} height={24} />
              <Skeleton variant="circular" width={24} height={24} />
            </Stack>
            <Stack direction="row" spacing={1}>
              <Skeleton variant="circular" width={24} height={24} />
              <Skeleton variant="circular" width={24} height={24} />
              <Skeleton variant="circular" width={24} height={24} />
            </Stack>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const renderMobileCard = (row: DialogData): ReactElement => (
    <Card
      key={row.id}
      sx={{
        mb: 2,
        backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
        boxShadow: 2,
        borderRadius: 2,
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {row.title}
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
          <Typography variant="body2">{row.description}</Typography>
          <Typography variant="caption" color="text.secondary">
            Last updated: {new Date(row.updatedAt).toLocaleDateString()}
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {row.techStack.map((tech, index) => (
              <Chip
                key={index}
                label={tech}
                size="small"
                sx={{
                  backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  color: isDarkMode ? 'white' : 'inherit',
                  my: 0.5,
                }}
              />
            ))}
          </Stack>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
            <Stack direction="row" spacing={1}>
              {row.images.length > 0 && (
                <Tooltip title="View Images">
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
              {(row.github || row.live) && (
                <Tooltip title="View Links">
                  <IconButton
                    size="small"
                    onClick={() => handleViewOpen(row)}
                    sx={{ color: isDarkMode ? 'white' : 'inherit' }}
                  >
                    <LinkIcon fontSize="small" />
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
        <Collapse in={expandedRow === row.id}>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Images:</Typography>
            <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 1 }}>
              {row.images.map((image, index) => (
                <Button
                  key={index}
                  variant="outlined"
                  startIcon={<ImageIcon />}
                  onClick={() => handleImagePreviewOpen(image, index, row.images)}
                  size="small"
                >
                  Image {index + 1}
                </Button>
              ))}
            </Stack>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );

  const renderDesktopTable = (): ReactElement => (
    <TableContainer>
      <Table sx={{ minWidth: 650 }} aria-label="Projects table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'inherit' }}>
              Title
            </TableCell>
            <TableCell sx={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'inherit', display: { xs: 'none', md: 'table-cell' } }}>
              Description
            </TableCell>
            <TableCell sx={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'inherit', display: { xs: 'none', md: 'table-cell' } }}>
              Images
            </TableCell>
            <TableCell sx={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'inherit', display: { xs: 'none', sm: 'table-cell' } }}>
              Tech Stack
            </TableCell>
            <TableCell sx={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'inherit' }}>
              Status
            </TableCell>
            <TableCell sx={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'inherit' }}>
              Last Updated
            </TableCell>
            <TableCell sx={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'inherit' }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            [...Array(rowsPerPage)].map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton variant="text" width="80%" />
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                  <Skeleton variant="text" width="60%" />
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                  <Stack direction="row" spacing={1}>
                    <Skeleton variant="rectangular" width={50} height={50} />
                    <Skeleton variant="rectangular" width={50} height={50} />
                  </Stack>
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                  <Stack direction="row" spacing={1}>
                    <Skeleton variant="rounded" width={60} height={24} />
                    <Skeleton variant="rounded" width={60} height={24} />
                  </Stack>
                </TableCell>
                <TableCell>
                  <Skeleton variant="rounded" width={80} height={24} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width="70%" />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Skeleton variant="circular" width={24} height={24} />
                    <Skeleton variant="circular" width={24} height={24} />
                    <Skeleton variant="circular" width={24} height={24} />
                  </Stack>
                </TableCell>
              </TableRow>
            ))
          ) : data.length === 0 ? (
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
            data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ color: isDarkMode ? 'white' : 'inherit' }}>{row.title}</TableCell>
                  <TableCell sx={{ color: isDarkMode ? 'white' : 'inherit', display: { xs: 'none', md: 'table-cell' } }}>
                    {row.description.substring(0, 50)}...
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                      {row.images.length > 0 ? (
                        row.images.map((image, index) => (
                          <Tooltip key={index} title={`View Image ${index + 1}`}>
                            <Box
                              sx={{
                                width: 50,
                                height: 50,
                                border: '1px solid',
                                borderColor: isDarkMode ? 'rgba(255,255,255,0.23)' : 'rgba(0,0,0,0.23)',
                                borderRadius: 1,
                                overflow: 'hidden',
                                position: 'relative',
                                cursor: 'pointer',
                                '&:hover img': { opacity: 0.7 },
                              }}
                              onClick={() => handleImagePreviewOpen(image, index, row.images)}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  handleImagePreviewOpen(image, index, row.images);
                                }
                              }}
                            >
                              <img
                                src={image}
                                alt={`Project image ${index + 1}`}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.2s' }}
                              />
                              <VisibilityIcon
                                sx={{
                                  position: 'absolute',
                                  top: '50%',
                                  left: '50%',
                                  transform: 'translate(-50%, -50%)',
                                  color: 'white',
                                  opacity: 0,
                                  fontSize: 20,
                                  transition: 'opacity 0.2s',
                                  '.MuiBox-root:hover &': { opacity: 1 },
                                }}
                              />
                            </Box>
                          </Tooltip>
                        ))
                      ) : (
                        <Typography variant="body2" sx={{ color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>
                          No images
                        </Typography>
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {row.techStack.map((tech, index) => (
                        <Chip
                          key={index}
                          label={tech}
                          size="small"
                          sx={{
                            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                            color: isDarkMode ? 'white' : 'black',
                          }}
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
                  <TableCell sx={{ color: isDarkMode ? 'white' : 'inherit' }}>
                    {new Date(row.updatedAt).toLocaleDateString()}
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
            <InputLabel sx={{ color: isDarkMode ? 'white' : 'inherit' }}>Rows</InputLabel>
            <Select
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
          onChange={(e, value) => handleChangePage(null, value - 1)}
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
          <strong>Title:</strong> {selectedData.title}
        </Typography>
        <Typography>
          <strong>Description:</strong> {selectedData.description}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography component="span">
            <strong>Status:</strong>
          </Typography>
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
        </Box>
        <Typography>
          <strong>Views:</strong> {selectedData.views}
        </Typography>
        <Typography>
          <strong>Last Updated:</strong> {new Date(selectedData.updatedAt).toLocaleDateString()}
        </Typography>
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            <strong>Tech Stack:</strong>
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {selectedData.techStack.map((tech, index) => (
              <Chip
                key={index}
                label={tech}
                size="small"
                sx={{
                  backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  color: isDarkMode ? 'white' : 'inherit',
                  my: 0.5,
                }}
              />
            ))}
          </Stack>
        </Box>
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            <strong>Images:</strong>
          </Typography>
          <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 2 }}>
            {selectedData.images.length > 0 ? (
              selectedData.images.map((image, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 150,
                    height: 150,
                    border: '1px solid',
                    borderColor: isDarkMode ? 'rgba(255,255,255,0.23)' : 'rgba(0,0,0,0.23)',
                    borderRadius: 1,
                    overflow: 'hidden',
                    mb: 2,
                    position: 'relative',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleImagePreviewOpen(image, index, selectedData.images)}
                >
                  <img
                    src={image}
                    alt={`Image ${index}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
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
                      '&:hover': { opacity: 1 },
                    }}
                  />
                </Box>
              ))
            ) : (
              <Typography variant="body2" sx={{ color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>
                No images available
              </Typography>
            )}
          </Stack>
        </Box>
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            <strong>Links:</strong>
          </Typography>
          <Stack direction="row" spacing={2}>
            {selectedData.github && (
              <Button
                variant="outlined"
                startIcon={<GitHubIcon />}
                onClick={() => window.open(selectedData.github, '_blank')}
                sx={{
                  color: isDarkMode ? 'white' : 'primary.main',
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.23)' : 'primary.main',
                }}
              >
                GitHub
              </Button>
            )}
            {selectedData.live && (
              <Button
                variant="outlined"
                startIcon={<PublicIcon />}
                onClick={() => window.open(selectedData.live, '_blank')}
                sx={{
                  color: isDarkMode ? 'white' : 'primary.main',
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.23)' : 'primary.main',
                }}
              >
                Live Demo
              </Button>
            )}
          </Stack>
        </Box>
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
          required
          error={!!formErrors.title}
          helperText={formErrors.title}
          sx={{
            '& .MuiInputLabel-root': { color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'inherit', '&.Mui-focused': { color: isDarkMode ? 'white' : 'inherit' } },
            '& .MuiOutlinedInput-root': {
              color: isDarkMode ? 'white' : 'inherit',
              '& fieldset': { borderColor: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.23)' },
              '&:hover fieldset': { borderColor: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.5)' },
              '&.Mui-focused fieldset': { borderColor: isDarkMode ? 'white' : theme.palette.primary.main },
            },
          }}
        />
        <TextField
          label="Description"
          value={editFormData.description}
          onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
          fullWidth
          required
          multiline
          rows={3}
          error={!!formErrors.description}
          helperText={formErrors.description}
          sx={{
            '& .MuiInputLabel-root': { color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'inherit', '&.Mui-focused': { color: isDarkMode ? 'white' : 'inherit' } },
            '& .MuiOutlinedInput-root': {
              color: isDarkMode ? 'white' : 'inherit',
              '& fieldset': { borderColor: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.23)' },
              '&:hover fieldset': { borderColor: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.5)' },
              '&.Mui-focused fieldset': { borderColor: isDarkMode ? 'white' : theme.palette.primary.main },
            },
          }}
        />
        <TextField
          label="GitHub URL"
          value={editFormData.github}
          onChange={(e) => setEditFormData({ ...editFormData, github: e.target.value })}
          fullWidth
          sx={{
            '& .MuiInputLabel-root': { color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'inherit', '&.Mui-focused': { color: isDarkMode ? 'white' : 'inherit' } },
            '& .MuiOutlinedInput-root': {
              color: isDarkMode ? 'white' : 'inherit',
              '& fieldset': { borderColor: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.23)' },
              '&:hover fieldset': { borderColor: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.5)' },
              '&.Mui-focused fieldset': { borderColor: isDarkMode ? 'white' : theme.palette.primary.main },
            },
          }}
        />
        <TextField
          label="Live URL"
          value={editFormData.live}
          onChange={(e) => setEditFormData({ ...editFormData, live: e.target.value })}
          fullWidth
          sx={{
            '& .MuiInputLabel-root': { color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'inherit', '&.Mui-focused': { color: isDarkMode ? 'white' : 'inherit' } },
            '& .MuiOutlinedInput-root': {
              color: isDarkMode ? 'white' : 'inherit',
              '& fieldset': { borderColor: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.23)' },
              '&:hover fieldset': { borderColor: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.5)' },
              '&.Mui-focused fieldset': { borderColor: isDarkMode ? 'white' : theme.palette.primary.main },
            },
          }}
        />
        <SkillsInputComponent
          skills={editFormData.techStack}
          onChange={(newSkills) => setEditFormData({ ...editFormData, techStack: newSkills })}
        />
        {formErrors.techStack && (
          <Typography color="error" variant="caption">
            {formErrors.techStack}
          </Typography>
        )}
        <Stack
          direction="row"
          spacing={1}
          sx={{
            mb: 2,
            flexWrap: 'wrap',
            gap: 1,
            justifyContent: { xs: 'center', sm: 'flex-start' },
          }}
        >
          {editFormData.images.map((imageUrl, index) => (
            <Box
              key={index}
              sx={{
                position: 'relative',
                mb: 1,
                width: { xs: 120, sm: 120 },
                height: { xs: 120, sm: 120 },
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  border: '1px solid',
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.23)' : 'rgba(0,0,0,0.23)',
                  borderRadius: 1,
                  overflow: 'hidden',
                }}
              >
                <img
                  src={imageUrl}
                  alt={`Image ${index}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>
              <IconButton
                size="small"
                onClick={() => {
                  const newImages = [...editFormData.images];
                  newImages.splice(index, 1);
                  setEditFormData({ ...editFormData, images: newImages });
                }}
                sx={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  backgroundColor: isDarkMode ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.9)',
                  color: isDarkMode ? 'white' : 'error.main',
                  width: 24,
                  height: 24,
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
          <Button
            variant="outlined"
            component="label"
            sx={{
              minWidth: { xs: 100, sm: 120 },
              height: { xs: 100, sm: 120 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              borderColor: isDarkMode ? 'rgba(255,255,255,0.23)' : 'rgba(0,0,0,0.23)',
              color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.85)',
            }}
          >
            <AddIcon sx={{ mb: 1 }} />
            Upload Image
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </Button>
        </Stack>
        <Typography variant="subtitle1" sx={{ textAlign: 'center', mb: 2 }}>OR</Typography>
        <TextField
          label="Image URLs"
          placeholder="/images/empty_image.jpg"
          onChange={(e) => {
            const urls = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
            if (urls.length > 0) {
              setEditFormData({ ...editFormData, images: [...editFormData.images, ...urls] });
              e.target.value = '';
            }
          }}
          fullWidth
          size="small"
          sx={{
            '& .MuiInputLabel-root': { color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'inherit', '&.Mui-focused': { color: isDarkMode ? 'white' : 'inherit' } },
            '& .MuiOutlinedInput-root': {
              color: isDarkMode ? 'white' : 'inherit',
              '& fieldset': { borderColor: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.23)' },
              '&:hover fieldset': { borderColor: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.5)' },
              '&.Mui-focused fieldset': { borderColor: isDarkMode ? 'white' : theme.palette.primary.main },
            },
          }}
        />
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
          }}
        >
          Toggle Status: {editFormData.status}
        </Button>
      </Stack>
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 2, sm: 3, md: 4 }, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant={isMobile ? 'h5' : 'h4'} sx={{ color: isDarkMode ? 'white' : 'inherit', fontWeight: 'bold' }}>
          Portfolio Projects
        </Typography>
        <Button onClick={handleAddOpen} size={isMobile ? 'small' : 'medium'}>
          <AddIcon />
        </Button>
      </Box>
      <Paper elevation={0} sx={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)', borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ p: { xs: 2, sm: 3 }, pb: 2 }}>
          <Typography variant={isMobile ? 'subtitle1' : 'h6'} sx={{ color: isDarkMode ? 'white' : 'inherit' }}>
            Projects Table
          </Typography>
        </Box>
        {isMobile ? (
          <Box sx={{ px: 2, pb: 2 }}>
            {loading ? (
              [...Array(rowsPerPage)].map((_, index) => renderSkeletonCard(index))
            ) : data.length === 0 ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <Typography
                  variant="body1"
                  sx={{
                    color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                  }}
                >
                  No Data Found
                </Typography>
              </Box>
            ) : (
              data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(renderMobileCard)
            )}
          </Box>
        ) : (
          renderDesktopTable()
        )}
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
            '& .MuiDialogTitle-root': { color: isDarkMode ? 'white' : 'inherit', borderBottom: 1, borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', padding: '16px 24px' },
            '& .MuiDialogContent-root': { color: isDarkMode ? 'white' : 'inherit', padding: '24px' },
            '& .MuiDialogActions-root': { borderTop: 1, borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', padding: '16px 24px' },
          },
        }}
      >
        <DialogTitle>View Details</DialogTitle>
        <DialogContent>{renderViewDialogContent()}</DialogContent>
        <DialogActions>
          <Button onClick={handleViewClose} variant="outlined" size="medium" color="info" disabled={loading}>
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
            '& .MuiDialogTitle-root': { color: isDarkMode ? 'white' : 'inherit', borderBottom: 1, borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', padding: '16px 24px' },
            '& .MuiDialogContent-root': { color: isDarkMode ? 'white' : 'inherit', padding: '24px' },
            '& .MuiDialogActions-root': { borderTop: 1, borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', padding: '16px 24px' },
          },
        }}
      >
        <DialogTitle>Edit Details</DialogTitle>
        <DialogContent>{renderEditDialogContent()}</DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} variant="outlined" size="medium" color="info" disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleEditSave}
            variant="contained"
            size="medium"
            color="success"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Update'}
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
            '& .MuiDialogTitle-root': { color: isDarkMode ? 'white' : 'inherit', borderBottom: 1, borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', padding: '16px 24px' },
            '& .MuiDialogContent-root': { color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'inherit', padding: '24px' },
            '& .MuiDialogActions-root': { borderTop: 1, borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', padding: '16px 24px' },
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
          <Button onClick={handleDeleteClose} variant="outlined" size="medium" color="info" disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            size="medium"
            color="error"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Delete'}
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
            '& .MuiDialogTitle-root': { color: isDarkMode ? 'white' : 'inherit', borderBottom: 1, borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', padding: '16px 24px' },
            '& .MuiDialogContent-root': { color: isDarkMode ? 'white' : 'inherit', padding: '24px' },
            '& .MuiDialogActions-root': { borderTop: 1, borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', padding: '16px 24px' },
          },
        }}
      >
        <DialogTitle>Add New Record</DialogTitle>
        <DialogContent>
          {editFormData && (
            <Stack spacing={2} sx={{ mt: 2 }}>
              <TextField
                label="Title"
                value={editFormData.title}
                onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                fullWidth
                required
                error={!!formErrors.title}
                helperText={formErrors.title}
                sx={{
                  '& .MuiInputLabel-root': { color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'inherit', '&.Mui-focused': { color: isDarkMode ? 'white' : 'inherit' } },
                  '& .MuiOutlinedInput-root': {
                    color: isDarkMode ? 'white' : 'inherit',
                    '& fieldset': { borderColor: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.23)' },
                    '&:hover fieldset': { borderColor: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.5)' },
                    '&.Mui-focused fieldset': { borderColor: isDarkMode ? 'white' : theme.palette.primary.main },
                  },
                }}
              />
              <TextField
                label="Description"
                value={editFormData.description}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                fullWidth
                required
                multiline
                rows={3}
                error={!!formErrors.description}
                helperText={formErrors.description}
                sx={{
                  '& .MuiInputLabel-root': { color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'inherit', '&.Mui-focused': { color: isDarkMode ? 'white' : 'inherit' } },
                  '& .MuiOutlinedInput-root': {
                    color: isDarkMode ? 'white' : 'inherit',
                    '& fieldset': { borderColor: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.23)' },
                    '&:hover fieldset': { borderColor: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.5)' },
                    '&.Mui-focused fieldset': { borderColor: isDarkMode ? 'white' : theme.palette.primary.main },
                  },
                }}
              />
              <TextField
                label="GitHub URL"
                value={editFormData.github}
                onChange={(e) => setEditFormData({ ...editFormData, github: e.target.value })}
                fullWidth
                sx={{
                  '& .MuiInputLabel-root': { color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'inherit', '&.Mui-focused': { color: isDarkMode ? 'white' : 'inherit' } },
                  '& .MuiOutlinedInput-root': {
                    color: isDarkMode ? 'white' : 'inherit',
                    '& fieldset': { borderColor: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.23)' },
                    '&:hover fieldset': { borderColor: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.5)' },
                    '&.Mui-focused fieldset': { borderColor: isDarkMode ? 'white' : theme.palette.primary.main },
                  },
                }}
              />
              <TextField
                label="Live URL"
                value={editFormData.live}
                onChange={(e) => setEditFormData({ ...editFormData, live: e.target.value })}
                fullWidth
                sx={{
                  '& .MuiInputLabel-root': { color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'inherit', '&.Mui-focused': { color: isDarkMode ? 'white' : 'inherit' } },
                  '& .MuiOutlinedInput-root': {
                    color: isDarkMode ? 'white' : 'inherit',
                    '& fieldset': { borderColor: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.23)' },
                    '&:hover fieldset': { borderColor: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.5)' },
                    '&.Mui-focused fieldset': { borderColor: isDarkMode ? 'white' : theme.palette.primary.main },
                  },
                }}
              />
              <SkillsInputComponent
                skills={editFormData.techStack}
                onChange={(newSkills) => setEditFormData({ ...editFormData, techStack: newSkills })}
              />
              {formErrors.techStack && (
                <Typography color="error" variant="caption">
                  {formErrors.techStack}
                </Typography>
              )}
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  mb: 2,
                  flexWrap: 'wrap',
                  gap: 1,
                  justifyContent: { xs: 'center', sm: 'flex-start' },
                }}
              >
                {editFormData.images.map((imageUrl, index) => (
                  <Box
                    key={index}
                    sx={{
                      position: 'relative',
                      mb: 1,
                      width: { xs: 120, sm: 120 },
                      height: { xs: 120, sm: 120 },
                    }}
                  >
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        border: '1px solid',
                        borderColor: isDarkMode ? 'rgba(255,255,255,0.23)' : 'rgba(0,0,0,0.23)',
                        borderRadius: 1,
                        overflow: 'hidden',
                      }}
                    >
                      <img
                        src={imageUrl}
                        alt={`Image ${index}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </Box>
                    <IconButton
                      size="small"
                      onClick={() => {
                        const newImages = [...editFormData.images];
                        newImages.splice(index, 1);
                        setEditFormData({ ...editFormData, images: newImages });
                      }}
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        backgroundColor: isDarkMode ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.9)',
                        color: isDarkMode ? 'white' : 'error.main',
                        width: 24,
                        height: 24,
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
                <Button
                  variant="outlined"
                  component="label"
                  sx={{
                    minWidth: { xs: 100, sm: 120 },
                    height: { xs: 100, sm: 120 },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    borderColor: isDarkMode ? 'rgba(255,255,255,0.23)' : 'rgba(0,0,0,0.23)',
                    color: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.85)',
                  }}
                >
                  <AddIcon sx={{ mb: 1 }} />
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageChange}
                  />
                </Button>
              </Stack>
              <Typography variant="subtitle1" sx={{ textAlign: 'center', mb: 2 }}>OR</Typography>
              <TextField
                label="Image URLs"
                placeholder="/images/empty_image.jpg"
                onChange={(e) => {
                  const urls = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                  if (urls.length > 0) {
                    setEditFormData({ ...editFormData, images: [...editFormData.images, ...urls] });
                    e.target.value = '';
                  }
                }}
                fullWidth
                size="small"
                sx={{
                  '& .MuiInputLabel-root': { color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'inherit', '&.Mui-focused': { color: isDarkMode ? 'white' : 'inherit' } },
                  '& .MuiOutlinedInput-root': {
                    color: isDarkMode ? 'white' : 'inherit',
                    '& fieldset': { borderColor: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.23)' },
                    '&:hover fieldset': { borderColor: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.5)' },
                    '&.Mui-focused fieldset': { borderColor: isDarkMode ? 'white' : theme.palette.primary.main },
                  },
                }}
              />
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
                }}
              >
                Toggle Status: {editFormData.status}
              </Button>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddClose} variant="outlined" size="medium" color="info" disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleAddSave}
            variant="contained"
            size="medium"
            color="secondary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
  open={imagePreviewOpen}
  onClose={handleImagePreviewClose}
  maxWidth="lg"
  fullWidth
  PaperProps={{
    sx: {
      backgroundColor: isDarkMode ? '#1e1e2d' : 'white',
      color: isDarkMode ? 'white' : 'inherit',
      '& .MuiDialogTitle-root': { 
        color: isDarkMode ? 'white' : 'inherit', 
        borderBottom: 1, 
        borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', 
        padding: '16px 24px' 
      },
      '& .MuiDialogContent-root': { 
        color: isDarkMode ? 'white' : 'inherit', 
        padding: '24px', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center' 
      },
      '& .MuiDialogActions-root': { 
        borderTop: 1, 
        borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', 
        padding: '16px 24px' 
      },
    },
  }}
>
  <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <Typography component="div" sx={{ color: isDarkMode ? 'white' : 'inherit', fontSize: '1.5rem', fontWeight: 500 }}>
      Image Preview
    </Typography>
    <Button onClick={handleImagePreviewClose} variant="outlined" size="medium" color="info">
      Close
    </Button>
  </DialogTitle>
  <DialogContent>
    {selectedImage ? (
      <Box sx={{ position: 'relative', maxWidth: '100%', maxHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img
          src={selectedImage}
          alt={`Preview ${selectedImageIndex + 1}`}
          style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }}
        />
        {selectedImages.length > 1 && (
          <>
            <IconButton
              onClick={handlePrevImage}
              disabled={selectedImageIndex === 0}
              sx={{
                position: 'absolute',
                left: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: isDarkMode ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)',
                color: isDarkMode ? 'white' : 'black',
                '&:hover': { backgroundColor: isDarkMode ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.9)' },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <IconButton
              onClick={handleNextImage}
              disabled={selectedImageIndex === selectedImages.length - 1}
              sx={{
                position: 'absolute',
                right: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: isDarkMode ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)',
                color: isDarkMode ? 'white' : 'black',
                '&:hover': { backgroundColor: isDarkMode ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.9)' },
              }}
            >
              <ArrowForwardIcon />
            </IconButton>
          </>
        )}
      </Box>
    ) : (
      <Typography variant="body2" sx={{ color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>
        No image selected
      </Typography>
    )}
  </DialogContent>
</Dialog>
    </Box>
  );
};

export default ProjectsPage;