import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Paper, Box, Divider, CircularProgress, TextField, Button, 
  Checkbox, IconButton, Select, MenuItem, FormControl, InputLabel, Chip, Tooltip,
  Collapse, InputAdornment, Tab, Tabs, Dialog, DialogTitle, DialogContent,
  DialogActions, Drawer, List, ListItem, ListItemText, ListItemIcon, Autocomplete,
  Snackbar, Alert, Card, CardContent, Avatar
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  Legend, ResponsiveContainer, LineChart, Line
} from 'recharts';
import { 
  Assignment, CheckCircle, Pending, Flag, Edit, Delete, Add, Save, Close, 
  KeyboardArrowDown, KeyboardArrowUp, Task, Category, CalendarToday, Work,
  Person, ShoppingCart, LocalHospital, AttachMoney, Folder, AssignmentTurnedIn,
  Search, FilterList, ViewList, ViewModule, ViewWeek, DragIndicator, Event,
  Today, DateRange, ArrowBack, ArrowForward, Timer as TimerIcon, Refresh as RefreshIcon
} from '@mui/icons-material';
import PomodoroTimer from '../components/pomodoro/PomodoroTimer';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface SubTask {
  id: number;
  title: string;
  completed: boolean;
}

interface Task {
  _id?: string;
  id?: number;  // Keep for backward compatibility
  title: string;
  completed: boolean;
  category?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  dependsOn?: string[];
  subtasks?: SubTask[];
  progress?: number;
  user_id?: string;
}

const API_URL = 'http://localhost:5000/tasks';

