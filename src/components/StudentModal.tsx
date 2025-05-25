import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  CircularProgress,
  Box,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useContext, useEffect, useState } from "react";
import { Student } from "../types";
import { createStudent, updateStudent} from "../services/studentService";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { studentValidationSchema, studentFormSchema } from "../schemas/student";
import MajorContext from "../contexts/MajorContext";
import axios, { AxiosError } from "axios";

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
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const { selectedMajor } = useContext(MajorContext);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors: formErrors },
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
    // Limpiar errores al abrir/cerrar modal o cambiar estudiante
    setErrors({});
    setGeneralError(null);
  }, [studentToEdit, open, setValue, reset]);

  const handleCreateStudent = async (data: studentFormSchema) => {
    setLoading(true);
    setErrors({});
    setGeneralError(null);
    
    try {
      if (studentToEdit) {
        await updateStudent({
          id: studentToEdit.id,
          first_name: data.first_name,
          second_name: data.second_name,
          last_name: data.last_name,
          second_last_name: data.second_last_name,
          rut: data.rut,
          dv: data.dv,
          major_id: selectedMajor.id
        });
      } else {
        await createStudent({
          first_name: data.first_name,
          second_name: data.second_name,
          last_name: data.last_name,
          second_last_name: data.second_last_name,
          rut: data.rut,
          dv: data.dv,
          major_id: selectedMajor.id
        });
      }

      onStudentCreated();
      handleClose();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError;
        if (axiosError.response?.data && typeof axiosError.response.data === 'object') {
          // Manejo de errores del serializer
          setErrors(axiosError.response.data as Record<string, string[]>);
        } else {
          // Error general de la API
          setGeneralError(axiosError.message || "Error en la comunicación con el servidor");
        }
      } else {
        // Otro tipo de error
        setGeneralError("Ocurrió un error inesperado");
        console.error("Error no manejado:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setErrors({});
    setGeneralError(null);
    onClose();
  };

  // Función para obtener el mensaje de error (combina errores de formulario y backend)
  const getErrorMessage = (fieldName: string) => {
    return (
      (errors[fieldName] && errors[fieldName][0]) || 
      formErrors[fieldName as keyof studentFormSchema]?.message || 
      ''
    );
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
          {generalError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {generalError}
            </Alert>
          )}
          
          {errors.non_field_errors && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.non_field_errors[0]}
            </Alert>
          )}
          
          <TextField
            autoFocus
            margin="dense"
            label="Primer Nombre"
            type="text"
            fullWidth
            {...register("first_name")}
            error={!!formErrors.first_name || !!errors.first_name}
            helperText={getErrorMessage("first_name")}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Segundo Nombre"
            type="text"
            fullWidth
            {...register("second_name")}
            error={!!formErrors.second_name || !!errors.second_name}
            helperText={getErrorMessage("second_name")}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Primer Apellido"
            type="text"
            fullWidth
            {...register("last_name")}
            error={!!formErrors.last_name || !!errors.last_name}
            helperText={getErrorMessage("last_name")}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Segundo Apellido"
            type="text"
            fullWidth
            {...register("second_last_name")}
            error={!!formErrors.second_last_name || !!errors.second_last_name}
            helperText={getErrorMessage("second_last_name")}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="RUT"
            type="text"
            inputProps={{ maxLength: 8 }}
            fullWidth
            {...register("rut")}
            error={!!formErrors.rut || !!errors.rut}
            helperText={getErrorMessage("rut")}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="DV"
            type="text"
            inputProps={{ maxLength: 1 }}
            fullWidth
            {...register("dv")}
            error={!!formErrors.dv || !!errors.dv}
            helperText={getErrorMessage("dv")}
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