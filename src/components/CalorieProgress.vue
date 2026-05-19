<script setup>
import { ref, computed } from 'vue'
import { useNutritionStore } from '../stores/nutrition'
import { storeToRefs } from 'pinia'

const store = useNutritionStore()
// storeToRefs para manter a reatividade ao desestruturar
const { dailyGoal, todayCalories } = storeToRefs(store)

const isEditing = ref(false)
const tempGoal = ref(dailyGoal.value)

function saveGoal() {
  if (tempGoal.value > 0) {
    store.updateGoal(tempGoal.value)
  }
  isEditing.value = false
}

// Calcula a percentagem para a barra de progresso máximo 100% 
const progressPercentage = computed(() => {
  const percent = (todayCalories.value / dailyGoal.value) * 100
  return percent > 100 ? 100 : percent
})
</script>

<template>
  <div class="card">
    <div class="header-goal">
      <h2>Progresso Diário</h2>
      <button v-if="!isEditing" class="btn btn-small" @click="isEditing = true">Definir Meta</button>
    </div>

    <div v-if="isEditing" class="edit-goal-form">
      <input type="number" v-model="tempGoal" placeholder="Kcal por dia" />
      <button class="btn" @click="saveGoal">Guardar Meta</button>
    </div>

    <div v-else class="progress-section">
      <div class="stats">
        <span class="consumed">{{ todayCalories }} kcal consumidas</span>
        <span class="goal">de {{ dailyGoal }} kcal</span>
      </div>
      
      <div class="progress-bar-container">
        <div 
          class="progress-bar" 
          :style="{ width: progressPercentage + '%' }"
          :class="{ 'over-limit': todayCalories > dailyGoal }"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header-goal {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

h2 {
  color: var(--secondary-color);
  font-size: 1.4rem;
}

.btn-small {
  padding: 6px 12px;
  font-size: 0.9rem;
}

.edit-goal-form {
  display: flex;
  gap: 10px;
}

.edit-goal-form input {
  margin-bottom: 0;
}

.stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-weight: 600;
}

.consumed {
  color: var(--primary-color);
  font-size: 1.2rem;
}

.goal {
  color: var(--text-light);
}

.progress-bar-container {
  width: 100%;
  height: 20px;
  background-color: var(--border-color);
  border-radius: 10px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: var(--primary-color);
  transition: width 0.4s ease;
}

/* Se passar do limite, a barra fica vermelha */
.progress-bar.over-limit {
  background-color: var(--danger-color);
}
</style>