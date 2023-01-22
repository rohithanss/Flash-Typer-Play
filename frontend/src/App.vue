<script setup provided>
import axios from "axios";
import { ref, inject } from "vue";
import { RouterView } from "vue-router";
import NavBar from "./components/NavBar.vue";
import FooterBar from "./components/FooterBar.vue";

const isLoggedIn = inject("isLoggedIn");
const url = inject("backendURL");

const prof = ref({ status: false });
async function abc() {
  prof.value = await isLoggedIn(url);
}
abc();

async function logout() {
  let token = localStorage.getItem("token");
  try {
    let res = await axios.post(
      `${url}/user/logout`,
      {},
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    res = await res.data;
    prof.value = { status: false };
    console.log(res);
  } catch (err) {
    console.log(err);
  }
}
</script>
<template>
  <Toast />
  <NavBar :profile="prof" @logout="logout" />
  <RouterView />
  <FooterBar />
</template>

<style scoped></style>
