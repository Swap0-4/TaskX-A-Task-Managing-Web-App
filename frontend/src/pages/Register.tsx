import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Divider, 
  IconButton, 
  InputAdornment,
  CircularProgress,
  Snackbar,
  Alert,
  Link as MuiLink
} from '@mui/material';
import { 
  Google as GoogleIcon, 
  GitHub as GitHubIcon,
  Visibility, 
  VisibilityOff,
  Person,
  VpnKey,
  Email
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const { register, loginWithGoogle, loginWithGithub, error, loading, clearError } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    let isValid = true;

    // Name validation
    if (!name) {
      setNameError('Name is required');
      isValid = false;
    } else {
      setNameError('');
    }

    // Email validation
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email is invalid');
      isValid = false;
    } else {
      setEmailError('');
    }

    // Password validation
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    } else {
      setPasswordError('');
    }

    // Confirm password validation
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }

    return isValid;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (validate()) {
      const success = await register(name, email, password);
      if (success) {
        setSnackbarSeverity('success');
        setSnackbarMessage('Registration successful!');
        setSnackbarOpen(true);
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        setSnackbarSeverity('error');
        setSnackbarMessage(error || 'Registration failed. Please try again.');
        setSnackbarOpen(true);
      }
    }
  };

  const handleGoogleSignup = async () => {
    try {
      // Replace this with actual Google OAuth implementation
      const googleTokenId = 'simulated_google_token_id';
      const success = await loginWithGoogle(googleTokenId);
      
      if (success) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Google signup error:', error);
    }
  };

  const handleGitHubSignup = () => {
    // In a real app, you would redirect to GitHub's OAuth consent screen
    const GITHUB_CLIENT_ID = 'your_github_client_id';
    const redirectUri = `${window.location.origin}/login`;
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=user:email`;
    
    window.location.href = githubAuthUrl;
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 8 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
              Create Account
            </Typography>
            
            <Box component="form" onSubmit={handleRegister} noValidate sx={{ mt: 1, width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Full Name"
                name="name"
                autoComplete="name"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={!!nameError}
                helperText={nameError}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!emailError}
                helperText={emailError}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!passwordError}
                helperText={passwordError}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VpnKey />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={!!confirmPasswordError}
                helperText={confirmPasswordError}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VpnKey />
                    </InputAdornment>
                  ),
                }}
              />
              
              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Sign Up'}
              </Button>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <MuiLink component={Link} to="/login" variant="body2">
                  Already have an account? Sign in
                </MuiLink>
              </Box>
              
              <Divider sx={{ my: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  OR
                </Typography>
              </Divider>
              
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<GoogleIcon />}
                  onClick={handleGoogleSignup}
                  sx={{ 
                    borderColor: '#DB4437', 
                    color: '#DB4437',
                    '&:hover': {
                      borderColor: '#DB4437',
                      backgroundColor: 'rgba(219, 68, 55, 0.04)',
                    }
                  }}
                >
                  Sign up with Google
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<GitHubIcon />}
                  onClick={handleGitHubSignup}
                  sx={{ 
                    borderColor: '#333',
                    color: '#333',
                    '&:hover': {
                      borderColor: '#333',
                      backgroundColor: 'rgba(51, 51, 51, 0.04)',
                    }
                  }}
                >
                  Sign up with GitHub
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
      
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Register;