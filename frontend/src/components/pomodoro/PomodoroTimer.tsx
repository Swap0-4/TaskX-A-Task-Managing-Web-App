import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, Typography, Button, IconButton, Paper, LinearProgress, 
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Select, MenuItem, FormControl, InputLabel, Tooltip,
  Chip, CircularProgress
} from '@mui/material';
import { 
  PlayArrow, Pause, RotateLeft, Settings, 
  Timer as TimerIcon, Coffee, CheckCircle, Close
} from '@mui/icons-material';

// Define Pomodoro timer settings interface
interface PomodoroSettings {
  workDuration: number; // in minutes
  shortBreakDuration: number; // in minutes
  longBreakDuration: number; // in minutes
  longBreakInterval: number; // after how many work sessions
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
}

// Define timer state interface
interface TimerState {
  mode: 'work' | 'shortBreak' | 'longBreak';
  timeLeft: number; // in seconds
  isRunning: boolean;
  sessionsCompleted: number;
}

interface PomodoroTimerProps {
  onComplete?: (mode: string) => void;
  selectedTaskId?: string | null;
  onSelectTask?: (taskId: string | null) => void;
  tasks?: any[];
}

const DEFAULT_SETTINGS: PomodoroSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  autoStartBreaks: true,
  autoStartPomodoros: true
};

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ 
  onComplete, 
  selectedTaskId = null,
  onSelectTask,
  tasks = []
}) => {
  // State for settings and timer
  const [settings, setSettings] = useState<PomodoroSettings>(() => {
    const savedSettings = localStorage.getItem('pomodoroSettings');
    return savedSettings ? JSON.parse(savedSettings) : DEFAULT_SETTINGS;
  });
  
  const [timerState, setTimerState] = useState<TimerState>({
    mode: 'work',
    timeLeft: settings.workDuration * 60,
    isRunning: false,
    sessionsCompleted: 0
  });
  
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [tempSettings, setTempSettings] = useState<PomodoroSettings>(settings);
  
  // Refs for audio and timer
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<number | null>(null);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio('/notification.mp3');
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
  }, [settings]);

  // Reset timer when mode changes
  useEffect(() => {
    let duration = 0;
    switch (timerState.mode) {
      case 'work':
        duration = settings.workDuration * 60;
        break;
      case 'shortBreak':
        duration = settings.shortBreakDuration * 60;
        break;
      case 'longBreak':
        duration = settings.longBreakDuration * 60;
        break;
    }
    
    if (timerState.timeLeft === 0) {
      setTimerState(prev => ({
        ...prev,
        timeLeft: duration
      }));
    }
  }, [timerState.mode, settings]);

  // Timer logic
  useEffect(() => {
    if (timerState.isRunning) {
      timerRef.current = window.setInterval(() => {
        setTimerState(prev => {
          if (prev.timeLeft <= 1) {
            // Timer completed
            clearInterval(timerRef.current!);
            
            // Play notification sound
            if (audioRef.current) {
              audioRef.current.play().catch(e => console.error('Error playing audio:', e));
            }
            
            // Call onComplete callback if provided
            if (onComplete) {
              onComplete(prev.mode);
            }
            
            // Determine next mode
            let nextMode: 'work' | 'shortBreak' | 'longBreak' = 'work';
            let nextSessionsCompleted = prev.sessionsCompleted;
            
            if (prev.mode === 'work') {
              nextSessionsCompleted = prev.sessionsCompleted + 1;
              if (nextSessionsCompleted % settings.longBreakInterval === 0) {
                nextMode = 'longBreak';
              } else {
                nextMode = 'shortBreak';
              }
            } else {
              nextMode = 'work';
            }
            
            // Auto-start next session if enabled
            const shouldAutoStart = 
              (prev.mode === 'work' && settings.autoStartBreaks) ||
              ((prev.mode === 'shortBreak' || prev.mode === 'longBreak') && settings.autoStartPomodoros);
            
            return {
              mode: nextMode,
              timeLeft: nextMode === 'work' 
                ? settings.workDuration * 60 
                : nextMode === 'shortBreak' 
                  ? settings.shortBreakDuration * 60 
                  : settings.longBreakDuration * 60,
              isRunning: shouldAutoStart,
              sessionsCompleted: nextSessionsCompleted
            };
          }
          
          return {
            ...prev,
            timeLeft: prev.timeLeft - 1
          };
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timerState.isRunning, settings, onComplete]);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle timer controls
  const startTimer = () => {
    setTimerState(prev => ({ ...prev, isRunning: true }));
  };

  const pauseTimer = () => {
    setTimerState(prev => ({ ...prev, isRunning: false }));
  };

  const resetTimer = () => {
    const duration = timerState.mode === 'work' 
      ? settings.workDuration * 60 
      : timerState.mode === 'shortBreak' 
        ? settings.shortBreakDuration * 60 
        : settings.longBreakDuration * 60;
    
    setTimerState(prev => ({
      ...prev,
      timeLeft: duration,
      isRunning: false
    }));
  };

  const switchMode = (mode: 'work' | 'shortBreak' | 'longBreak') => {
    const duration = mode === 'work' 
      ? settings.workDuration * 60 
      : mode === 'shortBreak' 
        ? settings.shortBreakDuration * 60 
        : settings.longBreakDuration * 60;
    
    setTimerState({
      mode,
      timeLeft: duration,
      isRunning: false,
      sessionsCompleted: timerState.sessionsCompleted
    });
  };

  // Settings dialog handlers
  const openSettings = () => {
    setTempSettings(settings);
    setSettingsOpen(true);
  };

  const closeSettings = () => {
    setSettingsOpen(false);
  };

  const saveSettings = () => {
    setSettings(tempSettings);
    setSettingsOpen(false);
    
    // Reset timer with new duration based on current mode
    const duration = timerState.mode === 'work' 
      ? tempSettings.workDuration * 60 
      : timerState.mode === 'shortBreak' 
        ? tempSettings.shortBreakDuration * 60 
        : tempSettings.longBreakDuration * 60;
    
    setTimerState(prev => ({
      ...prev,
      timeLeft: duration,
      isRunning: false
    }));
  };

  const handleSettingChange = (setting: keyof PomodoroSettings, value: any) => {
    setTempSettings(prev => ({
      ...prev,
      [setting]: typeof value === 'string' && !isNaN(Number(value)) ? Number(value) : value
    }));
  };

  // Calculate progress percentage
  const calculateProgress = (): number => {
    const totalDuration = timerState.mode === 'work' 
      ? settings.workDuration * 60 
      : timerState.mode === 'shortBreak' 
        ? settings.shortBreakDuration * 60 
        : settings.longBreakDuration * 60;
    
    const progress = ((totalDuration - timerState.timeLeft) / totalDuration) * 100;
    return progress;
  };

  // Get color based on current mode
  const getModeColor = (): string => {
    switch (timerState.mode) {
      case 'work':
        return '#f44336'; // Red for work
      case 'shortBreak':
        return '#4caf50'; // Green for short break
      case 'longBreak':
        return '#2196f3'; // Blue for long break
      default:
        return '#f44336';
    }
  };

  // Get icon based on current mode
  const getModeIcon = () => {
    switch (timerState.mode) {
      case 'work':
        return <TimerIcon />;
      case 'shortBreak':
        return <Coffee fontSize="small" />;
      case 'longBreak':
        return <Coffee />;
      default:
        return <TimerIcon />;
    }
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        borderRadius: 2,
        maxWidth: '100%',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Progress bar at the top */}
      <LinearProgress 
        variant="determinate" 
        value={calculateProgress()} 
        sx={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          height: 6, 
          backgroundColor: 'rgba(0,0,0,0.05)',
          '& .MuiLinearProgress-bar': {
            backgroundColor: getModeColor()
          }
        }} 
      />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h2" sx={{ display: 'flex', alignItems: 'center' }}>
          {getModeIcon()}
          <Box component="span" sx={{ ml: 1 }}>
            {timerState.mode === 'work' ? 'Focus Time' : timerState.mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
          </Box>
        </Typography>
        
        <Box>
          <Tooltip title="Settings">
            <IconButton onClick={openSettings} size="small">
              <Settings fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      {/* Timer display */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          my: 3
        }}
      >
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <CircularProgress
            variant="determinate"
            value={calculateProgress()}
            size={120}
            thickness={4}
            sx={{ 
              color: getModeColor(),
              circle: {
                strokeLinecap: 'round',
              },
            }}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h3" component="div" color="text.primary">
              {formatTime(timerState.timeLeft)}
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          <Chip 
            label={`#${Math.floor(timerState.sessionsCompleted / settings.longBreakInterval) + 1}.${(timerState.sessionsCompleted % settings.longBreakInterval) + 1}`} 
            color="primary" 
            size="small"
            icon={<CheckCircle fontSize="small" />}
          />
        </Box>
      </Box>
      
      {/* Timer controls */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
        {!timerState.isRunning ? (
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<PlayArrow />}
            onClick={startTimer}
            sx={{ borderRadius: 28, px: 3 }}
          >
            Start
          </Button>
        ) : (
          <Button 
            variant="outlined" 
            color="primary" 
            startIcon={<Pause />}
            onClick={pauseTimer}
            sx={{ borderRadius: 28, px: 3 }}
          >
            Pause
          </Button>
        )}
        
        <Button 
          variant="outlined" 
          startIcon={<RotateLeft />}
          onClick={resetTimer}
          sx={{ borderRadius: 28 }}
        >
          Reset
        </Button>
      </Box>
      
      {/* Mode selector */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
        <Button 
          variant={timerState.mode === 'work' ? 'contained' : 'outlined'}
          size="small"
          onClick={() => switchMode('work')}
          sx={{ 
            minWidth: 0, 
            borderRadius: 16,
            bgcolor: timerState.mode === 'work' ? getModeColor() : 'transparent',
            borderColor: getModeColor(),
            color: timerState.mode === 'work' ? 'white' : getModeColor(),
            '&:hover': {
              bgcolor: timerState.mode === 'work' ? getModeColor() : 'rgba(244, 67, 54, 0.1)'
            }
          }}
        >
          Pomodoro
        </Button>
        
        <Button 
          variant={timerState.mode === 'shortBreak' ? 'contained' : 'outlined'}
          size="small"
          onClick={() => switchMode('shortBreak')}
          sx={{ 
            minWidth: 0, 
            borderRadius: 16,
            bgcolor: timerState.mode === 'shortBreak' ? '#4caf50' : 'transparent',
            borderColor: '#4caf50',
            color: timerState.mode === 'shortBreak' ? 'white' : '#4caf50',
            '&:hover': {
              bgcolor: timerState.mode === 'shortBreak' ? '#4caf50' : 'rgba(76, 175, 80, 0.1)'
            }
          }}
        >
          Short Break
        </Button>
        
        <Button 
          variant={timerState.mode === 'longBreak' ? 'contained' : 'outlined'}
          size="small"
          onClick={() => switchMode('longBreak')}
          sx={{ 
            minWidth: 0, 
            borderRadius: 16,
            bgcolor: timerState.mode === 'longBreak' ? '#2196f3' : 'transparent',
            borderColor: '#2196f3',
            color: timerState.mode === 'longBreak' ? 'white' : '#2196f3',
            '&:hover': {
              bgcolor: timerState.mode === 'longBreak' ? '#2196f3' : 'rgba(33, 150, 243, 0.1)'
            }
          }}
        >
          Long Break
        </Button>
      </Box>
      
      {/* Task selection */}
      {tasks && tasks.length > 0 && (
        <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid rgba(0,0,0,0.1)' }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Current Task:
          </Typography>
          <FormControl fullWidth size="small">
            <Select
              value={selectedTaskId || ''}
              onChange={(e) => onSelectTask && onSelectTask(e.target.value ? e.target.value : null)}
              displayEmpty
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="">No task selected</MenuItem>
              {tasks.filter(task => !task.completed).map((task) => (
                <MenuItem key={task._id} value={task._id}>
                  {task.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}
      
      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onClose={closeSettings} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Timer Settings
          <IconButton onClick={closeSettings} size="small">
            <Close fontSize="small" />
          </IconButton>
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>Time (minutes)</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Pomodoro"
                type="number"
                value={tempSettings.workDuration}
                onChange={(e) => handleSettingChange('workDuration', e.target.value)}
                InputProps={{ inputProps: { min: 1, max: 120 } }}
                size="small"
                fullWidth
              />
              <TextField
                label="Short Break"
                type="number"
                value={tempSettings.shortBreakDuration}
                onChange={(e) => handleSettingChange('shortBreakDuration', e.target.value)}
                InputProps={{ inputProps: { min: 1, max: 30 } }}
                size="small"
                fullWidth
              />
              <TextField
                label="Long Break"
                type="number"
                value={tempSettings.longBreakDuration}
                onChange={(e) => handleSettingChange('longBreakDuration', e.target.value)}
                InputProps={{ inputProps: { min: 1, max: 60 } }}
                size="small"
                fullWidth
              />
            </Box>
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <TextField
              label="Long Break Interval"
              type="number"
              value={tempSettings.longBreakInterval}
              onChange={(e) => handleSettingChange('longBreakInterval', e.target.value)}
              InputProps={{ inputProps: { min: 1, max: 10 } }}
              size="small"
              fullWidth
              helperText="Number of pomodoros before a long break"
            />
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl>
              <Typography variant="subtitle2" gutterBottom>Auto start breaks</Typography>
              <Select
                value={tempSettings.autoStartBreaks ? 'yes' : 'no'}
                onChange={(e) => handleSettingChange('autoStartBreaks', e.target.value === 'yes')}
                size="small"
              >
                <MenuItem value="yes">Yes</MenuItem>
                <MenuItem value="no">No</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl>
              <Typography variant="subtitle2" gutterBottom>Auto start pomodoros</Typography>
              <Select
                value={tempSettings.autoStartPomodoros ? 'yes' : 'no'}
                onChange={(e) => handleSettingChange('autoStartPomodoros', e.target.value === 'yes')}
                size="small"
              >
                <MenuItem value="yes">Yes</MenuItem>
                <MenuItem value="no">No</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={closeSettings}>Cancel</Button>
          <Button onClick={saveSettings} variant="contained" color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default PomodoroTimer;
