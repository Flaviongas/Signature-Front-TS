import axios from "axios";
import { Attendance, ShortSubject } from "../types";
import generateExcel from "./generateExcel";
export default function sendExcel(
  asistenciaData: Attendance,
  ISODate: string,
  shortSubject: ShortSubject,
  selectedMajors: { id: number; name: string },
  section: string,
  classLink: string,
  comment: string,
  email: string,
) {
  const token = localStorage.getItem("Token");
  const BASE_URL = import.meta.env.VITE_API_URL
  const api = axios.create({
    baseURL: `${BASE_URL}/`,
    headers: {
      Authorization: `Token ${token}`,
    },
  });


  async function sendEmail() {
    const { filename, blob } = await generateExcel(asistenciaData, ISODate, shortSubject, selectedMajors, section, classLink, comment);
    const formData = new FormData();
    formData.append("file", blob);
    formData.append("filename", filename);
    formData.append("email", email);
    formData.append("subject", shortSubject.name)
    console.log("formData: ", formData);
    api.post('sendEmail/', formData)
  }

  sendEmail();
}
