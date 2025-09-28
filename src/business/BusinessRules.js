// Business Rules Engine - Centralized Business Logic
export class BusinessRules {
  // User Registration Rules
  static validateUserRegistration(userData) {
    const rules = [
      {
        field: 'name',
        validate: (value) => value && value.length >= 2 && value.length <= 50,
        message: 'Name must be between 2-50 characters'
      },
      {
        field: 'surname', 
        validate: (value) => value && value.length >= 2 && value.length <= 50,
        message: 'Surname must be between 2-50 characters'
      },
      {
        field: 'nickname',
        validate: (value) => value && value.length >= 3 && value.length <= 20,
        message: 'Nickname must be between 3-20 characters'
      },
      {
        field: 'email',
        validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: 'Valid email is required'
      },
      {
        field: 'password',
        validate: (value) => this.validatePassword(value).isValid,
        message: 'Password must meet security requirements'
      }
    ];

    return this.executeValidationRules(userData, rules);
  }

  // Password Security Rules
  static validatePassword(password) {
    const rules = {
      minLength: password && password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    const passedRules = Object.values(rules).filter(Boolean).length;
    const isValid = passedRules >= 4; // At least 4 out of 5 rules

    return {
      isValid,
      strength: this.getPasswordStrength(passedRules),
      rules,
      message: this.getPasswordMessage(rules)
    };
  }

  static getPasswordStrength(passedRules) {
    if (passedRules >= 5) return 'very-strong';
    if (passedRules >= 4) return 'strong';
    if (passedRules >= 3) return 'medium';
    if (passedRules >= 2) return 'weak';
    return 'very-weak';
  }

  static getPasswordMessage(rules) {
    const failedRules = [];
    
    if (!rules.minLength) failedRules.push('at least 8 characters');
    if (!rules.hasUppercase) failedRules.push('one uppercase letter');
    if (!rules.hasLowercase) failedRules.push('one lowercase letter');
    if (!rules.hasNumber) failedRules.push('one number');
    if (!rules.hasSpecialChar) failedRules.push('one special character');

    if (failedRules.length === 0) return 'Password meets all requirements';
    return `Password needs: ${failedRules.join(', ')}`;
  }

  // Avatar Upload Rules
  static validateAvatarUpload(file) {
    const rules = [
      {
        validate: () => file instanceof File,
        message: 'Valid file is required'
      },
      {
        validate: () => file.size <= 5 * 1024 * 1024, // 5MB
        message: 'File size must be less than 5MB'
      },
      {
        validate: () => ['image/jpeg', 'image/png', 'image/gif'].includes(file.type),
        message: 'File must be JPEG, PNG, or GIF format'
      },
      {
        validate: () => file.name.length <= 255,
        message: 'Filename too long'
      }
    ];

    return this.executeFileValidationRules(file, rules);
  }

  // Follow/Social Rules
  static validateFollowAction(currentUserId, targetUserId, currentFollowingCount = 0) {
    const rules = [
      {
        validate: () => currentUserId !== targetUserId,
        message: 'Cannot follow yourself'
      },
      {
        validate: () => currentFollowingCount < 1000, // Business rule: max following
        message: 'Maximum following limit reached (1000)'
      },
      {
        validate: () => targetUserId && typeof targetUserId === 'string',
        message: 'Valid target user ID is required'
      }
    ];

    return this.executeBusinessRules(rules);
  }

  // Content Moderation Rules
  static validateUserContent(content, type = 'general') {
    const baseRules = [
      {
        validate: (text) => !this.containsProfanity(text),
        message: 'Content contains inappropriate language'
      },
      {
        validate: (text) => !this.containsSpam(text),
        message: 'Content appears to be spam'
      },
      {
        validate: (text) => text.length <= this.getMaxLength(type),
        message: `Content exceeds maximum length for ${type}`
      }
    ];

    return this.executeContentRules(content, baseRules);
  }

  // Role-based Access Rules
  static canAccessFeature(userRole, feature) {
    const roleHierarchy = {
      'admin': 5,
      'moderator': 4, 
      'noble': 3,
      'knight': 2,
      'citizen': 1,
      'guest': 0
    };

    const featureRequirements = {
      'user_management': 4, // moderator+
      'content_moderation': 4,
      'create_posts': 1, // citizen+
      'follow_users': 1,
      'access_private_areas': 1,
      'upload_avatar': 1,
      'admin_panel': 5 // admin only
    };

    const userLevel = roleHierarchy[userRole] || 0;
    const requiredLevel = featureRequirements[feature] || 0;

    return userLevel >= requiredLevel;
  }

  // Session Management Rules
  static shouldRefreshSession(lastActivity, sessionDuration = 24 * 60 * 60 * 1000) {
    if (!lastActivity) return true;
    
    const timeSinceActivity = Date.now() - new Date(lastActivity).getTime();
    return timeSinceActivity > (sessionDuration * 0.5); // Refresh at 50% of session duration
  }

  static isSessionExpired(sessionStart, maxDuration = 24 * 60 * 60 * 1000) {
    if (!sessionStart) return true;
    
    const sessionAge = Date.now() - new Date(sessionStart).getTime();
    return sessionAge > maxDuration;
  }

  // Rate Limiting Rules
  static canPerformAction(actionType, lastActionTime, cooldownPeriod) {
    const cooldownPeriods = {
      'follow': 1000, // 1 second
      'post': 30000, // 30 seconds
      'upload': 60000, // 1 minute
      'login_attempt': 5000, // 5 seconds
      'registration': 300000 // 5 minutes
    };

    const period = cooldownPeriod || cooldownPeriods[actionType] || 1000;
    const timeSinceLastAction = Date.now() - new Date(lastActionTime).getTime();
    
    return timeSinceLastAction >= period;
  }

  // Helper methods for rule execution
  static executeValidationRules(data, rules) {
    const errors = {};
    let isValid = true;

    for (const rule of rules) {
      const value = data[rule.field];
      if (!rule.validate(value)) {
        errors[rule.field] = rule.message;
        isValid = false;
      }
    }

    return { isValid, errors };
  }

  static executeBusinessRules(rules) {
    const errors = [];
    
    for (const rule of rules) {
      if (!rule.validate()) {
        errors.push(rule.message);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static executeFileValidationRules(file, rules) {
    const errors = [];
    
    for (const rule of rules) {
      if (!rule.validate()) {
        errors.push(rule.message);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      file: {
        name: file.name,
        size: file.size,
        type: file.type
      }
    };
  }

  static executeContentRules(content, rules) {
    const errors = [];
    
    for (const rule of rules) {
      if (!rule.validate(content)) {
        errors.push(rule.message);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedContent: this.sanitizeContent(content)
    };
  }

  // Content filtering helpers
  static containsProfanity(text) {
    const profanityList = ['spam', 'abuse', 'inappropriate']; // Simplified list
    const lowerText = text.toLowerCase();
    return profanityList.some(word => lowerText.includes(word));
  }

  static containsSpam(text) {
    // Simple spam detection rules
    const spamIndicators = [
      text.includes('click here'),
      text.includes('buy now'),
      (text.match(/http/g) || []).length > 3,
      text.length > 1000 && text.split(' ').length < 10 // Too many chars, too few words
    ];

    return spamIndicators.filter(Boolean).length >= 2;
  }

  static getMaxLength(contentType) {
    const limits = {
      'bio': 500,
      'post': 2000,
      'comment': 500,
      'dungeon_name': 100,
      'general': 1000
    };

    return limits[contentType] || limits.general;
  }

  static sanitizeContent(content) {
    if (typeof content !== 'string') return content;
    
    return content
      .trim()
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  }
}