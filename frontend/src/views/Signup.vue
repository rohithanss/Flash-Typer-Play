<script setup>
import { ref, computed, inject } from "vue";
import { email, required, minLength } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import axios from "axios";
import { useToast } from "primevue/usetoast";

const url = inject("backendURL");

const toast = useToast();

let submitted = ref(false);
const isLoading = ref(false);
const password = ref("");
const email1 = ref("");
const name = ref("");
const otpValue = ref("");

const isOtpSent = ref(false);

const isOtp = computed(() => {
  return otpValue.value.split("-_").join("").split("-").join("").length != 4;
});

const rules = {
  password: { required, minLengthValue: minLength(8) },
  email1: { required, email },
  name: { required },
};

const v$ = useVuelidate(rules, { password, email1, name });

async function signup(isValid) {
  submitted.value = true;
  if (isValid) {
    isLoading.value = true;
    try {
      let res = await axios.post(`${url}/getotp`, {
        email: email1.value,
      });
      res = res.data;
      if (res.status == "success") {
        toast.add({
          severity: "success",
          summary: "OTP Sent",
          detail: "OTP is successfully sent to " + email1.value,
          life: 3000,
        });
        isOtpSent.value = true;
      } else {
        toast.add({
          severity: "warn",
          summary: "OTP Sent",
          detail: "Some error occurred while sending OTP, try after some time",
          life: 3000,
        });
      }
    } catch (err) {
      toast.add({
        severity: "warn",
        summary: "OTP Sent",
        detail: "Some error occurred while sending OTP, try after some time",
        life: 3000,
      });
    }
    isLoading.value = false;
  }
}

async function validateOtp() {
  isLoading.value = true;
  try {
    let res = await axios.post(`${url}/user/signup`, {
      email: email1.value,
      password: password.value,
      name: name.value,
      otp: +otpValue.value.split("-").join(""),
    });
    if (res.data.status == "success") {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      window.location = "/";
    } else if (res.data.msg == "invalid otp") {
      toast.add({
        severity: "warn",
        summary: "Signing up",
        detail: "Invalid OTP, please enter carefully",
        life: 3000,
      });
    } else {
      toast.add({
        severity: "warn",
        summary: "Signing up",
        detail: res.data.msg,
        life: 3000,
      });
      isOtpSent.value = false;
    }
    isLoading.value = false;
  } catch (err) {
    toast.add({
      severity: "warn",
      summary: "Signing up",
      detail: "something went wrong while registering try again later",
      life: 3000,
    });

    isLoading.value = false;
  }
}
</script>
<template>
  <div id="container">
    <h1>Signup page</h1>
    <form class="signup-form" @submit.prevent="signup(!v$.$invalid)">
      <span>
        <InputText
          type="text"
          id="name"
          v-model="name"
          class="p-inputtext-sm"
          :class="{ 'p-invalid': v$.name.$invalid && submitted }"
          placeholder="name"
          :disabled="isOtpSent"
        ></InputText>
      </span>
      <span>
        <InputText
          type="text"
          id="email"
          v-model="email1"
          class="p-inputtext-sm"
          :class="{ 'p-invalid': v$.email1.$invalid && submitted }"
          placeholder="Email"
          :disabled="isOtpSent"
        ></InputText>
      </span>

      <Password
        type="password"
        id="password"
        v-model="password"
        class="p-inputtext-sm"
        :class="{ 'p-invalid': v$.password.$invalid && submitted }"
        placeholder="Password"
        :feedback="false"
        :toggle-mask="true"
        :disabled="isOtpSent"
      ></Password>

      <InputMask
        v-if="isOtpSent"
        v-model="otpValue"
        mask="9-9-9-9"
        placeholder="Enter OTP"
      ></InputMask>
      <Button
        v-if="!isOtpSent"
        type="submit"
        label="Sign up"
        :loading="isLoading"
      />
      <Button
        v-if="isOtpSent"
        @click="validateOtp"
        label="Verify OTP"
        :loading="isLoading"
        :disabled="isOtp"
      />
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

.signup-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  justify-content: center;
}
.signup-form > span {
  width: 50%;
}
.signup-form > div {
  width: 50%;
  display: flex;
  gap: 10px;
  justify-content: start;
}
.p-inputtext {
  width: 100%;
}
.p-inputmask {
  width: 12%;
  text-align: center;
}
.p-button {
  width: 50%;
}
.p-password {
  width: 50%;
}
::v-deep(.p-password input) {
  width: 100%;
}
</style>
