<template>
  <div class="budget-page">
    <h1>Budget Planner</h1>

    <form @submit.prevent="createBudget">
      <input v-model.number="hotel" type="number" placeholder="Hotel Cost" />

      <input v-model.number="transport" type="number" placeholder="Transport Cost" />

      <input v-model.number="food" type="number" placeholder="Food Cost" />

      <button type="submit">Add Budget</button>
    </form>

    <div v-for="budget in budgets" :key="budget.id" class="budget-card">
      <p>Hotel: {{ budget.hotel }}</p>
      <p>Transport: {{ budget.transport }}</p>
      <p>Food: {{ budget.food }}</p>
      <p>Total: {{ budget.totalBudget }}</p>

      <button @click="deleteBudget(budget.id)">Delete</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

type Budget = {
  id: number
  hotel?: number
  transport?: number
  food?: number
  totalBudget: number
}

const budgets = ref<Budget[]>([])

const hotel = ref<number>()
const transport = ref<number>()
const food = ref<number>()

const API_URL = 'http://localhost:3000/budget'

const fetchBudgets = async () => {
  const response = await fetch(API_URL)
  budgets.value = await response.json()
}

const createBudget = async () => {
  await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      hotel: hotel.value,
      transport: transport.value,
      food: food.value,
    }),
  })

  await fetchBudgets()
}

const deleteBudget = async (id: number) => {
  await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  })

  await fetchBudgets()
}

onMounted(() => {
  fetchBudgets()
})
</script>

<style scoped>
.budget-page {
  padding: 20px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 300px;
}

.budget-card {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #ccc;
}
</style>
