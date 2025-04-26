# TaskX - A Task Managing Web Application

TaskX is a modern, full-stack task management application built with React (TypeScript) for the frontend and Flask for the backend. It helps users organize their tasks, track goals, and boost productivity with features like Pomodoro timing, task categorization, and OAuth authentication.

![TaskX Dashboard](https://via.placeholder.com/800x450?text=TaskX+Dashboard)

## Features

- **User Authentication**
  - Secure login and registration
  - OAuth integration with Google and GitHub
  - User profile management

- **Task Management**
  - Create, read, update, and delete tasks
  - Task categorization and prioritization
  - Due date assignment
  - Task filtering and searching
  - Mark tasks as complete/incomplete

- **Goal Tracking**
  - Set and monitor personal and professional goals
  - Track progress towards completion
  - Visualize goal achievements

- **Productivity Tools**
  - Built-in Pomodoro timer for focused work sessions
  - Task statistics and insights

- **Customization**
  - Light/dark theme toggle
  - User settings and preferences

## Tech Stack

### Frontend
- React with TypeScript
- Material UI for component styling
- React Router for navigation
- Axios for API requests
- Context API for state management

### Backend
- Flask Python framework
- JSON-based data storage
- RESTful API architecture
- JWT authentication

## Getting Started

### Prerequisites
- Node.js (v14+)
- Python (v3.8+)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/Swap0-4/TaskX-A-Task-Managing-Web-App.git
   cd TaskX-A-Task-Managing-Web-App
   ```

2. Set up the backend
   ```bash
   cd backend
   pip install -r requirements.txt
   python app.py
   ```

3. Set up the frontend
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. Open your browser and navigate to http://localhost:3000

## Project Structure

```
TaskX/
├── backend/             # Flask server
│   ├── app.py           # Main server file
│   ├── database.py      # Database operations
│   └── data/            # JSON data storage
│
└── frontend/            # React application
    ├── public/          # Static files
    └── src/             # Source code
        ├── components/  # Reusable UI components
        ├── contexts/    # React contexts
        ├── pages/       # Application pages
        └── services/    # API services
```

## Usage

1. **Register an account** or log in with Google/GitHub
2. **Create tasks** by filling out the task form
3. **Organize tasks** by category, priority, and due date
4. **Track your progress** with the dashboard overview
5. **Use the Pomodoro timer** for focused work sessions
6. **Manage your settings** through the settings page

## Future Enhancements

- Mobile application using React Native
- Calendar integration
- Team collaboration features
- Advanced analytics and reporting
- Email notifications and reminders

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Material UI for the beautiful components
- React and Flask communities for their excellent documentation
- All contributors who have helped improve TaskX

---

Created by [Swap0-4](https://github.com/Swap0-4) - Feel free to contact me for any questions or feedback!
