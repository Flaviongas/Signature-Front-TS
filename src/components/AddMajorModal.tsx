import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import { useContext } from "react";
import MajorContext from "../contexts/MajorContext";
import axios from "axios";
import { useForm } from "react-hook-form";
import { majorForm, majorSchema } from "../schemas/major";
import { zodResolver } from "@hookform/resolvers/zod";
import theme from "../theme.ts";
type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddMajorModal({ isOpen, onClose }: Props) {
  const apiToken = localStorage.getItem("Token");

  const { selectedMajor } = useContext(MajorContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<majorForm>({ resolver: zodResolver(majorSchema) });

  const apiUrl = import.meta.env.VITE_API_URL + "/api/subjects/";

  // Envía los datos del formulario a la API para crear una asignatura
  const onSubmit = async (formData: majorForm) => {
    try {
      await axios.post(
        apiUrl,
        {
          name: formData.name.toUpperCase(),
          major: [selectedMajor.id],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${apiToken}`,
          },
        }
      );
    } catch (error: any) {
      console.error(
        "Error al crear asignatura:",
        error.response?.data || error.message
      );
    }

    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Agregar Asignatura
          <IconButton edge="end" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ maxHeight: "20vh" }}>
          {/* Campo para ingresar nombre de la asignatura */}
          <TextField
            {...register("name")}
            label="Ingresar Nombre"
            fullWidth
            variant="outlined"
            margin="dense"
            error={!!errors.name}
            helperText={errors?.name?.message}
          />
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          {/* Botón para enviar el formulario */}
          <Button 
          color="secondary"
          type="submit" variant="contained" sx={{ bgcolor: theme.palette.secondary.main,"&:hover": {
                      backgroundColor: theme.palette.secondary.dark,
                    },}}>
            Crear
          </Button>
          {/* Botón para cerrar el modal */}
          <Button
            color="primary"
            onClick={onClose}
            variant="contained"
            sx={{ bgcolor: theme.palette.primary.main ,
                "&:hover": {
                      backgroundColor: theme.palette.primary.dark,
                    }, }}  
          >
            Cerrar
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

