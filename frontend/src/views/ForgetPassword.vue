<script setup>
import { ref, computed, inject } from "vue";
import { email, required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import axios from "axios";
import { useToast } from "primevue/usetoast";

const toast = useToast();

const url = inject("backendURL");

let emits = defineEmits(["passwordChanged"]);

let submitted = ref(false);
const isLoading = ref(false);
const password = ref("");
const email1 = ref("");
const otpValue = ref("");
const isOtpSent = ref(false);

const isOtp = computed(() => {
  return otpValue.value.split("-_").join("").split("-").join("").length != 4;
});

const isPasswordValid = computed(() => {
  return password.value.length > 7;
});

const rules = {
  email1: { required, email },
};

const v$ = useVuelidate(rules, { password, email1 });

async function sendOtp(isValid) {
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
  if (!isPasswordValid.value) {
    return console.log("Password length should be atleast 8");
  } else {
    try {
      let res = await axios.post(`${url}/user/resetpassword`, {
        email: email1.value,
        password: password.value,
        otp: +otpValue.value.split("-").join(""),
      });
      if (res.data.status == "success") {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        toast.add({
          severity: "success",
          summary: "Reset Password",
          detail: "Your password has been changed successfully",
          life: 3000,
        });

        window.location = "/";
      } else if (res.data.msg == "invalid otp") {
        toast.add({
          severity: "warn",
          summary: "Reset Password",
          detail: "Invalid OTP, please enter carefully",
          life: 3000,
        });
      } else {
        toast.add({
          severity: "warn",
          summary: "Reset Password",
          detail: res.data.msg,
          life: 3000,
        });

        isOtpSent.value = false;
      }
    } catch (err) {
      toast.add({
        severity: "warn",
        summary: "Reset Password",
        detail:
          "Something went wrong while changing password, please try again later",
        life: 3000,
      });
      isOtpSent.value = false;
    }
    isLoading.value = false;
  }
}
</script>
<template>
  <div id="container">
    <h1>Reset Password</h1>
    <form class="reset-password-form" @submit.prevent="sendOtp(!v$.$invalid)">
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
        v-show="isOtpSent"
        class="p-password-md"
        placeholder="Create new Password"
        :feedback="false"
        :toggle-mask="true"
        :class="{ 'p-invalid': !isPasswordValid }"
      ></Password>

      <InputMask
        v-if="isOtpSent"
        v-model="otpValue"
        mask="9-9-9-9"
        placeholder="OTP"
      ></InputMask>
      <Button
        v-if="!isOtpSent"
        type="submit"
        label="Send OTP"
        :loading="isLoading"
      />
      <Button
        v-if="isOtpSent"
        @click="validateOtp"
        label="Reset Password"
        :loading="isLoading"
        :disabled="isOtp || !isPasswordValid"
      />
    </form>
  </div>
</template>

<style scoped>
#container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  margin: 30px 0;
}

.reset-password-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  justify-content: center;
}
.reset-password-form > span {
  width: 30%;
}
.reset-password-form > div {
  width: 30%;
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
  width: 30%;
}
.p-password {
  width: 30%;
}
::v-deep(.p-password input) {
  width: 100%;
}
</style>
