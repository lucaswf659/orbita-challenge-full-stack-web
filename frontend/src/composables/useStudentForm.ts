import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { saveStudent } from "@/services/studentService";
import { useStudentsStore } from "@/stores/students";

export function useStudentForm() {
  const router = useRouter();
  const route = useRoute();
  const studentStore = useStudentsStore();

  const formRef = ref();
  const form = ref<{
    Id?: number | null;
    Name: string;
    Email: string;
    CPF: string;
  }>({
    Id: studentStore.Id,
    Name: studentStore.Name,
    Email: studentStore.Email,
    CPF: studentStore.CPF,
  });

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

  const required = (value: string) =>
    (!!value && value.trim() !== "") || "Campo obrigatório";

  const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value) || "E-mail inválido";
  };

  const validateCpf = (value: string) => {
    const regex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    return regex.test(value) || "CPF inválido";
  };

  const isEditRoute = () => route.name === "StudentEdit";

  const checkStudentContext = () => {
    if (isEditRoute() && !studentStore.Id) {
      showToast("Estudante não encontrado. Redirecionando...", "error");
      router.push("/students");
    }
  };

  const save = async () => {
    const { valid } = await formRef.value.validate();
    if (!valid) return;

    try {
      const payload = { ...form.value };
      if (!payload.Id) delete payload.Id;

      await saveStudent(payload);

      showToast(
        payload.Id
          ? "Estudante atualizado com sucesso."
          : "Estudante cadastrado com sucesso.",
        "success"
      );

      setTimeout(() => router.push("/students"), 500);
    } catch (err) {
      showToast("Erro ao salvar estudante.", "error");
    }
  };

  return {
    formRef,
    form,
    toast,
    showToast,
    required,
    validateEmail,
    validateCpf,
    checkStudentContext,
    save,
  };
}
