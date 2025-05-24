import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

import StudentList from "@/pages/StudentList.vue";
import StudentForm from "@/pages/StudentForm.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/students",
  },
  {
    path: "/students",
    name: "StudentList",
    component: StudentList,
  },
  {
    path: "/students/new",
    name: "StudentCreate",
    component: StudentForm,
  },
  {
    path: "/students/edit/:id",
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
