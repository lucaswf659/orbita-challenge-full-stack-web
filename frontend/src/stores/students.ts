import { defineStore } from "pinia";

export const useStudentsStore = defineStore("students", {
  state: () => ({
    Id: null as number | null,
    Name: "",
    Email: "",
    RA: "",
    CPF: "",
  }),
});
