import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Sidebar from "@/components/Sidebar.vue";
import { createVuetify } from "vuetify";
import { createTestingPinia } from "@pinia/testing";
import { createRouter, createWebHistory } from "vue-router";
import { routes } from "@/router";

// 👇 Configura Vuetify e Router para os testes
const vuetify = createVuetify();
const router = createRouter({
  history: createWebHistory(),
  routes,
});

describe("Sidebar.vue", () => {
  it("renderiza o componente e mostra 'Estudantes'", async () => {
    const wrapper = mount(Sidebar, {
      global: {
        plugins: [vuetify, createTestingPinia(), router],
      },
    });

    await router.isReady(); // aguarda o router carregar

    expect(wrapper.text()).toContain("Estudantes");
  });
});
