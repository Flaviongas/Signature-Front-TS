import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  CircularProgress,
  Typography,
  Autocomplete,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { SubjectWithName } from "../services/studentService.ts";
import { useEffect, useState } from "react";

import buttonClickEffect from "../styles/buttonClickEffect.ts";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  majorId: number;
  majorName: string;
  backendAssociatedSubjects: SubjectWithName[];
  currentlyDisplayedSubjectIds: Set<number>;
  // Callback para que SubjectsGrid sepa qué materia añadir a la visualización
  onAddSubjectToDisplay: (subjectId: number) => void;
};

export default function AddMajorModal({
  isOpen,
  onClose,
  backendAssociatedSubjects,
  currentlyDisplayedSubjectIds,
  onAddSubjectToDisplay,
}: Props) {
  const [selectableSubjects, setSelectableSubjects] = useState<
    SubjectWithName[]
  >([]);
  const [selectedSubject, setSelectedSubject] =
    useState<SubjectWithName | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  console.log(backendAssociatedSubjects, "backendAssociatedSubjects");
  // Filtra las materias cada vez que cambian las props
  useEffect(() => {
    if (isOpen) {
      // Filtrar las materias que están asociadas a la carrera (backend)
      // pero que NO están siendo mostradas actualmente en la grilla (frontend)
      const filtered = backendAssociatedSubjects.filter(
        (subject) => !currentlyDisplayedSubjectIds.has(subject.subject_id)
      );
      setSelectableSubjects(filtered);
      setSelectedSubject(null); // Limpiar selección al abrir
      setError(null);
    }
  }, [isOpen, backendAssociatedSubjects, currentlyDisplayedSubjectIds]);

  // Envía los datos del formulario (simplemente llama al callback)
  const handleSubmit = () => {
    if (!selectedSubject) {
      setError("Por favor, seleccione una asignatura.");
      return;
    }

    setLoading(true);
    try {
      onAddSubjectToDisplay(selectedSubject.subject_id); // Llama al callback en el padre
      onClose(); // Cerrar el modal
    } catch (err: any) {
      console.error("Error al añadir asignatura a la visualización:", err);
      setError("Error al añadir la asignatura. Intente de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "secondary.main",
          color: "white",
        }}
      >
        Añadir Asignatura
        <IconButton edge="end" onClick={onClose} color="inherit">
          <FontAwesomeIcon icon={faTimes} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ pt: 3 }}>
        {selectableSubjects.length === 0 && !loading && !error ? (
          <Typography
            variant="body1"
            color="textSecondary"
            align="center"
            sx={{ py: 2 }}
          >
            Todas las asignaturas asociadas a esta carrera ya están mostrándose
            en la grilla.
          </Typography>
        ) : error ? (
          <Typography color="error" align="center">
            {error}
          </Typography>
        ) : (
          <>
            <Autocomplete
              options={selectableSubjects}
              getOptionLabel={(option) => option.name}
              value={selectedSubject}
              onChange={(_, newValue) => setSelectedSubject(newValue)}
              isOptionEqualToValue={(option, value) =>
                option.subject_id === value.subject_id
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Buscar asignatura"
                  variant="outlined"
                  fullWidth
                  error={!!error}
                />
              )}
              noOptionsText="No se encontraron asignaturas disponibles"
              loading={loading}
            />
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button
          color="secondary"
          onClick={handleSubmit}
          variant="contained"
          disabled={
            !selectedSubject || loading || selectableSubjects.length === 0
          }
          sx={{
            ...buttonClickEffect,
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Añadir"}
        </Button>
        <Button
          color="primary"
          onClick={onClose}
          variant="contained"
          sx={{ ...buttonClickEffect }}
        >
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
