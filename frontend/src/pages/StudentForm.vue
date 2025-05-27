<template>
  <v-container>
    <h1>{{ !studentStore.Id ? "Novo Estudante" : "Editar Estudante" }}</h1>

    <v-form @submit.prevent="save">
      <v-text-field label="Name" v-model="form.Name" required />
      <v-text-field label="Email" v-model="form.Email" required />
      <v-text-field
        label="RA"
        v-model="form.RA"
        :disabled="!!studentStore.Id"
        required
      />
      <v-text-field
        label="CPF"
        v-model="form.CPF"
        :disabled="!!studentStore.Id"
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
import { useRouter, useRoute } from "vue-router";
import { saveStudent } from "@/services/studentService";
import { useStudentsStore } from "@/stores/students";

const router = useRouter();
const route = useRoute();
const studentStore = useStudentsStore();

// Form data
const form = ref<{
  Id: number | null;
  Name: string;
  Email: string;
  RA: string;
  CPF: string;
}>({
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
        RA: studentStore.RA || "",
        CPF: studentStore.CPF || "",
      };
    }
  } else {
    form.value = {
      Id: null,
      Name: "",
      Email: "",
      RA: "",
      CPF: "",
    };
  }
});

const save = async () => {
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
