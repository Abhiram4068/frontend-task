<template>
  <div class="calculator-container">
    <div class="card silver-theme">
      <h1 class="title">Calculator</h1>
      
      <div class="calculator-inputs">
        <div class="form-row">
          <input v-model.number="num1" type="number" class="form-input silver-input" placeholder="Number 1" />
          <input v-model.number="num2" type="number" class="form-input silver-input" placeholder="Number 2" />
        </div>
      </div>
      
      <div class="calculator-actions">
        <button @click="calculate('add')" :disabled="loading" class="btn btn-silver">
          <span class="icon">+</span> Add
        </button>
        <button @click="calculate('subtract')" :disabled="loading" class="btn btn-silver">
          <span class="icon">−</span> Subtract
        </button>
        <button @click="calculate('multiply')" :disabled="loading" class="btn btn-silver">
          <span class="icon">×</span> Multiply
        </button>
        <button @click="calculate('divide')" :disabled="loading" class="btn btn-silver">
          <span class="icon">÷</span> Divide
        </button>
      </div>
      
      <div v-if="loading" class="loading-state">Calculating...</div>
      
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      
      <div v-if="result !== null" class="result-display">
        <h2>Result</h2>
        <div class="result-equation">
          {{ lastNum1 }} <span class="op-symbol">{{ getOperationSymbol(lastOperation) }}</span> {{ lastNum2 }} =
        </div>
        <div class="result-value">{{ result }}</div>
      </div>
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

const lastNum1 = ref(null);
const lastNum2 = ref(null);
const lastOperation = ref(null);

const getOperationSymbol = (op) => {
  switch (op) {
    case 'add': return '+';
    case 'subtract': return '−';
    case 'multiply': return '×';
    case 'divide': return '÷';
    default: return '';
  }
};

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
    const response = await api.get(`calculate/${operation}/${num1.value}/${num2.value}/`);
    
    // If backend returns a JSON object (e.g. {"answer": 15}) extract the first value
    if (typeof response.data === 'object' && response.data !== null) {
      result.value = Object.values(response.data)[0];
    } else {
      result.value = response.data;
    }
    
    lastNum1.value = num1.value;
    lastNum2.value = num2.value;
    lastOperation.value = operation;
  } catch (err) {
    console.error(err);
    error.value = err.response?.data?.error || err.response?.data?.detail || 'An error occurred during calculation. Are you sure the backend is running?';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.calculator-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 1rem;
}

.card.silver-theme {
  background-color: #111111;
  border: 1px solid #333333;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.9), 0 0 1px 1px rgba(192, 192, 192, 0.1);
  border-radius: 16px;
  padding: 3rem;
  color: #e0e0e0;
  max-width: 500px;
  width: 100%;
}

.title {
  color: #ffffff;
  font-weight: 700;
  margin-bottom: 2.5rem;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 3px;
  text-shadow: 0 0 15px rgba(192, 192, 192, 0.1);
}

.calculator-inputs {
  margin-bottom: 2rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.silver-input {
  flex: 1;
  background-color: #222222;
  border: 1px solid #444444;
  color: #ffffff;
  border-radius: 8px;
  padding: 1rem;
  font-size: 1.1rem;
  text-align: center;
  transition: all 0.3s ease;
  width: 100%;
  box-sizing: border-box;
}

.silver-input:focus {
  outline: none;
  border-color: #c0c0c0;
  box-shadow: 0 0 0 2px rgba(192, 192, 192, 0.2);
}

/* Chrome, Safari, Edge, Opera hide up/down arrows on number input */
.silver-input::-webkit-outer-spin-button,
.silver-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox hide up/down arrows */
.silver-input[type=number] {
  appearance: textfield;
  -moz-appearance: textfield;
}

.calculator-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
}

.btn-silver {
  background-color: #c0c0c0;
  color: #000000;
  border: none;
  border-radius: 8px;
  padding: 1rem;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn-silver:hover:not(:disabled) {
  background-color: #ffffff;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(192, 192, 192, 0.2);
}

.btn-silver:active:not(:disabled) {
  transform: translateY(1px);
}

.btn-silver:disabled {
  background-color: #555555;
  color: #888888;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.icon {
  font-size: 1.25rem;
  font-weight: 900;
}

.loading-state {
  color: #a0a0a0;
  text-align: center;
  margin-bottom: 1rem;
  font-style: italic;
}

.error-message {
  color: #ff5555;
  background: rgba(255, 85, 85, 0.1);
  border-left: 3px solid #ff5555;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  font-weight: 500;
  text-align: center;
}

.result-display {
  background-color: #1a1a1a;
  border: 1px solid #444444;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  margin-top: 1rem;
}

.result-display h2 {
  color: #a0a0a0;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.result-equation {
  font-size: 1.25rem;
  color: #a0a0a0;
  margin-bottom: 0.25rem;
  font-weight: 500;
  letter-spacing: 1px;
}

.op-symbol {
  color: #c0c0c0;
  margin: 0 0.5rem;
}

.result-value {
  font-size: 3rem;
  font-weight: 800;
  color: #ffffff;
  word-break: break-all;
  text-shadow: 0 0 15px rgba(192, 192, 192, 0.2);
}
</style>
