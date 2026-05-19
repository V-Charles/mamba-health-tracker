<script setup>
import { RouterView, RouterLink } from 'vue-router'
</script>

<template>
  <header class="header">
    <div class="container header-content">
      <h1>Mamba Health</h1>
      <nav>
        <!-- Estes links controlarão as abas da nossa SPA -->
        <RouterLink to="/" class="nav-link">Início</RouterLink>
        <RouterLink to="/dashboard" class="nav-link">Dashboard</RouterLink>
      </nav>
    </div>
  </header>

  <main class="container main-content">
    <!-- O RouterView é onde o Vue injeta as páginas dependendo da URL -->
    <RouterView />
  </main>
</template>

<style scoped>
.header {
  background-color: var(--surface-color);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 1.2rem 0;
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h1 {
  color: var(--primary-color);
  font-size: 1.8rem;
  font-weight: 700;
}

nav {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  text-decoration: none;
  color: var(--secondary-color);
  font-weight: 600;
  transition: color 0.3s;
}

.nav-link:hover, .router-link-active {
  color: var(--primary-color);
}

.main-content {
  min-height: 80vh;
}
</style>