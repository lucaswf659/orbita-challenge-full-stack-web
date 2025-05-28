<template>
  <v-container
    fluid
    class="pa-6"
    style="background-color: #f8f9fa; max-width: 100vw"
  >
    <!-- Top: Search + Create -->
    <v-row
      class="w-100 flex-wrap align-center justify-space-between mb-4"
      no-gutters
    >
      <v-col cols="12" md="7">
        <div class="d-flex flex-wrap align-center" style="gap: 12px">
          <v-text-field
            data-testid="search-input"
            v-model="search"
            label="Pesquisar por nome, RA ou CPF"
            clearable
            dense
            hide-details
            class="flex-grow-1"
            @keyup.enter="onSearch"
          />
          <v-btn data-testid="search-btn" color="primary" @click="onSearch"
            >Pesquisar</v-btn
          >
          <v-btn data-testid="clear-btn" variant="text" @click="onClear"
            >Limpar</v-btn
          >
        </div>
      </v-col>

      <v-col cols="12" md="5" class="d-flex justify-end mt-2 mt-md-0">
        <v-btn data-testid="create-btn" color="primary" @click="goToCreate"
          >Cadastrar Estudante</v-btn
        >
      </v-col>
    </v-row>

    <!-- Table -->
    <v-row class="w-100" no-gutters>
      <v-col cols="12">
        <div style="min-height: 600px">
          <v-data-table-server
            data-testid="student-table"
            :headers="headers"
            v-model:items="students"
            :items-length="totalStudents"
            :loading="loading"
            item-value="id"
            class="elevation-1 w-100"
            style="min-width: 1000px"
            fixed-header
            height="500px"
            @update:options="fetchData"
          >
            <template v-slot:item.actions="{ item }">
              <div class="d-flex gap-1 justify-end">
                <v-btn size="small" variant="text" @click="editStudent(item)">
                  <v-icon size="20" color="primary">mdi-pencil</v-icon>
                </v-btn>
                <v-btn size="small" variant="text" @click="confirmDelete(item)">
                  <v-icon size="20" color="error">mdi-delete</v-icon>
                </v-btn>
              </div>
            </template>
          </v-data-table-server>
        </div>
      </v-col>
    </v-row>

    <!-- Delete confirmation -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">Confirm Deletion</v-card-title>
        <v-card-text>
          Tem certeza que deseja excluir o estudante
          <strong class="text-danger">{{ selectedStudent?.name }}</strong
          >?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="red" @click="deleteStudent">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
import { ref } from "vue";
import { useRouter } from "vue-router";
import { fetchStudents, removeStudent } from "@/services/studentService";
import { onMounted } from "vue";
import { useStudentsStore } from "@/stores/students";

const router = useRouter();

// State
const students = ref<any[]>([]);
const totalStudents = ref(0);
const loading = ref(false);
const search = ref("");
const pageNumber = ref(1);
const deleteDialog = ref(false);
const selectedStudent = ref<any | null>(null);

const options = ref({
  page: 1,
  itemPerPage: 10,
});

onMounted(() => {
  fetchData(options.value);
});

// Toast
const toast = ref({ show: false, message: "", color: "success" });
const showToast = (message: string, color: "success" | "error" = "success") => {
  toast.value = { show: true, message, color };
};

// Headers
const headers = [
  { title: "RA", key: "ra" },
  { title: "Nome", key: "name" },
  { title: "CPF", key: "cpf" },
  { title: "E-mail", key: "email" },
  { title: "Actions", key: "actions", sortable: false },
];

interface DataTableOptions {
  page: number;
  itemPerPage: number;
}

async function fetchData(newOptions: DataTableOptions) {
  loading.value = true;

  try {
    const page = newOptions.page;
    const itemsPerPage = newOptions.itemPerPage;
    const searchTerm = search.value.trim();

    const result = await fetchStudents(page, itemsPerPage, searchTerm);
    console.log("Fetched students:", result);
    students.value = result.items;
    totalStudents.value = result.totalItems;
  } catch (err) {
    console.error("Error fetching data:", err);
    showToast("Erro ao buscar alunos");
  } finally {
    loading.value = false;
  }
}

// Actions
const goToCreate = () => {
  const store = useStudentsStore();
  store.Id = null;
  store.Name = "";
  store.Email = "";
  store.RA = "";
  store.CPF = "";
  router.push("/students/new");
};

const editStudent = (student: any) => {
  const studentStore = useStudentsStore();
  studentStore.Name = student.name;
  studentStore.Email = student.email;
  studentStore.RA = student.ra;
  studentStore.CPF = student.cpf;
  studentStore.Id = student.id;
  router.push(`/students/edit`);
};

const confirmDelete = (student: any) => {
  selectedStudent.value = student;
  deleteDialog.value = true;
};

const deleteStudent = async () => {
  if (!selectedStudent.value) return;
  try {
    await removeStudent(selectedStudent.value.id);
    showToast("Student deleted successfully.", "success");
    await fetchData(options.value);
  } catch (err) {
    console.error("Delete failed:", err);
    showToast("Failed to delete student.", "error");
  } finally {
    deleteDialog.value = false;
  }
};

// Search
const onSearch = async () => {
  pageNumber.value = 1;
  await fetchData(options.value);
};

const onClear = async () => {
  search.value = "";
  pageNumber.value = 1;
  await fetchData(options.value);
};
</script>
