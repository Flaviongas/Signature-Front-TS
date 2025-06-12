import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  CircularProgress,
  Typography,
  Box,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { Student } from "../types";
import {
  getStudentsByMajor,
  assignSubjectToStudent,
} from "../services/studentService";

import buttonClickEffect from "../styles/buttonClickEffect";
interface AddStudentToSubjectModalProps {
  open: boolean;
  onClose: () => void;
  onStudentsAdded: () => void;
  majorId: number;
  subjectId: number;
  currentStudentIds: number[];
}

function AddStudentToSubjectModal({
  open,
  onClose,
  onStudentsAdded,
  majorId,
  subjectId,
  currentStudentIds,
}: AddStudentToSubjectModalProps) {
  const [loading, setLoading] = useState(false);
  const [availableStudents, setAvailableStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open && majorId) {
      setLoading(true);
      getStudentsByMajor({ major_id: majorId })
        .then((response) => {
          // Filtrar estudiantes que no estén ya en la asignatura
          const filteredStudents = response.data.filter(
            (student: Student) => !currentStudentIds.includes(student.id)
          );
          setAvailableStudents(filteredStudents);
        })
        .catch((error) => {
          console.error("Error al cargar estudiantes por carrera:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, majorId, currentStudentIds]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredStudents = searchTerm
    ? availableStudents.filter(
      (student) =>
        student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rut.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : availableStudents;

  const handleToggleStudent = (studentId: number) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSubmit = async () => {
    if (selectedStudents.length === 0) return;

    setSubmitting(true);
    try {
      // Añadir cada estudiante seleccionado a la asignatura
      const promises = selectedStudents.map((studentId) =>
        assignSubjectToStudent({
          student_ids: [studentId],
          subject_id: subjectId,
        })
      );

      await Promise.all(promises);
      onStudentsAdded();
      onClose();
    } catch (error) {
      console.error("Error al añadir estudiantes a la asignatura:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => !submitting && onClose()}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle
        sx={{
          bgcolor: "secondary.main",
          color: "white",
          fontWeight: "bold",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        Añadir Estudiantes
        <IconButton edge="end" color="inherit" aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          margin="normal"
          label="Buscar estudiantes"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {loading ? (
          <Box display="flex" justifyContent="center" my={3}>
            <CircularProgress />
          </Box>
        ) : filteredStudents.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ my: 2 }}
          >
            No hay estudiantes disponibles para añadir
          </Typography>
        ) : (
          <List sx={{ maxHeight: 300, overflow: "auto", mt: 2 }}>
            {filteredStudents.map((student) => (
              <ListItem
                key={student.id}
                dense
                onClick={() => handleToggleStudent(student.id)}
                sx={{ cursor: "pointer" }}
              >
                <Checkbox
                  edge="start"
                  checked={selectedStudents.includes(student.id)}
                  tabIndex={-1}
                  disableRipple
                />
                <ListItemText
                  primary={`${student.first_name} ${student.last_name}`}
                  secondary={`RUT: ${student.rut}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="secondary"
          sx={{
            ...buttonClickEffect,
          }}
          disabled={selectedStudents.length === 0 || submitting}
        >
          {submitting ? "Añadiendo..." : "Añadir seleccionados"}
        </Button>
        <Button
          onClick={onClose}
          color="secondary"
          variant="outlined"
          disabled={submitting}
          sx={{ ...buttonClickEffect }}
        >
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddStudentToSubjectModal;
