<script setup>
import { ref } from 'vue'
import { useNutritionStore } from '../stores/nutrition'

const store = useNutritionStore()
const mealName = ref('')
const mealCalories = ref('')

function handleAddMeal() {
  if (!mealName.value || !mealCalories.value) {
    alert('Por favor, preencha o nome e as calorias da refeição.')
    return
  }
  
  store.addMeal(mealName.value, mealCalories.value)
  
  // Limpar formulário após registar
  mealName.value = ''
  mealCalories.value = ''
}
</script>

<template>
  <div class="card">
    <h2>Registar Refeição</h2>
    
    <div class="meal-form">
      <input type="text" v-model="mealName" placeholder="Ex: Almoço, Maçã..." />
      <input type="number" v-model="mealCalories" placeholder="Calorias (Kcal)" />
      <button class="btn" @click="handleAddMeal">Adicionar</button>
    </div>

    <div class="meal-list">
      <h3>Histórico de Hoje</h3>
      
      <p v-if="store.todayMeals.length === 0" class="empty-msg">
        Nenhuma refeição registada hoje.
      </p>

      <ul v-else>
        <li v-for="meal in store.todayMeals" :key="meal.id" class="meal-item">
          <div class="meal-info">
            <strong>{{ meal.name }}</strong>
            <span>{{ meal.calories }} kcal</span>
          </div>
          <button class="btn-delete" @click="store.removeMeal(meal.id)">❌</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
h2 {
  color: var(--secondary-color);
  font-size: 1.4rem;
  margin-bottom: 20px;
}

h3 {
  font-size: 1.1rem;
  color: var(--text-light);
  margin-bottom: 15px;
  margin-top: 30px;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 5px;
}

.meal-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.meal-form input {
  margin-bottom: 0;
}

.empty-msg {
  color: var(--text-light);
  font-style: italic;
}

ul {
  list-style: none;
}

.meal-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--background-color);
  padding: 12px 15px;
  border-radius: 8px;
  margin-bottom: 10px;
  transition: transform 0.2s;
}

.meal-item:hover {
  transform: translateX(5px);
}

.meal-info {
  display: flex;
  flex-direction: column;
}

.meal-info strong {
  color: var(--text-color);
}

.meal-info span {
  color: var(--text-light);
  font-size: 0.9rem;
}

.btn-delete {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  opacity: 0.6;
  transition: opacity 0.3s;
}

.btn-delete:hover {
  opacity: 1;
}
</style>