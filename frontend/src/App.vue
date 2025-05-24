<template>
  <v-app>
    <!-- AppBar -->
    <v-app-bar app color="primary" dark>
      <v-app-bar-title>{{ appTitle }}</v-app-bar-title>
    </v-app-bar>

    <!-- Sidebar -->
    <Sidebar />

    <!-- Conteúdo -->
    <v-main>
      <v-container fluid>
        <router-view v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import Sidebar from "@/components/Sidebar.vue";

const route = useRoute();

const appTitle = computed(() => {
  if (
    route.path.includes("/students/new") ||
    route.path.includes("/students/edit")
  ) {
    return "Cadastro de Estudantes";
  }
  return "Consulta de Estudantes";
});
</script>
