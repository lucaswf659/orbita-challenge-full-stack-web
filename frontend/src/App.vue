<template>
  <v-app>
    <!-- AppBar -->
    <v-app-bar app color="secondary-color" dark>
      <v-app-bar-title>{{ appTitle }}</v-app-bar-title>
    </v-app-bar>

    <!-- Sidebar fixa para desktop -->
    <v-navigation-drawer
      :permanent="!display.smAndDown"
      :temporary="display.smAndDown.value"
      app
    >
      <Sidebar />
    </v-navigation-drawer>
    <!-- Content -->
    <v-main class="fill-height d-flex flex-column">
      <v-container fluid>
        <router-view v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import Sidebar from "@/components/Sidebar.vue";
import { computed, ref, watch } from "vue";
import { useDisplay } from "vuetify";

const drawer = ref(true);
const display = useDisplay();

watch(
  () => display.smAndDown.value,
  (isSmall) => {
    if (isSmall) drawer.value = false;
  },
  { immediate: true }
);
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
