import { createApp } from "vue";
import PrimeVue from "primevue/config";
import App from "./App.vue";
import { createRouter, createWebHistory } from "vue-router";

import "./assets/main.css";
import "primevue/resources/themes/lara-light-teal/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";

import Button from "primevue/button";
import InputText from "primevue/inputtext";

const router = createRouter({
  routes: [
    {
      path: "/",
      name: "Home",
      component: () => import("./views/HomeView.vue"),
    },
    {
      path: "/about",
      name: "About",
      component: () => import("./views/AboutView.vue"),
    },
  ],
  history: createWebHistory(),
});
const app = createApp(App);

app.use(router);
app.use(PrimeVue);
app.component("Button", Button);
app.component("InputText", InputText);
app.mount("#app");
