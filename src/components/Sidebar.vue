// src/components/Sidebar.vue
<template>
  <v-navigation-drawer permanent app>
    <v-list-item class="px-4">
      <v-img src="/vite.svg" height="40" contain></v-img>
    </v-list-item>
    <v-divider></v-divider>
    <v-list dense>
      <v-list-item link>
        <v-list-item-content>
          <v-list-item-title>Alunos</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts"></script>

<style scoped>
.v-navigation-drawer {
  background-color: #f0f0f0;
  width: 240px;
}
</style>
