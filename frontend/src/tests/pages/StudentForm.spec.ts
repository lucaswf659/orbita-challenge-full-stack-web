import { mount, flushPromises } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import StudentForm from "@/pages/StudentForm.vue";
import { createTestingPinia } from "@pinia/testing";

// Mock router
const mockRouterPush = vi.fn();

vi.mock("vue-router", async () => {
  const actual = await vi.importActual("vue-router");
  return {
    ...actual,
    useRouter: () => ({
      push: mockRouterPush,
    }),
    useRoute: () => ({
      name: "StudentCreate",
    }),
  };
});

// Mock API
vi.mock("@/services/studentService", () => ({
  saveStudent: vi.fn(() => Promise.resolve()),
}));

describe("StudentForm.vue", () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(StudentForm, {
      global: {
        plugins: [createTestingPinia()],
        stubs: ["v-text-field", "v-btn", "v-snackbar"], // ⚠️ não stubar v-form ou v-container
      },
    });
  });

  it("mostra título 'Novo Estudante' se não houver ID", () => {
    expect(wrapper.text()).toContain("Novo Estudante");
  });

  it("mostra toast de sucesso ao salvar", async () => {
    vi.useFakeTimers(); // 🕒 ativa fake timers

    wrapper.vm.form.Name = "Lucas";
    wrapper.vm.form.Email = "lucas@dev.com";
    wrapper.vm.form.CPF = "123.456.789-00";

    wrapper.vm.formRef = {
      validate: () => Promise.resolve({ valid: true }),
    };

    await wrapper.vm.save();
    vi.runAllTimers(); // executa o setTimeout de redirecionamento
    await flushPromises();

    expect(wrapper.vm.toast.show).toBe(true);
    expect(wrapper.vm.toast.color).toBe("success");
    expect(mockRouterPush).toHaveBeenCalledWith("/students");
  });

  it("mostra toast de erro ao salvar se der problema", async () => {
    const { saveStudent } = await import("@/services/studentService");
    (saveStudent as any).mockRejectedValueOnce(new Error("Erro"));

    wrapper.vm.form.Name = "Lucas";
    wrapper.vm.form.Email = "lucas@dev.com";
    wrapper.vm.form.CPF = "123.456.789-00";

    wrapper.vm.formRef = {
      validate: () => Promise.resolve({ valid: true }),
    };

    await wrapper.vm.save();
    await flushPromises();

    expect(wrapper.vm.toast.show).toBe(true);
    expect(wrapper.vm.toast.color).toBe("error");
  });
});
