import { Box, Typography, Container, Button } from "@mui/material";
import StudentModal from "../components/StudentModal";
import StudentList from "../components/StudentList";
import { useEffect, useState } from "react";
import { Student } from "../types";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { getStudentsByMajor, deleteStudent } from "../services/studentService";
import { useContext } from "react";
import MajorContext from "../contexts/MajorContext";

function StudentManagementPage() {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const { selectedMajor } = useContext(MajorContext);

  const fetchStudents = () => {
    if (!selectedMajor || !selectedMajor.id) {
      setLoading(false);
      setStudents([]);
      return;
    }

    setLoading(true);
    getStudentsByMajor({ major_id: selectedMajor.id })
      .then((res) => {
        setStudents(res.data);
        setLoading(false);
        
      })
      .catch((err) => {
        console.error("Error al obtener estudiantes:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStudents();
  }, [selectedMajor]);

  const handleEditStudent = (student: Student) => {
    setEditStudent(student);
    setIsOpen(true);
  };

  const handleDeleteStudent = async (studentId: number) => {
    try {
      const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este estudiante?");
      if (!confirmDelete) return;

      await deleteStudent({student_id :studentId});
      setStudents((prevStudents) => prevStudents.filter((student) => student.id !== studentId));
    } catch (error) {
      console.error("Error eliminando el estudiante:", error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#EFEFEF",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Container maxWidth="md" sx={{ position: "relative" }}>
        <Box
          sx={{
            position: "absolute",
            top: 24,
            left: 0,
            display: { xs: "none", sm: "block" },
          }}
        >
          <Button
            variant="contained"
            color="secondary"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{
              textTransform: "none",
              ml: 3,
              fontWeight: "bold",
            }}
          >
            Volver
          </Button>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 4,
          }}
        >
          <Typography variant="h4" fontWeight="bold" mb={2} textAlign="center">
            Gestión de Estudiantes
          </Typography>

          <Button
            variant="contained"
            color="secondary"
            sx={{
              my: 5,
              fontWeight: "bold",
            }}
            onClick={() => {
              setEditStudent(null);
              setIsOpen(true);
            }}
          >
            Crear Estudiante
          </Button>

          <StudentModal
            open={isOpen}
            onClose={() => setIsOpen(false)}
            onStudentCreated={fetchStudents}
            studentToEdit={editStudent}
          />

          {loading ? (
            <Typography>Cargando estudiantes...</Typography>
          ) : (
            <StudentList
              students={students}
              onDelete={handleDeleteStudent}
              onEdit={handleEditStudent}
            />
          )}
        </Box>
      </Container>
    </Box>
  );
}

export default StudentManagementPage;