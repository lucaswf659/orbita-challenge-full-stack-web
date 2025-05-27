import { defineStore } from "pinia";

export const useStudentsStore = defineStore("students", {
  state: () => ({ Id: null, Name: "", Email: "", RA: "", CPF: "" }),
});
