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
  Snackbar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useContext, useEffect, useState } from "react";
import { Student } from "../types";
import { createStudent, updateStudent } from "../services/studentService";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { studentValidationSchema, studentFormSchema } from "../schemas/student";
import MajorContext from "../contexts/MajorContext";
import axios, { AxiosError } from "axios";

import buttonClickEffect from "../styles/buttonClickEffect";

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { selectedMajor } = useContext(MajorContext);
  // const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // const [actionLoading, setActionLoading] = useState(false);

  // const handleClose = () => {
  //   if (!actionLoading) {
  //     setIsEditModalOpen(false);
  //   }
  // };

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
    setErrorMessage(null);
    setSuccessMessage(null);
  }, [studentToEdit, open, setValue, reset]);

  const handleCreateStudent = async (data: studentFormSchema) => {
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

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
          major_id: selectedMajor.id,
        });
        setSuccessMessage("Estudiante actualizado correctamente.");
      } else {
        await createStudent({
          first_name: data.first_name,
          second_name: data.second_name,
          last_name: data.last_name,
          second_last_name: data.second_last_name,
          rut: data.rut,
          dv: data.dv,
          major_id: selectedMajor.id,
        });
        setSuccessMessage("Estudiante creado correctamente.");
      }

      setOpenSnackbar(true);
      onStudentCreated();
      setTimeout(() => {
        handleClose();
      }, 1000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError;
        if (
          axiosError.response?.data &&
          typeof axiosError.response.data === "object"
        ) {
          // Manejo de errores del serializer
          const errorData = axiosError.response.data as Record<
            string,
            string[]
          >;

          if (errorData.non_field_errors) {
            setErrorMessage(errorData.non_field_errors[0]);
          } else if (errorData.rut) {
            setErrorMessage(`RUT: ${errorData.rut[0]}`);
          } else if (errorData.dv) {
            setErrorMessage(`DV: ${errorData.dv[0]}`);
          } else if (errorData.first_name) {
            setErrorMessage(`Primer nombre: ${errorData.first_name[0]}`);
          } else if (errorData.last_name) {
            setErrorMessage(`Primer apellido: ${errorData.last_name[0]}`);
          } else {
            // Si hay otros errores que no hemos manejado específicamente
            const firstErrorField = Object.keys(errorData)[0];
            setErrorMessage(
              `${firstErrorField}: ${errorData[firstErrorField][0]}`
            );
          }
        } else {
          // Error general de la API
          setErrorMessage(
            axiosError.message || "Error en la comunicación con el servidor"
          );
        }
      } else {
        // Otro tipo de error
        setErrorMessage("Ocurrió un error inesperado");
        console.error("Error no manejado:", err);
      }
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setErrorMessage(null);
    setSuccessMessage(null);
    setOpenSnackbar(false);
    // if (!actionLoading) {
    //   setIsEditModalOpen(false);
    // }
    onClose();
  };

  // Función para obtener el mensaje de error de validación del formulario
  const getErrorMessage = (fieldName: string) => {
    return formErrors[fieldName as keyof studentFormSchema]?.message || "";
  };

  return (
    <>
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
            fontWeight: "bold",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {studentToEdit ? "Editar Estudiante" : "Crear nuevo estudiante"}
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <Box component="form" onSubmit={handleSubmit(handleCreateStudent)}>
          <DialogContent sx={{ pt: 3 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Primer Nombre"
              type="text"
              fullWidth
              {...register("first_name")}
              error={!!formErrors.first_name}
              helperText={getErrorMessage("first_name")}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Segundo Nombre"
              type="text"
              fullWidth
              {...register("second_name")}
              error={!!formErrors.second_name}
              helperText={getErrorMessage("second_name")}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Primer Apellido"
              type="text"
              fullWidth
              {...register("last_name")}
              error={!!formErrors.last_name}
              helperText={getErrorMessage("last_name")}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Segundo Apellido"
              type="text"
              fullWidth
              {...register("second_last_name")}
              error={!!formErrors.second_last_name}
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
              error={!!formErrors.rut}
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
              error={!!formErrors.dv}
              helperText={getErrorMessage("dv")}
              sx={{ mb: 2 }}
            />
          </DialogContent>

          <DialogActions sx={{ p: 3 }}>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              disabled={loading}
              sx={{ ...buttonClickEffect }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : studentToEdit ? (
                "Guardar Cambios"
              ) : (
                "Crear Estudiante"
              )}
            </Button>
            <Button
              onClick={handleClose}
              variant="outlined"
              color="secondary"
              sx={{ ...buttonClickEffect }}
            >
              Cancelar
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          severity={errorMessage ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {errorMessage || successMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default StudentModal;
