// Lightweight in-memory mock API client for frontend-only development
// This client implements get/post/put/delete and returns Promise-resolved
// data shaped like the backend responses used in the app.

const delay = (ms = 150) => new Promise(res => setTimeout(res, ms));

let nextId = 100;
const genId = () => String(nextId++);

// Mock database
const users = [
  { id: '1', username: 'alice', email: 'alice@example.com', password: 'password', skillsToTeach: ['Photoshop','Design'], skillsToLearn: ['C++','Algorithms'] },
  { id: '2', username: 'bob', email: 'bob@example.com', password: 'password', skillsToTeach: ['C++','Algorithms'], skillsToLearn: ['Photoshop'] },
  { id: '3', username: 'carol', email: 'carol@example.com', password: 'password', skillsToTeach: ['Content Writing','SEO'], skillsToLearn: ['UI Design'] },
];

const matches = [];

const findUserByEmail = (email) => users.find(u => u.email === email);
const findUserById = (id) => users.find(u => u.id === String(id));

const apiClient = {
  get: async (path) => {
    await delay();
    // Auth
    if (path === '/auth/me') {
      const stored = localStorage.getItem('user');
      if (!stored) throw { status: 401, message: 'Not authenticated' };
      return JSON.parse(stored);
    }

    // Users
    if (path === '/users') {
      return users.map(u => ({ id: u.id, username: u.username, email: u.email, skillsToTeach: u.skillsToTeach, skillsToLearn: u.skillsToLearn }));
    }
    if (path.startsWith('/users/')) {
      const id = path.split('/')[2];
      const u = findUserById(id);
      if (!u) throw { status: 404, message: 'User not found' };
      return { id: u.id, username: u.username, email: u.email, skillsToTeach: u.skillsToTeach, skillsToLearn: u.skillsToLearn };
    }

    // Matches
    if (path === '/matches') {
      // return matches for current user (by stored user id)
      const stored = localStorage.getItem('user');
      if (!stored) return [];
      const me = JSON.parse(stored);
      return matches.filter(m => m.user1 === me.id || m.user2 === me.id);
    }

    if (path === '/matches/suggestions') {
      const stored = localStorage.getItem('user');
      if (!stored) return [];
      const me = JSON.parse(stored);
      const teachSet = new Set((me.skillsToTeach || []).map(s => s.toLowerCase()));
      const learnSet = new Set((me.skillsToLearn || []).map(s => s.toLowerCase()));
      const suggestions = [];
      for (const u of users.filter(u => u.id !== me.id)) {
        const uTeach = (u.skillsToTeach || []).map(s => s.toLowerCase());
        const uLearn = (u.skillsToLearn || []).map(s => s.toLowerCase());
        const teachesWhatINeed = uTeach.filter(s => learnSet.has(s));
        const wantsWhatITeach = uLearn.filter(s => teachSet.has(s));
        if (teachesWhatINeed.length > 0 && wantsWhatITeach.length > 0) {
          const score = teachesWhatINeed.length + wantsWhatITeach.length;
          suggestions.push({ user: { id: u.id, username: u.username, email: u.email, skillsToTeach: u.skillsToTeach, skillsToLearn: u.skillsToLearn }, teachesWhatINeed, wantsWhatITeach, score });
        }
      }
      suggestions.sort((a,b) => b.score - a.score);
      return suggestions;
    }

    if (path.startsWith('/matches/')) {
      const id = path.split('/')[2];
      const m = matches.find(x => x.id === id);
      if (!m) throw { status: 404, message: 'Match not found' };
      return m;
    }

    // Default
    return {};
  },

  post: async (path, body) => {
    await delay();
    // Auth login
    if (path === '/auth/login') {
      const { email, password } = body;
      const u = findUserByEmail(email);
      if (!u || u.password !== password) throw { status: 400, message: 'Invalid credentials' };
      const token = 'mock-token-' + u.id;
      const user = { id: u.id, username: u.username, email: u.email, skillsToTeach: u.skillsToTeach, skillsToLearn: u.skillsToLearn };
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      return { token, user };
    }

    if (path === '/auth/register') {
      const { username, email, password } = body;
      if (findUserByEmail(email)) throw { status: 400, message: 'User already exists' };
      const id = genId();
      const newUser = { id, username, email, password, skillsToTeach: [], skillsToLearn: [] };
      users.push(newUser);
      return { message: 'User registered', user: { id, username, email } };
    }

    if (path === '/matches') {
      const { user1, user2, skills } = body;
      const id = genId();
      const newMatch = { id, user1, user2, skills };
      matches.push(newMatch);
      return newMatch;
    }

    // Default
    return {};
  },

  put: async (path, body) => {
    await delay();
    if (path.startsWith('/users/')) {
      const id = path.split('/')[2];
      const u = findUserById(id);
      if (!u) throw { status: 404, message: 'User not found' };
      Object.assign(u, body);
      // update stored user if same
      const stored = JSON.parse(localStorage.getItem('user') || 'null');
      if (stored && stored.id === u.id) {
        localStorage.setItem('user', JSON.stringify({ id: u.id, username: u.username, email: u.email, skillsToTeach: u.skillsToTeach, skillsToLearn: u.skillsToLearn }));
      }
      return { id: u.id, username: u.username, email: u.email, skillsToTeach: u.skillsToTeach, skillsToLearn: u.skillsToLearn };
    }

    if (path.startsWith('/matches/')) {
      const id = path.split('/')[2];
      const m = matches.find(x => x.id === id);
      if (!m) throw { status: 404, message: 'Match not found' };
      Object.assign(m, body);
      return m;
    }

    return {};
  },

  delete: async (path) => {
    await delay();
    if (path.startsWith('/matches/')) {
      const id = path.split('/')[2];
      const idx = matches.findIndex(x => x.id === id);
      if (idx === -1) throw { status: 404, message: 'Match not found' };
      matches.splice(idx,1);
      return { ok: true };
    }
    return { ok: true };
  }
};

export default apiClient;