import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import * as ExcelJS from "exceljs";
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
};
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
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("ASISTENCIA");

  worksheet.columns = headers.map((header_name) => ({
    header: header_name,
    key: header_name
      .replaceAll(" ", "_")
      .replace("(", "")
      .replace(")", "")
      .replace("/", ""),
  }));
  ["A1", "B1", "C1", "D1", "E1", "F1", "G1", "H1"].map((key) => {
    worksheet.getCell(key).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "c00000" },
    };
    worksheet.getCell(key).font = {
      color: { argb: "FFFFFF" },
      bold: true,
    };
  });

  asistenciaData.students.forEach((student: Student) => {
    worksheet.addRow({
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
    });
  });
  worksheet.columns.forEach((column) => {
    if (!column.values) return null;
    const lengths = column.values.map((v) => (v ? v.toString().length + 7 : 0));
    const maxLength = Math.max(...lengths.filter((v) => typeof v === "number"));
    column.width = maxLength;
  });
  workbook.eachSheet((sheet) => {
    sheet.eachRow((row) => {
      row.eachCell((cell) => {
        if (!cell.font?.size) {
          cell.font = Object.assign(cell.font || {}, { size: 11 });
        }
        if (!cell.font?.name) {
          cell.font = Object.assign(cell.font || {}, {
            name: "Century Gothic",
          });
        }
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });
  });
  const pdfData: rowData[] = [];
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

    worksheet.addRow(rowData);
    pdfData.push(rowData);
  });

  async function generatePreview() {
    const weekday_number = new Date(asistenciaData.fecha).getDay();
    const weekday = DAYS[weekday_number];
    const filename = `REGISTROS DE ASISTENCIA - SAAC (${weekday
      .toString()
      .toUpperCase()} ${ISODate.split("T")[0]
      .split("-")
      .reverse()
      .join("-")
      .slice(0, 5)} ${selectedMajors.name})`;

    generatePdfPreview(pdfData, filename);
  }

  function generatePdfPreview(data: rowData[], title: string) {
    const doc = new jsPDF({
      orientation: "landscape",
    });

    doc.setFontSize(14);
    doc.setTextColor(40);
    doc.text(title, 14, 15);
    doc.setFontSize(18);
    doc.setTextColor(255, 0, 0);
    doc.text("NO DESCARGAR - SOLO PARA PREVISUALIZACIÓN", 14, 8);

    const pdfHeaders = headers;
    const tableData = data.map((row) => [
      row.FECHA,
      row.RUT_sin_puntos,
      row.DV,
      row.NOMBRES,
      row.APELLIDOS,
      row.SECCIÓN,
      row.ASIGNATURA_Nombre_de_malla_curricular__NIVEL,
      row.LINK_DE_CLASE,
      row.COMENTARIO,
    ]);

    autoTable(doc, {
      head: [pdfHeaders],
      body: tableData,
      startY: 20,
      theme: "grid",
      styles: {
        fontSize: 8,
        cellPadding: 2,
        overflow: "linebreak",
        font: "helvetica",
      },
      headStyles: {
        fillColor: [192, 0, 0],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 18 },
        1: { cellWidth: 20 },
        2: { cellWidth: 8 },
        3: { cellWidth: 35 },
        4: { cellWidth: 35 },
        5: { cellWidth: 20 },
        6: { cellWidth: 45 },
        7: { cellWidth: 40 },
      },
    });

    const pdfUrl = doc.output("bloburl");
    window.open(pdfUrl.toString(), "_blank");
  }

  generatePreview();
}
