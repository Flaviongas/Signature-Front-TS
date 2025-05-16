import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const token = localStorage.getItem("Token");

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    Authorization: `Token ${token}`,
  },
});

interface SubjectData {
    student_id: string;
    subjectId: string;
}

interface UpdateData {
    student_id: string;
    current_subject_id: string;
    new_subject_id: string;
}

interface MajorData {
  major_id: number;
}

interface StudentData {
  first_name: string;
  second_name: string;
  last_name: string;
  second_last_name: string;
  rut: string;
  dv: string;
  major_id: number;
}

interface UpdateStudentData {
  id: number;
  first_name: string;
  second_name: string;
  last_name: string;
  second_last_name: string;
  rut: string;
  dv: string;
  major_id: number;
}

interface DeleteStudentData{
  student_id: number;
}

// Operaciones existentes
export const addSubject = (data: SubjectData) => api.post(`/students/add-subject/`, data);
export const updateSubject = (data: UpdateData) => api.put(`/students/update-subject/`, data);
export const deleteSubject = (data: SubjectData) => api.delete(`/students/remove-subject/`, { data });


// Nuevas operaciones para la gestión de estudiantes
export const getStudentsByMajor = (data: MajorData) => api.post('/students/get-student-bymajor/', data);
export const createStudent = (data: StudentData) => api.post('/students/create-student', data);
export const updateStudent = (data: UpdateStudentData) => api.put(`/students/update-student/`, data);
export const deleteStudent = (data: DeleteStudentData) => api.delete(`/students/delete-student/`, { data });