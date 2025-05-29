<template>
  <div>
    <v-list density="compact" nav>
      <v-list-item to="/students" router prepend-icon="mdi-account-multiple">
        <v-list-item-title>Estudantes</v-list-item-title>
      </v-list-item>
    </v-list>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.v-navigation-drawer {
  background-color: #f0f0f0;
  width: 240px;
}
</style>
