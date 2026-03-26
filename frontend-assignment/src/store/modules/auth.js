import api from '../../api/axios';

export default {
  namespaced: true,
  state: {
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
  },
  mutations: {
    setTokens(state, { access, refresh }) {
      state.accessToken = access;
      if (refresh) state.refreshToken = refresh;

      localStorage.setItem('accessToken', access);
      if (refresh) {
        localStorage.setItem('refreshToken', refresh);
      }
    },
    clearTokens(state) {
      state.accessToken = null;
      state.refreshToken = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  },
  actions: {
    async login({ commit }, credentials) {
      const response = await api.post('auth/login/', credentials);

      // Log the response to debug what the backend is actually returning
      console.log("Login Success. Backend returned:", response.data);

      // Try to extract the access token dynamically based on common Django keys
      const access = response.data.access || response.data.token || response.data.tokens?.access || response.data.key;
      const refresh = response.data.refresh || response.data.tokens?.refresh;

      if (!access) {
        console.error("Could not find a recognized token in the backend response!", response.data);
        alert("Login succeeded, but the frontend couldn't find the token in the response: " + JSON.stringify(response.data));
      }

      commit('setTokens', {
        access: access,
        refresh: refresh
      });
      return response.data;
    },
    async register(_, credentials) {
      return await api.post('auth/register/', credentials);
    },
    async refreshToken({ commit, state }) {
      if (!state.refreshToken) throw new Error('No refresh token available');

      const response = await api.post('auth/refresh/', {
        refresh: state.refreshToken
      });
      commit('setTokens', {
        access: response.data.access,
        refresh: state.refreshToken
      });
      return response.data;
    },
    async logout({ commit, state }) {
      try {
        if (state.accessToken && state.refreshToken) {
          await api.post('auth/logout/', { refresh: state.refreshToken });
        }
      } catch (err) {
        console.warn('Logout failed on backend, clearing tokens locally anyway');
      } finally {
        commit('clearTokens');
      }
    },
    clearTokensLocally({ commit }) {
      commit('clearTokens');
    }
  },
  getters: {
    isAuthenticated: state => !!state.accessToken
  }
};
