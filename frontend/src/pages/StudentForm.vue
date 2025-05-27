<template>
  <v-container>
    <h1>{{ !studentStore.Id ? "Novo Estudante" : "Editar Estudante" }}</h1>

    <v-form ref="formRef" @submit.prevent="save">
      <v-text-field
        label="Nome"
        v-model="form.Name"
        :rules="[required]"
        required
      />
      <v-text-field
        label="E-mail"
        v-model="form.Email"
        :rules="[required, validateEmail]"
        required
      />
      <v-text-field
        label="CPF"
        v-model="form.CPF"
        :rules="[required, validateCpf]"
        v-mask="'###.###.###-##'"
        :disabled="!!studentStore.Id"
        required
      />

      <v-btn type="submit" color="primary" class="mt-4">Salvar</v-btn>
      <v-btn text class="mt-4" @click="router.push('/students')">
        Cancelar
      </v-btn>
    </v-form>

    <!-- Toast feedback -->
    <v-snackbar
      v-model="toast.show"
      :color="toast.color"
      timeout="4000"
      location="bottom right"
    >
      {{ toast.message }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { saveStudent } from "@/services/studentService";
import { useStudentsStore } from "@/stores/students";

const router = useRouter();
const route = useRoute();
const studentStore = useStudentsStore();

// Refs
const formRef = ref();

// Form data
const form = ref({
  Id: null,
  Name: "",
  Email: "",
  CPF: "",
});

// Toast state
const toast = ref({ show: false, message: "", color: "success" });
const showToast = (message: string, color: "success" | "error" = "success") => {
  toast.value = { show: true, message, color };
};

// Validações
const required = (value: string) =>
  (!!value && value.trim() !== "") || "Campo obrigatório";

const validateEmail = (value: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(value) || "E-mail inválido";
};

const validateCpf = (value: string) => {
  const regex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  return regex.test(value) || "CPF inválido";
};

onMounted(() => {
  const isEditRoute = route.name === "StudentEdit";

  if (isEditRoute) {
    if (!studentStore.Id) {
      showToast("Estudante não encontrado. Redirecionando...", "error");
      router.push("/students");
    } else {
      form.value = {
        Id: studentStore.Id,
        Name: studentStore.Name,
        Email: studentStore.Email,
        CPF: studentStore.CPF || "",
      };
    }
  }
});

const save = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  try {
    const payload = { ...form.value } as any;
    if (!studentStore.Id) delete payload.Id;
    console.log("Payload:", payload);
    await saveStudent(payload);

    showToast(
      studentStore.Id
        ? "Estudante atualizado com sucesso."
        : "Estudante cadastrado com sucesso.",
      "success"
    );

    setTimeout(() => router.push("/students"), 500);
  } catch (err) {
    showToast("Erro ao salvar estudante.", "error");
  }
};
</script>
