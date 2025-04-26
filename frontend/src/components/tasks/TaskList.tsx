import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Checkbox, IconButton, Typography, Chip, Box, Paper, Tooltip } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Flag as FlagIcon, CalendarToday as CalendarIcon } from '@mui/icons-material';

interface Task {
  id: number;
  title: string;
  completed: boolean;
  category?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
}

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onToggleComplete, onEditTask, onDeleteTask }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#f44336';
      case 'medium':
        return '#ff9800';
      case 'low':
        return '#4caf50';
      default:
        return '#757575';
    }
  };

  const getCategoryColor = (category: string) => {
    const categoryColors: { [key: string]: string } = {
      'Work': '#3f51b5',
      'Personal': '#9c27b0',
      'Shopping': '#2196f3',
      'Health': '#4caf50',
      'Finance': '#f44336',
      'Other': '#607d8b'
    };
    return categoryColors[category] || '#607d8b';
  };

  if (tasks.length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 3, textAlign: 'center', mt: 2 }}>
        <Typography variant="subtitle1" color="textSecondary">
          No tasks available. Add a new task to get started!
        </Typography>
      </Paper>
    );
  }

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 2 }}>
      {tasks.map((task) => (
        <Paper 
          key={task.id} 
          elevation={1} 
          sx={{ 
            mb: 2, 
            borderLeft: `4px solid ${getPriorityColor(task.priority || 'medium')}`,
            opacity: task.completed ? 0.7 : 1,
            transition: 'all 0.2s ease'
          }}
        >
          <ListItem
            secondaryAction={
              <Box>
                <Tooltip title="Edit task">
                  <IconButton edge="end" aria-label="edit" onClick={() => onEditTask(task)} sx={{ mr: 1 }}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete task">
                  <IconButton edge="end" aria-label="delete" onClick={() => onDeleteTask(task.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            }
          >
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={task.completed}
                onChange={() => onToggleComplete(task)}
                inputProps={{ 'aria-labelledby': `task-${task.id}` }}
              />
            </ListItemIcon>
            <ListItemText
              id={`task-${task.id}`}
              primary={
                <Typography 
                  variant="body1" 
                  sx={{ 
                    textDecoration: task.completed ? 'line-through' : 'none',
                    fontWeight: task.completed ? 'normal' : 500
                  }}
                >
                  {task.title}
                </Typography>
              }
              secondary={
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                  {task.category && (
                    <Chip 
                      size="small" 
                      label={task.category} 
                      sx={{ 
                        backgroundColor: getCategoryColor(task.category),
                        color: 'white',
                        fontWeight: 500,
                        fontSize: '0.75rem'
                      }} 
                    />
                  )}
                  {task.priority && (
                    <Chip 
                      size="small" 
                      icon={<FlagIcon sx={{ fontSize: '1rem !important', color: 'white !important' }} />}
                      label={task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      sx={{ 
                        backgroundColor: getPriorityColor(task.priority),
                        color: 'white',
                        fontWeight: 500,
                        fontSize: '0.75rem'
                      }} 
                    />
                  )}
                  {task.dueDate && (
                    <Chip 
                      size="small" 
                      icon={<CalendarIcon sx={{ fontSize: '1rem !important' }} />}
                      label={formatDate(task.dueDate)}
                      variant="outlined"
                      sx={{ fontSize: '0.75rem' }} 
                    />
                  )}
                </Box>
              }
            />
          </ListItem>
        </Paper>
      ))}
    </List>
  );
};

export default TaskList;
