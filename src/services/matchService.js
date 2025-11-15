import apiClient from '../api/apiClient';

const matchService = {
  getMatches: async () => {
    try {
      return await apiClient.get('/matches');
    } catch (error) {
      throw new Error('Error fetching matches: ' + error.message);
    }
  },

  getSuggestions: async () => {
    try {
      return await apiClient.get('/matches/suggestions');
    } catch (error) {
      throw new Error('Error fetching suggestions: ' + error.message);
    }
  },

  createMatch: async (matchData) => {
    try {
      return await apiClient.post('/matches', matchData);
    } catch (error) {
      throw new Error('Error creating match: ' + error.message);
    }
  },

  deleteMatch: async (matchId) => {
    try {
      return await apiClient.delete(`/matches/${matchId}`);
    } catch (error) {
      throw new Error('Error deleting match: ' + error.message);
    }
  },

  updateMatch: async (matchId, matchData) => {
    try {
      return await apiClient.put(`/matches/${matchId}`, matchData);
    } catch (error) {
      throw new Error('Error updating match: ' + error.message);
    }
  },
};

export default matchService;

// Named exports for compatibility with page imports
export const getMatches = async () => {
  return await matchService.getMatches();
};

export const getMatchDetails = async (matchId) => {
  try {
    return await apiClient.get(`/matches/${matchId}`);
  } catch (err) {
    throw err;
  }
};

export const getUserMatches = async () => {
  return await matchService.getMatches();
};