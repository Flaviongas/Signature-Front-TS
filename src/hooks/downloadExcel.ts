import * as FileSaver from "file-saver";
import { Attendance, ShortSubject } from "../types";
import generateExcel from "./generateExcel";

export default function downloadExcel(
  asistenciaData: Attendance,
  ISODate: string,
  shortSubject: ShortSubject,
  selectedMajors: { id: number; name: string },
  section: string,
  classLink: string,
  comment: string
) {

  const savExcel = async () => {
    const { filename, blob } = await generateExcel(asistenciaData, ISODate, shortSubject, selectedMajors, section, classLink, comment);
    FileSaver.saveAs(
      blob,
      filename,
    );
  }
  savExcel();
}
