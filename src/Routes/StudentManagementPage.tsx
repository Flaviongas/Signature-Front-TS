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
import UploadModal from "../components/UploadModal";
import TemplateButton from "../components/TemplateButton";
import ConfirmModal from "../components/helpers/ConfirmModal";
import buttonClickEffect from "../styles/buttonClickEffect";

const templateData = [
  {
    Rut: "Sin puntos ni DV (Elimina esta fila)",
    Nombre: "AAAA",
    Segundo_Nombre: "BBBB",
    Apellido: "CCCC",
    Segundo_Apellido: "DDDD",
  },
  {
    Rut: "Ejemplo: 12345678",
    Nombre: "Ejemplo: Pedro",
    Segundo_Nombre: "Ejemplo: Pablo",
    Apellido: "Ejemplo: Alvarez",
    Segundo_Apellido: "Ejemplo: Soto",
  },
];

function StudentManagementPage() {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<number | null>(null);
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
    setStudentToDelete(studentId);
    setIsConfirmModalOpen(true);
  };

  const confirmDeleteStudent = async () => {
    if (!studentToDelete) return;

    try {
      const response = await deleteStudent({ student_id: studentToDelete });

      if (response.status !== (200 | 204)) {
        console.error("Error al eliminar el estudiante:", response);
        return;
      }
      setStudents((prevStudents) => {
        const studentIndex = prevStudents.findIndex((s) => s.id === studentToDelete);
        if (studentIndex !== -1) {
          const updatedStudents = [...prevStudents];
          updatedStudents.splice(studentIndex, 1);
          return updatedStudents;
        }
        return prevStudents;
      });
    } catch (error) {
      console.error("Error eliminando el estudiante:", error);
    } finally {
      setStudentToDelete(null);
    }
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setStudentToDelete(null);
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
              ...buttonClickEffect,
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              gap: 2,
              my: 5,
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              sx={{
                ...buttonClickEffect,
              }}
              onClick={() => {
                setEditStudent(null);
                setIsOpen(true);
              }}
            >
              Crear Estudiante
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
              filename={"Plantilla para crear estudiantes"}
              data={templateData}
            />
          </Box>

          <UploadModal
            open={isUserModalOpen}
            onClose={() => setIsUserModalOpen(false)}
            onSomethingCreated={fetchStudents}
            uploadText="estudiantes"
            route="uploadStudentCSV/"
          />
          
          <StudentModal
            open={isOpen}
            onClose={() => setIsOpen(false)}
            onStudentCreated={fetchStudents}
            studentToEdit={editStudent}
          />

          <ConfirmModal
            isOpen={isConfirmModalOpen}
            onClose={closeConfirmModal}
            onConfirm={confirmDeleteStudent}
            title="Eliminar Estudiante"
            message="¿Estás seguro de que deseas eliminar este estudiante? Esta acción no se puede deshacer."
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
