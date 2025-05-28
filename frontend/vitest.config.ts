// vitest.config.ts
import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
    css: false,
    coverage: {
      reporter: ["text", "html"],
      exclude: [
        "src/plugins/**",
        "src/App.vue",
        "src/main.ts",
        "vite.config.ts",
        "vitest.config.ts",
        "vitest.setup.ts",
        "src/style.css",
        "src/**/__tests__/**",
        "src/**/*.spec.ts",
        "src/shims-vuetify.d.ts",
        "src/vite-env.d.ts",
        "src/types/Student.ts",
        "types/vuetify.d.ts",
      ],
    },
  },
});
