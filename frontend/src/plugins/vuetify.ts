// src/plugins/vuetify.ts
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import { aliases, mdi } from "vuetify/iconsets/mdi";
import "@mdi/font/css/materialdesignicons.css";

const myTheme = {
  dark: false,
  colors: {
    "main-color": "#242424",
    "secondary-color": "#991b1b",
    "neutral-light": "#e5e7eb",
    "text-primary": "#1f2937",
    "text-secondary": "#4b5563",
    "success-color": "#34d399",
    "error-color": "#f87171",
  },
};

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: { mdi },
  },
  theme: {
    defaultTheme: "myTheme",
    themes: {
      myTheme,
    },
  },
});
