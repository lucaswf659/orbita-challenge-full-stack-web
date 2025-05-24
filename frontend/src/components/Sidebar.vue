<template>
  <v-navigation-drawer permanent app>
    <v-list-item class="px-4">
      <v-img src="/vite.svg" height="40" contain></v-img>
    </v-list-item>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item to="/students" router prepend-icon="mdi-account-multiple">
        <v-list-item-title>Alunos</v-list-item-title>
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
