import apiClient from '../api/apiClient';

const authService = {
  register: async (userData) => {
    const data = await apiClient.post('/auth/register', userData);
    return data;
  },

  login: async (credentials) => {
    const data = await apiClient.post('/auth/login', credentials);
    // API returns { token, user }
    if (data && data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  logout: async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { ok: true };
  },

  getCurrentUser: async () => {
    // Try to fetch from API if token exists
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const user = await apiClient.get('/auth/me');
      // keep local storage in sync
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (err) {
      // fall back to localStorage
      return JSON.parse(localStorage.getItem('user'));
    }
  },

  updateProfile: async (userData) => {
    const data = await apiClient.put('/users/' + userData.id, userData);
    return data;
  },
};

export default authService;

// Named exports for compatibility
export const registerUser = async (userData) => {
  return await authService.register(userData);
};

export const loginUser = async (credentials) => {
  return await authService.login(credentials);
};