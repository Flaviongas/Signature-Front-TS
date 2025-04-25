import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
// const API_URL = `${BASE_URL}/api/users/`;
const token = localStorage.getItem("Token");
console.log(token);

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    Authorization: `Token ${token}`,
  },
});

export const getUsers = () => api.get("/users/");
export const getUser = (id: number) => api.get(`/users/${id}/`);
export const createUser = (data: any) => api.post("/users/", data);
export const updateUser = (id: number, data: any) =>
  api.put(`/users/${id}/`, data);
export const deleteUser = (id: number) => api.delete(`/users/${id}/`);
