import axios from "axios";
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  fetchStudents,
  fetchStudentById,
  saveStudent,
  removeStudent,
} from "@/services/studentService";

vi.mock("axios");
const mockedAxios = axios as unknown as {
  get: ReturnType<typeof vi.fn>;
  post: ReturnType<typeof vi.fn>;
  put: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
};

describe("studentService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetchStudents deve fazer GET com paginação e search", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { items: [], total: 0 } });

    const result = await fetchStudents(2, 5, "lucas");

    expect(mockedAxios.get).toHaveBeenCalledWith(
      "http://localhost:5189/api/students",
      {
        params: { pageNumber: 2, pageSize: 5, search: "lucas" },
      }
    );

    expect(result).toEqual({ items: [], total: 0 });
  });

  it("fetchStudents deve fazer GET sem search", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: "ok" });

    const result = await fetchStudents(1, 10, "   "); // search vazio

    expect(mockedAxios.get).toHaveBeenCalledWith(
      "http://localhost:5189/api/students",
      {
        params: { pageNumber: 1, pageSize: 10 },
      }
    );

    expect(result).toBe("ok");
  });

  it("fetchStudentById deve fazer GET por ID", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { id: 123 } });

    const result = await fetchStudentById("123");

    expect(mockedAxios.get).toHaveBeenCalledWith(
      "http://localhost:5189/api/students/123"
    );
    expect(result).toEqual({ id: 123 });
  });

  it("saveStudent deve fazer POST se não tiver ID", async () => {
    const student = { Name: "Lucas" };
    mockedAxios.post.mockResolvedValueOnce({ data: { id: 1 } });

    const result = await saveStudent(student);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      "http://localhost:5189/api/students",
      student
    );
    expect(result.data).toEqual({ id: 1 });
  });

  it("saveStudent deve fazer PUT se tiver ID", async () => {
    const student = { Id: 5, Name: "Lucas" };
    mockedAxios.put.mockResolvedValueOnce({ data: "ok" });

    const result = await saveStudent(student);

    expect(mockedAxios.put).toHaveBeenCalledWith(
      "http://localhost:5189/api/students/5",
      student
    );
    expect(result.data).toBe("ok");
  });

  it("removeStudent deve fazer DELETE", async () => {
    mockedAxios.delete.mockResolvedValueOnce({ data: true });

    const result = await removeStudent("999");

    expect(mockedAxios.delete).toHaveBeenCalledWith(
      "http://localhost:5189/api/students/999"
    );
    expect(result.data).toBe(true);
  });
});
