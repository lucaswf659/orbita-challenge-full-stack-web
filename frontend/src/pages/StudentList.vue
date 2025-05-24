<template>
  <v-container>
    <v-row class="justify-space-between align-center mb-4">
      <h1>Students</h1>
      <v-btn color="primary" @click="goToCreate">Add Student</v-btn>
    </v-row>

    <v-data-table
      :headers="headers"
      :items="students"
      item-value="id"
      class="elevation-1"
    >
      <template v-slot:item.actions="{ item }">
        <v-btn icon color="blue" @click="editStudent(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon color="red" @click="confirmDelete(item)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <v-dialog v-model="deleteDialog" max-width="500">
      <v-card>
        <v-card-title>Confirm Deletion</v-card-title>
        <v-card-text>Are you sure you want to delete this student?</v-card-text>
        <v-card-actions>
          <v-btn text @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="red" @click="deleteStudent">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { fetchStudents, removeStudent } from "@/services/studentService";

const router = useRouter();
const students = ref([]);
const deleteDialog = ref(false);
const selectedStudent = ref(null);

const headers = [
  { text: "RA", value: "ra" },
  { text: "Name", value: "name" },
  { text: "Email", value: "email" },
  { text: "CPF", value: "cpf" },
  { text: "Actions", value: "actions", sortable: false },
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
