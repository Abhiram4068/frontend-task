<template>
  <div class="card auth-form">
    <h1>Register</h1>
    <form @submit.prevent="handleRegister">
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
        {{ loading ? 'Registering...' : 'Register' }}
      </button>
      <p style="text-align: center; margin-top: 1.5rem; color: var(--text-secondary); font-size: 0.875rem;">
        Already have an account? <router-link to="/login" style="color: var(--primary-color); text-decoration: none;">Login</router-link>
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

const handleRegister = async () => {
  loading.value = true;
  error.value = '';
  try {
    await store.dispatch('auth/register', form);
    // User successfully registered, redirect to login
    router.push('/login');
  } catch (err) {
    if (typeof err.response?.data === 'object' && err.response.data.username) {
        error.value = 'Username already exists.';
    } else {
        error.value = err.response?.data?.detail || 'Registration failed. Please try a different username.';
    }
  } finally {
    loading.value = false;
  }
};
</script>
