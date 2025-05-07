import React, { useState, ReactElement } from 'react';
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
  InputAdornment
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import Button from '../../components/Button';

// Sample data for the table
const createData = (
  id: number,
  orderNumber: string,
  customer: string,
  date: string,
  amount: number,
  status: 'active' | 'unActive',
  images: string[],
  pdf: string,
  skills: string[],
  description: string
) => {
  return { id, orderNumber, customer, date, amount, status, images, pdf, skills, description };
};

const HomeData = [
  createData(
    1,
    'ORD-001',
    'John Doe',
    '2024-02-20',
    1200.00,
    'active',
    [
      'https://example.com/images/john_doe_1.jpg',
      'https://example.com/images/john_doe_2.jpg',
    ],
    'https://example.com/pdfs/order_001.pdf',
    ['JavaScript', 'React'],
    'Developed a responsive web application using React and TypeScript.'
  ),
  createData(
    2,
    'ORD-002',
    'Jane Smith',
    '2024-02-19',
    850.50,
    'unActive',
    [
      'https://example.com/images/jane_smith_1.jpg',
      'https://example.com/images/jane_smith_2.jpg',
    ],
    'https://example.com/pdfs/order_002.pdf',
    ['Python', 'Django'],
    'Built a RESTful API with Django and PostgreSQL.'
  ),
  createData(
    3,
    'ORD-003',
    'Mike Johnson',
    '2024-02-18',
    2100.75,
    'unActive',
    [
      'https://example.com/images/mike_johnson_1.jpg',
      'https://example.com/images/mike_johnson_2.jpg',
    ],
    'https://example.com/pdfs/order_003.pdf',
    ['Java', 'Spring'],
    'Created a microservices architecture using Spring Boot.'
  ),
  createData(
    5,
    'ORD-005',
    'Tom Brown',
    '2024-02-16',
    1500.00,
    'unActive',
    [
      'https://example.com/images/tom_brown_1.jpg',
      'https://example.com/images/tom_brown_2.jpg',
    ],
    'https://example.com/pdfs/order_005.pdf',
    ['Node.js', 'Express'],
    'Developed a real-time chat application with Node.js.'
  ),
  createData(
    6,
    'ORD-006',
    'Emily Davis',
    '2024-02-15',
    975.50,
    'unActive',
    [
      'https://example.com/images/emily_davis_1.jpg',
      'https://example.com/images/emily_davis_2.jpg',
    ],
    'https://example.com/pdfs/order_006.pdf',
    ['SQL', 'MongoDB'],
    'Designed and optimized database schemas for a web app.'
  ),
  createData(
    7,
    'ORD-007',
    'David Wilson',
    '2024-02-14',
    3200.00,
    'unActive',
    [
      'https://example.com/images/david_wilson_1.jpg',
      'https://example.com/images/david_wilson_2.jpg',
    ],
    'https://example.com/pdfs/order_007.pdf',
    ['C#', '.NET'],
    'Built a desktop application using C# and .NET Framework.'
  ),
];

interface DialogData {
  id: number;
  orderNumber: string;
  customer: string;
  date: string;
  amount: number;
  status: 'active' | 'unActive';
  images: string[];
  pdf: string;
  skills: string[];
  description: string;
}

