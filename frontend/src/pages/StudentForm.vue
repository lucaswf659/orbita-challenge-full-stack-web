<template>
  <v-container>
    <h1>{{ isEdit ? "Editar Estudante" : "Novo Estudante" }}</h1>

    <v-form @submit.prevent="save">
      <v-text-field label="Name" v-model="form.Name" required />
      <v-text-field label="Email" v-model="form.Email" required />
      <v-text-field label="RA" v-model="form.RA" :disabled="isEdit" required />
      <v-text-field
        label="CPF"
        v-model="form.CPF"
        :disabled="isEdit"
        required
      />

      <v-btn type="submit" color="primary" class="mt-4">Salvar</v-btn>
      <v-btn text class="mt-4" @click="router.push('/students')"
        >Cancelar</v-btn
      >
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
import { useRoute, useRouter } from "vue-router";
import { fetchStudentById, saveStudent } from "@/services/studentService";

const route = useRoute();
const router = useRouter();
const isEdit = route.params.id !== undefined;

// Form data
const form = ref({
  Id: null,
  Name: "",
  Email: "",
  RA: "",
  CPF: "",
});

// Toast state
const toast = ref({ show: false, message: "", color: "success" });
const showToast = (message: string, color: "success" | "error" = "success") => {
  toast.value = { show: true, message, color };
};

// Load data if editing
onMounted(async () => {
  if (isEdit && typeof route.params.id === "string") {
    try {
      const student = await fetchStudentById(route.params.id);
      form.value = student;
    } catch (err) {
      console.error("Error loading student:", err);
      showToast("Erro ao carregar estudante.", "error");
    }
  }
});

// Save action
const save = async () => {
  try {
    const payload = { ...form.value } as any;
    if (!isEdit) delete payload.Id;

    await saveStudent(payload);

    showToast(
      isEdit
        ? "Estudante atualizado com sucesso."
        : "Estudante cadastrado com sucesso.",
      "success"
    );

    setTimeout(() => router.push("/students"), 500);
  } catch (err) {
    console.error("Erro ao salvar:", err);
    showToast("Erro ao salvar estudante.", "error");
  }
};
</script>
