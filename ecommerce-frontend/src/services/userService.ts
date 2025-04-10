import axios from 'axios';

//const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5288/api/users';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5288';
const API_URL = `${API_BASE_URL}/api/users`;

export interface User {
  userID: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export const login = async (credentials: LoginCredentials): Promise<User> => {
  try {
    // Use the full URL to ensure the correct endpoint is called
    const response = await axios.post(`${API_URL}/login`, credentials);
    // Save user to session storage
    sessionStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logout = (): void => {
  // Remove user from session storage
  sessionStorage.removeItem('user');
};

export const getCurrentUser = (): User | null => {
  const userStr = sessionStorage.getItem('user');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

export const registerUser = async (user: any): Promise<number> => {
  try {
    // Use the API_URL directly since the registration endpoint is at /api/users
    const response = await axios.post(API_URL, user);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};