const HomePage: React.FC = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [data, setData] = useState(HomeData);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  
  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<DialogData | null>(null);
  const [editFormData, setEditFormData] = useState<DialogData | null>(null);

  // Skills input component
  const SkillsInputComponent = ({ 
    skills = [], 
    onChange
  }: { 
    skills: string[], 
    onChange: (newSkills: string[]) => void 
  }) => {
    const [inputValue, setInputValue] = useState('');
    
    // Common skill suggestions
    const skillOptions = [
      'JavaScript', 'React', 'TypeScript', 'Node.js', 'HTML', 'CSS', 
      'Angular', 'Vue.js', 'Python', 'Django', 'Flask', 'Java', 
      'Spring', 'PHP', 'Laravel', 'Ruby', 'Rails', 'C#', '.NET',
      'SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'GraphQL', 'REST API',
      'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'CI/CD',
      'Git', 'GitLab', 'GitHub', 'Jira', 'Agile', 'Scrum'
    ].filter(option => !skills.includes(option));
    
    const handleDelete = (skillToDelete: string) => {
      onChange(skills.filter((skill) => skill !== skillToDelete));
    };
    
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
            const tagProps = getTagProps({ index });
            const { key, ...otherProps } = tagProps; // Extract key from the props
            
            return (
              <Chip
                key={key} // Pass key directly
                {...otherProps} // Spread the rest of the props
                label={option}
                sx={{
                  backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  color: isDarkMode ? 'white' : 'inherit',
                  '& .MuiChip-deleteIcon': {
                    color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                    '&:hover': {
                      color: isDarkMode ? 'white' : 'rgba(0,0,0,0.9)',
                    }
                  }
                }}
              />
            );
          })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Skills"
            placeholder="Add skills"
            onKeyDown={handleKeyDown}
            fullWidth
            sx={{
              '& .MuiInputLabel-root': {
                color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'inherit',
                '&.Mui-focused': {
                  color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'inherit'
                }
              },
              '& .MuiOutlinedInput-root': {
                color: isDarkMode ? 'white' : 'inherit',
                '& fieldset': {
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.23)'
                },
                '&:hover fieldset': {
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.5)'
                },
                '&.Mui-focused fieldset': {
                  borderColor: isDarkMode ? 'white' : theme.palette.primary.main
                }
              }
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
                          if (!skills.includes(inputValue)) {
                            onChange([...skills, inputValue]);
                            setInputValue('');
                          }
                        }}
                        sx={{
                          color: isDarkMode ? 'white' : 'primary.main',
                          mr: 1
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

  // View handlers
  const handleViewOpen = (row: DialogData) => {
    setSelectedData(row);
    setViewDialogOpen(true);
  };

  const handleViewClose = () => {
    setViewDialogOpen(false);
    setSelectedData(null);
  };

  // Edit handlers
  const handleEditOpen = (row: DialogData) => {
    setEditFormData({ ...row });
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
    setEditFormData(null);
  };

  const handleEditSave = () => {
    if (editFormData) {
      setData(data.map(item => 
        item.id === editFormData.id ? editFormData : item
      ));
      handleEditClose();
    }
  };

  // Delete handlers
  const handleDeleteOpen = (row: DialogData) => {
    setSelectedData(row);
    setDeleteDialogOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
    setSelectedData(null);
  };

  const handleDeleteConfirm = () => {
    if (selectedData) {
      setData(data.filter(item => item.id !== selectedData.id));
      handleDeleteClose();
    }
  };

  // Add handlers
  const handleAddOpen = () => {
    setEditFormData({
      id: Math.max(...data.map(item => item.id)) + 1,
      orderNumber: `ORD-${String(Math.max(...data.map(item => item.id)) + 1).padStart(3, '0')}`,
      customer: '',
      date: new Date().toISOString().split('T')[0],
      amount: 0,
      status: 'active',
      images: [],
      pdf: '',
      skills: [],
      description: ''
    });
    setAddDialogOpen(true);
  };

  const handleAddClose = () => {
    setAddDialogOpen(false);
    setEditFormData(null);
  };

  const handleAddSave = () => {
    if (editFormData) {
      setData([...data, editFormData]);
      handleAddClose();
    }
  };

  const toggleRowExpand = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const renderMobileCard = (row: DialogData): ReactElement => (
    <Card
      key={row.id}
      sx={{
        mb: 2,
        backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
        borderRadius: 2
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {row.orderNumber}
              </Typography>
              <Chip
                label={row.status}
                size="small"
                sx={{
                  backgroundColor: getStatusColor(row.status).bg,
                  color: getStatusColor(row.status).text,
                  textTransform: 'capitalize'
                }}
              />
            </Box>
          </Box>
          <Box>
            <Typography variant="body1">{row.customer}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary' }}>
              {row.description}
            </Typography>
          </Box>
          <Box>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {row.skills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  size="small"
                  sx={{
                    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    color: isDarkMode ? 'white' : 'inherit',
                    my: 0.5
                  }}
                />
              ))}
            </Stack>
          </Box>
          <Box>
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
                {row.pdf && (
                  <Tooltip title="View Resume">
                    <IconButton
                      size="small"
                      onClick={() => window.open(row.pdf, '_blank')}
                      sx={{ color: isDarkMode ? 'white' : 'inherit' }}
                    >
                      <PdfIcon fontSize="small" />
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
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Images:</Typography>
            <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 1 }}>
              {row.images.map((image, index) => (
                <Button
                  key={index}
                  variant="outlined"
                  startIcon={<ImageIcon />}
                  onClick={() => window.open(image, '_blank')}
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
      <Table sx={{ minWidth: 650 }} aria-label="home table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ 
              color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'inherit',
              display: { xs: 'none', sm: 'table-cell' }
            }}>
              ID
            </TableCell>
            <TableCell sx={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'inherit' }}>
              Name
            </TableCell>
            <TableCell sx={{ 
              color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'inherit',
              display: { xs: 'none', md: 'table-cell' }
            }}>
              Description
            </TableCell>
            <TableCell sx={{ 
              color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'inherit',
              display: { xs: 'none', md: 'table-cell' }
            }}>
              Images
            </TableCell>
            <TableCell sx={{ 
              color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'inherit',
              display: { xs: 'none', md: 'table-cell' }
            }}>
              Resume
            </TableCell>
            <TableCell sx={{ 
              color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'inherit',
              display: { xs: 'none', sm: 'table-cell' }
            }}>
              Skills
            </TableCell>
            <TableCell sx={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'inherit' }}>
              Status
            </TableCell>
            <TableCell sx={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'inherit' }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ 
                    color: isDarkMode ? 'white' : 'inherit',
                    display: { xs: 'none', sm: 'table-cell' }
                  }}
                >
                  {row.orderNumber}
                </TableCell>
                <TableCell sx={{ color: isDarkMode ? 'white' : 'inherit' }}>
                  {row.customer}
                </TableCell>
                <TableCell sx={{ 
                  color: isDarkMode ? 'white' : 'inherit',
                  display: { xs: 'none', md: 'table-cell' }
                }}>
                  {row.description}
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                  <Stack direction="row" spacing={1}>
                    {row.images.map((image, index) => (
                      <Tooltip key={index} title={`View Image ${index + 1}`}>
                        <IconButton
                          size="small"
                          onClick={() => window.open(image, '_blank')}
                          sx={{ color: isDarkMode ? 'white' : 'inherit' }}
                        >
                          <ImageIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    ))}
                  </Stack>
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                  <Tooltip title="View Resume">
                    <IconButton
                      size="small"
                      onClick={() => window.open(row.pdf, '_blank')}
                      sx={{ color: isDarkMode ? 'white' : 'inherit' }}
                    >
                      <PdfIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {row.skills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        size="small"
                        sx={{
                          backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                          color: isDarkMode ? 'white' : 'inherit',
                          my: 0.5
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
                      textTransform: 'capitalize'
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
            ))}
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
          color: isDarkMode ? 'white' : 'inherit'
        }}
      >
        {/* Rows per page selector */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          order: { xs: 2, sm: 1 }
        }}>
          <FormControl size={isMobile ? "small" : "medium"} variant="outlined">
            <InputLabel id="rows-per-page-label" sx={{ 
              color: isDarkMode ? 'white' : 'inherit',
              '&.Mui-focused': {
                color: theme.palette.primary.main
              }
            }}>
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
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.main
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.main
                },
                '.MuiSelect-icon': {
                  color: isDarkMode ? 'white' : 'inherit'
                }
              }}
            >
              <MenuItem value={5}>5 per page</MenuItem>
              <MenuItem value={10}>10 per page</MenuItem>
              <MenuItem value={25}>25 per page</MenuItem>
            </Select>
          </FormControl>
          <Typography 
            variant={isMobile ? "body2" : "body1"} 
            sx={{ 
              color: isDarkMode ? 'white' : 'rgba(0,0,0,0.6)',
              minWidth: 100
            }}
          >
            {`${page * rowsPerPage + 1}-${Math.min((page + 1) * rowsPerPage, data.length)} of ${data.length}`}
          </Typography>
        </Box>

        {/* Centered pagination */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          order: { xs: 1, sm: 2 },
          flex: 1
        }}>
          <Pagination
            count={pageCount}
            page={currentPage}
            onChange={handlePageChange}
            size={isMobile ? "small" : "medium"}
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
                    }
                  },
                  '&.MuiPaginationItem-ellipsis': {
                    color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'inherit'
                  },
                  '&.MuiPaginationItem-text': {
                    '&:hover': {
                      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)'
                    }
                  },
                  '&.Mui-disabled': {
                    color: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'
                  }
                }}
              />
            )}
          />
        </Box>

        {/* Spacer for layout balance */}
        <Box sx={{ 
          width: { xs: '100%', sm: 'auto' },
          flex: { sm: '0 0 182px' },
          order: { xs: 3, sm: 3 }
        }} />
      </Box>
    );
  };

  // View Dialog Content
  const renderViewDialogContent = () => {
    if (!selectedData) return null;
    
    return (
      <Stack spacing={3}>
        <Typography><strong>ID:</strong> {selectedData.orderNumber}</Typography>
        <Typography><strong>Name:</strong> {selectedData.customer}</Typography>
        <Typography><strong>Description:</strong> {selectedData.description}</Typography>
        <Typography><strong>Status:</strong> 
          <Chip
            label={selectedData.status}
            size="small"
            sx={{
              ml: 1,
              backgroundColor: getStatusColor(selectedData.status).bg,
              color: getStatusColor(selectedData.status).text,
              textTransform: 'capitalize'
            }}
          />
        </Typography>
        
        <Box>
          <Typography variant="subtitle1" gutterBottom><strong>Skills:</strong></Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {selectedData.skills.map((skill, index) => (
              <Chip 
                key={index} 
                label={skill} 
                size="small"
                sx={{
                  backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  color: isDarkMode ? 'white' : 'inherit',
                  my: 0.5
                }}
              />
            ))}
          </Stack>
        </Box>
        
        <Box>
          <Typography variant="subtitle1" gutterBottom><strong>Images:</strong></Typography>
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
                    backgroundImage: `url(${image})`,
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
                      }
                    }
                  }}
                  onClick={() => window.open(image, '_blank')}
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
                      filter: 'drop-shadow(0px 0px 2px rgba(0,0,0,0.5))'
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
          <Typography variant="subtitle1" gutterBottom><strong>Resume:</strong></Typography>
          {selectedData.pdf ? (
            <Button
              variant="outlined"
              startIcon={<PdfIcon />}
              onClick={() => window.open(selectedData.pdf, '_blank')}
              sx={{
                color: isDarkMode ? 'white' : 'primary.main',
                borderColor: isDarkMode ? 'rgba(255,255,255,0.23)' : 'primary.main',
                '&:hover': {
                  borderColor: isDarkMode ? 'white' : 'primary.dark',
                  backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)'
                }
              }}
            >
              View Resume
            </Button>
          ) : (
            <Typography variant="body2" sx={{ color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>
              No resume available
            </Typography>
          )}
        </Box>
      </Stack>
    );
  };

  // Edit Dialog Content
  const renderEditDialogContent = () => {
    if (!editFormData) return null;

    return (
      <Stack spacing={2} sx={{ mt: 2 }}>
        <TextField
          label="Name"
          value={editFormData.customer}
          onChange={(e) => setEditFormData({
            ...editFormData,
            customer: e.target.value
          })}
          fullWidth
          sx={{
            '& .MuiInputLabel-root': {
              color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'inherit',
              '&.Mui-focused': {
                color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'inherit'
              }
            },
            '& .MuiOutlinedInput-root': {
              color: isDarkMode ? 'white' : 'inherit',
              '& fieldset': {
                borderColor: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.23)'
              },
              '&:hover fieldset': {
                borderColor: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.5)'
              },
              '&.Mui-focused fieldset': {
                borderColor: isDarkMode ? 'white' : theme.palette.primary.main
              }
            }
          }}
        />
        <TextField
          label="Description"
          value={editFormData.description}
          onChange={(e) => setEditFormData({
            ...editFormData,
            description: e.target.value
          })}
          fullWidth
          multiline
          rows={4}
          sx={{
            '& .MuiInputLabel-root': {
              color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'inherit',
              '&.Mui-focused': {
                color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'inherit'
              }
            },
            '& .MuiOutlinedInput-root': {
              color: isDarkMode ? 'white' : 'inherit',
              '& fieldset': {
                borderColor: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.23)'
              },
              '&:hover fieldset': {
                borderColor: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.5)'
              },
              '&.Mui-focused fieldset': {
                borderColor: isDarkMode ? 'white' : theme.palette.primary.main
              }
            }
          }}
        />
        <SkillsInputComponent 
          skills={editFormData.skills} 
          onChange={(newSkills) => setEditFormData({
            ...editFormData,
            skills: newSkills
          })}
        />
        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
          {editFormData.images.map((imageUrl, index) => (
            <Box 
              key={index} 
              sx={{ 
                position: 'relative',
                mb: 1
              }}
            >
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  border: '1px solid',
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.23)' : 'rgba(0,0,0,0.23)',
                  borderRadius: 1,
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}
              >
                {imageUrl.startsWith('blob:') || imageUrl.startsWith('http') ? (
                  <img 
                    src={imageUrl} 
                    alt={`Upload ${index}`} 
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                  />
                ) : (
                  <Typography variant="caption" sx={{ p: 1, textAlign: 'center' }}>
                    {imageUrl}
                  </Typography>
                )}
              </Box>
              <IconButton
                size="small"
                onClick={() => {
                  if (imageUrl.startsWith('blob:')) {
                    URL.revokeObjectURL(imageUrl);
                  }
                  const newImages = [...editFormData.images];
                  newImages.splice(index, 1);
                  setEditFormData({
                    ...editFormData,
                    images: newImages
                  });
                }}
                sx={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  backgroundColor: isDarkMode ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.9)',
                  color: isDarkMode ? 'white' : 'error.main',
                  '&:hover': {
                    backgroundColor: isDarkMode ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,1)',
                  },
                  width: 24,
                  height: 24
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
              color: isDarkMode ? 'white' : 'inherit',
              borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
              '&:hover': {
                borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)',
              },
              minWidth: 120,
              height: 120,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <AddIcon sx={{ mb: 1 }} />
            Upload Image
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file && file.type.startsWith('image/')) {
                  const fileURL = URL.createObjectURL(file);
                  setEditFormData({
                    ...editFormData,
                    images: [...editFormData.images, fileURL]
                  });
                }
              }}
            />
          </Button>
        </Stack>
        <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
          OR
        </Typography>
        <TextField
          label="Image URLs"
          placeholder="https://example.com/image.jpg, https://example.com/image2.jpg"
          value=""
          onChange={(e) => {
            const urls = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
            if (urls.length > 0) {
              setEditFormData({
                ...editFormData,
                images: [...editFormData.images, ...urls]
              });
              e.target.value = '';
            }
          }}
          fullWidth
          size="small"
          sx={{
            '& .MuiInputLabel-root': {
              color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'inherit',
              '&.Mui-focused': {
                color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'inherit'
              }
            },
            '& .MuiOutlinedInput-root': {
              color: isDarkMode ? 'white' : 'inherit',
              '& fieldset': {
                borderColor: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.23)'
              },
              '&:hover fieldset': {
                borderColor: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.5)'
              },
              '&.Mui-focused fieldset': {
                borderColor: isDarkMode ? 'white' : theme.palette.primary.main
              }
            }
          }}
        />
        {!editFormData.pdf ? (
          <Button
            variant="outlined"
            component="label"
            sx={{
              color: isDarkMode ? 'white' : 'inherit',
              borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
              '&:hover': {
                borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            Upload PDF
            <input
              type="file"
              accept="application/pdf"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file && file.type === 'application/pdf') {
                  const fileURL = URL.createObjectURL(file);
                  setEditFormData({ ...editFormData, pdf: fileURL });
                }
              }}
            />
          </Button>
        ) : (
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => window.open(editFormData.pdf, '_blank')}
            >
              View PDF
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                URL.revokeObjectURL(editFormData.pdf);
                setEditFormData({ ...editFormData, pdf: '' });
              }}
            >
              Remove PDF
            </Button>
          </Stack>
        )}
        <Button
          variant="outlined"
          onClick={() => setEditFormData({
            ...editFormData,
            status: editFormData.status === 'active' ? 'unActive' : 'active'
          })}
          sx={{
            color: isDarkMode ? 'white' : 'inherit',
            borderColor: isDarkMode ? 'rgba(255,255,255,0.23)' : 'rgba(0,0,0,0.23)',
            '&:hover': {
              borderColor: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
              backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)'
            }
          }}
        >
          Toggle Status: {editFormData.status}
        </Button>
      </Stack>
    );
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: { xs: 2, sm: 3, md: 4 },
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Typography 
          variant={isMobile ? "h5" : "h4"}
          sx={{ 
            color: isDarkMode ? 'white' : 'inherit',
            fontWeight: 'bold'
          }}
        >
          Portfolio Home
        </Typography>
        <Button  
          onClick={handleAddOpen}
          size={isMobile ? "small" : "medium"}
        >
          <AddIcon />
        </Button>
      </Box>

      <Paper
        elevation={0}
        sx={{
          backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <Box sx={{ p: { xs: 2, sm: 3 }, pb: 2 }}>
          <Typography 
            variant={isMobile ? "subtitle1" : "h6"} 
            sx={{ color: isDarkMode ? 'white' : 'inherit' }}
          >
            Home Table
          </Typography>
        </Box>
        
        {isMobile ? (
          <Box sx={{ px: 2, pb: 2 }}>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(renderMobileCard)}
          </Box>
        ) : (
          renderDesktopTable()
        )}

        <CustomPagination />
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
              padding: '16px 24px'
            },
            '& .MuiDialogContent-root': {
              color: isDarkMode ? 'white' : 'inherit',
              padding: '24px'
            },
            '& .MuiDialogActions-root': {
              borderTop: 1,
              borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              padding: '16px 24px'
            }
          }
        }}
      >
        <DialogTitle>View Details</DialogTitle>
        <DialogContent>
          {renderViewDialogContent()}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleViewClose}
            variant="outlined"
            size="medium"
            color="info"
          >
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
              padding: '16px 24px'
            },
            '& .MuiDialogContent-root': {
              color: isDarkMode ? 'white' : 'inherit',
              padding: '24px'
            },
            '& .MuiDialogActions-root': {
              borderTop: 1,
              borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              padding: '16px 24px'
            }
          }
        }}
      >
        <DialogTitle>Edit Details</DialogTitle>
        <DialogContent>
          {renderEditDialogContent()}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleEditClose}
            variant="outlined"
            size="medium"
            color="info"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleEditSave} 
            variant="contained"
            size="medium"
            color="success"
          >
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
              padding: '16px 24px'
            },
            '& .MuiDialogContent-root': {
              color: isDarkMode ? 'white' : 'inherit',
              padding: '24px'
            },
            '& .MuiDialogActions-root': {
              borderTop: 1,
              borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              padding: '16px 24px'
            }
          }
        }}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'inherit' }}>
            Are you sure you want to delete this record?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleDeleteClose}
            variant="outlined"
            size="medium"
            color="info"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            variant="contained"
            size="medium"
            color="error"
          >
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
              padding: '16px 24px'
            },
            '& .MuiDialogContent-root': {
              color: isDarkMode ? 'white' : 'inherit',
              padding: '24px'
            },
            '& .MuiDialogActions-root': {
              borderTop: 1,
              borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              padding: '16px 24px'
            }
          }
        }}
      >
        <DialogTitle>Add New Record</DialogTitle>
        <DialogContent>
          {editFormData && (
            <Stack spacing={2} sx={{ mt: 2 }}>
              <TextField
                label="Name"
                value={editFormData.customer}
                onChange={(e) => setEditFormData({ ...editFormData, customer: e.target.value })}
                fullWidth
                sx={{
                  '& .MuiInputLabel-root': {
                    color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'inherit',
                    '&.Mui-focused': {
                      color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'inherit'
                    }
                  },
                  '& .MuiOutlinedInput-root': {
                    color: isDarkMode ? 'white' : 'inherit',
                    '& fieldset': {
                      borderColor: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.23)'
                    },
                    '&:hover fieldset': {
                      borderColor: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.5)'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: isDarkMode ? 'white' : theme.palette.primary.main
                    }
                  }
                }}
              />
              <TextField
                label="Description"
                value={editFormData.description}
                onChange={(e) => setEditFormData({
                  ...editFormData,
                  description: e.target.value
                })}
                fullWidth
                multiline
                rows={4}
                sx={{
                  '& .MuiInputLabel-root': {
                    color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'inherit',
                    '&.Mui-focused': {
                      color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'inherit'
                    }
                  },
                  '& .MuiOutlinedInput-root': {
                    color: isDarkMode ? 'white' : 'inherit',
                    '& fieldset': {
                      borderColor: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.23)'
                    },
                    '&:hover fieldset': {
                      borderColor: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.5)'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: isDarkMode ? 'white' : theme.palette.primary.main
                    }
                  }
                }}
              />
              <SkillsInputComponent 
                skills={editFormData.skills} 
                onChange={(newSkills) => setEditFormData({
                  ...editFormData,
                  skills: newSkills
                })}
              />
              <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
                {editFormData.images.map((imageUrl, index) => (
                  <Box 
                    key={index} 
                    sx={{ 
                      position: 'relative',
                      mb: 1
                    }}
                  >
                    <Box
                      sx={{
                        width: 120,
                        height: 120,
                        border: '1px solid',
                        borderColor: isDarkMode ? 'rgba(255,255,255,0.23)' : 'rgba(0,0,0,0.23)',
                        borderRadius: 1,
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative'
                      }}
                    >
                      {imageUrl.startsWith('blob:') || imageUrl.startsWith('http') ? (
                        <img 
                          src={imageUrl} 
                          alt={`Upload ${index}`} 
                          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                        />
                      ) : (
                        <Typography variant="caption" sx={{ p: 1, textAlign: 'center' }}>
                          {imageUrl}
                        </Typography>
                      )}
                    </Box>
                    <IconButton
                      size="small"
                      onClick={() => {
                        if (imageUrl.startsWith('blob:')) {
                          URL.revokeObjectURL(imageUrl);
                        }
                        const newImages = [...editFormData.images];
                        newImages.splice(index, 1);
                        setEditFormData({
                          ...editFormData,
                          images: newImages
                        });
                      }}
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        backgroundColor: isDarkMode ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.9)',
                        color: isDarkMode ? 'white' : 'error.main',
                        '&:hover': {
                          backgroundColor: isDarkMode ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,1)',
                        },
                        width: 24,
                        height: 24
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
                    color: isDarkMode ? 'white' : 'inherit',
                    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                    '&:hover': {
                      borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)',
                    },
                    minWidth: 120,
                    height: 120,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}
                >
                  <AddIcon sx={{ mb: 1 }} />
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && file.type.startsWith('image/')) {
                        const fileURL = URL.createObjectURL(file);
                        setEditFormData({
                          ...editFormData,
                          images: [...editFormData.images, fileURL]
                        });
                      }
                    }}
                  />
                </Button>
              </Stack>
              <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
                OR
              </Typography>
              <TextField
                label="Image URLs"
                placeholder="https://example.com/image.jpg, https://example.com/image2.jpg"
                value=""
                onChange={(e) => {
                  const urls = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                  if (urls.length > 0) {
                    setEditFormData({
                      ...editFormData,
                      images: [...editFormData.images, ...urls]
                    });
                    e.target.value = '';
                  }
                }}
                fullWidth
                size="small"
                sx={{
                  '& .MuiInputLabel-root': {
                    color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'inherit',
                    '&.Mui-focused': {
                      color: isDarkMode ? 'rgba(255,255,255,0.8)' : 'inherit'
                    }
                  },
                  '& .MuiOutlinedInput-root': {
                    color: isDarkMode ? 'white' : 'inherit',
                    '& fieldset': {
                      borderColor: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.23)'
                    },
                    '&:hover fieldset': {
                      borderColor: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.5)'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: isDarkMode ? 'white' : theme.palette.primary.main
                    }
                  }
                }}
              />
              {!editFormData.pdf ? (
                <Button
                  variant="outlined"
                  component="label"
                  sx={{
                    color: isDarkMode ? 'white' : 'inherit',
                    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                    '&:hover': {
                      borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  Upload PDF
                  <input
                    type="file"
                    accept="application/pdf"
                    hidden
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && file.type === 'application/pdf') {
                        const fileURL = URL.createObjectURL(file);
                        setEditFormData({ ...editFormData, pdf: fileURL });
                      }
                    }}
                  />
                </Button>
              ) : (
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => window.open(editFormData.pdf, '_blank')}
                  >
                    View PDF
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      URL.revokeObjectURL(editFormData.pdf);
                      setEditFormData({ ...editFormData, pdf: '' });
                    }}
                  >
                    Remove PDF
                  </Button>
                </Stack>
              )}
              <Button
                variant="outlined"
                onClick={() => setEditFormData({
                  ...editFormData,
                  status: editFormData.status === 'active' ? 'unActive' : 'active'
                })}
                sx={{
                  color: isDarkMode ? 'white' : 'inherit',
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.23)' : 'rgba(0,0,0,0.23)',
                  '&:hover': {
                    borderColor: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)'
                  }
                }}
              >
                Toggle Status: {editFormData.status}
              </Button>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleAddClose}
            variant="outlined"
            size="medium"
            color="info"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddSave} 
            variant="contained"
            size="medium"
            color="secondary"
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HomePage;