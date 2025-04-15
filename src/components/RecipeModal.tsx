import React, { useContext } from "react";

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
} from "@mui/material";
import { Student, Attendance, ShortSubject } from "../types";
import { useEffect, useState } from "react";
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

function RecipeModal({ isOpen, onClose, data, shortSubject, refresh }: Props) {
  const [checkedStudents, setCheckedStudents] = useState<Student[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [place, setPlace] = useState(false);
  const [textBoton, setTextBoton] = useState<string>("Agregar Estudiantes");
  const [students, setStudents] = useState<Student[]>([]);
  const { selectedMajors } = useContext(MajorContext);
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

  const HandleSubmit = () => {
    const currentDate = new Date();
    const ISODate = currentDate.toISOString();
    const asistenciaData: Attendance = {
      fecha: selectedDate ? new Date(selectedDate).toISOString() : ISODate,
      Students: checkedStudents,
    };
    console.log("Asistencia data:", asistenciaData);
    console.log("ShortSubject:", shortSubject);
    useExcel(asistenciaData, ISODate, shortSubject, selectedMajors);

    setCheckedStudents([]);
    setSelectedDate("");
    onClose();
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `¿Estás seguro de que deseas eliminar la asignatura ${shortSubject.name}?`
    );

    if (!confirmDelete) {
      return;
    }
    if (!shortSubject.id) {
      return;
    }
    const token = localStorage.getItem("Token");

    try {
      const url = import.meta.env.VITE_API_URL + "/api/subjects";
      await axios.delete(`${url}/${shortSubject.id}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      cleanup();
      refresh();
    } catch (err) {
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

  const handleStudentDelete = async (student: Student) => {
    const confirmDelete = window.confirm(
      `¿Estás seguro de que deseas eliminar al estudiante ${student.first_name} ${student.last_name}?`
    );

    if (!confirmDelete) {
      return;
    }

    console.log(student.id);
    if (!student.id) {
      return;
    }

    const token = localStorage.getItem("Token");
    try {
      const url = import.meta.env.VITE_API_URL + "/api/students";
      await axios.delete(`${url}/${student.id}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setStudents((prevStudents) =>
        prevStudents.filter((s) => s.id !== student.id)
      );
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
        Attendance
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
            "&:hover": {
              bgcolor: "#2F4BC0",
            },
          }}
          onClick={handlePlace}
        >
          {textBoton}
        </Button>

        {place && (
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
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell align="center">
                  <Checkbox
                    checked={checkedStudents.some((s) => s.id === student.id)}
                    onChange={() => handleCheckboxChange(student)}
                    sx={{
                      "&.Mui-checked": {
                        color: "green",
                      },
                    }}
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
        <Button variant="contained" color="error" onClick={handleDelete}>
          Borrar
        </Button>
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            onClick={HandleSubmit}
            sx={{
              bgcolor: "#3454D1",
              "&:hover": {
                bgcolor: "#2F4BC0",
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
              "&:hover": {
                bgcolor: "#C43145",
              },
            }}
          >
            Cerrar
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

export default RecipeModal;
