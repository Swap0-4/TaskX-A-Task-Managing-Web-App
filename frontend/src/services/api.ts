import axios, { AxiosResponse } from 'axios';

const API_URL = 'http://localhost:5000';

// Define interfaces for our data models
export interface Task {
  _id?: string;
  title: string;
  completed: boolean;
  category?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Goal {
  _id?: string;
  title: string;
  description?: string;
  dueDate?: string;
  color?: string;
  category?: string;
  completed: boolean;
  user_id?: string;
  milestones?: Milestone[];
  created_at?: string;
  updated_at?: string;
}

export interface Milestone {
  id: number;
  title: string;
  completed: boolean;
  dueDate?: string;
}

export interface User {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  occupation?: string;
  bio?: string;
  skills?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Settings {
  _id?: string;
  user_id: string;
  theme: 'light' | 'dark';
  notifications: boolean;
  autoSave: boolean;
  dataSync: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Statistics {
  tasks: {
    total: number;
    completed: number;
    pending: number;
    by_category: { _id: string; count: number }[];
    by_priority: { _id: string; count: number }[];
  };
  goals: {
    total: number;
    completed: number;
    in_progress: number;
  };
}

// API service class
class ApiService {
  // Task endpoints
  async getTasks(): Promise<Task[]> {
    try {
      const response: AxiosResponse<Task[]> = await axios.get(`${API_URL}/tasks`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
  }

  async getTask(id: string): Promise<Task | null> {
    try {
      const response: AxiosResponse<Task> = await axios.get(`${API_URL}/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error);
      return null;
    }
  }

  async createTask(task: Task): Promise<Task | null> {
    try {
      const response: AxiosResponse<Task> = await axios.post(`${API_URL}/tasks`, task);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      return null;
    }
  }

  async updateTask(id: string, task: Task): Promise<Task | null> {
    try {
      const response: AxiosResponse<Task> = await axios.put(`${API_URL}/tasks/${id}`, task);
      return response.data;
    } catch (error) {
      console.error(`Error updating task ${id}:`, error);
      return null;
    }
  }

  async deleteTask(id: string): Promise<boolean> {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting task ${id}:`, error);
      return false;
    }
  }

  // Goal endpoints
  async getGoals(): Promise<Goal[]> {
    try {
      const response: AxiosResponse<Goal[]> = await axios.get(`${API_URL}/goals`);
      return response.data;
    } catch (error) {
      console.error('Error fetching goals:', error);
      return [];
    }
  }

  async getGoal(id: string): Promise<Goal | null> {
    try {
      const response: AxiosResponse<Goal> = await axios.get(`${API_URL}/goals/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching goal ${id}:`, error);
      return null;
    }
  }

  async createGoal(goal: Goal): Promise<Goal | null> {
    try {
      const response: AxiosResponse<Goal> = await axios.post(`${API_URL}/goals`, goal);
      return response.data;
    } catch (error) {
      console.error('Error creating goal:', error);
      return null;
    }
  }

  async updateGoal(id: string, goal: Goal): Promise<Goal | null> {
    try {
      const response: AxiosResponse<Goal> = await axios.put(`${API_URL}/goals/${id}`, goal);
      return response.data;
    } catch (error) {
      console.error(`Error updating goal ${id}:`, error);
      return null;
    }
  }

  async deleteGoal(id: string): Promise<boolean> {
    try {
      await axios.delete(`${API_URL}/goals/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting goal ${id}:`, error);
      return false;
    }
  }

  // User endpoints
  async getUsers(): Promise<User[]> {
    try {
      const response: AxiosResponse<User[]> = await axios.get(`${API_URL}/users`);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }

  async getUser(id: string): Promise<User | null> {
    try {
      const response: AxiosResponse<User> = await axios.get(`${API_URL}/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      return null;
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const response: AxiosResponse<User> = await axios.get(`${API_URL}/users/${email}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user with email ${email}:`, error);
      return null;
    }
  }

  async createUser(user: User): Promise<User | null> {
    try {
      const response: AxiosResponse<User> = await axios.post(`${API_URL}/users`, user);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      return null;
    }
  }

  async updateUser(id: string, user: User): Promise<User | null> {
    try {
      const response: AxiosResponse<User> = await axios.put(`${API_URL}/users/${id}`, user);
      return response.data;
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      return null;
    }
  }

  // Settings endpoints
  async getSettings(userId: string): Promise<Settings | null> {
    try {
      const response: AxiosResponse<Settings> = await axios.get(`${API_URL}/settings/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching settings for user ${userId}:`, error);
      return null;
    }
  }

  async updateSettings(userId: string, settings: Settings): Promise<Settings | null> {
    try {
      const response: AxiosResponse<Settings> = await axios.put(`${API_URL}/settings/${userId}`, settings);
      return response.data;
    } catch (error) {
      console.error(`Error updating settings for user ${userId}:`, error);
      return null;
    }
  }

  // Statistics endpoints
  async getStatistics(userId: string): Promise<Statistics | null> {
    try {
      const response: AxiosResponse<Statistics> = await axios.get(`${API_URL}/statistics/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching statistics for user ${userId}:`, error);
      return null;
    }
  }
}

export default new ApiService();
