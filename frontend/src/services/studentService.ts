import axios from "axios";

const API_URL = "http://localhost:5189/api/students";

export const fetchStudents = async () => {
  const { data } = await axios.get(API_URL);
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
