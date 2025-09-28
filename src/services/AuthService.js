// Authentication Business Logic Service
import { UserService } from './UserService';
import ErrorHandler from '../helpers/ErrorHandler';

export class AuthService {
  static async login(credentials) {
    try {
      // Business validation
      this.validateLoginCredentials(credentials);
      
      // Delegate to UserService for API call
      const result = await UserService.login(credentials);
      
      // Business logic: Transform and validate response
      const authData = this.transformAuthData(result);
      
      return authData;
    } catch (error) {
      ErrorHandler.logError(error, 'AUTH_LOGIN');
      throw error;
    }
  }

  static async register(userData) {
    try {
      // Business validation (additional auth-specific rules)
      this.validateRegistrationData(userData);
      
      // Delegate to UserService
      const result = await UserService.register(userData);
      
      return result;
    } catch (error) {
      ErrorHandler.logError(error, 'AUTH_REGISTER');
      throw error;
    }
  }

  static async refreshAuthData() {
    try {
      const currentUser = UserService.getCurrentUser();
      if (!currentUser) {
        throw new Error('No current user session');
      }

      // Fetch fresh user data
      const userData = await UserService.getUserProfile(currentUser.id);
      const counters = await UserService.getCounters(currentUser.id);

      // Business logic: Update stored user data
      localStorage.setItem('user', JSON.stringify(userData));

      return {
        user: userData,
        counters
      };
    } catch (error) {
      ErrorHandler.logError(error, 'AUTH_REFRESH');
      throw error;
    }
  }

  static logout() {
    try {
      // Business logic: Clear all auth data
      UserService.clearUserSession();
      
      // Business logic: Clear any cached data
      this.clearAuthCache();
      
      return true;
    } catch (error) {
      ErrorHandler.logError(error, 'AUTH_LOGOUT');
      throw error;
    }
  }

  static isAuthenticated() {
    return UserService.isAuthenticated();
  }

  static getCurrentUser() {
    return UserService.getCurrentUser();
  }

  static hasRole(requiredRole) {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    // Business logic: Role hierarchy
    const roleHierarchy = {
      'admin': 5,
      'moderator': 4,
      'noble': 3,
      'knight': 2,
      'citizen': 1
    };

    const userRole = user.role || 'citizen';
    const userLevel = roleHierarchy[userRole] || 0;
    const requiredLevel = roleHierarchy[requiredRole] || 0;

    return userLevel >= requiredLevel;
  }

  static canAccessPrivateArea() {
    const user = this.getCurrentUser();
    const token = localStorage.getItem('token');
    
    // Business rules for private area access
    return !!(user && token && user.name);
  }

  static getAuthHeaders() {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': token } : {};
  }

  // Business validation methods
  static validateLoginCredentials(credentials) {
    if (!credentials.email || !credentials.password) {
      throw new Error('Email and password are required');
    }

    // Business rule: Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.email)) {
      throw new Error('Invalid email format');
    }

    // Business rule: Password minimum length
    if (credentials.password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
  }

  static validateRegistrationData(userData) {
    // Delegate basic validation to UserService
    UserService.validateRegistrationData(userData);

    // Additional auth-specific business rules
    if (userData.password !== userData.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    // Business rule: Username blacklist
    const blacklistedUsernames = ['admin', 'root', 'moderator', 'system'];
    if (blacklistedUsernames.includes(userData.nickname.toLowerCase())) {
      throw new Error('Username not available');
    }
  }

  static transformAuthData(authResponse) {
    // Business logic: Transform API response to internal format
    return {
      user: {
        id: authResponse.user.id || authResponse.user._id,
        name: authResponse.user.name,
        surname: authResponse.user.surname,
        nickname: authResponse.user.nickname,
        email: authResponse.user.email,
        role: authResponse.user.role || 'citizen',
        bio: authResponse.user.bio,
        image: authResponse.user.image,
        avatar: authResponse.user.avatar,
        dungeon: authResponse.user.dungeon,
        createdAt: authResponse.user.created_at
      },
      token: authResponse.token
    };
  }

  static clearAuthCache() {
    // Business logic: Clear any cached authentication-related data
    // This could include clearing Redux store, removing temporary data, etc.
    if (window.caches) {
      window.caches.delete('auth-cache');
    }
  }

  // Session management business logic
  static isSessionExpired() {
    const user = this.getCurrentUser();
    if (!user || !user.createdAt) return false;

    // Business rule: Session expires after 24 hours
    const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in ms
    const sessionAge = Date.now() - new Date(user.createdAt).getTime();
    
    return sessionAge > SESSION_DURATION;
  }

  static shouldRefreshSession() {
    const user = this.getCurrentUser();
    if (!user || !user.createdAt) return false;

    // Business rule: Refresh session after 12 hours
    const REFRESH_THRESHOLD = 12 * 60 * 60 * 1000; // 12 hours in ms
    const sessionAge = Date.now() - new Date(user.createdAt).getTime();
    
    return sessionAge > REFRESH_THRESHOLD;
  }
}