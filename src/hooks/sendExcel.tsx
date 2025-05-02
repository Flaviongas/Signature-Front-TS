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


  async function sendEmail() {
    const { filename, blob } = await generateExcel(asistenciaData, ISODate, shortSubject, selectedMajors, section, classLink, comment);
    const formData = new FormData();
    formData.append("file", blob);
    formData.append("filename", filename);
    formData.append("email", email);
    axios.post('/sendEmailExcel', formData)
    // TODO: Create backend route
  }

  sendEmail();
}
