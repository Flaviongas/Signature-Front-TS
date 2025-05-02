import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import { Attendance, ShortSubject, Student } from "../types";
const DAYS = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];
const headers = [
  "FECHA",
  "RUT",
  "DV",
  "NOMBRES",
  "APELLIDOS",
  "SECCIÓN",
  "ASIGNATURA/ NIVEL",
  "LINK DE CLASE",
  "COMENTARIO",
];

type rowData = {
  FECHA: string;
  RUT_sin_puntos: string;
  DV: string;
  NOMBRES: string;
  APELLIDOS: string;
  SECCIÓN: string;
  ASIGNATURA_Nombre_de_malla_curricular__NIVEL: string;
  LINK_DE_CLASE: string;
  COMENTARIO: string;
}
export default function previewExcel(
  asistenciaData: Attendance,
  ISODate: string,
  shortSubject: ShortSubject,
  selectedMajors: { id: number; name: string },
  section: string,
  classLink: string,
  comment: string
) {
  console.log("asistenciaData", asistenciaData);

  const data: rowData[] = [];
  asistenciaData.students.forEach((student: Student) => {
    const rowData = {
      FECHA: asistenciaData.fecha
        .split("T")[0]
        .replaceAll("-", "/")
        .split("/")
        .reverse()
        .join("/"),
      RUT_sin_puntos: student.rut.toString(),
      DV: student.dv,
      NOMBRES: student.first_name + " " + student.second_name,
      APELLIDOS: student.last_name + " " + student.second_last_name,
      SECCIÓN: section ? section : "1",
      ASIGNATURA_Nombre_de_malla_curricular__NIVEL:
        shortSubject?.name.toUpperCase(),
      LINK_DE_CLASE: classLink ? classLink : "",
      COMENTARIO: comment ? comment : "",
    };

    data.push(rowData);
  });

  const weekday_number = new Date(asistenciaData.fecha).getDay();
  const weekday = DAYS[weekday_number];
  const title = `REGISTROS DE ASISTENCIA - SAAC (${weekday
    .toString()
    .toUpperCase()} ${ISODate.split("T")[0]
      .split("-")
      .reverse()
      .join("-")
      .slice(0, 5)} ${selectedMajors.name})`;

  const doc = new jsPDF({
    orientation: 'landscape'
  });

  doc.setFontSize(14);
  doc.setTextColor(40);
  doc.text(title, 14, 15);
  doc.setFontSize(18);
  doc.setTextColor(255, 0, 0);
  doc.text("NO DESCARGAR - SOLO PARA PREVISUALIZACIÓN", 14, 8);

  const pdfHeaders = headers;
  const tableData = data.map(row => [
    row.FECHA,
    row.RUT_sin_puntos,
    row.DV,
    row.NOMBRES,
    row.APELLIDOS,
    row.SECCIÓN,
    row.ASIGNATURA_Nombre_de_malla_curricular__NIVEL,
    row.LINK_DE_CLASE,
    row.COMENTARIO
  ]);

  autoTable(doc, {
    head: [pdfHeaders],
    body: tableData,
    startY: 20,
    styles: {
      fontSize: 8,
      cellPadding: 1,
      overflow: 'linebreak',
      font: 'helvetica'
    },
    headStyles: {
      fillColor: [192, 0, 0],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { cellWidth: 18 },
      1: { cellWidth: 20 },
      2: { cellWidth: 8 },
      3: { cellWidth: 35 },
      4: { cellWidth: 35 },
      5: { cellWidth: 20 },
      6: { cellWidth: 45 },
      7: { cellWidth: 40 }
    }
  });

  const pdfUrl = doc.output('bloburl');
  window.open(pdfUrl.toString(), '_blank');

}
