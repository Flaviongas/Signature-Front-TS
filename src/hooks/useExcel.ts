import * as FileSaver from "file-saver";
import * as ExcelJS from "exceljs";
import { Attendance, ShortSubject } from "../types";
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
    "RUT (sin puntos)",
    "DV",
    "NOMBRES",
    "APELLIDOS",
    "SECCIÓN",
    "ASIGNATURA (Nombre de malla curricular) / NIVEL",
];
export default function useExcel(asistenciaData: Attendance, ISODate: string, shortSubject: ShortSubject, selectedMajors: { id: number, name: string }) {
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
    ["A1", "B1", "C1", "D1", "E1", "F1", "G1"].map((key) => {
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

    asistenciaData.Students.forEach((student) => {
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
            SECCIÓN: "1",
            ASIGNATURA_Nombre_de_malla_curricular__NIVEL:
                shortSubject?.name.toUpperCase(),
        });
    });
    worksheet.columns.forEach((column) => {
        if (!column.values) return null;
        const lengths = column.values.map((v) =>
            v ? v.toString().length + 7 : 0
        );
        const maxLength = Math.max(
            ...lengths.filter((v) => typeof v === "number")
        );
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

    async function generateExcel() {

        const buffer = await workbook.xlsx.writeBuffer();
        const weekday_number = new Date(asistenciaData.fecha).getDay();
        const weekday = DAYS[weekday_number];
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        FileSaver.saveAs(
            blob,
            `REGISTROS DE ASISTENCIA - SAAC ( ${weekday
                .toString()
                .toUpperCase()} ${ISODate.split("T")[0]
                    .split("-")
                    .reverse()
                    .join("-")
                    .slice(0, 5)} ${selectedMajors.name} ).xlsx`
        );
    }
    generateExcel()
}
