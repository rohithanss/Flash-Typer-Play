<script setup>
import { RouterLink } from "vue-router";
</script>
<template>
  <div id="container">
    <div>
      <RouterLink to="/"
        ><img class="logo" src="../assets/flash-type-h.png" alt="logo"
      /></RouterLink>
    </div>
    <div class="options">
      <h3><RouterLink to="/">Home</RouterLink></h3>
      <h3><RouterLink to="/about">About</RouterLink></h3>
      <Button class="p-button-success"
        ><RouterLink to="/login">Login</RouterLink></Button
      >
      <Button class="p-button-warning"
        ><RouterLink to="/signup">Signup</RouterLink></Button
      >
    </div>
  </div>
</template>

<style scoped>
#container {
  display: flex;
  padding: 10px 30px;
  justify-content: space-between;
  align-items: center;
  background-color: var(--surface-300);
}
#container > div {
  display: flex;
  gap: 20px;
  align-items: center;
}

.logo {
  width: 30%;
}

a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
}

.p-button a {
  color: white;
}
.p-button {
  padding: 2px 5px;
}

.p-button a:hover,
.p-button a.router-link-active {
  color: white;
}
a:hover,
a.router-link-active {
  color: var(--text-color-secondary);
}
</style>
