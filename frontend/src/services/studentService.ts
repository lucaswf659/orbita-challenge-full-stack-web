import axios from "axios";

const API_URL = "http://localhost:5189/api/students";

export const fetchStudents = async (
  pageNumber: number = 1,
  pageSize: number = 10,
  search: string = ""
) => {
  const params: any = {
    pageNumber,
    pageSize,
  };

  if (search.trim() !== "") {
    params.search = search;
  }

  const { data } = await axios.get(API_URL, { params });
  return data;
};

export const fetchStudentById = async (id: string) => {
  const { data } = await axios.get(`${API_URL}/${id}`);
  return data;
};

export const saveStudent = async (student: any) => {
  if (student.id) {
    return axios.put(`${API_URL}/${student.id}`, student);
  }
  return axios.post(API_URL, student);
};

export const removeStudent = async (id: string) => {
  return axios.delete(`${API_URL}/${id}`);
};
