<template>
  <div class="card auth-form">
    <h1>Register</h1>
    <form @submit.prevent="handleRegister">
      <div class="form-row">
        <div class="form-group flex-1">
          <label class="form-label">First Name</label>
          <input v-model="form.first_name" type="text" class="form-input" required />
        </div>
        <div class="form-group flex-1">
          <label class="form-label">Last Name</label>
          <input v-model="form.last_name" type="text" class="form-input" required />
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Username</label>
        <input v-model="form.username" type="text" class="form-input" required />
      </div>
      <div class="form-row">
        <div class="form-group flex-1">
          <label class="form-label">Password</label>
          <input v-model="form.password" type="password" class="form-input" required />
        </div>
        <div class="form-group flex-1">
          <label class="form-label">Confirm Password</label>
          <input v-model="form.confirm_password" type="password" class="form-input" required />
        </div>
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
  first_name: '',
  last_name: '',
  username: '',
  password: '',
  confirm_password: ''
});

const loading = ref(false);
const error = ref('');

const validatePassword = (password) => {
  if (password.length < 8) return "Password must be at least 8 characters long.";
  if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter.";
  if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter.";
  if (!/[!@#$%^&*()]/.test(password)) return "Password must contain at least one special character (!@#$%^&*()).";
  return null;
};

const handleRegister = async () => {
  error.value = '';
  
  if (form.password !== form.confirm_password) {
    error.value = "Passwords do not match.";
    return;
  }

  const passwordError = validatePassword(form.password);
  if (passwordError) {
    error.value = passwordError;
    return;
  }

  loading.value = true;
  try {
    await store.dispatch('auth/register', form);
    // User successfully registered, redirect to login
    router.push('/login');
  } catch (err) {
    if (typeof err.response?.data === 'object' && err.response.data.username) {
        error.value = 'Username already exists.';
    } else if (err.response?.data?.password) {
        error.value = err.response.data.password[0];
    } else {
        error.value = err.response?.data?.detail || 'Registration failed. Please check your inputs.';
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Global body background for the register page */
:global(body) {
  background-color: #000000;
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
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.flex-1 {
  flex: 1;
}

/* Ensure inner form-groups in row don't have excessive bottom margin if they need to align */
.form-row .form-group {
  margin-bottom: 1rem;
}
</style>
