import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Alert, Snackbar } from '@mui/material';
import GoalTracker from '../components/goals/GoalTracker';
import { Goal } from '../services/api';
import axios from 'axios';

const API_URL = 'http://localhost:5000/goals';

const Goals: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity: 'success' | 'error'}>({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });

  // Fetch goals from API
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        // For demo purposes, we'll use local storage instead of a real API
        const savedGoals = localStorage.getItem('goals');
        if (savedGoals) {
          setGoals(JSON.parse(savedGoals));
        } else {
          // Initialize with sample goals for demonstration
          const sampleGoals: Goal[] = [
            {
              _id: '1',
              title: 'Complete Project Milestone',
              description: 'Finish the first phase of the project including all core features',
              dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks from now
              color: '#1976d2',
              category: 'Career',
              completed: false,
              milestones: [
                {
                  id: 101,
                  title: 'Finish requirements gathering',
                  completed: true,
                  dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                  id: 102,
                  title: 'Complete UI design',
                  completed: false,
                  dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                  id: 103,
                  title: 'Implement core functionality',
                  completed: false,
                  dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString()
                }
              ]
            },
            {
              _id: '2',
              title: 'Improve Fitness',
              description: 'Work on improving overall fitness and health',
              dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 3 months from now
              color: '#4caf50',
              category: 'Health',
              completed: false,
              milestones: [
                {
                  id: 201,
                  title: 'Start regular workout routine',
                  completed: true,
                  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                  id: 202,
                  title: 'Run 5km without stopping',
                  completed: false,
                  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
                }
              ]
            }
          ];
          setGoals(sampleGoals);
          localStorage.setItem('goals', JSON.stringify(sampleGoals));
        }
      } catch (error) {
        console.error('Error fetching goals:', error);
        showSnackbar('Error loading goals', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, []);

  // Save goals to local storage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('goals', JSON.stringify(goals));
    }
  }, [goals, loading]);

  const handleAddGoal = (goal: Goal) => {
    const newGoal = {
      ...goal,
      _id: Date.now().toString() // Ensure unique ID
    };
    setGoals(prev => [...prev, newGoal]);
    showSnackbar('Goal created successfully!', 'success');
  };

  const handleUpdateGoal = (updatedGoal: Goal) => {
    setGoals(prev => prev.map(goal => 
      goal._id === updatedGoal._id ? updatedGoal : goal
    ));
    showSnackbar('Goal updated successfully!', 'success');
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals(prev => prev.filter(goal => goal._id !== goalId));
    showSnackbar('Goal deleted', 'success');
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Typography>Loading goals...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Goal Tracker
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" paragraph>
          Set meaningful goals, break them down into milestones, and track your progress
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Goal Overview</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                bgcolor: 'primary.light',
                color: 'primary.contrastText',
                borderRadius: 2,
                flex: '1 1 200px',
                minWidth: '150px'
              }}
            >
              <Typography variant="h4" component="div">
                {goals.length}
              </Typography>
              <Typography variant="body2">Total Goals</Typography>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 2,
                bgcolor: '#4caf50',
                color: 'white',
                borderRadius: 2,
                flex: '1 1 200px',
                minWidth: '150px'
              }}
            >
              <Typography variant="h4" component="div">
                {goals.filter(goal => goal.completed).length}
              </Typography>
              <Typography variant="body2">Completed</Typography>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 2,
                bgcolor: '#ff9800',
                color: 'white',
                borderRadius: 2,
                flex: '1 1 200px',
                minWidth: '150px'
              }}
            >
              <Typography variant="h4" component="div">
                {goals.filter(goal => !goal.completed).length}
              </Typography>
              <Typography variant="body2">In Progress</Typography>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 2,
                bgcolor: '#f44336',
                color: 'white',
                borderRadius: 2,
                flex: '1 1 200px',
                minWidth: '150px'
              }}
            >
              <Typography variant="h4" component="div">
                {goals.reduce((total, goal) => total + (goal.milestones ? goal.milestones.length : 0), 0)}
              </Typography>
              <Typography variant="body2">Total Milestones</Typography>
            </Paper>
          </Box>
        </Paper>

        <GoalTracker
          goals={goals}
          onAddGoal={handleAddGoal}
          onUpdateGoal={handleUpdateGoal}
          onDeleteGoal={handleDeleteGoal}
        />
      </Box>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Goals;
