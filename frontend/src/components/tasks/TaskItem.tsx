import React from 'react';
import {
  Box,
  Checkbox,
  Chip,
  IconButton,
  Paper,
  Tooltip,
  Typography
} from '@mui/material';
import {
  CalendarToday,
  Delete,
  Edit,
  Flag,
  Folder,
  LocalHospital,
  Person,
  ShoppingCart,
  Work,
  AttachMoney
} from '@mui/icons-material';
import { Task } from '../../services/api';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

// Format date helper function
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleComplete, onEditTask, onDeleteTask }) => {
  // Get priority color
  const getPriorityColor = (priority: string | undefined) => {
    switch (priority) {
      case 'high': return '#f44336';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#757575';
    }
  };

  // Get category icon
  const getCategoryIcon = (category: string | undefined) => {
    switch (category) {
      case 'Work': return <Work />;
      case 'Personal': return <Person />;
      case 'Shopping': return <ShoppingCart />;
      case 'Health': return <LocalHospital />;
      case 'Finance': return <AttachMoney />;
      default: return <Folder />;
    }
  };

  // Handle task completion toggle
  const handleToggleComplete = () => {
    onToggleComplete(task);
  };

  // Handle task edit
  const handleEditTask = () => {
    onEditTask(task);
  };

  // Handle task delete
  const handleDeleteTask = () => {
    if (task._id) {
      onDeleteTask(task._id);
    }
  };

  return (
    <Paper
      elevation={1}
      sx={{
        mb: 2,
        borderRadius: 2,
        borderLeft: `4px solid ${getPriorityColor(task.priority)}`,
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
              onChange={handleToggleComplete}
              sx={{
                mt: -0.5,
                mr: 1,
                color: getPriorityColor(task.priority),
                '&.Mui-checked': {
                  color: getPriorityColor(task.priority),
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
                onClick={handleEditTask}
                size="small"
                sx={{ color: 'primary.main' }}
              >
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete task">
              <IconButton
                onClick={handleDeleteTask}
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
  );
};

export default TaskItem;
