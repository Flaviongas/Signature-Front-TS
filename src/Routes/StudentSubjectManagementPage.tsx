import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Container,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { Student } from "../types";
import { getSubject } from "../services/subjectService";
import { removeStudentSubject } from "../services/studentService";
import AddStudentToSubjectModal from "../components/AddStudentToSubjectModal.js";
import UploadModal from "../components/UploadModal.js";
import TemplateButton from "../components/TemplateButton.js";
import buttonClickEffect from "../styles/buttonClickEffect.js";
import theme from "../theme.js";

const templateData = [
  {
    Rut: "Rut sin puntos ni DV (eliminar esta fila)",
  },
  {
    Rut: "Ejemplo: 12345678",
  },
];

const headerCellStyle = {
  backgroundColor: "secondary.main",
  color: "#fff",
  fontWeight: "bold",
  fontSize: "1rem",
  textAlign: "center",
  textTransform: "uppercase",
};

const bodyCellStyle = {
  fontSize: "1rem",
  textAlign: "center",
  textTransform: "uppercase",
};

const hoverRowStyle = {
  "&:hover": {
    background: "rgba(0,0,0,0.05)",
  },
};

function StudentSubjectManagentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const { majorId, subjectId, subjectName } = location.state || {};
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    null
  );
  const [actionLoading, setActionLoading] = useState(false);

  const getStudents = () => {
    getSubject(subjectId)
      .then((response) => {
        const data = response.data;
        setStudents(data.students);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!subjectId) return;
    getStudents();
  }, [subjectId]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredStudents(students);
    } else {
      const lowercaseSearch = searchTerm.toLowerCase();
      const filtered = students.filter(
        (student) =>
          student.first_name.toLowerCase().includes(lowercaseSearch) ||
          student.last_name?.toLowerCase().includes(lowercaseSearch) ||
          student.rut?.toLowerCase().includes(lowercaseSearch)
      );
      setFilteredStudents(filtered);
    }
  }, [searchTerm, students]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Nueva función para eliminar estudiante de la asignatura
  const handleRemoveStudent = (studentId: number) => {
    setSelectedStudentId(studentId);
    setIsRemoveDialogOpen(true);
  };

  // Función para confirmar la eliminación
  const confirmRemoveStudent = async () => {
    if (!selectedStudentId || !subjectId) return;

    setActionLoading(true);
    try {
      await removeStudentSubject({
        student_ids: [selectedStudentId],
        subject_id: subjectId,
      });

      // Actualizar el estado después de eliminar el estudiante
      setStudents((prevStudents) =>
        prevStudents.filter((student) => student.id !== selectedStudentId)
      );

      setIsRemoveDialogOpen(false);
      setSelectedStudentId(null);
    } catch (error) {
      console.error("Error al eliminar estudiante de la asignatura:", error);
    } finally {
      setActionLoading(false);
    }
  };

  // Función para añadir un estudiante a la asignatura (para implementación futura)
  const handleAddStudent = () => {
    setIsAddModalOpen(true);
  };
  const refreshStudents = () => {
    if (!subjectId) return;

    setLoading(true);
    getSubject(subjectId)
      .then((response) => {
        const data = response.data;
        setStudents(data.students);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
        setLoading(false);
      });
  };

  return (
    <Container sx={{ p: 4 }}>
      <Button
        variant="contained"
        color="secondary"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 4, ...buttonClickEffect }}
      >
        Volver
      </Button>

      <AddStudentToSubjectModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onStudentsAdded={refreshStudents}
        majorId={majorId}
        subjectId={subjectId?.toString()}
        currentStudentIds={students.map((student) => student.id)}
      />

      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontWeight: "bold" }}
      >
        Gestión de {subjectName}
      </Typography>

      {/* Botón para añadir nuevos estudiantes */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, my: 2 }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleAddStudent}
          sx={{
            ...buttonClickEffect,
          }}
        >
          Añadir estudiantes
        </Button>
        <Button
          variant="contained"
          color="info"
          sx={{
            ...buttonClickEffect,
          }}
          onClick={() => {
            setIsUserModalOpen(true);
          }}
        >
          Subir CSV
        </Button>
        <TemplateButton
          filename={"Plantilla para asignar estudiantes a asignaturas"}
          data={templateData}
        />
      </Box>

      <UploadModal
        open={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onSomethingCreated={getStudents}
        uploadText="alumnos"
        route="uploadStudentSubjectCSV/"
        subjectId={subjectId}
      />
      {/* Search bar */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Buscar por nombre, apellido o RUT"
        value={searchTerm}
        onChange={handleSearchChange}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <TableContainer
        component={Paper}
        sx={{
          boxShadow: 2,
          borderRadius: 2,
          height: "70vh",
          overflowY: "auto",
          overflowX: "auto",
          "&::-webkit-scrollbar": {
            width: "5px",
            height: "5px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f1f1f1",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: theme.palette.secondary.main,
            borderRadius: "10px",
          },
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={headerCellStyle}>Nombre</TableCell>
              <TableCell sx={headerCellStyle}>Apellido</TableCell>
              <TableCell sx={headerCellStyle}>RUT</TableCell>
              <TableCell sx={headerCellStyle}>Quitar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={bodyCellStyle}>
                  Cargando...
                </TableCell>
              </TableRow>
            ) : filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={bodyCellStyle}>
                  No se encontraron estudiantes
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents.map((student) => (
                <TableRow key={student.id} sx={hoverRowStyle}>
                  <TableCell sx={bodyCellStyle}>
                    {" "}
                    {student.first_name}
                  </TableCell>
                  <TableCell sx={bodyCellStyle}>{student.last_name}</TableCell>
                  <TableCell sx={bodyCellStyle}>{student.rut}</TableCell>
                  <TableCell sx={bodyCellStyle}>
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      onClick={() => handleRemoveStudent(student.id)}
                      sx={{ ...buttonClickEffect, px: 2 }}
                    >
                      Quitar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {!loading && (
        <Typography variant="body2" sx={{ mt: 2 }}>
          Total de estudiantes: {filteredStudents.length}
        </Typography>
      )}

      {/* Diálogo de confirmación para eliminar estudiante */}
      <Dialog
        open={isRemoveDialogOpen}
        onClose={() => !actionLoading && setIsRemoveDialogOpen(false)}
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
          Confirmar eliminación
          <IconButton edge="end" color="inherit" aria-label="close">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas quitar a este estudiante de la
            asignatura {subjectName}?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            color="secondary"
            variant="outlined"
            onClick={() => setIsRemoveDialogOpen(false)}
            disabled={actionLoading}
            sx={{ ...buttonClickEffect }}
          >
            Cancelar
          </Button>
          <Button
            onClick={confirmRemoveStudent}
            color="primary"
            variant="contained"
            disabled={actionLoading}
            sx={{ ...buttonClickEffect }}
          >
            {actionLoading ? "Procesando..." : "Confirmar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default StudentSubjectManagentPage;
