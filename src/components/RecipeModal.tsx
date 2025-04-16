import React, { useContext, useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Button, TextField, Table,
  TableHead, TableBody, TableRow, TableCell,
  Checkbox, Box
} from "@mui/material";
import { Student, Attendance, ShortSubject } from "../types";
import useExcel from "../hooks/useExcel";
import axios from "axios";
import Form from "./Form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faTimes } from "@fortawesome/free-solid-svg-icons";
import MajorContext from "../contexts/MajorContext";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  data: Student[];
  shortSubject: ShortSubject;
  refresh: () => void;
};

function AttendanceModal({ isOpen, onClose, data, shortSubject, refresh }: Props) {
  const [checkedStudents, setCheckedStudents] = useState<Student[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [isPlaceVisible, setIsPlaceVisible] = useState(false);
  const [buttonText, setButtonText] = useState("Agregar Estudiantes");
  const [studentsList, setStudentsList] = useState<Student[]>([]);
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

    useExcel(attendanceData, ISODate, shortSubject, selectedMajor);

    setCheckedStudents([]);
    setSelectedDate("");
    onClose();
  };

  // Elimina la asignatura actual
  const handleDeleteSubject = async () => {
    const confirmDelete = window.confirm(
      `¿Estás seguro de que deseas eliminar la asignatura ${shortSubject.name}?`
    );
    if (!confirmDelete || !shortSubject.id) return;

    const token = localStorage.getItem("Token");
    try {
      const url = import.meta.env.VITE_API_URL + "/api/subjects";
      await axios.delete(`${url}/${shortSubject.id}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      cleanup();
      refresh();
    } catch (err) {
      console.error(err);
    }
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
        sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        Asistencia
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
          sx={{ mb: 2, bgcolor: "#3454D1", "&:hover": { bgcolor: "#2F4BC0" } }}
          onClick={handleTogglePlaceVisibility}
        >
          {buttonText}
        </Button>

        {isPlaceVisible && (
          <Form subjectId={shortSubject.id} onStudentAdded={handleStudentAdded} />
        )}

        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>¿Asistió?</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Rut</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>DV</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Segundo Nombre</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Apellido</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Segundo Apellido</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>Eliminar</TableCell>
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

      <DialogActions sx={{ justifyContent: "space-between", px: 3, py: 2 }}>
        <Button variant="contained" color="error" onClick={handleDeleteSubject}>
          Borrar
        </Button>
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            onClick={handleSubmitAttendance}
            sx={{ bgcolor: "#3454D1", "&:hover": { bgcolor: "#2F4BC0" } }}
          >
            descargar excel
          </Button>
          <Button
            variant="contained"
            onClick={onClose}
            sx={{ bgcolor: "#D1495B", "&:hover": { bgcolor: "#C43145" } }}
          >
            Cerrar
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

export default AttendanceModal;
