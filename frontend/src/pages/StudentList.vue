<template>
  <v-container fluid class="no-scroll">
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
          <v-btn
            data-testid="search-btn"
            color="secondary-color"
            @click="onSearch"
            class="primary-btn"
            >Pesquisar</v-btn
          >
          <v-btn
            data-testid="clear-btn"
            variant="text"
            class="secondary-btn"
            @click="onClear"
            >Limpar</v-btn
          >
        </div>
      </v-col>

      <v-col cols="12" md="5" class="d-flex justify-end mt-2 mt-md-0">
        <v-btn
          data-testid="create-btn"
          color="secondary-color"
          class="primary-btn"
          @click="goToCreate"
          >Cadastrar Estudante</v-btn
        >
      </v-col>
    </v-row>

    <!-- Table -->
    <v-row class="w-100" no-gutters>
      <v-col cols="12">
        <div class="tabela-wrapper">
          <v-data-table-server
            data-testid="student-table"
            :headers="headers"
            v-model:items="students"
            :items-length="totalStudents"
            :loading="loading"
            item-value="id"
            class="students-table"
            fixed-header
            @update:options="fetchData"
          >
            <template #item.name="{ item }">
              <v-tooltip location="top">
                <template #activator="{ props }">
                  <span
                    v-bind="props"
                    class="text-truncate"
                    style="max-width: 200px"
                  >
                    {{ item.name }}
                  </span>
                </template>
                <span>{{ item.name }}</span>
              </v-tooltip>
            </template>

            <template #item.email="{ item }">
              <v-tooltip location="top">
                <template #activator="{ props }">
                  <span
                    v-bind="props"
                    class="text-truncate"
                    style="max-width: 200px"
                  >
                    {{ item.email }}
                  </span>
                </template>
                <span>{{ item.email }}</span>
              </v-tooltip>
            </template>

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
      <v-card style="padding: 15px">
        <v-card-title class="headline">Confirmar exclusão</v-card-title>
        <v-card-text>
          Tem certeza que deseja excluir o estudante
          <strong class="text-danger">{{ selectedStudent?.name }}</strong
          >?
        </v-card-text>
        <v-card-actions>
          <v-row class="w-100" no-gutters>
            <v-col cols="6" class="pr-1">
              <v-btn
                color="primary-color"
                class="secondary-btn"
                text
                block
                @click="deleteDialog = false"
              >
                Cancelar
              </v-btn>
            </v-col>
            <v-col cols="6" class="pl-1">
              <v-btn
                block
                color="secondary-color"
                variant="elevated"
                class="primary-btn"
                @click="deleteStudent"
              >
                Excluir
              </v-btn>
            </v-col>
          </v-row>
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
import { useStudentList } from "@/composables/useStudentList";
import "./styles.scss";

const {
  students,
  totalStudents,
  loading,
  search,
  deleteDialog,
  selectedStudent,
  toast,
  headers,
  fetchData,
  goToCreate,
  editStudent,
  confirmDelete,
  deleteStudent,
  onSearch,
  onClear,
} = useStudentList();
</script>

<style scoped>
html,
body {
  overflow-x: hidden;
}

.tabela-wrapper {
  width: 100%;
  max-height: 90vh;
  overflow-x: auto;
  overflow-y: auto;
  padding-bottom: 16px;
}

.students-table {
  min-width: unset;
  width: 100%;
}

.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  vertical-align: middle;
}
</style>
