<template>
  <v-container>
    <h1 class="mb-10">
      {{ !form.Id ? "Novo Estudante" : "Editar Estudante" }}
    </h1>

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
        :disabled="!!form.Id"
        required
      />

      <v-row class="mt-4" no-gutters>
        <v-col cols="6" class="pr-1">
          <v-btn type="submit" color="secondary-color" block> Salvar </v-btn>
        </v-col>

        <v-col cols="6" class="pl-1">
          <v-btn text block @click="router.push('/students')"> Cancelar </v-btn>
        </v-col>
      </v-row>
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
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useStudentForm } from "@/composables/useStudentForm";

const router = useRouter();

const {
  formRef,
  form,
  toast,
  showToast,
  required,
  validateEmail,
  validateCpf,
  checkStudentContext,
  save,
} = useStudentForm();

onMounted(checkStudentContext);
</script>
