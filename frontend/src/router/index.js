import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/allplayers",
      name: "allplayers",
      component: () => import("../views/AllPlayers.vue"),
    },
    {
      path: "/practicetrack",
      name: "practicetrack",
      component: () => import("../views/PracticeTrack.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/Login.vue"),
    },
    {
      path: "/signup",
      name: "signup",
      component: () => import("../views/Signup.vue"),
    },
    {
      path: "/forgetpassword",
      name: "forgetpassword",
      component: () => import("../views/ForgetPassword.vue"),
    },
    {
      path: "/racetexts",
      name: "racetexts",
      component: () => import("../views/RaceTexts.vue"),
    },
  ],
});

export default router;
