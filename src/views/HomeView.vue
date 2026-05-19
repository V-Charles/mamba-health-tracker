<script setup>
import CalorieProgress from '../components/CalorieProgress.vue'
import MealManager from '../components/MealManager.vue'

</script>

<template>
  <div class="dashboard-grid">
    <div class="nutrition-section">
      <CalorieProgress />
      <MealManager />
    </div>
    
    <div class="fasting-section">
      <div class="card empty-card">
        <h2>Módulo de Jejum</h2>
        <p>Em breve na Fase 4...</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

/* Telas maiores que 768px dividem a tela em duas colunas */
@media (min-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.empty-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 300px;
  border: 2px dashed var(--border-color);
  background-color: transparent;
  color: var(--text-light);
  text-align: center;
}
</style>