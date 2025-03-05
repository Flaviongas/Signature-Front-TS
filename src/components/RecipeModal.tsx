import React from "react";
import * as FileSaver from "file-saver";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import { Student, Asistencia, ShortSubject } from "../types";
import { useContext, useEffect, useState } from "react";

import axios from "axios";
import Form from "./Form";
import * as ExcelJS from "exceljs";
import MajorContext from "../contexts/MajorContext";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  data: Student[];
  shortSubject: ShortSubject;
};

function RecipeModal({ isOpen, onClose, data, shortSubject }: Props) {
  const [checkedStudents, setCheckedStudents] = useState<Student[]>([]);
  const { selectedMajors } = useContext(MajorContext);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [place, setPlace] = useState(false);
  const [textBoton, setTextBoton] = useState<String>("Agregar Estudiantes");
  const [students, setStudents] = useState<Student[]>([]);
  useEffect(() => {
    if (isOpen) {
      setPlace(false);
      setTextBoton("Agregar Estudiante");
    }
  }, [isOpen]);
  useEffect(() => {
    console.log("Checked students:", checkedStudents);
  }, [checkedStudents]);

  useEffect(() => {
    setStudents(data);
  }, [data]);

  const handleCheckboxChange = (student: Student) => {
    setCheckedStudents((prev) => {
      const exists = prev.find((s) => s.id === student.id);
      if (exists) {
        return prev.filter((s) => s.id !== student.id);
      } else {
        return [...prev, student];
      }
    });
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  const handleSubmit = () => {
    const currentDate = new Date();
    const DAYS = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];
    const ISODate = currentDate.toISOString();
    const asistenciaData: Asistencia = {
      fecha: selectedDate ? new Date(selectedDate).toISOString() : ISODate,
      Students: checkedStudents,
    };
    console.log("Asistencia data:", asistenciaData);
    const headers = [
      "FECHA",
      "RUT (sin puntos)",
      "DV",
      "NOMBRES",
      "APELLIDOS",
      "SECCIÓN",
      "ASIGNATURA (Nombre de malla curricular) / NIVEL",
    ];
    async function exportJsonToExcel() {
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
    exportJsonToExcel();

    setCheckedStudents([]);
    setSelectedDate("");
    onClose();
  };

  const handleDelete = async () => {
    if (!shortSubject.id) {
      setError("No se ha seleccionado ninguna asignatura para eliminar.");
      return;
    }

    try {
      await axios.delete(
        `https://signature.gidua.xyz/api/subjects/${shortSubject.id}/`
      );
      setError(null);
      cleanup();
    } catch (err) {
      setError("Error al eliminar la asignatura");
      console.error(err);
    }
  };
  const handlePlace = () => {
    if (place) {
      setPlace(false);
      setTextBoton("Agregar Estudiantes");
    } else {
      setPlace(true);
      setTextBoton("Ocultar");
    }
  };
  function cleanup() {
    setSelectedDate("");
    setCheckedStudents([]);
    onClose();
  }

  const handleStudentAdded = (newStudent: Student) => {
    console.log("Nuevo estudiante agregado:", newStudent);
    setStudents((prevStudents) => [...prevStudents, newStudent]);
  };

  return (
    <Modal isOpen={isOpen} onClose={cleanup} size="6x1">
      <ModalOverlay />
      <ModalContent maxW="70vw">
        <ModalHeader>Asistencia</ModalHeader>
        <ModalCloseButton />
        <ModalBody maxHeight="70vh" overflowY="auto">
          <input
            type="date"
            className="form-control mb-3"
            value={selectedDate}
            id="date-input"
            name="selectedDate"
            onChange={handleDateChange}
          />
          <Button onClick={handlePlace}>{textBoton}</Button>

          {place ? (
            <Form
              subjectId={shortSubject.id}
              onStudentAdded={handleStudentAdded}
            ></Form>
          ) : (
            ""
          )}
          <table className="table">
            <thead>
              <tr className="text-center">
                <th className="text-center" scope="col">
                  Asistencia
                </th>
                <th scope="col">Rut</th>
                <th scope="col">DV</th>
                <th scope="col">Nombre</th>
                <th scope="col">Segundo Nombre</th>
                <th scope="col">Apellido</th>
                <th scope="col">Segundo Apellido</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td className="text-center">
                    <input
                      key={student.id}
                      className="form-check-input"
                      type="checkbox"
                      checked={checkedStudents.some((s) => s.id === student.id)}
                      onChange={() => handleCheckboxChange(student)}
                    />
                  </td>
                  <td>{student.rut}</td>
                  <td>{student.dv}</td>
                  <td>{student.first_name}</td>
                  <td>{student.second_name}</td>
                  <td>{student.last_name}</td>
                  <td>{student.second_last_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ModalBody>
        <ModalFooter className="w-full flex">
          <div className="flex-1 ">
            <Button bg={"red"} color={"white"} onClick={handleDelete}>
              Borrar
            </Button>
          </div>
          <div className="flex gap-3">
            <Button colorScheme="blue" onClick={handleSubmit}>
              Enviar Asistencia
            </Button>
            <Button ml={3} onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default RecipeModal;
