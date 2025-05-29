import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const token = localStorage.getItem("Token");

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    Authorization: `Token ${token}`,
    
  },
});

export const getSubject = (id: number) => api.get(`/subjects/${id}/`);
export const deleteSubject = (id: number) => api.delete(`/subjects/${id}/`);