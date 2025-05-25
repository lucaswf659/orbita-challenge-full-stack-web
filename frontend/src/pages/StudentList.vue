<template>
  <v-container
    fluid
    class="pa-6"
    style="max-width: 100vw; background-color: #f8f9fa"
  >
    <!-- Search & Actions -->
    <v-row class="align-center justify-space-between mb-4">
      <v-col cols="12" md="6" class="d-flex align-center gap-2">
        <v-text-field
          v-model="search"
          label="Search by Name, RA or CPF"
          clearable
          dense
          hide-details
          class="w-100"
        />
        <v-btn color="primary" @click="onSearch">Search</v-btn>
        <v-btn @click="onClear" variant="text">Clear</v-btn>
      </v-col>
      <v-col cols="12" md="6" class="d-flex justify-end">
        <v-btn color="primary" @click="goToCreate">Add Student</v-btn>
      </v-col>
    </v-row>

    <!-- Table -->
    <v-row no-gutters>
      <v-col cols="12">
        <div style="min-height: 600px">
          <v-data-table
            :headers="headers"
            :items="students"
            :page="pageNumber"
            :items-per-page="pageSize"
            :server-items-length="totalStudents"
            :items-per-page-options="[5, 10, 20]"
            :loading="loading"
            item-value="id"
            class="elevation-1 w-100"
            style="min-width: 1000px"
            fixed-header
            height="500px"
            @update:page="pageNumber = $event"
            @update:items-per-page="pageSize = $event"
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
          </v-data-table>
        </div>
      </v-col>
    </v-row>

    <!-- Delete Dialog -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">Confirm Delete</v-card-title>
        <v-card-text>
          Are you sure you want to delete
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
  </v-container>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { fetchStudents, removeStudent } from "@/services/studentService";

const router = useRouter();

const students = ref<any[]>([]);
const totalStudents = ref(0);
const loading = ref(false);
const search = ref("");
const pageNumber = ref(1);
const pageSize = ref(10);

const deleteDialog = ref(false);
const selectedStudent = ref<any | null>(null);

const headers = [
  { text: "RA", value: "ra" },
  { text: "Name", value: "name" },
  { text: "E-mail", value: "email" },
  { text: "CPF", value: "cpf" },
  { text: "Actions", value: "actions", sortable: false },
];

const loadStudents = async () => {
  loading.value = true;
  try {
    const result = await fetchStudents(
      pageNumber.value,
      pageSize.value,
      search.value.trim()
    );
    students.value = result.items;
    totalStudents.value = result.totalItems;
  } catch (err) {
    console.error("Error loading students:", err);
  } finally {
    loading.value = false;
  }
};

const goToCreate = () => router.push("/students/new");
const editStudent = (student: any) =>
  router.push(`/students/edit/${student.id}`);

const confirmDelete = (student: any) => {
  selectedStudent.value = student;
  deleteDialog.value = true;
};

const deleteStudent = async () => {
  if (!selectedStudent.value) return;
  await removeStudent(selectedStudent.value.id);
  deleteDialog.value = false;
  await loadStudents();
};

const onSearch = () => {
  pageNumber.value = 1;
  loadStudents();
};

const onClear = () => {
  search.value = "";
  pageNumber.value = 1;
  loadStudents();
};

watch([pageNumber, pageSize], loadStudents, { immediate: true });
</script>
