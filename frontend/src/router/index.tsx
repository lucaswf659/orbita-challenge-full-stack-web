import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

import StudentList from "@/pages/StudentList.vue";
import StudentForm from "@/pages/StudentForm.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/alunos",
  },
  {
    path: "/alunos",
    name: "StudentList",
    component: StudentList,
  },
  {
    path: "/alunos/novo",
    name: "StudentCreate",
    component: StudentForm,
  },
  {
    path: "/alunos/:id/editar",
    name: "StudentEdit",
    component: StudentForm,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
