<template>
  <div class="card auth-form">
    <h1>Login</h1>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label class="form-label">Username</label>
        <input v-model="form.username" type="text" class="form-input" required />
      </div>
      <div class="form-group">
        <label class="form-label">Password</label>
        <input v-model="form.password" type="password" class="form-input" required />
      </div>
      <p v-if="error" class="error-message">{{ error }}</p>
      <button :disabled="loading" type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>
      <p style="text-align: center; margin-top: 1.5rem; color: var(--text-secondary); font-size: 0.875rem;">
        Don't have an account? <router-link to="/register" style="color: var(--primary-color); text-decoration: none;">Register</router-link>
      </p>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();

const form = reactive({
  username: '',
  password: ''
});

const loading = ref(false);
const error = ref('');

const handleLogin = async () => {
  loading.value = true;
  error.value = '';
  try {
    await store.dispatch('auth/login', form);
    router.push('/');
  } catch (err) {
    error.value = err.response?.data?.detail || 'Login failed. Please check your credentials.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Global body background for the login page */
:global(body) {
  background-color: #a45454ff;
}

/* Override existing classes with just colors */
.card {
  background-color: #111111 !important;
  border: 1px solid #333333 !important;
  box-shadow: 0 4px 6px rgba(192, 192, 192, 0.05) !important;
  color: #e0e0e0 !important;
}

h1 {
  color: #ffffff !important;
}

.form-label {
  color: #a0a0a0 !important;
}

.form-input {
  background-color: #222222 !important;
  border: 1px solid #444444 !important;
  color: #ffffff !important;
}

.form-input:focus {
  border-color: #c0c0c0 !important;
  box-shadow: 0 0 0 2px rgba(192, 192, 192, 0.2) !important;
}

.btn-primary {
  background-color: #c0c0c0 !important;
  color: #000000 !important;
  border: none !important;
}

.btn-primary:hover:not(:disabled) {
  background-color: #ffffff !important;
}

.btn-primary:disabled {
  background-color: #555555 !important;
  color: #aaaaaa !important;
}

.error-message {
  color: #ff5555 !important;
}
</style>
