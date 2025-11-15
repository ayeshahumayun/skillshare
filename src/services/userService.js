import apiClient from '../api/apiClient';

// Function to create a new user
export const createUser = async (userData) => {
  try {
    const response = await apiClient.post('/users', userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Function to get user profile by ID
export const getUserProfile = async (userId) => {
  try {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Function to update user profile
export const updateUserProfile = async (userId, userData) => {
  try {
    const response = await apiClient.put(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Function to search users by skill
export const searchUsersBySkill = async (skill) => {
  try {
    const response = await apiClient.get(`/users/search?skill=${skill}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Convenience wrappers / compatibility exports used by pages
export const fetchSkills = async () => {
  // Return all users' skills (or call a skills endpoint if implemented)
  const users = await apiClient.get('/users');
  const skillsSet = new Set();
  users.forEach(u => {
    (u.skillsToTeach || []).forEach(s => skillsSet.add(s));
  });
  return Array.from(skillsSet);
};

export const updateUserSettings = async (userId, settings) => {
  return await updateUserProfile(userId, settings);
};

const userService = { createUser, getUserProfile, updateUserProfile, searchUsersBySkill, fetchSkills, updateUserSettings };
export { userService };