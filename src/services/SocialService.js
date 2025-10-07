// Follow/Social Business Logic Service
import { Global } from '../helpers/Global';
import ErrorHandler from '../helpers/ErrorHandler';

export class SocialService {
  static async followUser(userId) {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');

      // Business validation - returns string version of userId
      const validatedUserId = this.validateUserId(userId);
      this.validateNotSelfFollow(validatedUserId);

      const response = await fetch(`${Global.url}follow/follow/${validatedUserId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      });

      const data = await response.json();
      
      if (data.status !== 'success') {
        throw new Error(data.message || 'Failed to follow user');
      }

      return data;
    } catch (error) {
      ErrorHandler.logError(error, 'FOLLOW_USER');
      throw error;
    }
  }

  static async unfollowUser(userId) {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');

      // Business validation - returns string version of userId
      const validatedUserId = this.validateUserId(userId);

      const response = await fetch(`${Global.url}follow/unfollow/${validatedUserId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      });

      const data = await response.json();
      
      if (data.status !== 'success') {
        throw new Error(data.message || 'Failed to unfollow user');
      }

      return data;
    } catch (error) {
      ErrorHandler.logError(error, 'UNFOLLOW_USER');
      throw error;
    }
  }

  static async getFollowingList(userId) {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');

      const response = await fetch(`${Global.url}follow/following/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        // Business logic: Extract user IDs from follow relationships
        return data.follows?.map(follow => follow.followed) || [];
      } else {
        return [];
      }
    } catch (error) {
      ErrorHandler.logError(error, 'GET_FOLLOWING_LIST');
      return [];
    }
  }

  static async getFollowersList(userId) {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');

      const response = await fetch(`${Global.url}follow/followers/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        return data.follows?.map(follow => follow.user) || [];
      } else {
        return [];
      }
    } catch (error) {
      ErrorHandler.logError(error, 'GET_FOLLOWERS_LIST');
      return [];
    }
  }

  // Business logic methods
  static validateUserId(userId) {
    if (!userId) {
      throw new Error('Valid user ID is required');
    }
    // Convert to string if it's an ObjectId
    return String(userId);
  }

  static validateNotSelfFollow(userId) {
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      throw new Error('Cannot follow yourself');
    }
  }

  static getCurrentUser() {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      return null;
    }
  }

  static isFollowing(userId, followingList) {
    return followingList.includes(userId);
  }

  // Business rules for follow limits (if needed)
  static canFollow(currentFollowingCount) {
    const MAX_FOLLOWING = 1000; // Business rule
    return currentFollowingCount < MAX_FOLLOWING;
  }

  static getFollowStats(followingCount, followersCount) {
    return {
      following: followingCount || 0,
      followers: followersCount || 0,
      ratio: followersCount > 0 ? (followingCount / followersCount).toFixed(2) : 0
    };
  }
}