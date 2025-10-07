// Scroll Service for managing scroll messages
import { Global } from '../helpers/Global';
import ErrorHandler from '../helpers/ErrorHandler';

export class ScrollService {
  static async createScroll(scrollData) {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');

      // Business validation
      this.validateScrollData(scrollData);

      // Make API call to create scroll
      const response = await fetch(`${Global.url}scroll/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({
          text: scrollData.content.trim() // Backend expects 'text' field
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create scroll');
      }

      return {
        status: 'success',
        message: 'Scroll created successfully',
        scroll: data.scroll
      };
    } catch (error) {
      ErrorHandler.logError(error, 'CREATE_SCROLL');
      throw error;
    }
  }

  static async createScrollWithImage(scrollData, imageFile) {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');

      // Business validation
      this.validateScrollData(scrollData);
      if (imageFile) {
        this.validateImageFile(imageFile);
      }

      // Create FormData for multipart upload
      const formData = new FormData();
      formData.append('text', scrollData.content.trim());
      if (imageFile) {
        formData.append('file', imageFile);
      }

      console.log('Sending scroll with image to:', `${Global.url}scroll/upload`);
      console.log('FormData contents:', {
        text: scrollData.content.trim(),
        file: imageFile ? imageFile.name : 'no file'
      });

      // Make API call to create scroll with image
      const response = await fetch(`${Global.url}scroll/upload`, {
        method: 'POST',
        headers: {
          'Authorization': token
          // Note: Don't set Content-Type, browser will set it with boundary for FormData
        },
        body: formData
      }).catch(err => {
        console.error('Network error:', err);
        throw new Error('No se pudo conectar con el servidor. Verifica que el servidor esté ejecutándose en http://localhost:3100');
      });

      console.log('Response status:', response.status);

      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create scroll with image');
      }

      return {
        status: 'success',
        message: 'Scroll created successfully',
        scroll: data.scroll
      };
    } catch (error) {
      console.error('Error in createScrollWithImage:', error);
      ErrorHandler.logError(error, 'CREATE_SCROLL_WITH_IMAGE');
      throw error;
    }
  }

  static async getAllScrolls(page = 1, limit = 10) {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');

      // Make API call to get ALL scrolls from ALL users (for main Dungeons page)
      const response = await fetch(`${Global.url}scroll/all/${page}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      });

      const data = await response.json();

      if (!response.ok) {
        // If no scrolls found, return empty array instead of throwing
        if (response.status === 404) {
          return {
            status: 'success',
            scrolls: [],
            pagination: {
              page,
              limit,
              total: 0,
              totalPages: 0
            }
          };
        }
        throw new Error(data.message || 'Failed to fetch scrolls');
      }

      // Transform API response to match expected format
      const scrolls = data.scrolls.map(scroll => ({
        _id: scroll._id,
        title: scroll.text.substring(0, 50) + (scroll.text.length > 50 ? '...' : ''), // Create title from text
        content: scroll.text,
        image: scroll.file || null,
        user: {
          _id: scroll.user._id,
          name: scroll.user.name,
          nickname: scroll.user.nickname || scroll.user.name
        },
        created_at: scroll.created_at
      }));

      return {
        status: 'success',
        scrolls: scrolls,
        pagination: {
          page: data.page,
          limit: data.itemsPerPage,
          total: data.total,
          totalPages: data.pages
        }
      };
    } catch (error) {
      ErrorHandler.logError(error, 'GET_SCROLLS');
      throw error;
    }
  }

  static async getUserScrolls(userId, page = 1, limit = 10) {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');

      this.validateUserId(userId);

      // Make API call to get user's scrolls
      const response = await fetch(`${Global.url}scroll/scrolls/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      });

      const data = await response.json();

      if (!response.ok) {
        // If no scrolls found, return empty array instead of throwing
        if (response.status === 404) {
          return {
            status: 'success',
            scrolls: [],
            pagination: {
              page,
              limit,
              total: 0,
              totalPages: 0
            }
          };
        }
        throw new Error(data.message || 'Failed to fetch user scrolls');
      }

      // Transform API response to match expected format
      const scrolls = data.scrolls.map(scroll => ({
        _id: scroll._id,
        title: scroll.text.substring(0, 50) + (scroll.text.length > 50 ? '...' : ''), // Create title from text
        content: scroll.text,
        image: scroll.file || null,
        user: {
          _id: scroll.user._id,
          name: scroll.user.name,
          nickname: scroll.user.nickname || scroll.user.name
        },
        created_at: scroll.created_at
      }));

      return {
        status: 'success',
        scrolls: scrolls,
        pagination: {
          page: data.page,
          limit: data.itemsPerPage,
          total: data.total,
          totalPages: data.pages
        }
      };
    } catch (error) {
      ErrorHandler.logError(error, 'GET_USER_SCROLLS');
      throw error;
    }
  }

  static async deleteScroll(scrollId) {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');

      this.validateScrollId(scrollId);

      // Make API call to delete scroll
      const response = await fetch(`${Global.url}scroll/remove/${scrollId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete scroll');
      }

      return {
        status: 'success',
        message: 'Scroll deleted successfully'
      };
    } catch (error) {
      ErrorHandler.logError(error, 'DELETE_SCROLL');
      throw error;
    }
  }

  // Validation methods
  static validateScrollData(scrollData) {
    if (!scrollData) {
      throw new Error('Scroll data is required');
    }

    if (!scrollData.content || scrollData.content.trim().length === 0) {
      throw new Error('Scroll content is required');
    }

    if (scrollData.content.length > 500) {
      throw new Error('Scroll content must be less than 500 characters');
    }
  }

  static async getFeedScrolls(page = 1, limit = 10) {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');

      // Make API call to get scrolls from followed users only
      const response = await fetch(`${Global.url}scroll/feed/${page}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      });

      const data = await response.json();

      if (!response.ok) {
        // If no scrolls found, return empty array instead of throwing
        if (response.status === 404) {
          return {
            status: 'success',
            scrolls: [],
            pagination: {
              page,
              limit,
              total: 0,
              totalPages: 0
            }
          };
        }
        throw new Error(data.message || 'Failed to fetch feed scrolls');
      }

      // Transform API response to match expected format
      const scrolls = data.scrolls.map(scroll => ({
        _id: scroll._id,
        title: scroll.text.substring(0, 50) + (scroll.text.length > 50 ? '...' : ''), // Create title from text
        content: scroll.text,
        image: scroll.file || null,
        user: {
          _id: scroll.user._id,
          name: scroll.user.name,
          nickname: scroll.user.nickname || scroll.user.name
        },
        created_at: scroll.created_at
      }));

      return {
        status: 'success',
        scrolls: scrolls,
        pagination: {
          page: data.page,
          limit: data.itemsPerPage,
          total: data.total,
          totalPages: data.pages
        }
      };
    } catch (error) {
      ErrorHandler.logError(error, 'GET_FEED_SCROLLS');
      throw error;
    }
  }

  static validateUserId(userId) {
    if (!userId) {
      throw new Error('User ID is required');
    }
  }

  static validateScrollId(scrollId) {
    if (!scrollId) {
      throw new Error('Scroll ID is required');
    }
  }

  static validateImageFile(file) {
    if (!file) return; // Image is optional

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Tipo de archivo no válido. Solo se permiten imágenes (JPG, PNG, GIF, WEBP)');
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      throw new Error('La imagen es demasiado grande. El tamaño máximo es 5MB');
    }
  }

}