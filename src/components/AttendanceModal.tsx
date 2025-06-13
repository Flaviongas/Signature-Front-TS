import React, { useContext, useEffect, useState } from "react";
import { z } from "zod";
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
  Snackbar,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Student, Attendance, ShortSubject } from "../types";
import Form from "./Form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import MajorContext from "../contexts/MajorContext";
import previewExcel from "../hooks/previewExcel";
import downloadExcel from "../hooks/downloadExcel";
import sendExcel from "../hooks/sendExcel";
import theme from "../theme.ts";
import buttonClickEffect from "../styles/buttonClickEffect.ts";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  data: Student[];
  shortSubject: ShortSubject;
};

function AttendanceModal({ isOpen, onClose, data, shortSubject }: Props) {
  const getCurrentDate = (): string => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const localDate = new Date(today.getTime() - offset * 60000);
    return localDate.toISOString().split("T")[0];
  };

  const [checkedStudents, setCheckedStudents] = useState<Student[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(getCurrentDate());
  const [isPlaceVisible, setIsPlaceVisible] = useState(false);
  const [studentsList, setStudentsList] = useState<Student[]>([]);
  const [section, setSection] = useState<string>("");
  const [classLink, setClassLink] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const { selectedMajor } = useContext(MajorContext);

  // Estados para feedback
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Verifica un correo estandar
  //
  const isValidEmail = (email: string) => {
    const emailSchema = z.string().email();
    const isValid = emailSchema.safeParse(email);
    return isValid.success;
  };

  // Reinicia la vista cada vez que se abre el modal
  useEffect(() => {
    if (isOpen) {
      setIsPlaceVisible(false);
      setSelectedDate(getCurrentDate()); // Actualiza la fecha cuando se abre el modal
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

  const dataExcel = () => {
    const currentDate = new Date();
    const ISODate = currentDate.toISOString();
    const attendanceData: Attendance = {
      fecha: selectedDate ? new Date(selectedDate).toISOString() : ISODate,
      students: checkedStudents,
    };
    return { attendanceData: attendanceData, ISODate: ISODate };
  };

  const areStudentsChecked = () => {
    if (checkedStudents.length === 0) {
      setErrorMessage("Debes seleccionar al menos un estudiante.");
      setOpenSnackbar(true);
      return false;
    }
    return true;
  };

  const sendEmail = async () => {
    if (!areStudentsChecked()) return;
    const { attendanceData, ISODate } = dataExcel();
    setLoading(true);
    setErrorMessage("");
    await new Promise((res) => setTimeout(res, 1000)); // ELIMINAR EL SERVIDOR REAL, YA QUE EN LOCAL ES TAN RAPIDO QUE SE DEBIO SIMULAR UN RETRASO PARA OBSERVAR EL FEEDBACK DEL BOTON QUE ENVIA EL EMAIL

    try {
      await sendExcel(
        attendanceData,
        ISODate,
        shortSubject,
        selectedMajor,
        section,
        classLink,
        comment,
        email
      );
      setSuccessMessage("Correo enviado correctamente");
      setEmail("");
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        "Error al enviar el correo. Intenta de nuevo.";

      setErrorMessage(msg);
    } finally {
      setLoading(false);
      setOpenSnackbar(true);
    }
  };

  const previewAttendance = () => {
    const { attendanceData, ISODate } = dataExcel();
    previewExcel(
      attendanceData,
      ISODate,
      shortSubject,
      selectedMajor,
      section,
      classLink,
      comment
    );
  };

  // Genera y descarga archivo Excel con la asistencia
  const handleSubmitAttendance = () => {
    const { attendanceData, ISODate } = dataExcel();
    if (!areStudentsChecked()) return;
    downloadExcel(
      attendanceData,
      ISODate,
      shortSubject,
      selectedMajor,
      section,
      classLink,
      comment
    );

    setSelectedDate("");
    setCheckedStudents([]);
    onClose();
    setClassLink("");
    setSection("");
    setComment("");
  };

  // Alterna visibilidad del formulario para agregar estudiantes

  // Limpieza del modal al cerrarlo
  function cleanup() {
    setCheckedStudents([]);
    setClassLink("");
    setSection("");
    onClose();
  }

  // Agrega nuevo estudiante a la lista visible
  const handleStudentAdded = (newStudent: Student) => {
    setStudentsList((prev) => [...prev, newStudent]);
  };

  return (
    <Dialog open={isOpen} onClose={cleanup} maxWidth="xl" fullWidth>
      <DialogTitle
        sx={{
          bgcolor: "secondary.main",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {shortSubject.name}
        <IconButton onClick={cleanup} color="inherit" aria-label="close">
          <CloseIcon />
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
                Asistió
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Rut</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>DV</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Segundo Nombre</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Apellido</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                Segundo Apellido
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between", p: 2, gap: 1 }}>
        <Box sx={{ display: "flex", gap: "1rem" }}>
          <Input
            onKeyDown={(event) => {
              if (!/[0-9]/.test(event.key)) {
                event.preventDefault();
              }
            }}
            onChange={(e) => setSection(e.currentTarget.value)}
            sx={{
              bgcolor: "#f5f5f5",

              "&:hover": { bgcolor: "#e0e0e0" },
              fontSize: {
                xs: "0.3rem",
                sm: "0.75rem",
              },
              width: "100px",
              px: 2,
              py: 1,
              textAlign: "center",
              "& input::placeholder": {
                textAlign: "center",
              },
            }}
            placeholder="Sección"
          ></Input>
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
            placeholder="Link de la Clase"
          ></Input>
          <Input
            onChange={(e) => setComment(e.currentTarget.value)}
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
            placeholder="Comentario"
          ></Input>
        </Box>
        <Box sx={{ display: "flex", gap: "1rem" }}>
          <Input
            value={email}
            disabled={loading}
            placeholder="Enviar por correo"
            onChange={(e) => setEmail(e.currentTarget.value)}
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
          ></Input>
          <Button
            color="secondary"
            variant="contained"
            loading={loading}
            disabled={
              loading || !isValidEmail(email) || checkedStudents.length === 0
            }
            onClick={sendEmail}
            sx={{
              fontSize: {
                xs: "0.6rem",
                sm: "0.875rem",
              },
              ...buttonClickEffect,
            }}
          >
            <FontAwesomeIcon icon={faEnvelope} />
          </Button>
          <Button
            variant="contained"
            onClick={previewAttendance}
            color="secondary"
            sx={{
              fontSize: {
                xs: "0.6rem",
                sm: "0.875rem",
              },
              ...buttonClickEffect,
            }}
          >
            Previsualizar
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmitAttendance}
            color="primary"
            sx={{
              bgcolor: theme.palette.primary.main,
              "&:hover": {
                bgcolor: theme.palette.primary.dark,
              },
              fontSize: {
                xs: "0.6rem",
                sm: "0.875rem",
              },
              ...buttonClickEffect,
            }}
            disabled={checkedStudents.length === 0}
          >
            descargar
          </Button>
        </Box>
      </DialogActions>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={errorMessage ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {errorMessage || successMessage}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}

export default AttendanceModal;
