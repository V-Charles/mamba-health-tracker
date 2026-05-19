import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useFastingStore = defineStore('fasting', () => {

  const isFasting = ref(false)
  const startTime = ref(null) // Quando o jejum começou
  const selectedWindow = ref(16) // Janela de horas escolhida 16h
  const history = ref([]) // Histórico de jejuns concluídos

  // Carregar do LocalStorage
  const storedData = localStorage.getItem('mamba-fasting')
  if (storedData) {
    const parsed = JSON.parse(storedData)
    isFasting.value = parsed.isFasting ?? false
    startTime.value = parsed.startTime ?? null
    selectedWindow.value = parsed.selectedWindow ?? 16
    history.value = parsed.history ?? []
  }

  // Salvar automaticamente quando mudar
  watch([isFasting, startTime, selectedWindow, history], () => {
    localStorage.setItem('mamba-fasting', JSON.stringify({
      isFasting: isFasting.value,
      startTime: startTime.value,
      selectedWindow: selectedWindow.value,
      history: history.value
    }))
  }, { deep: true })

  function startFast(hours) {
    isFasting.value = true
    startTime.value = new Date().toISOString()
    selectedWindow.value = hours
  }

  function endFast() {
    if (!isFasting.value || !startTime.value) return

    const endDate = new Date()
    const startDate = new Date(startTime.value)
    
    // Calcula a duração em horas (milissegundos -> segundos -> minutos -> horas)
    const durationHours = (endDate - startDate) / (1000 * 60 * 60)

    // Salva no histórico
    history.value.push({
      id: Date.now(),
      startTime: startTime.value,
      endTime: endDate.toISOString(),
      durationHours: Number(durationHours.toFixed(2)), // Salva com 2 casas decimais
      targetWindow: selectedWindow.value
    })

    // Reseta o estado atual
    isFasting.value = false
    startTime.value = null
  }

  return { 
    isFasting, 
    startTime, 
    selectedWindow, 
    history, 
    startFast, 
    endFast 
  }
})