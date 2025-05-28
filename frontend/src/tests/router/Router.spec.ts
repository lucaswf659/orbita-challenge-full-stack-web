import { describe, it, expect, vi, beforeEach } from "vitest";
import router from "@/router";

vi.mock("@/pages/StudentList.vue", () => ({
  default: { template: "<div>Mocked StudentList</div>" },
}));

vi.mock("@/pages/StudentForm.vue", () => ({
  default: { template: "<div>Mocked StudentForm</div>" },
}));

describe("Rotas reais da aplicação (com cobertura de router/index.ts)", () => {
  beforeEach(async () => {
    if (router.currentRoute.value.fullPath !== "/") {
      await router.push("/");
      await router.isReady();
    }
  });

  it("redireciona '/' para '/students'", async () => {
    await router.push("/");
    await router.isReady();
    expect(router.currentRoute.value.fullPath).toBe("/students");
  });

  it("rota '/students' tem nome 'StudentList'", async () => {
    await router.push("/students");
    await router.isReady();
    expect(router.currentRoute.value.name).toBe("StudentList");
  });

  it("rota '/students/new' tem nome 'StudentCreate'", async () => {
    await router.push("/students/new");
    await router.isReady();
    expect(router.currentRoute.value.name).toBe("StudentCreate");
  });

  it("rota '/students/edit' tem nome 'StudentEdit'", async () => {
    await router.push("/students/edit");
    await router.isReady();
    expect(router.currentRoute.value.name).toBe("StudentEdit");
  });

  it("possui exatamente 4 rotas", () => {
    expect(router.getRoutes().length).toBe(4);
  });
});
