import axios from "axios";
import { BASE_URL } from "./config";

const token = localStorage.getItem("Token");

export const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    Authorization: `Token ${token}`,
  },
});
