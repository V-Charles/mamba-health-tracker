<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useFastingStore } from '../stores/fasting'

const store = useFastingStore()

const timerInterval = ref(null)
const elapsedMs = ref(0) // Milissegundos decorridos
const selectedPreset = ref(16) // Valor por defeito: 16 horas

// Calcula a diferença entre agora e o início do jejum
function updateTimer() {
  if (store.isFasting && store.startTime) {
    elapsedMs.value = new Date() - new Date(store.startTime)
  } else {
    elapsedMs.value = 0
  }
}

function startTimer() {
  updateTimer() // Chama logo para não haver delay de 1s
  timerInterval.value = setInterval(updateTimer, 1000)
}

function stopTimer() {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
    timerInterval.value = null
  }
}

// Observa mudanças no estado global.
watch(() => store.isFasting, (isNowFasting) => {
  if (isNowFasting) {
    startTimer()
  } else {
    stopTimer()
  }
})

// Quando o componente for montado no ecrã
onMounted(() => {
  if (store.isFasting) {
    startTimer()
  }
})

// Quando sairmos deste ecrã, limpamos o relógio para poupar memória
onUnmounted(() => {
  stopTimer()
})

// Formata os milissegundos
const formattedTime = computed(() => {
  let totalSeconds = Math.floor(elapsedMs.value / 1000)
  let hours = Math.floor(totalSeconds / 3600)
  totalSeconds %= 3600
  let minutes = Math.floor(totalSeconds / 60)
  let seconds = totalSeconds % 60

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

// Calcula a percentagem concluída (máximo 100%)
const progressPercentage = computed(() => {
  if (!store.isFasting) return 0
  const targetMs = store.selectedWindow * 60 * 60 * 1000
  const percent = (elapsedMs.value / targetMs) * 100
  return percent > 100 ? 100 : percent
})

// Função para formatar a data no histórico
function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('pt-PT', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
  })
}
</script>

<template>
  <div class="card fasting-card">
    <div class="header-fasting">
      <h2>Jejum Intermitente</h2>
      <span :class="['status-badge', store.isFasting ? 'active' : 'inactive']">
        {{ store.isFasting ? 'Em Jejum' : 'Inativo' }}
      </span>
    </div>

    <div class="timer-display">
      <div class="time">{{ formattedTime }}</div>
      <p v-if="store.isFasting" class="target-text">
        Meta: {{ store.selectedWindow }}h
      </p>
    </div>

    <!-- Barra de Progresso do Jejum -->
    <div class="progress-bar-container">
      <div 
        class="progress-bar" 
        :style="{ width: progressPercentage + '%' }"
        :class="{ 'goal-reached': progressPercentage >= 100 }"
      ></div>
    </div>

    <div class="controls">
      <template v-if="!store.isFasting">
        <select v-model="selectedPreset" class="preset-select">
          <option :value="12">12:12 (Iniciante)</option>
          <option :value="16">16:8 (Popular)</option>
          <option :value="18">18:6 (Avançado)</option>
          <option :value="20">20:4 (Guerreiro)</option>
          <option :value="24">24h (Dia Completo)</option>
        </select>
        <button class="btn btn-full" @click="store.startFast(selectedPreset)">
          Iniciar Jejum
        </button>
      </template>
      
      <template v-else>
        <button class="btn btn-danger btn-full" @click="store.endFast">
          Terminar Jejum
        </button>
      </template>
    </div>

    <!-- Histórico de Jejum -->
    <div class="fasting-history">
      <h3>Últimos Jejuns</h3>
      
      <p v-if="store.history.length === 0" class="empty-msg">
        Ainda não completou nenhum ciclo de jejum.
      </p>

      <ul v-else>
        <!-- array invertido para mostrar os mais recentes primeiro -->
        <li v-for="record in [...store.history].reverse().slice(0, 5)" :key="record.id" class="history-item">
          <div class="history-info">
            <strong>{{ record.durationHours }}h concluídas</strong>
            <span>{{ formatDate(record.endTime) }}</span>
          </div>
          <span class="target-badge">Meta: {{ record.targetWindow }}h</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.fasting-card {
  display: flex;
  flex-direction: column;
}

.header-fasting {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

h2 {
  color: var(--secondary-color);
  font-size: 1.4rem;
}

.status-badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.status-badge.active {
  background-color: #d4edda;
  color: #155724;
}

.status-badge.inactive {
  background-color: #e2e3e5;
  color: #383d41;
}

.timer-display {
  text-align: center;
  margin: 20px 0;
}

.time {
  font-size: 3.5rem;
  font-weight: 700;
  color: var(--primary-color);
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.target-text {
  color: var(--text-light);
  margin-top: 5px;
}

.progress-bar-container {
  width: 100%;
  height: 12px;
  background-color: var(--border-color);
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 25px;
}

.progress-bar {
  height: 100%;
  background-color: var(--primary-color);
  transition: width 1s linear;
}

.progress-bar.goal-reached {
  background-color: #f1c40f;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
}

.preset-select {
  margin-bottom: 0;
}

.btn-full {
  width: 100%;
  padding: 12px;
  font-size: 1.1rem;
}

h3 {
  font-size: 1.1rem;
  color: var(--text-light);
  margin-bottom: 15px;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 5px;
}

.empty-msg {
  color: var(--text-light);
  font-style: italic;
  text-align: center;
}

ul {
  list-style: none;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--background-color);
  padding: 12px 15px;
  border-radius: 8px;
  margin-bottom: 10px;
}

.history-info {
  display: flex;
  flex-direction: column;
}

.history-info strong {
  color: var(--text-color);
}

.history-info span {
  color: var(--text-light);
  font-size: 0.85rem;
}

.target-badge {
  font-size: 0.8rem;
  background-color: var(--surface-color);
  padding: 3px 8px;
  border-radius: 4px;
  border: 1px solid var(--border-color);
  color: var(--text-light);
}
</style>