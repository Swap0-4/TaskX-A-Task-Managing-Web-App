import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Goal, Milestone } from '../../services/api';

interface GoalTrackerProps {
  goals: Goal[];
  onAddGoal: (goal: Goal) => void;
  onUpdateGoal: (goal: Goal) => void;
  onDeleteGoal: (goalId: string) => void;
}

const GoalTracker: React.FC<GoalTrackerProps> = ({ goals, onAddGoal, onUpdateGoal, onDeleteGoal }) => {
  const [openGoalDialog, setOpenGoalDialog] = useState(false);
  const [openMilestoneDialog, setOpenMilestoneDialog] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [newGoal, setNewGoal] = useState<Goal>({
    title: '',
    description: '',
    dueDate: '',
    color: '#1976d2',
    category: 'Personal',
    completed: false,
    milestones: [],
  });
  const [newMilestone, setNewMilestone] = useState<Milestone>({
    id: 0,
    title: '',
    completed: false,
    dueDate: '',
  });
  const [editMode, setEditMode] = useState(false);

  // Calculate progress percentage for a goal
  const calculateProgress = (goal: Goal) => {
    if (!goal.milestones || goal.milestones.length === 0) return 0;
    const completedMilestones = goal.milestones.filter((milestone) => milestone.completed).length;
    return Math.round((completedMilestones / goal.milestones.length) * 100);
  };

  // Handle opening the goal dialog for adding a new goal
  const handleOpenAddGoalDialog = () => {
    setEditMode(false);
    setNewGoal({
      title: '',
      description: '',
      dueDate: '',
      color: '#1976d2',
      category: 'Personal',
      completed: false,
      milestones: [],
    });
    setOpenGoalDialog(true);
  };

  // Handle opening the goal dialog for editing an existing goal
  const handleOpenEditGoalDialog = (goal: Goal) => {
    setEditMode(true);
    setNewGoal({ ...goal });
    setOpenGoalDialog(true);
  };

  // Handle closing the goal dialog
  const handleCloseGoalDialog = () => {
    setOpenGoalDialog(false);
  };

  // Handle opening the milestone dialog
  const handleOpenMilestoneDialog = (goal: Goal) => {
    setSelectedGoal(goal);
    setNewMilestone({
      id: Date.now(), // Generate a unique ID
      title: '',
      completed: false,
      dueDate: '',
    });
    setOpenMilestoneDialog(true);
  };

  // Handle closing the milestone dialog
  const handleCloseMilestoneDialog = () => {
    setOpenMilestoneDialog(false);
  };

  // Handle saving a goal (add or update)
  const handleSaveGoal = () => {
    if (editMode && newGoal._id) {
      onUpdateGoal(newGoal);
    } else {
      onAddGoal(newGoal);
    }
    handleCloseGoalDialog();
  };

  // Handle saving a milestone
  const handleSaveMilestone = () => {
    if (selectedGoal && selectedGoal._id) {
      const updatedGoal = { ...selectedGoal };
      if (!updatedGoal.milestones) {
        updatedGoal.milestones = [];
      }
      updatedGoal.milestones.push(newMilestone);
      onUpdateGoal(updatedGoal);
      handleCloseMilestoneDialog();
    }
  };

  // Handle toggling a milestone's completion status
  const handleToggleMilestone = (goal: Goal, milestoneId: number) => {
    const updatedGoal = { ...goal };
    if (updatedGoal.milestones) {
      updatedGoal.milestones = updatedGoal.milestones.map((milestone) =>
        milestone.id === milestoneId
          ? { ...milestone, completed: !milestone.completed }
          : milestone
      );
      onUpdateGoal(updatedGoal);
    }
  };

  // Handle deleting a milestone
  const handleDeleteMilestone = (goal: Goal, milestoneId: number) => {
    const updatedGoal = { ...goal };
    if (updatedGoal.milestones) {
      updatedGoal.milestones = updatedGoal.milestones.filter(
        (milestone) => milestone.id !== milestoneId
      );
      onUpdateGoal(updatedGoal);
    }
  };

  // Handle toggling a goal's completion status
  const handleToggleGoalCompletion = (goal: Goal) => {
    const updatedGoal = { ...goal, completed: !goal.completed };
    onUpdateGoal(updatedGoal);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Your Goals</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenAddGoalDialog}
        >
          Add Goal
        </Button>
      </Box>

      {goals.length === 0 ? (
        <Typography color="text.secondary" align="center" py={4}>
          You don't have any goals yet. Click "Add Goal" to create your first goal.
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {goals.map((goal) => (
            <Box key={goal._id} sx={{ width: { xs: '100%', sm: '45%', md: '30%' } }}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderTop: `4px solid ${goal.color || '#1976d2'}`,
                }}
              >
                <CardHeader
                  title={
                    <Box display="flex" alignItems="center">
                      <Checkbox
                        checked={goal.completed}
                        onChange={() => handleToggleGoalCompletion(goal)}
                        color="primary"
                      />
                      <Typography
                        variant="h6"
                        sx={{
                          textDecoration: goal.completed ? 'line-through' : 'none',
                          color: goal.completed ? 'text.secondary' : 'text.primary',
                        }}
                      >
                        {goal.title}
                      </Typography>
                    </Box>
                  }
                  action={
                    <Box>
                      <IconButton onClick={() => handleOpenMilestoneDialog(goal)}>
                        <Tooltip title="Add Milestone">
                          <AddIcon />
                        </Tooltip>
                      </IconButton>
                      <IconButton onClick={() => handleOpenEditGoalDialog(goal)}>
                        <Tooltip title="Edit Goal">
                          <EditIcon />
                        </Tooltip>
                      </IconButton>
                      <IconButton onClick={() => onDeleteGoal(goal._id || '')}>
                        <Tooltip title="Delete Goal">
                          <DeleteIcon />
                        </Tooltip>
                      </IconButton>
                    </Box>
                  }
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box mb={2}>
                    <Chip
                      label={goal.category}
                      size="small"
                      sx={{ mr: 1, backgroundColor: goal.color || '#1976d2', color: 'white' }}
                    />
                    {goal.dueDate && (
                      <Chip
                        label={`Due: ${new Date(goal.dueDate).toLocaleDateString()}`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>

                  <Typography variant="body2" color="text.secondary" paragraph>
                    {goal.description}
                  </Typography>

                  <Box mb={1}>
                    <Typography variant="body2" color="text.secondary">
                      Progress: {calculateProgress(goal)}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={calculateProgress(goal)}
                      sx={{ mt: 1, height: 8, borderRadius: 4 }}
                    />
                  </Box>

                  {goal.milestones && goal.milestones.length > 0 && (
                    <Box mt={2}>
                      <Typography variant="subtitle2" gutterBottom>
                        Milestones
                      </Typography>
                      <List dense>
                        {goal.milestones.map((milestone) => (
                          <ListItem key={milestone.id} disablePadding>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              <Checkbox
                                edge="start"
                                checked={milestone.completed}
                                onChange={() => handleToggleMilestone(goal, milestone.id)}
                                size="small"
                              />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography
                                  variant="body2"
                                  sx={{
                                    textDecoration: milestone.completed ? 'line-through' : 'none',
                                    color: milestone.completed ? 'text.secondary' : 'text.primary',
                                  }}
                                >
                                  {milestone.title}
                                </Typography>
                              }
                              secondary={
                                milestone.dueDate
                                  ? `Due: ${new Date(milestone.dueDate).toLocaleDateString()}`
                                  : ''
                              }
                            />
                            <ListItemSecondaryAction>
                              <IconButton
                                edge="end"
                                size="small"
                                onClick={() => handleDeleteMilestone(goal, milestone.id)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      )}

      {/* Goal Dialog */}
      <Dialog open={openGoalDialog} onClose={handleCloseGoalDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Edit Goal' : 'Add New Goal'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Goal Title"
            fullWidth
            value={newGoal.title}
            onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
            required
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={newGoal.description}
            onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={newGoal.category}
                  label="Category"
                  onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                >
                  <MenuItem value="Personal">Personal</MenuItem>
                  <MenuItem value="Career">Career</MenuItem>
                  <MenuItem value="Health">Health</MenuItem>
                  <MenuItem value="Finance">Finance</MenuItem>
                  <MenuItem value="Education">Education</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
              <TextField
                label="Color"
                type="color"
                fullWidth
                value={newGoal.color}
                onChange={(e) => setNewGoal({ ...newGoal, color: e.target.value })}
                sx={{ mb: 2 }}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </Box>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Due Date"
              value={newGoal.dueDate ? new Date(newGoal.dueDate) : null}
              onChange={(date) => setNewGoal({ ...newGoal, dueDate: date ? date.toISOString() : '' })}
              slotProps={{ textField: { fullWidth: true, margin: 'dense' } }}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseGoalDialog}>Cancel</Button>
          <Button onClick={handleSaveGoal} variant="contained" color="primary" disabled={!newGoal.title}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Milestone Dialog */}
      <Dialog
        open={openMilestoneDialog}
        onClose={handleCloseMilestoneDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Milestone</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Milestone Title"
            fullWidth
            value={newMilestone.title}
            onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
            required
            sx={{ mb: 2, mt: 1 }}
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Due Date"
              value={newMilestone.dueDate ? new Date(newMilestone.dueDate) : null}
              onChange={(date) =>
                setNewMilestone({ ...newMilestone, dueDate: date ? date.toISOString() : '' })
              }
              slotProps={{ textField: { fullWidth: true, margin: 'dense' } }}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMilestoneDialog}>Cancel</Button>
          <Button
            onClick={handleSaveMilestone}
            variant="contained"
            color="primary"
            disabled={!newMilestone.title}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GoalTracker;
