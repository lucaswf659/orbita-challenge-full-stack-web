// src/main.ts
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import "./style.css";

createApp(App).use(router).use(vuetify).mount("#app");