// TaskForm component
interface TaskFormProps {
  initialTask?: Task;
  onSubmit: (task: Task) => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

const CATEGORIES = ['Work', 'Personal', 'Shopping', 'Health', 'Finance', 'Other'];
const PRIORITIES = [
  { value: 'low', label: 'Low', color: '#4caf50' },
  { value: 'medium', label: 'Medium', color: '#ff9800' },
  { value: 'high', label: 'High', color: '#f44336' }
];

const TaskForm: React.FC<TaskFormProps> = ({ initialTask, onSubmit, onCancel, isEditing = false }) => {
  const [expanded, setExpanded] = useState(!isEditing);
  const [task, setTask] = useState<Task>(initialTask || {
    _id: '',
    title: '',
    completed: false,
    category: 'Work',
    priority: 'medium',
    dueDate: '',
    dependsOn: [],
    subtasks: [],
    progress: 0,
    user_id: 'default_user'
  });
  
  const [newSubtask, setNewSubtask] = useState('');
  const [availableTasks, setAvailableTasks] = useState<Task[]>([]);
  
  useEffect(() => {
    // Fetch available tasks for dependencies
    const fetchAvailableTasks = async () => {
      try {
        const res = await axios.get(API_URL);
        // Filter out the current task if editing
        const filteredTasks = isEditing 
          ? res.data.filter((t: Task) => t._id !== task._id)
          : res.data;
        setAvailableTasks(filteredTasks);
      } catch (error) {
        console.error('Error fetching available tasks:', error);
      }
    };
    
    fetchAvailableTasks();
  }, [task._id, isEditing]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTask(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setTask(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleDependencyChange = (_: React.ChangeEvent<{}>, value: Task[]) => {
    const dependsOn = value.map(t => t._id as string);
    setTask(prev => ({ ...prev, dependsOn }));
  };
  
  const addSubtask = () => {
    if (!newSubtask.trim()) return;
    
    const newSubtaskObj: SubTask = {
      id: Date.now(),
      title: newSubtask,
      completed: false
    };
    
    setTask(prev => ({
      ...prev,
      subtasks: [...(prev.subtasks || []), newSubtaskObj]
    }));
    
    setNewSubtask('');
  };
  
  const removeSubtask = (id: number) => {
    setTask(prev => ({
      ...prev,
      subtasks: prev.subtasks?.filter(st => st.id !== id)
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(task);
    if (!isEditing) {
      setTask({
        _id: '',
        title: '',
        completed: false,
        category: 'Work',
        priority: 'medium',
        dueDate: '',
        dependsOn: [],
        subtasks: [],
        progress: 0,
        user_id: 'default_user'
      });
      setExpanded(false);
    }
  };
  
  return (
    <Paper id="task-form" elevation={3} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          {isEditing ? 'Edit Task' : 'Add New Task'}
        </Typography>
        {!isEditing && (
          <IconButton onClick={() => setExpanded(!expanded)}>
            {expanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        )}
      </Box>
      
      <Collapse in={expanded || isEditing}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Task Title"
              name="title"
              value={task.title}
              onChange={handleChange}
              variant="outlined"
              required
              size="small"
            />
            
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={task.category || ''}
                  onChange={handleSelectChange as any}
                  label="Category"
                >
                  {CATEGORIES.map(category => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl fullWidth size="small">
                <InputLabel>Priority</InputLabel>
                <Select
                  name="priority"
                  value={task.priority || 'medium'}
                  onChange={handleSelectChange as any}
                  label="Priority"
                >
                  {PRIORITIES.map(priority => (
                    <MenuItem key={priority.value} value={priority.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: priority.color,
                            mr: 1
                          }}
                        />
                        {priority.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
            <TextField
              fullWidth
              label="Due Date"
              name="dueDate"
              type="date"
              value={task.dueDate || ''}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
            
            <Autocomplete
              multiple
              options={availableTasks}
              getOptionLabel={(option) => option.title}
              value={availableTasks.filter(t => task.dependsOn?.includes(t._id as string))}
              onChange={handleDependencyChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Depends On"
                  placeholder="Select dependencies"
                  size="small"
                />
              )}
            />
            
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Subtasks
              </Typography>
              <Box sx={{ display: 'flex', mb: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Add a subtask"
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubtask())}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={addSubtask}
                  sx={{ ml: 1 }}
                >
                  Add
                </Button>
              </Box>
              
              <Box sx={{ mt: 1 }}>
                {task.subtasks && task.subtasks.length > 0 ? (
                  task.subtasks.map((subtask) => (
                    <Box
                      key={subtask.id}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 1,
                        mb: 1,
                        borderRadius: 1,
                        bgcolor: 'background.paper',
                        boxShadow: 1
                      }}
                    >
                      <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                        {subtask.title}
                      </Typography>
                      <IconButton size="small" onClick={() => removeSubtask(subtask.id)}>
                        <Close fontSize="small" />
                      </IconButton>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No subtasks added yet
                  </Typography>
                )}
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
              {onCancel && (
                <Button variant="outlined" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={isEditing ? <Save /> : <Add />}
              >
                {isEditing ? 'Update Task' : 'Add Task'}
              </Button>
            </Box>
          </Box>
        </form>
      </Collapse>
    </Paper>
  );
};

// TaskList component
interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onToggleComplete, onEditTask, onDeleteTask }) => {
  const [expandedTasks, setExpandedTasks] = useState<number[]>([]);
  
  // Toggle expanded state for a task
  const toggleExpanded = (taskId: number) => {
    setExpandedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId) 
        : [...prev, taskId]
    );
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#f44336';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#757575';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Work': return <Work />;
      case 'Personal': return <Person />;
      case 'Shopping': return <ShoppingCart />;
      case 'Health': return <LocalHospital />;
      case 'Finance': return <AttachMoney />;
      default: return <Folder />;
    }
  };

  // Format date helper function
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Find dependent tasks
  const findDependentTasks = (taskId: number) => {
    return tasks.filter(task => task.dependsOn?.includes(String(taskId)));
  };

  // Check if a task's dependencies are completed
  const areDependenciesCompleted = (task: Task) => {
    if (!task.dependsOn || task.dependsOn.length === 0) return true;
    
    const dependencies = tasks.filter(t => t._id && task.dependsOn?.includes(t._id));
    return dependencies.every(t => t.completed);
  };

  // Calculate task status based on dependencies and completion
  const getTaskStatus = (task: Task) => {
    if (task.completed) return 'completed';
    if (!areDependenciesCompleted(task)) return 'blocked';
    return 'active';
  };

  if (tasks.length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <AssignmentTurnedIn sx={{ fontSize: 60, color: 'text.disabled' }} />
          <Typography variant="h6" color="textSecondary">
            No tasks available
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Add a new task to get started with your productivity journey!
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Box>
      {tasks.map((task) => (
        <Paper 
          key={task._id} 
          elevation={1} 
          sx={{ 
            mb: 2, 
            borderRadius: 2,
            borderLeft: `4px solid ${getPriorityColor(task.priority || 'medium')}`,
            transition: 'all 0.2s ease',
            '&:hover': {
              boxShadow: 3,
              transform: 'translateY(-2px)'
            },
            opacity: task.completed ? 0.7 : 1
          }}
        >
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', flex: 1 }}>
                <Checkbox
                  checked={task.completed}
                  onChange={() => onToggleComplete(task)}
                  sx={{ 
                    mt: -0.5, 
                    mr: 1,
                    color: getPriorityColor(task.priority || 'medium'),
                    '&.Mui-checked': {
                      color: getPriorityColor(task.priority || 'medium'),
                    }
                  }}
                />
                <Box>
                  <Typography
                    variant="body1"
                    sx={{ 
                      fontWeight: task.completed ? 'normal' : 500,
                      textDecoration: task.completed ? 'line-through' : 'none',
                      color: task.completed ? 'text.secondary' : 'text.primary'
                    }}
                  >
                    {task.title}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                    {task.category && (
                      <Chip 
                        size="small" 
                        icon={getCategoryIcon(task.category)} 
                        label={task.category}
                        sx={{ fontSize: '0.75rem' }}
                      />
                    )}
                    
                    {task.priority && (
                      <Chip 
                        size="small" 
                        icon={<Flag sx={{ color: `${getPriorityColor(task.priority)} !important` }} />} 
                        label={task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        sx={{ fontSize: '0.75rem' }}
                      />
                    )}
                    
                    {task.dueDate && (
                      <Chip
                        icon={<CalendarToday fontSize="small" />}
                        label={formatDate(task.dueDate)}
                        size="small"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    )}
                  </Box>
                </Box>
              </Box>
              
              <Box>
                <Tooltip title="Edit task">
                  <IconButton 
                    onClick={() => onEditTask(task)}
                    size="small"
                    sx={{ color: 'primary.main' }}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete task">
                  <IconButton 
                    onClick={() => task._id && onDeleteTask(task._id)}
                    size="small"
                    sx={{ color: 'error.main' }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Box>
        </Paper>
      ))}
    </Box>
  );
};

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    category: '',
    priority: '',
    completed: 'all'
  });
  
  // Get authentication context
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  const [view, setView] = useState<'list' | 'board' | 'calendar'>('list');
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [pomodoroVisible, setPomodoroVisible] = useState<boolean>(false);
  const [selectedTaskForPomodoro, setSelectedTaskForPomodoro] = useState<string | null>(null);
  const [pomodoroSnackbar, setPomodoroSnackbar] = useState<{open: boolean, message: string}>({
    open: false,
    message: ''
  });

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      // Get tasks for the current user
      const res = await axios.get(`${API_URL}?user_id=${user?._id || 'default'}`);
      setTasks(res.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (task: Task) => {
    try {
      // Add user_id to task
      const taskWithUser = { ...task, user_id: user?._id || 'default' };
      await axios.post(API_URL, taskWithUser);
      fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleUpdateTask = async (task: Task) => {
    if (!task._id) return;
    
    try {
      await axios.put(`${API_URL}/${task._id}`, task);
      fetchTasks();
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      const taskId = task._id;
      if (!taskId) {
        console.error('Task has no _id');
        return;
      }
      
      await axios.put(`${API_URL}/${taskId}`, { ...task, completed: !task.completed });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      if (!id) {
        console.error('Task has no _id');
        return;
      }
      
      await axios.delete(`${API_URL}/${id}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  // Pomodoro timer handlers
  const handleTogglePomodoro = () => {
    setPomodoroVisible(prev => !prev);
  };

  const handleSelectTaskForPomodoro = (taskId: string | null) => {
    setSelectedTaskForPomodoro(taskId);
  };

  const handlePomodoroComplete = (mode: string) => {
    // Update task progress when a pomodoro session is completed
    if (mode === 'work' && selectedTaskForPomodoro) {
      const task = tasks.find(t => t._id === selectedTaskForPomodoro);
      if (task) {
        setPomodoroSnackbar({
          open: true,
          message: `Pomodoro completed for task: ${task.title}`
        });
      }
    } else if (mode === 'shortBreak' || mode === 'longBreak') {
      setPomodoroSnackbar({
        open: true,
        message: `${mode === 'shortBreak' ? 'Short' : 'Long'} break completed!`
      });
    }
  };

  const handleCloseSnackbar = () => {
    setPomodoroSnackbar({
      open: false,
      message: ''
    });
  };

  // Dashboard statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const highPriorityTasks = tasks.filter(task => task.priority === 'high' && !task.completed).length;

  // If still loading auth or redirecting
  if (authLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Existing loading check
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Task Dashboard
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
              <Avatar 
                sx={{ width: 40, height: 40, mr: 1 }}
                src={user.picture}
                alt={user.name}
              >
                {user.name?.charAt(0) || 'U'}
              </Avatar>
              <Typography variant="subtitle1">
                {user.name}
              </Typography>
            </Box>
          )}
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => {
              setEditingTask(null);
              // Ensure the form is expanded
              const taskFormElement = document.getElementById('task-form');
              if (taskFormElement) {
                taskFormElement.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Add Task
          </Button>
        </Box>
      </Box>
      
      {/* Search Bar */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Search tasks by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
            endAdornment: searchTerm ? (
              <InputAdornment position="end">
                <IconButton onClick={() => setSearchTerm('')} size="small">
                  <Close fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
          variant="outlined"
          size="small"
          sx={{ bgcolor: 'background.paper' }}
        />
      </Box>
      
      {/* Dashboard Stats */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 2, flex: '1 1 200px', minWidth: '150px' }}>
            <Assignment sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4">{totalTasks}</Typography>
            <Typography variant="body2" color="textSecondary">Total Tasks</Typography>
          </Paper>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 2, flex: '1 1 200px', minWidth: '150px' }}>
            <CheckCircle sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
            <Typography variant="h4">{completedTasks}</Typography>
            <Typography variant="body2" color="textSecondary">Completed</Typography>
          </Paper>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 2, flex: '1 1 200px', minWidth: '150px' }}>
            <Pending sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
            <Typography variant="h4">{pendingTasks}</Typography>
            <Typography variant="body2" color="textSecondary">Pending</Typography>
          </Paper>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 2, flex: '1 1 200px', minWidth: '150px' }}>
            <Flag sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
            <Typography variant="h4">{highPriorityTasks}</Typography>
            <Typography variant="body2" color="textSecondary">High Priority</Typography>
          </Paper>
        </Box>
      </Box>
      
      {/* Task Statistics and Charts */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h2">
            Task Statistics
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => fetchTasks()}
            startIcon={<RefreshIcon />}
            size="small"
          >
            Refresh
          </Button>
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
          {/* Task Completion Rate */}
          <Paper sx={{ p: 2, borderRadius: 2, flex: 1 }}>
            <Typography variant="subtitle1" gutterBottom align="center">
              Task Completion Rate
            </Typography>
            <Box sx={{ height: 250, display: 'flex', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Completed', value: completedTasks },
                      { name: 'Pending', value: pendingTasks }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    <Cell key="cell-0" fill="#4caf50" />
                    <Cell key="cell-1" fill="#ff9800" />
                  </Pie>
                  <RechartsTooltip formatter={(value: any, name: any) => [`${value} tasks`, name]} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
          
          {/* Task Distribution by Category */}
          <Paper sx={{ p: 2, borderRadius: 2, flex: 1 }}>
            <Typography variant="subtitle1" gutterBottom align="center">
              Tasks by Category
            </Typography>
            <Box sx={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={(() => {
                    const categoryData: Record<string, number> = {};
                    CATEGORIES.forEach(category => {
                      categoryData[category] = 0;
                    });
                    
                    tasks.forEach(task => {
                      if (task.category) {
                        categoryData[task.category] = (categoryData[task.category] || 0) + 1;
                      }
                    });
                    
                    return Object.keys(categoryData)
                      .filter(category => categoryData[category] > 0)
                      .map(category => ({
                        name: category,
                        count: categoryData[category]
                      }));
                  })()}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip formatter={(value: any) => [`${value} tasks`]} />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
          
          {/* Task Distribution by Priority */}
          <Paper sx={{ p: 2, borderRadius: 2, flex: 1 }}>
            <Typography variant="subtitle1" gutterBottom align="center">
              Tasks by Priority
            </Typography>
            <Box sx={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'High', count: tasks.filter(t => t.priority === 'high').length, color: '#f44336' },
                    { name: 'Medium', count: tasks.filter(t => t.priority === 'medium').length, color: '#ff9800' },
                    { name: 'Low', count: tasks.filter(t => t.priority === 'low').length, color: '#4caf50' }
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip formatter={(value: any) => [`${value} tasks`]} />
                  <Bar dataKey="count">
                    {[
                      { name: 'High', color: '#f44336' },
                      { name: 'Medium', color: '#ff9800' },
                      { name: 'Low', color: '#4caf50' }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Box>
      </Box>
      
      {/* Task Form Section */}
      <Box sx={{ mb: 4 }}>
        {editingTask ? (
          <TaskForm
            initialTask={editingTask}
            onSubmit={handleUpdateTask}
            onCancel={handleCancelEdit}
            isEditing={true}
          />
        ) : (
          <TaskForm onSubmit={handleAddTask} />
        )}
      </Box>
      
      {/* Pomodoro Timer Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h2">
            Pomodoro Timer
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleTogglePomodoro}
            startIcon={pomodoroVisible ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            size="small"
          >
            {pomodoroVisible ? 'Hide Timer' : 'Show Timer'}
          </Button>
        </Box>
        
        <Collapse in={pomodoroVisible} timeout="auto">
          <PomodoroTimer
            onComplete={handlePomodoroComplete}
            selectedTaskId={selectedTaskForPomodoro}
            onSelectTask={handleSelectTaskForPomodoro}
            tasks={tasks.filter(task => !task.completed)}
          />
        </Collapse>
      </Box>
      
      {/* Tasks Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h2">
            My Tasks {searchTerm && `(Search: ${searchTerm})`}
          </Typography>
          {searchTerm && (
            <Button
              size="small"
              startIcon={<RefreshIcon />}
              onClick={() => setSearchTerm('')}
              variant="outlined"
            >
              Clear Search
            </Button>
          )}
        </Box>
        
        {/* Apply filters */}
        {(() => {
          const filteredTasks = applyFilters(tasks);
          const hasFilters = searchTerm || filters.category || filters.priority || filters.completed !== 'all';
          
          return filteredTasks.length === 0 && hasFilters ? (
            <Paper elevation={2} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <Search sx={{ fontSize: 60, color: 'text.disabled' }} />
                <Typography variant="h6" color="textSecondary">
                  No tasks found with current filters
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Try different filter settings or {' '}
                  <Button 
                    variant="text" 
                    onClick={() => {
                      setSearchTerm('');
                      setFilters({ category: '', priority: '', completed: 'all' });
                    }}
                  >
                    clear all filters
                  </Button>
                </Typography>
              </Box>
            </Paper>
          ) : (
            <Box>
              {hasFilters && filteredTasks.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Showing {filteredTasks.length} of {tasks.length} tasks
                  </Typography>
                </Box>
              )}
              <TaskList
                tasks={filteredTasks}
                onToggleComplete={handleToggleComplete}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
              />
            </Box>
          );
        })()}
      </Box>
      
      {/* Pomodoro completion notification */}
      <Snackbar
        open={pomodoroSnackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {pomodoroSnackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Dashboard;