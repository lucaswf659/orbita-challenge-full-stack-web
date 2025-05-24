<template>
  <v-app>
    <!-- AppBar -->
    <v-app-bar app color="primary" dark>
      <v-app-bar-title>Módulo Acadêmico</v-app-bar-title>
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
import Sidebar from "@/components/Sidebar.vue";
</script>
