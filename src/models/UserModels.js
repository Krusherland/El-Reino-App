// Domain Models and Data Transformation Layer
export class User {
  constructor(userData) {
    this.id = userData.id || userData._id;
    this.name = userData.name;
    this.surname = userData.surname;
    this.nickname = userData.nickname;
    this.email = userData.email;
    this.role = userData.role || 'citizen';
    this.bio = userData.bio;
    this.image = userData.image;
    this.avatar = userData.avatar;
    this.dungeon = userData.dungeon;
    this.createdAt = userData.created_at || userData.createdAt;
    this.updatedAt = userData.updated_at || userData.updatedAt;
  }

  // Business logic methods
  getFullName() {
    return `${this.name} ${this.surname}`.trim();
  }

  getDisplayName() {
    return this.nickname || this.getFullName();
  }

  hasAvatar() {
    return this.image && this.image !== 'default.png';
  }

  getAvatarUrl() {
    const baseUrl = 'http://localhost:3100/net/user/avatar/';
    return this.hasAvatar() ? `${baseUrl}${this.avatar}` : `${baseUrl}default.png`;
  }

  getRoleDisplayName() {
    const roleNames = {
      'admin': '👑 Administrador',
      'moderator': '🛡️ Moderador',
      'noble': '👑 Noble',
      'knight': '⚔️ Caballero',
      'mage': '🧙‍♂️ Mago',
      'archer': '🏹 Arquero',
      'merchant': '💰 Comerciante',
      'citizen': '🏘️ Ciudadano'
    };
    return roleNames[this.role] || '🏘️ Ciudadano';
  }

  getDungeonName() {
    return this.dungeon || `Fortaleza de ${this.getDisplayName()}`;
  }

  getBioOrDefault() {
    return this.bio || 
      `Este noble calabozo aún aguarda por que su señor escriba su historia. Las piedras susurran secretos antiguos, pero las páginas permanecen en blanco, esperando ser llenadas con las hazañas y aventuras de ${this.getDisplayName()}.`;
  }

  canBeFollowed(currentUserId) {
    return this.id !== currentUserId;
  }

  // Validation methods
  isValid() {
    return !!(this.name && this.surname && this.nickname && this.email);
  }

  // Serialization
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      surname: this.surname,
      nickname: this.nickname,
      email: this.email,
      role: this.role,
      bio: this.bio,
      image: this.image,
      avatar: this.avatar,
      dungeon: this.dungeon,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Static factory methods
  static fromApiResponse(apiData) {
    return new User(apiData);
  }

  static fromLocalStorage() {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const userData = JSON.parse(userStr);
        return new User(userData);
      }
      return null;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  }
}

export class UserCounters {
  constructor(countersData) {
    this.following = countersData.following || 0;
    this.followed = countersData.followed || 0;
    this.publications = countersData.publications || 0;
  }

  // Business logic methods
  getFollowRatio() {
    return this.followed > 0 ? (this.following / this.followed).toFixed(2) : 0;
  }

  getEngagementLevel() {
    const total = this.following + this.followed + this.publications;
    if (total > 100) return 'high';
    if (total > 50) return 'medium';
    if (total > 10) return 'low';
    return 'minimal';
  }

  isInfluencer() {
    return this.followed > this.following * 2 && this.followed > 100;
  }

  isActive() {
    return this.publications > 0 || this.following > 0;
  }

  toDisplayObject() {
    return {
      following: {
        count: this.following,
        label: 'Aliados',
        icon: 'fa-handshake'
      },
      followed: {
        count: this.followed,
        label: 'Admiradores', 
        icon: 'fa-users'
      },
      publications: {
        count: this.publications,
        label: 'Pergaminos',
        icon: 'fa-scroll'
      }
    };
  }

  static fromApiResponse(apiData) {
    return new UserCounters(apiData);
  }
}

export class FollowRelationship {
  constructor(relationshipData) {
    this.id = relationshipData.id || relationshipData._id;
    this.user = relationshipData.user;
    this.followed = relationshipData.followed;
    this.createdAt = relationshipData.created_at || relationshipData.createdAt;
  }

  // Business logic methods
  isRecent() {
    if (!this.createdAt) return false;
    const dayAgo = Date.now() - (24 * 60 * 60 * 1000);
    return new Date(this.createdAt).getTime() > dayAgo;
  }

  getRelationshipAge() {
    if (!this.createdAt) return 'Unknown';
    const age = Date.now() - new Date(this.createdAt).getTime();
    const days = Math.floor(age / (24 * 60 * 60 * 1000));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  }

  static fromApiResponse(apiData) {
    return new FollowRelationship(apiData);
  }
}

// Data transformation utilities
export class DataTransformer {
  static transformUserList(apiUserList) {
    return apiUserList.map(userData => User.fromApiResponse(userData));
  }

  static transformFollowList(apiFollowList) {
    return apiFollowList.map(followData => FollowRelationship.fromApiResponse(followData));
  }

  static transformCounters(apiCounters) {
    return UserCounters.fromApiResponse(apiCounters);
  }

  // Business logic for data consistency
  static validateUserData(userData) {
    const requiredFields = ['name', 'surname', 'nickname', 'email'];
    const missingFields = requiredFields.filter(field => !userData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    return true;
  }

  static sanitizeUserInput(input) {
    if (typeof input !== 'string') return input;
    
    // Business logic: Remove potentially harmful content
    return input
      .trim()
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  }

  static formatDisplayData(rawData, type) {
    switch (type) {
      case 'user':
        return User.fromApiResponse(rawData);
      case 'counters':
        return UserCounters.fromApiResponse(rawData);
      case 'follow':
        return FollowRelationship.fromApiResponse(rawData);
      default:
        return rawData;
    }
  }
}