<template>
  <v-container>
    <v-row class="mb-4">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="search"
          label="Buscar por Nome, RA ou CPF"
          prepend-icon="mdi-magnify"
          clearable
          density="comfortable"
        />
      </v-col>
      <v-row class="justify-space-between align-center mb-4">
        <v-btn color="primary" @click="goToCreate">Cadastrar Estudante</v-btn>
      </v-row>
    </v-row>

    <v-data-table
      :headers="headers"
      :items="filteredStudents"
      item-value="id"
      class="elevation-1"
      :items-per-page="10"
    >
      <template v-slot:item.actions="{ item }">
        <v-btn
          icon
          color="blue"
          @click="editStudent(item)"
          :title="'Editar ' + item.name"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn
          icon
          color="red"
          @click="confirmDelete(item)"
          :title="'Excluir ' + item.name"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <v-dialog v-model="deleteDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h6 font-weight-bold"
          >Confirmar Exclusão</v-card-title
        >
        <v-card-text>
          Você tem certeza que quer excluir o(a) aluno(a)
          <strong>{{ selectedStudent?.name }}</strong
          >?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="red" @click="deleteStudent">Confirmar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    ```
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { fetchStudents, removeStudent } from "@/services/studentService";

const router = useRouter();
const students = ref([]);
const search = ref("");
const deleteDialog = ref(false);
const selectedStudent = ref(null);

const headers = [
  { text: "Registro Acadêmico", value: "ra" },
  { text: "Nome", value: "name" },
  { text: "E-mail", value: "email" },
  { text: "CPF", value: "cpf" },
  { text: "Ações", value: "actions", sortable: false },
];

const loadStudents = async () => {
  try {
    const result = await fetchStudents();
    console.log("Alunos carregados:", result);
    students.value = result;
  } catch (err) {
    console.error("Erro ao carregar alunos:", err);
  }
};

const filteredStudents = computed(() => {
  const term = search.value.toLowerCase();
  return students.value.filter(
    (s) =>
      s.name.toLowerCase().includes(term) ||
      s.ra.toLowerCase().includes(term) ||
      s.cpf.toLowerCase().includes(term)
  );
});

const goToCreate = () => router.push("/students/new");
const editStudent = (student) => router.push(`/students/edit/${student.id}`);
const confirmDelete = (student) => {
  selectedStudent.value = student;
  deleteDialog.value = true;
};
const deleteStudent = async () => {
  await removeStudent(selectedStudent.value.id);
  deleteDialog.value = false;
  loadStudents();
};

onMounted(loadStudents);
</script>
