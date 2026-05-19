<script setup>
import { computed } from 'vue'
import { useNutritionStore } from '../stores/nutrition'
import { useFastingStore } from '../stores/fasting'
import { Bar, Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
} from 'chart.js'

// Registar os módulos do Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend)

const nutritionStore = useNutritionStore()
const fastingStore = useFastingStore()

// Pegar os últimos 7 dias
const last7DaysLabels = computed(() => {
  const labels = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    // Ex: seg, ter, qua
    labels.push(d.toLocaleDateString('pt-PT', { weekday: 'short' })) 
  }
  return labels
})

// Função utilitária para saber quantos dias atrás ocorreu uma data
function getDaysAgo(dateString) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dateString)
  target.setHours(0, 0, 0, 0)
  const diffTime = Math.abs(today - target)
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
}

// Dados: Gráfico de Calorias
const chartDataCalories = computed(() => {
  const data = [0, 0, 0, 0, 0, 0, 0]

  nutritionStore.meals.forEach(meal => {
    const daysAgo = getDaysAgo(meal.date)
    if (daysAgo <= 6) {
      data[6 - daysAgo] += meal.calories
    }
  })

  return {
    labels: last7DaysLabels.value,
    datasets: [
      {
        label: 'Calorias Consumidas (Kcal)',
        backgroundColor: '#27ae60',
        data: data
      }
    ]
  }
})

// Dados: Gráfico de Jejum
const chartDataFasting = computed(() => {
  const data = [0, 0, 0, 0, 0, 0, 0]

  fastingStore.history.forEach(session => {
    const daysAgo = getDaysAgo(session.endTime)
    if (daysAgo <= 6) {
      data[6 - daysAgo] += session.durationHours
    }
  })

  return {
    labels: last7DaysLabels.value,
    datasets: [
      {
        label: 'Horas em Jejum',
        borderColor: '#2c3e50',
        backgroundColor: '#2c3e50',
        data: data,
        tension: 0.3
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
}
</script>

<template>
  <div class="dashboard-container">
    <div class="card header-card">
      <h2>📊 Resumo Semanal</h2>
      <p>Acompanhe a sua evolução nos últimos 7 dias.</p>
    </div>

    <div class="charts-grid">
      <!-- Gráfico de Calorias -->
      <div class="card chart-card">
        <h3>Consumo Calórico</h3>
        <div class="chart-wrapper">
          <Bar :data="chartDataCalories" :options="chartOptions" />
        </div>
      </div>

      <!-- Gráfico de Jejum -->
      <div class="card chart-card">
        <h3>Horas de Jejum</h3>
        <div class="chart-wrapper">
          <Line :data="chartDataFasting" :options="chartOptions" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header-card {
  text-align: center;
  margin-bottom: 30px;
}

.header-card h2 {
  color: var(--primary-color);
  font-size: 1.8rem;
  margin-bottom: 10px;
}

.header-card p {
  color: var(--text-light);
}

.charts-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

@media (min-width: 768px) {
  .charts-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.chart-card {
  display: flex;
  flex-direction: column;
}

.chart-card h3 {
  text-align: center;
  margin-bottom: 20px;
  color: var(--secondary-color);
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 10px;
}

/* É obrigatório dar uma altura para que os gráficos do Chart.js sejam responsivos */
.chart-wrapper {
  position: relative;
  height: 300px; 
  width: 100%;
}
</style>