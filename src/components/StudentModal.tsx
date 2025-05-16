import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  IconButton,
  CircularProgress,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useContext, useEffect, useState } from "react";
import { Student } from "../types";
// import { createStudent, updateStudent, getStudentsByMajor} from "../services/studentService";
// import useGetData from "../hooks/useGetData";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { studentValidationSchema, studentFormSchema } from "../schemas/student";
import MajorContext from "../contexts/MajorContext";
import axios from "axios";

// import { getStudentsByMajor } from "../services/studentService";

interface StudentModalProps {
  open: boolean;
  onClose: () => void;
  onStudentCreated: () => void;
  studentToEdit: Student | null;
}

function StudentModal({
  open,
  onClose,
  onStudentCreated,
  studentToEdit,
}: StudentModalProps) {
  // const [firstName, setFirstName] = useState("");
  // const [lastName, setLastName] = useState("");
  // const [rut, setRut] = useState("");
  // const [selectedMajor, setSelectedMajor] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authToken = localStorage.getItem("Token");

  const apiUrl = `${import.meta.env.VITE_API_URL}/api/students/`;
  // const { data: majors } = useGetData(majorUrl);
  const { selectedMajor } = useContext(MajorContext);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<studentFormSchema>({
    resolver: zodResolver(studentValidationSchema),
  });

  useEffect(() => {
    if (studentToEdit) {
      setValue("rut", studentToEdit.rut);
      setValue("dv", studentToEdit.dv);
      setValue("first_name", studentToEdit.first_name);
      setValue("second_name", studentToEdit.second_name);
      setValue("last_name", studentToEdit.last_name);
      setValue("second_last_name", studentToEdit.second_last_name);
    } else {
      reset();
    }
  }, [studentToEdit, open, setValue, reset]);

  setError(null); // Borrar el error al abrir el modal

  const handleCreateStudent = async (data: studentFormSchema) => {
    setLoading(true)
    try {
      const payload = {
        ...data,
        subjects: [], 
        major: selectedMajor.id,
      };

      if (studentToEdit) {
        await axios.put(`${apiUrl}${studentToEdit.id}/`, payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${authToken}`,
          },
        });
      } else {
        await axios.post(apiUrl, payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${authToken}`,
          },
        });
      }

      onStudentCreated();
      handleClose();
    } catch (err: unknown) {
      console.error("Error al guardar estudiante:", err);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: 10,
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: "secondary.main",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {studentToEdit ? "Editar Estudiante" : "Crear Nuevo Estudiante"}
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Box 
        component="form"
        onSubmit={handleSubmit(handleCreateStudent)}>
        <DialogContent sx={{ pt: 3 }}>
          {error && (
            <Typography color="error" variant="body2" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Primer Nombre"
            type="text"
            fullWidth
            {...register("first_name")}
            error={!!errors.first_name}
            helperText={errors.first_name?.message}
            sx={{ mb: 2 }}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Segundo Nombre"
            type="text"
            fullWidth
            {...register("second_name")}
            error={!!errors.second_name}
            helperText={errors.second_name?.message}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Primer Apellido"
            type="text"
            fullWidth
            {...register("last_name")}
            error={!!errors.last_name}
            helperText={errors.last_name?.message}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Segundo Apellido"
            type="text"
            fullWidth
            {...register("second_last_name")}
            error={!!errors.second_last_name}
            helperText={errors.second_last_name?.message}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="RUT"
            type="text"
            fullWidth
            {...register("rut")}
            error={!!errors.rut}
            helperText={errors.rut?.message}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="DV"
            type="text"
            fullWidth
            {...register("dv")}
            error={!!errors.dv}
            helperText={errors.dv?.message}
            sx={{ mb: 2 }}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose} variant="outlined" color="secondary">
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : studentToEdit ? (
              "Guardar Cambios"
            ) : (
              "Crear Estudiante"
            )}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default StudentModal;
