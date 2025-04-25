import React, { useContext, useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  Box,
  Input,
} from "@mui/material";
import { Student, Attendance, ShortSubject } from "../types";
import axios from "axios";
import Form from "./Form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faTimes } from "@fortawesome/free-solid-svg-icons";
import MajorContext from "../contexts/MajorContext";
import createExcel from "../hooks/createExcel";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  data: Student[];
  shortSubject: ShortSubject;
};

function AttendanceModal({ isOpen, onClose, data, shortSubject }: Props) {
  const [checkedStudents, setCheckedStudents] = useState<Student[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [isPlaceVisible, setIsPlaceVisible] = useState(false);
  const [buttonText, setButtonText] = useState("Agregar Estudiantes");
  const [studentsList, setStudentsList] = useState<Student[]>([]);
  const [section, setSection] = useState<string>("");
  const [classLink, setClassLink] = useState<string>("");
  const { selectedMajor } = useContext(MajorContext);

  // Reinicia la vista cada vez que se abre el modal
  useEffect(() => {
    if (isOpen) {
      setIsPlaceVisible(false);
      setButtonText("Agregar Estudiantes");
    }
  }, [isOpen]);

  // Refresca lista de estudiantes si cambia el prop `data`
  useEffect(() => {
    setStudentsList(data);
  }, [data]);

  // Maneja check/uncheck de estudiantes
  const handleCheckboxChange = (student: Student) => {
    setCheckedStudents((prevChecked) => {
      const exists = prevChecked.find((s) => s.id === student.id);
      return exists
        ? prevChecked.filter((s) => s.id !== student.id)
        : [...prevChecked, student];
    });
  };

  // Asigna la fecha seleccionada
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  // Genera y descarga archivo Excel con la asistencia
  const handleSubmitAttendance = () => {
    const currentDate = new Date();
    const ISODate = currentDate.toISOString();
    const attendanceData: Attendance = {
      fecha: selectedDate ? new Date(selectedDate).toISOString() : ISODate,
      students: checkedStudents,
    };

    createExcel(attendanceData, ISODate, shortSubject, selectedMajor, section, classLink);

    setSelectedDate("");
    setCheckedStudents([]);
    onClose();
    setClassLink("");
    setSection("");
    console.log("cleaning up")
  };

  // Alterna visibilidad del formulario para agregar estudiantes
  const handleTogglePlaceVisibility = () => {
    setIsPlaceVisible((prev) => !prev);
    setButtonText(isPlaceVisible ? "Agregar Estudiantes" : "Ocultar");
  };

  // Limpieza del modal al cerrarlo
  function cleanup() {
    setSelectedDate("");
    setCheckedStudents([]);
    setClassLink("");
    setSection("");
    onClose();
  }

  // Agrega nuevo estudiante a la lista visible
  const handleStudentAdded = (newStudent: Student) => {
    setStudentsList((prev) => [...prev, newStudent]);
  };

  // Elimina un estudiante individual
  const handleStudentDelete = async (student: Student) => {
    const confirmDelete = window.confirm(
      `¿Estás seguro de que deseas eliminar al estudiante ${student.first_name} ${student.last_name}?`
    );
    if (!confirmDelete || !student.id) return;

    const token = localStorage.getItem("Token");
    try {
      const url = import.meta.env.VITE_API_URL + "/api/students";
      await axios.delete(`${url}/${student.id}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      setStudentsList((prev) => prev.filter((s) => s.id !== student.id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={isOpen} onClose={cleanup} maxWidth="lg" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {shortSubject.name}
        <IconButton onClick={cleanup}>
          <FontAwesomeIcon icon={faTimes} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box mb={2}>
          <TextField
            type="date"
            fullWidth
            value={selectedDate}
            onChange={handleDateChange}
          />
        </Box>

        <Button
          variant="contained"
          sx={{
            mb: 2,
            bgcolor: "#3454D1",
            "&:hover": { bgcolor: "#2F4BC0" },
            fontSize: {
              xs: "0.75rem",
              sm: "0.875rem",
            },
          }}
          onClick={handleTogglePlaceVisibility}
        >
          {buttonText}
        </Button>

        {isPlaceVisible && (
          <Form
            subjectId={shortSubject.id}
            onStudentAdded={handleStudentAdded}
          />
        )}

        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                ¿Asistió?
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Rut</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>DV</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Segundo Nombre</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Apellido</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                Segundo Apellido
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Eliminar
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {studentsList.map((student) => (
              <TableRow key={student.id}>
                <TableCell align="center">
                  <Checkbox
                    checked={checkedStudents.some((s) => s.id === student.id)}
                    onChange={() => handleCheckboxChange(student)}
                    sx={{ "&.Mui-checked": { color: "green" } }}
                  />
                </TableCell>
                <TableCell>{student.rut}</TableCell>
                <TableCell>{student.dv}</TableCell>
                <TableCell>{student.first_name}</TableCell>
                <TableCell>{student.second_name}</TableCell>
                <TableCell>{student.last_name}</TableCell>
                <TableCell>{student.second_last_name}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleStudentDelete(student)}>
                    <FontAwesomeIcon icon={faTrash} color="#e53935" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between", p: 2, gap: 1 }}>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Input
            onChange={(e) => setSection(e.currentTarget.value)}
            sx={{
              bgcolor: "#f5f5f5",

              "&:hover": { bgcolor: "#e0e0e0" },
              fontSize: {
                xs: "0.3rem",
                sm: "0.75rem",
              },
              px: 2,
              py: 1,
              textAlign: "center",
              "& input::placeholder": {
                textAlign: "center",
              },
            }}
            placeholder="Sección (Opcional)"
          >
          </Input>
          <Input
            onChange={(e) => setClassLink(e.currentTarget.value)}
            sx={{
              bgcolor: "#f5f5f5",

              "&:hover": { bgcolor: "#e0e0e0" },
              fontSize: {
                xs: "0.3rem",
                sm: "0.75rem",
              },
              px: 2,
              py: 1,
            }}
            placeholder="Link de la Clase (Opcional)"
          >
          </Input>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Button
            variant="contained"
            onClick={handleSubmitAttendance}
            sx={{
              bgcolor: "#3454D1",
              "&:hover": { bgcolor: "#2F4BC0" },
              fontSize: {
                xs: "0.6rem",
                sm: "0.875rem",
              },
            }}
          >
            descargar excel
          </Button>
          <Button
            variant="contained"
            onClick={onClose}
            sx={{
              bgcolor: "#D1495B",
              "&:hover": { bgcolor: "#C43145" },
              fontSize: {
                xs: "0.6rem",
                sm: "0.875rem",
              },
            }}
          >
            Cerrar
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
}

export default AttendanceModal;
