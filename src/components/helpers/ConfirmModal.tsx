import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import theme from "../../theme.ts";
import buttonClickEffect from "../../styles/buttonClickEffect.ts";
import { ReactNode } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string | ReactNode;

};

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmar acción",
  message,
}: Props) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm">
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "secondary.main",
          color: "white",
        }}
      >
        {title}
        <IconButton edge="end" onClick={handleCancel} color="inherit">
          <FontAwesomeIcon icon={faTimes} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ pt: 3 }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {message}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          color="secondary"
          onClick={handleConfirm}
          variant="contained"
          sx={{
            bgcolor: theme.palette.info.main,
            "&:hover": {
              backgroundColor: theme.palette.secondary.dark,
            },
            ...buttonClickEffect,
          }}
        >
          Aceptar
        </Button>
        <Button
          color="primary"
          onClick={handleCancel}
          variant="contained"
          sx={{
            bgcolor: theme.palette.primary.main,
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
            },
            ...buttonClickEffect,
          }}
        >
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
