<script setup>
import { RouterLink } from "vue-router";

const props = defineProps(["profile"]);
const emits = defineEmits(["logout"]);

function logout() {
  emits("logout");
}
</script>
<template>
  <div id="container">
    <div>
      <RouterLink to="/"
        ><img class="logo" src="images/flash-type-h.png" alt="logo"
      /></RouterLink>
    </div>
    <div class="guestOptions options" v-if="props.profile.status == false">
      <h3><RouterLink to="/">Home</RouterLink></h3>

      <Button class="p-button-success"
        ><RouterLink to="/login">Login</RouterLink></Button
      >
      <Button class="p-button-warning"
        ><RouterLink to="/signup">Signup</RouterLink></Button
      >
    </div>
    <div class="userOptions options" v-if="props.profile.status == true">
      <RouterLink to="/"><h3>Home</h3></RouterLink>
      <RouterLink to="/allplayers" v-if="props.profile.role == 'admin'"
        ><h3>Players</h3></RouterLink
      >
      <RouterLink to="/racetexts" v-if="props.profile.role == 'admin'"
        ><h3>Race Texts</h3></RouterLink
      >
      <Button class="p-button-success">{{ props.profile.name }}</Button>
      <Button class="p-button-warning" @click="logout">Logout</Button>
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
@media screen and (max-width: 655px) {
  .logo {
    width: 50%;
  }
}
</style>
