<template>
  <div class="card" style="max-width: 500px; margin: 0 auto; text-align: center;">
    <h1>Calculator</h1>
    <div class="calculator-inputs">
      <div class="form-group" style="display: flex; gap: 1rem; justify-content: center;">
        <input v-model.number="num1" type="number" class="form-input" placeholder="Number 1" style="width: 45%;" />
        <input v-model.number="num2" type="number" class="form-input" placeholder="Number 2" style="width: 45%;" />
      </div>
    </div>
    <div class="calculator-actions" style="display: flex; gap: 0.5rem; justify-content: center; margin-bottom: 2rem; flex-wrap: wrap;">
      <button @click="calculate('add')" :disabled="loading" class="btn btn-outline" style="min-width: 100px;">Add (+)</button>
      <button @click="calculate('subtract')" :disabled="loading" class="btn btn-outline" style="min-width: 100px;">Subtract (-)</button>
      <button @click="calculate('multiply')" :disabled="loading" class="btn btn-outline" style="min-width: 100px;">Multiply (×)</button>
      <button @click="calculate('divide')" :disabled="loading" class="btn btn-outline" style="min-width: 100px;">Divide (÷)</button>
    </div>
    
    <div v-if="loading" style="color: var(--text-secondary);">Calculating...</div>
    
    <div v-if="error" class="error-message" style="margin-bottom: 1rem;">
      {{ error }}
    </div>
    
    <div v-if="result !== null" class="result-display" style="padding: 1.5rem; background: rgba(30, 41, 59, 0.7); border-radius: 0.5rem; border: 1px solid var(--border-color);">
      <h2 style="margin-bottom: 0.5rem; font-size: 1rem; color: var(--text-secondary);">Result</h2>
      <div style="font-size: 2.5rem; font-weight: 700; color: var(--success-color);">{{ result }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '../api/axios';

const num1 = ref(null);
const num2 = ref(null);
const result = ref(null);
const loading = ref(false);
const error = ref('');

const calculate = async (operation) => {
  if (num1.value === null || num2.value === null || num1.value === "" || num2.value === "") {
    error.value = 'Please enter both numbers.';
    return;
  }
  
  if (operation === 'divide' && parseFloat(num2.value) === 0) {
    error.value = 'Division by zero is not allowed.';
    return;
  }

  error.value = '';
  loading.value = true;
  result.value = null;

  try {
    // Using the exact endpoint pattern from your Django urlpatterns:
    // path('calculate/add/<str:num1>/<str:num2>/', ...)
    const response = await api.get(`calculate/${operation}/${num1.value}/${num2.value}/`);
    
    // Assuming backend returns `{ "result": <value> }`
    if (response.data && response.data.result !== undefined) {
      result.value = response.data.result;
    } else {
      // Fallback if backend just returns the value directly
      result.value = response.data;
    }
  } catch (err) {
    console.error(err);
    error.value = err.response?.data?.error || err.response?.data?.detail || 'An error occurred during calculation. Are you sure the backend is running?';
  } finally {
    loading.value = false;
  }
};
</script>
