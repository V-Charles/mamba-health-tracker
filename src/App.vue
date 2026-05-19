<script setup>
import { RouterView, RouterLink } from 'vue-router'
</script>

<template>
  <div class="app-wrapper">
    <header class="header">
      <div class="container header-content">
        <h1>Mamba Health</h1>
        <nav>
          <RouterLink to="/" class="nav-link">Início</RouterLink>
          <RouterLink to="/dashboard" class="nav-link">Dashboard</RouterLink>
        </nav>
      </div>
    </header>

    <main class="container main-content">
      <RouterView />
    </main>

    <footer class="footer">
      <div class="container">
        <p>Mamba Health Tracker &copy; {{ new Date().getFullYear() }} - Desenvolvido por Vinicius Charles M. Dias.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

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
  flex: 1;
  width: 100%;
}

.footer {
  text-align: center;
  padding: 20px 0;
  margin-top: 40px;
  background-color: var(--surface-color);
  color: var(--text-light);
  font-size: 0.9rem;
  border-top: 1px solid var(--border-color);
}
</style>