<template>
  <div class="app-container">
    <nav class="navbar" v-if="!isAuthPage">
      <div class="logo">MathGenius</div>
      <div class="nav-links">
        <template v-if="isAuthenticated">
          <span class="nav-item">Welcome!</span>
          <button @click="logout" class="btn btn-outline">Logout</button>
        </template>
        <template v-else>
          <router-link to="/login" class="nav-item">Login</router-link>
          <router-link to="/register" class="btn btn-primary">Register</router-link>
        </template>
      </div>
    </nav>
    <main class="main-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';

const store = useStore();
const route = useRoute();
const router = useRouter();

const isAuthenticated = computed(() => store.getters['auth/isAuthenticated']);
const isAuthPage = computed(() => ['Login', 'Register'].includes(route.name));

const logout = async () => {
  await store.dispatch('auth/logout');
  router.push('/login');
};
</script>
