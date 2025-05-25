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
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { fetchStudentById, saveStudent } from "@/services/studentService";

const route = useRoute();
const router = useRouter();
const isEdit = route.params.id !== undefined;

const form = ref({
  Id: null,
  Name: "",
  Email: "",
  RA: "",
  CPF: "",
});

onMounted(async () => {
  if (isEdit && typeof route.params.id === "string") {
    const student = await fetchStudentById(route.params.id);
    form.value = student;
  }
});

const save = async () => {
  const payload = { ...form.value } as any;
  if (!isEdit) delete payload.Id; // 👈 remove o ID se for cadastro novo
  await saveStudent(payload);
  router.push("/students");
};
</script>
