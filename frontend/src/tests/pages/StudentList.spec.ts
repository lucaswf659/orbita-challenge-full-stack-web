import { mount, flushPromises } from "@vue/test-utils";
import StudentList from "@/pages/StudentList.vue";
import { createTestingPinia } from "@pinia/testing";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { createVuetify } from "vuetify";
import { createRouter, createWebHistory } from "vue-router";

// Mock do serviço
vi.mock("@/services/studentService", () => ({
  fetchStudents: vi.fn(() =>
    Promise.resolve({
      items: [
        {
          id: 1,
          name: "Lucas",
          email: "lucas@dev.com",
          ra: "RA20250001",
          cpf: "12345678900",
        },
        {
          id: 2,
          name: "Yasmin",
          email: "yasmin@dev.com",
          ra: "RA20250002",
          cpf: "99999999999",
        },
      ],
      totalItems: 2,
    })
  ),
  removeStudent: vi.fn(() => Promise.resolve()),
}));

describe("StudentList.vue", () => {
  let wrapper: any;
  const vuetify = createVuetify();
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      {
        path: "/students/new",
        name: "new",
        component: { template: "<div>New</div>" },
      },
      {
        path: "/students/edit",
        name: "edit",
        component: { template: "<div>Edit</div>" },
      },
    ],
  });

  router.push = vi.fn(); // Mock explícito

  beforeEach(async () => {
    wrapper = mount(StudentList, {
      global: {
        plugins: [vuetify, router, createTestingPinia({ stubActions: false })],
      },
    });
    await router.isReady();
    await flushPromises();
  });

  it("renderiza os elementos principais", () => {
    expect(wrapper.get("[data-testid='search-input']")).toBeTruthy();
    expect(wrapper.get("[data-testid='search-btn']")).toBeTruthy();
    expect(wrapper.get("[data-testid='clear-btn']")).toBeTruthy();
    expect(wrapper.get("[data-testid='create-btn']")).toBeTruthy();
    expect(wrapper.get("[data-testid='student-table']")).toBeTruthy();
  });

  it("aciona onSearch ao clicar no botão 'Pesquisar'", async () => {
    const searchBtn = wrapper.get("[data-testid='search-btn']");
    await searchBtn.trigger("click");
    expect(wrapper.vm.loading).toBe(false);
  });

  it("limpa o campo de busca ao clicar em 'Limpar'", async () => {
    wrapper.vm.search = "Teste";
    const clearBtn = wrapper.get("[data-testid='clear-btn']");
    await clearBtn.trigger("click");
    expect(wrapper.vm.search).toBe("");
  });

  it("navega para nova página ao clicar em 'Cadastrar Estudante'", async () => {
    const createBtn = wrapper.get("[data-testid='create-btn']");
    await createBtn.trigger("click");
    expect(router.push).toHaveBeenCalledWith("/students/new");
  });

  it("exibe o nome do estudante ao confirmar exclusão", async () => {
    wrapper.vm.confirmDelete({ id: 1, name: "Lucas" });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.selectedStudent.name).toBe("Lucas");
    expect(wrapper.vm.deleteDialog).toBe(true);
  });

  it("chama deleteStudent corretamente e atualiza a lista", async () => {
    const fetchStudents = (await import("@/services/studentService"))
      .fetchStudents;
    wrapper.vm.selectedStudent = { id: 1, name: "Lucas" };
    await wrapper.vm.deleteStudent();
    expect(fetchStudents).toHaveBeenCalled();
    expect(wrapper.vm.toast.message).toContain("Student deleted successfully");
  });
});
