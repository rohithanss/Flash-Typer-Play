<script setup>
import { ref, inject } from "vue";
import { RouterLink } from "vue-router";
import axios from "axios";
import { email, required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";

import { useToast } from "primevue/usetoast";

const url = inject("backendURL");

const emits = defineEmits(["loggedIn"]);

let submitted = ref(false);
const isLoading = ref(false);
const password = ref("");
const email1 = ref("");

const toast = useToast();

const rules = {
  password: { required },
  email1: { required, email },
};

const v$ = useVuelidate(rules, { password, email1 });

async function login(isValid) {
  submitted.value = true;
  if (!isValid) {
    return;
  } else {
    isLoading.value = true;
    try {
      let res = await axios.post(`${url}/user/login`, {
        email: email1.value,
        password: password.value,
      });
      res = res.data;
      if (res.status == "success") {
        localStorage.setItem("token", res.token);
        localStorage.setItem("refreshToken", res.refreshToken);
        toast.add({
          severity: "success",
          summary: "Logged in",
          detail: "You are successfully logged in.",
          life: 3000,
        });
        window.location = "/";
      } else if (res.status == "fail") {
        toast.add({
          severity: "error",
          summary: "Wrong Credentials",
          detail: "You have entered wrong credentials, try again.",
          life: 3000,
        });
      } else {
        toast.add({
          severity: "warn",
          summary: "Logging in fail",
          detail:
            "Some error occurred while logging in, please try again after some time",
          life: 3000,
        });
      }
      isLoading.value = false;
    } catch (err) {
      toast.add({
        severity: "warn",
        summary: "Logging in fail",
        detail:
          "Some error occurred while logging in, please try again after some time",
        life: 3000,
      });
      isLoading.value = false;
    }
  }
}
</script>
<template>
  <div id="container">
    <h1>Login page</h1>
    <form class="login-form" @submit.prevent="login(!v$.$invalid)">
      <InputText
        type="email"
        name=""
        id=""
        v-model="email1"
        class="p-inputtext-sm"
        :class="{ 'p-invalid': v$.email1.$invalid && submitted }"
        placeholder="Email"
      />
      <Password
        type="password"
        id="password"
        v-model="password"
        class="p-inputtext-sm"
        :class="{ 'p-invalid': v$.password.$invalid && submitted }"
        placeholder="Password"
        :feedback="false"
        :toggle-mask="true"
      ></Password>

      <RouterLink to="/forgetpassword"> Forget Password? </RouterLink>

      <Button type="submit" label="Log in" :loading="isLoading" />
    </form>
  </div>
</template>

<style scoped>
#container {
  width: 60vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  margin: 30px auto;
  border-radius: var(--border-radius);
  background-color: var(--surface-100);
  padding: 20px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  color: var(--text-color);
}

.login-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  justify-content: center;
}

.p-inputtext {
  width: 50%;
}

.p-button {
  width: 50%;
}
.p-password {
  width: 50%;
}
a {
  color: var(--primary-color);
  font-weight: 500;
}
a:hover {
  text-decoration: underline;
}
::v-deep(.p-password input) {
  width: 100%;
}
</style>
