<script setup>
import CalorieProgress from '../components/CalorieProgress.vue'
import MealManager from '../components/MealManager.vue'
import FastingTimer from '../components/FastingTimer.vue'
</script>

<template>
  <div class="dashboard-grid">
    <div class="nutrition-section">
      <CalorieProgress />
      <MealManager />
    </div>
    
    <div class="fasting-section">
      <FastingTimer />
    </div>
  </div>
</template>

<style scoped>
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

/* Ecrãs maiores que 768px dividem o ecrã em duas colunas */
@media (min-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>