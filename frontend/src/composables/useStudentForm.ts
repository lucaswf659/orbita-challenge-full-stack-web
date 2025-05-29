import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { saveStudent } from "@/services/studentService";
import { useStudentsStore } from "@/stores/students";

function isValidCpf(cpf: string): boolean {
  cpf = cpf.replace(/[^\d]+/g, "");

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = 11 - (soma % 11);
  let digito1 = resto >= 10 ? 0 : resto;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = 11 - (soma % 11);
  let digito2 = resto >= 10 ? 0 : resto;

  return (
    parseInt(cpf.charAt(9)) === digito1 && parseInt(cpf.charAt(10)) === digito2
  );
}

export function formatCpf(cpf: string): string {
  const numbers = cpf.replace(/\D/g, "").slice(0, 11);

  return numbers
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
}

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
    if (!value) return true;
    return isValidCpf(value) || "CPF inválido";
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

      payload.CPF = formatCpf(payload.CPF);

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
    formatCpf,
    checkStudentContext,
    save,
  };
}
