import { ref } from "vue";
import { useRouter } from "vue-router";
import { fetchStudents, removeStudent } from "@/services/studentService";
import { useStudentsStore } from "@/stores/students";
import type { Student } from "@/types/Student";

export function useStudentList() {
  const router = useRouter();
  const studentStore = useStudentsStore();

  const students = ref<Student[]>([]);
  const totalStudents = ref(0);
  const loading = ref(false);
  const search = ref("");
  const pageNumber = ref(1);
  const deleteDialog = ref(false);
  const selectedStudent = ref<Student | null>(null);
  const options = ref({ page: 1, itemPerPage: 10 });

  const toast = ref({
    show: false,
    message: "",
    color: "success" as "success" | "error",
  });
  const showToast = (
    message: string,
    color: "success" | "error" = "success"
  ) => {
    toast.value = { show: true, message, color };
  };

  const headers = [
    { title: "RA", key: "ra" },
    { title: "Nome", key: "name" },
    { title: "CPF", key: "cpf" },
    { title: "E-mail", key: "email" },
    { title: "Ações", key: "actions", sortable: false },
  ];

  async function fetchData(newOptions: { page: number; itemPerPage: number }) {
    loading.value = true;
    try {
      const page = newOptions.page;
      const itemsPerPage = newOptions.itemPerPage;
      const searchTerm = search.value.trim();
      const result = await fetchStudents(page, itemsPerPage, searchTerm);
      students.value = result.items;
      totalStudents.value = result.totalItems;
    } catch (err) {
      console.error("Error fetching data:", err);
      showToast("Erro ao buscar alunos", "error");
    } finally {
      loading.value = false;
    }
  }

  const goToCreate = () => {
    studentStore.Id = null;
    studentStore.Name = "";
    studentStore.Email = "";
    studentStore.RA = "";
    studentStore.CPF = "";
    router.push("/students/new");
  };

  const editStudent = (student: Student) => {
    studentStore.Name = student.name;
    studentStore.Email = student.email;
    studentStore.RA = student.ra ?? "";
    studentStore.CPF = student.cpf;
    studentStore.Id = student.id;
    router.push("/students/edit");
  };

  const confirmDelete = (student: Student) => {
    selectedStudent.value = student;
    deleteDialog.value = true;
  };

  const deleteStudent = async () => {
    if (!selectedStudent.value) return;
    try {
      await removeStudent(selectedStudent.value.id);
      showToast("Student deleted successfully.", "success");
      await fetchData(options.value);
    } catch (err) {
      console.error("Delete failed:", err);
      showToast("Failed to delete student.", "error");
    } finally {
      deleteDialog.value = false;
    }
  };

  const onSearch = async () => {
    pageNumber.value = 1;
    await fetchData(options.value);
  };

  const onClear = async () => {
    search.value = "";
    pageNumber.value = 1;
    await fetchData(options.value);
  };

  return {
    students,
    totalStudents,
    loading,
    search,
    pageNumber,
    deleteDialog,
    selectedStudent,
    toast,
    headers,
    options,
    fetchData,
    goToCreate,
    editStudent,
    confirmDelete,
    deleteStudent,
    onSearch,
    onClear,
  };
}
