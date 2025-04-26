import React, { useState } from 'react';
import { Container, Typography, Paper, Box, TextField, Button, Avatar, Divider, Chip } from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon, Badge, Email, Phone, LocationOn, Work } from '@mui/icons-material';

const Profile: React.FC = () => {
  const [editing, setEditing] = useState<boolean>(false);
  const [userData, setUserData] = useState({
    name: 'Swaraj Patil',
    email: 'swarajpatil1@gmail.com',
    phone: '+919226589060',
    location: 'Mumbai, India',
    occupation: 'Software Developer',
    bio: 'Task management enthusiast and productivity expert. I love organizing projects and helping teams stay on track with their goals.',
    skills: ['Task Management', 'Project Planning', 'Team Coordination', 'Time Management', 'Agile Methodology']
  });
  
  const [editData, setEditData] = useState({...userData});

  const handleEditToggle = () => {
    if (editing) {
      // Cancel editing
      setEditData({...userData});
    } else {
      // Start editing
      setEditData({...userData});
    }
    setEditing(!editing);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setUserData({...editData});
    setEditing(false);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        User Profile
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" paragraph>
        Manage your personal information and preferences
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              sx={{ width: 100, height: 100, mr: 3, bgcolor: 'primary.main' }}
              alt={userData.name}
              src="/static/images/avatar/1.jpg"
            >
              {userData.name.split(' ').map(n => n[0]).join('')}
            </Avatar>
            <Box>
              <Typography variant="h5" gutterBottom>
                {userData.name}
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                <Work fontSize="small" sx={{ mr: 1 }} />
                {userData.occupation}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                <LocationOn fontSize="small" sx={{ mr: 1 }} />
                {userData.location}
              </Typography>
            </Box>
          </Box>
          <Button
            variant="outlined"
            color={editing ? "error" : "primary"}
            startIcon={editing ? <CancelIcon /> : <EditIcon />}
            onClick={handleEditToggle}
          >
            {editing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {editing ? (
          <Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              <Box sx={{ flex: '1 1 45%', minWidth: '250px' }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={editData.name}
                  onChange={handleChange}
                  margin="normal"
                  variant="outlined"
                  InputProps={{
                    startAdornment: <Badge fontSize="small" sx={{ mr: 1 }} />,
                  }}
                />
              </Box>
              <Box sx={{ flex: '1 1 45%', minWidth: '250px' }}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={editData.email}
                  onChange={handleChange}
                  margin="normal"
                  variant="outlined"
                  InputProps={{
                    startAdornment: <Email fontSize="small" sx={{ mr: 1 }} />,
                  }}
                />
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              <Box sx={{ flex: '1 1 45%', minWidth: '250px' }}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={editData.phone}
                  onChange={handleChange}
                  margin="normal"
                  variant="outlined"
                  InputProps={{
                    startAdornment: <Phone fontSize="small" sx={{ mr: 1 }} />,
                  }}
                />
              </Box>
              <Box sx={{ flex: '1 1 45%', minWidth: '250px' }}>
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={editData.location}
                  onChange={handleChange}
                  margin="normal"
                  variant="outlined"
                  InputProps={{
                    startAdornment: <LocationOn fontSize="small" sx={{ mr: 1 }} />,
                  }}
                />
              </Box>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Occupation"
                name="occupation"
                value={editData.occupation}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                InputProps={{
                  startAdornment: <Work fontSize="small" sx={{ mr: 1 }} />,
                }}
              />
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Bio"
                name="bio"
                value={editData.bio}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                multiline
                rows={4}
              />
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={handleSave}
              >
                Save Changes
              </Button>
            </Box>
          </Box>
        ) : (
          <Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              <Box sx={{ flex: '1 1 45%', minWidth: '250px' }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Email Address
                </Typography>
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  <Email fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                  {userData.email}
                </Typography>
              </Box>
              <Box sx={{ flex: '1 1 45%', minWidth: '250px' }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Phone Number
                </Typography>
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  <Phone fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                  {userData.phone}
                </Typography>
              </Box>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" gutterBottom>
              About Me
            </Typography>
            <Typography variant="body1" paragraph>
              {userData.bio}
            </Typography>
            
            <Typography variant="subtitle1" gutterBottom>
              Skills
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {userData.skills.map((skill, index) => (
                <Chip key={index} label={skill} color="primary" variant="outlined" />
              ))}
            </Box>
          </Box>
        )}
      </Paper>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Task Statistics
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
          <Box sx={{ flex: '1 1 25%', minWidth: '120px', textAlign: 'center', p: 2 }}>
            <Typography variant="h4" color="primary">
              24
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Total Tasks
            </Typography>
          </Box>
          <Box sx={{ flex: '1 1 25%', minWidth: '120px', textAlign: 'center', p: 2 }}>
            <Typography variant="h4" color="success.main">
              18
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Completed
            </Typography>
          </Box>
          <Box sx={{ flex: '1 1 25%', minWidth: '120px', textAlign: 'center', p: 2 }}>
            <Typography variant="h4" color="warning.main">
              6
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Pending
            </Typography>
          </Box>
          <Box sx={{ flex: '1 1 25%', minWidth: '120px', textAlign: 'center', p: 2 }}>
            <Typography variant="h4" color="error.main">
              2
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Overdue
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;
