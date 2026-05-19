import { defineStore } from 'pinia'
import { ref, watch, computed } from 'vue'

// Usando a Composition API no Pinia
export const useNutritionStore = defineStore('nutrition', () => {
  const dailyGoal = ref(2000)
  
  // Array para guardar os objetos de refeição
  const meals = ref([])

  // Carregar dados iniciais do LocalStorage
  const storedData = localStorage.getItem('mamba-nutrition')
  if (storedData) {
    const parsed = JSON.parse(storedData)
    dailyGoal.value = parsed.dailyGoal ?? 2000
    meals.value = parsed.meals ?? []
  }

  // Salvar automaticamente quando mudar
  watch([dailyGoal, meals], () => {
    localStorage.setItem('mamba-nutrition', JSON.stringify({
      dailyGoal: dailyGoal.value,
      meals: meals.value
    }))
  }, { deep: true }) // true garante que mudanças dentro do Array sejam percebidas

  // Filtra as refeições apenas para o dia de hoje
  const todayMeals = computed(() => {
    const today = new Date().toLocaleDateString()
    return meals.value.filter(meal => new Date(meal.date).toLocaleDateString() === today)
  })

  // Soma todas as calorias consumidas hoje
  const todayCalories = computed(() => {
    return todayMeals.value.reduce((total, meal) => total + meal.calories, 0)
  })

  // Funções para modificar o estado
  function updateGoal(newGoal) {
    if (newGoal > 0) {
      dailyGoal.value = newGoal
    }
  }

  function addMeal(name, calories) {
    meals.value.push({
      id: Date.now(), // ID único baseado no timestamp atual
      name: name,
      calories: Number(calories),
      date: new Date().toISOString() // Salva a data e hora exata da refeição
    })
  }

  function removeMeal(id) {
    meals.value = meals.value.filter(meal => meal.id !== id)
  }

  // Retornando tudo que os componentes vão precisar usar
  return { 
    dailyGoal, 
    meals, 
    todayMeals, 
    todayCalories, 
    updateGoal, 
    addMeal, 
    removeMeal 
  }
})