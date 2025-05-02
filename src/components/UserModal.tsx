import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  Autocomplete,
  Chip,
} from "@mui/material";
import { useState } from "react";
import { createUser, updateUser } from "../services/userService";
import { getMajors } from "../services/majorService";
import { createUserPayload, User } from "../types";
import { useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onUserCreated: () => void;
  userToEdit: User | null;
};

function CreateUserModal({ open, onClose, onUserCreated, userToEdit }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);

  const [availableMajors, setAvailableMajors] = useState<
    { id: number; name: string }[]
  >([]);
  const [selectedMajors, setSelectedMajors] = useState<
    { id: number; name: string }[]
  >([]);

  const editingUser = !!userToEdit;

  useEffect(() => {
    if (open) {
      const fetchMajors = async () => {
        try {
          const response = await getMajors();
          console.log("Majors fetched:", response.data);
          setAvailableMajors(response.data || []);
        } catch (error) {
          console.error("Failed to load majors:", error);
          setAvailableMajors([]);
        }
      };

      fetchMajors();
      if (userToEdit) {
        setUsername(userToEdit.username);

        if (userToEdit.majors) {
          // 👇 IMPORTANTE: setear las majors que ya tiene
          setSelectedMajors(
            userToEdit.majors.map((major) => ({
              id: major.id,
              name: major.name,
            }))
          );
        } else {
          setSelectedMajors([]);
        }
      } else {
        setUsername("");
        setSelectedMajors([]);
      }
      setPassword("");
      setConfirmPassword("");
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }, [open, userToEdit]);

  const validateUsername = (username: string) => {
    return /^[A-Za-z0-9]+$/.test(username);
  };

  const handleCloseModal = () => {
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setErrorMessage(null);
    setSuccessMessage(null);
    setOpenSnackbar(false);
    onClose();
  };

  const handleCreateUser = async () => {
    setErrorMessage(null);
    setLoading(true);

    // Validación del nombre de usuario
    if (!username.trim()) {
      setErrorMessage("El nombre de usuario es obligatorio.");
      setLoading(false);
      return;
    }

    if (!validateUsername(username)) {
      setErrorMessage(
        "El nombre de usuario solo puede contener letras y números."
      );
      setLoading(false);
      return;
    }

    if (!editingUser) {
      // Para crear usuario, la contraseña es obligatoria
      if (!password) {
        setErrorMessage("La contraseña es obligatoria.");
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setErrorMessage("Las contraseñas no coinciden.");
        setLoading(false);
        return;
      }
    } else {
      // Para editar usuario, solo validamos contraseñas si se está cambiando
      if (password || confirmPassword) {
        if (password !== confirmPassword) {
          setErrorMessage("Las contraseñas no coinciden.");
          setLoading(false);
          return;
        }
      }
    }

    try {
      const userPayload: createUserPayload = {
        username,
        major_ids: selectedMajors.map((major) => major.id),
      };

      if (password) {
        userPayload.password = password;
      }

      console.log("Datos que se van a enviar al backend:", userPayload);
      if (editingUser && userToEdit) {
        await updateUser(userToEdit.id, userPayload);
        setSuccessMessage("Usuario editado correctamente.");
      } else {
        await createUser(userPayload);
        setSuccessMessage("Usuario creado correctamente.");
      }

      setOpenSnackbar(true);
      onUserCreated();
      setTimeout(() => {
        handleCloseModal();
      }, 1000);
    } catch (error: any) {
      if (error.response) {
        console.error("Respuesta del backend:", error.response.data);
        if (error.response.data.username) {
          const errorMessage = error.response.data.username[0];
          if (errorMessage === "A user with that username already exists.") {
            setErrorMessage("El nombre de usuario ya está en uso.");
          } else {
            setErrorMessage(errorMessage);
          }
        } else {
          setErrorMessage(
            error.response.data.password?.[0] || error.response.data.majors
          );
          
        }
        setOpenSnackbar(true);
      } else {
        console.error("Error sin respuesta:", error);
        setErrorMessage(
          "Hubo un error al crear el usuario. Intenta nuevamente."
        );
        setOpenSnackbar(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleCloseModal}>
      <DialogTitle>
        {editingUser ? "Editar usuario" : "Crear nuevo usuario"}
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Nombre de usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          margin="normal"
          required
          error={!!errorMessage && !validateUsername(username)}
          helperText={
            errorMessage && !username
              ? "El nombre de usuario es obligatorio."
              : errorMessage && !validateUsername(username)
                ? "El nombre de usuario solo puede contener letras y números."
                : ""
          }
        />
        <TextField
          fullWidth
          label={
            editingUser
              ? "Nueva contraseña (dejar en blanco para mantener)"
              : "Contraseña"
          }
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          required={!editingUser}
          error={!!errorMessage && !editingUser && !password}
          helperText={
            errorMessage && !editingUser && !password
              ? "La contraseña es obligatoria."
              : ""
          }
        />
        <TextField
          fullWidth
          label={
            editingUser ? "Confirmar nueva contraseña" : "Confirmar contraseña"
          }
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          margin="normal"
          required
          error={!!errorMessage && password !== confirmPassword}
          helperText={
            errorMessage && password !== confirmPassword
              ? "Las contraseñas no coinciden."
              : ""
          }
        />
        <Autocomplete
          multiple
          options={availableMajors}
          getOptionLabel={(option) => option.name}
          value={selectedMajors}
          onChange={(_, newValue) => setSelectedMajors(newValue)}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                label={option.name}
                {...getTagProps({ index })}
                variant="outlined"
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Carreras asociadas"
              placeholder="Selecciona una o más"
              margin="normal"
            />
          )}
          fullWidth
        />
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleCreateUser}
          disabled={loading}
          sx={{
            fontWeight:"bold"
          }}
        >
          {editingUser ? "Guardar cambios" : "Crear"}
        </Button>
        <Button
          variant="contained"
          onClick={handleCloseModal}
          color="primary"
          disabled={loading}
          sx={{
              fontWeight:"bold"
          }}
        >
          Cancelar
        </Button>
      </DialogActions>
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
    </Dialog>
  );
}

export default CreateUserModal;
