import React, { useState, useEffect } from 'react';
import { 
  Paper, TextField, Button, Box, Typography, 
  MenuItem, Select, FormControl, InputLabel, SelectChangeEvent,
  FormHelperText, IconButton, Collapse
} from '@mui/material';
import { Add as AddIcon, ExpandMore, ExpandLess } from '@mui/icons-material';

interface Task {
  id?: number;
  title: string;
  completed?: boolean;
  category?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
}

interface TaskFormProps {
  initialTask?: Task;
  onSubmit: (task: Task) => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

const CATEGORIES = ['Work', 'Personal', 'Shopping', 'Health', 'Finance', 'Other'];
const PRIORITIES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' }
];

const TaskForm: React.FC<TaskFormProps> = ({ 
  initialTask, 
  onSubmit, 
  onCancel, 
  isEditing = false 
}) => {
  const [task, setTask] = useState<Task>(initialTask || {
    title: '',
    category: 'Work',
    priority: 'medium',
    dueDate: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [expanded, setExpanded] = useState<boolean>(isEditing);

  useEffect(() => {
    if (initialTask) {
      setTask(initialTask);
    }
  }, [initialTask]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTask(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setTask(prev => ({ ...prev, [name]: value }));
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const validate = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    if (!task.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(task);
      
      // Reset form if not editing
      if (!isEditing) {
        setTask({
          title: '',
          category: 'Work',
          priority: 'medium',
          dueDate: ''
        });
        setExpanded(false);
      }
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          {isEditing ? 'Edit Task' : 'Add New Task'}
        </Typography>
        {!isEditing && (
          <IconButton onClick={toggleExpanded} size="small">
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        )}
      </Box>
      
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Task Title"
          name="title"
          value={task.title}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
          error={!!errors.title}
          helperText={errors.title}
          autoFocus={isEditing}
          placeholder="What needs to be done?"
        />
        
        <Collapse in={expanded} timeout="auto">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <FormControl sx={{ minWidth: 200, flex: 1 }} variant="outlined">
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  name="category"
                  value={task.category || ''}
                  onChange={handleSelectChange}
                  label="Category"
                >
                  {CATEGORIES.map(category => (
                    <MenuItem key={category} value={category}>{category}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl sx={{ minWidth: 200, flex: 1 }} variant="outlined">
                <InputLabel id="priority-label">Priority</InputLabel>
                <Select
                  labelId="priority-label"
                  name="priority"
                  value={task.priority || ''}
                  onChange={handleSelectChange}
                  label="Priority"
                >
                  {PRIORITIES.map(priority => (
                    <MenuItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
            <Box>
              <TextField
                fullWidth
                label="Due Date"
                name="dueDate"
                type="date"
                value={task.dueDate || ''}
                onChange={handleChange}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
              <FormHelperText>Optional: Set a due date for this task</FormHelperText>
            </Box>
          </Box>
        </Collapse>
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: isEditing ? 'space-between' : 'flex-end' }}>
          {isEditing && (
            <Button
              variant="outlined"
              color="inherit"
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={!isEditing && <AddIcon />}
          >
            {isEditing ? 'Save Changes' : 'Add Task'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default TaskForm;
