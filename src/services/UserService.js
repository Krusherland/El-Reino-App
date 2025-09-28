// User Business Logic Service
import { Global } from '../helpers/Global';
import ErrorHandler from '../helpers/ErrorHandler';

export class UserService {
  static async login(credentials) {
    try {
      const response = await fetch(`${Global.url}user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();
      
      if (data.status !== 'success') {
        throw new Error(data.message || 'Invalid credentials');
      }

      // Business logic: Store auth data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      return data;
    } catch (error) {
      ErrorHandler.logError(error, 'USER_LOGIN');
      throw error;
    }
  }

  static async register(userData) {
    try {
      // Business validation before API call
      this.validateRegistrationData(userData);
      
      const response = await fetch(`${Global.url}user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      const data = await response.json();
      
      if (data.status !== 'success') {
        throw new Error(data.message || 'Registration failed');
      }

      return data;
    } catch (error) {
      ErrorHandler.logError(error, 'USER_REGISTRATION');
      throw error;
    }
  }

  static async updateProfile(userData) {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token');

      const response = await fetch(`${Global.url}user/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();
      
      if (data.status !== 'success') {
        throw new Error(data.message || 'Update failed');
      }

      // Business logic: Clean sensitive data
      delete data.user.password;
      
      return data.user;
    } catch (error) {
      ErrorHandler.logError(error, 'USER_UPDATE');
      throw error;
    }
  }

  static async uploadAvatar(file) {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token');

      // Business validation
      this.validateAvatarFile(file);

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${Global.url}user/upload`, {
        method: 'POST',
        headers: { 'Authorization': token },
        body: formData
      });

      const data = await response.json();
      
      if (data.status !== 'success') {
        throw new Error(data.message || 'Upload failed');
      }

      return data.user;
    } catch (error) {
      ErrorHandler.logError(error, 'AVATAR_UPLOAD');
      throw error;
    }
  }

  static async getUserProfile(userId) {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token');

      const response = await fetch(`${Global.url}user/profile/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      });

      const data = await response.json();
      
      if (data.status !== 'success') {
        throw new Error(data.message || 'Failed to fetch profile');
      }

      return data.user;
    } catch (error) {
      ErrorHandler.logError(error, 'GET_USER_PROFILE');
      throw error;
    }
  }

  static async getUserList(page = 1, search = '') {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token');

      const response = await fetch(`${Global.url}user/list/${page}?search=${search}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      });

      const data = await response.json();
      
      if (data.status !== 'success') {
        throw new Error(data.message || 'Failed to fetch users');
      }

      return data.users || [];
    } catch (error) {
      ErrorHandler.logError(error, 'GET_USER_LIST');
      throw error;
    }
  }

  static async getCounters(userId) {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token');

      const response = await fetch(`${Global.url}user/counters/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        return data;
      } else {
        // Business logic: Return default counters on failure
        return { following: 0, followed: 0, publications: 0 };
      }
    } catch (error) {
      ErrorHandler.logError(error, 'GET_USER_COUNTERS');
      // Business logic: Return defaults on error
      return { following: 0, followed: 0, publications: 0 };
    }
  }

  // Business validation methods
  static validateRegistrationData(userData) {
    const requiredFields = ['name', 'surname', 'nickname', 'email', 'password'];
    
    for (const field of requiredFields) {
      if (!userData[field] || userData[field].trim() === '') {
        throw new Error(`${field} is required`);
      }
    }

    // Business rule: Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      throw new Error('Invalid email format');
    }

    // Business rule: Password strength
    if (userData.password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    // Business rule: Nickname uniqueness check could go here
    if (userData.nickname.length < 3) {
      throw new Error('Nickname must be at least 3 characters');
    }
  }

  static validateAvatarFile(file) {
    // Business rules for avatar upload
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

    if (file.size > maxSize) {
      throw new Error('Avatar file must be less than 5MB');
    }

    if (!allowedTypes.includes(file.type)) {
      throw new Error('Avatar must be JPEG, PNG, or GIF format');
    }
  }

  // Business logic for user state management
  static clearUserSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  static isAuthenticated() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  }

  static getCurrentUser() {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      ErrorHandler.logError(error, 'GET_CURRENT_USER');
      return null;
    }
  }
}