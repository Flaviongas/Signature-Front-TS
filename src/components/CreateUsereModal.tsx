// CreateUserModal.tsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import { useState } from "react";
import axios from "axios";

type Props = {
  open: boolean;
  onClose: () => void;
};

function CreateUserModal({ open, onClose }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleCreate = async () => {
    try {
      await axios.post("http://localhost:8000/isAdmin/", {
        username,
        password,
      });
      onClose();
    } catch (error) {
      console.error("Error al crear el usuario", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Crear nuevo usuario</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Nombre de usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
        />
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button
          variant="contained"
          onClick={handleCreate}
          sx={{
            bgcolor: "#3454D1",
            "&:hover": {
              bgcolor: "#2F4BC0",
            },
          }}
        >
          Crear
        </Button>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            backgroundColor: "#D1495B",
            "&:hover": {
              backgroundColor: "#C43145",
            },
          }}
        >
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateUserModal;
