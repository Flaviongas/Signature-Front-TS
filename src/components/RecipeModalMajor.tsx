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

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

function RecipeModalMajor({ isOpen, onClose }: Props) {
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
    } catch (error) {
      console.error(error);
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
          <Button type="submit" variant="contained" sx={{ bgcolor: "#3454D1" }}>
            Crear
          </Button>
          {/* Botón para cerrar el modal */}
          <Button
            onClick={onClose}
            variant="contained"
            sx={{ bgcolor: "#D1495B" }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default RecipeModalMajor;
