import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const token = localStorage.getItem("Token");

const api = axios.create({
  baseURL: `${BASE_URL}/api`, // La URL base para todas las peticiones
  headers: {
    Authorization: `Token ${token}`,
    "Content-Type": "application/json", // Asegura que el tipo de contenido sea JSON por defecto
  },
});


interface MajorData {
  major_id: number;
}
export const getSubjectsByMajor = (data: MajorData) => api.post("/subjects/get-subjects-by-major/", data);

export const getSubject = (id: number) => api.get(`/subjects/${id}/`);
