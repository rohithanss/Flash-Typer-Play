import { createApp } from "vue";
import PrimeVue from "primevue/config";
import App from "./App.vue";

import ToastService from "primevue/toastservice";
import ConfirmationService from "primevue/confirmationservice";

import router from "./router";
import isLoggedIn from "./scripts/isLoggedIn.js";

import "./assets/main.css";
import "primevue/resources/themes/lara-light-teal/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";

import Toast from "primevue/toast";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Password from "primevue/password";
import InputMask from "primevue/inputmask";
import InputNumber from "primevue/inputnumber";
import Dialog from "primevue/dialog";
import Dropdown from "primevue/dropdown";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Toolbar from "primevue/toolbar";

const app = createApp(App);

// app.provide("backendURL", "http://localhost:7070");
app.provide("backendURL", "https://flash-typer.onrender.com");
app.provide("isLoggedIn", isLoggedIn);

app.component("Toast", Toast);
app.component("Button", Button);
app.component("InputText", InputText);
app.component("Textarea", Textarea);
app.component("Password", Password);
app.component("InputMask", InputMask);
app.component("InputNumber", InputNumber);
app.component("Dialog", Dialog);
app.component("Dropdown", Dropdown);
app.component("DataTable", DataTable);
app.component("Column", Column);
app.component("Toolbar", Toolbar);

app.use(ConfirmationService);
app.use(ToastService);
app.use(router);
app.use(PrimeVue);
app.mount("#app");

// console.log(await isLoggedIn("http://localhost:7070"));
