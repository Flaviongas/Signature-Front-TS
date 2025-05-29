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
  DialogTitle
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import { Student } from "../types";
import { getSubject } from "../services/subjectService";
import { removeStudentSubject } from "../services/studentService";
import AddStudentToSubjectModal from "../components/AddStudentToSubjectModal.js";

function StudentSubjectManagentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { majorId, subjectId, majorName, subjectName } = location.state || {};
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!subjectId) return;

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
      console.log("Eliminando estudiante con ID:", selectedStudentId, subjectId);
      console.log("Tipos:", typeof selectedStudentId, typeof subjectId);
      await removeStudentSubject({
        student_id: selectedStudentId,
        subject_id: subjectId
      });
      
      // Actualizar el estado después de eliminar el estudiante
      setStudents(prevStudents => 
        prevStudents.filter(student => student.id !== selectedStudentId)
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
    <Box sx={{ p: 4 }}>
      <Button
        variant="contained"
        color="secondary"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 4 }}
      >
        Volver
      </Button>

      <AddStudentToSubjectModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onStudentsAdded={refreshStudents}
        majorId={majorId}
        subjectId={subjectId?.toString()}
        currentStudentIds={students.map(student => student.id)}
      />

      <Typography variant="h4" gutterBottom>
        Gestión de {subjectName}
      </Typography>
      <Typography variant="subtitle1" gutterBottom sx={{ mb: 4 }}>
        Carrera: {majorName}
      </Typography>
      
      {/* Botón para añadir nuevos estudiantes */}
      <Button 
        variant="contained" 
        color="secondary" 
        onClick={handleAddStudent}
        sx={{ mb: 3 }}
      >
        Añadir estudiantes
      </Button>
      
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
      
      {/* Students table */}
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Apellido</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>RUT</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Borrar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Cargando...
                </TableCell>
              </TableRow>
            ) : filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No se encontraron estudiantes
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.first_name}</TableCell>
                  <TableCell>{student.last_name}</TableCell>
                  <TableCell>{student.rut}</TableCell>
                  <TableCell>
                    <Button 
                      variant="contained" 
                      size="small"
                      color="error"
                      onClick={() => handleRemoveStudent(student.id)}
                      sx={{ mr: 1 }}
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
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas quitar a este estudiante de la asignatura {subjectName}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setIsRemoveDialogOpen(false)} 
            disabled={actionLoading}
          >
            Cancelar
          </Button>
          <Button 
            onClick={confirmRemoveStudent} 
            color="error" 
            variant="contained"
            disabled={actionLoading}
          >
            {actionLoading ? "Procesando..." : "Confirmar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default StudentSubjectManagentPage;