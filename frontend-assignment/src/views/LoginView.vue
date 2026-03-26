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
